const canvas = document.getElementById('preview');
const ctx = canvas.getContext('2d');

const controls = {
  playBtn: document.getElementById('playBtn'),
  pauseBtn: document.getElementById('pauseBtn'),
  resetBtn: document.getElementById('resetBtn'),
  scrubber: document.getElementById('scrubber'),
  timeLabel: document.getElementById('timeLabel'),
  addRect: document.getElementById('addRect'),
  addCircle: document.getElementById('addCircle'),
  addText: document.getElementById('addText'),
  deleteLayer: document.getElementById('deleteLayer'),
  layerSelect: document.getElementById('layerSelect'),
  duration: document.getElementById('duration'),
  startX: document.getElementById('startX'),
  startY: document.getElementById('startY'),
  startScale: document.getElementById('startScale'),
  startRotation: document.getElementById('startRotation'),
  startOpacity: document.getElementById('startOpacity'),
  endX: document.getElementById('endX'),
  endY: document.getElementById('endY'),
  endScale: document.getElementById('endScale'),
  endRotation: document.getElementById('endRotation'),
  endOpacity: document.getElementById('endOpacity'),
  easing: document.getElementById('easing'),
  applyBtn: document.getElementById('applyBtn')
};

const palette = ['#55d4ff', '#ffd166', '#ff7aa2', '#8cffb7', '#c5a8ff'];

const easingMap = {
  linear: (t) => t,
  easeIn: (t) => t * t,
  easeOut: (t) => 1 - (1 - t) ** 2,
  easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2)
};

const state = {
  duration: 2,
  time: 0,
  playing: false,
  startTimeRef: 0,
  layers: [],
  selectedLayerId: null
};

function makeDefaultAnim() {
  return {
    start: { x: 180, y: 320, scale: 1, rotation: 0, opacity: 1 },
    end: { x: 180, y: 180, scale: 1.4, rotation: 360, opacity: 1 },
    easing: 'easeInOut'
  };
}

function randomColor() {
  return palette[Math.floor(Math.random() * palette.length)];
}

function addLayer(type) {
  const id = crypto.randomUUID();
  const layer = {
    id,
    name: `${type} ${state.layers.length + 1}`,
    type,
    color: randomColor(),
    text: 'ALIGHT',
    size: 68,
    anim: makeDefaultAnim()
  };

  state.layers.push(layer);
  state.selectedLayerId = id;
  refreshLayerSelect();
  syncControlsFromLayer(layer);
  draw();
}

function removeSelectedLayer() {
  if (!state.selectedLayerId) return;
  state.layers = state.layers.filter((layer) => layer.id !== state.selectedLayerId);
  state.selectedLayerId = state.layers[0]?.id ?? null;
  refreshLayerSelect();
  const selected = getSelectedLayer();
  if (selected) syncControlsFromLayer(selected);
  draw();
}

function getSelectedLayer() {
  return state.layers.find((layer) => layer.id === state.selectedLayerId) || null;
}

function refreshLayerSelect() {
  controls.layerSelect.innerHTML = '';
  state.layers.forEach((layer) => {
    const option = document.createElement('option');
    option.value = layer.id;
    option.textContent = layer.name;
    controls.layerSelect.append(option);
  });

  if (state.selectedLayerId) {
    controls.layerSelect.value = state.selectedLayerId;
  }
}

function syncControlsFromLayer(layer) {
  const { start, end, easing } = layer.anim;
  controls.startX.value = start.x;
  controls.startY.value = start.y;
  controls.startScale.value = start.scale;
  controls.startRotation.value = start.rotation;
  controls.startOpacity.value = start.opacity;
  controls.endX.value = end.x;
  controls.endY.value = end.y;
  controls.endScale.value = end.scale;
  controls.endRotation.value = end.rotation;
  controls.endOpacity.value = end.opacity;
  controls.easing.value = easing;
}

function applyControlsToLayer() {
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
  draw();
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function currentTransform(layer) {
  const progressRaw = Math.min(Math.max(state.time / state.duration, 0), 1);
  const ease = easingMap[layer.anim.easing] || easingMap.linear;
  const t = ease(progressRaw);
  const { start, end } = layer.anim;
  return {
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t),
    scale: lerp(start.scale, end.scale, t),
    rotation: lerp(start.rotation, end.rotation, t),
    opacity: lerp(start.opacity, end.opacity, t)
  };
}

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
  const transform = currentTransform(layer);

  ctx.save();
  ctx.translate(transform.x, transform.y);
  ctx.rotate((transform.rotation * Math.PI) / 180);
  ctx.scale(transform.scale, transform.scale);
  ctx.globalAlpha = Math.min(Math.max(transform.opacity, 0), 1);

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
  ctx.fillText('Alight Motion Web Lite Demo', 12, canvas.height - 16);
  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  state.layers.forEach(drawLayer);
  drawWatermark();

  const ratio = state.duration ? state.time / state.duration : 0;
  controls.scrubber.value = String(Math.floor(ratio * 100));
  controls.timeLabel.textContent = `${state.time.toFixed(2)}s / ${state.duration.toFixed(2)}s`;
}

function tick(ts) {
  if (!state.playing) return;

  if (!state.startTimeRef) {
    state.startTimeRef = ts - state.time * 1000;
  }

  const elapsed = (ts - state.startTimeRef) / 1000;
  state.time = Math.min(elapsed, state.duration);

  if (state.time >= state.duration) {
    state.playing = false;
    state.startTimeRef = 0;
  }

  draw();
  requestAnimationFrame(tick);
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

controls.addRect.addEventListener('click', () => addLayer('rect'));
controls.addCircle.addEventListener('click', () => addLayer('circle'));
controls.addText.addEventListener('click', () => addLayer('text'));
controls.deleteLayer.addEventListener('click', removeSelectedLayer);
controls.applyBtn.addEventListener('click', applyControlsToLayer);

controls.layerSelect.addEventListener('change', (event) => {
  state.selectedLayerId = event.target.value;
  const selected = getSelectedLayer();
  if (selected) syncControlsFromLayer(selected);
});

controls.duration.addEventListener('change', () => {
  state.duration = Math.max(Number(controls.duration.value) || 0.2, 0.2);
  if (state.time > state.duration) {
    state.time = state.duration;
  }
  draw();
});

controls.scrubber.addEventListener('input', () => {
  pause();
  state.time = (Number(controls.scrubber.value) / 100) * state.duration;
  draw();
});

controls.playBtn.addEventListener('click', play);
controls.pauseBtn.addEventListener('click', pause);
controls.resetBtn.addEventListener('click', reset);

addLayer('rect');
addLayer('text');
reset();
