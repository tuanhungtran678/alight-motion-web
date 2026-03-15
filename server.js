const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const PORT = process.env.PORT || 4173;
const DB_FILE = path.join(__dirname, 'cloud-projects.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const sessions = new Map();
const otps = new Map();

function readJson(file, fallback = []) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJson(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

function smtpConfig() {
  const provider = String(process.env.SMTP_PROVIDER || '').toLowerCase();
  const host = process.env.SMTP_HOST || (provider === 'gmail' ? 'smtp.gmail.com' : provider === 'outlook' ? 'smtp.office365.com' : '');
  const port = Number(process.env.SMTP_PORT || (provider === 'gmail' ? 465 : provider === 'outlook' ? 587 : 0));
  return {
    host,
    port,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
    secure: String(process.env.SMTP_SECURE || (port === 465 ? 'true' : 'false')).toLowerCase() === 'true'
  };
}


function send(res, status, data, type = 'application/json') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  });
  res.end(type === 'application/json' ? JSON.stringify(data) : data);
}

function staticFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const m = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' }[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => { if (err) send(res, 404, 'Not found', 'text/plain'); else send(res, 200, data, m); });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); } catch (e) { reject(e); }
    });
  });
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

function verifyPassword(password, salt, expectedHash) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
}

function getUserFromReq(req) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const uid = sessions.get(token);
  if (!uid) return null;
  const users = readJson(USERS_FILE, []);
  return users.find((u) => u.id === uid) || null;
}


function sendOtpEmail(email, code) {
  const subject = 'Alight Motion Web Lite verification code';
  const body = `Your verification code is: ${code}

If it's not you, please change the password immediately.`;

  const cfg = smtpConfig();
  if (cfg.host && cfg.port && cfg.user && cfg.pass && cfg.from) {
    const payload = `From: ${cfg.from}
To: ${email}
Subject: ${subject}

${body}
`;
    const url = `${cfg.secure ? 'smtps' : 'smtp'}://${cfg.host}:${cfg.port}`;
    const args = ['--silent', '--show-error', '--url', url, '--mail-from', cfg.from, '--mail-rcpt', email, '--user', `${cfg.user}:${cfg.pass}`, '--upload-file', '-'];
    if (!cfg.secure) args.unshift('--ssl-reqd');
    const r = spawnSync('curl', args, { input: payload, encoding: 'utf8' });
    if (r.status === 0) return { delivered: true, reason: 'smtp' };
    console.error('[SMTP ERROR]', r.stderr || r.stdout || 'unknown');
    return { delivered: false, reason: 'smtp_failed' };
  }

  const sendmail = '/usr/sbin/sendmail';
  try {
    const mail = `To: ${email}
Subject: ${subject}

${body}
`;
    const r = spawnSync(sendmail, ['-t', '-oi'], { input: mail });
    if (r.status === 0) return { delivered: true, reason: 'sendmail' };
  } catch {}
  console.log(`[OTP FALLBACK] ${email} => ${code}`);
  return { delivered: false, reason: 'no_mail_transport' };
}

http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.url === '/api/auth/precheck' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const users = readJson(USERS_FILE, []);
      return send(res, 200, { exists: users.some((u) => u.email === email) });
    } catch { return send(res, 400, { error: 'Bad payload' }); }
  }

  if (req.url === '/api/auth/send-otp' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const users = readJson(USERS_FILE, []);
      const user = users.find((u) => u.email === email);
      if (!user) return send(res, 404, { error: 'Email not exist!' });
      const code = String(Math.floor(100000 + Math.random() * 900000));
      otps.set(email, { code, exp: Date.now() + 10 * 60 * 1000, uid: user.id });
      const delivery = sendOtpEmail(email, code);
      const response = {
        ok: true,
        delivered: Boolean(delivery.delivered),
        reason: delivery.reason,
        message: `We'll send an email to ${email}, please check your inbox. If not have, check the spam folder.`
      };
      return send(res, 200, response);
    } catch { return send(res, 400, { error: 'Bad payload' }); }
  }

  if (req.url === '/api/auth/verify-otp' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const code = String(body.code || '').trim();
      const otp = otps.get(email);
      if (!otp || otp.exp < Date.now()) return send(res, 400, { error: 'OTP expired' });
      if (otp.code != code) return send(res, 401, { error: 'Invalid OTP' });
      const users = readJson(USERS_FILE, []);
      const user = users.find((u) => u.id === otp.uid);
      if (!user) return send(res, 404, { error: 'Email not exist!' });
      const token = crypto.randomBytes(24).toString('hex');
      sessions.set(token, user.id);
      otps.delete(email);
      return send(res, 200, { token, user: { id: user.id, email: user.email, name: user.name, provider: user.provider } });
    } catch { return send(res, 400, { error: 'Bad payload' }); }
  }

  if (req.url === '/api/auth/signup' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const name = String(body.name || '').trim() || email.split('@')[0] || 'user';
      if (!email || !password || password.length < 6) return send(res, 400, { error: 'Invalid email/password' });
      const users = readJson(USERS_FILE, []);
      if (users.some((u) => u.email === email)) return send(res, 409, { error: 'Email exists' });
      const { hash, salt } = hashPassword(password);
      const user = { id: `u_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`, email, name, hash, salt, provider: 'email' };
      users.push(user);
      writeJson(USERS_FILE, users);
      const token = crypto.randomBytes(24).toString('hex');
      sessions.set(token, user.id);
      return send(res, 201, { token, user: { id: user.id, email: user.email, name: user.name, provider: user.provider } });
    } catch { return send(res, 400, { error: 'Bad payload' }); }
  }

  if (req.url === '/api/auth/signin' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const users = readJson(USERS_FILE, []);
      const user = users.find((u) => u.email === email);
      if (!user || !verifyPassword(password, user.salt, user.hash)) return send(res, 401, { error: 'Invalid credentials' });
      const token = crypto.randomBytes(24).toString('hex');
      sessions.set(token, user.id);
      return send(res, 200, { token, user: { id: user.id, email: user.email, name: user.name, provider: user.provider } });
    } catch { return send(res, 400, { error: 'Bad payload' }); }
  }

  if (req.url === '/api/auth/me' && req.method === 'GET') {
    const user = getUserFromReq(req);
    if (!user) return send(res, 401, { error: 'Unauthorized' });
    return send(res, 200, { id: user.id, email: user.email, name: user.name, provider: user.provider });
  }

  if (req.url === '/api/projects' && req.method === 'GET') {
    const user = getUserFromReq(req);
    const db = readJson(DB_FILE, []);
    const list = db.filter((p) => p.shared || (user && p.ownerId === user.id)).map((p) => ({ ...p, isOwner: Boolean(user && p.ownerId === user.id) }));
    return send(res, 200, list);
  }

  if (req.url && req.url.startsWith('/api/projects/') && req.method === 'GET') {
    const user = getUserFromReq(req);
    const id = decodeURIComponent(req.url.replace('/api/projects/', ''));
    const item = readJson(DB_FILE, []).find((x) => x.id === id);
    if (!item) return send(res, 404, { error: 'Not found' });
    if (!item.shared && (!user || user.id !== item.ownerId)) return send(res, 403, { error: 'Forbidden' });
    return send(res, 200, { ...item, isOwner: Boolean(user && item.ownerId === user.id) });
  }

  if (req.url === '/api/projects' && req.method === 'POST') {
    const user = getUserFromReq(req);
    if (!user) return send(res, 401, { error: 'Unauthorized' });
    try {
      const payload = await parseBody(req);
      const db = readJson(DB_FILE, []);
      const item = {
        id: `pub_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
        title: payload.project?.name || 'Untitled',
        author: user.name,
        provider: user.provider,
        ownerId: user.id,
        ownerEmail: user.email,
        publishedAt: Date.now(),
        shared: true,
        project: payload.project || null
      };
      db.unshift(item);
      writeJson(DB_FILE, db.slice(0, 500));
      return send(res, 201, item);
    } catch { return send(res, 400, { error: 'Bad payload' }); }
  }

  if (req.url && req.url.startsWith('/api/projects/') && req.url.endsWith('/share') && req.method === 'DELETE') {
    const user = getUserFromReq(req);
    if (!user) return send(res, 401, { error: 'Unauthorized' });
    const id = decodeURIComponent(req.url.replace('/api/projects/', '').replace('/share', ''));
    const db = readJson(DB_FILE, []);
    const idx = db.findIndex((x) => x.id === id);
    if (idx < 0) return send(res, 404, { error: 'Not found' });
    if (db[idx].ownerId !== user.id) return send(res, 403, { error: 'Forbidden' });
    db[idx].shared = false;
    writeJson(DB_FILE, db);
    return send(res, 200, { ok: true });
  }

  let urlPath = req.url === '/' ? '/index.html' : req.url;
  urlPath = urlPath.split('?')[0];
  const filePath = path.join(__dirname, urlPath);
  if (!filePath.startsWith(__dirname)) return send(res, 403, 'Forbidden', 'text/plain');
  staticFile(filePath, res);
}).listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
