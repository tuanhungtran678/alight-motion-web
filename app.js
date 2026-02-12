function getEl(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `layer-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseRatio(value) {
  const [w, h] = value.split(':').map(Number);
  if (!w || !h) return { w: 9, h: 16 };
  return { w, h };
}

function cubicBezierPoint(t, p0, p1, p2, p3) {
  const nt = 1 - t;
  return nt ** 3 * p0 + 3 * nt ** 2 * t * p1 + 3 * nt * t ** 2 * p2 + t ** 3 * p3;
}

function createApp() {
  const canvas = getEl('preview');
  const errorBox = getEl('appError');
  const easeGraph = getEl('easeGraph');

  if (!canvas || !easeGraph) {
    return { ok: false, reason: 'Thiếu canvas cần thiết của ứng dụng.' };
  }

  const ctx = canvas.getContext('2d');
  const graphCtx = easeGraph.getContext('2d');
  if (!ctx || !graphCtx) {
    return { ok: false, reason: 'Trình duyệt không hỗ trợ canvas 2D.' };
  }

  const controls = {
    playBtn: getEl('playBtn'),
    pauseBtn: getEl('pauseBtn'),
    resetBtn: getEl('resetBtn'),
    scrubber: getEl('scrubber'),
    timeLabel: getEl('timeLabel'),
    addRect: getEl('addRect'),
    addCircle: getEl('addCircle'),
    addText: getEl('addText'),
    imageInput: getEl('imageInput'),
    addImageBtn: getEl('addImageBtn'),
    deleteLayer: getEl('deleteLayer'),
    layerSelect: getEl('layerSelect'),
    timelineDuration: getEl('timelineDuration'),
    startX: getEl('startX'),
    startY: getEl('startY'),
    startScale: getEl('startScale'),
    startRotation: getEl('startRotation'),
    startOpacity: getEl('startOpacity'),
    endX: getEl('endX'),
    endY: getEl('endY'),
    endScale: getEl('endScale'),
    endRotation: getEl('endRotation'),
    endOpacity: getEl('endOpacity'),
    easing: getEl('easing'),
    fxBlur: getEl('fxBlur'),
    fxBrightness: getEl('fxBrightness'),
    fxContrast: getEl('fxContrast'),
    fxSaturate: getEl('fxSaturate'),
    fxShadow: getEl('fxShadow'),
    cp1x: getEl('cp1x'),
    cp1y: getEl('cp1y'),
    cp2x: getEl('cp2x'),
    cp2y: getEl('cp2y'),
    applyBtn: getEl('applyBtn'),
    language: getEl('language'),
    screenRatio: getEl('screenRatio'),
    fps: getEl('fps'),
    screenColor: getEl('screenColor'),
    projectStartLabel: getEl('projectStartLabel'),
    editElapsedLabel: getEl('editElapsedLabel'),
    applySettingsBtn: getEl('applySettingsBtn')
  };

  const missing = Object.entries(controls).find(([, el]) => !el);
  if (missing) return { ok: false, reason: `Thiếu thành phần: ${missing[0]}.` };

  const i18n = {
    vi: {
      'app.title': 'Alight Motion Web Lite', 'app.subtitle': 'Bản web đơn giản để dựng chuyển động nhanh trên điện thoại.',
      'transport.play': '▶ Phát', 'transport.pause': '⏸ Dừng', 'transport.reset': '↺ Reset', 'transport.scrub': 'Tua',
      'layer.title': 'Tạo layer', 'layer.addRect': '+ Hình chữ nhật', 'layer.addCircle': '+ Hình tròn', 'layer.addText': '+ Text',
      'layer.addImage': 'Chèn hình ảnh', 'layer.addImageBtn': '+ Thêm ảnh', 'layer.current': 'Layer hiện tại', 'layer.delete': 'Xóa layer',
      'anim.title': 'Thiết lập chuyển động', 'anim.duration': 'Thời lượng animation (giây)', 'anim.startTitle': 'Giá trị bắt đầu',
      'anim.endTitle': 'Giá trị kết thúc', 'field.x': 'X', 'field.y': 'Y', 'field.scale': 'Scale', 'field.rotate': 'Rotate°',
      'field.opacity': 'Opacity', 'anim.ease': 'Ease', 'anim.customEase': 'Custom Graph', 'anim.graph': 'Graph custom ease',
      'effect.title': 'Hiệu ứng', 'effect.blur': 'Blur', 'effect.brightness': 'Brightness', 'effect.contrast': 'Contrast', 'effect.saturate': 'Saturate', 'effect.shadow': 'Shadow',
      'anim.apply': 'Áp dụng vào layer',
      'settings.title': 'Settings', 'settings.language': 'Ngôn ngữ', 'settings.ratio': 'Tỉ lệ màn hình',
      'settings.ratio.9x16': '9:16 (Dọc)', 'settings.ratio.1x1': '1:1 (Vuông)', 'settings.ratio.16x9': '16:9 (Ngang)', 'settings.ratio.4x5': '4:5',
      'settings.fps': 'FPS', 'settings.screenColor': 'Màu màn hình', 'settings.projectStart': 'Bắt đầu dự án:',
      'settings.editElapsed': 'Tổng thời gian chỉnh sửa:', 'settings.apply': 'Áp dụng settings',
      'layerType.rect': 'Hình chữ nhật', 'layerType.circle': 'Hình tròn', 'layerType.text': 'Text', 'layerType.image': 'Ảnh'
    },
    en: {
      'app.title': 'Alight Motion Web Lite', 'app.subtitle': 'A simple web version for quick motion editing on mobile.',
      'transport.play': '▶ Play', 'transport.pause': '⏸ Pause', 'transport.reset': '↺ Reset', 'transport.scrub': 'Scrub',
      'layer.title': 'Create layers', 'layer.addRect': '+ Rectangle', 'layer.addCircle': '+ Circle', 'layer.addText': '+ Text',
      'layer.addImage': 'Insert image', 'layer.addImageBtn': '+ Add image', 'layer.current': 'Current layer', 'layer.delete': 'Delete layer',
      'anim.title': 'Animation setup', 'anim.duration': 'Animation duration (seconds)', 'anim.startTitle': 'Start values', 'anim.endTitle': 'End values',
      'field.x': 'X', 'field.y': 'Y', 'field.scale': 'Scale', 'field.rotate': 'Rotate°', 'field.opacity': 'Opacity',
      'anim.ease': 'Ease', 'anim.customEase': 'Custom Graph', 'anim.graph': 'Custom ease graph',
      'effect.title': 'Effects', 'effect.blur': 'Blur', 'effect.brightness': 'Brightness', 'effect.contrast': 'Contrast', 'effect.saturate': 'Saturate', 'effect.shadow': 'Shadow',
      'anim.apply': 'Apply to layer',
      'settings.title': 'Settings', 'settings.language': 'Language', 'settings.ratio': 'Screen ratio',
      'settings.ratio.9x16': '9:16 (Portrait)', 'settings.ratio.1x1': '1:1 (Square)', 'settings.ratio.16x9': '16:9 (Landscape)', 'settings.ratio.4x5': '4:5',
      'settings.fps': 'FPS', 'settings.screenColor': 'Screen color', 'settings.projectStart': 'Project started:',
      'settings.editElapsed': 'Total edit time:', 'settings.apply': 'Apply settings',
      'layerType.rect': 'Rectangle', 'layerType.circle': 'Circle', 'layerType.text': 'Text', 'layerType.image': 'Image'
    }
  };

  const state = {
    duration: 2,
    fps: 30,
    ratio: { w: 9, h: 16 },
    screenColor: '#0b0f17',
    language: 'vi',
    customEase: { p1x: 0.25, p1y: 0.1, p2x: 0.25, p2y: 1 },
    projectStartTs: Number(localStorage.getItem('alightProjectStartTs')) || Date.now(),
    time: 0,
    playing: false,
    startTimeRef: 0,
    layers: [],
    selectedLayerId: null
  };

  localStorage.setItem('alightProjectStartTs', String(state.projectStartTs));

  const easingMap = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => 1 - (1 - t) ** 2,
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2),
    custom: (t) => cubicBezierPoint(t, 0, state.customEase.p1y, state.customEase.p2y, 1)
  };

  function t(key) {
    return i18n[state.language]?.[key] || i18n.vi[key] || key;
  }

  function formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  }

  function updateProjectTimeInfo() {
    controls.projectStartLabel.textContent = new Date(state.projectStartTs).toLocaleString();
    controls.editElapsedLabel.textContent = formatDuration(Date.now() - state.projectStartTs);
  }

  function applyLanguage(lang) {
    state.language = i18n[lang] ? lang : 'vi';
    document.documentElement.lang = state.language;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.textContent = t(el.dataset.i18nTitle);
    });
    refreshLayerSelect();
    updateProjectTimeInfo();
    drawEaseGraph();
    draw();
  }

  function updateCanvasSize() {
    const baseWidth = 360;
    canvas.width = baseWidth;
    canvas.height = Math.round((baseWidth * state.ratio.h) / state.ratio.w);
    canvas.style.aspectRatio = `${state.ratio.w}/${state.ratio.h}`;
  }

  function defaultEffects() {
    return { blur: 0, brightness: 1, contrast: 1, saturate: 1, shadow: 0 };
  }

  function createDefaultAnim() {
    return {
      start: { x: canvas.width / 2, y: canvas.height / 2, scale: 1, rotation: 0, opacity: 1 },
      end: { x: canvas.width / 2, y: canvas.height / 2 - 120, scale: 1.4, rotation: 360, opacity: 1 },
      easing: 'easeInOut'
    };
  }

  function createLayer(type, extra = {}) {
    return {
      id: generateId(),
      type,
      name: `${type} ${state.layers.length + 1}`,
      color: ['#55d4ff', '#ffd166', '#ff7aa2', '#8cffb7', '#c5a8ff'][Math.floor(Math.random() * 5)],
      text: 'ALIGHT',
      size: 68,
      image: null,
      imageName: '',
      effects: defaultEffects(),
      anim: createDefaultAnim(),
      ...extra
    };
  }

  function addLayer(type) {
    const layer = createLayer(type);
    state.layers.push(layer);
    state.selectedLayerId = layer.id;
    refreshLayerSelect();
    syncControlsFromLayer(layer);
    draw();
  }

  function addImageLayerFromFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const layer = createLayer('image', {
          image: img,
          imageName: file.name,
          size: Math.min(220, Math.max(img.width * 0.3, 80))
        });
        state.layers.push(layer);
        state.selectedLayerId = layer.id;
        refreshLayerSelect();
        syncControlsFromLayer(layer);
        draw();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function getSelectedLayer() {
    return state.layers.find((l) => l.id === state.selectedLayerId) || null;
  }

  function refreshLayerSelect() {
    controls.layerSelect.innerHTML = '';
    state.layers.forEach((layer, idx) => {
      const option = document.createElement('option');
      option.value = layer.id;
      const base = `${t(`layerType.${layer.type}`)} ${idx + 1}`;
      option.textContent = layer.type === 'image' && layer.imageName ? `${base} (${layer.imageName})` : base;
      controls.layerSelect.append(option);
    });
    if (state.selectedLayerId) controls.layerSelect.value = state.selectedLayerId;
  }

  function syncControlsFromLayer(layer) {
    const { start, end, easing } = layer.anim;
    controls.startX.value = Math.round(start.x);
    controls.startY.value = Math.round(start.y);
    controls.startScale.value = start.scale;
    controls.startRotation.value = start.rotation;
    controls.startOpacity.value = start.opacity;
    controls.endX.value = Math.round(end.x);
    controls.endY.value = Math.round(end.y);
    controls.endScale.value = end.scale;
    controls.endRotation.value = end.rotation;
    controls.endOpacity.value = end.opacity;
    controls.easing.value = easing;

    controls.fxBlur.value = layer.effects.blur;
    controls.fxBrightness.value = layer.effects.brightness;
    controls.fxContrast.value = layer.effects.contrast;
    controls.fxSaturate.value = layer.effects.saturate;
    controls.fxShadow.value = layer.effects.shadow;
  }

  function clampLayer(layer) {
    layer.anim.start.x = clamp(layer.anim.start.x, 0, canvas.width);
    layer.anim.end.x = clamp(layer.anim.end.x, 0, canvas.width);
    layer.anim.start.y = clamp(layer.anim.start.y, 0, canvas.height);
    layer.anim.end.y = clamp(layer.anim.end.y, 0, canvas.height);
  }

  function applyLayerControls() {
    const layer = getSelectedLayer();
    if (!layer) return;
    layer.anim = {
      start: { x: Number(controls.startX.value), y: Number(controls.startY.value), scale: Number(controls.startScale.value), rotation: Number(controls.startRotation.value), opacity: Number(controls.startOpacity.value) },
      end: { x: Number(controls.endX.value), y: Number(controls.endY.value), scale: Number(controls.endScale.value), rotation: Number(controls.endRotation.value), opacity: Number(controls.endOpacity.value) },
      easing: controls.easing.value
    };
    layer.effects = {
      blur: Number(controls.fxBlur.value),
      brightness: Number(controls.fxBrightness.value),
      contrast: Number(controls.fxContrast.value),
      saturate: Number(controls.fxSaturate.value),
      shadow: Number(controls.fxShadow.value)
    };
    clampLayer(layer);
    draw();
  }

  function applySettings() {
    state.ratio = parseRatio(controls.screenRatio.value);
    state.fps = clamp(Number(controls.fps.value) || 30, 12, 120);
    state.duration = Math.max(0.2, Number(controls.timelineDuration.value) || 2);
    state.screenColor = controls.screenColor.value || '#0b0f17';
    controls.fps.value = String(state.fps);
    controls.timelineDuration.value = String(state.duration);

    state.customEase = {
      p1x: Number(controls.cp1x.value),
      p1y: Number(controls.cp1y.value),
      p2x: Number(controls.cp2x.value),
      p2y: Number(controls.cp2y.value)
    };

    updateCanvasSize();
    state.layers.forEach(clampLayer);
    state.time = Math.min(state.time, state.duration);
    drawEaseGraph();
    draw();
  }

  function toCurrentTransform(layer) {
    const pRaw = clamp(state.time / state.duration, 0, 1);
    const easeFn = easingMap[layer.anim.easing] || easingMap.linear;
    const tEase = easeFn(pRaw);
    const { start, end } = layer.anim;
    return {
      x: lerp(start.x, end.x, tEase),
      y: lerp(start.y, end.y, tEase),
      scale: lerp(start.scale, end.scale, tEase),
      rotation: lerp(start.rotation, end.rotation, tEase),
      opacity: lerp(start.opacity, end.opacity, tEase)
    };
  }

  function drawEaseGraph() {
    graphCtx.clearRect(0, 0, easeGraph.width, easeGraph.height);
    graphCtx.fillStyle = '#0b0f17';
    graphCtx.fillRect(0, 0, easeGraph.width, easeGraph.height);
    graphCtx.strokeStyle = 'rgba(255,255,255,0.25)';
    graphCtx.strokeRect(10, 10, easeGraph.width - 20, easeGraph.height - 20);

    const x0 = 10;
    const y0 = easeGraph.height - 10;
    const w = easeGraph.width - 20;
    const h = easeGraph.height - 20;

    graphCtx.beginPath();
    graphCtx.strokeStyle = '#55d4ff';
    for (let i = 0; i <= 100; i += 1) {
      const t = i / 100;
      const y = cubicBezierPoint(t, 0, state.customEase.p1y, state.customEase.p2y, 1);
      const px = x0 + t * w;
      const py = y0 - y * h;
      if (i === 0) graphCtx.moveTo(px, py);
      else graphCtx.lineTo(px, py);
    }
    graphCtx.stroke();
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    for (let x = 0; x <= canvas.width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLayer(layer) {
    const tf = toCurrentTransform(layer);
    ctx.save();
    ctx.translate(tf.x, tf.y);
    ctx.rotate((tf.rotation * Math.PI) / 180);
    ctx.scale(tf.scale, tf.scale);
    ctx.globalAlpha = clamp(tf.opacity, 0, 1);

    const fx = layer.effects;
    ctx.filter = `blur(${fx.blur}px) brightness(${fx.brightness}) contrast(${fx.contrast}) saturate(${fx.saturate})`;
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = fx.shadow;

    if (layer.type === 'rect') {
      ctx.fillStyle = layer.color;
      ctx.fillRect(-50, -50, 100, 100);
    } else if (layer.type === 'circle') {
      ctx.fillStyle = layer.color;
      ctx.beginPath();
      ctx.arc(0, 0, 55, 0, Math.PI * 2);
      ctx.fill();
    } else if (layer.type === 'image' && layer.image) {
      const w = layer.size;
      const h = (layer.image.height / layer.image.width) * w;
      ctx.drawImage(layer.image, -w / 2, -h / 2, w, h);
    } else {
      ctx.fillStyle = layer.color;
      ctx.font = `bold ${layer.size}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(layer.text, 0, 0);
    }

    ctx.restore();
  }

  function draw() {
    ctx.fillStyle = state.screenColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    state.layers.forEach(drawLayer);
    const progress = state.duration ? state.time / state.duration : 0;
    controls.scrubber.value = String(Math.floor(progress * 100));
    controls.timeLabel.textContent = `${state.time.toFixed(2)}s / ${state.duration.toFixed(2)}s`;
  }

  function tick(ts) {
    if (!state.playing) return;
    if (!state.startTimeRef) state.startTimeRef = ts - state.time * 1000;
    const elapsed = (ts - state.startTimeRef) / 1000;
    const frameDuration = 1 / state.fps;
    state.time = Math.min(Math.floor(elapsed / frameDuration) * frameDuration, state.duration);
    if (state.time >= state.duration) {
      state.playing = false;
      state.startTimeRef = 0;
    }
    draw();
    requestAnimationFrame(tick);
  }

  function bindEvents() {
    controls.addRect.addEventListener('click', () => addLayer('rect'));
    controls.addCircle.addEventListener('click', () => addLayer('circle'));
    controls.addText.addEventListener('click', () => addLayer('text'));
    controls.addImageBtn.addEventListener('click', () => addImageLayerFromFile(controls.imageInput.files?.[0]));
    controls.deleteLayer.addEventListener('click', () => {
      if (!state.selectedLayerId) return;
      state.layers = state.layers.filter((l) => l.id !== state.selectedLayerId);
      state.selectedLayerId = state.layers[0]?.id ?? null;
      refreshLayerSelect();
      const selected = getSelectedLayer();
      if (selected) syncControlsFromLayer(selected);
      draw();
    });

    controls.layerSelect.addEventListener('change', (e) => {
      state.selectedLayerId = e.target.value;
      const selected = getSelectedLayer();
      if (selected) syncControlsFromLayer(selected);
    });

    controls.applyBtn.addEventListener('click', applyLayerControls);
    controls.applySettingsBtn.addEventListener('click', applySettings);

    ['cp1x', 'cp1y', 'cp2x', 'cp2y'].forEach((id) => {
      controls[id].addEventListener('input', () => {
        state.customEase = {
          p1x: Number(controls.cp1x.value),
          p1y: Number(controls.cp1y.value),
          p2x: Number(controls.cp2x.value),
          p2y: Number(controls.cp2y.value)
        };
        drawEaseGraph();
      });
    });

    controls.language.addEventListener('change', () => applyLanguage(controls.language.value));
    controls.playBtn.addEventListener('click', () => {
      state.playing = true;
      state.startTimeRef = 0;
      requestAnimationFrame(tick);
    });
    controls.pauseBtn.addEventListener('click', () => {
      state.playing = false;
      state.startTimeRef = 0;
    });
    controls.resetBtn.addEventListener('click', () => {
      state.playing = false;
      state.startTimeRef = 0;
      state.time = 0;
      draw();
    });
    controls.scrubber.addEventListener('input', () => {
      state.playing = false;
      state.startTimeRef = 0;
      state.time = (Number(controls.scrubber.value) / 100) * state.duration;
      draw();
    });
  }

  function initialize() {
    updateCanvasSize();
    bindEvents();
    addLayer('rect');
    addLayer('text');
    controls.language.value = state.language;
    controls.timelineDuration.value = String(state.duration);
    applyLanguage(state.language);
    applySettings();
    updateProjectTimeInfo();
    setInterval(updateProjectTimeInfo, 1000);
  }

  return { ok: true, initialize, errorBox };
}

function mountApp() {
  const app = createApp();
  if (!app.ok) {
    const box = getEl('appError');
    if (box) {
      box.hidden = false;
      box.textContent = app.reason;
    }
    return;
  }
  if (app.errorBox) {
    app.errorBox.hidden = true;
    app.errorBox.textContent = '';
  }
  app.initialize();
}

document.addEventListener('DOMContentLoaded', mountApp);
