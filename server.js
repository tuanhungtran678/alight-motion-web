const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4173;
const DB_FILE = path.join(__dirname, 'cloud-projects.json');

function readDb() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function send(res, status, data, type = 'application/json') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  });
  res.end(type === 'application/json' ? JSON.stringify(data) : data);
}

function staticFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const m = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml'
  }[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) send(res, 404, 'Not found', 'text/plain');
    else send(res, 200, data, m);
  });
}

http.createServer((req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});

  if (req.url === '/api/projects' && req.method === 'GET') {
    const db = readDb();
    return send(res, 200, db);
  }

  if (req.url && req.url.startsWith('/api/projects/') && req.method === 'GET') {
    const id = decodeURIComponent(req.url.replace('/api/projects/', ''));
    const item = readDb().find((x) => x.id === id);
    return send(res, item ? 200 : 404, item || { error: 'Not found' });
  }

  if (req.url === '/api/projects' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const db = readDb();
        const item = {
          id: `pub_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
          title: payload.project?.name || 'Untitled',
          author: payload.author || 'anonymous',
          provider: payload.provider || 'unknown',
          publishedAt: Date.now(),
          project: payload.project || null
        };
        db.unshift(item);
        writeDb(db.slice(0, 300));
        send(res, 201, item);
      } catch {
        send(res, 400, { error: 'Bad payload' });
      }
    });
    return;
  }

  let urlPath = req.url === '/' ? '/index.html' : req.url;
  urlPath = urlPath.split('?')[0];
  const filePath = path.join(__dirname, urlPath);
  if (!filePath.startsWith(__dirname)) return send(res, 403, 'Forbidden', 'text/plain');
  staticFile(filePath, res);
}).listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
