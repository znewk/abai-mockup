// Лёгкие SVG-графики без зависимостей: линейный (с перекрестием и подсказкой) и горизонтальные столбцы.

const SVGNS = 'http://www.w3.org/2000/svg';
const fmt = (v, d = 1) => Number(v).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });

// Шкала с «круглым» шагом: 0, 10, 20… или 0, 5, 10…
function niceScale(max, ticks = 5) {
  const raw = max / ticks;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / p;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
  const count = Math.ceil(max / step);
  return { max: step * count, step, count };
}

function el(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

// series: [{ key, name, color, unit }]
function lineChart(host, rows, series, { height = 260, xLabel = (r) => r.day, tipTitle = (r) => r.day } = {}) {
  host.innerHTML = '';
  host.classList.add('chart');
  const W = host.clientWidth || 720, H = height;
  const m = { t: 12, r: 90, b: 26, l: 40 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const sc = niceScale(Math.max(...rows.flatMap((r) => series.map((s) => r[s.key]))) * 1.05);
  const maxV = sc.max;
  const x = (i) => m.l + (rows.length === 1 ? iw / 2 : (i / (rows.length - 1)) * iw);
  const y = (v) => m.t + ih - (v / maxV) * ih;

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' }, host);
  for (let i = 0; i <= sc.count; i++) {
    const v = sc.step * i;
    el('line', { x1: m.l, x2: m.l + iw, y1: y(v), y2: y(v), class: 'grid-line' }, svg);
    el('text', { x: m.l - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'axis-text' }, svg).textContent = fmt(v, sc.step % 1 ? 1 : 0);
  }
  rows.forEach((r, i) => {
    if (i % 5 === 0 || i === rows.length - 1) el('text', { x: x(i), y: H - 6, 'text-anchor': 'middle', class: 'axis-text' }, svg).textContent = xLabel(r);
  });

  series.forEach((s) => {
    const d = rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(r[s.key]).toFixed(1)}`).join('');
    el('path', { d, fill: 'none', stroke: s.color, 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, svg);
    const last = rows[rows.length - 1];
    el('circle', { cx: x(rows.length - 1), cy: y(last[s.key]), r: 4, fill: s.color, stroke: '#fff', 'stroke-width': 2 }, svg);
    // Прямая подпись у конца линии
    el('text', { x: x(rows.length - 1) + 10, y: y(last[s.key]) + 4, class: 'label' }, svg).textContent = `${s.name} ${fmt(last[s.key])}`;
  });

  // Слой наведения: перекрестие + подсказка
  const cross = el('line', { y1: m.t, y2: m.t + ih, stroke: '#9aa1ad', 'stroke-width': 1, 'stroke-dasharray': '3 3', visibility: 'hidden' }, svg);
  const dots = series.map((s) => el('circle', { r: 4, fill: s.color, stroke: '#fff', 'stroke-width': 2, visibility: 'hidden' }, svg));
  const hit = el('rect', { x: m.l, y: m.t, width: iw, height: ih, fill: 'transparent' }, svg);
  const tip = document.createElement('div');
  tip.className = 'tooltip';
  host.appendChild(tip);

  const move = (evt) => {
    const box = svg.getBoundingClientRect();
    const px = ((evt.clientX - box.left) / box.width) * W;
    const i = Math.max(0, Math.min(rows.length - 1, Math.round(((px - m.l) / iw) * (rows.length - 1))));
    const r = rows[i];
    cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('visibility', 'visible');
    dots.forEach((d, k) => { d.setAttribute('cx', x(i)); d.setAttribute('cy', y(r[series[k].key])); d.setAttribute('visibility', 'visible'); });
    tip.innerHTML = `<div class="tt-h">${tipTitle(r)}</div>` + series.map((s) =>
      `<div class="tt-r"><span><i class="sw" style="background:${s.color}"></i>${s.name}</span><b>${fmt(r[s.key])} ${s.unit || ''}</b></div>`).join('') +
      (r.wc != null ? `<div class="tt-r"><span>Обводнённость</span><b>${fmt(r.wc)} %</b></div>` : '') +
      (r.hours != null ? `<div class="tt-r"><span>Время работы</span><b>${r.hours} ч</b></div>` : '');
    tip.style.display = 'block';
    const sx = (x(i) / W) * box.width;
    tip.style.left = (sx + 170 > box.width ? sx - 170 : sx + 12) + 'px';
    tip.style.top = '8px';
  };
  hit.addEventListener('mousemove', move);
  hit.addEventListener('mouseleave', () => {
    tip.style.display = 'none'; cross.setAttribute('visibility', 'hidden'); dots.forEach((d) => d.setAttribute('visibility', 'hidden'));
  });
}

// items: [{ label, value, highlight, extra }]
function barChart(host, items, { unit = '', valueName = '', median = true } = {}) {
  host.innerHTML = '';
  host.classList.add('chart');
  const W = host.clientWidth || 600, rowH = 28, gap = 2;
  const m = { t: 24, r: 70, b: 24, l: 110 };
  const H = m.t + m.b + items.length * rowH;
  const sc = niceScale(Math.max(...items.map((i) => i.value)) * 1.05);
  const maxV = sc.max;
  const iw = W - m.l - m.r;
  const xs = (v) => m.l + (v / maxV) * iw;

  const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' }, host);
  for (let i = 0; i <= sc.count; i++) {
    const v = sc.step * i;
    el('line', { x1: xs(v), x2: xs(v), y1: m.t, y2: H - m.b, class: 'grid-line' }, svg);
    el('text', { x: xs(v), y: H - 6, 'text-anchor': 'middle', class: 'axis-text' }, svg).textContent = fmt(v, sc.step % 1 ? 1 : 0);
  }
  const tip = document.createElement('div');
  tip.className = 'tooltip';
  host.appendChild(tip);

  items.forEach((it, i) => {
    const y0 = m.t + i * rowH + gap;
    const h = rowH - gap * 2 - 6;
    const w = Math.max(2, xs(it.value) - m.l);
    const color = it.highlight ? 'var(--series-1)' : 'var(--neutral-mark)';
    // Скругление 4px только на «конце данных», начало прижато к базовой линии
    const r = Math.min(4, w);
    const d = `M${m.l},${y0 + 3} h${w - r} a${r},${r} 0 0 1 ${r},${r} v${h - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - r} z`;
    el('path', { d, fill: color }, svg);
    el('text', { x: m.l - 8, y: y0 + 3 + h / 2 + 4, 'text-anchor': 'end', class: 'label' + (it.highlight ? ' strong' : '') }, svg).textContent = it.label;
    el('text', { x: xs(it.value) + 6, y: y0 + 3 + h / 2 + 4, class: 'label' + (it.highlight ? ' strong' : '') }, svg).textContent = fmt(it.value);
    const hit = el('rect', { x: 0, y: m.t + i * rowH, width: W, height: rowH, fill: 'transparent' }, svg);
    hit.addEventListener('mousemove', (evt) => {
      const box = svg.getBoundingClientRect();
      tip.innerHTML = `<div class="tt-h">Скв. ${it.label}</div><div class="tt-r"><span>${valueName}</span><b>${fmt(it.value)} ${unit}</b></div>` + (it.extra || '');
      tip.style.display = 'block';
      tip.style.left = Math.min(evt.clientX - box.left + 12, box.width - 190) + 'px';
      tip.style.top = (((m.t + i * rowH) / H) * box.height + rowH) + 'px';
    });
    hit.addEventListener('mouseleave', () => (tip.style.display = 'none'));
  });

  if (median) {
    const vals = items.filter((i) => !i.highlight).map((i) => i.value).sort((a, b) => a - b);
    const med = vals.length % 2 ? vals[(vals.length - 1) / 2] : (vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2;
    el('line', { x1: xs(med), x2: xs(med), y1: m.t - 6, y2: H - m.b, stroke: '#4d5563', 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }, svg);
    el('text', { x: xs(med), y: m.t - 10, 'text-anchor': 'middle', class: 'axis-text' }, svg).textContent = `медиана окружения ${fmt(med)}`;
    return med;
  }
}
