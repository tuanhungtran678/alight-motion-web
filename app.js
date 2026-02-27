function getEl(id) { return document.getElementById(id); }
function clamp(v, mi, ma) { return Math.min(ma, Math.max(mi, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function id() { return (crypto.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`); }
function bezier(t, p0, p1, p2, p3) { const nt = 1 - t; return nt**3*p0 + 3*nt**2*t*p1 + 3*nt*t**2*p2 + t**3*p3; }

const STORAGE_KEY = 'alightProjectsV1';

const ui = {
  homeScreen: getEl('homeScreen'),
  editorScreen: getEl('editorScreen'),
  newProjectName: getEl('newProjectName'),
  createProjectBtn: getEl('createProjectBtn'),
  projectList: getEl('projectList'),
  projectTitle: getEl('projectTitle'),
  projectMeta: getEl('projectMeta'),
  backHomeBtn: getEl('backHomeBtn'),
  preview: getEl('preview'),
  playBtn: getEl('playBtn'),
  pauseBtn: getEl('pauseBtn'),
  resetBtn: getEl('resetBtn'),
  scrubber: getEl('scrubber'),
  timeLabel: getEl('timeLabel'),
  addRect: getEl('addRect'), addCircle: getEl('addCircle'), addText: getEl('addText'),
  imageInput: getEl('imageInput'), addImageBtn: getEl('addImageBtn'),
  deleteLayer: getEl('deleteLayer'), layerSelect: getEl('layerSelect'),
  timelineDuration: getEl('timelineDuration'),
  startX: getEl('startX'), startY: getEl('startY'), startScale: getEl('startScale'), startRotation: getEl('startRotation'), startOpacity: getEl('startOpacity'),
  endX: getEl('endX'), endY: getEl('endY'), endScale: getEl('endScale'), endRotation: getEl('endRotation'), endOpacity: getEl('endOpacity'),
  easing: getEl('easing'), cp1x: getEl('cp1x'), cp1y: getEl('cp1y'), cp2x: getEl('cp2x'), cp2y: getEl('cp2y'),
  applyBtn: getEl('applyBtn'), easeGraph: getEl('easeGraph')
};

const ctx = ui.preview.getContext('2d');
const graph = ui.easeGraph.getContext('2d');

const state = {
  projects: [],
  currentProjectId: null,
  time: 0,
  playing: false,
  startRef: 0
};

function newAnim() {
  return { start: { x: 180, y: 320, scale: 1, rotation: 0, opacity: 1 }, end: { x: 180, y: 180, scale: 1.4, rotation: 360, opacity: 1 }, easing: 'easeInOut' };
}
function newLayer(type, extra={}) {
  return { id: id(), type, text: 'ALIGHT', color: '#55d4ff', size: 90, imageSrc: null, anim: newAnim(), ...extra };
}
function newProject(name) {
  return {
    id: id(),
    name: name || `Project ${state.projects.length+1}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    settings: { duration: 2, customEase: { p1x:0.25, p1y:0.1, p2x:0.25, p2y:1 } },
    layers: [newLayer('rect'), newLayer('text')]
  };
}

function saveProjects() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects)); }
function loadProjects() {
  const raw = localStorage.getItem(STORAGE_KEY);
  state.projects = raw ? JSON.parse(raw) : [];
  if (!state.projects.length) {
    state.projects.push(newProject('Dự án mặc định'));
    saveProjects();
  }
}

function currentProject() { return state.projects.find(p => p.id === state.currentProjectId) || null; }
function currentLayer() {
  const p = currentProject(); if (!p) return null;
  return p.layers.find(l => l.id === ui.layerSelect.value) || p.layers[0] || null;
}

function showHome() {
  state.playing = false;
  ui.homeScreen.classList.add('active');
  ui.editorScreen.classList.remove('active');
  renderProjectList();
}

function showEditor(projectId) {
  state.currentProjectId = projectId;
  state.time = 0;
  ui.homeScreen.classList.remove('active');
  ui.editorScreen.classList.add('active');
  hydrateEditor();
}

function renderProjectList() {
  ui.projectList.innerHTML = '';
  state.projects.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'project-item';
    row.innerHTML = `<div><strong>${p.name}</strong><br><small>${new Date(p.updatedAt).toLocaleString()}</small></div>`;
    const open = document.createElement('button');
    open.className = 'btn primary';
    open.textContent = 'Mở';
    open.addEventListener('click', () => showEditor(p.id));
    const del = document.createElement('button');
    del.className = 'btn danger';
    del.textContent = 'Xóa';
    del.addEventListener('click', () => {
      state.projects = state.projects.filter(x => x.id !== p.id);
      if (!state.projects.length) state.projects.push(newProject('Dự án mới'));
      saveProjects();
      renderProjectList();
    });
    const act = document.createElement('div'); act.className = 'project-actions';
    act.append(open, del);
    row.append(act);
    ui.projectList.append(row);
  });
}

function hydrateEditor() {
  const p = currentProject();
  ui.projectTitle.textContent = p.name;
  ui.projectMeta.textContent = `Tạo: ${new Date(p.createdAt).toLocaleString()} • Cập nhật: ${new Date(p.updatedAt).toLocaleString()}`;
  ui.timelineDuration.value = p.settings.duration;
  ui.cp1x.value = p.settings.customEase.p1x;
  ui.cp1y.value = p.settings.customEase.p1y;
  ui.cp2x.value = p.settings.customEase.p2x;
  ui.cp2y.value = p.settings.customEase.p2y;

  ui.layerSelect.innerHTML = '';
  p.layers.forEach((l, i) => {
    const opt = document.createElement('option');
    opt.value = l.id;
    opt.textContent = `${l.type} ${i+1}`;
    ui.layerSelect.append(opt);
  });
  ui.layerSelect.value = p.layers[0]?.id || '';
  syncControlsFromLayer(currentLayer());
  drawEaseGraph();
  draw();
}

function syncControlsFromLayer(layer) {
  if (!layer) return;
  const a = layer.anim;
  ui.startX.value = a.start.x; ui.startY.value = a.start.y; ui.startScale.value = a.start.scale; ui.startRotation.value = a.start.rotation; ui.startOpacity.value = a.start.opacity;
  ui.endX.value = a.end.x; ui.endY.value = a.end.y; ui.endScale.value = a.end.scale; ui.endRotation.value = a.end.rotation; ui.endOpacity.value = a.end.opacity;
  ui.easing.value = a.easing;
}

function applyLayerControls() {
  const p = currentProject(); const l = currentLayer(); if (!p || !l) return;
  l.anim = {
    start: { x:+ui.startX.value, y:+ui.startY.value, scale:+ui.startScale.value, rotation:+ui.startRotation.value, opacity:+ui.startOpacity.value },
    end: { x:+ui.endX.value, y:+ui.endY.value, scale:+ui.endScale.value, rotation:+ui.endRotation.value, opacity:+ui.endOpacity.value },
    easing: ui.easing.value
  };
  p.settings.duration = Math.max(0.2, +ui.timelineDuration.value || 2);
  p.settings.customEase = { p1x:+ui.cp1x.value, p1y:+ui.cp1y.value, p2x:+ui.cp2x.value, p2y:+ui.cp2y.value };
  p.updatedAt = Date.now();
  saveProjects();
  drawEaseGraph();
  draw();
}

function easeValue(t, easing) {
  const p = currentProject();
  const cm = p?.settings.customEase || { p1y:0.1, p2y:1 };
  const map = {
    linear: t,
    easeIn: t*t,
    easeOut: 1-(1-t)**2,
    easeInOut: (t<0.5?2*t*t:1-((-2*t+2)**2)/2),
    custom: bezier(t,0,cm.p1y,cm.p2y,1)
  };
  return map[easing] ?? t;
}

function drawLayer(l) {
  const p = currentProject();
  const dur = p.settings.duration;
  const pr = clamp(state.time/dur,0,1);
  const te = easeValue(pr, l.anim.easing);
  const x = lerp(l.anim.start.x, l.anim.end.x, te);
  const y = lerp(l.anim.start.y, l.anim.end.y, te);
  const sc = lerp(l.anim.start.scale, l.anim.end.scale, te);
  const ro = lerp(l.anim.start.rotation, l.anim.end.rotation, te);
  const op = lerp(l.anim.start.opacity, l.anim.end.opacity, te);

  ctx.save();
  ctx.translate(x,y); ctx.rotate(ro*Math.PI/180); ctx.scale(sc,sc); ctx.globalAlpha = clamp(op,0,1);
  if (l.type==='rect') { ctx.fillStyle=l.color; ctx.fillRect(-50,-50,100,100); }
  else if (l.type==='circle') { ctx.fillStyle=l.color; ctx.beginPath(); ctx.arc(0,0,55,0,Math.PI*2); ctx.fill(); }
  else if (l.type==='image' && l._img) {
    const w = l.size; const h = (l._img.height/l._img.width)*w; ctx.drawImage(l._img,-w/2,-h/2,w,h);
  } else { ctx.fillStyle=l.color; ctx.font=`bold ${l.size}px Inter, sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(l.text,0,0); }
  ctx.restore();
}

function draw() {
  const p = currentProject();
  if (!p) return;
  ctx.fillStyle = '#0b0f17'; ctx.fillRect(0,0,ui.preview.width,ui.preview.height);
  for(let x=0;x<=ui.preview.width;x+=60){ctx.beginPath();ctx.strokeStyle='rgba(255,255,255,.06)';ctx.moveTo(x,0);ctx.lineTo(x,ui.preview.height);ctx.stroke();}
  for(let y=0;y<=ui.preview.height;y+=60){ctx.beginPath();ctx.strokeStyle='rgba(255,255,255,.06)';ctx.moveTo(0,y);ctx.lineTo(ui.preview.width,y);ctx.stroke();}
  p.layers.forEach(drawLayer);
  const ratio = p.settings.duration ? state.time/p.settings.duration : 0;
  ui.scrubber.value = Math.floor(ratio*100);
  ui.timeLabel.textContent = `${state.time.toFixed(2)}s / ${p.settings.duration.toFixed(2)}s`;
}

function drawEaseGraph() {
  const p = currentProject(); if (!p) return;
  const cm = p.settings.customEase;
  graph.fillStyle='#0b0f17'; graph.fillRect(0,0,ui.easeGraph.width,ui.easeGraph.height);
  graph.strokeStyle='rgba(255,255,255,.25)'; graph.strokeRect(10,10,ui.easeGraph.width-20,ui.easeGraph.height-20);
  graph.beginPath(); graph.strokeStyle='#55d4ff';
  for(let i=0;i<=100;i++){
    const t=i/100; const y=bezier(t,0,cm.p1y,cm.p2y,1); const px=10+t*(ui.easeGraph.width-20); const py=(ui.easeGraph.height-10)-y*(ui.easeGraph.height-20);
    if(i===0) graph.moveTo(px,py); else graph.lineTo(px,py);
  }
  graph.stroke();
}

function tick(ts) {
  if (!state.playing) return;
  const p = currentProject();
  if (!state.startRef) state.startRef = ts - state.time*1000;
  const elapsed = (ts-state.startRef)/1000;
  const step = 1/30;
  state.time = Math.min(Math.floor(elapsed/step)*step, p.settings.duration);
  if (state.time>=p.settings.duration) { state.playing=false; state.startRef=0; }
  draw();
  requestAnimationFrame(tick);
}

function bind() {
  ui.createProjectBtn.addEventListener('click', () => {
    const p = newProject(ui.newProjectName.value.trim());
    state.projects.unshift(p);
    ui.newProjectName.value = '';
    saveProjects();
    renderProjectList();
  });
  ui.backHomeBtn.addEventListener('click', showHome);

  ui.addRect.addEventListener('click',()=>{ const p=currentProject(); p.layers.push(newLayer('rect')); p.updatedAt=Date.now(); saveProjects(); hydrateEditor(); });
  ui.addCircle.addEventListener('click',()=>{ const p=currentProject(); p.layers.push(newLayer('circle')); p.updatedAt=Date.now(); saveProjects(); hydrateEditor(); });
  ui.addText.addEventListener('click',()=>{ const p=currentProject(); p.layers.push(newLayer('text')); p.updatedAt=Date.now(); saveProjects(); hydrateEditor(); });
  ui.addImageBtn.addEventListener('click',()=>{
    const file = ui.imageInput.files?.[0]; if(!file) return;
    const fr = new FileReader(); fr.onload=()=>{
      const p=currentProject();
      const layer = newLayer('image', { imageSrc: fr.result, size: 220 });
      p.layers.push(layer); p.updatedAt=Date.now(); saveProjects(); hydrateEditor();
      const img = new Image(); img.onload=()=>{ layer._img=img; draw(); }; img.src=fr.result;
    }; fr.readAsDataURL(file);
  });

  ui.deleteLayer.addEventListener('click',()=>{
    const p=currentProject(); if(!p) return;
    p.layers = p.layers.filter(l=>l.id!==ui.layerSelect.value);
    if(!p.layers.length) p.layers.push(newLayer('rect'));
    p.updatedAt=Date.now(); saveProjects(); hydrateEditor();
  });
  ui.layerSelect.addEventListener('change',()=>syncControlsFromLayer(currentLayer()));
  ui.applyBtn.addEventListener('click',applyLayerControls);

  ui.playBtn.addEventListener('click',()=>{ state.playing=true; state.startRef=0; requestAnimationFrame(tick); });
  ui.pauseBtn.addEventListener('click',()=>{ state.playing=false; state.startRef=0; });
  ui.resetBtn.addEventListener('click',()=>{ state.playing=false; state.startRef=0; state.time=0; draw(); });
  ui.scrubber.addEventListener('input',()=>{ const p=currentProject(); state.playing=false; state.time=(+ui.scrubber.value/100)*p.settings.duration; draw(); });

  ['timelineDuration','easing','cp1x','cp1y','cp2x','cp2y'].forEach((k)=>ui[k].addEventListener('input',applyLayerControls));
}

function preloadProjectImages() {
  state.projects.forEach((p)=>p.layers.forEach((l)=>{
    if (l.type==='image' && l.imageSrc) {
      const img = new Image(); img.onload=()=>{ l._img=img; if (p.id===state.currentProjectId) draw(); }; img.src=l.imageSrc;
    }
  }));
}

function init() {
  loadProjects();
  preloadProjectImages();
  bind();
  showHome();
}

document.addEventListener('DOMContentLoaded', init);
