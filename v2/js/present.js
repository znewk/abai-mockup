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
  return `<div class="cover">
    <div class="cover-lead">Один быстрый сценарий освоения скважины после бурения — от акта приёмки до закрытия дела. На каждом слайде рядом стоят экраны участников: <b>номер на кнопке</b> = действие справа, <b>кто</b> его выполняет и <b>куда уходят данные</b>. Ни одного письма в Outlook: документы, согласования и подписи ЭЦП живут в ABAI.</div>
    <div>
      <div class="map" style="grid-template-columns:190px repeat(${steps.length}, 1fr)">
        <div class="hd" style="cursor:default">Роль \\ шаг</div>
        ${steps.map((id) => `<div class="hd" data-jump="${id}"><b>${SLIDES[id].code}</b>${shortTitle(id)}</div>`).join('')}
        ${roles.map((r) => `<div class="ln" style="--rc:${ROLES[r].color}"><i></i>${ROLES[r].name}</div>` + steps.map((id) =>
          `<div class="cell" data-jump="${id}" style="--rc:${ROLES[r].color}">${SLIDES[id].actions.filter((a) => a.role === r).map((a) =>
            `<div class="pill ${/ЭЦП/.test(a.t) ? 'sign' : ''} ${a.alt ? 'alt' : ''}">${a.t}</div>`).join('')}</div>`).join('')).join('')}
      </div>
      <div class="cover-foot mt">Управление: <span class="key">→</span> / <span class="key">пробел</span> — следующее действие, <span class="key">←</span> — назад, <span class="key">F</span> — полный экран. Клик по ячейке открывает шаг. Переключатель ролей вверху показывает сценарий глазами одной роли.</div>
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
}
window.addEventListener('resize', fit);
window.addEventListener('hashchange', () => { readHash(); render(); });

readHash();
render();
fit();
