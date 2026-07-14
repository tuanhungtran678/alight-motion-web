function getEl(id) { return document.getElementById(id); }
function clamp(v, mi, ma) { return Math.min(ma, Math.max(mi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function uid() { return crypto.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function bezier(t, p0, p1, p2, p3) { const nt = 1 - t; return nt ** 3 * p0 + 3 * nt ** 2 * t * p1 + 3 * nt * t ** 2 * p2 + t ** 3 * p3; }
function cubicBezierAt(t, p1, p2) { return 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3; }
function cubicBezierSlope(t, p1, p2) { return 3 * (1 - t) ** 2 * p1 + 6 * (1 - t) * t * (p2 - p1) + 3 * t ** 2 * (1 - p2); }
function cubicBezierEase(x, p1x, p1y, p2x, p2y) {
  let t = x;
  for (let i = 0; i < 7; i += 1) {
    const xEst = cubicBezierAt(t, p1x, p2x) - x;
    const slope = cubicBezierSlope(t, p1x, p2x);
    if (Math.abs(xEst) < 1e-4 || Math.abs(slope) < 1e-5) break;
    t -= xEst / slope;
    t = clamp(t, 0, 1);
  }
  return cubicBezierAt(t, p1y, p2y);
}

const STORAGE_KEY = 'alightProjectsV3';
const SESSION_KEY = 'alightSessionV1';
const LOCAL_CLOUD_KEY = 'alightCloudLocalV1';
const AUTH_TOKEN_KEY = 'alightAuthTokenV1';
const LOCAL_AUTH_USERS_KEY = 'alightLocalAuthUsersV1';
const LOCAL_AUTH_OTP_KEY = 'alightLocalAuthOtpV1';
const CLOUD_API_BASE_KEY = 'alightCloudApiBaseV1';
const AUTH_PROVIDER_KEY = 'alightAuthProviderV1';
const PROFILE_STATS_KEY = 'alightProfileStatsV1';
function detectRenderCloudBase() {
  return window.location.hostname.endsWith('.onrender.com') ? window.location.origin : '';
}
const DEFAULT_CLOUD_API_BASE = localStorage.getItem(CLOUD_API_BASE_KEY) || detectRenderCloudBase();
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyC4O0GWiUaQM7Bu-FQGaYU64ix6Zv0EZGk',
  authDomain: 'alight-motion-web.firebaseapp.com',
  projectId: 'alight-motion-web',
  storageBucket: 'alight-motion-web.firebasestorage.app',
  messagingSenderId: '379916623638',
  appId: '1:379916623638:web:c357ebe47320e81f4c7a37',
  measurementId: 'G-6D7H3EVV3M'
};
const ui = {
  home: getEl('homeScreen'), editor: getEl('editorScreen'), createProjectBtn: getEl('createProjectBtn'), projectList: getEl('projectList'), cloudList: getEl('cloudList'), refreshCloudBtn: getEl('refreshCloudBtn'), authStatus: getEl('authStatus'), authMiniStatus: getEl('authMiniStatus'), loginGoogleBtn: getEl('loginGoogleBtn'), loginGithubBtn: getEl('loginGithubBtn'), logoutBtn: getEl('logoutBtn'), openAuthBtn: getEl('openAuthBtn'), authModal: getEl('authModal'), closeAuthModalBtn: getEl('closeAuthModalBtn'), authEmail: getEl('authEmail'), authPassword: getEl('authPassword'), authName: getEl('authName'), authNameRow: getEl('authNameRow'), authModalTitle: getEl('authModalTitle'), authSignInBtn: getEl('authSignInBtn'), authToggleModeBtn: getEl('authToggleModeBtn'), authToggleHint: getEl('authToggleHint'), guestModal: getEl('guestModal'), closeGuestModalBtn: getEl('closeGuestModalBtn'), guestSignInBtn: getEl('guestSignInBtn'), guestSignUpBtn: getEl('guestSignUpBtn'), guestNeedSignInText: getEl('guestNeedSignInText'), otpModal: getEl('otpModal'), closeOtpModalBtn: getEl('closeOtpModalBtn'), otpInfoText: getEl('otpInfoText'), otpCode: getEl('otpCode'), verifyOtpBtn: getEl('verifyOtpBtn'), languageSelect: getEl('languageSelect'), projectSearch: getEl('projectSearch'), cloudSearch: getEl('cloudSearch'), cloudApiBase: getEl('cloudApiBase'), cloudApiHint: getEl('cloudApiHint'), xmlImportInput: getEl('xmlImportInput'), xmlImportBtn: getEl('xmlImportBtn'),
  navHomeBtn: getEl('navHomeBtn'), navProjectsBtn: getEl('navProjectsBtn'), navCloudBtn: getEl('navCloudBtn'), navPurchaseHistoryBtn: getEl('navPurchaseHistoryBtn'), profileIconBtn: getEl('profileIconBtn'), profileDropdown: getEl('profileDropdown'), yourProfileBtn: getEl('yourProfileBtn'), studioBtn: getEl('studioBtn'), profileSettingsBtn: getEl('profileSettingsBtn'),
  projectTitle: getEl('projectTitle'), projectMeta: getEl('projectMeta'), backHomeBtn: getEl('backHomeBtn'), themeToggleBtn: getEl('themeToggleBtn'),
  settingsMenu: getEl('settingsMenu'), openMenuBtn: getEl('openMenuBtn'), closeMenuBtn: getEl('closeMenuBtn'),
  menuProjectName: getEl('menuProjectName'), menuRatio: getEl('menuRatio'), menuFps: getEl('menuFps'), menuResolution: getEl('menuResolution'), menuBgColor: getEl('menuBgColor'), menuShowGrid: getEl('menuShowGrid'), menuExportQuality: getEl('menuExportQuality'), saveMenuBtn: getEl('saveMenuBtn'),
  modal: getEl('createProjectModal'), closeModalBtn: getEl('closeModalBtn'), ratioRow: getEl('ratioRow'), modalFps: getEl('modalFps'), modalResolution: getEl('modalResolution'), modalProjectName: getEl('modalProjectName'), modalBgColor: getEl('modalBgColor'), modalBgHex: getEl('modalBgHex'), confirmCreateBtn: getEl('confirmCreateBtn'),
  preview: getEl('preview'), playBtn: getEl('playBtn'), pauseBtn: getEl('pauseBtn'), resetBtn: getEl('resetBtn'), undoBtn: getEl('undoBtn'), redoBtn: getEl('redoBtn'), exportVideoBtn: getEl('exportVideoBtn'), publishProjectBtn: getEl('publishProjectBtn'), scrubber: getEl('scrubber'), timeLabel: getEl('timeLabel'),
  zoomToggleBtn: getEl('zoomToggleBtn'), addRect: getEl('addRect'), addCircle: getEl('addCircle'), addText: getEl('addText'), imageInput: getEl('imageInput'), addImageBtn: getEl('addImageBtn'), deleteLayer: getEl('deleteLayer'), layerSelect: getEl('layerSelect'), layerName: getEl('layerName'), layerColor: getEl('layerColor'), layerEffectType: getEl('layerEffectType'), layerEffectStrength: getEl('layerEffectStrength'), checkerColorA: getEl('checkerColorA'), checkerColorB: getEl('checkerColorB'), checkerGrid: getEl('checkerGrid'), checkerGridValue: getEl('checkerGridValue'), copyBackgroundMode: getEl('copyBackgroundMode'), copyBackgroundStrength: getEl('copyBackgroundStrength'), effectReveal: getEl('effectReveal'), effectWipeAngle: getEl('effectWipeAngle'), effectHue: getEl('effectHue'), effectSaturation: getEl('effectSaturation'), effectBrightness: getEl('effectBrightness'), effect3DAngle: getEl('effect3DAngle'), effect3DDepth: getEl('effect3DDepth'), effectRasterX: getEl('effectRasterX'), effectRasterY: getEl('effectRasterY'), effectRasterZ: getEl('effectRasterZ'), textContent: getEl('textContent'), textSize: getEl('textSize'), textFontFamily: getEl('textFontFamily'), textWeight: getEl('textWeight'), textStyle: getEl('textStyle'), textAlign: getEl('textAlign'), textLayerControls: getEl('textLayerControls'), glowColor: getEl('glowColor'), glowHardness: getEl('glowHardness'), glowAlpha: getEl('glowAlpha'), movementUnavailable: getEl('movementUnavailable'), rotateUnavailable: getEl('rotateUnavailable'), groupLayerBtn: getEl('groupLayerBtn'), ungroupLayerBtn: getEl('ungroupLayerBtn'),
  timelineDuration: getEl('timelineDuration'), frameTarget: getEl('frameTarget'), frameTime: getEl('frameTime'), timelineTracks: getEl('timelineTracks'), frameActionBtn: getEl('frameActionBtn'), prevFrameBtn: getEl('prevFrameBtn'), nextFrameBtn: getEl('nextFrameBtn'), markPartBtn: getEl('markPartBtn'), keyframeInfo: getEl('keyframeInfo'), markInfo: getEl('markInfo'),
  startX: getEl('startX'), startY: getEl('startY'), startScale: getEl('startScale'), startRotation: getEl('startRotation'), startOpacity: getEl('startOpacity'), scaleKeyBtn: getEl('scaleKeyBtn'), opacityKeyBtn: getEl('opacityKeyBtn'), movePad: getEl('movePad'), moveHandle: getEl('moveHandle'), moveXDisplay: getEl('moveXDisplay'), moveYDisplay: getEl('moveYDisplay'), rotateDial: getEl('rotateDial'), rotateKnob: getEl('rotateKnob'), rotateValue: getEl('rotateValue'), rotateTurns: getEl('rotateTurns'),
  easeTarget: getEl('easeTarget'), easing: getEl('easing'), applyBtn: getEl('applyBtn'), easeGraph: getEl('easeGraph'), scaleQuickInput: getEl('scaleQuickInput'), scaleUpBtn: getEl('scaleUpBtn'), scaleDownBtn: getEl('scaleDownBtn'), frameActionMiniBtn: getEl('frameActionMiniBtn'), easeGraphModeBtn: getEl('easeGraphModeBtn'), opacitySlider: getEl('opacitySlider'), opacityPercent: getEl('opacityPercent'),
  camX: getEl('camX'), camY: getEl('camY'), camZoom: getEl('camZoom'), camRotation: getEl('camRotation'), applyCameraBtn: getEl('applyCameraBtn'), addCameraBtn: getEl('addCameraBtn'), cameraMissingNote: getEl('cameraMissingNote'),
  audioInput: getEl('audioInput'), addAudioBtn: getEl('addAudioBtn'), removeAudioBtn: getEl('removeAudioBtn'), audioVolume: getEl('audioVolume'), audioOffset: getEl('audioOffset'), audioInfo: getEl('audioInfo'),
  exportOverlay: getEl('exportOverlay'), exportProgressBar: getEl('exportProgressBar'), exportProgressText: getEl('exportProgressText'), exportCancelBtn: getEl('exportCancelBtn'), exportMenuModal: getEl('exportMenuModal'), closeExportMenuBtn: getEl('closeExportMenuBtn'), exportEstimatedSize: getEl('exportEstimatedSize'), exportVideoResolution: getEl('exportVideoResolution'), exportVideoFps: getEl('exportVideoFps'), exportGifSize: getEl('exportGifSize'), exportGifFps: getEl('exportGifFps'), exportSequenceSize: getEl('exportSequenceSize'), exportSequenceFps: getEl('exportSequenceFps'), startVideoExportBtn: getEl('startVideoExportBtn'), startGifExportBtn: getEl('startGifExportBtn'), startSequenceExportBtn: getEl('startSequenceExportBtn'), projectPackageUrl: getEl('projectPackageUrl'), copyPackageUrlBtn: getEl('copyPackageUrlBtn'), downloadXmlBtn: getEl('downloadXmlBtn'),
  hotAlertModal: getEl('hotAlertModal'), hotAlertCloseBtn: getEl('hotAlertCloseBtn'), hotAlertTempText: getEl('hotAlertTempText'),
  cameraPaywallModal: getEl('cameraPaywallModal'), closeCameraPaywallBtn: getEl('closeCameraPaywallBtn'), buyProBtn: getEl('buyProBtn'), watchAdBtn: getEl('watchAdBtn'),
  headerProBadge: getEl('headerProBadge'), proSuccessModal: getEl('proSuccessModal'), closeProSuccessBtn: getEl('closeProSuccessBtn'),
  purchaseHistoryModal: getEl('purchaseHistoryModal'), closePurchaseHistoryBtn: getEl('closePurchaseHistoryBtn'), unsubscribeBtn: getEl('unsubscribeBtn'),
  publishModal: getEl('publishModal'), closePublishModalBtn: getEl('closePublishModalBtn'), publishTitle: getEl('publishTitle'), publishDescription: getEl('publishDescription'), confirmPublishBtn: getEl('confirmPublishBtn'),
  cloudViewerModal: getEl('cloudViewerModal'), closeCloudViewerBtn: getEl('closeCloudViewerBtn'), cloudViewerTitle: getEl('cloudViewerTitle'), cloudViewerAuthor: getEl('cloudViewerAuthor'), cloudViewerDesc: getEl('cloudViewerDesc'), cloudViewerFilters: getEl('cloudViewerFilters'), cloudPlayPauseBtn: getEl('cloudPlayPauseBtn'), cloudDuration: getEl('cloudDuration'), cloudSpeed: getEl('cloudSpeed'), cloudLikeBtn: getEl('cloudLikeBtn'), cloudDislikeBtn: getEl('cloudDislikeBtn'), cloudViewerViews: getEl('cloudViewerViews'), cloudDetailsBtn: getEl('cloudDetailsBtn'), cloudDetailsBox: getEl('cloudDetailsBox'),
  profileModal: getEl('profileModal'), closeProfileModalBtn: getEl('closeProfileModalBtn'), profileName: getEl('profileName'), profileFollowers: getEl('profileFollowers'), followDemoBtn: getEl('followDemoBtn'), studioModal: getEl('studioModal'), closeStudioModalBtn: getEl('closeStudioModalBtn'), studioFollowerCount: getEl('studioFollowerCount'), studioFollowingCount: getEl('studioFollowingCount'), studioViewCount: getEl('studioViewCount'), studioCloudCount: getEl('studioCloudCount'), socketStatus: getEl('socketStatus')
};
const ctx = ui.preview.getContext('2d');
const gctx = ui.easeGraph.getContext('2d');

const state = { projects: [], currentProjectId: null, time: 0, playing: false, startRef: 0, drag: null, easeDrag: null, keyDrag: null, theme: localStorage.getItem('uiTheme') || 'dark', previewZoomEnabled: false, previewScale: 1, selectedLayerIds: [], history: [], future: [], rightDeleteLog: {}, session: null, authToken: localStorage.getItem(AUTH_TOKEN_KEY) || '', language: localStorage.getItem('uiLang') || 'vi', authMode: 'signin', otpEmail: '', cloudApiBase: DEFAULT_CLOUD_API_BASE, modalRatio: '9:16', isExporting: false, exportSession: null, hotAlertDismissed: false, selectedTimelineKey: null, rotationDrag: null, activeKeyScope: 'position', isPro: localStorage.getItem('alightProDemoV1') === '1', profileStats: JSON.parse(localStorage.getItem(PROFILE_STATS_KEY) || '{"followers":0,"following":0,"views":0}'), activeCloudItem: null, cloudPlayerTimer: null, cloudPlayerTime: 0 };
const audioPlayer = new Audio();
audioPlayer.preload = 'auto';
const audioPlayers = [];

function apiUrl(path) {
  const base = (state.cloudApiBase || '').trim();
  if (!base) return path;
  return `${base.replace(/\/$/, '')}${path}`;
}
function saveCloudApiBase(v) {
  state.cloudApiBase = (v || '').trim().replace(/\/$/, '');
  if (state.cloudApiBase) localStorage.setItem(CLOUD_API_BASE_KEY, state.cloudApiBase);
  else localStorage.removeItem(CLOUD_API_BASE_KEY);
  updateCloudApiHint();
}

function updateCloudApiHint() {
  if (!ui.cloudApiHint) return;
  ui.cloudApiHint.textContent = state.cloudApiBase
    ? `Render Cloud active: ${state.cloudApiBase}`
    : 'Render Cloud: để trống nếu web và API đang chạy cùng server.';
}


function parseRatio(r) { const [w, h] = r.split(':').map(Number); return { w: w || 9, h: h || 16 }; }
function newKeyframe(time, x = 180, y = 320, scale = 1, rotation = 0, opacity = 1) { return { id: uid(), time, x, y, scale, rotation, opacity }; }
function newLayer(type, extra = {}) { return { id: uid(), name: `Layer ${Date.now().toString().slice(-4)}`, type, color: '#21b8ff', text: 'TEXT', size: 90, fontFamily: 'Inter', fontWeight: '700', fontStyle: 'normal', textAlign: 'center', imageSrc: null, imageObj: null, frameShape: 'rect', groupId: null, effect: { type: 'none', strength: 0.6, glowColor: '#21b8ff', glowHardness: 0.5, glowAlpha: 0.7, reveal: 1, wipeAngle: 0, hue: 0, saturation: 1, brightness: 1, depthAngle: 35, depthSize: 8, rasterX: 35, rasterY: 20, rasterZ: 8, checkerColorA: '#ffffff', checkerColorB: '#21b8ff', checkerGrid: 8, copyBackgroundMode: 'gaussianBlur', copyBackgroundStrength: 1 }, easing: { position: 'easeInOut', scale: 'easeInOut', rotation: 'easeInOut', opacity: 'easeInOut' }, visible: true, locked: false, keyframes: [newKeyframe(0), newKeyframe(2, 180, 180, 1.4, 360, 1)], ...extra }; }
function newProject({ name, ratio, fps, resolution, bgColor }) {
  return {
    id: uid(),
    name: name || `Project ${state.projects.length + 1}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: {
      ratio: ratio || '9:16',
      fps: Number(fps) || 30,
      resolution: Number(resolution) || 1080,
      bgColor: bgColor || '#000000',
      duration: 2,
      customEase: { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1 },
      camera: { x: 0, y: 0, zoom: 1, rotation: 0 },
      cameraUnlocked: false,
      audio: { src: null, name: '', volume: 1, offset: 0 },
      audioTracks: [],
      showGridLines: false,
      exportQuality: 'medium',
      cameraKeyframes: [],
      marks: [],
      audioKeyframes: [{ id: uid(), time: 0, volume: 1, offset: 0 }]
    },
    layers: []
  };
}

function saveProjects() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects)); }

function saveSession() {
  if (state.session) localStorage.setItem(SESSION_KEY, JSON.stringify(state.session));
  else localStorage.removeItem(SESSION_KEY);
}

function loadSession() {
  try {
    state.session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
  } catch {
    state.session = null;
  }
}


function updateAuthStatusText() {
  const signedInText = state.language === 'en' ? 'Signed in' : 'Đã đăng nhập';
  const guestText = state.language === 'en' ? 'Not signed in' : 'Chưa đăng nhập';
  if (ui.authStatus) ui.authStatus.textContent = state.session ? `${signedInText}: ${state.session.name} (${state.session.provider})` : guestText;
  if (ui.authMiniStatus) ui.authMiniStatus.textContent = state.session ? state.session.name : 'Guest';
}

function renderSession() { updateAuthStatusText(); }

function renderAuthMode() {
  const signup = state.authMode === 'signup';
  if (ui.authModalTitle) ui.authModalTitle.textContent = signup ? 'Sign up' : 'Sign in';
  if (ui.authNameRow) ui.authNameRow.classList.toggle('hidden', !signup);
  if (ui.authSignInBtn) ui.authSignInBtn.textContent = signup ? 'Sign up' : 'Sign in';
  if (ui.authToggleHint) ui.authToggleHint.innerHTML = signup
    ? "Already have an account? <button id='authToggleModeBtn' class='text-link' type='button'>(sign in)</button>!"
    : "Don't have a account? So, <button id='authToggleModeBtn' class='text-link' type='button'>(sign up)</button>!";
  ui.authToggleModeBtn = getEl('authToggleModeBtn');
  if (ui.authToggleModeBtn) ui.authToggleModeBtn.onclick = () => { state.authMode = signup ? 'signin' : 'signup'; renderAuthMode(); };
}

function openAuthModal(mode = 'signin') {
  state.authMode = mode === 'signup' ? 'signup' : 'signin';
  renderAuthMode();
  ui.authModal?.classList.remove('hidden');
  if (state.authMode === 'signup') ui.authName?.focus();
}
function closeAuthModal() { ui.authModal?.classList.add('hidden'); }
function openGuestModal() { ui.guestModal?.classList.remove('hidden'); }
function closeGuestModal() { ui.guestModal?.classList.add('hidden'); }
function openOtpModal(email) {
  state.otpEmail = email;
  if (ui.otpInfoText) ui.otpInfoText.textContent = `We'll send an email to ${email}, please check your inbox. If not have, check the spam folder.`;
  ui.otpCode.value = '';
  Array.from(document.querySelectorAll('.otp-digit')).forEach((x) => { x.value = ''; });
  const firstOtp = document.querySelector('.otp-digit'); if (firstOtp) firstOtp.focus();
  ui.otpModal?.classList.remove('hidden');
}
function closeOtpModal() { ui.otpModal?.classList.add('hidden'); }


function getFirebaseAuth() {
  const fb = window.firebase;
  if (!fb?.initializeApp || !fb?.auth) return null;
  if (!fb.apps?.length) fb.initializeApp(FIREBASE_CONFIG);
  return fb.auth();
}

function firebaseUserToSession(user, provider = 'Firebase') {
  return {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || user.email || 'Firebase user',
    provider
  };
}

async function setFirebaseSession(user, provider = 'Firebase') {
  state.authToken = await user.getIdToken();
  state.session = firebaseUserToSession(user, provider);
  localStorage.setItem(AUTH_TOKEN_KEY, state.authToken);
  localStorage.setItem(AUTH_PROVIDER_KEY, 'firebase');
  saveSession();
  updateAuthStatusText();
  closeAuthModal();
  await renderCloudList();
}

async function signInWithFirebaseProvider(providerName) {
  const auth = getFirebaseAuth();
  const fb = window.firebase;
  if (!auth || !fb?.auth) {
    openAuthModal('signin');
    alert('Firebase Auth SDK is not loaded yet. Please check your network or Firebase setup.');
    return;
  }
  const Provider = providerName === 'GitHub' ? fb.auth.GithubAuthProvider : fb.auth.GoogleAuthProvider;
  const result = await auth.signInWithPopup(new Provider());
  await setFirebaseSession(result.user, providerName);
}

async function signInWithFirebaseEmail(email, password) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth SDK is not loaded yet.');
  const result = await auth.signInWithEmailAndPassword(email, password);
  await setFirebaseSession(result.user, 'Firebase Email');
}

async function signUpWithFirebaseEmail(email, password, name) {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error('Firebase Auth SDK is not loaded yet.');
  const result = await auth.createUserWithEmailAndPassword(email, password);
  if (name && result.user?.updateProfile) await result.user.updateProfile({ displayName: name });
  await setFirebaseSession(result.user, 'Firebase Email');
}

function localAuthUsers() {
  try { return JSON.parse(localStorage.getItem(LOCAL_AUTH_USERS_KEY) || '[]'); } catch { return []; }
}
function saveLocalAuthUsers(users) { localStorage.setItem(LOCAL_AUTH_USERS_KEY, JSON.stringify(users)); }
function localOtpGet() {
  try { return JSON.parse(localStorage.getItem(LOCAL_AUTH_OTP_KEY) || '{}'); } catch { return {}; }
}
function localOtpSet(data) { localStorage.setItem(LOCAL_AUTH_OTP_KEY, JSON.stringify(data)); }



async function localAuthFallback(path, payload) {
  const email = String(payload?.email || '').trim().toLowerCase();
  const users = localAuthUsers();

  if (path === '/api/auth/precheck') return { exists: users.some((u) => u.email === email) };

  if (path === '/api/auth/send-otp') {
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error('Email not exist!');
    const code = String(Math.floor(100000 + Math.random() * 900000));
    localOtpSet({ email, code, exp: Date.now() + 10 * 60 * 1000 });
    console.info(`[LOCAL OTP] ${email} => ${code}`);
    return { ok: true, delivered: false, reason: 'local_fallback', message: `We'll send an email to ${email}, please check your inbox. If not have, check the spam folder.` };
  }

  if (path === '/api/auth/verify-otp') {
    const otp = localOtpGet();
    if (!otp.email || otp.email !== email || !otp.code) throw new Error('OTP expired');
    if (otp.exp < Date.now()) throw new Error('OTP expired');
    if (String(payload?.code || '').trim() !== String(otp.code)) throw new Error('Invalid OTP');
    const user = users.find((u) => u.email === email);
    if (!user) throw new Error('Email not exist!');
    localStorage.removeItem(LOCAL_AUTH_OTP_KEY);
    return { token: `local-${uid()}`, user: { id: user.id, email: user.email, name: user.name, provider: user.provider || 'email' } };
  }

  if (path === '/api/auth/signup') {
    const password = String(payload?.password || '');
    const name = String(payload?.name || '').trim() || email.split('@')[0] || 'user';
    if (!email || !password || password.length < 6) throw new Error('Invalid email/password');
    if (users.some((u) => u.email === email)) throw new Error('Email exists');
    const user = { id: `lu_${uid()}`, email, name, password, provider: 'email' };
    users.push(user);
    saveLocalAuthUsers(users);
    return { token: `local-${uid()}`, user: { id: user.id, email: user.email, name: user.name, provider: user.provider } };
  }

  if (path === '/api/auth/signin') {
    const password = String(payload?.password || '');
    const user = users.find((u) => u.email === email);
    if (!user || user.password !== password) throw new Error('Invalid credentials');
    return { token: `local-${uid()}`, user: { id: user.id, email: user.email, name: user.name, provider: user.provider } };
  }

  throw new Error('auth_failed');
}

async function requestAuth(path, payload) {
  try {
    const r = await fetch(apiUrl(path), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    let data = {};
    try { data = await r.json(); } catch {}
    if (!r.ok) {
      const msg = data?.error || (r.status === 404 ? 'Auth API unavailable. Run `node server.js`.' : 'auth_failed');
      throw new Error(msg);
    }
    return data;
  } catch (err) {
    if (path.startsWith('/api/auth/send-otp') || path.startsWith('/api/auth/verify-otp') || path.startsWith('/api/auth/precheck')) {
      const msg = err?.message && err.message !== 'auth_failed' ? err.message : 'Email delivery service unavailable. Please run Node server with SMTP config.';
      throw new Error(msg);
    }
    if (err?.message && !['Failed to fetch', 'auth_failed'].includes(err.message)) throw err;
    return localAuthFallback(path, payload);
  }
}

async function sendSignInOtp(email) {
  const pre = await requestAuth('/api/auth/precheck', { email });
  if (!pre.exists) throw new Error('Email not exist!');
  const otpResp = await requestAuth('/api/auth/send-otp', { email });
  if (otpResp?.delivered === false) {
    const reason = otpResp?.reason || 'unknown';
    throw new Error(`Email not sent (${reason}). Configure SMTP Gmail/Outlook in server environment.`);
  }
  openOtpModal(email);
  if (ui.otpInfoText) {
    ui.otpInfoText.textContent = otpResp?.message || `We'll send an email to ${email}, please check your inbox. If not have, check the spam folder.`;
  }
}

async function verifyOtpAndSignIn() {
  const email = state.otpEmail || ui.authEmail.value.trim();
  const code = Array.from(document.querySelectorAll('.otp-digit')).map((x) => x.value || '').join('').trim();
  const data = await requestAuth('/api/auth/verify-otp', { email, code });
  state.authToken = data.token;
  state.session = data.user;
  localStorage.setItem(AUTH_TOKEN_KEY, state.authToken);
  saveSession();
  updateAuthStatusText();
  closeOtpModal();
  closeAuthModal();
  await renderCloudList();
}

async function signInReal() {
  const email = ui.authEmail.value.trim();
  const password = ui.authPassword.value;
  if (!email || !password) throw new Error('Enter email and password to sign in with Firebase.');
  try {
    await signInWithFirebaseEmail(email, password);
  } catch (firebaseError) {
    const data = await requestAuth('/api/auth/signin', { email, password });
    state.authToken = data.token;
    state.session = data.user;
    localStorage.setItem(AUTH_TOKEN_KEY, state.authToken);
    localStorage.setItem(AUTH_PROVIDER_KEY, 'server');
    saveSession();
    updateAuthStatusText();
    closeAuthModal();
    await renderCloudList();
  }
}

async function signUpReal() {
  const email = ui.authEmail.value.trim();
  const password = ui.authPassword.value;
  const name = ui.authName.value.trim();
  if (!email || !password) throw new Error('Enter email and password to sign up with Firebase.');
  try {
    await signUpWithFirebaseEmail(email, password, name);
  } catch (firebaseError) {
    const data = await requestAuth('/api/auth/signup', { email, password, name });
    state.authToken = data.token;
    state.session = data.user;
    localStorage.setItem(AUTH_TOKEN_KEY, state.authToken);
    localStorage.setItem(AUTH_PROVIDER_KEY, 'server');
    saveSession();
    updateAuthStatusText();
    closeAuthModal();
    await renderCloudList();
  }
}

function authHeaders() {
  return state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {};
}

function applyLanguage(lang) {
  state.language = lang === 'en' ? 'en' : 'vi';
  localStorage.setItem('uiLang', state.language);
  document.documentElement.lang = state.language;
  if (ui.guestNeedSignInText) ui.guestNeedSignInText.textContent = "You're not signed in. Log in to use this feature.";
  const map = {
    homeTitle: state.language === 'en' ? 'Alight Motion Web Lite' : 'Alight Motion Web Lite',
    homeDesc: state.language === 'en' ? 'Home for projects, cloud and community.' : 'Màn hình chính quản lý dự án, Cloud và cộng đồng.',
    createProjectTitle: state.language === 'en' ? 'Create new project' : 'Tạo dự án mới',
    projectListTitle: state.language === 'en' ? 'Project list' : 'Danh sách dự án',
    cloudTitle: state.language === 'en' ? 'Cloud Community' : 'Cloud Community',
    cloudDesc: state.language === 'en' ? 'Published projects can be viewed publicly.' : 'Các dự án đã đăng lên server có thể mở và xem công khai.',
    accountTitle: state.language === 'en' ? 'Account' : 'Tài khoản',
    timelinePanelTitle: state.language === 'en' ? 'Timeline + Frames' : 'Timeline + Frames'
  };
  Object.entries(map).forEach(([id,txt]) => { const el=getEl(id); if(el) el.textContent = txt; });
  if (ui.playBtn) ui.playBtn.textContent = state.language === 'en' ? '▶ Play' : '▶ Phát';
  if (ui.pauseBtn) ui.pauseBtn.textContent = state.language === 'en' ? '⏸ Pause' : '⏸ Dừng';
  if (ui.resetBtn) ui.resetBtn.textContent = state.language === 'en' ? '↺ Reset' : '↺ Reset';
  if (ui.exportVideoBtn) ui.exportVideoBtn.textContent = state.language === 'en' ? '⤓ Export' : '⤓ Xuất Video';
  if (ui.publishProjectBtn) ui.publishProjectBtn.textContent = state.language === 'en' ? '☁ Publish to Cloud' : '☁ Đăng lên Cloud';
  if (ui.frameActionBtn) ui.frameActionBtn.textContent = state.language === 'en' ? '◇ + Add frame at current time' : '◇ + Frame tại thời điểm hiện tại';
  updateAuthStatusText();
  syncFrameActionButton();
  syncScopeKeyButtons();
  syncMarkButton();
}

function demoLogin(provider) {
  openAuthModal();
}

function localCloudGet() {
  try { return JSON.parse(localStorage.getItem(LOCAL_CLOUD_KEY) || '[]'); } catch { return []; }
}

function localCloudSet(list) { localStorage.setItem(LOCAL_CLOUD_KEY, JSON.stringify(list)); }

async function fetchCloudProjects() {
  try {
    const r = await fetch(apiUrl('/api/projects'), { headers: { ...authHeaders() } });
    if (!r.ok) throw new Error('api-failed');
    return await r.json();
  } catch {
    return localCloudGet();
  }
}

function selectedPublishFilters() {
  return Array.from(document.querySelectorAll('input[name="publishFilter"]:checked')).map((el) => el.value);
}

function openPublishModal() {
  const p = currentProject();
  if (!p) return;
  if (!state.session || !state.authToken) {
    openGuestModal();
    return;
  }
  ui.publishTitle.value = p.name || '';
  ui.publishDescription.value = '';
  document.querySelectorAll('input[name="publishFilter"]').forEach((el) => { el.checked = false; });
  ui.publishModal?.classList.remove('hidden');
}
function closePublishModal() { ui.publishModal?.classList.add('hidden'); }

async function publishCurrentProject() {
  const p = currentProject();
  if (!p) return;
  if (!state.session || !state.authToken) {
    openGuestModal();
    return;
  }
  const title = (ui.publishTitle?.value || p.name || 'Untitled').trim();
  const description = (ui.publishDescription?.value || '').trim();
  const filters = selectedPublishFilters();
  const payload = { project: p, title, description, filters, author: state.session.name, provider: state.session.provider };
  try {
    const r = await fetch(apiUrl('/api/projects'), { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error('publish-failed');
  } catch {
    const list = localCloudGet();
    list.unshift({ id: uid(), title, description, filters, author: state.session.name, provider: state.session.provider, publishedAt: Date.now(), views: 0, likes: 0, dislikes: 0, project: p });
    localCloudSet(list.slice(0, 40));
  }
  closePublishModal();
  await renderCloudList();
  alert('Đã đăng dự án lên Cloud thành công.');
}

function saveProfileStats() { localStorage.setItem(PROFILE_STATS_KEY, JSON.stringify(state.profileStats)); }
function updateStudioStats() {
  if (ui.profileName) ui.profileName.textContent = state.session?.name || 'Guest';
  if (ui.profileFollowers) ui.profileFollowers.textContent = `Followers: ${state.profileStats.followers || 0} • Following: ${state.profileStats.following || 0}`;
  if (ui.studioFollowerCount) ui.studioFollowerCount.textContent = String(state.profileStats.followers || 0);
  if (ui.studioFollowingCount) ui.studioFollowingCount.textContent = String(state.profileStats.following || 0);
  if (ui.studioViewCount) ui.studioViewCount.textContent = String(state.profileStats.views || 0);
  if (ui.studioCloudCount) ui.studioCloudCount.textContent = String(localCloudGet().length);
}
function openProfileModal() { updateStudioStats(); ui.profileModal?.classList.remove('hidden'); ui.profileDropdown?.classList.add('hidden'); }
function openStudioModal() { updateStudioStats(); ui.studioModal?.classList.remove('hidden'); ui.profileDropdown?.classList.add('hidden'); }
function closeProfileModal() { ui.profileModal?.classList.add('hidden'); }
function closeStudioModal() { ui.studioModal?.classList.add('hidden'); }

function openCloudViewer(item) {
  state.activeCloudItem = item;
  state.cloudPlayerTime = 0;
  state.profileStats.views = (state.profileStats.views || 0) + 1;
  saveProfileStats();
  if (ui.cloudViewerTitle) ui.cloudViewerTitle.textContent = item.title || item.project?.name || 'Untitled';
  if (ui.cloudViewerAuthor) ui.cloudViewerAuthor.textContent = `Uploader: ${item.author || 'unknown'}`;
  if (ui.cloudViewerDesc) ui.cloudViewerDesc.textContent = item.description || 'No description.';
  if (ui.cloudViewerViews) ui.cloudViewerViews.textContent = `${(item.views || 0) + 1} views`;
  if (ui.cloudViewerFilters) ui.cloudViewerFilters.innerHTML = (item.filters || []).map((f) => `<span>${f}</span>`).join('');
  if (ui.cloudDuration) ui.cloudDuration.value = '0';
  if (ui.cloudPlayPauseBtn) ui.cloudPlayPauseBtn.textContent = '▶ Play';
  if (ui.cloudDetailsBox) { ui.cloudDetailsBox.classList.add('hidden'); ui.cloudDetailsBox.textContent = JSON.stringify(item.project?.settings || {}, null, 2); }
  ui.cloudViewerModal?.classList.remove('hidden');
  updateStudioStats();
}
function closeCloudViewer() { clearInterval(state.cloudPlayerTimer); state.cloudPlayerTimer = null; ui.cloudViewerModal?.classList.add('hidden'); }

function setupSocketIo() {
  if (!ui.socketStatus) return;
  if (typeof window.io !== 'function') {
    ui.socketStatus.textContent = 'Socket.IO: offline fallback';
    return;
  }
  try {
    const socket = window.io();
    ui.socketStatus.textContent = 'Socket.IO: connected';
    socket.on?.('connect', () => { ui.socketStatus.textContent = 'Socket.IO: connected'; });
    socket.on?.('disconnect', () => { ui.socketStatus.textContent = 'Socket.IO: disconnected'; });
  } catch {
    ui.socketStatus.textContent = 'Socket.IO: offline fallback';
  }
}

async function renderCloudList() {
  if (!ui.cloudList) return;
  ui.cloudList.innerHTML = '';
  const list = await fetchCloudProjects();
  if (!list.length) {
    ui.cloudList.innerHTML = '<small>Cloud chưa có dự án nào.</small>';
    return;
  }
  const cq = (ui.cloudSearch?.value || '').trim().toLowerCase();
  list.filter((item) => {
    const t = `${item.title || item.project?.name || ''} ${item.author || ''}`.toLowerCase();
    return !cq || t.includes(cq);
  }).forEach((item) => {
    const card = document.createElement('div');
    card.className = 'project-item';
    card.innerHTML = `<div><strong>${item.title || item.project?.name || 'Untitled'}</strong><br><small>${item.author || 'unknown'} • ${new Date(item.publishedAt || Date.now()).toLocaleString()} • ${(item.views || 0)} views</small><br><small>${(item.filters || []).join(', ')}</small></div>`;
    const actions = document.createElement('div');
    actions.className = 'project-actions';
    const view = document.createElement('button');
    view.className = 'btn primary';
    const apiBaseParam = state.cloudApiBase ? `&apiBase=${encodeURIComponent(state.cloudApiBase)}` : '';
    view.dataset.publicUrl = `public.html?id=${encodeURIComponent(item.id)}${apiBaseParam}`;
    view.textContent = 'Xem';
    view.onclick = () => openCloudViewer(item);
    actions.append(view);
    if (item.isOwner || (state.session && item.ownerId === state.session.id)) {
      const unshare = document.createElement('button');
      unshare.className = 'btn danger';
      unshare.textContent = 'Unshare';
      unshare.onclick = async () => {
        try {
          const r = await fetch(apiUrl(`/api/projects/${encodeURIComponent(item.id)}/share`), { method: 'DELETE', headers: { ...authHeaders() } });
          if (!r.ok) throw new Error('x');
        } catch {}
        await renderCloudList();
      };
      actions.append(unshare);
    }
    card.append(actions);
    ui.cloudList.append(card);
  });
}


function pushHistorySnapshot() {
  const p = currentProject();
  if (!p) return;
  state.history.push({ projectId: p.id, snapshot: JSON.stringify(p) });
  if (state.history.length > 60) state.history.shift();
  state.future = [];
}

function restoreSnapshot(entry) {
  const idx = state.projects.findIndex((x) => x.id === entry.projectId);
  if (idx < 0) return;
  state.projects[idx] = normalizeProject(JSON.parse(entry.snapshot));
  saveProjects();
  hydrateEditor();
}

function undo() {
  const p = currentProject();
  if (!p || !state.history.length) return;
  state.future.push({ projectId: p.id, snapshot: JSON.stringify(p) });
  restoreSnapshot(state.history.pop());
}

function redo() {
  const p = currentProject();
  if (!p || !state.future.length) return;
  state.history.push({ projectId: p.id, snapshot: JSON.stringify(p) });
  restoreSnapshot(state.future.pop());
}

function normalizeLayerEasing(layer) {
  if (!layer.easing) {
    layer.easing = { position: 'easeInOut', scale: 'easeInOut', rotation: 'easeInOut', opacity: 'easeInOut' };
    return;
  }
  if (typeof layer.easing === 'string') {
    const e = layer.easing;
    layer.easing = { position: e, scale: e, rotation: e, opacity: e };
    return;
  }
  layer.easing.position = layer.easing.position || 'easeInOut';
  layer.easing.scale = layer.easing.scale || 'easeInOut';
  layer.easing.rotation = layer.easing.rotation || 'easeInOut';
  layer.easing.opacity = layer.easing.opacity || 'easeInOut';
}

function normalizeProject(p) {
  p.settings = p.settings || {};
  p.settings.customEase = p.settings.customEase || { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1 };
  p.settings.resolution = Number(p.settings.resolution) || 1080;
  p.settings.camera = p.settings.camera || { x: 0, y: 0, zoom: 1, rotation: 0 };
  p.settings.showGridLines = !!p.settings.showGridLines;
  p.settings.exportQuality = ['low','medium','high','ultra'].includes(p.settings.exportQuality) ? p.settings.exportQuality : 'medium';
  p.settings.camera.x = Number.isFinite(+p.settings.camera.x) ? +p.settings.camera.x : 0;
  p.settings.camera.y = Number.isFinite(+p.settings.camera.y) ? +p.settings.camera.y : 0;
  p.settings.camera.zoom = Number.isFinite(+p.settings.camera.zoom) ? Math.max(0.1, +p.settings.camera.zoom) : 1;
  p.settings.camera.rotation = Number.isFinite(+p.settings.camera.rotation) ? +p.settings.camera.rotation : 0;
  p.settings.audio = p.settings.audio || { src: null, name: '', volume: 1, offset: 0 };
  p.settings.audioTracks = Array.isArray(p.settings.audioTracks) ? p.settings.audioTracks : [];
  p.settings.audioTracks = p.settings.audioTracks.map((t) => ({
    id: t.id || uid(),
    name: t.name || 'audio',
    src: t.src || null,
    volume: Number.isFinite(+t.volume) ? clamp(+t.volume, 0, 2) : 1,
    offset: Number.isFinite(+t.offset) ? Math.max(0, +t.offset) : 0
  })).filter((t) => t.src);
  p.settings.audio.src = p.settings.audio.src || null;
  p.settings.audio.name = p.settings.audio.name || '';
  p.settings.audio.volume = Number.isFinite(+p.settings.audio.volume) ? clamp(+p.settings.audio.volume, 0, 2) : 1;
  p.settings.audio.offset = Number.isFinite(+p.settings.audio.offset) ? Math.max(0, +p.settings.audio.offset) : 0;
  p.settings.cameraUnlocked = !!p.settings.cameraUnlocked;
  p.settings.cameraKeyframes = Array.isArray(p.settings.cameraKeyframes) ? p.settings.cameraKeyframes : [];
  if (!p.settings.cameraUnlocked) p.settings.cameraKeyframes = [];
  p.settings.marks = Array.isArray(p.settings.marks) ? p.settings.marks.map((m) => ({ id: m.id || uid(), time: Math.max(0, +((m.time ?? m.start) || 0)) })).filter((m) => Number.isFinite(m.time)) : [];
  p.settings.audioKeyframes = Array.isArray(p.settings.audioKeyframes) && p.settings.audioKeyframes.length
    ? p.settings.audioKeyframes
    : [{ id: uid(), time: 0, volume: p.settings.audio.volume, offset: p.settings.audio.offset }];
  p.layers = Array.isArray(p.layers) ? p.layers : [];
  p.layers.forEach((layer) => {
    normalizeLayerEasing(layer);
    layer.name = typeof layer.name === 'string' ? layer.name : `${layer.type || 'Layer'} ${layer.id?.slice?.(0, 4) || ''}`.trim();
    layer.text = layer.text || 'TEXT';
    layer.size = Number.isFinite(+layer.size) ? +layer.size : 90;
    layer.fontFamily = layer.fontFamily || 'Inter';
    layer.fontWeight = layer.fontWeight || '700';
    layer.fontStyle = layer.fontStyle || 'normal';
    layer.textAlign = layer.textAlign || 'center';
    layer.frameShape = layer.frameShape || 'rect';
    layer.groupId = layer.groupId || null;
    const legacyKeys = Array.isArray(layer.keyframes) ? layer.keyframes : [];
    layer.scopedKeyframes = layer.scopedKeyframes || {};
    ['scale', 'opacity'].forEach((scope) => {
      const fallbackValue = scope === 'scale' ? 1 : 1;
      const source = Array.isArray(layer.scopedKeyframes[scope]) && layer.scopedKeyframes[scope].length ? layer.scopedKeyframes[scope] : legacyKeys;
      layer.scopedKeyframes[scope] = source.map((k) => ({
        id: k.id && source !== legacyKeys ? k.id : uid(),
        time: Number.isFinite(+keyTime(k, scope)) ? +keyTime(k, scope) : (+k.time || 0),
        [scope]: Number.isFinite(+k[scope]) ? +k[scope] : fallbackValue
      })).sort((a, b) => a.time - b.time);
    });
    layer.effect = layer.effect || { type: 'none', strength: 0.6, glowColor: '#21b8ff', glowHardness: 0.5, glowAlpha: 0.7, reveal: 1, wipeAngle: 0, hue: 0, saturation: 1, brightness: 1, depthAngle: 35, depthSize: 8, rasterX: 35, rasterY: 20, rasterZ: 8, checkerColorA: '#ffffff', checkerColorB: '#21b8ff', checkerGrid: 8, copyBackgroundMode: 'gaussianBlur', copyBackgroundStrength: 1 };
    layer.effect.type = layer.effect.type === 'extrude3d' ? 'rasterExtrude' : (layer.effect.type === 'checkerboard' ? 'checker' : (layer.effect.type || 'none'));
    layer.effect.strength = Number.isFinite(+layer.effect.strength) ? clamp(+layer.effect.strength, 0, 2) : 0.6;
    layer.effect.glowColor = layer.effect.glowColor || layer.color || '#21b8ff';
    layer.effect.glowHardness = Number.isFinite(+layer.effect.glowHardness) ? clamp(+layer.effect.glowHardness, 0, 1) : 0.5;
    layer.effect.glowAlpha = Number.isFinite(+layer.effect.glowAlpha) ? clamp(+layer.effect.glowAlpha, 0, 1) : 0.7;
    layer.effect.reveal = Number.isFinite(+layer.effect.reveal) ? clamp(+layer.effect.reveal, 0, 1) : 1;
    layer.effect.wipeAngle = Number.isFinite(+layer.effect.wipeAngle) ? (+layer.effect.wipeAngle % 360 + 360) % 360 : 0;
    layer.effect.hue = Number.isFinite(+layer.effect.hue) ? clamp(+layer.effect.hue, -180, 180) : 0;
    layer.effect.saturation = Number.isFinite(+layer.effect.saturation) ? clamp(+layer.effect.saturation, 0, 2) : 1;
    layer.effect.brightness = Number.isFinite(+layer.effect.brightness) ? clamp(+layer.effect.brightness, 0, 2) : 1;
    layer.effect.depthAngle = Number.isFinite(+layer.effect.depthAngle) ? (+layer.effect.depthAngle % 360 + 360) % 360 : 35;
    layer.effect.depthSize = Number.isFinite(+layer.effect.depthSize) ? clamp(+layer.effect.depthSize, 0, 1000) : 8;
    layer.effect.rasterX = Number.isFinite(+layer.effect.rasterX) ? clamp(+layer.effect.rasterX, -1000, 1000) : 35;
    layer.effect.rasterY = Number.isFinite(+layer.effect.rasterY) ? clamp(+layer.effect.rasterY, -1000, 1000) : 20;
    layer.effect.rasterZ = Number.isFinite(+layer.effect.rasterZ) ? clamp(+layer.effect.rasterZ, -1000, 1000) : 8;
    layer.effect.checkerColorA = layer.effect.checkerColorA || '#ffffff';
    layer.effect.checkerColorB = layer.effect.checkerColorB || layer.color || '#21b8ff';
    layer.effect.checkerGrid = Number.isFinite(+layer.effect.checkerGrid) ? clamp(Math.round(+layer.effect.checkerGrid), 2, 16) : 8;
    layer.effect.copyBackgroundMode = ['gaussianBlur', 'invertColor', 'grayscale'].includes(layer.effect.copyBackgroundMode) ? layer.effect.copyBackgroundMode : 'gaussianBlur';
    layer.effect.copyBackgroundStrength = Number.isFinite(+layer.effect.copyBackgroundStrength) ? clamp(+layer.effect.copyBackgroundStrength, 0, 2) : 1;
    (layer.keyframes || []).forEach(ensureKeyTimes);
  });
  return p;
}

function applyPreviewZoom() {
  ui.preview.style.transformOrigin = 'center center';
  ui.preview.style.transform = `scale(${state.previewScale})`;
  ui.zoomToggleBtn.textContent = state.previewZoomEnabled ? `🔍 Zoom: On (${state.previewScale.toFixed(1)}x)` : `🔍 Zoom: Off (${state.previewScale.toFixed(1)}x)`;
}

function getLayerEasing(layer, target) {
  normalizeLayerEasing(layer);
  return layer.easing[target] || 'easeInOut';
}

function setLayerEasing(layer, target, mode) {
  normalizeLayerEasing(layer);
  layer.easing[target] = mode;
}

function nearestTimeKey(list, t) { if (!list?.length) return null; return list.reduce((best, k) => Math.abs(k.time - t) < Math.abs(best.time - t) ? k : best, list[0]); }
function sortTimeKeys(list) { list.sort((a, b) => a.time - b.time); }


function tText(en, vi) { return state.language === 'en' ? en : vi; }
const EFFECT_GROUPS = {
  colorLights: ['invertColor', 'exposureGamma', 'colorReplace', 'gradientMap', 'lightRays', 'colorTune', 'saturationVibrance', 'rgbSplit', 'glowScan', 'hotColor', 'channelRemap', 'colorAdjust', 'glow'],
  blur: ['motionBlur', 'gaussianBlur', 'boxBlur', 'directionalBlur', 'zoomBlur', 'radialBlur', 'lensBlur'],
  distortion: ['tiles', 'waveWarp', 'pinchPunch', 'polarCoordinates', 'tileRotate', 'turbulentDisplace', 'bend', 'fractalWarp', 'rasterExtrude', 'extrude3d'],
  moveTransform: ['oscillate', 'randomJitter', 'swing', 'autoShake', 'axisScale'],
  drawingEdge: ['findEdges', 'drawingGlowScan', 'drawingProgress', 'contourLines', 'electricEdges'],
  procedural: ['simpleChoker', 'fractalRidges', 'stripes', 'checker', 'checkerboard', 'grid', 'stars'],
  matteMaskKey: ['chromaKey', 'lumaKey', 'mask', 'wipe', 'copyBackground']
};
const DEFAULT_EFFECT_BY_GROUP = {
  colorLights: 'invertColor',
  blur: 'gaussianBlur',
  distortion: 'tiles',
  moveTransform: 'oscillate',
  drawingEdge: 'findEdges',
  procedural: 'checker',
  matteMaskKey: 'wipe'
};
function effectToTab(type) {
  const normalized = type === 'checkerboard' ? 'checker' : type;
  return Object.entries(EFFECT_GROUPS).find(([, effects]) => effects.includes(normalized))?.[0] || 'colorLights';
}
function tabToEffect(tab) { return DEFAULT_EFFECT_BY_GROUP[tab] || 'invertColor'; }
function isColorLightEffect(type) { return EFFECT_GROUPS.colorLights.includes(type); }
function isBlurEffect(type) { return EFFECT_GROUPS.blur.includes(type); }
function isDistortionEffect(type) { return EFFECT_GROUPS.distortion.includes(type); }
function isMoveTransformEffect(type) { return EFFECT_GROUPS.moveTransform.includes(type); }
function isDrawingEdgeEffect(type) { return EFFECT_GROUPS.drawingEdge.includes(type); }
function isProceduralEffect(type) { return EFFECT_GROUPS.procedural.includes(type); }
function getTimelinePoints(p) {
  const points = [];
  (p.layers || []).forEach((layer) => {
    ['position', 'rotation', 'scale', 'opacity'].forEach((scope) => {
      getScopeKeys(layer, scope).forEach((k) => points.push(keyTime(k, scope)));
    });
  });
  (p.settings.cameraKeyframes || []).forEach((k) => points.push(k.time));
  (p.settings.audioKeyframes || []).forEach((k) => points.push(k.time));
  (p.settings.marks || []).forEach((m) => points.push(m.time));
  return [...new Set(points.map((x) => clamp(+x || 0, 0, p.settings.duration).toFixed(3)))].map(Number).sort((a, b) => a - b);
}
function goToTimelinePoint(direction) {
  const p = currentProject();
  if (!p) return;
  const eps = 0.001;
  const points = getTimelinePoints(p);
  const next = direction < 0 ? [...points].reverse().find((x) => x < state.time - eps) : points.find((x) => x > state.time + eps);
  if (next == null) return;
  state.playing = false;
  state.time = clamp(next, 0, p.settings.duration);
  syncAudioPlayback();
  draw();
  drawTimelineTracks();
  syncControlsFromNearest();
}
function nearestMark(p, time = state.time) {
  return nearestTimeKey(p?.settings?.marks || [], time);
}
function hasMarkAtCurrent(p) {
  const mark = nearestMark(p);
  return !!mark && Math.abs(mark.time - state.time) <= 0.03;
}
function syncMarkButton() {
  if (!ui.markPartBtn) return;
  const p = currentProject();
  const del = p && hasMarkAtCurrent(p);
  ui.markPartBtn.textContent = del ? 'Delete this mark' : 'Mark a part';
  ui.markPartBtn.classList.toggle('danger', !!del);
}

function hasExactFrameAtCurrent(target, p, l) {
  const EPS = 0.03;
  if (target === 'camera') return !!nearestTimeKey(p.settings.cameraKeyframes || [], state.time) && Math.abs(nearestTimeKey(p.settings.cameraKeyframes || [], state.time).time - state.time) < EPS;
  if (target === 'audio') return !!nearestTimeKey(p.settings.audioKeyframes || [], state.time) && Math.abs(nearestTimeKey(p.settings.audioKeyframes || [], state.time).time - state.time) < EPS;
  if (!l) return false;
  const scope = activeLayerScope();
  const k = nearestKey(l, state.time, scope);
  return !!k && Math.abs(keyTime(k, scope) - state.time) < EPS;
}


function syncScopeKeyButtons() {
  const p = currentProject();
  const l = currentLayer();
  const updateBtn = (btn, scope) => {
    if (!btn) return;
    if (!p || !l) {
      btn.textContent = '◇ +';
      btn.classList.remove('danger');
      return;
    }
    const k = nearestKey(l, state.time, scope);
    const exact = !!k && Math.abs(keyTime(k, scope) - state.time) < 0.03;
    btn.textContent = exact ? '◇ -' : '◇ +';
    btn.classList.toggle('danger', exact);
  };
  updateBtn(ui.scaleKeyBtn, 'scale');
  updateBtn(ui.opacityKeyBtn, 'opacity');
}

function syncFrameActionButton() {
  if (!ui.frameActionBtn) return;
  const p = currentProject();
  if (!p) { ui.frameActionBtn.textContent = '◇ + Frame'; return; }
  const target = ui.frameTarget.value;
  const l = currentLayer();
  const exact = hasExactFrameAtCurrent(target, p, l);
  const viAdd = '◇ + Frame tại thời điểm hiện tại';
  const viDel = '◇ - Xóa frame tại thời điểm hiện tại';
  const enAdd = '◇ + Add frame at current time';
  const enDel = '◇ - Remove frame at current time';
  ui.frameActionBtn.textContent = exact
    ? (state.language === 'en' ? enDel : viDel)
    : (state.language === 'en' ? enAdd : viAdd);
  ui.frameActionBtn.classList.toggle('danger', exact);
  if (ui.frameActionMiniBtn) { ui.frameActionMiniBtn.textContent = exact ? '◇ -' : '◇ +'; ui.frameActionMiniBtn.classList.toggle('danger', exact); }
}

function sampleTimelineValue(list, t, numericKeys) {
  sortTimeKeys(list);
  if (!list.length) return null;
  if (t <= list[0].time) return { ...list[0] };
  if (t >= list[list.length - 1].time) return { ...list[list.length - 1] };
  let a = list[0], b = list[1];
  for (let i = 0; i < list.length - 1; i += 1) {
    if (t >= list[i].time && t <= list[i + 1].time) { a = list[i]; b = list[i + 1]; break; }
  }
  const u = (t - a.time) / Math.max(0.0001, b.time - a.time);
  const out = { time: t };
  numericKeys.forEach((k) => { out[k] = lerp(a[k], b[k], u); });
  return out;
}

function getCameraAt(t) {
  const p = currentProject(); if (!p) return { x: 0, y: 0, zoom: 1, rotation: 0 };
  return sampleTimelineValue(p.settings.cameraKeyframes || [], t, ['x', 'y', 'zoom', 'rotation']) || p.settings.camera;
}

function getAudioAt(t) {
  const p = currentProject(); if (!p) return { volume: 1, offset: 0, src: null };
  const keyVal = sampleTimelineValue(p.settings.audioKeyframes || [], t, ['volume', 'offset']) || p.settings.audio;
  return { ...keyVal, src: p.settings.audio.src };
}

function syncAudioControls() {
  const p = currentProject();
  if (!p) return;
  const tracks = p.settings.audioTracks || [];
  const first = tracks[0] || p.settings.audio || { src: null, name: '', volume: 1, offset: 0 };
  ui.audioVolume.value = String(first.volume ?? 1);
  ui.audioOffset.value = String(first.offset ?? 0);
  ui.audioInfo.textContent = tracks.length
    ? `Audio tracks: ${tracks.length} • ${tracks.map((t) => `${t.name} (vol ${Number(t.volume).toFixed(2)} • off ${Number(t.offset).toFixed(2)}s)`).join(' | ')}`
    : 'Audio: chưa có';

  while (audioPlayers.length < tracks.length) {
    const a = new Audio();
    a.preload = 'auto';
    audioPlayers.push(a);
  }
  audioPlayers.forEach((a, i) => {
    const t = tracks[i];
    if (!t) { a.pause(); a.removeAttribute('src'); a.load(); return; }
    if (a.src !== t.src) a.src = t.src;
    a.volume = clamp(t.volume ?? 1, 0, 2);
  });
}

function syncAudioPlayback() {
  const p = currentProject();
  if (!p) return;
  const tracks = p.settings.audioTracks || [];
  tracks.forEach((t, i) => {
    const a = audioPlayers[i];
    if (!a || !t?.src) return;
    const target = Math.max(0, state.time - (t.offset || 0));
    if (Math.abs((a.currentTime || 0) - target) > 0.15) a.currentTime = target;
    a.volume = clamp(t.volume ?? 1, 0, 2);
  });
}

function stopAudioPlayback() {
  audioPlayer.pause();
  audioPlayers.forEach((a) => a.pause());
}

function setExportProgress(percent) {
  const p = clamp(percent, 0, 100);
  ui.exportProgressBar.style.width = `${p.toFixed(1)}%`;
  ui.exportProgressText.textContent = `${Math.floor(p)}%`;
}

function showExportOverlay() {
  setExportProgress(0);
  ui.exportOverlay.classList.remove('hidden');
}

function hideExportOverlay() {
  ui.exportOverlay.classList.add('hidden');
}

function showHotAlert(tempC) {
  if (!ui.hotAlertModal) return;
  if (ui.hotAlertTempText) ui.hotAlertTempText.textContent = Number.isFinite(tempC) ? `Current temperature: ${tempC.toFixed(1)}℃` : 'Current temperature: > 40℃';
  if (!state.hotAlertDismissed) ui.hotAlertModal.classList.remove('hidden');
}

function hideHotAlert() {
  if (!ui.hotAlertModal) return;
  ui.hotAlertModal.classList.add('hidden');
}

function syncEffectTab(tabName = 'glow') {
  document.querySelectorAll('.effect-tab-btn').forEach((btn) => btn.classList.toggle('active', btn.dataset.effectTab === tabName));
  document.querySelectorAll('.effect-panel').forEach((p) => p.classList.toggle('hidden', p.dataset.effectPanel !== tabName));
}

async function setupThermalMonitor() {
  const threshold = 40;
  const emitTemperature = (tempC) => {
    if (!Number.isFinite(tempC)) return;
    if (tempC > threshold) showHotAlert(tempC);
    else {
      state.hotAlertDismissed = false;
      hideHotAlert();
    }
  };

  const batteryApi = navigator.getBattery ? await navigator.getBattery().catch(() => null) : null;
  if (batteryApi && Number.isFinite(batteryApi.temperature)) {
    emitTemperature(Number(batteryApi.temperature));
    batteryApi.addEventListener?.('temperaturechange', () => emitTemperature(Number(batteryApi.temperature)));
  }

  const thermalApi = navigator.thermal;
  if (thermalApi?.addEventListener) {
    thermalApi.addEventListener('change', (e) => {
      const tempC = Number(e?.temperature ?? thermalApi.temperature);
      emitTemperature(tempC);
    });
    if (Number.isFinite(Number(thermalApi.temperature))) emitTemperature(Number(thermalApi.temperature));
  }

  window.setDeviceTemperatureForDemo = (tempC) => emitTemperature(Number(tempC));
}

function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  state.projects = raw ? JSON.parse(raw).map(normalizeProject) : [];
  if (!state.projects.length) {
    state.projects.push(newProject({ name: 'Dự án trống', ratio: '9:16', fps: 30, bgColor: '#000000' }));
    saveProjects();
  }
}

function currentProject() { return state.projects.find((p) => p.id === state.currentProjectId) || null; }
function currentLayer() { const p = currentProject(); if (!p) return null; return p.layers.find((l) => l.id === ui.layerSelect.value) || p.layers[0] || null; }
function isIndependentLayerScope(scope) { return scope === 'scale' || scope === 'opacity'; }
function keyTime(k, scope = 'position') { return Number.isFinite(+k?.times?.[scope]) ? +k.times[scope] : +k.time || 0; }
function ensureKeyTimes(k) {
  k.times = k.times || {};
  ['position', 'rotation'].forEach((scope) => {
    if (!Number.isFinite(+k.times[scope])) k.times[scope] = +k.time || 0;
  });
  return k.times;
}
function ensureScopedKeyStore(layer) {
  layer.scopedKeyframes = layer.scopedKeyframes || {};
  layer.scopedKeyframes.scale = Array.isArray(layer.scopedKeyframes.scale) ? layer.scopedKeyframes.scale : [];
  layer.scopedKeyframes.opacity = Array.isArray(layer.scopedKeyframes.opacity) ? layer.scopedKeyframes.opacity : [];
  return layer.scopedKeyframes;
}
function getScopeKeys(layer, scope = 'position') {
  if (!layer) return [];
  if (isIndependentLayerScope(scope)) return ensureScopedKeyStore(layer)[scope];
  layer.keyframes = Array.isArray(layer.keyframes) ? layer.keyframes : [];
  return layer.keyframes;
}
function sortScopeKeys(layer, scope = state.activeKeyScope || 'position') {
  const keys = getScopeKeys(layer, scope);
  keys.sort((a, b) => keyTime(a, scope) - keyTime(b, scope));
}
function sortKf(layer) { sortScopeKeys(layer, state.activeKeyScope || 'position'); }
function nearestKey(layer, t, scope = state.activeKeyScope || 'position') {
  const keys = getScopeKeys(layer, scope);
  if (!keys.length) return null;
  return keys.reduce((best, k) => Math.abs(keyTime(k, scope) - t) < Math.abs(keyTime(best, scope) - t) ? k : best, keys[0]);
}
function sortedKeysForScope(layer, scope) { return [...getScopeKeys(layer, scope)].sort((a, b) => keyTime(a, scope) - keyTime(b, scope)); }
function sampleLayerProp(layer, t, scope, props) {
  const keys = sortedKeysForScope(layer, scope);
  if (!keys.length) return Object.fromEntries(props.map((prop) => [prop, prop === 'opacity' ? 1 : prop === 'scale' ? 1 : 0]));
  if (t <= keyTime(keys[0], scope)) return Object.fromEntries(props.map((prop) => [prop, keys[0][prop]]));
  if (t >= keyTime(keys[keys.length - 1], scope)) return Object.fromEntries(props.map((prop) => [prop, keys[keys.length - 1][prop]]));
  let a = keys[0], b = keys[1];
  for (let i = 0; i < keys.length - 1; i += 1) {
    if (t >= keyTime(keys[i], scope) && t <= keyTime(keys[i + 1], scope)) { a = keys[i]; b = keys[i + 1]; break; }
  }
  const u = (t - keyTime(a, scope)) / Math.max(0.0001, keyTime(b, scope) - keyTime(a, scope));
  const e = easeValue(u, getLayerEasing(layer, scope));
  return Object.fromEntries(props.map((prop) => [prop, lerp(a[prop], b[prop], e)]));
}
function activeLayerScope() { return ['position', 'rotation', 'scale', 'opacity'].includes(state.activeKeyScope) ? state.activeKeyScope : 'position'; }
function setActiveLayerScope(scope, { refresh = true } = {}) {
  state.activeKeyScope = ['position', 'rotation', 'scale', 'opacity'].includes(scope) ? scope : 'position';
  if (ui.easeTarget) ui.easeTarget.value = state.activeKeyScope;
  if (refresh) {
    drawTimelineTracks();
    syncControlsFromNearest();
    drawEaseGraph();
  }
}

function scopeLabel(scope) {
  return { position: 'Movement', rotation: 'Rotation', scale: 'Scale', opacity: 'Opacity' }[scope] || 'Movement';
}

function easeValue(t, mode) {
  const p = currentProject(); const c = p?.settings.customEase || { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1 };
  if (mode === 'easeIn') return t * t;
  if (mode === 'easeOut') return 1 - (1 - t) ** 2;
  if (mode === 'easeInOut') return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
  if (mode === 'custom') return cubicBezierEase(t, c.p1x, c.p1y, c.p2x, c.p2y);
  return t;
}

function getTransform(layer, t) {
  if (!getScopeKeys(layer, 'position').length && !getScopeKeys(layer, 'scale').length && !getScopeKeys(layer, 'opacity').length) return { x: 180, y: 320, scale: 1, rotation: 0, opacity: 1 };
  (layer.keyframes || []).forEach(ensureKeyTimes);
  const pos = sampleLayerProp(layer, t, 'position', ['x', 'y']);
  const scale = sampleLayerProp(layer, t, 'scale', ['scale']);
  const rotation = sampleLayerProp(layer, t, 'rotation', ['rotation']);
  const opacity = sampleLayerProp(layer, t, 'opacity', ['opacity']);
  return {
    x: Number.isFinite(pos.x) ? pos.x : 180,
    y: Number.isFinite(pos.y) ? pos.y : 320,
    scale: Number.isFinite(scale.scale) ? scale.scale : 1,
    rotation: Number.isFinite(rotation.rotation) ? rotation.rotation : 0,
    opacity: Number.isFinite(opacity.opacity) ? opacity.opacity : 1
  };
}


function setCanvasRatio(r, resolution = 1080) {
  const rr = parseRatio(r);
  const previewHeight = Math.max(144, Math.min(1080, Number(resolution) || 1080));
  ui.preview.height = previewHeight;
  ui.preview.width = Math.round((previewHeight * rr.w) / rr.h);
}
function applyTheme(theme) { state.theme = theme === 'light' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', state.theme); localStorage.setItem('uiTheme', state.theme); }

function openCreateModal() {
  ui.modal.classList.remove('hidden');
  ui.modalProjectName.value = ''; ui.modalFps.value = '30'; ui.modalResolution.value = '1080'; ui.modalBgColor.value = '#000000'; ui.modalBgHex.value = '#000000';
  state.modalRatio = '9:16';
  ui.ratioRow.querySelectorAll('.ratio-btn').forEach((b) => b.classList.toggle('selected', b.dataset.ratio === '9:16'));
}
function closeCreateModal() { ui.modal.classList.add('hidden'); }

function unlockCameraFrameForProject(p) {
  if (!p) return;
  p.settings.cameraUnlocked = true;
  if (!(p.settings.cameraKeyframes || []).length) {
    p.settings.cameraKeyframes = [{ id: uid(), time: 0, x: p.settings.camera?.x || 0, y: p.settings.camera?.y || 0, zoom: p.settings.camera?.zoom || 1, rotation: p.settings.camera?.rotation || 0 }];
  }
  p.updatedAt = Date.now();
  saveProjects();
  syncControlsFromNearest();
  drawTimelineTracks();
  draw();
}

function openCameraPaywallModal() { if (ui.cameraPaywallModal) ui.cameraPaywallModal.classList.remove('hidden'); }
function closeCameraPaywallModal() { if (ui.cameraPaywallModal) ui.cameraPaywallModal.classList.add('hidden'); }
function openProSuccessModal() { if (ui.proSuccessModal) ui.proSuccessModal.classList.remove('hidden'); }
function closeProSuccessModal() { if (ui.proSuccessModal) ui.proSuccessModal.classList.add('hidden'); }
function openPurchaseHistoryModal() { if (ui.purchaseHistoryModal) ui.purchaseHistoryModal.classList.remove('hidden'); }
function closePurchaseHistoryModal() { if (ui.purchaseHistoryModal) ui.purchaseHistoryModal.classList.add('hidden'); }
function syncProBadge() { if (ui.headerProBadge) ui.headerProBadge.classList.toggle('hidden', !state.isPro); }

function openMenu() { const p = currentProject(); if (!p) return; ui.menuProjectName.value = p.name; ui.menuRatio.value = p.settings.ratio; ui.menuFps.value = String(p.settings.fps); ui.menuResolution.value = String(p.settings.resolution || 1080); ui.menuBgColor.value = p.settings.bgColor; if (ui.menuShowGrid) ui.menuShowGrid.checked = !!p.settings.showGridLines; if (ui.menuExportQuality) ui.menuExportQuality.value = p.settings.exportQuality || 'medium'; ui.settingsMenu.classList.remove('hidden'); }
function closeMenu() { ui.settingsMenu.classList.add('hidden'); }

function showHome() { state.playing = false; stopAudioPlayback(); ui.home.classList.add('active'); ui.editor.classList.remove('active'); renderProjectList(); }
function showEditor(pid) { state.currentProjectId = pid; state.time = 0; ui.home.classList.remove('active'); ui.editor.classList.add('active'); hydrateEditor(); }
function openProject(pid) { showEditor(pid); }

function renderProjectList() {
  ui.projectList.innerHTML = '';
  const q = (ui.projectSearch?.value || '').trim().toLowerCase();
  state.projects.filter((p) => !q || (p.name || '').toLowerCase().includes(q)).forEach((p) => {
    const item = document.createElement('div'); item.className = 'project-item';
    item.innerHTML = `<div><strong>${p.name}</strong><br><small>${p.settings.ratio} • ${p.settings.fps} FPS • ${p.settings.resolution || 1080}p • ${p.settings.bgColor}</small></div>`;
    const actions = document.createElement('div'); actions.className = 'project-actions';
    const open = document.createElement('button'); open.className = 'btn primary'; open.textContent = 'Mở'; open.onclick = () => showEditor(p.id);
    const del = document.createElement('button'); del.className = 'btn danger'; del.textContent = 'Xóa'; del.onclick = () => { state.projects = state.projects.filter((x) => x.id !== p.id); if (!state.projects.length) state.projects.push(newProject({ name: 'Dự án trống', ratio: '9:16', fps: 30, bgColor: '#000000' })); saveProjects(); renderProjectList(); };
    actions.append(open, del); item.append(actions); ui.projectList.append(item);
  });
}

function hydrateEditor() {
  const p = currentProject(); if (!p) return;
  setCanvasRatio(p.settings.ratio, p.settings.resolution);
  ui.projectTitle.textContent = p.name;
  ui.projectMeta.textContent = `${p.settings.ratio} • ${p.settings.fps} FPS • ${p.settings.resolution || 1080}p • ${p.settings.bgColor}`;
  ui.timelineDuration.value = String(p.settings.duration);
  ui.camX.value = String(p.settings.camera?.x || 0);
  ui.camY.value = String(p.settings.camera?.y || 0);
  ui.camZoom.value = String(p.settings.camera?.zoom || 1);
  ui.camRotation.value = String(p.settings.camera?.rotation || 0);
  ui.layerSelect.innerHTML = '';
  p.layers.forEach((l, i) => { const opt = document.createElement('option'); opt.value = l.id; opt.textContent = l.name === '' ? '(Untitled layer)' : (l.name || `${l.type} ${i + 1}`); ui.layerSelect.append(opt); });
  if (p.layers.length) {
    ui.layerSelect.value = p.layers[0].id;
    if (!state.selectedLayerIds.length) state.selectedLayerIds = [p.layers[0].id];
  }
  syncControlsFromNearest();
  drawEaseGraph();
  drawTimelineTracks();
  syncAudioControls();
  draw();
}

function setUnavailableCards(show) {
  if (ui.movementUnavailable) ui.movementUnavailable.classList.toggle('hidden', !show);
  if (ui.rotateUnavailable) ui.rotateUnavailable.classList.toggle('hidden', !show);
  if (ui.movePad) ui.movePad.classList.toggle('is-disabled', show);
  if (ui.rotateDial) ui.rotateDial.classList.toggle('is-disabled', show);
}

function syncControlsFromNearest() {
  ui.frameTime.value = state.time.toFixed(2);
  if (ui.frameTarget.value === 'camera') {
    const p = currentProject(); if (!p) return;
    const k = nearestTimeKey(p.settings.cameraKeyframes || [], state.time);
    if (k) ui.frameTime.value = k.time.toFixed(2);
    const list = (p.settings.cameraKeyframes || []).map((x) => x.time.toFixed(2)).join(', ');
    ui.keyframeInfo.textContent = list ? `Camera frames: ${list}` : '(Unavailable now. Expect you add a frame.)';
    const hasCamera = (p.settings.cameraKeyframes || []).length > 0;
    if (ui.cameraMissingNote) ui.cameraMissingNote.classList.toggle('hidden', hasCamera);
    ['camX', 'camY', 'camZoom', 'camRotation', 'applyCameraBtn'].forEach((id) => { if (ui[id]) ui[id].disabled = !hasCamera; });
    setUnavailableCards(true);
    syncFrameActionButton();
    syncMarkButton();
    return;
  }
  if (ui.frameTarget.value === 'audio') {
    const p = currentProject(); if (!p) return;
    const k = nearestTimeKey(p.settings.audioKeyframes || [], state.time);
    if (k) ui.frameTime.value = k.time.toFixed(2);
    const list = (p.settings.audioKeyframes || []).map((x) => x.time.toFixed(2)).join(', ');
    ui.keyframeInfo.textContent = list ? `Audio frames: ${list}` : '(Unavailable now. Expect you add a frame.)';
    setUnavailableCards(true);
    syncFrameActionButton();
    syncMarkButton();
    return;
  }
  const l = currentLayer();
  if (!l) { ui.keyframeInfo.textContent = 'Frames: (chưa có layer)'; setUnavailableCards(true); syncFrameActionButton(); return; }
  const scope = activeLayerScope();
  const k = nearestKey(l, state.time, scope);
  const tf = getTransform(l, state.time);
  ui.startX.value = Number.isFinite(+k?.x) ? k.x : tf.x;
  ui.startY.value = Number.isFinite(+k?.y) ? k.y : tf.y;
  ui.startScale.value = Number.isFinite(+k?.scale) ? k.scale : tf.scale;
  ui.startRotation.value = Number.isFinite(+k?.rotation) ? k.rotation : tf.rotation;
  ui.startOpacity.value = Number.isFinite(+k?.opacity) ? k.opacity : tf.opacity;
  if (ui.scaleQuickInput) ui.scaleQuickInput.value = String(ui.startScale.value);
  ui.easing.value = getLayerEasing(l, ui.easeTarget.value || 'position');
  ui.layerName.value = l.name || '';
  ui.layerColor.value = l.color || '#21b8ff';
  ui.layerEffectType.value = l.effect?.type || 'none';
  syncEffectTab(effectToTab(l.effect?.type || 'none'));
  ui.layerEffectStrength.value = String(l.effect?.strength ?? 0.6);
  if (ui.opacitySlider) ui.opacitySlider.value = String(Number.isFinite(+k?.opacity) ? k.opacity : tf.opacity);
  if (ui.opacityPercent) ui.opacityPercent.value = `${Math.round((Number.isFinite(+k?.opacity) ? k.opacity : tf.opacity) * 100)}%`;
  if (ui.effectReveal) ui.effectReveal.value = String(l.effect?.reveal ?? 1);
  if (ui.effectWipeAngle) ui.effectWipeAngle.value = String(l.effect?.wipeAngle ?? 0);
  if (ui.effectHue) ui.effectHue.value = String(l.effect?.hue ?? 0);
  if (ui.effectSaturation) ui.effectSaturation.value = String(l.effect?.saturation ?? 1);
  if (ui.effectBrightness) ui.effectBrightness.value = String(l.effect?.brightness ?? 1);
  if (ui.effect3DAngle) ui.effect3DAngle.value = String(l.effect?.depthAngle ?? 35);
  if (ui.effect3DDepth) ui.effect3DDepth.value = String(l.effect?.depthSize ?? 8);
  if (ui.effectRasterX) ui.effectRasterX.value = String(l.effect?.rasterX ?? 35);
  if (ui.effectRasterY) ui.effectRasterY.value = String(l.effect?.rasterY ?? 20);
  if (ui.effectRasterZ) ui.effectRasterZ.value = String(l.effect?.rasterZ ?? 8);
  if (ui.checkerColorA) ui.checkerColorA.value = l.effect?.checkerColorA || '#ffffff';
  if (ui.checkerColorB) ui.checkerColorB.value = l.effect?.checkerColorB || l.color || '#21b8ff';
  if (ui.checkerGrid) ui.checkerGrid.value = String(l.effect?.checkerGrid || 8);
  if (ui.checkerGridValue) ui.checkerGridValue.textContent = `${ui.checkerGrid?.value || 8}x${ui.checkerGrid?.value || 8}`;
  if (ui.copyBackgroundMode) ui.copyBackgroundMode.value = l.effect?.copyBackgroundMode || 'gaussianBlur';
  if (ui.copyBackgroundStrength) ui.copyBackgroundStrength.value = String(l.effect?.copyBackgroundStrength ?? 1);
  ui.textContent.value = l.text || 'TEXT';
  ui.textSize.value = String(l.size || 90);
  ui.textFontFamily.value = l.fontFamily || 'Inter';
  ui.textWeight.value = l.fontWeight || '700';
  ui.textStyle.value = l.fontStyle || 'normal';
  ui.textAlign.value = l.textAlign || 'center';
  if (ui.textLayerControls) ui.textLayerControls.classList.toggle('hidden', l.type !== 'text');
  ui.glowColor.value = l.effect?.glowColor || l.color || '#21b8ff';
  ui.glowHardness.value = String(l.effect?.glowHardness ?? 0.5);
  ui.glowAlpha.value = String(l.effect?.glowAlpha ?? 0.7);
  ui.keyframeInfo.textContent = `${scopeLabel(scope)} frames: ${getScopeKeys(l, scope).map((x) => keyTime(x, scope).toFixed(2)).join(', ') || '-'}`;
  if (k) ui.frameTime.value = keyTime(k, scope).toFixed(2);
  setUnavailableCards(!getScopeKeys(l, 'position').length);
  syncTransformWidgets();
  syncFrameActionButton();
  syncScopeKeyButtons();
  syncMarkButton();
}

function syncTransformWidgets() {
  const p = currentProject();
  if (!p) return;
  const x = +ui.startX.value || 0;
  const y = +ui.startY.value || 0;
  const rot = +ui.startRotation.value || 0;
  if (ui.moveXDisplay) ui.moveXDisplay.value = x.toFixed(2);
  if (ui.moveYDisplay) ui.moveYDisplay.value = y.toFixed(2);

  if (ui.movePad && ui.moveHandle) {
    const padRect = ui.movePad.getBoundingClientRect();
    if (padRect.width > 0 && padRect.height > 0) {
      const px = clamp((x / Math.max(1, ui.preview.width)) * padRect.width, 0, padRect.width);
      const py = clamp((y / Math.max(1, ui.preview.height)) * padRect.height, 0, padRect.height);
      ui.moveHandle.style.left = `${px}px`;
      ui.moveHandle.style.top = `${py}px`;
    }
  }

  if (ui.rotateDial && ui.rotateKnob) {
    const rect = ui.rotateDial.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const r = Math.max(12, Math.min(rect.width, rect.height) / 2 - 10);
    const deg = ((rot % 360) + 360) % 360;
    const rad = (deg * Math.PI) / 180;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    ui.rotateKnob.style.left = `${cx + Math.cos(rad) * r}px`;
    ui.rotateKnob.style.top = `${cy + Math.sin(rad) * r}px`;
    if (ui.rotateValue) ui.rotateValue.textContent = `${Math.round(rot)}°`;
    const turns = rot === 0 ? 0 : (rot > 0 ? Math.floor(rot / 360) : Math.ceil(rot / 360));
    if (ui.rotateTurns) ui.rotateTurns.textContent = turns ? `${turns}x` : '';
    ui.rotateDial.classList.toggle('has-turns', Math.abs(turns) > 0);
  }
}

function ensureKeyAtCurrent(layer) {
  const scope = activeLayerScope();
  let k = nearestKey(layer, state.time, scope);
  if (!k || Math.abs(keyTime(k, scope) - state.time) >= 0.03) {
    const tf = getTransform(layer, state.time);
    if (isIndependentLayerScope(scope)) {
      k = { id: uid(), time: state.time, [scope]: tf[scope] };
      getScopeKeys(layer, scope).push(k);
    } else {
      k = newKeyframe(state.time, tf.x, tf.y, tf.scale, tf.rotation, tf.opacity);
      ensureKeyTimes(k);
      k.times[scope] = state.time;
      layer.keyframes.push(k);
    }
  }
  sortScopeKeys(layer, scope);
  return k;
}

function addKeyframeAtCurrent() {
  const p = currentProject(); if (!p) return;
  pushHistorySnapshot();
  if (ui.frameTarget.value === 'camera') {
    if (!p.settings.cameraUnlocked) { openCameraPaywallModal(); return; }
    const c = getCameraAt(state.time);
    p.settings.cameraKeyframes.push({ id: uid(), time: state.time, x: c.x, y: c.y, zoom: c.zoom, rotation: c.rotation });
    sortTimeKeys(p.settings.cameraKeyframes);
    p.updatedAt = Date.now(); saveProjects();
    drawTimelineTracks(); syncControlsFromNearest();
    return;
  }
  if (ui.frameTarget.value === 'audio') {
    const a = getAudioAt(state.time);
    p.settings.audioKeyframes.push({ id: uid(), time: state.time, volume: a.volume, offset: a.offset });
    sortTimeKeys(p.settings.audioKeyframes);
    p.updatedAt = Date.now(); saveProjects();
    drawTimelineTracks(); syncControlsFromNearest();
    return;
  }
  const l = currentLayer(); if (!l) return;
  const scope = activeLayerScope();
  const nk = nearestKey(l, state.time, scope);
  if (!nk || Math.abs(keyTime(nk, scope) - state.time) > 0.03) {
    const tf = getTransform(l, state.time);
    if (isIndependentLayerScope(scope)) {
      getScopeKeys(l, scope).push({ id: uid(), time: state.time, [scope]: tf[scope] });
    } else {
      const created = newKeyframe(state.time, tf.x, tf.y, tf.scale, tf.rotation, tf.opacity);
      ensureKeyTimes(created);
      created.times[scope] = state.time;
      l.keyframes.push(created);
    }
    sortScopeKeys(l, scope); p.updatedAt = Date.now(); saveProjects();
  }
  drawTimelineTracks(); syncControlsFromNearest();
}

function removeNearestKeyframe() {
  const p = currentProject(); if (!p) return;
  pushHistorySnapshot();
  if (ui.frameTarget.value === 'camera') {
    if ((p.settings.cameraKeyframes || []).length <= 1) return;
    const k = nearestTimeKey(p.settings.cameraKeyframes, state.time);
    p.settings.cameraKeyframes = p.settings.cameraKeyframes.filter((x) => x.id !== k.id);
    p.updatedAt = Date.now(); saveProjects(); drawTimelineTracks(); syncControlsFromNearest(); draw();
    return;
  }
  if (ui.frameTarget.value === 'audio') {
    if ((p.settings.audioKeyframes || []).length <= 1) return;
    const k = nearestTimeKey(p.settings.audioKeyframes, state.time);
    p.settings.audioKeyframes = p.settings.audioKeyframes.filter((x) => x.id !== k.id);
    p.updatedAt = Date.now(); saveProjects(); drawTimelineTracks(); syncControlsFromNearest(); draw();
    return;
  }
  const l = currentLayer(); if (!l) return;
  const scope = activeLayerScope();
  const keys = getScopeKeys(l, scope);
  if (!keys.length || (!isIndependentLayerScope(scope) && keys.length <= 1)) return;
  const k = nearestKey(l, state.time, scope);
  if (isIndependentLayerScope(scope)) l.scopedKeyframes[scope] = keys.filter((x) => x.id !== k.id);
  else l.keyframes = keys.filter((x) => x.id !== k.id);
  p.updatedAt = Date.now(); saveProjects();
  drawTimelineTracks(); syncControlsFromNearest(); draw();
}

function applyCurrentValues() {
  const p = currentProject(); const l = currentLayer(); if (!p || !l) return;
  const scope = activeLayerScope();
  const k = ensureKeyAtCurrent(l);
  if (scope === 'position') { k.x = +ui.startX.value; k.y = +ui.startY.value; }
  else if (scope === 'rotation') k.rotation = +ui.startRotation.value;
  else if (scope === 'scale') k.scale = +ui.startScale.value;
  else if (scope === 'opacity') k.opacity = +ui.startOpacity.value;
  setLayerEasing(l, ui.easeTarget.value || scope, ui.easing.value);
  l.color = ui.layerColor.value;
  p.settings.duration = Math.max(0.2, +ui.timelineDuration.value || 2);
  p.updatedAt = Date.now(); saveProjects();
  drawEaseGraph(); drawTimelineTracks(); syncControlsFromNearest(); draw();
}

function addLayer(type) { const p = currentProject(); if (!p) return; p.layers.push(newLayer(type)); p.updatedAt = Date.now(); saveProjects(); hydrateEditor(); }
function addImageLayer(file) {
  if (!file) return;
  const p = currentProject(); if (!p) return;
  const fr = new FileReader();
  fr.onload = () => {
    const l = newLayer('image', { imageSrc: fr.result, size: 220 });
    const img = new Image(); img.onload = () => { l.imageObj = img; draw(); }; img.src = fr.result;
    p.layers.push(l); p.updatedAt = Date.now(); saveProjects(); hydrateEditor();
  };
  fr.readAsDataURL(file);
}

function drawLayerPrimitive(layer, fillOverride = null) {
  if (layer.type === 'rect') {
    ctx.fillStyle = fillOverride || layer.color;
    if (layer.frameShape === 'round') {
      ctx.beginPath();
      ctx.roundRect(-50, -50, 100, 100, 20);
      ctx.fill();
    } else if (layer.frameShape === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(0, -60); ctx.lineTo(60, 0); ctx.lineTo(0, 60); ctx.lineTo(-60, 0); ctx.closePath();
      ctx.fill();
    } else if (layer.frameShape === 'pill') {
      ctx.beginPath();
      ctx.roundRect(-70, -35, 140, 70, 35);
      ctx.fill();
    } else {
      ctx.fillRect(-50, -50, 100, 100);
    }
    return;
  }
  if (layer.type === 'circle') {
    ctx.fillStyle = fillOverride || layer.color;
    ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (layer.type === 'image') {
    const img = layer.imageObj;
    if (img) {
      const w = layer.size;
      const h = (img.height / img.width) * w;
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
    }
    return;
  }
  ctx.fillStyle = fillOverride || layer.color;
  ctx.font = `${layer.fontStyle || 'normal'} ${layer.fontWeight || '700'} ${layer.size}px ${layer.fontFamily || 'Inter'}, sans-serif`;
  ctx.textAlign = layer.textAlign || 'center';
  ctx.textBaseline = 'middle';
  const anchorX = layer.textAlign === 'left' ? -60 : layer.textAlign === 'right' ? 60 : 0;
  ctx.fillText(layer.text || 'TEXT', anchorX, 0);
}



function clipLayerPrimitivePath(layer) {
  ctx.beginPath();
  if (layer.type === 'circle') ctx.arc(0, 0, 55, 0, Math.PI * 2);
  else if (layer.frameShape === 'diamond') { ctx.moveTo(0, -60); ctx.lineTo(60, 0); ctx.lineTo(0, 60); ctx.lineTo(-60, 0); ctx.closePath(); }
  else if (layer.frameShape === 'pill') ctx.roundRect(-70, -35, 140, 70, 35);
  else if (layer.frameShape === 'round') ctx.roundRect(-50, -50, 100, 100, 20);
  else ctx.rect(-60, -60, 120, 120);
  ctx.clip();
}

function drawCopyBackgroundLayer(layer, tf) {
  const mode = layer.effect?.copyBackgroundMode || 'gaussianBlur';
  const strength = clamp(layer.effect?.copyBackgroundStrength ?? 1, 0, 2);
  ctx.save();
  clipLayerPrimitivePath(layer);
  if (mode === 'invertColor') ctx.filter = `invert(${Math.round(strength * 100)}%)`;
  else if (mode === 'grayscale') ctx.filter = `grayscale(${Math.round(strength * 100)}%)`;
  else ctx.filter = `blur(${Math.max(0.5, strength * 7).toFixed(1)}px)`;
  ctx.globalAlpha = 0.92;
  ctx.drawImage(ui.preview, -tf.x, -tf.y, ui.preview.width, ui.preview.height);
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = layer.color || '#21b8ff';
  ctx.lineWidth = 3 / Math.max(0.1, tf.scale || 1);
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.rect(-60, -60, 120, 120);
  ctx.stroke();
  ctx.restore();
}

function drawCheckerPrimitive(layer) {
  const grid = clamp(Math.round(Number(layer.effect?.checkerGrid) || 8), 2, 16);
  const size = layer.type === 'circle' ? 112 : 120;
  const cell = size / grid;
  const colorA = layer.effect?.checkerColorA || '#ffffff';
  const colorB = layer.effect?.checkerColorB || layer.color || '#21b8ff';
  ctx.save();
  if (layer.type === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
    ctx.clip();
  }
  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      ctx.fillStyle = (x + y) % 2 === 0 ? colorA : colorB;
      ctx.fillRect(-size / 2 + x * cell, -size / 2 + y * cell, cell + 0.5, cell + 0.5);
    }
  }
  ctx.restore();
}

function drawLayer(layer) {
  if (layer.visible === false) return;
  const tf = getTransform(layer, state.time);
  ctx.save();
  ctx.translate(tf.x, tf.y);
  ctx.rotate((tf.rotation * Math.PI) / 180);
  ctx.scale(tf.scale, tf.scale);
  ctx.globalAlpha = clamp(tf.opacity, 0, 1);

  const effectType = layer.effect?.type || 'none';
  const effectStrength = clamp(layer.effect?.strength ?? 0.6, 0, 2);

  if (effectType === 'wipe') {
    const reveal = clamp(layer.effect?.reveal ?? 1, 0, 1);
    const angle = ((layer.effect?.wipeAngle ?? 0) * Math.PI) / 180;
    const reach = 180;
    const cut = -reach + reveal * reach * 2;
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.rect(-reach, -reach, cut + reach, reach * 2);
    ctx.clip();
  }

  if (['glow', 'lightRays', 'glowScan', 'drawingGlowScan', 'hotColor', 'electricEdges'].includes(effectType)) {
    const gc = layer.effect?.glowColor || layer.color || '#21b8ff';
    const ga = clamp(layer.effect?.glowAlpha ?? 0.7, 0, 1);
    const gh = clamp(layer.effect?.glowHardness ?? 0.5, 0, 1);
    const hex = gc.replace('#', '');
    const to = (a,b) => parseInt(hex.slice(a,b) || '00', 16);
    ctx.shadowColor = `rgba(${to(0,2)}, ${to(2,4)}, ${to(4,6)}, ${ga})`;
    ctx.shadowBlur = (8 + effectStrength * 34) * (1.15 - gh * 0.85);
  }

  if (effectType === 'colorAdjust' || effectType === 'colorTune' || effectType === 'saturationVibrance' || effectType === 'exposureGamma') {
    const hue = clamp(layer.effect?.hue ?? 0, -180, 180);
    const sat = clamp(layer.effect?.saturation ?? 1, 0, 2);
    const bri = clamp(layer.effect?.brightness ?? 1, 0, 2);
    ctx.filter = `hue-rotate(${hue}deg) saturate(${sat}) brightness(${bri})`;
  } else if (effectType === 'invertColor') {
    ctx.filter = 'invert(1)';
  } else if (effectType === 'gradientMap' || effectType === 'colorReplace' || effectType === 'channelRemap') {
    ctx.filter = `hue-rotate(${clamp(layer.effect?.hue ?? 0, -180, 180)}deg) contrast(${1 + effectStrength * 0.35})`;
  }

  if (isBlurEffect(effectType)) {
    ctx.filter = `${ctx.filter && ctx.filter !== 'none' ? `${ctx.filter} ` : ''}blur(${Math.max(0.5, effectStrength * 4)}px)`;
  }

  if (isMoveTransformEffect(effectType)) {
    const wobble = Math.sin(state.time * Math.PI * 4) * effectStrength * 8;
    if (effectType === 'axisScale') ctx.scale(1 + effectStrength * 0.08, 1);
    else if (effectType === 'swing') ctx.rotate((wobble * Math.PI) / 180);
    else ctx.translate(wobble, effectType === 'randomJitter' || effectType === 'autoShake' ? Math.cos(state.time * Math.PI * 5) * effectStrength * 6 : 0);
  }

  if (effectType === 'rasterExtrude' || effectType === 'extrude3d' || isDistortionEffect(effectType)) {
    const depth = clamp(layer.effect?.depthSize ?? layer.effect?.rasterZ ?? 8, 0, 1000);
    const rx = clamp(layer.effect?.rasterX ?? 35, -1000, 1000);
    const ry = clamp(layer.effect?.rasterY ?? 20, -1000, 1000);
    const rz = clamp(layer.effect?.rasterZ ?? depth, -1000, 1000);
    const ang = ((layer.effect?.depthAngle ?? rz) * Math.PI) / 180;
    const dx = Math.cos(ang) * (rx / 100);
    const dy = Math.sin(ang) * (ry / 100);
    const steps = Math.min(120, Math.max(0, Math.round(Math.abs(depth))));
    const shadowColor = 'rgba(0,0,0,0.22)';
    for (let i = steps; i >= 1; i -= 1) {
      ctx.save();
      ctx.translate(dx * i, dy * i);
      ctx.rotate((rz * i * Math.PI) / 18000);
      drawLayerPrimitive(layer, shadowColor);
      ctx.restore();
    }
  }

  if (effectType === 'stars' || effectType === 'starfield') {
    const r = 70;
    ctx.save();
    ctx.fillStyle = '#fff9b6';
    for (let i = 0; i < 7; i += 1) {
      const a = (Math.PI * 2 * i) / 7;
      const sx = Math.cos(a) * (r + (i % 3) * 8);
      const sy = Math.sin(a) * (r + ((i + 1) % 3) * 6);
      const sz = 3 + effectStrength * 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy - sz);
      ctx.lineTo(sx + sz * 0.35, sy - sz * 0.35);
      ctx.lineTo(sx + sz, sy);
      ctx.lineTo(sx + sz * 0.35, sy + sz * 0.35);
      ctx.lineTo(sx, sy + sz);
      ctx.lineTo(sx - sz * 0.35, sy + sz * 0.35);
      ctx.lineTo(sx - sz, sy);
      ctx.lineTo(sx - sz * 0.35, sy - sz * 0.35);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  if (effectType === 'copyBackground') drawCopyBackgroundLayer(layer, tf);
  else if (effectType === 'checker' || effectType === 'checkerboard' || effectType === 'grid' || effectType === 'stripes') drawCheckerPrimitive(layer);
  else drawLayerPrimitive(layer);
  ctx.restore();
}


function draw() {
  const p = currentProject(); if (!p) return;
  ctx.fillStyle = p.settings.bgColor || '#000000';
  ctx.fillRect(0, 0, ui.preview.width, ui.preview.height);
  if (p.settings.showGridLines && !state.isExporting) {
    for (let x = 0; x <= ui.preview.width; x += 60) { ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.moveTo(x, 0); ctx.lineTo(x, ui.preview.height); ctx.stroke(); }
    for (let y = 0; y <= ui.preview.height; y += 60) { ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.moveTo(0, y); ctx.lineTo(ui.preview.width, y); ctx.stroke(); }
  }
  const cam = getCameraAt(state.time);
  ctx.save();
  ctx.translate(ui.preview.width / 2, ui.preview.height / 2);
  ctx.scale(Math.max(0.1, cam.zoom || 1), Math.max(0.1, cam.zoom || 1));
  ctx.rotate(((cam.rotation || 0) * Math.PI) / 180);
  ctx.translate(-ui.preview.width / 2 - (cam.x || 0), -ui.preview.height / 2 - (cam.y || 0));
  p.layers.forEach(drawLayer);
  ctx.restore();
  const ratio = p.settings.duration ? state.time / p.settings.duration : 0;
  ui.scrubber.value = String(Math.floor(ratio * 100));
  ui.timeLabel.textContent = `${state.time.toFixed(2)}s / ${p.settings.duration.toFixed(2)}s`;
}

function moveLayer(fromIdx, toIdx) {
  const p = currentProject();
  if (!p) return;
  if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0 || fromIdx >= p.layers.length || toIdx >= p.layers.length) return;
  const [item] = p.layers.splice(fromIdx, 1);
  const adjustedToIdx = fromIdx < toIdx ? toIdx - 1 : toIdx;
  p.layers.splice(adjustedToIdx, 0, item);
  p.updatedAt = Date.now();
  saveProjects();
}

function drawTimelineTracks() {
  const p = currentProject(); if (!p) return;
  ui.timelineTracks.innerHTML = '';
  const activeLayerId = ui.layerSelect.value;
  state.selectedLayerIds = state.selectedLayerIds.filter((id) => p.layers.some((l) => l.id === id));

  const calcTimeFromStrip = (strip, clientX) => {
    const rect = strip.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / Math.max(1, rect.width), 0, 1);
    return ratio * p.settings.duration;
  };

  const addTimelineMarks = (strip) => {
    const duration = Math.max(p.settings.duration, 0.001);
    (p.settings.marks || []).forEach((m) => {
      const mark = document.createElement('div');
      mark.className = 'timeline-mark-line';
      mark.style.left = `${(clamp(m.time, 0, duration) / duration) * 100}%`;
      strip.append(mark);
    });
  };

  const tryDeleteKeyWithDoubleRightClick = (payload) => {
    const key = `${payload.type}:${payload.layerId || 'system'}:${payload.keyId}`;
    const now = Date.now();
    if (state.rightDeleteLog[key] && now - state.rightDeleteLog[key] < 380) {
      pushHistorySnapshot();
      if (payload.type === 'layer') {
        if (payload.scope !== activeLayerScope()) return;
        const layer = p.layers.find((l) => l.id === payload.layerId);
        const scope = payload.scope || activeLayerScope();
        if (!layer) return;
        const keys = getScopeKeys(layer, scope);
        if (!keys.length || (!isIndependentLayerScope(scope) && keys.length <= 1)) return;
        if (isIndependentLayerScope(scope)) layer.scopedKeyframes[scope] = keys.filter((k) => k.id !== payload.keyId);
        else layer.keyframes = keys.filter((k) => k.id !== payload.keyId);
      } else if (payload.type === 'camera') {
        if (p.settings.cameraKeyframes.length <= 1) return;
        p.settings.cameraKeyframes = p.settings.cameraKeyframes.filter((k) => k.id !== payload.keyId);
      } else {
        if (p.settings.audioKeyframes.length <= 1) return;
        p.settings.audioKeyframes = p.settings.audioKeyframes.filter((k) => k.id !== payload.keyId);
      }
      p.updatedAt = Date.now();
      saveProjects();
      drawTimelineTracks();
      syncControlsFromNearest();
      draw();
      delete state.rightDeleteLog[key];
      return;
    }
    state.rightDeleteLog[key] = now;
  };

  const bindKeyDotInteractions = (dot, strip, payload) => {
    dot.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      tryDeleteKeyWithDoubleRightClick(payload);
    });
    dot.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      if (e.button === 2) {
        tryDeleteKeyWithDoubleRightClick(payload);
        return;
      }
      if (e.button !== 0 || payload.inactive) return;
      pushHistorySnapshot();
      state.selectedTimelineKey = payload;
      state.keyDrag = { payload, strip, dot };
    });
  };

  const onDragMove = (e) => {
    if (!state.keyDrag) return;
    const t = clamp(calcTimeFromStrip(state.keyDrag.strip, e.clientX), 0, p.settings.duration);
    const payload = state.keyDrag.payload;
    if (payload.inactive) return;
    if (payload.type === 'layer') {
      const layer = p.layers.find((l) => l.id === payload.layerId);
      const key = layer ? getScopeKeys(layer, payload.scope || activeLayerScope()).find((k) => k.id === payload.keyId) : null;
      if (key) {
        const scope = payload.scope || activeLayerScope();
        if (isIndependentLayerScope(scope)) key.time = t;
        else {
          ensureKeyTimes(key);
          key.times[scope] = t;
          if (scope === 'position') key.time = t;
        }
        // Keep array order stable while dragging so the marker does not jump under the cursor.
      }
    } else if (payload.type === 'camera') {
      const key = p.settings.cameraKeyframes.find((k) => k.id === payload.keyId);
      if (key) { key.time = t; sortTimeKeys(p.settings.cameraKeyframes); }
    } else {
      const key = p.settings.audioKeyframes.find((k) => k.id === payload.keyId);
      if (key) { key.time = t; sortTimeKeys(p.settings.audioKeyframes); }
    }
    state.time = t;
    if (state.keyDrag.dot) state.keyDrag.dot.style.left = `${(t / Math.max(p.settings.duration, 0.001)) * 100}%`;
    draw();
  };

  const onDragEnd = () => {
    if (state.keyDrag) {
      p.updatedAt = Date.now();
      saveProjects();
      if (state.keyDrag.payload?.type === 'layer') {
        const layer = p.layers.find((l) => l.id === state.keyDrag.payload.layerId);
        if (layer) sortScopeKeys(layer, state.keyDrag.payload.scope || activeLayerScope());
      }
      state.keyDrag = null;
      drawTimelineTracks();
      syncControlsFromNearest();
    }
  };
  if (state.keyDragHandlers) {
    window.removeEventListener('mousemove', state.keyDragHandlers.move);
    window.removeEventListener('mouseup', state.keyDragHandlers.up);
  }
  state.keyDragHandlers = { move: onDragMove, up: onDragEnd };
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);

  p.layers.forEach((l, idx) => {
    const row = document.createElement('div');
    row.className = `timeline-row scope-${activeLayerScope()}`;
    row.dataset.index = String(idx);

    const left = document.createElement('div'); left.className = 'timeline-left';
    const dragHandle = document.createElement('button');
    dragHandle.className = 'btn drag-handle';
    dragHandle.draggable = true;
    dragHandle.textContent = '☰';
    dragHandle.title = 'Kéo để đổi vị trí layer';

    const lockBtn = document.createElement('button'); lockBtn.className = 'btn'; lockBtn.textContent = l.locked ? '🔒' : '🔓'; lockBtn.onclick = (e) => { e.stopPropagation(); l.locked = !l.locked; saveProjects(); drawTimelineTracks(); };
    const eyeBtn = document.createElement('button'); eyeBtn.className = 'btn eye-btn'; eyeBtn.textContent = '👁'; if (l.visible === false) eyeBtn.classList.add('is-hidden'); eyeBtn.onclick = (e) => { e.stopPropagation(); l.visible = l.visible === false ? true : false; saveProjects(); drawTimelineTracks(); draw(); };
    const chip = document.createElement('span'); chip.className = 'track-chip'; chip.style.background = l.color;
    const name = document.createElement('strong'); name.textContent = `${l.name === '' ? '(Untitled layer)' : (l.name || `${l.type} ${idx + 1}`)}${l.groupId ? ` [${l.groupId}]` : ''}`;
    left.append(dragHandle, lockBtn, eyeBtn, chip, name);

    const strip = document.createElement('div'); strip.className = `timeline-strip ${idx === 0 ? 'main' : ''}`;
    addTimelineMarks(strip);
    const playhead = document.createElement('div'); playhead.className = 'playhead'; playhead.style.left = `${(state.time / Math.max(p.settings.duration, 0.001)) * 100}%`;
    strip.append(playhead);

    ['position', 'rotation', 'scale', 'opacity'].forEach((scope) => {
      sortScopeKeys(l, scope);
      getScopeKeys(l, scope).forEach((k) => {
        if (!isIndependentLayerScope(scope)) ensureKeyTimes(k);
        const d = document.createElement('div');
        const inactive = scope !== activeLayerScope();
        d.className = `key-dot ${scope}-key-dot${inactive ? ' parallel-key-dot' : ''}`;
        const t = keyTime(k, scope);
        d.style.left = `${(t / Math.max(p.settings.duration, 0.001)) * 100}%`;
        if (Math.abs(t - state.time) <= 0.04 && !inactive) d.classList.add('active');
        if (!inactive) bindKeyDotInteractions(d, strip, { type: 'layer', layerId: l.id, keyId: k.id, scope });
        else d.title = `${scopeLabel(scope)} keyframe is parallel/inactive while ${scopeLabel(activeLayerScope())} is active`;
        strip.append(d);
      });
    });

    row.onclick = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (state.selectedLayerIds.includes(l.id)) state.selectedLayerIds = state.selectedLayerIds.filter((id) => id !== l.id);
        else state.selectedLayerIds.push(l.id);
      } else {
        state.selectedLayerIds = [l.id];
      }
      ui.layerSelect.value = l.id;
      syncControlsFromNearest();
      drawTimelineTracks();
    };
    if (activeLayerId === l.id) row.classList.add('selected');
    if (state.selectedLayerIds.includes(l.id)) row.classList.add('multi-selected');

    dragHandle.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', row.dataset.index);
      e.dataTransfer.effectAllowed = 'move';
      row.classList.add('dragging-row');
    });
    dragHandle.addEventListener('dragend', () => row.classList.remove('dragging-row'));
    row.addEventListener('dragover', (e) => { e.preventDefault(); row.classList.add('drag-over'); });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('drag-over');
      const fromIdx = Number(e.dataTransfer.getData('text/plain'));
      const toIdx = Number(row.dataset.index);
      moveLayer(fromIdx, toIdx);
      ui.layerSelect.value = activeLayerId;
      hydrateEditor();
      drawTimelineTracks();
    });

    row.append(left, strip);
    ui.timelineTracks.append(row);
  });

  const appendSystemRow = (label, keys, icon, type) => {
    const row = document.createElement('div');
    row.className = 'timeline-row system-row';
    const left = document.createElement('div'); left.className = 'timeline-left';
    const name = document.createElement('strong'); name.textContent = `${icon} ${label}`;
    left.append(name);

    const strip = document.createElement('div'); strip.className = 'timeline-strip';
    addTimelineMarks(strip);
    const playhead = document.createElement('div'); playhead.className = 'playhead'; playhead.style.left = `${(state.time / Math.max(p.settings.duration, 0.001)) * 100}%`;
    strip.append(playhead);

    (keys || []).forEach((k) => {
      const d = document.createElement('div');
      d.className = 'key-dot';
      d.style.left = `${(k.time / Math.max(p.settings.duration, 0.001)) * 100}%`;
      if (Math.abs(k.time - state.time) <= 0.04) d.classList.add('active');
      bindKeyDotInteractions(d, strip, { type, keyId: k.id });
      strip.append(d);
    });

    row.append(left, strip);
    ui.timelineTracks.append(row);
  };

  if ((p.settings.cameraKeyframes || []).length) appendSystemRow('Camera', p.settings.cameraKeyframes, '📷', 'camera');
  appendSystemRow('Audio', p.settings.audioKeyframes, '🔊', 'audio');
  if (ui.markInfo) ui.markInfo.textContent = `Marks: ${(p.settings.marks || []).map((m) => m.time.toFixed(2)).join(', ') || '-'}`;
  syncMarkButton();
}

function drawEaseGraph() {
  const p = currentProject(); if (!p) return;
  const cm = p.settings.customEase;
  const { x: bx, y: by, w, h } = getEaseBounds();
  gctx.fillStyle = '#0b0f17'; gctx.fillRect(0, 0, ui.easeGraph.width, ui.easeGraph.height);
  gctx.strokeStyle = 'rgba(255,255,255,.25)'; gctx.strokeRect(bx, by, w, h);

  const start = graphToCanvas(0, 0);
  const end = graphToCanvas(1, 1);
  const cp1 = graphToCanvas(cm.p1x, cm.p1y);
  const cp2 = graphToCanvas(cm.p2x, cm.p2y);

  gctx.strokeStyle = 'rgba(255,255,255,.35)';
  gctx.lineWidth = 1;
  gctx.beginPath(); gctx.moveTo(start.x, start.y); gctx.lineTo(cp1.x, cp1.y); gctx.stroke();
  gctx.beginPath(); gctx.moveTo(end.x, end.y); gctx.lineTo(cp2.x, cp2.y); gctx.stroke();

  const mode = ui.easing.value || 'easeInOut';
  gctx.beginPath(); gctx.strokeStyle = '#55d4ff';
  for (let i = 0; i <= 100; i += 1) {
    const t = i / 100;
    let xVal = t;
    let yVal = easeValue(t, mode);
    if (mode === 'custom') {
      xVal = cubicBezierAt(t, cm.p1x, cm.p2x);
      yVal = cubicBezierAt(t, cm.p1y, cm.p2y);
    }
    const px = bx + xVal * w;
    const py = (by + h) - yVal * h;
    if (i === 0) gctx.moveTo(px, py); else gctx.lineTo(px, py);
  }
  gctx.stroke();

  if (mode === 'custom') {
    drawEaseHandle(cp1.x, cp1.y);
    drawEaseHandle(cp2.x, cp2.y);
  }
}

function getEaseBounds() {
  return { x: 10, y: 10, w: ui.easeGraph.width - 20, h: ui.easeGraph.height - 20 };
}

function graphToCanvas(nx, ny) {
  const { x, y, w, h } = getEaseBounds();
  return { x: x + nx * w, y: (y + h) - ny * h };
}

function canvasToGraph(cx, cy) {
  const { x, y, w, h } = getEaseBounds();
  return { nx: clamp((cx - x) / w, 0, 1), ny: clamp(((y + h) - cy) / h, 0, 1) };
}

function drawEaseHandle(x, y) {
  gctx.beginPath();
  gctx.fillStyle = '#d9d9d9';
  gctx.strokeStyle = '#ffffff';
  gctx.lineWidth = 3;
  gctx.arc(x, y, 11, 0, Math.PI * 2);
  gctx.fill();
  gctx.stroke();
}

function pickEaseHandle(x, y) {
  const p = currentProject();
  if (!p) return null;
  const cm = p.settings.customEase;
  const cp1 = graphToCanvas(cm.p1x, cm.p1y);
  const cp2 = graphToCanvas(cm.p2x, cm.p2y);
  const d1 = Math.hypot(x - cp1.x, y - cp1.y);
  const d2 = Math.hypot(x - cp2.x, y - cp2.y);
  if (Math.min(d1, d2) > 18) return null;
  return d1 <= d2 ? 'p1' : 'p2';
}

function bindEaseGraphDrag() {
  ui.easeGraph.addEventListener('pointerdown', (e) => {
    if (ui.easing.value !== 'custom') return;
    const rect = ui.easeGraph.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (ui.easeGraph.width / rect.width);
    const y = (e.clientY - rect.top) * (ui.easeGraph.height / rect.height);
    const handle = pickEaseHandle(x, y);
    if (!handle) return;
    state.easeDrag = handle;
    ui.easeGraph.setPointerCapture(e.pointerId);
  });

  ui.easeGraph.addEventListener('pointermove', (e) => {
    if (!state.easeDrag || ui.easing.value !== 'custom') return;
    const p = currentProject();
    if (!p) return;
    const rect = ui.easeGraph.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (ui.easeGraph.width / rect.width);
    const y = (e.clientY - rect.top) * (ui.easeGraph.height / rect.height);
    const { nx, ny } = canvasToGraph(x, y);
    if (state.easeDrag === 'p1') {
      p.settings.customEase.p1x = nx;
      p.settings.customEase.p1y = ny;
    } else {
      p.settings.customEase.p2x = nx;
      p.settings.customEase.p2y = ny;
    }
    p.updatedAt = Date.now();
    saveProjects();
    drawEaseGraph();
    draw();
  });

  const endDrag = () => { state.easeDrag = null; };
  ui.easeGraph.addEventListener('pointerup', endDrag);
  ui.easeGraph.addEventListener('pointercancel', endDrag);
}

function tick(ts) {
  if (!state.playing) return;
  const p = currentProject(); if (!p) return;
  if (!state.startRef) state.startRef = ts - state.time * 1000;
  const elapsed = (ts - state.startRef) / 1000;
  const step = 1 / (p.settings.fps || 30);
  state.time = Math.min(Math.floor(elapsed / step) * step, p.settings.duration);
  if (state.time >= p.settings.duration) { state.playing = false; state.startRef = 0; stopAudioPlayback(); }
  syncAudioPlayback();
  draw(); drawTimelineTracks();
  requestAnimationFrame(tick);
}

function projectPixelSize(p) {
  const { w, h } = parseRatio(p.settings.ratio || '9:16');
  const longEdge = Number(p.settings.resolution) || 1080;
  return w >= h ? { width: longEdge, height: Math.round(longEdge * h / w) } : { width: Math.round(longEdge * w / h), height: longEdge };
}

function estimateExportSize(p, fps = p.settings.fps || 30, resolution = p.settings.resolution || 1080) {
  const quality = p.settings.exportQuality || 'medium';
  const qualityFactor = { low: 0.55, medium: 1, high: 1.8, ultra: 2.7 }[quality] || 1;
  const bitrate = Math.floor(resolution * 8500 * qualityFactor);
  return Math.max(0.1, (bitrate * (p.settings.duration || 1)) / 8 / 1024 / 1024 * (fps / 30));
}

function downloadText(filename, text, type = 'text/plain') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function xmlSafe(value) {
  return String(value ?? '').replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
}

function exportLayerKeys(layer) {
  return ['position', 'rotation', 'scale', 'opacity'].flatMap((scope) => (
    sortedKeysForScope(layer, scope).map((key) => ({ ...key, exportScope: scope, exportTime: keyTime(key, scope) }))
  )).sort((a, b) => a.exportTime - b.exportTime);
}

function projectToXml(p) {
  const size = projectPixelSize(p);
  const layers = (p.layers || []).map((layer) => {
    const sorted = exportLayerKeys(layer);
    const start = sorted[0]?.exportTime ?? 0;
    const end = sorted[sorted.length - 1]?.exportTime ?? (p.settings.duration || 0);
    const first = sorted[0] || {};
    const keyframes = sorted.map((k) => `      <keyframe id="${xmlSafe(k.id)}" time="${k.exportTime}" x="${k.x ?? ''}" y="${k.y ?? ''}" scale="${k.scale ?? ''}" rotation="${k.rotation ?? ''}" opacity="${k.opacity ?? ''}" scope="${xmlSafe(k.exportScope)}" />`).join('\n');
    const effect = layer.effect || {};
    return `    <layer id="${xmlSafe(layer.id)}" name="${xmlSafe(layer.name || '')}" type="${xmlSafe(layer.type)}" start="${start}" end="${end}">
      <transform x="${first.x ?? 0}" y="${first.y ?? 0}" scale="${first.scale ?? 1}" rotation="${first.rotation ?? 0}" opacity="${first.opacity ?? 1}" />
      <keyframes>
${keyframes}
      </keyframes>
      <effect name="${xmlSafe(effect.type || 'none')}" strength="${effect.strength ?? 0}" hue="${effect.hue ?? 0}" saturation="${effect.saturation ?? 1}" brightness="${effect.brightness ?? 1}" blur="${effect.copyBackgroundStrength ?? ''}" />
      <source filename="${xmlSafe(layer.sourceName || layer.imageName || '')}" path="${xmlSafe(layer.sourcePath || layer.imageSrc || '')}" />
    </layer>`;
  }).join('\n');
  const audio = (p.settings.audioTracks || []).map((track) => `    <asset type="audio" filename="${xmlSafe(track.name)}" path="${xmlSafe(track.src)}" offset="${track.offset || 0}" volume="${track.volume ?? 1}" />`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<alightMotionWebProject id="${xmlSafe(p.id)}" name="${xmlSafe(p.name)}">
  <overview resolution="${size.width}x${size.height}" ratio="${xmlSafe(p.settings.ratio)}" fps="${p.settings.fps}" duration="${p.settings.duration}" background="${xmlSafe(p.settings.bgColor)}" />
  <layers>
${layers}
  </layers>
  <assets>
${audio}
  </assets>
</alightMotionWebProject>
`;
}

function importProjectFromXml(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  if (doc.querySelector('parsererror')) throw new Error('Invalid XML');
  const root = doc.querySelector('alightMotionWebProject');
  if (!root) throw new Error('Unsupported XML');
  const overview = root.querySelector('overview');
  const p = newProject({
    name: root.getAttribute('name') || 'Imported XML Project',
    ratio: overview?.getAttribute('ratio') || '9:16',
    fps: Number(overview?.getAttribute('fps')) || 30,
    resolution: Number((overview?.getAttribute('resolution') || '1080x1920').split('x').pop()) || 1080,
    bgColor: overview?.getAttribute('background') || '#000000'
  });
  p.settings.duration = Number(overview?.getAttribute('duration')) || p.settings.duration;
  p.layers = Array.from(root.querySelectorAll('layer')).map((node, idx) => {
    const layer = newLayer(node.getAttribute('type') || 'rect', { name: node.getAttribute('name') || `Imported Layer ${idx + 1}`, keyframes: [] });
    const effect = node.querySelector('effect');
    if (effect) {
      layer.effect.type = effect.getAttribute('name') || 'none';
      layer.effect.strength = Number(effect.getAttribute('strength')) || 0;
      layer.effect.hue = Number(effect.getAttribute('hue')) || 0;
      layer.effect.saturation = Number(effect.getAttribute('saturation')) || 1;
      layer.effect.brightness = Number(effect.getAttribute('brightness')) || 1;
    }
    Array.from(node.querySelectorAll('keyframe')).forEach((k) => {
      const scope = k.getAttribute('scope') || 'position';
      const key = newKeyframe(Number(k.getAttribute('time')) || 0, Number(k.getAttribute('x')) || 0, Number(k.getAttribute('y')) || 0, Number(k.getAttribute('scale')) || 1, Number(k.getAttribute('rotation')) || 0, Number(k.getAttribute('opacity')) || 1);
      if (isIndependentLayerScope(scope)) ensureScopedKeyStore(layer)[scope].push(key);
      else layer.keyframes.push(key);
    });
    if (!layer.keyframes.length) layer.keyframes.push(newKeyframe(0));
    return layer;
  });
  return normalizeProject(p);
}

function openExportMenu() {
  const p = currentProject(); if (!p) return;
  if (ui.exportEstimatedSize) ui.exportEstimatedSize.textContent = `${estimateExportSize(p).toFixed(1)} MB`;
  if (ui.exportVideoResolution) ui.exportVideoResolution.value = String(p.settings.resolution || 1080);
  if (ui.exportVideoFps) ui.exportVideoFps.value = String(p.settings.fps || 30);
  if (ui.projectPackageUrl) {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify({ version: 1, project: p }))));
    ui.projectPackageUrl.value = `${location.origin}${location.pathname}#importProject=${payload}`;
  }
  ui.exportMenuModal?.classList.remove('hidden');
}
function closeExportMenu() { ui.exportMenuModal?.classList.add('hidden'); }

async function exportVideoMp4(options = {}) {
  const p = currentProject(); if (!p) return;
  if (state.isExporting) return;
  const mp4Types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=h264', 'video/mp4'];
  const mimeType = mp4Types.find((t) => MediaRecorder.isTypeSupported(t));
  if (!mimeType) {
    alert('Trình duyệt này không hỗ trợ xuất MP4 trực tiếp bằng MediaRecorder. Hãy dùng Chrome mới hoặc cài pipeline chuyển mã.');
    return;
  }

  const exportFps = Number(options.fps) || p.settings.fps || 30;
  const exportResolution = Number(options.resolution) || p.settings.resolution || 1080;
  const quality = p.settings.exportQuality || 'medium';
  const qualityFactor = { low: 0.55, medium: 1, high: 1.8, ultra: 2.7 }[quality] || 1;
  const bitrate = Math.floor(exportResolution * 8500 * qualityFactor);

  const stream = ui.preview.captureStream(exportFps);
  const a = p.settings.audio;
  let exportAudio = null;
  let audioCtx = null;
  let gainNode = null;
  let mediaDest = null;
  let canCaptureAudio = false;

  if (a?.src) {
    exportAudio = new Audio(a.src);
    exportAudio.preload = 'auto';
    exportAudio.crossOrigin = 'anonymous';
    exportAudio.currentTime = 0;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      try {
        audioCtx = new AudioCtx();
        gainNode = audioCtx.createGain();
        mediaDest = audioCtx.createMediaStreamDestination();
        const source = audioCtx.createMediaElementSource(exportAudio);
        source.connect(gainNode);
        gainNode.connect(mediaDest);
        const audioTracks = mediaDest.stream.getAudioTracks();
        audioTracks.forEach((t) => stream.addTrack(t));
        canCaptureAudio = audioTracks.length > 0;
      } catch (_) {
        canCaptureAudio = false;
      }
    }
    if (!canCaptureAudio) {
      const capture = exportAudio.captureStream?.() || exportAudio.mozCaptureStream?.() || null;
      const tracks = capture?.getAudioTracks?.() || [];
      tracks.forEach((t) => stream.addTrack(t));
      canCaptureAudio = tracks.length > 0;
    }
  }

  const rec = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: bitrate });
  const chunks = [];
  let cleaned = false;
  rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  rec.onstop = () => {
    if (state.exportSession?.cancelled) return;
    const blob = new Blob(chunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${p.name || 'project'}.mp4`; a.click();
    URL.revokeObjectURL(url);
  };

  showExportOverlay();
  state.isExporting = true;
  state.exportSession = { cancelled: false };

  const cleanupExport = () => {
    if (cleaned) return;
    cleaned = true;
    stopAudioPlayback();
    if (exportAudio) exportAudio.pause();
    if (audioCtx) audioCtx.close().catch(() => {});
    state.isExporting = false;
    state.exportSession = null;
    hideExportOverlay();
    draw();
  };

  const cancelExport = () => {
    if (!state.exportSession || state.exportSession.cancelled) return;
    state.exportSession.cancelled = true;
    if (rec.state !== 'inactive') rec.stop();
    cleanupExport();
  };

  if (ui.exportCancelBtn) ui.exportCancelBtn.onclick = cancelExport;
  rec.start();

  const qualitySteps = Math.max(10, Math.round(36 * qualityFactor));
  for (let i = 0; i < qualitySteps; i += 1) {
    if (state.exportSession?.cancelled) return;
    draw();
    setExportProgress((i / Math.max(1, qualitySteps)) * 45);
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  if (exportAudio) {
    if (state.exportSession?.cancelled) return;
    await exportAudio.play().catch(() => {});
    if (audioCtx?.state === 'suspended') await audioCtx.resume().catch(() => {});
  }

  const start = performance.now();
  function loop(now) {
    if (state.exportSession?.cancelled) return;
    const el = (now - start) / 1000;
    state.time = Math.min(el, p.settings.duration);
    if (exportAudio) {
      const at = getAudioAt(state.time);
      const target = Math.max(0, state.time - (at.offset || 0));
      const vol = clamp(at.volume ?? 1, 0, 2);
      if (gainNode) gainNode.gain.value = vol;
      else exportAudio.volume = vol;
      if (Math.abs((exportAudio.currentTime || 0) - target) > 0.18) exportAudio.currentTime = target;
    }
    draw();
    drawTimelineTracks();
    const timelinePart = state.time / Math.max(0.001, p.settings.duration);
    setExportProgress(45 + timelinePart * 55);
    if (el < p.settings.duration) requestAnimationFrame(loop);
    else {
      if (rec.state !== 'inactive') rec.stop();
      cleanupExport();
    }
  }
  requestAnimationFrame(loop);
}


function posOnCanvas(e) {
  const rect = ui.preview.getBoundingClientRect();
  return { x: (e.clientX - rect.left) * (ui.preview.width / rect.width), y: (e.clientY - rect.top) * (ui.preview.height / rect.height) };
}
function hitLayer(x, y) {
  const p = currentProject(); if (!p) return null;
  for (let i = p.layers.length - 1; i >= 0; i -= 1) {
    const l = p.layers[i]; if (l.visible === false) continue;
    const tf = getTransform(l, state.time); const r = l.type === 'circle' ? 55 * tf.scale : 60 * tf.scale;
    const dx = x - tf.x; const dy = y - tf.y;
    if (dx * dx + dy * dy <= r * r) return l;
  }
  return null;
}

function bindDrag() {
  ui.preview.addEventListener('pointerdown', (e) => {
    const { x, y } = posOnCanvas(e);
    const l = hitLayer(x, y);
    if (!l || l.locked) return;
    const tf = getTransform(l, state.time);
    const p = currentProject();
    const grouped = l.groupId ? p.layers.filter((x) => x.groupId === l.groupId) : [l];
    state.drag = {
      layerId: l.id,
      dx: x - tf.x,
      dy: y - tf.y,
      group: grouped.map((g) => {
        const gtf = getTransform(g, state.time);
        return { id: g.id, x: gtf.x, y: gtf.y };
      })
    };
    ui.preview.classList.add('dragging');
    ui.layerSelect.value = l.id;
    syncControlsFromNearest();
  });
  window.addEventListener('pointermove', (e) => {
    if (!state.drag) return;
    const p = currentProject(); const l = currentLayer(); if (!p || !l || l.locked) return;
    const { x, y } = posOnCanvas(e);
    const anchorX = clamp(x - state.drag.dx, 0, ui.preview.width);
    const anchorY = clamp(y - state.drag.dy, 0, ui.preview.height);
    const anchorStart = state.drag.group.find((g) => g.id === l.id) || { x: anchorX, y: anchorY };
    const offX = anchorX - anchorStart.x;
    const offY = anchorY - anchorStart.y;
    state.drag.group.forEach((g) => {
      const gl = p.layers.find((x2) => x2.id === g.id);
      if (!gl || gl.locked) return;
      const k = ensureKeyAtCurrent(gl);
      k.x = clamp(g.x + offX, 0, ui.preview.width);
      k.y = clamp(g.y + offY, 0, ui.preview.height);
    });
    p.updatedAt = Date.now(); saveProjects();
    syncControlsFromNearest(); drawTimelineTracks(); draw();
  });
  window.addEventListener('pointerup', () => { state.drag = null; ui.preview.classList.remove('dragging'); });
}

function bind() {
  ui.loginGoogleBtn.onclick = () => signInWithFirebaseProvider('Google').catch((e) => alert(e?.message || 'Google sign in failed'));
  ui.loginGithubBtn.onclick = () => signInWithFirebaseProvider('GitHub').catch((e) => alert(e?.message || 'GitHub sign in failed'));
  ui.openAuthBtn.onclick = () => openAuthModal('signin');
  ui.closeAuthModalBtn.onclick = closeAuthModal;
  ui.authModal.onclick = (e) => { if (e.target === ui.authModal) closeAuthModal(); };
  ui.closeOtpModalBtn.onclick = closeOtpModal;
  ui.otpModal.onclick = (e) => { if (e.target === ui.otpModal) closeOtpModal(); };
  ui.verifyOtpBtn.onclick = async () => { try { await verifyOtpAndSignIn(); } catch (e) { alert(e?.message || 'Invalid OTP'); } };
  ui.authSignInBtn.onclick = async () => {
    try {
      if (state.authMode === 'signup') await signUpReal();
      else await signInReal();
    } catch (e) {
      alert(e?.message || 'Authentication failed');
    }
  };
  ui.closeGuestModalBtn.onclick = closeGuestModal;
  ui.guestModal.onclick = (e) => { if (e.target === ui.guestModal) closeGuestModal(); };
  ui.guestSignInBtn.onclick = () => { closeGuestModal(); openAuthModal('signin'); };
  ui.guestSignUpBtn.onclick = () => { closeGuestModal(); openAuthModal('signup'); };
  ui.logoutBtn.onclick = async () => { const auth = getFirebaseAuth(); if (auth) await auth.signOut().catch(() => {}); state.session = null; state.authToken = ''; localStorage.removeItem(AUTH_TOKEN_KEY); localStorage.removeItem(AUTH_PROVIDER_KEY); saveSession(); renderSession(); renderCloudList(); };
  ui.refreshCloudBtn.onclick = renderCloudList;
  if (ui.navHomeBtn) ui.navHomeBtn.onclick = () => showHome();
  if (ui.navProjectsBtn) ui.navProjectsBtn.onclick = () => {
    showHome();
    document.getElementById('projectListTitle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  if (ui.navCloudBtn) ui.navCloudBtn.onclick = () => {
    showHome();
    document.getElementById('cloudTitle')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  if (ui.navPurchaseHistoryBtn) ui.navPurchaseHistoryBtn.onclick = openPurchaseHistoryModal;
  if (ui.profileIconBtn) ui.profileIconBtn.onclick = () => ui.profileDropdown?.classList.toggle('hidden');
  if (ui.yourProfileBtn) ui.yourProfileBtn.onclick = openProfileModal;
  if (ui.studioBtn) ui.studioBtn.onclick = openStudioModal;
  if (ui.profileSettingsBtn) ui.profileSettingsBtn.onclick = () => { ui.profileDropdown?.classList.add('hidden'); openMenu(); };
  if (ui.closeProfileModalBtn) ui.closeProfileModalBtn.onclick = closeProfileModal;
  if (ui.profileModal) ui.profileModal.onclick = (e) => { if (e.target === ui.profileModal) closeProfileModal(); };
  if (ui.closeStudioModalBtn) ui.closeStudioModalBtn.onclick = closeStudioModal;
  if (ui.studioModal) ui.studioModal.onclick = (e) => { if (e.target === ui.studioModal) closeStudioModal(); };
  if (ui.followDemoBtn) ui.followDemoBtn.onclick = () => { state.profileStats.following = (state.profileStats.following || 0) + 1; saveProfileStats(); updateStudioStats(); };
  if (ui.cloudApiBase) {
    ui.cloudApiBase.value = state.cloudApiBase;
    updateCloudApiHint();
    ui.cloudApiBase.onchange = () => { saveCloudApiBase(ui.cloudApiBase.value); renderCloudList(); };
  }
  ui.projectSearch.oninput = renderProjectList;
  ui.cloudSearch.oninput = renderCloudList;
  ui.languageSelect.onchange = () => applyLanguage(ui.languageSelect.value);

  ui.createProjectBtn.onclick = openCreateModal;
  ui.closeModalBtn.onclick = closeCreateModal;
  ui.modal.onclick = (e) => { if (e.target === ui.modal) closeCreateModal(); };
  ui.ratioRow.onclick = (e) => {
    const btn = e.target.closest('.ratio-btn'); if (!btn) return;
    state.modalRatio = btn.dataset.ratio;
    ui.ratioRow.querySelectorAll('.ratio-btn').forEach((b) => b.classList.toggle('selected', b === btn));
  };
  ui.modalBgColor.oninput = () => { ui.modalBgHex.value = ui.modalBgColor.value.toUpperCase(); };
  ui.confirmCreateBtn.onclick = () => {
    const p = newProject({ name: ui.modalProjectName.value.trim(), ratio: state.modalRatio, fps: +ui.modalFps.value, resolution: +ui.modalResolution.value, bgColor: ui.modalBgColor.value });
    state.projects.unshift(p); saveProjects(); closeCreateModal(); renderProjectList();
  };

  ui.openMenuBtn.onclick = openMenu;
  ui.closeMenuBtn.onclick = closeMenu;
  ui.settingsMenu.onclick = (e) => { if (e.target === ui.settingsMenu) closeMenu(); };
  ui.saveMenuBtn.onclick = () => {
    const p = currentProject(); if (!p) return;
    p.name = ui.menuProjectName.value.trim() || p.name;
    p.settings.ratio = ui.menuRatio.value;
    p.settings.fps = clamp(+ui.menuFps.value || 30, 12, 120);
    p.settings.resolution = Math.max(144, +ui.menuResolution.value || 1080);
    p.settings.bgColor = ui.menuBgColor.value || '#000000';
    if (ui.menuShowGrid) p.settings.showGridLines = !!ui.menuShowGrid.checked;
    if (ui.menuExportQuality) p.settings.exportQuality = ui.menuExportQuality.value || 'medium';
    p.updatedAt = Date.now(); saveProjects(); closeMenu(); hydrateEditor();
  };

  ui.themeToggleBtn.onclick = () => applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  ui.backHomeBtn.onclick = showHome;

  ui.addRect.onclick = () => { pushHistorySnapshot(); addLayer('rect'); };
  ui.addCircle.onclick = () => { pushHistorySnapshot(); addLayer('circle'); };
  ui.addText.onclick = () => { pushHistorySnapshot(); addLayer('text'); };
  ui.addImageBtn.onclick = () => addImageLayer(ui.imageInput.files?.[0]);
  ui.deleteLayer.onclick = () => {
    const p = currentProject(); if (!p) return;
    pushHistorySnapshot();
    p.layers = p.layers.filter((l) => l.id !== ui.layerSelect.value);
    p.updatedAt = Date.now(); saveProjects(); hydrateEditor();
  };

  ui.layerSelect.onchange = () => { state.selectedLayerIds = [ui.layerSelect.value]; syncControlsFromNearest(); drawTimelineTracks(); };
  ui.layerName.oninput = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.name = ui.layerName.value;
    p.updatedAt = Date.now();
    saveProjects();
    const opt = Array.from(ui.layerSelect.options).find((o) => o.value === l.id);
    if (opt) opt.textContent = l.name || '(Untitled layer)';
    drawTimelineTracks();
  };
  ui.textContent.oninput = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.text = ui.textContent.value;
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ui.textSize.oninput = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.size = clamp(+ui.textSize.value || 90, 8, 240);
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ui.textFontFamily.onchange = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.fontFamily = ui.textFontFamily.value;
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ui.textWeight.onchange = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.fontWeight = ui.textWeight.value;
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ui.textStyle.onchange = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.fontStyle = ui.textStyle.value;
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ui.textAlign.onchange = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.textAlign = ui.textAlign.value;
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ui.groupLayerBtn.onclick = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    const selected = state.selectedLayerIds.length > 1
      ? p.layers.filter((x) => state.selectedLayerIds.includes(x.id))
      : [l, p.layers[p.layers.findIndex((x) => x.id === l.id) - 1]].filter(Boolean);
    if (selected.length < 2) return;
    const gid = selected.find((x) => x.groupId)?.groupId || `G${Date.now().toString().slice(-4)}`;
    selected.forEach((x) => { x.groupId = gid; });
    p.updatedAt = Date.now();
    saveProjects();
    hydrateEditor();
  };
  ui.ungroupLayerBtn.onclick = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    const selected = state.selectedLayerIds.length ? p.layers.filter((x) => state.selectedLayerIds.includes(x.id)) : [l];
    selected.forEach((x) => { x.groupId = null; });
    p.updatedAt = Date.now();
    saveProjects();
    hydrateEditor();
  };
  ui.frameTarget.onchange = () => { syncControlsFromNearest(); syncFrameActionButton(); };
  ui.frameTime.oninput = () => {
    const p = currentProject(); if (!p) return;
    const t = clamp(+ui.frameTime.value || 0, 0, p.settings.duration);
    const selected = state.selectedTimelineKey;
    if (ui.frameTarget.value === 'camera') {
      const k = (selected?.type === 'camera' && selected?.keyId)
        ? (p.settings.cameraKeyframes || []).find((x) => x.id === selected.keyId)
        : nearestTimeKey(p.settings.cameraKeyframes || [], state.time);
      if (!k) return;
      k.time = t; sortTimeKeys(p.settings.cameraKeyframes);
    } else if (ui.frameTarget.value === 'audio') {
      const k = (selected?.type === 'audio' && selected?.keyId)
        ? (p.settings.audioKeyframes || []).find((x) => x.id === selected.keyId)
        : nearestTimeKey(p.settings.audioKeyframes || [], state.time);
      if (!k) return;
      k.time = t; sortTimeKeys(p.settings.audioKeyframes);
    } else {
      const l = currentLayer(); if (!l) return;
      const scope = selected?.scope || activeLayerScope();
      const k = (selected?.type === 'layer' && selected?.layerId === l.id && selected?.keyId)
        ? l.keyframes.find((x) => x.id === selected.keyId)
        : nearestKey(l, state.time, scope);
      if (!k) return;
      ensureKeyTimes(k);
      k.times[scope] = t;
      if (scope === 'position') k.time = t;
      sortKf(l);
    }
    p.updatedAt = Date.now();
    state.time = t;
    saveProjects();
    drawTimelineTracks();
    syncControlsFromNearest();
    draw();
  };
  ui.layerColor.oninput = applyCurrentValues;
  ui.layerEffectType.onchange = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.effect = l.effect || { type: 'none', strength: 0.6, glowColor: '#21b8ff', glowHardness: 0.5, glowAlpha: 0.7, reveal: 1, wipeAngle: 0, hue: 0, saturation: 1, brightness: 1, depthAngle: 35, depthSize: 8, rasterX: 35, rasterY: 20, rasterZ: 8, checkerColorA: '#ffffff', checkerColorB: '#21b8ff', checkerGrid: 8, copyBackgroundMode: 'gaussianBlur', copyBackgroundStrength: 1 };
    l.effect.type = ui.layerEffectType.value;
    syncEffectTab(effectToTab(l.effect.type));
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ui.layerEffectStrength.oninput = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    pushHistorySnapshot();
    l.effect = l.effect || { type: 'none', strength: 0.6, glowColor: '#21b8ff', glowHardness: 0.5, glowAlpha: 0.7, reveal: 1, wipeAngle: 0, hue: 0, saturation: 1, brightness: 1, depthAngle: 35, depthSize: 8, rasterX: 35, rasterY: 20, rasterZ: 8, checkerColorA: '#ffffff', checkerColorB: '#21b8ff', checkerGrid: 8, copyBackgroundMode: 'gaussianBlur', copyBackgroundStrength: 1 };
    l.effect.strength = clamp(+ui.layerEffectStrength.value || 0, 0, 2);
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  if (ui.opacitySlider) {
    ui.opacitySlider.oninput = () => {
      const v = clamp(+ui.opacitySlider.value || 0, 0, 1);
      activateTransformScope('opacity');
      ui.startOpacity.value = String(v);
      if (ui.opacityPercent) ui.opacityPercent.value = `${Math.round(v * 100)}%`;
      applyCurrentValues();
    };
  }
  if (ui.scaleQuickInput) {
    ui.scaleQuickInput.oninput = () => {
      activateTransformScope('scale');
      ui.startScale.value = ui.scaleQuickInput.value;
      applyCurrentValues();
    };
  }
  if (ui.scaleUpBtn) ui.scaleUpBtn.onclick = () => {
    activateTransformScope('scale');
    const v = (+ui.startScale.value || 1) + 0.1;
    ui.startScale.value = String(v.toFixed(2));
    if (ui.scaleQuickInput) ui.scaleQuickInput.value = ui.startScale.value;
    applyCurrentValues();
  };
  if (ui.scaleDownBtn) ui.scaleDownBtn.onclick = () => {
    activateTransformScope('scale');
    const v = Math.max(0.1, (+ui.startScale.value || 1) - 0.1);
    ui.startScale.value = String(v.toFixed(2));
    if (ui.scaleQuickInput) ui.scaleQuickInput.value = ui.startScale.value;
    applyCurrentValues();
  };
  if (ui.frameActionMiniBtn) ui.frameActionMiniBtn.onclick = () => ui.frameActionBtn?.click();
  if (ui.easeGraphModeBtn) ui.easeGraphModeBtn.onclick = () => { ui.easing.value = 'custom'; drawEaseGraph(); };
  const applyGlowControl = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    l.effect = l.effect || { type: 'none', strength: 0.6, glowColor: '#21b8ff', glowHardness: 0.5, glowAlpha: 0.7, reveal: 1, wipeAngle: 0, hue: 0, saturation: 1, brightness: 1, depthAngle: 35, depthSize: 8, rasterX: 35, rasterY: 20, rasterZ: 8, checkerColorA: '#ffffff', checkerColorB: '#21b8ff', checkerGrid: 8, copyBackgroundMode: 'gaussianBlur', copyBackgroundStrength: 1 };
    l.effect.glowColor = ui.glowColor.value;
    l.effect.glowHardness = clamp(+ui.glowHardness.value || 0, 0, 1);
    l.effect.glowAlpha = clamp(+ui.glowAlpha.value || 0, 0, 1);
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ui.glowColor.oninput = applyGlowControl;
  ui.glowHardness.oninput = applyGlowControl;
  ui.glowAlpha.oninput = applyGlowControl;
  const applyAdvancedEffectControl = () => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l) return;
    l.effect = l.effect || { type: 'none', strength: 0.6, glowColor: '#21b8ff', glowHardness: 0.5, glowAlpha: 0.7, reveal: 1, wipeAngle: 0, hue: 0, saturation: 1, brightness: 1, depthAngle: 35, depthSize: 8, rasterX: 35, rasterY: 20, rasterZ: 8, checkerColorA: '#ffffff', checkerColorB: '#21b8ff', checkerGrid: 8, copyBackgroundMode: 'gaussianBlur', copyBackgroundStrength: 1 };
    l.effect.reveal = clamp(+ui.effectReveal.value || 0, 0, 1);
    l.effect.wipeAngle = (+ui.effectWipeAngle.value % 360 + 360) % 360;
    l.effect.hue = clamp(+ui.effectHue.value || 0, -180, 180);
    l.effect.saturation = clamp(+ui.effectSaturation.value || 1, 0, 2);
    l.effect.brightness = clamp(+ui.effectBrightness.value || 1, 0, 2);
    l.effect.depthAngle = (+ui.effect3DAngle.value % 360 + 360) % 360;
    l.effect.depthSize = clamp(+ui.effect3DDepth.value || 0, 0, 1000);
    l.effect.rasterX = clamp(+ui.effectRasterX?.value || 0, -1000, 1000);
    l.effect.rasterY = clamp(+ui.effectRasterY?.value || 0, -1000, 1000);
    l.effect.rasterZ = clamp(+ui.effectRasterZ?.value || 0, -1000, 1000);
    l.effect.checkerColorA = ui.checkerColorA?.value || '#ffffff';
    l.effect.checkerColorB = ui.checkerColorB?.value || l.color || '#21b8ff';
    l.effect.checkerGrid = clamp(Math.round(+ui.checkerGrid?.value || 8), 2, 16);
    if (ui.checkerGridValue) ui.checkerGridValue.textContent = `${l.effect.checkerGrid}x${l.effect.checkerGrid}`;
    l.effect.copyBackgroundMode = ui.copyBackgroundMode?.value || 'gaussianBlur';
    l.effect.copyBackgroundStrength = clamp(+ui.copyBackgroundStrength?.value || 1, 0, 2);
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  ['effectReveal', 'effectWipeAngle', 'effectHue', 'effectSaturation', 'effectBrightness', 'effect3DAngle', 'effect3DDepth', 'effectRasterX', 'effectRasterY', 'effectRasterZ', 'checkerColorA', 'checkerColorB', 'checkerGrid', 'copyBackgroundMode', 'copyBackgroundStrength'].forEach((k) => {
    if (ui[k]) ui[k].oninput = applyAdvancedEffectControl;
  });
  document.querySelectorAll('.effect-tab-btn').forEach((btn) => {
    btn.onclick = () => {
      const tab = btn.dataset.effectTab || 'glow';
      syncEffectTab(tab);
      const p = currentProject(); const l = currentLayer();
      if (!p || !l) return;
      const effectType = tabToEffect(tab);
      l.effect = l.effect || { type: 'none', strength: 0.6, glowColor: '#21b8ff', glowHardness: 0.5, glowAlpha: 0.7, reveal: 1, wipeAngle: 0, hue: 0, saturation: 1, brightness: 1, depthAngle: 35, depthSize: 8, rasterX: 35, rasterY: 20, rasterZ: 8, checkerColorA: '#ffffff', checkerColorB: '#21b8ff', checkerGrid: 8, copyBackgroundMode: 'gaussianBlur', copyBackgroundStrength: 1 };
      l.effect.type = effectType;
      ui.layerEffectType.value = effectType;
      p.updatedAt = Date.now();
      saveProjects();
      draw();
    };
  });
  ui.frameActionBtn.onclick = () => {
    const p = currentProject();
    if (!p) return;
    const target = ui.frameTarget.value;
    const l = currentLayer();
    if (hasExactFrameAtCurrent(target, p, l)) removeNearestKeyframe();
    else addKeyframeAtCurrent();
    syncFrameActionButton();
  syncScopeKeyButtons();
  syncMarkButton();
  };
  if (ui.prevFrameBtn) ui.prevFrameBtn.onclick = () => goToTimelinePoint(-1);
  if (ui.nextFrameBtn) ui.nextFrameBtn.onclick = () => goToTimelinePoint(1);
  if (ui.markPartBtn) ui.markPartBtn.onclick = () => {
    const p = currentProject();
    if (!p) return;
    pushHistorySnapshot();
    p.settings.marks = p.settings.marks || [];
    const existing = nearestMark(p);
    if (existing && Math.abs(existing.time - state.time) <= 0.03) {
      p.settings.marks = p.settings.marks.filter((m) => m.id !== existing.id);
    } else {
      p.settings.marks.push({ id: uid(), time: clamp(state.time, 0, p.settings.duration) });
    }
    p.updatedAt = Date.now();
    saveProjects();
    drawTimelineTracks();
    syncMarkButton();
  };
  if (ui.easeTarget) ui.easeTarget.onchange = () => { const l = currentLayer(); activateTransformScope(ui.easeTarget.value || 'position'); if (l) ui.easing.value = getLayerEasing(l, ui.easeTarget.value); drawEaseGraph(); };

  if (ui.scaleKeyBtn) ui.scaleKeyBtn.onclick = () => {
    activateTransformScope('scale');
    const p = currentProject();
    const l = currentLayer();
    if (!p || !l) return;
    if (hasExactFrameAtCurrent('layer', p, l)) removeNearestKeyframe();
    else addKeyframeAtCurrent();
    syncScopeKeyButtons();
  };
  if (ui.opacityKeyBtn) ui.opacityKeyBtn.onclick = () => {
    activateTransformScope('opacity');
    const p = currentProject();
    const l = currentLayer();
    if (!p || !l) return;
    if (hasExactFrameAtCurrent('layer', p, l)) removeNearestKeyframe();
    else addKeyframeAtCurrent();
    syncScopeKeyButtons();
  };

  ui.applyBtn.onclick = applyCurrentValues;
  ['startX', 'startY'].forEach((k) => ui[k].addEventListener('focus', () => activateTransformScope('position')));
  if (ui.startRotation) ui.startRotation.addEventListener('focus', () => activateTransformScope('rotation'));
  if (ui.startScale) ui.startScale.addEventListener('focus', () => activateTransformScope('scale'));
  if (ui.startOpacity) ui.startOpacity.addEventListener('focus', () => activateTransformScope('opacity'));
  ['timelineDuration', 'easing', 'startX', 'startY', 'startScale', 'startRotation', 'startOpacity'].forEach((k) => ui[k].addEventListener('input', () => {
    if (k === 'startScale') activateTransformScope('scale');
    else if (k === 'startOpacity') activateTransformScope('opacity');
    else if (k === 'startRotation') activateTransformScope('rotation');
    else if (k === 'startX' || k === 'startY') activateTransformScope('position');
    applyCurrentValues();
  }));
  ui.applyCameraBtn.onclick = () => {
    const p = currentProject();
    if (!p) return;
    if (!(p.settings.cameraKeyframes || []).length) return;
    pushHistorySnapshot();
    p.settings.camera = {
      x: +ui.camX.value || 0,
      y: +ui.camY.value || 0,
      zoom: Math.max(0.1, +ui.camZoom.value || 1),
      rotation: +ui.camRotation.value || 0
    };
    const ck = nearestTimeKey(p.settings.cameraKeyframes || [], state.time);
    if (ck) {
      ck.x = p.settings.camera.x;
      ck.y = p.settings.camera.y;
      ck.zoom = p.settings.camera.zoom;
      ck.rotation = p.settings.camera.rotation;
    }
    p.updatedAt = Date.now();
    saveProjects();
    draw();
  };
  if (ui.addCameraBtn) ui.addCameraBtn.onclick = () => {
    const p = currentProject();
    if (p && (p.settings.cameraKeyframes || []).length) { alert('Camera frame has been exist on this project.'); return; }
    openCameraPaywallModal();
  };
  if (ui.closeCameraPaywallBtn) ui.closeCameraPaywallBtn.onclick = closeCameraPaywallModal;
  if (ui.cameraPaywallModal) ui.cameraPaywallModal.onclick = (e) => { if (e.target === ui.cameraPaywallModal) closeCameraPaywallModal(); };
  if (ui.buyProBtn) ui.buyProBtn.onclick = () => {
    state.isPro = true;
    localStorage.setItem('alightProDemoV1', '1');
    unlockCameraFrameForProject(currentProject());
    syncProBadge();
    openProSuccessModal();
    closeCameraPaywallModal();
  };
  if (ui.watchAdBtn) ui.watchAdBtn.onclick = () => { unlockCameraFrameForProject(currentProject()); alert('Watch Ad complete. Camera frame added.'); closeCameraPaywallModal(); };
  if (ui.closeProSuccessBtn) ui.closeProSuccessBtn.onclick = closeProSuccessModal;
  if (ui.proSuccessModal) ui.proSuccessModal.onclick = (e) => { if (e.target === ui.proSuccessModal) closeProSuccessModal(); };
  if (ui.closePurchaseHistoryBtn) ui.closePurchaseHistoryBtn.onclick = closePurchaseHistoryModal;
  if (ui.purchaseHistoryModal) ui.purchaseHistoryModal.onclick = (e) => { if (e.target === ui.purchaseHistoryModal) closePurchaseHistoryModal(); };
  if (ui.unsubscribeBtn) ui.unsubscribeBtn.onclick = () => {
    state.isPro = false;
    localStorage.removeItem('alightProDemoV1');
    syncProBadge();
    alert('Unsubscribed successfully.');
    closePurchaseHistoryModal();
  };

  ui.undoBtn.onclick = undo;
  ui.redoBtn.onclick = redo;
  ui.playBtn.onclick = () => { state.playing = true; state.startRef = 0; syncAudioPlayback(); audioPlayer.play().catch(() => {}); audioPlayers.forEach((a)=>a.play().catch(() => {})); requestAnimationFrame(tick); };
  ui.pauseBtn.onclick = () => { state.playing = false; state.startRef = 0; stopAudioPlayback(); };
  ui.resetBtn.onclick = () => { state.playing = false; state.startRef = 0; state.time = 0; if (audioPlayer.src) audioPlayer.currentTime = 0; audioPlayers.forEach((a)=>{ if (a.src) a.currentTime = 0; }); stopAudioPlayback(); draw(); drawTimelineTracks(); syncControlsFromNearest(); };
  ui.exportVideoBtn.onclick = openExportMenu;
  if (ui.closeExportMenuBtn) ui.closeExportMenuBtn.onclick = closeExportMenu;
  if (ui.exportMenuModal) ui.exportMenuModal.onclick = (e) => { if (e.target === ui.exportMenuModal) closeExportMenu(); };
  document.querySelectorAll('.export-choice').forEach((btn) => {
    btn.onclick = () => {
      document.querySelectorAll('.export-choice').forEach((b) => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.export-detail').forEach((panel) => panel.classList.toggle('active', panel.dataset.exportDetail === btn.dataset.exportPanel));
    };
  });
  if (ui.startVideoExportBtn) ui.startVideoExportBtn.onclick = () => {
    closeExportMenu();
    exportVideoMp4({ resolution: +ui.exportVideoResolution.value || undefined, fps: +ui.exportVideoFps.value || undefined });
  };
  if (ui.downloadXmlBtn) ui.downloadXmlBtn.onclick = () => {
    const p = currentProject(); if (!p) return;
    downloadText(`${p.name || 'project'}.xml`, projectToXml(p), 'application/xml');
  };
  if (ui.copyPackageUrlBtn) ui.copyPackageUrlBtn.onclick = async () => {
    if (!ui.projectPackageUrl?.value) return;
    await navigator.clipboard?.writeText(ui.projectPackageUrl.value).catch(() => {});
    alert('Project package URL copied.');
  };
  if (ui.startGifExportBtn) ui.startGifExportBtn.onclick = () => {
    const p = currentProject(); if (!p) return;
    downloadText(`${p.name || 'project'}-gif-settings.json`, JSON.stringify({ type: 'gif', size: ui.exportGifSize.value, fps: +ui.exportGifFps.value || 15, note: 'GIF render pipeline placeholder for this web demo.' }, null, 2), 'application/json');
  };
  if (ui.startSequenceExportBtn) ui.startSequenceExportBtn.onclick = () => {
    const p = currentProject(); if (!p) return;
    const fps = +ui.exportSequenceFps.value || 30;
    const frameCount = Math.ceil((p.settings.duration || 0) * fps);
    downloadText(`${p.name || 'project'}-image-sequence-manifest.json`, JSON.stringify({ type: 'image-sequence', size: ui.exportSequenceSize.value, fps, frameCount }, null, 2), 'application/json');
  };
  if (ui.xmlImportBtn) ui.xmlImportBtn.onclick = () => ui.xmlImportInput?.click();
  if (ui.xmlImportInput) ui.xmlImportInput.onchange = () => {
    const file = ui.xmlImportInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = importProjectFromXml(String(reader.result || ''));
        state.projects.unshift(imported);
        saveProjects();
        renderProjectList();
        openProject(imported.id);
      } catch (err) {
        alert(`Cannot import XML: ${err.message}`);
      }
      ui.xmlImportInput.value = '';
    };
    reader.readAsText(file);
  };
  if (ui.exportCancelBtn) ui.exportCancelBtn.onclick = () => {
    if (state.exportSession) state.exportSession.cancelled = true;
  };
  ui.publishProjectBtn.onclick = openPublishModal;
  if (ui.closePublishModalBtn) ui.closePublishModalBtn.onclick = closePublishModal;
  if (ui.publishModal) ui.publishModal.onclick = (e) => { if (e.target === ui.publishModal) closePublishModal(); };
  if (ui.confirmPublishBtn) ui.confirmPublishBtn.onclick = publishCurrentProject;
  if (ui.closeCloudViewerBtn) ui.closeCloudViewerBtn.onclick = closeCloudViewer;
  if (ui.cloudViewerModal) ui.cloudViewerModal.onclick = (e) => { if (e.target === ui.cloudViewerModal) closeCloudViewer(); };
  if (ui.cloudPlayPauseBtn) ui.cloudPlayPauseBtn.onclick = () => {
    if (state.cloudPlayerTimer) {
      clearInterval(state.cloudPlayerTimer);
      state.cloudPlayerTimer = null;
      ui.cloudPlayPauseBtn.textContent = '▶ Play';
      return;
    }
    ui.cloudPlayPauseBtn.textContent = '⏸ Pause';
    state.cloudPlayerTimer = setInterval(() => {
      const p = state.activeCloudItem?.project;
      const duration = Math.max(0.1, p?.settings?.duration || 2);
      const speed = Number(ui.cloudSpeed?.value) || 1;
      state.cloudPlayerTime = Math.min(duration, state.cloudPlayerTime + 0.1 * speed);
      if (ui.cloudDuration) ui.cloudDuration.value = String((state.cloudPlayerTime / duration) * 100);
      if (state.cloudPlayerTime >= duration) {
        clearInterval(state.cloudPlayerTimer);
        state.cloudPlayerTimer = null;
        ui.cloudPlayPauseBtn.textContent = '▶ Play';
      }
    }, 100);
  };
  if (ui.cloudDuration) ui.cloudDuration.oninput = () => {
    const duration = Math.max(0.1, state.activeCloudItem?.project?.settings?.duration || 2);
    state.cloudPlayerTime = (Number(ui.cloudDuration.value) / 100) * duration;
  };
  if (ui.cloudLikeBtn) ui.cloudLikeBtn.onclick = () => { if (state.activeCloudItem) { state.activeCloudItem.likes = (state.activeCloudItem.likes || 0) + 1; ui.cloudLikeBtn.textContent = `👍 Like ${state.activeCloudItem.likes}`; } };
  if (ui.cloudDislikeBtn) ui.cloudDislikeBtn.onclick = () => { if (state.activeCloudItem) { state.activeCloudItem.dislikes = (state.activeCloudItem.dislikes || 0) + 1; ui.cloudDislikeBtn.textContent = `👎 Dislike ${state.activeCloudItem.dislikes}`; } };
  if (ui.cloudDetailsBtn) ui.cloudDetailsBtn.onclick = () => ui.cloudDetailsBox?.classList.toggle('hidden');
  ui.scrubber.oninput = () => { const p = currentProject(); if (!p) return; state.playing = false; state.time = (+ui.scrubber.value / 100) * p.settings.duration; syncAudioPlayback(); draw(); drawTimelineTracks(); syncControlsFromNearest(); syncFrameActionButton(); };
  ui.zoomToggleBtn.onclick = () => {
    state.previewZoomEnabled = !state.previewZoomEnabled;
    applyPreviewZoom();
  };
  ui.preview.addEventListener('wheel', (e) => {
    if (!state.previewZoomEnabled) return;
    e.preventDefault();
    state.previewScale = clamp(state.previewScale + (e.deltaY < 0 ? 0.1 : -0.1), 0.5, 3);
    applyPreviewZoom();
  }, { passive: false });
  ui.addAudioBtn.onclick = () => {
    const p = currentProject();
    const files = Array.from(ui.audioInput.files || []);
    if (!p || !files.length) return;
    pushHistorySnapshot();
    const readers = files.map((file) => new Promise((resolve) => {
      const fr = new FileReader();
      fr.onload = () => resolve({ file, src: fr.result });
      fr.readAsDataURL(file);
    }));
    Promise.all(readers).then((items) => {
      p.settings.audioTracks = p.settings.audioTracks || [];
      items.forEach(({ file, src }) => {
        p.settings.audioTracks.push({ id: uid(), name: file.name, src, volume: clamp(+ui.audioVolume.value || 1, 0, 2), offset: Math.max(0, +ui.audioOffset.value || 0) });
      });
      const first = p.settings.audioTracks[0];
      if (first) p.settings.audio = { src: first.src, name: first.name, volume: first.volume, offset: first.offset };
      p.updatedAt = Date.now();
      saveProjects();
      syncAudioControls();
    });
  };
  ui.removeAudioBtn.onclick = () => {
    const p = currentProject();
    if (!p) return;
    pushHistorySnapshot();
    p.settings.audio = { src: null, name: '', volume: 1, offset: 0 };
    p.settings.audioTracks = [];
    p.updatedAt = Date.now();
    saveProjects();
    syncAudioControls();
  };
  ui.audioVolume.oninput = () => {
    const p = currentProject();
    if (!p) return;
    pushHistorySnapshot();
    p.settings.audio.volume = clamp(+ui.audioVolume.value || 1, 0, 2);
    (p.settings.audioTracks || []).forEach((t) => { t.volume = p.settings.audio.volume; });
    const ak = nearestTimeKey(p.settings.audioKeyframes || [], state.time); if (ak) ak.volume = p.settings.audio.volume;
    p.updatedAt = Date.now();
    saveProjects();
    syncAudioControls();
  };
  ui.audioOffset.oninput = () => {
    const p = currentProject();
    if (!p) return;
    pushHistorySnapshot();
    p.settings.audio.offset = Math.max(0, +ui.audioOffset.value || 0);
    (p.settings.audioTracks || []).forEach((t) => { t.offset = p.settings.audio.offset; });
    const ak = nearestTimeKey(p.settings.audioKeyframes || [], state.time); if (ak) ak.offset = p.settings.audio.offset;
    p.updatedAt = Date.now();
    saveProjects();
    syncAudioControls();
  };


  const otpInputs = Array.from(document.querySelectorAll('.otp-digit'));
  otpInputs.forEach((inp, idx) => {
    inp.addEventListener('input', () => {
      inp.value = (inp.value || '').replace(/\D/g, '').slice(0, 1);
      if (inp.value && otpInputs[idx + 1]) otpInputs[idx + 1].focus();
      ui.otpCode.value = otpInputs.map((x) => x.value || '').join('');
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value && otpInputs[idx - 1]) otpInputs[idx - 1].focus();
    });
  });

  const applyMovementFromEvent = (evt) => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l || !ui.movePad || ui.movePad.classList.contains('is-disabled')) return;
    const r = ui.movePad.getBoundingClientRect();
    const px = clamp(evt.clientX - r.left, 0, r.width);
    const py = clamp(evt.clientY - r.top, 0, r.height);
    ui.startX.value = String((px / Math.max(1, r.width)) * ui.preview.width);
    ui.startY.value = String((py / Math.max(1, r.height)) * ui.preview.height);
    syncTransformWidgets();
    applyCurrentValues();
  };
  if (ui.movePad) {
    let moving = false;
    ui.movePad.addEventListener('pointerdown', (e) => { activateTransformScope('position'); moving = true; ui.movePad.setPointerCapture(e.pointerId); applyMovementFromEvent(e); });
    ui.movePad.addEventListener('pointermove', (e) => { if (moving) applyMovementFromEvent(e); });
    ui.movePad.addEventListener('pointerup', () => { moving = false; });
    ui.movePad.addEventListener('pointercancel', () => { moving = false; });
  }

  const angleFromRotationEvent = (evt) => {
    const r = ui.rotateDial.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return Math.atan2(evt.clientY - cy, evt.clientX - cx) * 180 / Math.PI;
  };
  const signedAngleDelta = (current, previous) => {
    let delta = current - previous;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    return delta;
  };
  const applyRotationFromEvent = (evt) => {
    const p = currentProject(); const l = currentLayer();
    if (!p || !l || !ui.rotateDial || ui.rotateDial.classList.contains('is-disabled') || !state.rotationDrag) return;
    const angle = angleFromRotationEvent(evt);
    state.rotationDrag.rotation += signedAngleDelta(angle, state.rotationDrag.lastAngle);
    state.rotationDrag.lastAngle = angle;
    ui.startRotation.value = String(state.rotationDrag.rotation);
    syncTransformWidgets();
    applyCurrentValues();
  };
  if (ui.rotateDial) {
    let rotating = false;
    const endRotation = () => { rotating = false; state.rotationDrag = null; };
    ui.rotateDial.addEventListener('pointerdown', (e) => {
      activateTransformScope('rotation');
      const p = currentProject(); const l = currentLayer();
      if (!p || !l || ui.rotateDial.classList.contains('is-disabled')) return;
      rotating = true;
      ui.rotateDial.setPointerCapture(e.pointerId);
      state.rotationDrag = { lastAngle: angleFromRotationEvent(e), rotation: +ui.startRotation.value || 0 };
    });
    ui.rotateDial.addEventListener('pointermove', (e) => { if (rotating) applyRotationFromEvent(e); });
    ui.rotateDial.addEventListener('pointerup', endRotation);
    ui.rotateDial.addEventListener('pointercancel', endRotation);
  }

  const animateCollapse = (card, body, btn) => {
    const h = body.scrollHeight;
    body.style.maxHeight = `${h}px`;
    body.style.opacity = '1';
    body.style.transform = 'translateY(0)';
    void body.offsetHeight;
    card.classList.add('is-collapsed');
    btn.setAttribute('aria-expanded', 'false');
    body.style.maxHeight = '0px';
    body.style.opacity = '0';
    body.style.transform = 'translateY(-6px)';
  };

  const animateExpand = (card, body, btn) => {
    card.classList.remove('is-collapsed');
    btn.setAttribute('aria-expanded', 'true');
    body.style.maxHeight = '0px';
    body.style.opacity = '0';
    body.style.transform = 'translateY(-6px)';
    requestAnimationFrame(() => {
      body.style.maxHeight = `${body.scrollHeight}px`;
      body.style.opacity = '1';
      body.style.transform = 'translateY(0)';
    });
    const onDone = (e) => {
      if (e.propertyName !== 'max-height') return;
      body.style.maxHeight = 'none';
      body.removeEventListener('transitionend', onDone);
      requestAnimationFrame(syncTransformWidgets);
    };
    body.addEventListener('transitionend', onDone);
  };


  const cardControls = new Map();
  const activateTransformScope = (scope) => {
    setActiveLayerScope(scope, { refresh: false });
    cardControls.forEach(({ card, body, btn }, id) => {
      const shouldOpen = (state.activeKeyScope === 'position' && id === 'movementCard') || (state.activeKeyScope === 'rotation' && id === 'rotateCard');
      if (shouldOpen && card.classList.contains('is-collapsed')) animateExpand(card, body, btn);
      if (!shouldOpen && !card.classList.contains('is-collapsed') && (id === 'movementCard' || id === 'rotateCard')) animateCollapse(card, body, btn);
    });
    drawTimelineTracks();
    syncControlsFromNearest();
    drawEaseGraph();
  };

  document.querySelectorAll('.card-collapse-btn').forEach((btn) => {
    const targetId = btn.getAttribute('data-collapse-target');
    const body = targetId ? document.getElementById(targetId) : null;
    const card = btn.closest('.control-card');
    if (!body || !card) return;
    cardControls.set(card.id, { card, body, btn });
    body.style.maxHeight = `${body.scrollHeight}px`;
    btn.addEventListener('click', () => {
      if (card.id === 'movementCard') { activateTransformScope('position'); return; }
      if (card.id === 'rotateCard') { activateTransformScope('rotation'); return; }
      if (card.classList.contains('is-collapsed')) animateExpand(card, body, btn);
      else animateCollapse(card, body, btn);
    });
  });

  document.getElementById('movementCard')?.addEventListener('pointerdown', (e) => { if (!e.target.closest?.('.card-collapse-btn')) activateTransformScope('position'); });
  document.getElementById('rotateCard')?.addEventListener('pointerdown', (e) => { if (!e.target.closest?.('.card-collapse-btn')) activateTransformScope('rotation'); });

  bindDrag();
  bindEaseGraphDrag();
  if (ui.hotAlertCloseBtn) {
    ui.hotAlertCloseBtn.onclick = () => {
      state.hotAlertDismissed = true;
      hideHotAlert();
    };
  }
}

function preloadImages() {
  state.projects.forEach((p) => p.layers.forEach((l) => {
    if (l.type === 'image' && l.imageSrc) {
      const img = new Image(); img.onload = () => { l.imageObj = img; if (p.id === state.currentProjectId) draw(); }; img.src = l.imageSrc;
    }
  }));
}

async function init() {
  loadProjects();
  loadSession();
  if (state.authToken) {
    const provider = localStorage.getItem(AUTH_PROVIDER_KEY);
    if (state.authToken.startsWith('local-') || provider === 'firebase') {
      state.session = state.session || null;
    } else {
      try {
        const r = await fetch(apiUrl('/api/auth/me'), { headers: { ...authHeaders() } });
        if (r.ok) state.session = await r.json();
        else { state.session = null; state.authToken = ''; localStorage.removeItem(AUTH_TOKEN_KEY); localStorage.removeItem(AUTH_PROVIDER_KEY); }
      } catch {}
    }
  }
  preloadImages();
  bind();
  renderAuthMode();
  applyPreviewZoom();
  applyTheme(state.theme);
  if (ui.languageSelect) ui.languageSelect.value = state.language;
  applyLanguage(state.language);
  syncProBadge();
  renderSession();
  renderCloudList();
  setupSocketIo();
  syncFrameActionButton();
  setupThermalMonitor().catch(() => {});
  showHome();
}

document.addEventListener('DOMContentLoaded', init);
