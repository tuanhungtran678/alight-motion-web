// ===== Helpers =====
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

// ===== App Factory =====
function createApp() {
  const canvas = getEl('preview');
  const errorBox = getEl('appError');

  if (!canvas) {
    return {
      ok: false,
      reason: 'Không tìm thấy canvas #preview. Hãy mở đúng file index.html.'
    };
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      ok: false,
      reason: 'Trình duyệt không hỗ trợ 2D canvas context.'
    };
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
    deleteLayer: getEl('deleteLayer'),
    layerSelect: getEl('layerSelect'),
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
    applyBtn: getEl('applyBtn'),
    language: getEl('language'),
    screenRatio: getEl('screenRatio'),
    fps: getEl('fps'),
    screenColor: getEl('screenColor'),
    totalEditDuration: getEl('totalEditDuration'),
    applySettingsBtn: getEl('applySettingsBtn')
  };

  const missing = Object.entries(controls).find(([, el]) => !el);
  if (missing) {
    return {
      ok: false,
      reason: `Thiếu thành phần giao diện: ${missing[0]}.`
    };
  }

  const palette = ['#55d4ff', '#ffd166', '#ff7aa2', '#8cffb7', '#c5a8ff'];

  const i18n = {
    vi: {
      'app.title': 'Alight Motion Web Lite',
      'app.subtitle': 'Bản web đơn giản để dựng chuyển động nhanh trên điện thoại.',
      'app.hint.extension': 'Nếu thấy lỗi <code>chrome-extension://...popup.js</code> thì hãy tắt extension trình duyệt rồi tải lại.',
      'app.hint.url': 'Mở đúng URL: <code>.../index.html</code> (hoặc chạy local server) để thấy giao diện app.',
      'transport.play': '▶ Phát',
      'transport.pause': '⏸ Dừng',
      'transport.reset': '↺ Reset',
      'transport.scrub': 'Tua',
      'layer.title': 'Tạo layer',
      'layer.addRect': '+ Hình chữ nhật',
      'layer.addCircle': '+ Hình tròn',
      'layer.addText': '+ Text',
      'layer.current': 'Layer hiện tại',
      'layer.delete': 'Xóa layer',
      'anim.title': 'Thiết lập chuyển động',
      'anim.startTitle': 'Giá trị bắt đầu',
      'anim.endTitle': 'Giá trị kết thúc',
      'field.x': 'X',
      'field.y': 'Y',
      'field.scale': 'Scale',
      'field.rotate': 'Rotate°',
      'field.opacity': 'Opacity',
      'anim.ease': 'Ease',
      'anim.apply': 'Áp dụng vào layer',
      'settings.title': 'Settings',
      'settings.language': 'Ngôn ngữ',
      'settings.ratio': 'Tỉ lệ màn hình',
      'settings.ratio.9x16': '9:16 (Dọc)',
      'settings.ratio.1x1': '1:1 (Vuông)',
      'settings.ratio.16x9': '16:9 (Ngang)',
      'settings.ratio.4x5': '4:5',
      'settings.fps': 'FPS',
      'settings.screenColor': 'Màu màn hình',
      'settings.duration': 'Tổng thời gian chỉnh sửa (giây)',
      'settings.apply': 'Áp dụng settings',
      'layerType.rect': 'Hình chữ nhật',
      'layerType.circle': 'Hình tròn',
      'layerType.text': 'Text',
      'watermark': 'Alight Motion Web Lite'
    },
    en: {
      'app.title': 'Alight Motion Web Lite',
      'app.subtitle': 'A simple web version for quick motion editing on mobile.',
      'app.hint.extension': 'If you see <code>chrome-extension://...popup.js</code> errors, disable the browser extension and reload.',
      'app.hint.url': 'Open the correct URL: <code>.../index.html</code> (or run a local server) to view the app.',
      'transport.play': '▶ Play',
      'transport.pause': '⏸ Pause',
      'transport.reset': '↺ Reset',
      'transport.scrub': 'Scrub',
      'layer.title': 'Create layers',
      'layer.addRect': '+ Rectangle',
      'layer.addCircle': '+ Circle',
      'layer.addText': '+ Text',
      'layer.current': 'Current layer',
      'layer.delete': 'Delete layer',
      'anim.title': 'Animation setup',
      'anim.startTitle': 'Start values',
      'anim.endTitle': 'End values',
      'field.x': 'X',
      'field.y': 'Y',
      'field.scale': 'Scale',
      'field.rotate': 'Rotate°',
      'field.opacity': 'Opacity',
      'anim.ease': 'Ease',
      'anim.apply': 'Apply to layer',
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.ratio': 'Screen ratio',
      'settings.ratio.9x16': '9:16 (Portrait)',
      'settings.ratio.1x1': '1:1 (Square)',
      'settings.ratio.16x9': '16:9 (Landscape)',
      'settings.ratio.4x5': '4:5',
      'settings.fps': 'FPS',
      'settings.screenColor': 'Screen color',
      'settings.duration': 'Total edit duration (seconds)',
      'settings.apply': 'Apply settings',
      'layerType.rect': 'Rectangle',
      'layerType.circle': 'Circle',
      'layerType.text': 'Text',
      'watermark': 'Alight Motion Web Lite'
    }
  };

  const easingMap = {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => 1 - (1 - t) ** 2,
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2)
  };

  const state = {
    duration: 2,
    fps: 30,
    ratio: { w: 9, h: 16 },
    screenColor: '#0b0f17',
    language: 'vi',
    time: 0,
    playing: false,
    startTimeRef: 0,
    layers: [],
    selectedLayerId: null
  };

  function t(key) {
    return i18n[state.language]?.[key] || i18n.vi[key] || key;
  }

  function applyLanguage(lang) {
    state.language = i18n[lang] ? lang : 'vi';
    document.documentElement.lang = state.language;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      const text = t(key);
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.dataset.i18nTitle;
      el.textContent = t(key);
    });

    refreshLayerSelect();
    draw();
  }

  // ===== Domain =====
  function createDefaultAnimation() {
    return {
      start: { x: canvas.width / 2, y: canvas.height / 2, scale: 1, rotation: 0, opacity: 1 },
      end: { x: canvas.width / 2, y: canvas.height / 2 - 120, scale: 1.4, rotation: 360, opacity: 1 },
      easing: 'easeInOut'
    };
  }

  function addLayer(type) {
    const layer = {
      id: generateId(),
      name: `${type} ${state.layers.length + 1}`,
      type,
      color: palette[Math.floor(Math.random() * palette.length)],
      text: 'ALIGHT',
      size: 68,
      anim: createDefaultAnimation()
    };

    state.layers.push(layer);
    state.selectedLayerId = layer.id;

    refreshLayerSelect();
    syncAnimationControlsFromLayer(layer);
    draw();
  }

  function getSelectedLayer() {
    return state.layers.find((layer) => layer.id === state.selectedLayerId) || null;
  }

  function deleteSelectedLayer() {
    if (!state.selectedLayerId) return;

    state.layers = state.layers.filter((layer) => layer.id !== state.selectedLayerId);
    state.selectedLayerId = state.layers[0]?.id ?? null;

    refreshLayerSelect();

    const selected = getSelectedLayer();
    if (selected) {
      syncAnimationControlsFromLayer(selected);
    }

    draw();
  }

  // ===== Settings =====
  function updateCanvasSize() {
    const baseWidth = 360;
    const nextHeight = Math.round((baseWidth * state.ratio.h) / state.ratio.w);
    canvas.width = baseWidth;
    canvas.height = nextHeight;
    canvas.style.aspectRatio = `${state.ratio.w}/${state.ratio.h}`;
  }

  function clampLayerToCanvas(layer) {
    layer.anim.start.x = clamp(layer.anim.start.x, 0, canvas.width);
    layer.anim.end.x = clamp(layer.anim.end.x, 0, canvas.width);
    layer.anim.start.y = clamp(layer.anim.start.y, 0, canvas.height);
    layer.anim.end.y = clamp(layer.anim.end.y, 0, canvas.height);
  }

  function applySettingsFromControls() {
    state.ratio = parseRatio(controls.screenRatio.value);
    state.fps = clamp(Number(controls.fps.value) || 30, 12, 120);
    state.duration = Math.max(0.2, Number(controls.totalEditDuration.value) || 2);
    state.screenColor = controls.screenColor.value || '#0b0f17';

    controls.fps.value = String(state.fps);
    controls.totalEditDuration.value = String(state.duration);

    updateCanvasSize();
    state.layers.forEach(clampLayerToCanvas);
    state.time = Math.min(state.time, state.duration);

    draw();
  }

  // ===== Animation Form =====
  function refreshLayerSelect() {
    controls.layerSelect.innerHTML = '';

    state.layers.forEach((layer) => {
      const option = document.createElement('option');
      option.value = layer.id;
      option.textContent = `${t(`layerType.${layer.type}`)} ${state.layers.indexOf(layer) + 1}`;
      controls.layerSelect.append(option);
    });

    if (state.selectedLayerId) {
      controls.layerSelect.value = state.selectedLayerId;
    }
  }

  function syncAnimationControlsFromLayer(layer) {
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
  }

  function applyAnimationControlsToLayer() {
    const layer = getSelectedLayer();
    if (!layer) return;

    layer.anim = {
      start: {
        x: Number(controls.startX.value),
        y: Number(controls.startY.value),
        scale: Number(controls.startScale.value),
        rotation: Number(controls.startRotation.value),
        opacity: Number(controls.startOpacity.value)
      },
      end: {
        x: Number(controls.endX.value),
        y: Number(controls.endY.value),
        scale: Number(controls.endScale.value),
        rotation: Number(controls.endRotation.value),
        opacity: Number(controls.endOpacity.value)
      },
      easing: controls.easing.value
    };

    clampLayerToCanvas(layer);
    draw();
  }

  // ===== Playback =====
  function toCurrentTransform(layer) {
    const progressRaw = clamp(state.time / state.duration, 0, 1);
    const easing = easingMap[layer.anim.easing] || easingMap.linear;
    const t = easing(progressRaw);
    const { start, end } = layer.anim;

    return {
      x: lerp(start.x, end.x, t),
      y: lerp(start.y, end.y, t),
      scale: lerp(start.scale, end.scale, t),
      rotation: lerp(start.rotation, end.rotation, t),
      opacity: lerp(start.opacity, end.opacity, t)
    };
  }

  function play() {
    state.playing = true;
    state.startTimeRef = 0;
    requestAnimationFrame(tick);
  }

  function pause() {
    state.playing = false;
    state.startTimeRef = 0;
  }

  function reset() {
    pause();
    state.time = 0;
    draw();
  }

  function tick(ts) {
    if (!state.playing) return;

    if (!state.startTimeRef) {
      state.startTimeRef = ts - state.time * 1000;
    }

    const elapsed = (ts - state.startTimeRef) / 1000;
    const frameDuration = 1 / state.fps;
    state.time = Math.min(Math.floor(elapsed / frameDuration) * frameDuration, state.duration);

    if (state.time >= state.duration) {
      pause();
    }

    draw();
    requestAnimationFrame(tick);
  }

  // ===== Render =====
  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;

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
    const transform = toCurrentTransform(layer);

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.scale, transform.scale);
    ctx.globalAlpha = clamp(transform.opacity, 0, 1);

    ctx.fillStyle = layer.color;

    if (layer.type === 'rect') {
      ctx.fillRect(-50, -50, 100, 100);
    } else if (layer.type === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, 55, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.font = `bold ${layer.size}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(layer.text, 0, 0);
    }

    ctx.restore();
  }

  function drawWatermark() {
    ctx.save();
    ctx.fillStyle = 'rgba(231,236,248,0.4)';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`${t('watermark')} • ${state.fps} FPS • ${state.ratio.w}:${state.ratio.h}`, 12, canvas.height - 16);
    ctx.restore();
  }

  function draw() {
    ctx.fillStyle = state.screenColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    state.layers.forEach(drawLayer);
    drawWatermark();

    const progress = state.duration ? state.time / state.duration : 0;
    controls.scrubber.value = String(Math.floor(progress * 100));
    controls.timeLabel.textContent = `${state.time.toFixed(2)}s / ${state.duration.toFixed(2)}s`;
  }

  // ===== Wiring =====
  function bindEvents() {
    controls.addRect.addEventListener('click', () => addLayer('rect'));
    controls.addCircle.addEventListener('click', () => addLayer('circle'));
    controls.addText.addEventListener('click', () => addLayer('text'));
    controls.deleteLayer.addEventListener('click', deleteSelectedLayer);

    controls.applyBtn.addEventListener('click', applyAnimationControlsToLayer);
    controls.applySettingsBtn.addEventListener('click', applySettingsFromControls);

    controls.language.addEventListener('change', () => {
      applyLanguage(controls.language.value);
    });

    controls.layerSelect.addEventListener('change', (event) => {
      state.selectedLayerId = event.target.value;
      const selected = getSelectedLayer();
      if (selected) syncAnimationControlsFromLayer(selected);
    });

    controls.scrubber.addEventListener('input', () => {
      pause();
      state.time = (Number(controls.scrubber.value) / 100) * state.duration;
      draw();
    });

    controls.playBtn.addEventListener('click', play);
    controls.pauseBtn.addEventListener('click', pause);
    controls.resetBtn.addEventListener('click', reset);
  }

  function initialize() {
    updateCanvasSize();
    bindEvents();

    addLayer('rect');
    addLayer('text');

    controls.language.value = state.language;
    applyLanguage(state.language);
    applySettingsFromControls();
    reset();
  }

  return {
    ok: true,
    initialize,
    errorBox
  };
}

// ===== Bootstrap =====
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
