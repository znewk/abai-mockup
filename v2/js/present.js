// Движок презентации v2: слайды, пошаговое раскрытие действий, фильтр по роли.

const $ = (s, r = document) => r.querySelector(s);
const W = 1600, H = 900;
const MAP_SLIDES = ['s1', 's2', 's3', 's4', 's5', 's6', 's7'];

const st = { scn: 'fast', idx: 0, role: 'all', stepMode: true, reveal: 1 };

// Состояние в адресе: #fast/3/geologist — удобно делиться ссылкой на конкретный слайд
function readHash() {
  const [scn, idx, role] = location.hash.replace('#', '').split('/');
  if (SCENARIOS.some((s) => s.id === scn)) st.scn = scn;
  if (['all', ...Object.keys(ROLES)].includes(role)) st.role = role;
  st.idx = Math.max(0, Math.min((+idx || 1) - 1, slideList().length - 1));
}
function writeHash() { history.replaceState(null, '', `#${st.scn}/${st.idx + 1}/${st.role}`); }

const scenario = () => SCENARIOS.find((s) => s.id === st.scn);
// В режиме роли остаются только слайды, где эта роль что-то видит
function slideList() {
  return scenario().slides.filter((id) => !SLIDES[id] || st.role === 'all' || SLIDES[id].frames.some((f) => f.role === st.role));
}
const curId = () => slideList()[st.idx];
function visibleActions(s) { return s.actions.filter((a) => st.role === 'all' || a.role === st.role); }

// ---------- Отрисовка ----------
function render() {
  const id = curId();
  const s = SLIDES[id];
  const list = slideList();
  const stage = $('#stage');
  const scn = scenario();
  const stepNo = s ? list.filter((x) => SLIDES[x]).indexOf(id) + 1 : 0;
  const stepTotal = list.filter((x) => SLIDES[x]).length;

  const header = (kicker, title) => `
    <header class="st-h">
      <div class="top"><div class="kicker">${kicker}</div>
      <div class="tools">
        <div class="seg" id="scnSeg">${SCENARIOS.map((x) => `<button data-scn="${x.id}" class="${x.id === st.scn ? 'on' : ''}">${x.name}</button>`).join('')}</div>
        <div class="seg" id="roleSeg"><button data-role="all" class="${st.role === 'all' ? 'on' : ''}">Все роли</button>${Object.entries(ROLES).map(([k, r]) => `<button data-role="${k}" class="${st.role === k ? 'on' : ''}"><i style="background:${r.color}"></i>${r.short}</button>`).join('')}</div>
        <button class="tool-btn ${st.stepMode ? 'on' : ''}" id="stepToggle" title="Раскрывать действия по одному">Пошагово</button>
        <a class="tool-btn" href="../index.html" title="Интерактивный прототип v1">Прототип v1</a>
      </div></div>
      <h1>${title}</h1>
    </header>`;

  let body = '';
  if (id === 'cover') body = header(`<span class="scn">${scn.name}</span><span>· ${scn.sub}</span>`, 'Освоение скважины в ABAI — сценарий глазами каждой роли') + coverHTML();
  else if (id === 'summary') body = header(`<span class="scn">${scn.name}</span><span>· итог</span>`, st.role === 'all' ? 'Что увидел и сделал каждый участник' : `Что видит и делает ${ROLES[st.role].name}`) + summaryHTML();
  else {
    const frames = s.frames.filter((f) => st.role === 'all' || f.role === st.role);
    const acts = visibleActions(s);
    const flowHTML = `<div class="flow"><b>→</b>${s.flow || ''}</div>`;
    body = header(`<span class="code">${s.code}</span><span class="scn">${scn.name}</span><span>· шаг ${stepNo} из ${stepTotal}</span>`, s.title) + `
      <svg class="st-links" viewBox="0 0 ${W} ${H}"></svg>
      <div class="st-body">
        <div class="st-frames ${frames.length === 1 ? 'single' : ''}">
          ${frames.map((f, i) => `${i ? (s.flow ? flowHTML : '<div class="flow"></div>') : ''}<div class="frame" data-role="${f.role}" style="flex-grow:${f.weight}">${f.html}</div>`).join('')}
        </div>
        <aside class="st-actions ${acts.length > 4 ? 'dense' : ''}">
          ${acts.map((a, i) => `<div class="act ${a.alt ? 'alt' : ''}" data-i="${i}" style="--rc:${ROLES[a.role].color}">
            <div class="num">${a.n}</div><div class="who">${ROLES[a.role].short}</div><div class="t">${a.t}</div><div class="d">${a.d}</div>
            ${a.sys ? `<div class="sys">${a.sys.map((x) => `<span>${x}</span>`).join('')}</div>` : ''}</div>`).join('')}
        </aside>
      </div>
      <div class="st-badges"></div>`;
  }

  stage.innerHTML = body + footerHTML(list);
  bind();
  if (s) requestAnimationFrame(() => { layoutLinks(); applyReveal(); });
  else if (id === 'cover') requestAnimationFrame(layoutMapLinks);
  writeHash();
}

function footerHTML(list) {
  const s = SLIDES[curId()];
  const acts = s ? visibleActions(s) : [];
  const shown = st.stepMode ? Math.min(st.reveal, acts.length) : acts.length;
  return `<footer class="st-foot">
    <button class="nav-btn" id="prev" ${st.idx === 0 && (!st.stepMode || st.reveal <= 1) ? 'disabled' : ''} title="Назад (←)">←</button>
    <div class="timeline">${list.map((id, i) => {
      const lbl = id === 'cover' ? 'Карта сценария' : id === 'summary' ? 'Итог' : `${SLIDES[id].code}`;
      return `<button data-go="${i}" class="${i === st.idx ? 'on' : i < st.idx ? 'done' : ''}" title="${id === 'cover' || id === 'summary' ? lbl : SLIDES[id].title}">${lbl}</button>`;
    }).join('')}</div>
    <div class="counter">${s ? `действие <b>${shown}</b> из ${acts.length}` : `слайд <b>${st.idx + 1}</b> из ${list.length}`}</div>
    <button class="nav-btn next" id="next" ${st.idx === list.length - 1 && (!s || shown >= acts.length) ? 'disabled' : ''} title="Далее (→ или пробел)">→</button>
  </footer>`;
}

// ---------- Обложка: карта сценария «роли × шаги» ----------
function coverHTML() {
  const scn = scenario();
  if (scn.id !== 'fast') {
    return `<div class="cover"><div class="cover-lead">${scn.sub[0].toUpperCase() + scn.sub.slice(1)}.</div></div>`;
  }
  const roles = Object.keys(ROLES).filter((r) => st.role === 'all' || r === st.role);
  const steps = MAP_SLIDES.filter((id) => slideList().includes(id));
  // Сквозной порядок: шаги слева направо, внутри шага — по номеру действия; альтернативы вне цепочки
  const seq = new Map();
  steps.forEach((id) => SLIDES[id].actions.filter((a) => !a.alt && roles.includes(a.role)).forEach((a) => seq.set(`${id}:${a.n}`, seq.size + 1)));
  return `<div class="cover">
    <div class="cover-lead">От акта приёмки до закрытия дела — <b>${seq.size} ${seq.size % 10 === 1 && seq.size % 100 !== 11 ? 'действие' : [2, 3, 4].includes(seq.size % 10) && ![12, 13, 14].includes(seq.size % 100) ? 'действия' : 'действий'} по порядку</b>${st.role === 'all' ? '' : ` для роли «${ROLES[st.role].name}»`}. Кликните на шаг, чтобы открыть экраны участников.</div>
    <div>
      <div class="map" style="grid-template-columns:128px repeat(${steps.length}, 1fr)">
        <div class="hd" style="cursor:default">Роль \\ шаг</div>
        ${steps.map((id) => `<div class="hd" data-jump="${id}"><b>${SLIDES[id].code}</b>${shortTitle(id)}</div>`).join('')}
        ${roles.map((r) => `<div class="ln" style="--rc:${ROLES[r].color}"><i></i>${ROLES[r].name}</div>` + steps.map((id) =>
          `<div class="cell" data-jump="${id}" style="--rc:${ROLES[r].color}">${SLIDES[id].actions.filter((a) => a.role === r).map((a) =>
            `<div class="pill ${/ЭЦП/.test(a.t) ? 'sign' : ''} ${a.alt ? 'alt' : ''}" ${a.alt ? '' : `data-seq="${seq.get(`${id}:${a.n}`)}"`}>${a.alt ? '' : `<b class="sq">${seq.get(`${id}:${a.n}`)}</b>`}<span>${a.m || a.t}</span></div>`).join('')}</div>`).join('')).join('')}
        <svg class="map-links"></svg>
      </div>
      <div class="cover-foot mt"><span class="legend-seq"><b class="sq">1</b>→<b class="sq">2</b> порядок действий</span><span class="legend-hand">⤷ передача другой роли</span><span class="keys"><span class="key">→</span> <span class="key">пробел</span> далее · <span class="key">←</span> назад · <span class="key">F</span> полный экран</span></div>
    </div>
  </div>`;
}
function shortTitle(id) {
  return { s1: 'Приёмка скважины', s2: 'Проверка и ЭЦП акта', s3: 'Готовность и программа', s4: 'Согласование программы', s5: 'Операции освоения', s6: 'Наблюдение и сравнение', s7: 'АВР и закрытие дела' }[id] || '';
}

// ---------- Итог: что делает каждая роль ----------
function summaryHTML() {
  const roles = Object.keys(ROLES).filter((r) => st.role === 'all' || r === st.role);
  const ids = scenario().slides.filter((id) => SLIDES[id]);
  return `<div class="summary">
    <div class="sum-roles" style="grid-template-columns:repeat(${roles.length}, 1fr)">${roles.map((r) => {
      const items = ids.flatMap((id) => SLIDES[id].actions.filter((a) => a.role === r && !a.alt).map((a) => ({ code: SLIDES[id].code, t: a.t, id })));
      const screens = new Set(ids.flatMap((id) => SLIDES[id].frames.filter((f) => f.role === r).map(() => id))).size;
      return `<div class="sum-role" style="--rc:${ROLES[r].color}">
        <div class="rh"><b>${ROLES[r].name}</b><span>${items.length} действий · ${screens} шагов</span></div>
        <ul>${items.map((x) => `<li><em>${x.code}</em>${x.t}</li>`).join('')}</ul>
        <button class="tool-btn open" data-role-open="${r}">Пройти сценарий глазами роли →</button>
      </div>`;
    }).join('')}</div>
    <div class="sum-stats">
      <div class="sum-stat"><b>10 → 0</b><span>передач документов через Outlook</span></div>
      <div class="sum-stat"><b>3</b><span>подписи ЭЦП в системе: акт, программа, АВР</span></div>
      <div class="sum-stat"><b>SCADA → ТР</b><span>месяц наблюдения без Excel-сводок</span></div>
      <div class="sum-stat"><b>БД 2.0 → КХД</b><span>дело и паспорт собираются автоматически</span></div>
    </div>
  </div>`;
}

// ---------- Номера и линии ----------
let links = [];
function layoutLinks() {
  const stage = $('#stage');
  const sr = stage.getBoundingClientRect();
  const k = sr.width / W;
  const svg = $('.st-links', stage), badges = $('.st-badges', stage);
  const s = SLIDES[curId()];
  links = [];
  let paths = '', marks = '';
  visibleActions(s).forEach((a, i) => {
    const target = stage.querySelector(`.frame[data-role="${a.role}"] [data-c="${a.n}"]`) || stage.querySelector(`.frame [data-c="${a.n}"]`);
    const card = stage.querySelector(`.act[data-i="${i}"]`);
    if (!target || !card) { links.push(null); return; }
    const tr = target.getBoundingClientRect(), cr = card.getBoundingClientRect();
    const bx = (tr.right - sr.left) / k - 6, by = (tr.top - sr.top) / k + 4;
    const num = card.querySelector('.num').getBoundingClientRect();
    const cx = (cr.left - sr.left) / k, cy = (num.top + num.height / 2 - sr.top) / k;
    const mx = Math.max(bx + 40, cx - 90);
    const color = ROLES[a.role].color;
    paths += `<path data-i="${i}" stroke="${color}" d="M${bx},${by} C${mx},${by} ${mx},${cy} ${cx},${cy}"/>`;
    marks += `<div class="badge" data-i="${i}" style="left:${bx}px;top:${by}px;--rc:${color}">${a.n}</div>`;
    links.push({ target, color });
  });
  svg.innerHTML = paths;
  badges.innerHTML = marks;
}

function applyReveal() {
  const s = SLIDES[curId()];
  if (!s) return;
  const acts = visibleActions(s);
  const n = st.stepMode ? Math.min(st.reveal, acts.length) : acts.length;
  const cur = st.stepMode ? n - 1 : -1;
  document.querySelectorAll('.act').forEach((el) => {
    const i = +el.dataset.i;
    el.classList.toggle('hidden', i >= n);
    el.classList.toggle('cur', i === cur);
  });
  document.querySelectorAll('.badge').forEach((el) => el.classList.toggle('hidden', +el.dataset.i >= n));
  document.querySelectorAll('.st-links path').forEach((el) => {
    const i = +el.dataset.i;
    el.classList.toggle('hidden', i >= n);
    el.classList.toggle('cur', i === cur);
  });
  document.querySelectorAll('[data-c].focus').forEach((el) => el.classList.remove('focus'));
  if (cur >= 0 && links[cur]) { links[cur].target.classList.add('focus'); links[cur].target.style.setProperty('--fc', links[cur].color); }
  // В режиме роли соседние экраны не показываются вовсе, поэтому затемнение не нужно
  const f = $('.st-foot');
  if (f) f.outerHTML = footerHTML(slideList());
  bindFooter();
}

// ---------- Навигация ----------
function go(idx, reveal = 1) {
  const list = slideList();
  st.idx = Math.max(0, Math.min(idx, list.length - 1));
  st.reveal = reveal;
  render();
}
function next() {
  const s = SLIDES[curId()];
  if (s && st.stepMode && st.reveal < visibleActions(s).length) { st.reveal++; applyReveal(); return; }
  if (st.idx < slideList().length - 1) go(st.idx + 1, 1);
}
function prev() {
  const s = SLIDES[curId()];
  if (s && st.stepMode && st.reveal > 1) { st.reveal--; applyReveal(); return; }
  if (st.idx > 0) {
    const list = slideList(), ps = SLIDES[list[st.idx - 1]];
    go(st.idx - 1, ps ? visibleActions(ps).length : 1);
  }
}

function bindFooter() {
  $('#prev').onclick = prev;
  $('#next').onclick = next;
  document.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => go(+b.dataset.go)));
}
function bind() {
  bindFooter();
  document.querySelectorAll('[data-scn]').forEach((b) => (b.onclick = () => { st.scn = b.dataset.scn; go(0); }));
  document.querySelectorAll('#roleSeg [data-role]').forEach((b) => (b.onclick = () => {
    const id = curId();
    st.role = b.dataset.role;
    const i = slideList().indexOf(id);
    go(i >= 0 ? i : 0);
  }));
  document.querySelectorAll('[data-role-open]').forEach((b) => (b.onclick = () => { st.role = b.dataset.roleOpen; st.scn = 'fast'; go(1); }));
  $('#stepToggle').onclick = () => { st.stepMode = !st.stepMode; render(); };
  document.querySelectorAll('[data-jump]').forEach((c) => (c.onclick = () => { const i = slideList().indexOf(c.dataset.jump); if (i >= 0) go(i); }));
  document.querySelectorAll('.act').forEach((el) => (el.onclick = () => { st.reveal = +el.dataset.i + 1; applyReveal(); }));
}

window.addEventListener('keydown', (e) => {
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === 'Home') go(0);
  else if (e.key === 'End') go(slideList().length - 1);
  else if (e.key.toLowerCase() === 'f' || e.key.toLowerCase() === 'а') {
    if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen();
  }
});

// Масштаб сцены под окно
function fit() {
  const k = Math.min(window.innerWidth / W, window.innerHeight / H) * 0.98;
  const stage = $('#stage');
  stage.style.transform = `scale(${k}) translate(-50%, -50%)`;
  stage.style.transformOrigin = '0 0';
  stage.style.left = '50%'; stage.style.top = '50%';
  stage.style.transform = `translate(-50%, -50%) scale(${k})`;
  stage.style.transformOrigin = 'center center';
  if (SLIDES[curId()]) requestAnimationFrame(() => { layoutLinks(); applyReveal(); });
  else if (curId() === 'cover') requestAnimationFrame(layoutMapLinks);
}

// Стрелки последовательности на карте сценария
function layoutMapLinks() {
  const map = $('.map'), svg = $('.map-links');
  if (!map || !svg) return;
  const mr = map.getBoundingClientRect();
  const k = mr.width / map.offsetWidth;
  const box = (el) => { const r = el.getBoundingClientRect(); return { l: (r.left - mr.left) / k, r: (r.right - mr.left) / k, t: (r.top - mr.top) / k, b: (r.bottom - mr.top) / k, cell: el.parentElement }; };
  const pills = [...map.querySelectorAll('.pill[data-seq]')].sort((a, b) => a.dataset.seq - b.dataset.seq);
  svg.setAttribute('viewBox', `0 0 ${map.offsetWidth} ${map.offsetHeight}`);
  const colorOf = (el) => getComputedStyle(el.parentElement).getPropertyValue('--rc').trim();
  let out = '';
  for (let i = 0; i < pills.length - 1; i++) {
    const a = box(pills[i]), b = box(pills[i + 1]);
    const col = colorOf(pills[i + 1]);
    const handoff = a.cell.style.getPropertyValue('--rc') !== b.cell.style.getPropertyValue('--rc');
    let d;
    if (a.cell === b.cell) {
      // Следующее действие той же роли в том же шаге — короткая стрелка вниз
      const x = a.l + 16;
      d = `M${x},${a.b} L${x},${b.t - 1}`;
    } else if (Math.abs(a.l - b.l) < 2) {
      // Тот же шаг, другая роль — скоба справа от ячейки
      const x = Math.max(a.r, b.r) + 11;
      const ya = (a.t + a.b) / 2, yb = (b.t + b.b) / 2;
      d = `M${a.r},${ya} L${x},${ya} L${x},${yb} L${b.r + 1},${yb}`;
    } else {
      // Переход к следующему шагу — кривая слева направо
      const ya = (a.t + a.b) / 2, yb = (b.t + b.b) / 2, mx = (a.r + b.l) / 2;
      d = `M${a.r},${ya} C${mx},${ya} ${mx},${yb} ${b.l - 1},${yb}`;
    }
    out += `<path d="${d}" stroke="${col}" class="${handoff ? 'hand' : ''}" marker-end="url(#ar-${i})"/>` +
      `<marker id="ar-${i}" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" fill="${col}"/></marker>`;
  }
  svg.innerHTML = out;
}
window.addEventListener('resize', fit);
window.addEventListener('hashchange', () => { readHash(); render(); });

readHash();
render();
fit();
