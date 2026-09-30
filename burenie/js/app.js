// ABAI · Бурение — прототип v1: 5 процессов, рабочие места, шаги Dream TO BE, схемы BPMN, сравнение вариантов.

const STORE_KEY = 'abai-burenie-v1';
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const L = MODULE.letter;

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

// Роль по умолчанию — владелец рабочего места
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
    <div class="mock-banner">Мокап для обсуждения · демо-данные · модуль «${MODULE.name}» · ${BPMN.length} процессов из BPMN</div>
    <header class="topbar">
      <a class="logo" href="#/"><svg viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1c5cab"/><path d="M6 23 13 9l4 8 3-5 6 11z" fill="#fff"/><circle cx="23" cy="9" r="2.5" fill="#86b6ef"/></svg><div>ABAI<small>${MODULE.name}</small></div></a>
      ${abaiModuleSwitch(MODULE.id, 'v1')}
      ${num ? `<select id="procSel" class="proc-sel">${BPMN.map((p) => `<option value="${p.num}" ${p.num === num ? 'selected' : ''}>${L}${p.num}. ${PROC_META[p.num].short}</option>`).join('')}</select>` : ''}
      <nav class="nav">${num ? TABS.map((t) => `<a href="#/p/${num}/${t.id}" class="${t.id === tab ? 'active' : ''}">${t.name}</a>`).join('') : '<a class="active" href="#/">Процессы бурения</a>'}
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
    shell(n, t, `<a href="#/">${MODULE.name}</a><span class="sep">›</span><span>${L}${n}. ${esc(P.title)}</span><span class="sep">›</span><span>${TABS.find((x) => x.id === t).name}</span>`);
    ({ work: renderWork, flow: renderFlow, bpmn: renderBpmn, compare: renderCompare })[t](n, extra);
  } else {
    shell(0, '', `<span>Модуль «${MODULE.name}»</span><span class="sep">·</span><span>${MODULE.org}</span>`);
    renderHub();
  }
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

// Ссылка на подробный модуль «Освоение» для Б4
const osvLink = (cls = 'btn') => `<a class="${cls}" href="${ABAI_ROOT}osvoenie/">Подробный прототип — модуль «Освоение» →</a>`;

// ---------- Главная модуля ----------
function renderHub() {
  const all = BPMN.map((p) => ({ p, a: variantStats(p.num, 'asis'), d: variantStats(p.num, 'dream') }));
  const detail = BPMN.reduce((s, p) => s + detailSteps(p.num).length, 0);
  const opt = BPMN.reduce((s, p) => s + optimizations(p.num).length, 0);
  $('#view').innerHTML = `
    <div class="hero">
      <div><h1>Бурение в ABAI: от точки на карте до бригад ВСР</h1>
      <p>5 процессов, по четыре варианта BPMN: AS IS в описании Nedra, детальный AS IS, TO BE Nedra и Dream TO BE. Для каждого процесса — рабочее место ключевой роли, пошаговый процесс Dream TO BE, схемы и сравнение систем по шагам.</p></div>
      <div class="stats hero-stats">
        <div class="stat"><div class="v">${all.reduce((s, x) => s + x.d.steps, 0)}</div><div class="l">шагов в Dream TO BE</div></div>
        <div class="stat"><div class="v">${detail}</div><div class="l">шагов детализации, которых нет в описании Nedra</div></div>
        <div class="stat"><div class="v">${all.reduce((s, x) => s + x.a.manual, 0)} → ${all.reduce((s, x) => s + x.d.manual, 0)}</div><div class="l">документов в Excel / Word / PDF и согласований в чате</div></div>
      </div>
    </div>
    <div class="proc-grid mt">${all.map(({ p, a, d }) => {
      const m = PROC_META[p.num];
      const abai = d.systems.filter((s) => sysKind(s) === 'abai');
      return `<div class="card proc-card">
        <a class="pc-h" href="#/p/${p.num}/work"><span class="pc-num">${L}${p.num}</span><span class="pc-ic">${m.icon}</span><div><b>${esc(p.title)}</b><span>${m.ws}</span></div></a>
        <div class="pc-b">
          <p>${m.idea}</p>
          <div class="pc-sys">${abai.map((s) => `<span class="chip sys abai">${s}</span>`).join(' ')}</div>
          <div class="pc-meta"><span>${d.steps} шагов · ${rolesOf(p.num).length} ролей</span><span class="pc-man" title="Документов в Excel / Word / PDF и согласований в рабочем чате">ручной работы: <b class="crit-t">${a.manual}</b> → <b class="good-t">${d.manual}</b></span></div>
          ${p.num === 4 ? `<div class="small">${osvLink('')}</div>` : ''}
        </div>
        <div class="pc-f"><a href="#/p/${p.num}/work">Рабочее место</a><a href="#/p/${p.num}/flow">Процесс</a><a href="#/p/${p.num}/bpmn/dream">Схема</a><a href="#/p/${p.num}/compare">Сравнение</a></div>
      </div>`;
    }).join('')}
      <div class="card proc-card hub-opt"><div class="card-h"><h2>Оптимизации Dream TO BE</h2><span class="muted small">${opt} по аннотациям BPMN</span></div>
        <ul class="opt-list">${BPMN.flatMap((p) => optimizations(p.num).map((o) => `<li><a href="#/p/${p.num}/flow/${o.t.id}"><b>${L}${p.num} · ${o.codes.join(' · ')}</b></a> ${esc(o.text)}</li>`)).join('')}</ul></div>
    </div>
    <div class="card mt"><div class="card-h"><h2>Связи между процессами</h2><span class="muted small">по message flow в BPMN · клик по процессу — открыть</span></div><div class="card-b">${relationMap()}</div></div>`;
}

function relationMap() {
  // Цепочка Б1 → Б2 → Б3 → Б4 в ряд; связи «через шаг» (в Б4 из Б1 и Б2) — дугами снизу
  const nw = 220, nh = 64, gap = 130, y0 = 86, W = 4 * nw + 3 * gap + 80, H = 450;
  const pos = { 1: [40, y0], 2: [40 + (nw + gap), y0], 3: [40 + 2 * (nw + gap), y0], 4: [40 + 3 * (nw + gap), y0], 5: [40, 350] };
  const pairs = [];
  BPMN.forEach((p) => p.adjacent.out.forEach((o) => {
    const t = +((o.match(/Б(\d)/) || [])[1]);
    if (t && t !== p.num) pairs.push({ a: p.num, b: t, what: o.replace(/^В Б\d:\s*/, '') });
  }));
  const lbl = (x, y, w, h, t, cls = '') => `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml" class="rel-l ${cls}">${esc(t)}</div></foreignObject>`;
  let deep = 0;
  const edges = pairs.sort((a, b) => (b.b - b.a) - (a.b - a.a)).map((e) => {
    const [x1] = pos[e.a], [x2] = pos[e.b];
    if (e.b === e.a + 1) {
      const ax = x1 + nw, bx = x2, y = y0 + nh / 2;
      return `<path d="M${ax},${y} L${bx},${y}" class="rel" marker-end="url(#rm)"/>${lbl(ax + 4, y0 - 60, gap - 8, 84, e.what, 'up')}`;
    }
    // дуга снизу: чем длиннее связь, тем глубже; входы в Б4 разнесены по ширине
    const d = 150 - deep * 60, sx = x1 + nw / 2, tx = x2 + nw / 2 + 50 - deep * 60, y = y0 + nh;
    deep++;
    return `<path d="M${sx},${y} C${sx},${y + d} ${tx},${y + d} ${tx},${y + 1}" class="rel" marker-end="url(#rm)"/>${lbl((sx + tx) / 2 - 160, y + d * 0.75 - 2, 320, 22, e.what, 'arc')}`;
  }).join('');
  const nodes = BPMN.map((p) => { const [x, y] = pos[p.num]; const m = PROC_META[p.num]; return `<a href="#/p/${p.num}/work"><g class="rnode"><rect x="${x}" y="${y}" width="${nw}" height="${nh}" rx="10"/><text x="${x + 14}" y="${y + 26}" class="rn">${L}${p.num}</text><text x="${x + 50}" y="${y + 26}" class="rt">${m.short}</text><text x="${x + 50}" y="${y + 46}" class="rs">${m.owner}</text></g></a>`; }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="relmap"><defs>
    <marker id="rm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8a93a6"/></marker></defs>${edges}${nodes}
    <text x="${40 + nw + 24}" y="${350 + nh / 2 + 4}" class="rs">самостоятельный контур: бригады КРС/ПРС на действующем фонде, связей с Б1–Б4 в BPMN нет</text></svg>`;
}

// ---------- Рабочее место ----------
function renderWork(num) {
  const D = DASH[num], m = PROC_META[num];
  const me = roleOf(num);
  const draw = () => {
    $('#view').innerHTML = `
      <div class="page-h"><div><div class="muted small">Рабочее место · Dream TO BE</div><h1>${m.ws}</h1></div>
        <div class="page-h-r">${num === 4 ? osvLink() : ''}${roleChip(m.owner)}${baseRole(me) !== m.owner ? `<span class="small muted">вы смотрите как «${esc(me)}» — экран принадлежит роли «${esc(m.owner)}»</span>` : ''}</div></div>
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
  const cmp = matrix.find((r) => r.code && r.code === sel.code && r.lane === sel.role) || matrix.find((r) => r.code && r.code === sel.code);
  const detail = new Set(detailSteps(num).map((t) => t.id));
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
          <span class="s-code">${t.code || 'шаг без номера'}${t.branch ? ' · ветка' : ''}</span>
          <div class="s-title">${esc(t.title)}</div><div class="s-role" style="color:${roleColor(t.role)}">${esc(t.role)}${t === cur && t.role === me ? ' · ваш шаг' : ''}</div></button></li>`).join('')}</ol>
        <div class="card-b"><button class="btn" id="resetFlow">Начать процесс заново</button></div>
      </div>
      <div class="layout-right">
        <div class="card">
          <div class="step-h">
            <div class="meta"><span class="chip">${sel.code ? 'Шаг ' + sel.code : 'Шаг без номера'}</span>${detail.has(sel.id) ? '<span class="chip" title="Шага нет в AS IS и TO BE Nedra — он есть в детальном AS IS">детализация</span>' : ''}${roleChip(sel.role)}
              ${st === 'done' ? '<span class="chip good">✓ Выполнено</span>' : st === 'skip' ? '<span class="chip">Ветка не понадобилась</span>' : st === 'cur' ? '<span class="chip warn">Текущий шаг</span>' : '<span class="chip sys">Не начат</span>'}</div>
            <h2>${esc(sel.title)}</h2>
            ${sel.branch ? `<div class="bpmn-note"><b>Ветка</b><span>${esc(sel.branch.q)} → «${esc(sel.branch.a)}»</span></div>` : ''}
            ${sel.notes.length ? `<div class="bpmn-note"><b>BPMN</b><span>${sel.notes.map(esc).join(' · ')}</span></div>` : ''}
          </div>
          <div class="card-b">
            ${st === 'cur' && !canAct ? `<div class="callout wait mb"><span class="grow">Шаг выполняет роль <b>${esc(sel.role)}</b>.</span><button class="btn primary" id="switchRole">Переключиться на эту роль</button></div>` : ''}
            <div class="grid g-1-1">
              <div><h3>Системы шага</h3><div class="sys-list mt-s">${sel.sys.length ? sel.sys.map((s) => `<div class="sys-row"><span class="chip sys ${sysKind(s)}">${esc(s)}</span><span class="small muted">${esc((SYS[s] || {}).desc || '')}</span></div>`).join('') : '<span class="muted small">—</span>'}</div></div>
              <div><h3>Документы и данные</h3><div class="docs mt-s">${sel.docs.length ? sel.docs.map((d) => `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(d.replace(/^Форма БД 2\.0:\s*/, ''))}</div><div class="sub">${/^Форма БД 2\.0/.test(d) ? 'форма в ABAI БД 2.0' : 'хранится в ABAI БД 2.0'}</div></div></div>`).join('') : '<span class="muted small">—</span>'}</div></div>
            </div>
            <h3 class="mt">Как выглядит в ABAI</h3>
            <div class="mt-s">${sysWidget(sel, num)}</div>
            ${cmp ? `<h3 class="mt">Этот шаг в других вариантах</h3>
              <table class="t mt-s"><tbody>${Object.entries(VARIANTS).map(([k, x]) => `
                <tr><td class="${k === 'dream' ? '' : 'muted'}" style="width:130px">${k === 'dream' ? `<b>${x.name}</b>` : x.name}</td><td>${cmp[k] ? sysList(cmp[k]) : '<span class="muted small">шага нет</span>'}</td></tr>`).join('')}</tbody></table>` : ''}
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

// Системы шага + форматы ручных документов (Excel, Word, PDF) из BPMN
function sysList(v) {
  const fmts = [...new Set(v.docs.map((d) => (d.match(/\(([^)]*(?:Excel|Word|PDF)[^)]*)\)/) || [])[1]).filter(Boolean))];
  const chips = v.sys.map((s) => `<span class="chip sys ${sysKind(s)}">${esc(s)}</span>`).concat(fmts.map((f) => `<span class="chip sys manual" title="Документы шага">${esc(f)}</span>`));
  return chips.length ? chips.join(' ') : '<span class="muted small">без системы</span>';
}

// Мини-экран ABAI для шага — по главной системе шага
function sysWidget(t, num) {
  const has = (s) => t.sys.includes(s);
  const win = (title, body) => `<div class="mini"><div class="mini-top"><i></i><b>ABAI</b><span>${title}</span></div><div class="mini-b">${body}</div></div>`;
  const form = (t.docs.find((d) => /^Форма БД 2\.0/.test(d)) || '').replace(/^Форма БД 2\.0:\s*/, '');
  if (has('ABAI ЦРНС 2.0')) return win('ЦРНС 2.0 · точки бурения', `<div class="mini-kpi"><div><b>20</b><span>точек в заказ-наряде</span></div><div><b class="good-t">17</b><span>подтверждено маркшейдерами</span></div><div><b class="warn-t">3</b><span>на отбивке</span></div></div>
    <table class="t"><tr><td>Т-07 · Узень</td><td class="num">X 5 142 380</td><td class="num">Y 7 318 905</td><td>${chip('подтверждена', 'good')}</td></tr><tr><td>Т-12 · Узень</td><td class="num">X 5 143 010</td><td class="num">Y 7 319 450</td><td>${chip('отбивка', 'warn')}</td></tr></table>`);
  if (has('Петролайн ДЭЛ-140/150') && has('КХД')) return win('КХД · данные станции ГТИ', `<div class="mini-flow"><span>Петролайн ДЭЛ-150 ✓</span><em>→ КХД →</em><span class="hl">БД 2.0: данные раз в 10 с</span></div><div class="alarm ok"><b>Канал работает</b><span>глубина, нагрузка, обороты, давление</span></div>`);
  if (has('Петролайн ДЭЛ-140/150')) return win('БД 2.0 · бурение онлайн', `<div class="mini-kpi"><div><b>1 146 м</b><span>текущий забой</span></div><div><b>12,4 т</b><span>нагрузка</span></div><div><b>62 об/мин</b><span>обороты</span></div></div><div class="alarm ok"><b>Данные станции ГТИ идут онлайн</b><span>проходка пишется без ручного ввода</span></div>`);
  if (has('ABAI ПДИМ 2.0') && has('ABAI ТР 2.0')) return win('ПДИМ 2.0 · новая скважина', `<div class="mini-kpi"><div><b>38,5</b><span>Qж, м³/сут</span></div><div><b>21,2</b><span>Qн, т/сут</span></div><div><b>34 %</b><span>обводнённость</span></div></div><div class="alarm ok"><b>Режим поставлен на контроль в ТР 2.0</b><span>30 суток стабильной работы</span></div>`);
  if (has('ABAI ПДИМ 2.0') && has('ABAI БД 2.0')) return win('БД 2.0 · производственная программа', `<table class="t"><tr><th>Месторождение</th><th class="num">Скважин</th><th class="num">+Qн, т/сут</th><th class="num">Стоимость, млрд ₸</th></tr><tr><td>Узень</td><td class="num">42</td><td class="num">+640</td><td class="num">38,6</td></tr><tr><td>Карамандыбас</td><td class="num">14</td><td class="num">+190</td><td class="num">12,1</td></tr></table>`);
  if (has('ABAI ПДИМ 2.0')) return win('ПДИМ 2.0 · сравнение с соседями', `<table class="t"><tr><th>Скв.</th><th class="num">Qн, т/сут</th><th class="num">Обв.</th></tr><tr class="hl"><td><b>7421 (новая)</b></td><td class="num">21,2</td><td class="num">34 %</td></tr><tr><td>7418</td><td class="num">18,6</td><td class="num">41 %</td></tr><tr><td>7409</td><td class="num">16,9</td><td class="num">45 %</td></tr></table>`);
  if (has('ABAI ПАЭГТМ')) return win('ПАЭГТМ · кандидаты на КРС/ПРС', `<table class="t"><tr><td>Скв. 3057 · КРС</td><td class="num">+9,4 т/сут</td><td>${chip('в план', 'good')}</td></tr><tr><td>Скв. 0719 · ПРС</td><td class="num">+4,2 т/сут</td><td>${chip('в план', 'good')}</td></tr><tr><td>Скв. 2231 · КРС</td><td class="num">+1,1 т/сут</td><td>${chip('нерентабельно', 'crit')}</td></tr></table>`);
  if (has('АВР+') && !has('ABAI БД 2.0')) return win('АВР+ · документ подрядчика', `<div class="doc"><div class="ic pdf">PDF</div><div class="grow"><div class="name">${esc(form || (num === 5 ? 'Заказ-наряд КРС/ПРС' : 'Акт выполненных работ'))}</div><div class="sub">связан с карточкой скважины в ABAI</div></div>${chip('подписан ЭЦП', 'good')}</div>`);
  if (has('Государственный портал')) return win('Госпортал elicense.kz → БД 2.0', `<table class="t"><tr><td>Разрешение на эмиссии</td><td>до 31.12.2027</td><td>${chip('действует', 'good')}</td></tr><tr><td>Экспертиза проекта</td><td>до 15.06.2027</td><td>${chip('действует', 'good')}</td></tr><tr><td>Разрешение на бурение</td><td>—</td><td>${chip('подано', 'warn')}</td></tr></table>`);
  if (has('Портал закупок Самрук-Казына')) return win('Закупка · портал Самрук-Казына', `<div class="doc"><div class="ic pdf">PDF</div><div class="grow"><div class="name">Договор с буровым подрядчиком</div><div class="sub">итог тендера фиксируется по скважине в БД 2.0</div></div>${chip('заключён', 'good')}</div>`);
  if (has('КХД')) return win('КХД → КМГ', `<div class="mini-flow"><span>БД 2.0 ОМГ</span><em>→ КХД →</em><span class="hl">КМГ: данные по скважинам</span></div><div class="alarm ok"><b>Передано без писем и файлов</b><span>статус и замечания возвращаются уведомлением</span></div>`);
  if (t.sys.some((s) => ['COMPASS', 'WellPlan', 'SLB Petrel', 'SLB Techlog', 'Sysdrill', 'ПК ЭРА'].includes(s))) return win('БД 2.0 · техпроект и расчёты', `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(form || 'Технический проект')}</div><div class="sub">расчёты из ${t.sys.filter((s) => sysKind(s) === 'ext').join(', ')} приложены к карточке</div></div>${chip('версия 3', 'warn')}</div>`);
  const docs = t.docs.length ? t.docs.map((d) => d.replace(/^Форма БД 2\.0:\s*/, '')) : ['Запись шага'];
  return win('БД 2.0 · карточка скважины', docs.map((d) => `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(d)}</div><div class="sub">форма в ABAI БД 2.0 · статус и уведомления</div></div></div>`).join(''));
}

// ---------- Схемы BPMN по реальной разметке ----------
function renderBpmn(num, variant) {
  const v = VARIANTS[variant] ? variant : 'dream';
  const pl = pool(num, v);
  const k = ui.zoom;
  const stats = variantStats(num, v);
  const nodesSvg = pl.nodes.map((n) => {
    if (n.kind === 'task') {
      const kinds = n.sys.map(sysKind).concat(Array(n.docs.filter((d) => /Excel|Word|PDF/.test(d)).length).fill('manual'));
      const dots = kinds.map((kd, i) => `<circle cx="${n.x + 10 + i * 13}" cy="${n.y + n.h + 10}" r="5" class="d-${kd}"/>`).join('');
      return `<g class="bn task ${ui.bpmnSel === n.id ? 'sel' : ''}" data-node="${n.id}">
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
    <div class="page-h"><div><div class="muted small">Схема из файла «${esc(proc(num).file)}» · ${VARIANTS[v].sub}</div><h1>${esc(pl.pool.replace(/ — .*$/, ''))} · ${VARIANTS[v].name}</h1></div>
      <div class="page-h-r"><div class="seg big">${Object.entries(VARIANTS).map(([k2, x]) => `<button data-v="${k2}" class="${k2 === v ? 'sel' : ''}">${x.name}</button>`).join('')}</div></div></div>
    <div class="bpmn-bar">
      <span>${stats.steps} шагов</span><span>ручная работа: <b class="${stats.manual ? 'crit-t' : 'good-t'}">${stats.manual}</b></span>
      <span class="lg"><i class="d-abai"></i>ABAI</span><span class="lg"><i class="d-nedra"></i>Nedra</span><span class="lg"><i class="d-ext"></i>отраслевые и корп.</span><span class="lg"><i class="d-manual"></i>Excel / Word / PDF, чат</span>
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
  const st = Object.fromEntries(Object.keys(VARIANTS).map((k) => [k, variantStats(num, k)]));
  const m = PROC_META[num];
  $('#view').innerHTML = `
    <div class="page-h"><div><div class="muted small">Сравнение вариантов по шагам</div><h1>AS IS → TO BE Nedra → Dream TO BE</h1></div></div>
    <div class="bpmn-note mb"><b>Dream TO BE</b><span>${m.idea}</span></div>
    <div class="variants v4">${Object.entries(VARIANTS).map(([k, x]) => `<div class="card variant ${x.tone}"><div class="card-b">
      <div class="tag">${x.sub}</div><h2>${x.name}</h2>
      <div class="stats mt-s" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat"><div class="v">${st[k].steps}</div><div class="l">шагов</div></div>
        <div class="stat"><div class="v ${st[k].manual ? 'crit-t' : 'good-t'}">${st[k].manual}</div><div class="l">ручная работа</div></div>
        <div class="stat"><div class="v">${k === 'nedra' ? st[k].nedra : k === 'dream' ? st[k].abai : st[k].systems.filter((s) => sysKind(s) !== 'manual').length}</div><div class="l">${k === 'nedra' ? 'решений Nedra' : k === 'dream' ? 'модулей ABAI' : 'систем'}</div></div>
      </div>
      <a class="btn mt" href="#/p/${num}/bpmn/${k}">Открыть схему</a></div></div>`).join('')}</div>
    <div class="card mt"><div class="card-h"><h2>Системы и документы по шагам</h2><span class="muted small">шаги сопоставлены по номеру из BPMN · красным — Excel / Word / PDF и чат</span></div>
      <div class="tbl-scroll"><table class="t cmp"><thead><tr><th>Шаг</th><th>Роль (Dream TO BE)</th>${Object.entries(VARIANTS).map(([k, x]) => `<th class="${k === 'dream' ? 'dream-h' : ''}">${x.name}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr><td><b>${r.code || '—'}</b> ${esc(r.title)}${!r.asisn && r.dream ? ' <span class="chip">детализация</span>' : ''}</td><td>${r.dream ? roleChip(r.lane) : '<span class="muted small">нет в Dream TO BE</span>'}</td>
        ${Object.keys(VARIANTS).map((k) => `<td>${r[k] ? sysList(r[k]) : '—'}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div></div>`;
}

route();
