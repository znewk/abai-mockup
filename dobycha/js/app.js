// ABAI · Добыча — прототип v1: 9 процессов, рабочие места, шаги Dream TO BE, схемы BPMN, сравнение вариантов.

const STORE_KEY = 'abai-dobycha-omg';
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let state = load();
const ui = { zoom: 0.8, sel: {}, bpmnSel: null, showSys: true };

function load() {
  try { const s = JSON.parse(localStorage.getItem(STORE_KEY)); if (s && s.done) return s; } catch (e) { /* пусто — начинаем заново */ }
  return { role: {}, done: {}, skip: {}, log: {} };
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

function toast(msg) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span style="color:#7fd77f">✓</span>${esc(msg)}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3400);
}

// Роль по умолчанию — владелец рабочего места (с учётом уточнённых имён вида «Департаменты · КМГ»)
function roleOf(num) {
  if (state.role[num]) return state.role[num];
  const roles = rolesOf(num), owner = PROC_META[num].owner;
  return (roles.find((r) => r.name === owner) || roles.find((r) => baseRole(r.name) === owner) || roles[0]).name;
}
const roleChip = (name) => `<span class="chip role" style="color:${roleColor(name)};border-color:${roleColor(name)}55">${esc(name)}</span>`;
const TABS = [
  { id: 'work', name: 'Рабочее место' },
  { id: 'flow', name: 'Процесс Dream TO BE' },
  { id: 'bpmn', name: 'Схемы BPMN' },
  { id: 'compare', name: 'AS IS → Dream TO BE' },
];

// ---------- Каркас ----------
function shell(num, tab, crumbs) {
  const roles = num ? rolesOf(num) : [];
  $('#shell').innerHTML = `
    <div class="mock-banner">Мокап для обсуждения · демо-данные · модуль «Добыча» · 9 процессов из BPMN</div>
    <header class="topbar">
      <a class="logo" href="#/"><svg viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1c5cab"/><path d="M6 23 13 9l4 8 3-5 6 11z" fill="#fff"/><circle cx="23" cy="9" r="2.5" fill="#86b6ef"/></svg><div>ABAI<small>Добыча</small></div></a>
      ${abaiModuleSwitch('dobycha', 'v1')}
      ${num ? `<select id="procSel" class="proc-sel">${BPMN.map((p) => `<option value="${p.num}" ${p.num === num ? 'selected' : ''}>Д${p.num}. ${PROC_META[p.num].short}</option>`).join('')}</select>` : ''}
      <nav class="nav">${num ? TABS.map((t) => `<a href="#/p/${num}/${t.id}" class="${t.id === tab ? 'active' : ''}">${t.name}</a>`).join('') : '<a class="active" href="#/">Процессы добычи</a>'}
        <a href="v2/">Презентация</a></nav>
      <div class="spacer"></div>
      ${num ? `<div class="role-switch"><label for="role">Роль (демо)</label><select id="role">${roles.map((r) => `<option ${r.name === roleOf(num) ? 'selected' : ''}>${esc(r.name)}</option>`).join('')}</select></div>` : ''}
    </header>
    <div class="subbar">${crumbs}</div>
    <main id="view"></main>`;
  if (num) {
    $('#procSel').onchange = (e) => (location.hash = `#/p/${e.target.value}/${tab}`);
    $('#role').onchange = (e) => { state.role[num] = e.target.value; save(); toast(`Вы вошли как: ${e.target.value}`); route(); };
  }
}

function route() {
  const [, page, num, tab, extra] = (location.hash.replace(/^#/, '') || '/').split('/');
  if (page === 'p' && proc(num)) {
    const n = +num, t = TABS.some((x) => x.id === tab) ? tab : 'work';
    const P = proc(n);
    shell(n, t, `<a href="#/">Добыча</a><span class="sep">›</span><span>Д${n}. ${esc(P.title)}</span><span class="sep">›</span><span>${TABS.find((x) => x.id === t).name}</span>`);
    ({ work: renderWork, flow: renderFlow, bpmn: renderBpmn, compare: renderCompare })[t](n, extra);
  } else {
    shell(0, '', '<span>Модуль «Добыча»</span><span class="sep">·</span><span>АО «Озенмунайгаз»</span>');
    renderHub();
  }
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

// ---------- Главная модуля ----------
function renderHub() {
  const all = BPMN.map((p) => ({ p, a: variantStats(p.num, 'asis'), d: variantStats(p.num, 'dream') }));
  const sum = (f) => all.reduce((s, x) => s + f(x), 0);
  const newSteps = BPMN.reduce((s, p) => s + tasksOf(pool(p.num, 'dream')).filter((t) => /а$/.test(t.code)).length, 0);
  $('#view').innerHTML = `
    <div class="hero">
      <div><h1>Добыча в ABAI: 9 процессов ОМГ, четыре варианта</h1>
      <p>По итоговым BPMN АО «Озенмунайгаз»: AS IS в описании Nedra, AS IS ABAI (как сейчас, с текущими модулями ABAI), TO BE Nedra и Dream TO BE. Для каждого процесса — рабочее место ключевой роли, пошаговый процесс Dream TO BE, схемы всех вариантов и сравнение систем по шагам.</p></div>
      <div class="stats hero-stats">
        <div class="stat"><div class="v">${sum((x) => x.d.steps)}</div><div class="l">шагов в Dream TO BE</div></div>
        <div class="stat"><div class="v">${newSteps}</div><div class="l">новых шагов (с буквой «а»)</div></div>
        <div class="stat"><div class="v">${sum((x) => x.a.abaiSteps)} → ${sum((x) => x.d.abaiSteps)}</div><div class="l">шагов, выполняемых в ABAI (AS IS ABAI → Dream)</div></div>
        <div class="stat"><div class="v">${sum((x) => x.a.manual)} → ${sum((x) => x.d.manual)}</div><div class="l">привязок шагов к MS Office</div></div>
      </div>
    </div>
    <div class="proc-grid mt">${all.map(({ p, a, d }) => {
      const m = PROC_META[p.num];
      const abai = d.systems.filter((s) => sysKind(s) === 'abai');
      return `<div class="card proc-card">
        <a class="pc-h" href="#/p/${p.num}/work"><span class="pc-num">Д${p.num}</span><span class="pc-ic">${m.icon}</span><div><b>${esc(p.title)}</b><span>${m.ws}</span></div></a>
        <div class="pc-b">
          <p>${m.idea}</p>
          <div class="pc-sys">${abai.map((s) => `<span class="chip sys abai">${s}</span>`).join(' ')}</div>
          <div class="pc-meta"><span>${d.steps} шагов · ${rolesOf(p.num).length} ролей</span><span class="pc-man" title="Шагов в ABAI: AS IS ABAI → Dream TO BE">в ABAI: <b>${a.abaiSteps}</b> → <b class="good-t">${d.abaiSteps}</b></span><span class="pc-man" title="Привязок шагов к MS Office">MS Office: <b class="crit-t">${a.manual}</b> → <b class="good-t">${d.manual}</b></span></div>
        </div>
        <div class="pc-f"><a href="#/p/${p.num}/work">Рабочее место</a><a href="#/p/${p.num}/flow">Процесс</a><a href="#/p/${p.num}/bpmn/dream">Схема</a><a href="#/p/${p.num}/compare">Сравнение</a></div>
      </div>`;
    }).join('')}</div>
    <div class="card mt"><div class="card-h"><h2>Связи между процессами</h2><span class="muted small">по message flow в BPMN · клик по процессу — открыть</span></div><div class="card-b">${relationMap()}</div></div>`;
}

function relationMap() {
  const pos = { 7: [40, 60], 1: [370, 60], 3: [700, 60], 4: [1030, 60], 6: [40, 250], 9: [370, 250], 2: [700, 250], 5: [1030, 250], 8: [1030, 400] };
  const W = 1330, H = 484, nw = 240, nh = 64;
  const num = (s) => +((s.match(/Д(\d)/) || [])[1]);
  const pairs = new Map();
  const add = (from, to) => { if (!from || !to || from === to) return; const k = [from, to].sort().join('-'); const e = pairs.get(k) || { a: from, b: to, ab: false, ba: false }; if (from === e.a) e.ab = true; else e.ba = true; pairs.set(k, e); };
  // Связь берём и из исходящих, и из входящих: в BPMN она бывает указана только с одной стороны (Д1 → Д7)
  BPMN.forEach((p) => { p.adjacent.out.forEach((o) => add(p.num, num(o))); p.adjacent.in.forEach((o) => add(num(o), p.num)); });
  const edges = [...pairs.values()].map((e) => {
    const [x1, y1] = pos[e.a], [x2, y2] = pos[e.b];
    const cx1 = x1 + nw / 2, cy1 = y1 + nh / 2, cx2 = x2 + nw / 2, cy2 = y2 + nh / 2;
    const dx = cx2 - cx1, dy = cy2 - cy1, len = Math.hypot(dx, dy) || 1;
    // точки на краях прямоугольников
    const clip = (cx, cy, sx, sy) => { const t = Math.min(Math.abs((nw / 2) / (sx || 1e-6)), Math.abs((nh / 2) / (sy || 1e-6))); return [cx + sx * t, cy + sy * t]; };
    const [ax, ay] = clip(cx1, cy1, dx / len, dy / len), [bx, by] = clip(cx2, cy2, -dx / len, -dy / len);
    return `<path d="M${ax},${ay} L${bx},${by}" class="rel" ${e.ab ? 'marker-end="url(#rm)"' : ''} ${e.ba ? 'marker-start="url(#rs)"' : ''}/>`;
  }).join('');
  const nodes = BPMN.map((p) => { const [x, y] = pos[p.num]; const m = PROC_META[p.num]; return `<a href="#/p/${p.num}/work"><g class="rnode"><rect x="${x}" y="${y}" width="${nw}" height="${nh}" rx="10"/><text x="${x + 14}" y="${y + 26}" class="rn">Д${p.num}</text><text x="${x + 50}" y="${y + 26}" class="rt">${m.short}</text><text x="${x + 50}" y="${y + 46}" class="rs">${m.owner}</text></g></a>`; }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="relmap"><defs>
    <marker id="rm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8a93a6"/></marker>
    <marker id="rs" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 z" fill="#8a93a6"/></marker></defs>${edges}${nodes}
    <text x="1010" y="437" text-anchor="end" class="rs">Д8 — самостоятельный контур, связей в BPMN нет</text></svg>`;
}

// ---------- Рабочее место ----------
function renderWork(num) {
  const D = DASH[num], m = PROC_META[num];
  const me = roleOf(num);
  const draw = () => {
    $('#view').innerHTML = `
      <div class="page-h"><div><div class="muted small">Рабочее место · Dream TO BE</div><h1>${m.ws}</h1></div>
        <div class="page-h-r">${roleChip(m.owner)}${baseRole(me) !== m.owner ? `<span class="small muted">вы смотрите как «${esc(me)}» — экран принадлежит роли «${esc(m.owner)}»</span>` : ''}</div></div>
      <div class="bpmn-note mb"><b>Идея</b><span>${m.idea}</span></div>
      <div id="dash">${D.html()}</div>
      <div class="card mt"><div class="card-h"><h2>Шаги процесса на этом экране</h2><span class="muted small">клик — открыть шаг</span></div><div class="card-b steps-row">
        ${D.steps.map((c) => { const t = tasksOf(pool(num, 'dream')).find((x) => x.code === c); return t ? `<a class="step-pill" href="#/p/${num}/flow/${t.id}"><b>${c}</b>${esc(t.title)}</a>` : ''; }).join('')}
      </div></div>`;
    D.mount($('#dash'), draw);
  };
  draw();
}

// ---------- Процесс Dream TO BE по шагам ----------
function flowTasks(num) {
  const pl = pool(num, 'dream');
  return tasksOf(pl).map((t) => {
    const inc = pl.flows.filter((f) => f.to === t.id).map((f) => ({ f, src: pl.nodes.find((n) => n.id === f.from) }));
    const gw = inc.find((x) => x.src && x.src.kind === 'gateway' && x.f.label && x.f.label.trim() !== 'Да');
    return Object.assign({}, t, { role: laneName(pl, t.lane), branch: gw ? { q: gw.src.name, a: gw.f.label } : null });
  });
}

function renderFlow(num, selId) {
  const tasks = flowTasks(num);
  const done = new Set(state.done[num] || []), skip = new Set(state.skip[num] || []);
  const cur = tasks.find((t) => !done.has(t.id) && !skip.has(t.id));
  const sel = tasks.find((t) => t.id === selId) || cur || tasks[tasks.length - 1];
  const me = roleOf(num);
  const matrix = stepMatrix(num);
  const cmp = matrix.find((r) => r.code && r.code === sel.code);
  const status = (t) => (done.has(t.id) ? 'done' : skip.has(t.id) ? 'skip' : t === cur ? 'cur' : 'todo');
  const st = status(sel);
  const canAct = st === 'cur' && sel.role === me;
  const progress = Math.round(((done.size + skip.size) / tasks.length) * 100);

  $('#view').innerHTML = `
    <div class="layout">
      <div class="card">
        <div class="card-h"><h2>Шаги Dream TO BE</h2><span class="muted small">${done.size + skip.size} / ${tasks.length}</span></div>
        <div class="bar-prog"><i style="width:${progress}%"></i></div>
        <ol class="stepper">${tasks.map((t, i) => `<li class="${status(t)}${t.id === sel.id ? ' sel' : ''}">
          <button data-step="${t.id}"><span class="dot">${status(t) === 'done' ? '✓' : status(t) === 'skip' ? '–' : i + 1}</span>
          <span class="s-code">${t.code || 'шаг без номера'}${/а$/.test(t.code) ? ' · <b class="new-t">новый шаг</b>' : ''}${t.branch ? ' · ветка' : ''}</span>
          <div class="s-title">${esc(t.title)}</div><div class="s-role" style="color:${roleColor(t.role)}">${esc(t.role)}${t === cur && t.role === me ? ' · ваш шаг' : ''}</div></button></li>`).join('')}</ol>
        <div class="card-b"><button class="btn" id="resetFlow">Начать процесс заново</button></div>
      </div>
      <div class="layout-right">
        <div class="card">
          <div class="step-h">
            <div class="meta"><span class="chip">${sel.code ? 'Шаг ' + sel.code : 'Шаг без номера'}</span>${/а$/.test(sel.code) ? '<span class="chip new">Новый шаг Dream TO BE</span>' : ''}${roleChip(sel.role)}
              ${st === 'done' ? '<span class="chip good">✓ Выполнено</span>' : st === 'skip' ? '<span class="chip">Ветка не понадобилась</span>' : st === 'cur' ? '<span class="chip warn">Текущий шаг</span>' : '<span class="chip sys">Не начат</span>'}</div>
            <h2>${esc(sel.title)}</h2>
            ${sel.branch ? `<div class="bpmn-note"><b>Ветка</b><span>${esc(sel.branch.q)} → «${esc(sel.branch.a)}»</span></div>` : ''}
            ${sel.notes.length ? `<div class="bpmn-note"><b>BPMN</b><span>${sel.notes.map(esc).join(' · ')}</span></div>` : ''}
          </div>
          <div class="card-b">
            ${st === 'cur' && !canAct ? `<div class="callout wait mb"><span class="grow">Шаг выполняет роль <b>${esc(sel.role)}</b>.</span><button class="btn primary" id="switchRole">Переключиться на эту роль</button></div>` : ''}
            <div class="grid g-1-1">
              <div><h3>Системы шага</h3><div class="sys-list mt-s">${sel.sys.length ? sel.sys.map((s) => `<div class="sys-row"><span class="chip sys ${sysKind(s)}">${esc(s)}</span><span class="small muted">${esc((SYS[s] || {}).desc || '')}</span></div>`).join('') : '<span class="muted small">—</span>'}</div></div>
              <div><h3>Документы и данные</h3><div class="docs mt-s">${sel.docs.length ? sel.docs.map((d) => `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(d)}</div><div class="sub">хранится в ABAI БД 2.0</div></div></div>`).join('') : '<span class="muted small">—</span>'}</div></div>
            </div>
            <h3 class="mt">Как выглядит в ABAI</h3>
            <div class="mt-s">${sysWidget(sel, num)}</div>
            ${cmp ? `<h3 class="mt">Этот шаг в других вариантах</h3>
              <table class="t mt-s"><tbody>${Object.keys(VARIANTS).map((k) => `
                <tr><td class="${k === 'dream' ? '' : 'muted'}" style="width:130px">${k === 'dream' ? '<b>Dream TO BE</b>' : VARIANTS[k].name}</td><td>${cmp[k] ? sysList(cmp[k]) : '<span class="muted small">нет шага</span>'}</td></tr>`).join('')}</tbody></table>` : /а$/.test(sel.code) ? '<div class="callout info mt">Этого шага нет в AS IS и TO BE Nedra — он появляется только в Dream TO BE.</div>' : ''}
            ${canAct ? `<div class="row mt"><button class="btn primary" id="doStep">✓ Выполнить шаг</button>${sel.branch ? '<button class="btn" id="skipStep">Ветка не нужна — пропустить</button>' : ''}</div>` : ''}
          </div>
        </div>
        <div class="card"><div class="card-h"><h2>Журнал процесса</h2></div>${(state.log[num] || []).length ? `<ul class="log">${state.log[num].slice().reverse().map((l) => `<li><span class="when">${new Date(l.at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span><span><b style="color:${roleColor(l.role)}">${esc(l.role)}</b> · ${esc(l.text)}</span></li>`).join('')}</ul>` : '<div class="empty">Процесс ещё не начат</div>'}</div>
      </div>
    </div>`;

  document.querySelectorAll('[data-step]').forEach((b) => (b.onclick = () => (location.hash = `#/p/${num}/flow/${b.dataset.step}`)));
  if ($('#switchRole')) $('#switchRole').onclick = () => { state.role[num] = sel.role; save(); toast(`Вы вошли как: ${sel.role}`); route(); };
  const mark = (kind) => {
    const key = kind === 'done' ? 'done' : 'skip';
    (state[key][num] = state[key][num] || []).push(sel.id);
    (state.log[num] = state.log[num] || []).push({ at: new Date().toISOString(), role: sel.role, text: `${sel.code ? sel.code + ' · ' : ''}${sel.title}${kind === 'done' ? '' : ' — ветка пропущена'}` });
    save();
    const next = flowTasks(num).find((t) => !(state.done[num] || []).includes(t.id) && !(state.skip[num] || []).includes(t.id));
    toast(kind === 'done' ? `Шаг выполнен${sel.sys.length ? ': данные в ' + sel.sys.filter((s) => sysKind(s) !== 'manual').slice(0, 2).join(', ') : ''}` : 'Ветка пропущена');
    location.hash = `#/p/${num}/flow/${next ? next.id : sel.id}`;
  };
  if ($('#doStep')) $('#doStep').onclick = () => mark('done');
  if ($('#skipStep')) $('#skipStep').onclick = () => mark('skip');
  $('#resetFlow').onclick = () => { state.done[num] = []; state.skip[num] = []; state.log[num] = []; save(); location.hash = `#/p/${num}/flow`; route(); };
}

const sysList = (v) => (v && v.sys.length ? v.sys.map((s) => `<span class="chip sys ${sysKind(s)}">${esc(s)}</span>`).join(' ') : '<span class="muted small">без системы</span>');

// Мини-экран ABAI для шага — по главной системе шага
function sysWidget(t, num) {
  const has = (s) => t.sys.includes(s);
  const win = (title, body) => `<div class="mini"><div class="mini-top"><i></i><b>ABAI</b><span>${title}</span></div><div class="mini-b">${body}</div></div>`;
  if (has('КХД') && has('ABAI ПДИМ 2.0')) return win('КХД → ПДИМ 2.0 · качество данных', `<div class="mini-flow"><span>СДМС ✓</span><span>SCADA ✓</span><span>ИСУ ✓</span><span>БД 2.0 ✓</span><em>→ КХД →</em><span class="hl">ПДИМ 2.0: полнота 97,4 %</span></div><div class="alarm crit"><b>Аларм: нет замера по 11 скв.</b><span>уведомление ушло в ЦИТС НГДУ на уточнение</span></div>`);
  if (has('ABAI УЗ')) return win('УЗ → КХД · показатели закачки', `<div class="mini-kpi"><div><b>48 260</b><span>закачка, м³/сут</span></div><div><b>14</b><span>КНС</span></div><div><b>✓</b><span>передано в КХД</span></div></div>`);
  if (has('КХД')) return win('КХД · данные ДЗО', `<div class="mini-flow"><span>Сводка ДЗО ✓</span><em>→ КХД →</em><span class="hl">корпоративная отчётность КМГ</span></div>`);
  if (has('ABAI ПГНО')) return win('ПГНО · подбор ГНО', `<table class="t"><tr><td>Скв. 7318</td><td>УЭЦН</td><td>ЭЦН5А-80-1250</td><td class="num">КПД 56 %</td><td>${chip('рекомендовано', 'good')}</td></tr><tr><td></td><td></td><td>ЭЦН5-60-1300</td><td class="num">КПД 49 %</td><td></td></tr></table>`);
  if (has('ABAI ПАЭГТМ')) return win('ПАЭГТМ · мероприятия', `<table class="t"><tr><td>ГРП · скв. 7318</td><td class="num">+12,6 т/сут</td><td class="num">NPV 284 млн ₸</td><td>${chip('приоритет 1', 'good')}</td></tr><tr><td>ОПЗ · скв. 5642</td><td class="num">+6,1 т/сут</td><td class="num">NPV 96 млн ₸</td><td>${chip('приоритет 2')}</td></tr></table>`);
  if (has('ABAI ПДИМ 2.0')) return win('ПДИМ 2.0 · мониторинг', `<div class="mini-kpi"><div><b>14 128</b><span>факт, т/сут</span></div><div><b class="crit-t">−172</b><span>к плану</span></div><div><b>4</b><span>отклонения</span></div></div><div class="alarm warn"><b>Отклонение по скв. 7318: −16,2 т/сут</b><span>карточка отклонения создана</span></div>`);
  if (has('ABAI ТР 2.0')) return win('ТР 2.0 · технологический режим', `<table class="t"><tr><th>Скв.</th><th class="num">Qж</th><th class="num">Обв.</th><th class="num">Нд</th><th></th></tr><tr><td>7318</td><td class="num">58</td><td class="num">78 %</td><td class="num">1 040</td><td>${chip('отклонение', 'crit')}</td></tr><tr><td>4127</td><td class="num">38</td><td class="num">55 %</td><td class="num">960</td><td>${chip('в режиме', 'good')}</td></tr></table>`);
  if (has('ABAI ЦРНС 2.0')) return win('ЦРНС 2.0 · рейтинг участков и скважин', `<div class="mini-kpi"><div><b>3</b><span>варианта</span></div><div><b class="good-t">+290</b><span>т/сут, вариант B</span></div><div><b>A</b><span>рейтинг участка</span></div></div>`);
  const docs = t.docs.length ? t.docs : ['Запись шага'];
  return win('БД 2.0 · карточка шага', docs.map((d) => `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(d)}</div><div class="sub">создаётся и хранится в ABAI БД 2.0</div></div></div>`).join(''));
}

// ---------- Схемы BPMN по реальной разметке ----------
function renderBpmn(num, variant) {
  const v = VARIANTS[variant] ? variant : 'dream';
  const pl = pool(num, v);
  const k = ui.zoom;
  const stats = variantStats(num, v);
  const nodesSvg = pl.nodes.map((n) => {
    if (n.kind === 'task') {
      const kinds = n.sys.map(sysKind);
      const dots = kinds.map((kd, i) => `<circle cx="${n.x + 10 + i * 13}" cy="${n.y + n.h + 10}" r="5" class="d-${kd}"/>`).join('');
      return `<g class="bn task ${/а$/.test(n.code) ? 'new' : ''} ${ui.bpmnSel === n.id ? 'sel' : ''}" data-node="${n.id}">
        <rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="10"/>
        <foreignObject x="${n.x + 4}" y="${n.y + 3}" width="${n.w - 8}" height="${n.h - 6}"><div xmlns="http://www.w3.org/1999/xhtml" class="bn-t">${n.code ? `<b>${n.code}</b> ` : ''}${esc(n.title)}</div></foreignObject>
        ${ui.showSys ? dots : ''}</g>`;
    }
    if (n.kind === 'event') {
      const r = n.w / 2;
      return `<g class="bn ev ${n.type}"><circle cx="${n.x + r}" cy="${n.y + r}" r="${r}"/><foreignObject x="${n.x - 60}" y="${n.y + n.h + 2}" width="${n.w + 120}" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="bn-l">${esc(n.name)}</div></foreignObject></g>`;
    }
    const cx = n.x + n.w / 2, cy = n.y + n.h / 2;
    return `<g class="bn gw"><path d="M${cx},${n.y} L${n.x + n.w},${cy} L${cx},${n.y + n.h} L${n.x},${cy} z"/>${n.type === 'parallelGateway' ? `<text x="${cx}" y="${cy + 7}" text-anchor="middle" class="gw-s">+</text>` : `<text x="${cx}" y="${cy + 7}" text-anchor="middle" class="gw-s">×</text>`}
      ${n.name ? `<foreignObject x="${n.x - 70}" y="${n.y - 46}" width="${n.w + 140}" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="bn-l gw-l">${esc(n.name)}</div></foreignObject>` : ''}</g>`;
  }).join('');
  const flowsSvg = pl.flows.filter((f) => f.wp.length > 1).map((f) => {
    const d = f.wp.map((p, i) => `${i ? 'L' : 'M'}${p[0]},${p[1]}`).join(' ');
    const mid = f.wp[Math.floor((f.wp.length - 1) / 2)], mid2 = f.wp[Math.floor((f.wp.length - 1) / 2) + 1] || mid;
    return `<path d="${d}" class="bf" marker-end="url(#ba)"/>${f.label ? `<foreignObject x="${(mid[0] + mid2[0]) / 2 - 90}" y="${(mid[1] + mid2[1]) / 2 - 22}" width="180" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="bf-l">${esc(f.label)}</div></foreignObject>` : ''}`;
  }).join('');
  const lanesSvg = pl.lanes.filter((l) => !l.group).map((l, i) => `<rect x="0" y="${l.y}" width="${pl.w}" height="${l.h}" class="lane ${i % 2 ? 'odd' : ''}"/>`).join('');
  const laneLabels = pl.lanes.map((l) => {
    const c = roleColor(l.name);
    if (l.group) return `<div class="grp" style="top:${l.y * k}px;height:${l.h * k}px;--rc:${c}"><span>${esc(l.name)}</span></div>`;
    const left = l.parent ? 30 : 0;
    return `<div style="top:${l.y * k}px;height:${l.h * k}px;left:${left}px;width:${150 - left}px;--rc:${c}"><span>${esc(l.name)}</span></div>`;
  }).join('');
  const sel = pl.nodes.find((n) => n.id === ui.bpmnSel);

  $('#view').innerHTML = `
    <div class="page-h"><div><div class="muted small">Схема из файла «${esc(proc(num).file)}»</div><h1>${esc(pl.pool)}</h1></div>
      <div class="page-h-r"><div class="seg big">${Object.entries(VARIANTS).map(([k2, x]) => `<button data-v="${k2}" class="${k2 === v ? 'sel' : ''}">${x.name}</button>`).join('')}</div></div></div>
    <div class="bpmn-bar">
      <span>${stats.steps} шагов</span><span>ручные инструменты: <b class="${stats.manual ? 'crit-t' : 'good-t'}">${stats.manual}</b></span>
      <span class="lg"><i class="d-abai"></i>ABAI</span><span class="lg"><i class="d-nedra"></i>Nedra</span><span class="lg"><i class="d-ext"></i>промысловые и корп.</span><span class="lg"><i class="d-manual"></i>Excel / Outlook / MS Office</span>
      <span class="lg"><i class="d-new"></i>новый шаг</span>
      <div class="spacer"></div>
      <label class="small"><input type="checkbox" id="showSys" ${ui.showSys ? 'checked' : ''}> системы у шагов</label>
      <div class="seg"><button id="zo">−</button><button disabled>${Math.round(k * 100)} %</button><button id="zi">+</button></div>
    </div>
    <div class="bpmn-wrap">
      <div class="bpmn-canvas" id="canvas">
        <div class="bpmn-lanes" style="height:${pl.h * k}px">${laneLabels}</div>
        <svg width="${pl.w * k}" height="${pl.h * k}" viewBox="0 0 ${pl.w} ${pl.h}" class="bpmn">
          <defs><marker id="ba" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#6b7383"/></marker></defs>
          ${lanesSvg}${flowsSvg}${nodesSvg}
        </svg>
      </div>
      <aside class="bpmn-side card">${sel ? `<div class="card-h"><h2>${sel.code ? sel.code + ' · ' : ''}${esc(sel.title)}</h2></div><div class="card-b">
          ${roleChip(laneName(pl, sel.lane))}
          <h3 class="mt">Системы</h3><div class="mt-s">${sel.sys.length ? sel.sys.map((s) => `<div class="sys-row"><span class="chip sys ${sysKind(s)}">${esc(s)}</span><span class="small muted">${esc((SYS[s] || {}).desc || '')}</span></div>`).join('') : '<span class="muted small">—</span>'}</div>
          ${sel.docs.length ? `<h3 class="mt">Документы</h3><ul class="small">${sel.docs.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
          ${sel.notes.length ? `<h3 class="mt">Аннотации</h3><div class="small">${sel.notes.map(esc).join('<br>')}</div>` : ''}
          ${v === 'dream' ? `<a class="btn primary mt" href="#/p/${num}/flow/${sel.id}">Открыть шаг в процессе</a>` : ''}</div>`
        : '<div class="card-b muted small">Нажмите на шаг схемы, чтобы увидеть системы, документы и аннотации.</div>'}</aside>
    </div>`;
  // При первом открытии — прокрутка к началу процесса
  if (!ui.keep) {
    const start = pl.nodes.find((n) => n.type === 'startEvent') || pl.nodes[0];
    const c = $('#canvas');
    if (start && c) { c.scrollLeft = Math.max(0, start.x * k - 60); c.scrollTop = Math.max(0, start.y * k - c.clientHeight / 3); }
  }
  document.querySelectorAll('[data-v]').forEach((b) => (b.onclick = () => { ui.bpmnSel = null; location.hash = `#/p/${num}/bpmn/${b.dataset.v}`; }));
  document.querySelectorAll('[data-node]').forEach((g) => (g.onclick = () => { ui.bpmnSel = g.dataset.node; keepScroll(() => renderBpmn(num, v)); }));
  $('#zi').onclick = () => { ui.zoom = Math.min(1.4, +(ui.zoom + 0.1).toFixed(2)); keepScroll(() => renderBpmn(num, v)); };
  $('#zo').onclick = () => { ui.zoom = Math.max(0.3, +(ui.zoom - 0.1).toFixed(2)); keepScroll(() => renderBpmn(num, v)); };
  $('#showSys').onchange = (e) => { ui.showSys = e.target.checked; keepScroll(() => renderBpmn(num, v)); };
}
function keepScroll(fn) {
  const c = $('#canvas'); const sx = c ? c.scrollLeft : 0, sy = c ? c.scrollTop : 0, wy = window.scrollY;
  ui.keep = true; fn(); ui.keep = false;
  const n = $('#canvas'); if (n) { n.scrollLeft = sx; n.scrollTop = sy; }
  window.scrollTo(0, wy);
}

// ---------- Сравнение вариантов ----------
function renderCompare(num) {
  const rows = stepMatrix(num);
  const vs = Object.keys(VARIANTS);
  const st = Object.fromEntries(vs.map((k) => [k, variantStats(num, k)]));
  // Третий показатель карточки: для Nedra — продукты Nedra, для AS IS Nedra — системы, для AS IS ABAI и Dream — шаги в ABAI
  const third = (k) => (k === 'nedra' ? [st[k].nedra, 'продуктов Nedra'] : k === 'asisn' ? [st[k].systems.filter((s) => sysKind(s) !== 'manual').length, 'систем'] : [st[k].abaiSteps, 'шагов в ABAI']);
  const m = PROC_META[num];
  $('#view').innerHTML = `
    <div class="page-h"><div><div class="muted small">Сравнение вариантов по шагам</div><h1>AS IS Nedra · AS IS ABAI → TO BE Nedra → Dream TO BE</h1></div></div>
    <div class="bpmn-note mb"><b>Dream TO BE</b><span>${m.idea}</span></div>
    <div class="variants v4">${Object.entries(VARIANTS).map(([k, x]) => `<div class="card variant ${x.tone}"><div class="card-b">
      <div class="tag">${x.sub}</div><h2>${x.name}</h2>
      <div class="stats mt-s" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat"><div class="v">${st[k].steps}</div><div class="l">шагов</div></div>
        <div class="stat"><div class="v ${st[k].manual ? 'crit-t' : 'good-t'}">${st[k].manual}</div><div class="l">ручных инструментов</div></div>
        <div class="stat"><div class="v">${third(k)[0]}</div><div class="l">${third(k)[1]}</div></div>
      </div>
      <a class="btn mt" href="#/p/${num}/bpmn/${k}">Открыть схему</a></div></div>`).join('')}</div>
    <div class="card mt"><div class="card-h"><h2>Системы по шагам</h2><span class="muted small">шаги сопоставлены по номеру из BPMN</span></div>
      <div class="tbl-scroll"><table class="t cmp"><thead><tr><th>Шаг</th><th>Роль (Dream TO BE)</th>${vs.map((k) => `<th class="${k === 'dream' ? 'dream-h' : ''}">${VARIANTS[k].name}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr class="${!r.asis ? 'newrow' : ''}"><td><b>${r.code || '—'}</b> ${esc(r.title)}${!r.asis ? ' <span class="chip new">новый шаг</span>' : ''}</td><td>${r.dream ? roleChip(r.lane) : '<span class="muted small">нет в Dream TO BE</span>'}</td>
        ${vs.map((k) => `<td>${r[k] ? sysList(r[k]) : '—'}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div></div>`;
}

route();
