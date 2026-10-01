// Хелперы экранов презентации v2: мини-компоненты интерфейса ABAI, окно роли, мини-графики.
// ROLES, MENUS и MODULE_V2 объявляет модуль в slides.js (используются при вызове).

// ---------- Мини-компоненты интерфейса ----------
const c = (n) => (n ? ` data-c="${n}"` : '');
const ui = {
  h: (t, sub) => `<div class="u-h"><b>${t}</b>${sub ? `<span>${sub}</span>` : ''}</div>`,
  field: (l, v, n, o = {}) => `<div class="u-field${o.hl ? ' hl' : ''}${o.full ? ' full' : ''}"${c(n)}><label>${l}</label><div>${v}</div></div>`,
  btn: (t, kind = 'primary', n, o = {}) => `<button class="u-btn ${kind}${o.pressed ? ' pressed' : ''}"${c(n)}>${t}</button>`,
  doc: (t, st, n, kind = 'pdf') => `<div class="u-doc"${c(n)}><i class="${kind}">${kind.toUpperCase()}</i><span>${t}</span>${st ? `<em class="${st[0]}">${st[1]}</em>` : ''}</div>`,
  task: (t, sub, n, o = {}) => `<div class="u-task${o.new ? ' new' : ''}"${c(n)}><div><b>${t}</b><span>${sub}</span></div>${o.badge ? `<em class="${o.badge[0]}">${o.badge[1]}</em>` : ''}</div>`,
  status: (t, kind = 'good', n) => `<div class="u-status ${kind}"${c(n)}>${t}</div>`,
  row: (...a) => `<div class="u-row">${a.join('')}</div>`,
  grid: (...a) => `<div class="u-grid">${a.join('')}</div>`,
  kpi: (v, l, n, tone = '') => `<div class="u-kpi ${tone}"${c(n)}><b>${v}</b><span>${l}</span></div>`,
  sys: (t) => `<span class="u-sys">${t}</span>`,
  note: (t, kind = 'info', n) => `<div class="u-note ${kind}"${c(n)}>${t}</div>`,
  alarm: (t, sub, kind = 'crit', n) => `<div class="u-alarm ${kind}"${c(n)}><b>${t}</b><span>${sub}</span></div>`,
  // Таблица: rows — массив массивов; hl — индекс выделенной строки
  table: (head, rows, n, o = {}) => `<table class="u-table"${c(n)}><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, i) => `<tr class="${i === o.hl ? 'hl' : ''}">${r.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
  flow: (...a) => `<div class="u-flowline">${a.join('<i>→</i>')}</div>`,
  sp: () => '<div class="u-sp"></div>',
};
const em = (t, k = 'ok') => `<em class="${k}">${t}</em>`;

// Экран роли: плашка этапа + окно ABAI с меню роли (o.nomenu — без меню, для слайдов с тремя экранами)
function screen(role, stage, active, body, o = {}) {
  const r = ROLES[role];
  return {
    role, weight: o.weight || 1,
    html: `<div class="scr-stage" style="--rc:${r.color}"><span>${stage}</span><em>${r.name}</em></div>
      <div class="scr-win">
        <div class="scr-top"><i class="logo"></i><b>ABAI</b><span>${o.module || MODULE_V2.name}</span><div class="scr-user" style="--rc:${r.color}">${r.short.slice(0, 2).toUpperCase()}</div></div>
        <div class="scr-main">
          ${o.nomenu ? '' : `<aside class="scr-menu">${MENUS[role].map((m) => `<div class="${m === active ? 'on' : ''}">${m}</div>`).join('')}</aside>`}
          <section class="scr-body">${body}</section>
        </div>
      </div>`,
  };
}

// ---------- Мини-графики ----------
function lineSVG(series, labels, o = {}) {
  const W = 440, H = o.h || 140, m = 28;
  const all = series.flatMap((s) => s.v), max = o.max || Math.ceil(Math.max(...all) * 1.1), min = o.min ?? 0;
  const n = series[0].v.length;
  const x = (i) => m + (i / (n - 1)) * (W - m - 60), y = (v) => H - 18 - ((v - min) / (max - min)) * (H - 30);
  const path = (a) => a.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="u-chart">
    ${[0, 0.5, 1].map((t) => { const v = min + (max - min) * t; return `<line x1="${m}" x2="${W - 60}" y1="${y(v)}" y2="${y(v)}" stroke="#eceef2"/><text x="${m - 5}" y="${y(v) + 3}" text-anchor="end">${Math.round(v).toLocaleString('ru-RU')}</text>`; }).join('')}
    ${series.map((s) => `<path d="${path(s.v)}" fill="none" stroke="${s.c}" stroke-width="2" ${s.dash ? 'stroke-dasharray="5 4"' : ''}/><circle cx="${x(s.v.length - 1)}" cy="${y(s.v[s.v.length - 1])}" r="3.5" fill="${s.c}"/><text x="${x(s.v.length - 1) + 7}" y="${y(s.v[s.v.length - 1]) + 4}" class="lbl">${s.l}</text>`).join('')}
    ${labels ? `<text x="${m}" y="${H - 2}">${labels[0]}</text><text x="${W - 60}" y="${H - 2}" text-anchor="end">${labels[1]}</text>` : ''}</svg>`;
}
function barsSVG(items, o = {}) {
  const W = 440, rowH = 20, L = o.L || 110, R = 46, H = items.length * rowH + 6;
  const max = o.max || Math.max(...items.map((i) => i[1])) * 1.1;
  const xs = (v) => L + (v / max) * (W - L - R);
  return `<svg viewBox="0 0 ${W} ${H}" class="u-chart">
    ${items.map(([n, v, hl], i) => `<text x="${L - 6}" y="${i * rowH + 14}" text-anchor="end" class="${hl ? 'lbl b' : 'lbl'}">${n}</text>
      <rect x="${L}" y="${i * rowH + 4}" width="${Math.max(2, xs(v) - L)}" height="12" rx="3" fill="${hl ? '#2a78d6' : '#c3c8d1'}"/>
      <text x="${xs(v) + 5}" y="${i * rowH + 14}" class="${hl ? 'lbl b' : 'lbl'}">${String(v).replace('.', ',')}${o.unit || ''}</text>`).join('')}</svg>`;
}
