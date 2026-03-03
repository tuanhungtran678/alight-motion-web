function getEl(id) { return document.getElementById(id); }
function clamp(v, mi, ma) { return Math.min(ma, Math.max(mi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function uid() { return crypto.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function bezier(t, p0, p1, p2, p3) { const nt = 1 - t; return nt ** 3 * p0 + 3 * nt ** 2 * t * p1 + 3 * nt * t ** 2 * p2 + t ** 3 * p3; }

const STORAGE_KEY = 'alightProjectsV3';
const ui = {
  home: getEl('homeScreen'), editor: getEl('editorScreen'), createProjectBtn: getEl('createProjectBtn'), projectList: getEl('projectList'),
  projectTitle: getEl('projectTitle'), projectMeta: getEl('projectMeta'), backHomeBtn: getEl('backHomeBtn'), themeToggleBtn: getEl('themeToggleBtn'),
  settingsMenu: getEl('settingsMenu'), openMenuBtn: getEl('openMenuBtn'), closeMenuBtn: getEl('closeMenuBtn'),
  menuProjectName: getEl('menuProjectName'), menuRatio: getEl('menuRatio'), menuFps: getEl('menuFps'), menuBgColor: getEl('menuBgColor'), saveMenuBtn: getEl('saveMenuBtn'),
  modal: getEl('createProjectModal'), closeModalBtn: getEl('closeModalBtn'), ratioRow: getEl('ratioRow'), modalFps: getEl('modalFps'), modalProjectName: getEl('modalProjectName'), modalBgColor: getEl('modalBgColor'), modalBgHex: getEl('modalBgHex'), confirmCreateBtn: getEl('confirmCreateBtn'),
  preview: getEl('preview'), playBtn: getEl('playBtn'), pauseBtn: getEl('pauseBtn'), resetBtn: getEl('resetBtn'), exportVideoBtn: getEl('exportVideoBtn'), scrubber: getEl('scrubber'), timeLabel: getEl('timeLabel'),
  addRect: getEl('addRect'), addCircle: getEl('addCircle'), addText: getEl('addText'), imageInput: getEl('imageInput'), addImageBtn: getEl('addImageBtn'), deleteLayer: getEl('deleteLayer'), layerSelect: getEl('layerSelect'), layerColor: getEl('layerColor'),
  timelineDuration: getEl('timelineDuration'), timelineTracks: getEl('timelineTracks'), addKeyBtn: getEl('addKeyBtn'), removeKeyBtn: getEl('removeKeyBtn'), keyframeInfo: getEl('keyframeInfo'),
  startX: getEl('startX'), startY: getEl('startY'), startScale: getEl('startScale'), startRotation: getEl('startRotation'), startOpacity: getEl('startOpacity'),
  easing: getEl('easing'), cp1x: getEl('cp1x'), cp1y: getEl('cp1y'), cp2x: getEl('cp2x'), cp2y: getEl('cp2y'), applyBtn: getEl('applyBtn'), easeGraph: getEl('easeGraph')
};
const ctx = ui.preview.getContext('2d');
const gctx = ui.easeGraph.getContext('2d');

const state = { projects: [], currentProjectId: null, time: 0, playing: false, startRef: 0, modalRatio: '9:16', drag: null, theme: localStorage.getItem('uiTheme') || 'dark' };

function parseRatio(r) { const [w, h] = r.split(':').map(Number); return { w: w || 9, h: h || 16 }; }
function newKeyframe(time, x = 180, y = 320, scale = 1, rotation = 0, opacity = 1) { return { id: uid(), time, x, y, scale, rotation, opacity }; }
function newLayer(type, extra = {}) { return { id: uid(), type, color: '#21b8ff', text: 'TEXT', size: 90, imageSrc: null, imageObj: null, easing: 'easeInOut', visible: true, locked: false, keyframes: [newKeyframe(0), newKeyframe(2, 180, 180, 1.4, 360, 1)], ...extra }; }
function newProject({ name, ratio, fps, bgColor }) {
  return { id: uid(), name: name || `Project ${state.projects.length + 1}`, createdAt: Date.now(), updatedAt: Date.now(), settings: { ratio: ratio || '9:16', fps: Number(fps) || 30, bgColor: bgColor || '#000000', duration: 2, customEase: { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1 } }, layers: [] };
}

function saveProjects() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects)); }
function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  state.projects = raw ? JSON.parse(raw) : [];
  if (!state.projects.length) {
    state.projects.push(newProject({ name: 'Dự án trống', ratio: '9:16', fps: 30, bgColor: '#000000' }));
    saveProjects();
  }
}

function currentProject() { return state.projects.find((p) => p.id === state.currentProjectId) || null; }
function currentLayer() { const p = currentProject(); if (!p) return null; return p.layers.find((l) => l.id === ui.layerSelect.value) || p.layers[0] || null; }
function sortKf(layer) { layer.keyframes.sort((a, b) => a.time - b.time); }
function nearestKey(layer, t) { if (!layer.keyframes.length) return null; return layer.keyframes.reduce((best, k) => Math.abs(k.time - t) < Math.abs(best.time - t) ? k : best, layer.keyframes[0]); }

function easeValue(t, mode) {
  const p = currentProject(); const c = p?.settings.customEase || { p1y: 0.1, p2y: 1 };
  if (mode === 'easeIn') return t * t;
  if (mode === 'easeOut') return 1 - (1 - t) ** 2;
  if (mode === 'easeInOut') return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
  if (mode === 'custom') return bezier(t, 0, c.p1y, c.p2y, 1);
  return t;
}

function getTransform(layer, t) {
  sortKf(layer);
  if (!layer.keyframes.length) return { x: 180, y: 320, scale: 1, rotation: 0, opacity: 1 };
  if (t <= layer.keyframes[0].time) return layer.keyframes[0];
  if (t >= layer.keyframes[layer.keyframes.length - 1].time) return layer.keyframes[layer.keyframes.length - 1];
  let a = layer.keyframes[0], b = layer.keyframes[1];
  for (let i = 0; i < layer.keyframes.length - 1; i += 1) {
    if (t >= layer.keyframes[i].time && t <= layer.keyframes[i + 1].time) { a = layer.keyframes[i]; b = layer.keyframes[i + 1]; break; }
  }
  const u = (t - a.time) / Math.max(0.0001, b.time - a.time);
  const e = easeValue(u, layer.easing);
  return { x: lerp(a.x, b.x, e), y: lerp(a.y, b.y, e), scale: lerp(a.scale, b.scale, e), rotation: lerp(a.rotation, b.rotation, e), opacity: lerp(a.opacity, b.opacity, e) };
}

function setCanvasRatio(r) { const rr = parseRatio(r); const base = 360; ui.preview.width = base; ui.preview.height = Math.round((base * rr.h) / rr.w); }
function applyTheme(theme) { state.theme = theme === 'light' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', state.theme); localStorage.setItem('uiTheme', state.theme); }

function openCreateModal() {
  ui.modal.classList.remove('hidden');
  ui.modalProjectName.value = ''; ui.modalFps.value = '30'; ui.modalBgColor.value = '#000000'; ui.modalBgHex.value = '#000000';
  state.modalRatio = '9:16';
  ui.ratioRow.querySelectorAll('.ratio-btn').forEach((b) => b.classList.toggle('selected', b.dataset.ratio === '9:16'));
}
function closeCreateModal() { ui.modal.classList.add('hidden'); }

function openMenu() { const p = currentProject(); if (!p) return; ui.menuProjectName.value = p.name; ui.menuRatio.value = p.settings.ratio; ui.menuFps.value = String(p.settings.fps); ui.menuBgColor.value = p.settings.bgColor; ui.settingsMenu.classList.remove('hidden'); }
function closeMenu() { ui.settingsMenu.classList.add('hidden'); }

function showHome() { state.playing = false; ui.home.classList.add('active'); ui.editor.classList.remove('active'); renderProjectList(); }
function showEditor(pid) { state.currentProjectId = pid; state.time = 0; ui.home.classList.remove('active'); ui.editor.classList.add('active'); hydrateEditor(); }

function renderProjectList() {
  ui.projectList.innerHTML = '';
  state.projects.forEach((p) => {
    const item = document.createElement('div'); item.className = 'project-item';
    item.innerHTML = `<div><strong>${p.name}</strong><br><small>${p.settings.ratio} • ${p.settings.fps} FPS • ${p.settings.bgColor}</small></div>`;
    const actions = document.createElement('div'); actions.className = 'project-actions';
    const open = document.createElement('button'); open.className = 'btn primary'; open.textContent = 'Mở'; open.onclick = () => showEditor(p.id);
    const del = document.createElement('button'); del.className = 'btn danger'; del.textContent = 'Xóa'; del.onclick = () => { state.projects = state.projects.filter((x) => x.id !== p.id); if (!state.projects.length) state.projects.push(newProject({ name: 'Dự án trống', ratio: '9:16', fps: 30, bgColor: '#000000' })); saveProjects(); renderProjectList(); };
    actions.append(open, del); item.append(actions); ui.projectList.append(item);
  });
}

function hydrateEditor() {
  const p = currentProject(); if (!p) return;
  setCanvasRatio(p.settings.ratio);
  ui.projectTitle.textContent = p.name;
  ui.projectMeta.textContent = `${p.settings.ratio} • ${p.settings.fps} FPS • ${p.settings.bgColor}`;
  ui.timelineDuration.value = String(p.settings.duration);
  ui.cp1x.value = p.settings.customEase.p1x; ui.cp1y.value = p.settings.customEase.p1y; ui.cp2x.value = p.settings.customEase.p2x; ui.cp2y.value = p.settings.customEase.p2y;

  ui.layerSelect.innerHTML = '';
  p.layers.forEach((l, i) => { const opt = document.createElement('option'); opt.value = l.id; opt.textContent = `${l.type} ${i + 1}`; ui.layerSelect.append(opt); });
  if (p.layers.length) ui.layerSelect.value = p.layers[0].id;
  syncControlsFromNearest();
  drawEaseGraph();
  drawTimelineTracks();
  draw();
}

function syncControlsFromNearest() {
  const l = currentLayer();
  if (!l) { ui.keyframeInfo.textContent = 'Keyframes: (chưa có layer)'; return; }
  const k = nearestKey(l, state.time);
  ui.startX.value = k.x; ui.startY.value = k.y; ui.startScale.value = k.scale; ui.startRotation.value = k.rotation; ui.startOpacity.value = k.opacity;
  ui.easing.value = l.easing;
  ui.layerColor.value = l.color || '#21b8ff';
  ui.keyframeInfo.textContent = `Keyframes: ${l.keyframes.map((x) => x.time.toFixed(2)).join(', ')}`;
}

function ensureKeyAtCurrent(layer) {
  let k = nearestKey(layer, state.time);
  if (!k || Math.abs(k.time - state.time) >= 0.03) {
    const tf = getTransform(layer, state.time);
    k = newKeyframe(state.time, tf.x, tf.y, tf.scale, tf.rotation, tf.opacity);
    layer.keyframes.push(k);
  }
  sortKf(layer);
  return nearestKey(layer, state.time);
}

function addKeyframeAtCurrent() {
  const p = currentProject(); const l = currentLayer(); if (!p || !l) return;
  if (!nearestKey(l, state.time) || Math.abs(nearestKey(l, state.time).time - state.time) > 0.03) {
    const tf = getTransform(l, state.time);
    l.keyframes.push(newKeyframe(state.time, tf.x, tf.y, tf.scale, tf.rotation, tf.opacity));
    sortKf(l); p.updatedAt = Date.now(); saveProjects();
  }
  drawTimelineTracks(); syncControlsFromNearest();
}

function removeNearestKeyframe() {
  const p = currentProject(); const l = currentLayer(); if (!p || !l || l.keyframes.length <= 1) return;
  const k = nearestKey(l, state.time);
  l.keyframes = l.keyframes.filter((x) => x.id !== k.id);
  p.updatedAt = Date.now(); saveProjects();
  drawTimelineTracks(); syncControlsFromNearest(); draw();
}

function applyCurrentValues() {
  const p = currentProject(); const l = currentLayer(); if (!p || !l) return;
  const k = ensureKeyAtCurrent(l);
  k.x = +ui.startX.value; k.y = +ui.startY.value; k.scale = +ui.startScale.value; k.rotation = +ui.startRotation.value; k.opacity = +ui.startOpacity.value;
  l.easing = ui.easing.value;
  l.color = ui.layerColor.value;
  p.settings.duration = Math.max(0.2, +ui.timelineDuration.value || 2);
  p.settings.customEase = { p1x: +ui.cp1x.value, p1y: +ui.cp1y.value, p2x: +ui.cp2x.value, p2y: +ui.cp2y.value };
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

function drawLayer(layer) {
  if (layer.visible === false) return;
  const tf = getTransform(layer, state.time);
  ctx.save();
  ctx.translate(tf.x, tf.y); ctx.rotate((tf.rotation * Math.PI) / 180); ctx.scale(tf.scale, tf.scale); ctx.globalAlpha = clamp(tf.opacity, 0, 1);
  if (layer.type === 'rect') { ctx.fillStyle = layer.color; ctx.fillRect(-50, -50, 100, 100); }
  else if (layer.type === 'circle') { ctx.fillStyle = layer.color; ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); ctx.fill(); }
  else if (layer.type === 'image') {
    const img = layer.imageObj;
    if (img) { const w = layer.size; const h = (img.height / img.width) * w; ctx.drawImage(img, -w / 2, -h / 2, w, h); }
  } else { ctx.fillStyle = layer.color; ctx.font = `bold ${layer.size}px Inter, sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(layer.text, 0, 0); }
  ctx.restore();
}

function draw() {
  const p = currentProject(); if (!p) return;
  ctx.fillStyle = p.settings.bgColor || '#000000';
  ctx.fillRect(0, 0, ui.preview.width, ui.preview.height);
  for (let x = 0; x <= ui.preview.width; x += 60) { ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.moveTo(x, 0); ctx.lineTo(x, ui.preview.height); ctx.stroke(); }
  for (let y = 0; y <= ui.preview.height; y += 60) { ctx.beginPath(); ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.moveTo(0, y); ctx.lineTo(ui.preview.width, y); ctx.stroke(); }
  p.layers.forEach(drawLayer);
  const ratio = p.settings.duration ? state.time / p.settings.duration : 0;
  ui.scrubber.value = String(Math.floor(ratio * 100));
  ui.timeLabel.textContent = `${state.time.toFixed(2)}s / ${p.settings.duration.toFixed(2)}s`;
}

function drawTimelineTracks() {
  const p = currentProject(); if (!p) return;
  ui.timelineTracks.innerHTML = '';
  p.layers.forEach((l, idx) => {
    const row = document.createElement('div'); row.className = 'timeline-row';
    const left = document.createElement('div'); left.className = 'timeline-left';
    const lockBtn = document.createElement('button'); lockBtn.className = 'btn'; lockBtn.textContent = l.locked ? '🔒' : '🔓'; lockBtn.onclick = () => { l.locked = !l.locked; saveProjects(); drawTimelineTracks(); };
    const eyeBtn = document.createElement('button'); eyeBtn.className = 'btn'; eyeBtn.textContent = l.visible === false ? '🙈' : '👁'; eyeBtn.onclick = () => { l.visible = l.visible === false ? true : false; saveProjects(); drawTimelineTracks(); draw(); };
    const chip = document.createElement('span'); chip.className = 'track-chip'; chip.style.background = l.color;
    const name = document.createElement('strong'); name.textContent = `${l.type} ${idx + 1}`;
    left.append(lockBtn, eyeBtn, chip, name);

    const strip = document.createElement('div'); strip.className = `timeline-strip ${idx === 0 ? 'main' : ''}`;
    const playhead = document.createElement('div'); playhead.className = 'playhead'; playhead.style.left = `${(state.time / Math.max(p.settings.duration, 0.001)) * 100}%`;
    strip.append(playhead);
    sortKf(l);
    l.keyframes.forEach((k) => {
      const d = document.createElement('div'); d.className = 'key-dot'; d.style.left = `${(k.time / Math.max(p.settings.duration, 0.001)) * 100}%`; strip.append(d);
    });

    row.onclick = () => { ui.layerSelect.value = l.id; syncControlsFromNearest(); };
    row.append(left, strip);
    ui.timelineTracks.append(row);
  });
}

function drawEaseGraph() {
  const p = currentProject(); if (!p) return;
  const cm = p.settings.customEase;
  gctx.fillStyle = '#0b0f17'; gctx.fillRect(0, 0, ui.easeGraph.width, ui.easeGraph.height);
  gctx.strokeStyle = 'rgba(255,255,255,.25)'; gctx.strokeRect(10, 10, ui.easeGraph.width - 20, ui.easeGraph.height - 20);
  gctx.beginPath(); gctx.strokeStyle = '#55d4ff';
  for (let i = 0; i <= 100; i += 1) {
    const t = i / 100; const y = bezier(t, 0, cm.p1y, cm.p2y, 1);
    const px = 10 + t * (ui.easeGraph.width - 20); const py = (ui.easeGraph.height - 10) - y * (ui.easeGraph.height - 20);
    if (i === 0) gctx.moveTo(px, py); else gctx.lineTo(px, py);
  }
  gctx.stroke();
}

function tick(ts) {
  if (!state.playing) return;
  const p = currentProject(); if (!p) return;
  if (!state.startRef) state.startRef = ts - state.time * 1000;
  const elapsed = (ts - state.startRef) / 1000;
  const step = 1 / (p.settings.fps || 30);
  state.time = Math.min(Math.floor(elapsed / step) * step, p.settings.duration);
  if (state.time >= p.settings.duration) { state.playing = false; state.startRef = 0; }
  draw(); drawTimelineTracks();
  requestAnimationFrame(tick);
}

async function exportVideoMp4() {
  const p = currentProject(); if (!p) return;
  const mp4Types = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=h264', 'video/mp4'];
  const mimeType = mp4Types.find((t) => MediaRecorder.isTypeSupported(t));
  if (!mimeType) {
    alert('Trình duyệt này không hỗ trợ xuất MP4 trực tiếp bằng MediaRecorder. Hãy dùng Chrome mới hoặc cài pipeline chuyển mã.');
    return;
  }

  const stream = ui.preview.captureStream(p.settings.fps || 30);
  const rec = new MediaRecorder(stream, { mimeType });
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  rec.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${p.name || 'project'}.mp4`; a.click();
    URL.revokeObjectURL(url);
  };

  rec.start();
  const start = performance.now();
  function loop(now) {
    const el = (now - start) / 1000;
    state.time = Math.min(el, p.settings.duration);
    draw(); drawTimelineTracks();
    if (el < p.settings.duration) requestAnimationFrame(loop);
    else rec.stop();
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
    state.drag = { layerId: l.id, dx: x - tf.x, dy: y - tf.y };
    ui.preview.classList.add('dragging');
    ui.layerSelect.value = l.id;
    syncControlsFromNearest();
  });
  window.addEventListener('pointermove', (e) => {
    if (!state.drag) return;
    const p = currentProject(); const l = currentLayer(); if (!p || !l || l.locked) return;
    const { x, y } = posOnCanvas(e);
    const k = ensureKeyAtCurrent(l);
    k.x = clamp(x - state.drag.dx, 0, ui.preview.width);
    k.y = clamp(y - state.drag.dy, 0, ui.preview.height);
    p.updatedAt = Date.now(); saveProjects();
    syncControlsFromNearest(); drawTimelineTracks(); draw();
  });
  window.addEventListener('pointerup', () => { state.drag = null; ui.preview.classList.remove('dragging'); });
}

function bind() {
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
    const p = newProject({ name: ui.modalProjectName.value.trim(), ratio: state.modalRatio, fps: +ui.modalFps.value, bgColor: ui.modalBgColor.value });
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
    p.settings.bgColor = ui.menuBgColor.value || '#000000';
    p.updatedAt = Date.now(); saveProjects(); closeMenu(); hydrateEditor();
  };

  ui.themeToggleBtn.onclick = () => applyTheme(state.theme === 'dark' ? 'light' : 'dark');
  ui.backHomeBtn.onclick = showHome;

  ui.addRect.onclick = () => addLayer('rect');
  ui.addCircle.onclick = () => addLayer('circle');
  ui.addText.onclick = () => addLayer('text');
  ui.addImageBtn.onclick = () => addImageLayer(ui.imageInput.files?.[0]);
  ui.deleteLayer.onclick = () => {
    const p = currentProject(); if (!p) return;
    p.layers = p.layers.filter((l) => l.id !== ui.layerSelect.value);
    p.updatedAt = Date.now(); saveProjects(); hydrateEditor();
  };

  ui.layerSelect.onchange = syncControlsFromNearest;
  ui.layerColor.oninput = applyCurrentValues;
  ui.addKeyBtn.onclick = addKeyframeAtCurrent;
  ui.removeKeyBtn.onclick = removeNearestKeyframe;
  ui.applyBtn.onclick = applyCurrentValues;
  ['timelineDuration', 'easing', 'cp1x', 'cp1y', 'cp2x', 'cp2y', 'startX', 'startY', 'startScale', 'startRotation', 'startOpacity'].forEach((k) => ui[k].addEventListener('input', applyCurrentValues));

  ui.playBtn.onclick = () => { state.playing = true; state.startRef = 0; requestAnimationFrame(tick); };
  ui.pauseBtn.onclick = () => { state.playing = false; state.startRef = 0; };
  ui.resetBtn.onclick = () => { state.playing = false; state.startRef = 0; state.time = 0; draw(); drawTimelineTracks(); syncControlsFromNearest(); };
  ui.exportVideoBtn.onclick = exportVideoMp4;
  ui.scrubber.oninput = () => { const p = currentProject(); if (!p) return; state.playing = false; state.time = (+ui.scrubber.value / 100) * p.settings.duration; draw(); drawTimelineTracks(); syncControlsFromNearest(); };

  bindDrag();
}

function preloadImages() {
  state.projects.forEach((p) => p.layers.forEach((l) => {
    if (l.type === 'image' && l.imageSrc) {
      const img = new Image(); img.onload = () => { l.imageObj = img; if (p.id === state.currentProjectId) draw(); }; img.src = l.imageSrc;
    }
  }));
}

function init() {
  loadProjects();
  preloadImages();
  bind();
  applyTheme(state.theme);
  showHome();
}

document.addEventListener('DOMContentLoaded', init);
