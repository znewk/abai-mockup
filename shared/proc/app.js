// Общий прототип v1 модулей на BPMN (Бурение, Геология, Разработка): главная, рабочие места,
// шаги Dream TO BE, схемы BPMN всех вариантов, сравнение. Модуль задаёт MODULE и справочники в config.js,
// рабочие места DASH и мини-экраны sysWidget — в dash.js.

const STORE_KEY = `abai-${MODULE.id}-v1`;
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

// Роль по умолчанию — владелец рабочего места
function roleOf(num) {
  if (state.role[num]) return state.role[num];
  const roles = rolesOf(num), owner = PROC_META[num].owner;
  return (roles.find((r) => r.name === owner) || roles.find((r) => baseRole(r.name) === owner) || roles[0]).name;
}
const roleChip = (name) => `<span class="chip role" style="color:${roleColor(name)};border-color:${roleColor(name)}55">${esc(name)}</span>`;
const flowName = (num) => (hasDream(num) ? 'Процесс Dream TO BE' : 'Процесс AS IS');
const TABS = [
  { id: 'work', name: 'Рабочее место' },
  { id: 'flow', name: 'Процесс Dream TO BE' },
  { id: 'bpmn', name: 'Схемы BPMN' },
  { id: 'compare', name: 'AS IS → Dream TO BE' },
];
// Нет Dream TO BE в BPMN — честно говорим об этом на каждой вкладке
const noDreamNote = (num) => (hasDream(num) ? '' : `<div class="callout wait mb"><span class="grow"><b>Dream TO BE для ${procLabel(num)} в BPMN не отрисован.</b> Экраны построены по варианту AS IS: ${esc(VARIANTS.asis.sub.replace(/^Как сейчас\s*—\s*/, ''))}.</span></div>`);
// Дополнительная ссылка процесса (например, Б4 → подробный модуль «Освоение»)
const procLink = (num, cls = 'btn') => { const l = PROC_META[num].link; return l ? `<a class="${cls}" href="${ABAI_ROOT}${l.href}">${l.label} →</a>` : ''; };

// ---------- Каркас ----------
function shell(num, tab, crumbs) {
  const roles = num ? rolesOf(num) : [];
  $('#shell').innerHTML = `
    <div class="mock-banner">Мокап для обсуждения · демо-данные · модуль «${MODULE.name}» · ${BPMN.length} процессов из BPMN</div>
    <header class="topbar">
      <a class="logo" href="#/"><svg viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1c5cab"/><path d="M6 23 13 9l4 8 3-5 6 11z" fill="#fff"/><circle cx="23" cy="9" r="2.5" fill="#86b6ef"/></svg><div>ABAI<small>${MODULE.name}</small></div></a>
      ${abaiModuleSwitch(MODULE.id, 'v1')}
      ${num ? `<select id="procSel" class="proc-sel">${BPMN.map((p) => `<option value="${p.num}" ${p.num === num ? 'selected' : ''}>${procLabel(p.num)}. ${PROC_META[p.num].short}</option>`).join('')}</select>` : ''}
      <nav class="nav">${num ? TABS.map((t) => `<a href="#/p/${num}/${t.id}" class="${t.id === tab ? 'active' : ''}">${t.id === 'flow' ? flowName(num) : t.name}</a>`).join('') : `<a class="active" href="#/">${MODULE.home}</a>`}
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
    shell(n, t, `<a href="#/">${MODULE.name}</a><span class="sep">›</span><span>${procLabel(n)}. ${esc(P.title)}</span><span class="sep">›</span><span>${t === 'flow' ? flowName(n) : TABS.find((x) => x.id === t).name}</span>`);
    ({ work: renderWork, flow: renderFlow, bpmn: renderBpmn, compare: renderCompare })[t](n, extra);
  } else {
    shell(0, '', `<span>Модуль «${MODULE.name}»</span><span class="sep">·</span><span>${MODULE.org}</span>`);
    renderHub();
  }
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

// ---------- Главная модуля ----------
// Метрика «было → стало» по модулю: ручная работа (Excel / Word / PDF, чат) или шаги, выполняемые в ABAI
function metric(num) {
  const a = variantStats(num, 'asis'), b = variantStats(num, baseVariant(num));
  return MODULE.metric === 'abai'
    ? { from: a.abaiSteps, to: b.abaiSteps, of: [a.steps, b.steps], label: 'шагов в ABAI', hint: 'Шагов процесса, выполняемых в модулях ABAI: AS IS → Dream TO BE' }
    : { from: a.manual, to: b.manual, label: 'ручной работы', hint: 'Документов в Excel / Word / PDF и согласований в чате: AS IS → Dream TO BE' };
}
function hubStats() {
  const all = BPMN.map((p) => ({ p, d: variantStats(p.num, baseVariant(p.num)), m: metric(p.num) }));
  const sum = (f) => all.reduce((s, x) => s + f(x), 0);
  const out = {
    steps: [sum((x) => (hasDream(x.p.num) ? x.d.steps : 0)), 'шагов в Dream TO BE'],
    detail: [BPMN.reduce((s, p) => s + detailSteps(p.num).length, 0), 'шагов детализации, которых нет в описании Nedra'],
    opt: [BPMN.reduce((s, p) => s + optimizations(p.num).length, 0), 'оптимизаций и автоматизаций по аннотациям BPMN'],
    manual: [`${sum((x) => x.m.from)} → ${sum((x) => x.m.to)}`, 'документов в Excel / Word / PDF и согласований в чате'],
    abai: [`${sum((x) => x.m.from)} → ${sum((x) => x.m.to)}`, 'шагов, которые выполняются в ABAI'],
  };
  return (MODULE.hubStats || ['steps', 'opt', MODULE.metric === 'abai' ? 'abai' : 'manual']).map((k) => out[k]);
}
function renderHub() {
  const opt = BPMN.reduce((s, p) => s + optimizations(p.num).length, 0);
  $('#view').innerHTML = `
    <div class="hero">
      <div><h1>${MODULE.hubTitle}</h1><p>${MODULE.hubLead}</p></div>
      <div class="stats hero-stats">${hubStats().map(([v, l]) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('')}</div>
    </div>
    <div class="proc-grid mt">${BPMN.map((p) => {
      const m = PROC_META[p.num], d = variantStats(p.num, baseVariant(p.num)), mt = metric(p.num);
      const abai = d.systems.filter((s) => sysKind(s) === 'abai');
      return `<div class="card proc-card">
        <a class="pc-h" href="#/p/${p.num}/work"><span class="pc-num">${procLabel(p.num)}</span><span class="pc-ic">${m.icon}</span><div><b>${esc(p.title)}</b><span>${m.ws}</span></div></a>
        <div class="pc-b">
          <p>${m.idea}</p>
          <div class="pc-sys">${abai.map((s) => `<span class="chip sys abai">${s}</span>`).join(' ')}</div>
          <div class="pc-meta"><span>${d.steps} шагов · ${rolesOf(p.num).length} ролей${hasDream(p.num) ? '' : ' · <b class="warn-t">Dream в BPMN нет</b>'}</span><span class="pc-man" title="${mt.hint}">${mt.label}: <b class="${MODULE.metric === 'abai' ? '' : 'crit-t'}">${mt.from}</b> → <b class="good-t">${mt.to}</b></span></div>
          ${m.link ? `<div class="small">${procLink(p.num, '')}</div>` : ''}
        </div>
        <div class="pc-f"><a href="#/p/${p.num}/work">Рабочее место</a><a href="#/p/${p.num}/flow">Процесс</a><a href="#/p/${p.num}/bpmn/${baseVariant(p.num)}">Схема</a><a href="#/p/${p.num}/compare">Сравнение</a></div>
      </div>`;
    }).join('')}
      ${opt ? `<div class="card proc-card hub-opt"><div class="card-h"><h2>Оптимизации Dream TO BE</h2><span class="muted small">${opt} по аннотациям BPMN</span></div>
        <ul class="opt-list">${BPMN.flatMap((p) => optimizations(p.num).map((o) => `<li><a href="#/p/${p.num}/flow/${o.t.id}"><b>${procLabel(p.num)} · ${o.codes.join(' · ')}</b></a> ${esc(o.text)}</li>`)).join('')}</ul></div>` : ''}
    </div>
    <div class="card mt"><div class="card-h"><h2>Связи между процессами</h2><span class="muted small">по связям со смежными процессами в BPMN · клик по процессу — открыть</span></div><div class="card-b">${relationMap()}${externalLinks()}</div></div>`;
}

// Связи: строки вида «В Б2: техпроект…», «В Р4 (4.1), Б1, КС1: …; в Р2 (2.18): …» или «Г3.2. Обработка…»
const CODE_RE = /[ГБРДТ]\d+(?:\.\d+)?/g;
const codeNum = () => Object.fromEntries(BPMN.map((p) => [procLabel(p.num), p.num]));
function linkSegments(text) {
  return text.split(/;\s*(?=[Вв]\s)/).map((seg) => {
    const m = seg.match(/^[Вв]\s+(.+?):\s*(.+)$/);
    return m ? { codes: m[1].match(CODE_RE) || [], what: m[2], name: m[1] } : { codes: (seg.match(CODE_RE) || []).slice(0, 1), what: '', name: seg };
  });
}
function relationPairs() {
  const map = codeNum(), pairs = [];
  BPMN.forEach((p) => p.adjacent.out.forEach((o) => linkSegments(o).forEach((s) => s.codes.forEach((c) => {
    const t = map[c];
    if (!t || t === p.num) return;
    const e = pairs.find((x) => x.a === p.num && x.b === t);
    if (e) { if (s.what && !e.what.includes(s.what)) e.what = e.what ? `${e.what}; ${s.what}` : s.what; } else pairs.push({ a: p.num, b: t, what: s.what });
  }))));
  return pairs;
}
function externalLinks() {
  const map = codeNum(), ext = new Map();
  BPMN.forEach((p) => ['in', 'out'].forEach((dir) => p.adjacent[dir].forEach((o) => linkSegments(o).forEach((s) => {
    const others = (s.codes.length ? s.codes : [s.name || o]).filter((c) => !map[c]);
    others.forEach((c) => { const k = `${dir}|${c}`; if (!ext.has(k)) ext.set(k, { dir, c, from: new Set() }); ext.get(k).from.add(procLabel(p.num)); });
  }))));
  if (!ext.size) return '';
  const row = (dir) => [...ext.values()].filter((e) => e.dir === dir).map((e) => `<span class="chip" title="${esc(e.c)}">${esc(e.c.length > 60 ? e.c.slice(0, 58) + '…' : e.c)} <span class="muted">· ${[...e.from].join(', ')}</span></span>`).join(' ');
  return `<div class="ext-links"><div><b>Из других процессов</b>${row('in') || '<span class="muted small">—</span>'}</div><div><b>В другие процессы</b>${row('out') || '<span class="muted small">—</span>'}</div></div>`;
}
function relationMap() {
  const R = MODULE.rel, nw = R.nw || 220, nh = 64, pos = R.pos;
  const pairs = relationPairs();
  const lbl = (x, y, w, h, t, cls = '') => (t ? `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml" class="rel-l ${cls}" title="${esc(t)}">${esc(t.length > 70 ? t.slice(0, 68) + '…' : t)}</div></foreignObject>` : '');
  const clip = (cx, cy, sx, sy) => { const t = Math.min(Math.abs((nw / 2) / (sx || 1e-6)), Math.abs((nh / 2) / (sy || 1e-6))); return [cx + sx * t, cy + sy * t]; };
  let deep = 0;
  const edges = pairs.sort((a, b) => Math.abs(pos[b.b][0] - pos[b.a][0]) - Math.abs(pos[a.b][0] - pos[a.a][0])).map((e) => {
    const [x1, y1] = pos[e.a], [x2, y2] = pos[e.b];
    const both = pairs.some((x) => x.a === e.b && x.b === e.a);
    const off = both ? (e.a < e.b ? -7 : 7) : 0;
    if (Math.abs(y1 - y2) < 2) {
      const between = Object.entries(pos).some(([n, [x, y]]) => +n !== e.a && +n !== e.b && Math.abs(y - y1) < 2 && x > Math.min(x1, x2) && x < Math.max(x1, x2));
      if (!between) {
        const ax = x1 < x2 ? x1 + nw : x1, bx = x1 < x2 ? x2 : x2 + nw, y = y1 + nh / 2 + off;
        const lx = Math.min(ax, bx), gw = Math.abs(bx - ax);
        const short = e.what.length > 60 ? e.what.slice(0, 58) + '…' : e.what;
        return `<path d="M${ax},${y} L${bx},${y}" class="rel" marker-end="url(#rm)"/>${off > 0 ? lbl(lx + 4, y + 6, gw - 8, 46, short, 'down') : lbl(lx + 4, y1 - 62, gw - 8, 84, short, 'up')}`;
      }
      // дуга снизу через соседние процессы: чем длиннее связь, тем глубже
      const d = 150 - deep * 60, sx = x1 + nw / 2, tx = x2 + nw / 2 + 50 - deep * 60, y = y1 + nh;
      deep++;
      return `<path d="M${sx},${y} C${sx},${y + d} ${tx},${y + d} ${tx},${y + 1}" class="rel" marker-end="url(#rm)"/>${lbl((sx + tx) / 2 - 160, y + d * 0.75 - 2, 320, 22, e.what, 'arc')}`;
    }
    const cx1 = x1 + nw / 2, cy1 = y1 + nh / 2, cx2 = x2 + nw / 2, cy2 = y2 + nh / 2;
    const dx = cx2 - cx1, dy = cy2 - cy1, len = Math.hypot(dx, dy) || 1, nx = -dy / len * off, ny = dx / len * off;
    const [ax, ay] = clip(cx1, cy1, dx / len, dy / len), [bx, by] = clip(cx2, cy2, -dx / len, -dy / len);
    // подпись ближе к началу стрелки — у встречных диагоналей подписи не сходятся в одной точке
    const mx = ax + (bx - ax) * 0.3 + nx, my = ay + (by - ay) * 0.3 + ny;
    const short = e.what.length > 44 ? e.what.slice(0, 42) + '…' : e.what;
    return `<path d="M${ax + nx},${ay + ny} L${bx + nx},${by + ny}" class="rel" marker-end="url(#rm)"/>${lbl(mx - 100, my - 12, 200, 24, short, 'mid')}`;
  }).join('');
  const nodes = BPMN.map((p) => { const [x, y] = pos[p.num]; const m = PROC_META[p.num]; return `<a href="#/p/${p.num}/work"><g class="rnode"><rect x="${x}" y="${y}" width="${nw}" height="${nh}" rx="10"/><text x="${x + 14}" y="${y + 26}" class="rn">${procLabel(p.num)}</text><text x="${x + 62}" y="${y + 26}" class="rt">${m.short}</text><text x="${x + 62}" y="${y + 46}" class="rs">${m.owner}</text></g></a>`; }).join('');
  return `<svg viewBox="0 0 ${R.W} ${R.H}" class="relmap"><defs>
    <marker id="rm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#8a93a6"/></marker></defs>${edges}${nodes}
    ${(R.notes || []).map(([x, y, t]) => `<text x="${x}" y="${y}" class="rs">${esc(t)}</text>`).join('')}</svg>`;
}

// ---------- Рабочее место ----------
function renderWork(num) {
  const D = DASH[num], m = PROC_META[num];
  const me = roleOf(num);
  const draw = () => {
    $('#view').innerHTML = `
      <div class="page-h"><div><div class="muted small">Рабочее место · ${hasDream(num) ? 'Dream TO BE' : 'AS IS'}</div><h1>${m.ws}</h1></div>
        <div class="page-h-r">${procLink(num)}${roleChip(m.owner)}${baseRole(me) !== m.owner ? `<span class="small muted">вы смотрите как «${esc(me)}» — экран принадлежит роли «${esc(m.owner)}»</span>` : ''}</div></div>
      ${noDreamNote(num)}
      <div class="bpmn-note mb"><b>Идея</b><span>${m.idea}</span></div>
      <div id="dash">${D.html()}</div>
      <div class="card mt"><div class="card-h"><h2>Шаги процесса на этом экране</h2><span class="muted small">клик — открыть шаг</span></div><div class="card-b steps-row">
        ${D.steps.map((c) => { const t = tasksOf(basePool(num)).find((x) => x.code === c); return t ? `<a class="step-pill" href="#/p/${num}/flow/${t.id}"><b>${c}</b>${esc(t.title)}</a>` : ''; }).join('')}
      </div></div>`;
    D.mount($('#dash'), draw);
  };
  draw();
}

// ---------- Процесс по шагам ----------
function flowTasks(num) {
  const pl = basePool(num);
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
  const cmp = stepMatrix(num).find((r) => r.id === sel.id);
  const detail = new Set(detailSteps(num).map((t) => t.id));
  const status = (t) => (done.has(t.id) ? 'done' : skip.has(t.id) ? 'skip' : t === cur ? 'cur' : 'todo');
  const st = status(sel);
  const canAct = st === 'cur' && sel.role === me;
  const progress = Math.round(((done.size + skip.size) / tasks.length) * 100);

  $('#view').innerHTML = `${noDreamNote(num)}
    <div class="layout">
      <div class="card">
        <div class="card-h"><h2>Шаги ${hasDream(num) ? 'Dream TO BE' : 'AS IS'}</h2><span class="muted small">${done.size + skip.size} / ${tasks.length}</span></div>
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
            <div class="meta"><span class="chip">${sel.code ? 'Шаг ' + sel.code : 'Шаг без номера'}</span>${detail.has(sel.id) ? '<span class="chip" title="Шага нет в описании Nedra — он есть в детальном AS IS и Dream TO BE">детализация</span>' : ''}${roleChip(sel.role)}
              ${st === 'done' ? '<span class="chip good">✓ Выполнено</span>' : st === 'skip' ? '<span class="chip">Ветка не понадобилась</span>' : st === 'cur' ? '<span class="chip warn">Текущий шаг</span>' : '<span class="chip sys">Не начат</span>'}</div>
            <h2>${esc(sel.title)}</h2>
            ${sel.branch ? `<div class="bpmn-note"><b>Ветка</b><span>${esc(sel.branch.q)} → «${esc(sel.branch.a)}»</span></div>` : ''}
            ${sel.notes.length ? `<div class="bpmn-note"><b>BPMN</b><span>${sel.notes.map(esc).join(' · ')}</span></div>` : ''}
          </div>
          <div class="card-b">
            ${st === 'cur' && !canAct ? `<div class="callout wait mb"><span class="grow">Шаг выполняет роль <b>${esc(sel.role)}</b>.</span><button class="btn primary" id="switchRole">Переключиться на эту роль</button></div>` : ''}
            <div class="grid g-1-1">
              <div><h3>Системы шага</h3><div class="sys-list mt-s">${sel.sys.length ? sel.sys.map((s) => `<div class="sys-row"><span class="chip sys ${sysKind(s)}">${esc(s)}</span><span class="small muted">${esc((SYS[s] || {}).desc || '')}</span></div>`).join('') : '<span class="muted small">—</span>'}</div></div>
              <div><h3>Документы и данные</h3><div class="docs mt-s">${sel.docs.length ? sel.docs.map((d) => `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(d.replace(/^Форма БД 2\.0:\s*/, ''))}</div><div class="sub">${/^Форма БД 2\.0/.test(d) ? 'форма в ABAI БД 2.0' : isAbaiStep(sel) ? 'хранится в ABAI' : 'файл'}</div></div></div>`).join('') : '<span class="muted small">—</span>'}</div></div>
            </div>
            <h3 class="mt">Как выглядит в ABAI</h3>
            <div class="mt-s">${sysWidget(sel, num)}</div>
            ${cmp ? `<h3 class="mt">Этот шаг в других вариантах</h3>
              <table class="t mt-s"><tbody>${variantsOf(num).map((k) => `
                <tr><td class="${k === baseVariant(num) ? '' : 'muted'}" style="width:130px">${k === baseVariant(num) ? `<b>${VARIANTS[k].name}</b>` : VARIANTS[k].name}</td><td>${cmp[k] ? sysList(cmp[k]) : '<span class="muted small">шага нет</span>'}</td></tr>`).join('')}</tbody></table>` : ''}
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

// Системы шага + форматы ручных документов (Excel, Word, PDF) из BPMN — если модуль их считает
function sysList(v) {
  const fmts = MODULE.metric === 'abai' ? [] : [...new Set(v.docs.map((d) => (d.match(/\(([^)]*(?:Excel|Word|PDF)[^)]*)\)/) || [])[1]).filter(Boolean))];
  const chips = v.sys.map((s) => `<span class="chip sys ${sysKind(s)}">${esc(s)}</span>`).concat(fmts.map((f) => `<span class="chip sys manual" title="Документы шага">${esc(f)}</span>`));
  return chips.length ? chips.join(' ') : '<span class="muted small">без системы</span>';
}
// Мини-экран по умолчанию: формы и документы шага в ABAI БД 2.0
function defaultWidget(t) {
  const win = (title, body) => `<div class="mini"><div class="mini-top"><i></i><b>ABAI</b><span>${title}</span></div><div class="mini-b">${body}</div></div>`;
  const docs = t.docs.length ? t.docs.map((d) => d.replace(/^Форма БД 2\.0:\s*/, '')) : ['Запись шага'];
  const main = t.sys.find((s) => sysKind(s) === 'abai') || 'ABAI БД 2.0';
  return win(`${main.replace(/^ABAI /, '')} · карточка шага`, docs.slice(0, 4).map((d) => `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(d)}</div><div class="sub">в ${esc(main)} · статус и уведомления</div></div></div>`).join(''));
}

// ---------- Схемы BPMN по реальной разметке ----------
function renderBpmn(num, variant) {
  const v = pool(num, variant) ? variant : baseVariant(num);
  const pl = pool(num, v);
  const k = ui.zoom;
  const stats = variantStats(num, v);
  const nodesSvg = pl.nodes.map((n) => {
    if (n.kind === 'task' || n.kind === 'link') {
      const kinds = n.kind === 'link' ? [] : n.sys.map(sysKind).concat(MODULE.metric === 'abai' ? [] : Array(n.docs.filter((d) => /Excel|Word|PDF/.test(d)).length).fill('manual'));
      const dots = kinds.map((kd, i) => `<circle cx="${n.x + 10 + i * 13}" cy="${n.y + n.h + 10}" r="5" class="d-${kd}"/>`).join('');
      return `<g class="bn task ${n.kind === 'link' ? 'link' : ''} ${ui.bpmnSel === n.id ? 'sel' : ''}" ${n.kind === 'task' ? `data-node="${n.id}"` : ''}>
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
    <div class="page-h"><div><div class="muted small">Схема из файла «${esc(proc(num).file)}» · ${VARIANTS[v].sub}</div><h1>${procLabel(num)}. ${esc(proc(num).title)} · ${VARIANTS[v].name}</h1></div>
      <div class="page-h-r"><div class="seg big">${variantsOf(num).map((k2) => `<button data-v="${k2}" class="${k2 === v ? 'sel' : ''}">${VARIANTS[k2].name}</button>`).join('')}</div></div></div>
    ${pl.remark ? `<div class="callout wait mb">В BPMN этот вариант помечен «${esc(pl.remark)}» — схема может быть неполной.</div>` : ''}
    <div class="bpmn-bar">
      <span>${stats.steps} шагов</span>${MODULE.metric === 'abai' ? `<span>в ABAI: <b>${stats.abaiSteps}</b></span>` : `<span>ручная работа: <b class="${stats.manual ? 'crit-t' : 'good-t'}">${stats.manual}</b></span>`}
      <span class="lg"><i class="d-abai"></i>ABAI</span><span class="lg"><i class="d-nedra"></i>Nedra</span><span class="lg"><i class="d-ext"></i>отраслевые и корп.</span><span class="lg"><i class="d-manual"></i>${MODULE.metric === 'abai' ? 'Excel / Outlook' : 'Excel / Word / PDF, чат'}</span>
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
          ${v === baseVariant(num) ? `<a class="btn primary mt" href="#/p/${num}/flow/${sel.id}">Открыть шаг в процессе</a>` : ''}</div>`
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
  const vs = variantsOf(num), bv = baseVariant(num);
  const st = Object.fromEntries(vs.map((k) => [k, variantStats(num, k)]));
  const m = PROC_META[num];
  $('#view').innerHTML = `
    <div class="page-h"><div><div class="muted small">Сравнение вариантов по шагам</div><h1>${vs.map((k) => VARIANTS[k].name).join(' → ')}</h1></div></div>
    ${noDreamNote(num)}
    <div class="bpmn-note mb"><b>${hasDream(num) ? 'Dream TO BE' : 'Идея'}</b><span>${m.idea}</span></div>
    <div class="variants v${vs.length}">${vs.map((k) => { const x = VARIANTS[k]; return `<div class="card variant ${x.tone}"><div class="card-b">
      <div class="tag">${x.sub}</div><h2>${x.name}</h2>${pool(num, k).remark ? `<div class="small warn-t">в BPMN: ${esc(pool(num, k).remark)}</div>` : ''}
      <div class="stats mt-s" style="grid-template-columns:repeat(3,1fr)">
        <div class="stat"><div class="v">${st[k].steps}</div><div class="l">шагов</div></div>
        ${MODULE.metric === 'abai' ? `<div class="stat"><div class="v">${st[k].abaiSteps}</div><div class="l">шагов в ABAI</div></div>` : `<div class="stat"><div class="v ${st[k].manual ? 'crit-t' : 'good-t'}">${st[k].manual}</div><div class="l">ручная работа</div></div>`}
        <div class="stat"><div class="v">${k === 'nedra' ? st[k].nedra : st[k].abai}</div><div class="l">${k === 'nedra' ? 'решений Nedra' : 'модулей ABAI'}</div></div>
      </div>
      <a class="btn mt" href="#/p/${num}/bpmn/${k}">Открыть схему</a></div></div>`; }).join('')}</div>
    <div class="card mt"><div class="card-h"><h2>Системы и документы по шагам</h2><span class="muted small">шаги сопоставлены по номеру и названию из BPMN${MODULE.metric === 'abai' ? '' : ' · красным — Excel / Word / PDF и чат'}</span></div>
      <div class="tbl-scroll"><table class="t cmp"><thead><tr><th>Шаг</th><th>Роль</th>${vs.map((k) => `<th class="${k === bv ? 'dream-h' : ''}">${VARIANTS[k].name}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr class="${r.only ? 'onlyrow' : ''}"><td><b>${r.code || '—'}</b> ${esc(r.title)}${r[bv] && pool(num, 'asisn') && !r.asisn ? ' <span class="chip">детализация</span>' : ''}${r.only ? ` <span class="chip">только в ${VARIANTS[r.only].name}</span>` : ''}</td><td>${roleChip(r.lane)}</td>
        ${vs.map((k) => `<td>${r[k] ? sysList(r[k]) + (r[k].code && r[k].code !== r.code ? ` <span class="muted small">(${r[k].code})</span>` : '') : '—'}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div></div>`;
}

route();
