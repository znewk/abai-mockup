// Дерево ЦД: последовательный показ от верхнего уровня вглубь —
// вид → слои (этапы 1–5, как в плашке под схемой портала) → блоки (ЦД пласта, слой данных …) → системы → процессы BPMN → шаги → системы шага → …
// Элемент, уже встречавшийся выше, показывается в цепочке снова: так видна полная цепочка каждого процесса.
// Данные и механики — с портала (landscape*.js): связи, шаги BPMN, описания блоков по стратсессии, путь данных, «О системе», слайды.
// Принадлежность систем к блокам и их вид берутся со скрытой большой схемы портала (её рисует abaiLandscape) — единый источник со схемой.

const TR = { view: 'dream', depth: 3, node: null, grid: null, path: null, root: null };
const TR_TYPES = { view: 'Вид', layer: 'Слой', block: 'Блок', sys: 'Система', proc: 'Процесс BPMN', step: 'Шаг BPMN', mods: 'Раздел', mod: 'Модуль', in: 'Откуда данные', out: 'Куда данные', next: 'Дальше по процессу', end: 'Конец процесса' };
const TR_DEPTHS = [[2, 'до блоков'], [3, 'до систем'], [4, 'до процессов'], [5, 'до шагов']];
const trEsc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const trPlural = (n, a, b, c) => (n % 10 === 1 && n % 100 !== 11 ? a : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? b : c);

// ---------- Скрытая большая схема: кто в каком блоке, вид системы ----------
function trBuildGrid(view) {
  const h = document.getElementById('tr-hidden');
  abaiLandscape(h, view, null);
  TR.grid = h.querySelector('.ls-grid');
}
const trKind = (n) => { const a = lsAnchor(TR.grid, n); return a ? (a.classList.contains('ls-chip') ? (a.className.match(/k-(\w+)/) || [])[1] : 'user') : 'ext'; };
const trSysOf = (el) => [...new Set([...el.querySelectorAll('[data-sys]')].map((x) => x.dataset.sys))];
const trTrail = () => (typeof LS_TRAIL !== 'undefined' ? LS_TRAIL[TR.view] || [] : []);
// Все связи вида (одинаковые «откуда → куда» объединены)
function trEdges() {
  const m = new Map();
  (LS_FLOWS[TR.view] || []).forEach((f) => f.e.forEach(([a, z, w, r, k]) => { const id = a + '|' + z; if (!m.has(id)) m.set(id, { f: a, t: z, w, r, k, sc: [f.name] }); else { const e = m.get(id); if (!e.w.includes(w)) { e.w += '; ' + w; e.r += ' · ' + r; } if (!e.sc.includes(f.name)) e.sc.push(f.name); } }));
  return [...m.values()];
}
// Шаги BPMN, где указана система: [{ P, list }]
const trStepsOf = (key) => lsTrailOf(TR.view, key);

// ---------- Узлы дерева ----------
// Узел: { type, id, label, sub, parent, … }; путь (для адреса) — цепочка «тип:id» от корня
const trNode = (parent, type, id, label, extra = {}) => Object.assign({ parent, type, id: String(id), label, depth: parent ? parent.depth + 1 : 0, kids: null }, extra);
const trPath = (n) => (n.parent ? trPath(n.parent).concat(n.type + ':' + n.id) : []);

// Слои — этапы V.flow; блоки слоя — по месту этапа на схеме
function trLayers(root) {
  const V = LS_VIEWS[TR.view];
  const out = V.flow.map(([t, d, sel], i) => {
    const el = sel && TR.grid.querySelector(sel);
    return trNode(root, 'layer', i + 1, t, { num: i + 1, desc: d, anchor: el });
  });
  out.push(trNode(root, 'mods', 'bpmn', 'Процессы модулей (BPMN)', { desc: 'Модули мокапа → процессы → шаги BPMN → системы шага' }));
  return out;
}
function trBlocksOfLayer(L) {
  const g = TR.grid, el = L.anchor;
  if (!el) return [];
  const cont = el.closest('.ls-manual, .ls-twin, .ls-box, .ls-zone') || el.parentElement;
  const blk = (node, label, id) => ({ el: node, label, id });
  const boxLabel = (b) => { const h = b.querySelector(':scope > .ls-box-h, :scope > .ls-zone-h, :scope > .ls-twin-h'); return h ? lsHText(h) : ''; };
  let list = [];
  if (cont.matches('.ls-box.asu, .ls-box.mes')) {
    const z = cont.closest('.ls-zone.dzo');
    list = [z.querySelector('.ls-box.asu'), z.querySelector('.ls-cols > .ls-box:nth-child(2)'), z.querySelector('.ls-cols > .ls-box:nth-child(3)'), z.querySelector('.ls-box.prod'), z.querySelector('.ls-cols > .ls-box:nth-child(1)')].filter(Boolean).map((b) => blk(b, boxLabel(b)));
  } else if (cont.matches('.ls-zone.data')) {
    list = TR.view === 'asis' ? [...cont.querySelectorAll('.ls-box')].map((b) => blk(b, boxLabel(b))) : [blk(cont, lsHText(cont.querySelector(':scope > .ls-zone-h')), 'data'), blk(g.querySelector('.ls-box.ext'), boxLabel(g.querySelector('.ls-box.ext')), 'ext')];
  } else if (cont.matches('.ls-box.mods')) {
    list = [...cont.querySelectorAll('.ls-twin')].map((t) => blk(t, lsHText(t.querySelector('.ls-twin-h'))));
  } else if (cont.matches('.ls-zone.asis')) {
    list = [...cont.querySelectorAll(':scope > .ls-cols > .ls-box')].map((b) => blk(b, boxLabel(b))).concat(cont.querySelector('.ls-manual') ? [blk(cont.querySelector('.ls-manual'), 'Ручной обмен: файлы, почта, чат')] : []);
  } else if (cont.matches('.ls-manual')) {
    list = [blk(cont, 'Ручной обмен: файлы, почта, чат')];
  } else list = [blk(cont, boxLabel(cont))];
  return list.map((b, i) => {
    const h = b.el.querySelector(':scope > .ls-box-h, :scope > .ls-zone-h, :scope > .ls-twin-h');
    const B = h ? lsBlockOf(h) : null;
    const info = B && LS_BLOCKS[B.id] && !(TR.view === 'asis' && B.id === 'data') ? LS_BLOCKS[B.id] : null;
    return trNode(L, 'block', i + 1 + ':' + b.label, b.label, { el: b.el, info, keys: trSysOf(b.el) });
  });
}
// «Откуда данные» / «Куда данные» набора систем: внешние источники / получатели по связям схемы, по одной системе на узел
function trIO(parent, keys) {
  const F = trFlowsOf(keys), out = [];
  [['in', F.inn, (e) => e.f, '⬇ Откуда данные'], ['out', F.out, (e) => e.t, '⬆ Куда данные']].forEach(([type, list, peerOf, title]) => {
    if (!list.length) return;
    const peers = new Map();
    list.forEach((e) => { const k = peerOf(e); if (!peers.has(k)) peers.set(k, []); peers.get(k).push(e); });
    const g = trNode(parent, type, type, `${title} · ${peers.size}`, { edges: list, keys });
    g.kids = [...peers].map(([k, es]) => trNode(g, 'sys', k, k, { via: es, note: es.map((e) => (type === 'in' ? `→ ${e.t}: ${e.w}` : `${e.f} →: ${e.w}`)).join('; ') }));
    out.push(g);
  });
  return out;
}
function trKids(n) {
  if (n.kids) return n.kids;
  const T = trTrail();
  let k = [];
  if (n.type === 'view') k = trLayers(n);
  else if (n.type === 'layer') { const B = trBlocksOfLayer(n), io = trIO(n, [...new Set(B.flatMap((b) => b.keys))]); k = io.filter((g) => g.type === 'in').concat(B, io.filter((g) => g.type === 'out')); }
  else if (n.type === 'block') { const S = n.keys.map((x) => trNode(n, 'sys', x, x)), io = trIO(n, n.keys); k = io.filter((g) => g.type === 'in').concat(S, io.filter((g) => g.type === 'out')); }
  else if (n.type === 'sys') k = trIO(n, [n.id]).concat(trStepsOf(n.id).map(({ P, list }) => trNode(n, 'proc', P.p, `${P.p} ${P.t}`, { P, list })));
  else if (n.type === 'mods') k = LS_MODS.map((m) => trNode(n, 'mod', m.id, m.name, { sub: m.sub }));
  else if (n.type === 'mod') k = T.filter((P) => P.m === n.id).map((P) => trNode(n, 'proc', P.p, `${P.p} ${P.t}`, { P, list: P.s.map((s, i) => i) }));
  else if (n.type === 'proc') k = n.list.map((i) => { const s = n.P.s[i]; return trNode(n, 'step', s.c || 'i' + i, `${s.c || 'без номера'} ${s.t}`, { P: n.P, s }); });
  else if (n.type === 'step') {
    const ctx = trCtxSys(n);
    k = [trNextOf(n)].concat([...new Set(n.s.s.map(lsKey))].filter((x) => x !== ctx).map((x) => trNode(n, 'sys', x, x)));
  }
  n.kids = k;
  return k;
}
// Что дальше после шага по BPMN: следующие шаги процесса (у развилки — с условием), переход в смежный процесс
// (если он есть в мокапе — узлом процесса, по нему можно идти дальше) или конец процесса с итогом из BPMN
function trNextOf(n) {
  const nx = n.s.nx;
  if (!nx.length) return trNode(n, 'end', 'end', '■ Конец процесса', { why: 'после шага в BPMN других шагов нет' });
  const g = trNode(n, 'next', 'next', `➜ Дальше по процессу · ${nx.length}`);
  g.kids = nx.map(([x, cond], i) => {
    if (typeof x === 'number') { const s = n.P.s[x]; return trNode(g, 'step', s.c || 'i' + x, `${s.c || 'без номера'} ${s.t}`, { P: n.P, s, cond }); }
    const m = x.match(/^([ГРБД]\d+(?:\.\d+)?)\.?\s/), P = m && trTrail().find((q) => q.p === m[1]);
    if (P) return trNode(g, 'proc', P.p, `↪ ${P.p} ${P.t}`, { P, list: P.s.map((q, j) => j), jump: true, cond });
    if (m) return trNode(g, 'end', 'x' + i, `↪ ${x}`, { why: 'переход в смежный процесс — его нет в мокапе', cond });
    return trNode(g, 'end', 'e' + i, `■ ${x}`, { why: 'конец процесса — итог по BPMN', cond });
  });
  return g;
}
// Система, «через которую» пришли к узлу (ближайший предок-система; переход в смежный процесс начинает цепочку заново)
const trCtxSys = (n) => { for (let x = n.parent; x; x = x.parent) { if (x.type === 'sys') return x.id; if (x.type === 'proc' && x.jump) return null; } return null; };
// Дерево вида строится один раз (дети узлов считаются при первом раскрытии и запоминаются)
function trRoot() { if (!TR.root) TR.root = trNode(null, 'view', TR.view, LS_VIEWS[TR.view].name); return TR.root; }
// Адрес узла — части пути через «/», каждая закодирована: в названиях бывает «/» («ЦИО / ДЗО»)
const trKey = (n) => trPath(n).map(encodeURIComponent).join('/');
function trFind(path) {
  let n = trRoot();
  for (const seg of path) { const kid = trKids(n).find((k) => k.type + ':' + k.id === seg); if (!kid) break; n = kid; }
  return n;
}

// ---------- Последовательность показа: обход дерева по порядку на выбранную глубину ----------
function trNext(n) {
  const kids = n.depth < TR.depth ? trKids(n) : [];
  if (kids.length) return kids[0];
  for (let x = n; x.parent; x = x.parent) { const sib = trKids(x.parent); const i = sib.indexOf(x); if (i < sib.length - 1) return sib[i + 1]; }
  return null;
}
function trPrev(n) {
  if (!n.parent) return null;
  const sib = trKids(n.parent), i = sib.indexOf(n);
  if (i === 0) return n.parent;
  let x = sib[i - 1];
  for (;;) { const k = x.depth < TR.depth ? trKids(x) : []; if (!k.length) return x; x = k[k.length - 1]; }
}
function trOrder() {
  const out = []; let x = trRoot();
  while (x && out.length < 3000) { out.push(trKey(x)); x = trNext(x); }
  return out;
}

// ---------- Общие куски разметки ----------
const trSys = (n) => `<a href="#" class="tr-s k-${trKind(n)}" data-go-sys="${trEsc(n)}">${trEsc(n)}</a>`;
const trSrc = (s) => (s ? `<em class="ls-bk-src">${s}</em>` : '');
const trList = (t, l, s) => (l && l.length ? `<h3>${t}${trSrc(s)}</h3><ul class="ls-bk-l">${l.map(([x, y]) => `<li>${x}${y ? trSrc(y) : ''}</li>`).join('')}</ul>` : '');
const trEdgeLi = (e, mark) => `<li><b class="ar">${mark || '→'}</b>${trSys(e.f)} → ${trSys(e.t)} — ${e.w}<em>${LS_KINDS[e.k]} · ${e.r}${e.sc ? ' · ' + e.sc.join(', ') : ''}</em>${lsRefSlides(TR.view, e.r)}</li>`;
// Что приходит в набор систем и что уходит из него (связи схемы)
function trFlowsOf(keys) {
  const inK = (x) => keys.includes(x), E = trEdges();
  return { inn: E.filter((e) => !inK(e.f) && inK(e.t)), out: E.filter((e) => inK(e.f) && !inK(e.t)), inside: E.filter((e) => inK(e.f) && inK(e.t)) };
}
// Кто пользуется (исполнители шагов BPMN, где указаны системы) и как (процессы)
function trUsage(keys) {
  const orgs = new Map(), procs = new Map();
  trTrail().forEach((P) => P.s.forEach((s) => {
    const hit = s.s.map(lsKey).filter((x) => keys.includes(x));
    if (!hit.length) return;
    const cat = lsOrgCat(s.o || s.r), role = lsRole(s);
    if (!orgs.has(cat)) orgs.set(cat, new Map());
    orgs.get(cat).set(role, (orgs.get(cat).get(role) || 0) + 1);
    if (!procs.has(P.p)) procs.set(P.p, { P, n: 0, sys: new Set() });
    const q = procs.get(P.p); q.n++; hit.forEach((x) => q.sys.add(x));
  }));
  return { orgs, procs: [...procs.values()] };
}
function trUsageHTML(keys) {
  const U = trUsage(keys);
  if (!U.procs.length) return '';
  const order = LS_ORGS.map((x) => x[1]).concat('Другие участники');
  const max = Math.max(...U.procs.map((q) => q.n));
  return `<div class="tr-c2">
    <div><h3>Кто пользуется <span>исполнители шагов BPMN</span></h3><div class="tr-orgs">
      ${[...U.orgs].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0])).map(([c, m]) => `<div class="tr-org"><b>${c}</b>${[...m].sort((a, b) => b[1] - a[1]).map(([r, k]) => `<span>${trEsc(r)} <em>${k}</em></span>`).join('')}</div>`).join('')}</div></div>
    <div><h3>Как пользуется <span>процессы BPMN · полоса — число шагов</span></h3>
      <div class="tr-bars">${U.procs.sort((a, b) => b.n - a.n).map((q) => `<div title="${trEsc(q.P.t)}${keys.length > 1 ? ' · ' + [...q.sys].join(', ') : ''}"><b>${q.P.p}</b><span>${trEsc(q.P.t)}</span><i style="width:${Math.max(6, (q.n / max) * 100)}%"></i><em>${q.n}</em></div>`).join('')}</div></div>
  </div>`;
}
// Схемы «откуда → блок → куда» (trBlockScheme): разметка — в теле узла, отрисовка — после вставки
const TR_SCHEMES = [];
function trFlowsHTML(keys, title, label) {
  const F = trFlowsOf(keys);
  if (!F.inn.length && !F.out.length && !F.inside.length) return '<p class="tr-n">В потоках данных на схеме эти системы не участвуют.</p>';
  // Блок — полосой посередине (как окно «Связи системы» на портале): у каждого источника и получателя своя стрелка;
  // связи с одной и той же системой снаружи объединены, в подписи — какая система блока принимает / отдаёт
  TR_SCHEMES.push({ label, title: `${TR_TYPES[TR.node.type]} · ${label}`, inn: F.inn, out: F.out });
  return `<div class="tr-fs" data-fs="${TR_SCHEMES.length - 1}"><div class="ls-focus"></div></div>
    <details class="tr-more"><summary>Связи списком: получает ${F.inn.length}, передаёт ${F.out.length}${F.inside.length ? `, внутри ${F.inside.length}` : ''}</summary><div class="tr-c2">
      <div><h3>Откуда получает и какие данные <em class="ls-bk-n">${F.inn.length}</em></h3><ul class="ls-ab-l">${F.inn.map((e) => trEdgeLi(e, '←')).join('') || '<li class="tr-n">—</li>'}</ul></div>
      <div><h3>Куда и какие данные передаёт <em class="ls-bk-n">${F.out.length}</em></h3><ul class="ls-ab-l">${F.out.map((e) => trEdgeLi(e, '→')).join('') || '<li class="tr-n">—</li>'}</ul></div>
    </div>${F.inside.length ? `<h3>Внутри ${title || 'блока'} <em class="ls-bk-n">${F.inside.length}</em></h3><ul class="ls-ab-l">${F.inside.map((e) => trEdgeLi(e, '↔')).join('')}</ul>` : ''}</details>`;
}
function trBlockInfoHTML(D) {
  if (!D) return '';
  return `<div class="tr-what">${D.what.map(([t, src]) => `<p>${t}${trSrc(src)}</p>`).join('')}</div>
    ${D.asis || D.use ? `<div class="tr-c2 tr-pair">${D.asis ? `<div class="tr-box asis"><b>Как сейчас (AS IS)</b>${D.asis.map(([t, src]) => `<p>${t}${trSrc(src)}</p>`).join('')}</div>` : '<div></div>'}${D.use ? `<div class="tr-box use"><b>Где применяется</b>${D.use.map(([t, src]) => `<p>${t}${trSrc(src)}</p>`).join('')}</div>` : ''}</div>` : ''}
    ${D.cycle ? `<h3>Цикл работы с моделью${trSrc(D.cycleSrc)}</h3><ol class="ls-bk-cy">${D.cycle.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>` : ''}
    ${D.roles ? `<h3>Роли${trSrc(D.rolesSrc)}</h3><div class="ls-bk-r">${D.roles.map(([t, d]) => `<div><b>${t}</b><span>${d}</span></div>`).join('')}</div>` : ''}
    ${D.mods ? `<h3>Модули ABAI и что они делают</h3><ul class="ls-bk-l">${D.mods.map(([t, d, s]) => `<li><b>${t}</b> — ${d}${trSrc(s)}</li>`).join('')}</ul>` : ''}
    ${D.deploy || D.terms ? `<details class="tr-more"><summary>Внедрение и сокращения</summary>${trList('Внедрение', D.deploy)}${D.terms ? `<h3>Сокращения</h3><dl class="ls-bk-t">${D.terms.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>` : ''}</details>` : ''}`;
}
// ---------- Содержимое узла ----------
function trBody(n) {
  const V = LS_VIEWS[TR.view];
  if (n.type === 'view') {
    const L = trKids(n).filter((x) => x.type === 'layer');
    return `<p class="tr-lead">${V.lead}</p>
      <h3>Слои по ходу данных <span>читается снизу вверх: внизу — откуда данные приходят, вверху — куда уходят; клик — внутрь слоя</span></h3>
      <div class="ls-railed tr-stack-w"><div class="ls-rail"><span>куда</span><i></i><span>откуда</span></div><div class="tr-stack">${L.slice().reverse().map((x) => `<button class="tr-layer" data-kid="${trEsc(x.type + ':' + x.id)}"><i class="ls-stage">${x.num}</i><b>${trEsc(x.label)}</b><span>${trEsc(x.desc)}</span><em>${trBlocksOfLayer(x).map((b) => trEsc(b.label)).join(' · ')}</em></button>`).join('<div class="tr-up">↑</div>')}</div></div>`;
  }
  if (n.type === 'layer') {
    const B = trKids(n).filter((x) => x.type === 'block'), keys = [...new Set(B.flatMap((b) => b.keys))];
    return `<p class="tr-lead"><i class="ls-stage">${n.num}</i>${trEsc(n.desc)}</p>
      <h3>Откуда приходят данные в слой и куда уходят <span>снизу — кто передаёт данные и в какую систему слоя, сверху — из какой системы и кому</span></h3>${trFlowsHTML(keys, 'слоя', n.label)}${trUsageHTML(keys)}`;
  }
  if (n.type === 'block') {
    return `${n.info ? trBlockInfoHTML(n.info) : '<p class="tr-n">Описания этого блока в стратсессии нет — ниже системы блока, их связи и использование по BPMN.</p>'}
      <h3>Данные блока: откуда и куда <span>снизу — кто передаёт данные и в какую систему блока, сверху — из какой системы и кому</span></h3>${trFlowsHTML(n.keys, 'блока', n.label)}${trUsageHTML(n.keys)}`;
  }
  if (n.type === 'sys') {
    const links = lsLinksOf(TR.view, n.id);
    const st = trStepsOf(n.id), desc = Object.entries(typeof ABAI_SYS_DESC !== 'undefined' ? ABAI_SYS_DESC : {}).filter(([x]) => lsKey(x) === n.id).flatMap(([, l]) => l);
    return `${desc.length ? `<div class="tr-what">${[...new Map(desc.map((d) => [d[1], d])).values()].map(([m, d]) => `<p><b>${LS_MOD_NAME[m] || m}:</b> ${d}</p>`).join('')}</div>` : ''}
      ${links.length ? '<h3>Путь данных <span>по сценариям потоков · снизу — откуда данные приходят, сверху — куда уходят · «Проиграть путь» — по этапам</span></h3><div class="tr-path"></div>' : '<p class="tr-n">В потоках данных на схеме система не участвует.</p>'}
      ${trUsageHTML([n.id])}
      <details class="tr-more"><summary>Подробно о системе: откуда и куда, по процессам и сценариям, реестр задействованных систем</summary><div class="tr-about">${lsAbout(TR.grid, n.id, TR.view, links, st)}</div></details>`;
  }
  if (n.type === 'in' || n.type === 'out') {
    const label = n.parent.label, inn = n.type === 'in';
    TR_SCHEMES.push({ label, title: `${TR_TYPES[n.parent.type]} · ${label}`, inn: inn ? n.edges : [], out: inn ? [] : n.edges });
    return `<p class="tr-lead">${inn ? `Кто передаёт данные в «${trEsc(label)}» и какие` : `Кому «${trEsc(label)}» передаёт данные и какие`} — по связям схемы. Клик по системе на схеме или в дереве — её «откуда / куда» и процессы: так цепочку данных можно пройти дальше.</p>
      <div class="tr-fs" data-fs="${TR_SCHEMES.length - 1}"><div class="ls-focus"></div></div>
      <h3>Списком <em class="ls-bk-n">${n.edges.length}</em></h3><ul class="ls-ab-l">${n.edges.map((e) => trEdgeLi(e, inn ? '←' : '→')).join('')}</ul>`;
  }
  if (n.type === 'next') {
    return `<p class="tr-lead">Что происходит после шага ${trEsc(n.parent.s.c || '')} «${trEsc(n.parent.s.t)}» по BPMN${n.kids.length > 1 ? ' — несколько вариантов: развилка или параллельные шаги' : ''}.</p>
      <div class="tr-nexts">${n.kids.map((k) => `<button class="tr-nx t-${k.type}" data-kid="${trEsc(k.type + ':' + k.id)}">${k.cond ? `<i>если «${trEsc(k.cond)}»</i>` : ''}<b>${trEsc(k.label)}</b><span>${trEsc(trSub(Object.assign({}, k, { cond: '' })))}</span></button>`).join('')}</div>`;
  }
  if (n.type === 'end') return `<p class="tr-lead">${trEsc(n.label.replace(/^[■↪]\s*/, ''))}</p><p class="tr-n">${trEsc(n.why)}${n.cond ? ` · условие: «${trEsc(n.cond)}»` : ''}. Дальше по этой ветке процесса шагов нет — вернуться можно «Назад» или кликом по узлу выше на дереве.</p>`;
  if (n.type === 'proc') return trProcHTML(n);
  if (n.type === 'step') return trStepHTML(n);
  if (n.type === 'mods') return `<p class="tr-lead">${trEsc(n.desc)}. Модули — по цепочке «Геология → Разработка → Бурение → Добыча».</p>`;
  if (n.type === 'mod') { const P = trKids(n); return `<p class="tr-lead">${trEsc(n.sub)} · ${P.length} ${trPlural(P.length, 'процесс', 'процесса', 'процессов')} в виде ${V.name}</p>${trUsageHTML([...new Set(P.flatMap((p) => p.P.s.flatMap((s) => s.s.map(lsKey))))])}`; }
  return '';
}
// Процесс: полная цепочка шагов (шаги текущей системы выделены), что система делает здесь и что получает / отдаёт
function trProcHTML(n) {
  const P = n.P, ctx = n.jump ? null : trCtxSys(n), mine = new Set(n.list);
  const anyV = P.s.find((s) => s.v);
  const links = ctx ? lsLinksOf(TR.view, ctx).filter((e) => (e.refs || [e.r]).some((r) => lsRefParts(r).some((p) => p.proc === P.p))) : [];
  const chain = P.s.map((s, i) => `<button class="tr-ch${mine.has(i) && ctx ? ' me' : ''}${mine.has(i) ? '' : ' other'}" data-chstep="${i}"><b>${s.c || '—'}</b><span>${trEsc(s.t)}</span><em>${trEsc(lsRole(s))}${s.s.length ? ' · ' + trEsc(s.s.join(', ')) : ''}</em></button>`).join('<i class="tr-ar">→</i>');
  const notes = ctx ? [...new Set(n.list.flatMap((i) => P.s[i].n.filter((t) => t.includes(ctx.replace(/^(ABAI|SLB)\s+/, '').replace(/\s+2\.0$/, '')))))] : [];
  return `<p class="tr-lead">${LS_MOD_NAME[P.m]} · ${P.s.length} ${trPlural(P.s.length, 'шаг', 'шага', 'шагов')} BPMN в виде ${LS_VIEWS[TR.view].name}${ctx ? ` · с «${trEsc(ctx)}» — ${n.list.length}` : ''}
      ${anyV ? `<a class="ls-slide" href="${lsModHref(P.m, 'v2')}index.html#${anyV.v[0]}/1/all" target="_blank">презентация процесса ↗</a>` : ''}<a class="ls-slide" href="${lsProtoHref(P, P.s[n.list[0]] || P.s[0])}" target="_blank">прототип ↗</a></p>
    ${notes.length ? `<h3>Что «${trEsc(ctx)}» делает в процессе <span>аннотации шагов BPMN</span></h3><ul class="ls-bk-l">${notes.map((t) => `<li>${trEsc(t)}</li>`).join('')}</ul>` : ''}
    ${links.length ? `<h3>Данные «${trEsc(ctx)}» в этом процессе</h3><ul class="ls-ab-l">${links.map((e) => trEdgeLi(e, e.t === ctx ? '←' : '→')).join('')}</ul>` : ''}
    <h3>Полная цепочка процесса <span>шаги по номерам BPMN${ctx ? ` · выделены шаги с «${trEsc(ctx)}»` : ''} · клик по любому шагу — внутрь шага</span></h3>
    <div class="tr-chain">${chain}</div>${trUsageHTML(ctx ? [ctx] : [...new Set(P.s.flatMap((s) => s.s.map(lsKey)))])}`;
}
// Шаг: до / после, системы шага с аннотациями, документы, связи схемы на этом шаге, слайд презентации
function trStepHTML(n) {
  const P = n.P, s = n.s;
  const nb = (x) => (typeof x[0] !== 'number' ? `<div class="tr-nb ev">${trEsc(x[0])}</div>` : (() => { const q = P.s[x[0]]; return `<div class="tr-nb"><b>${q.c || '—'}</b> ${trEsc(q.t)}<span>${trEsc(lsRole(q))}${q.s.length ? ' · ' + trEsc(q.s.join(', ')) : ''}</span>${x[1] ? `<q>${trEsc(x[1])}</q>` : ''}</div>`; })());
  const short = (x) => x.replace(/^(ABAI|SLB)\s+/, '');
  const notesOf = new Map(s.s.map((x) => [x, []])), rest = [];
  s.n.forEach((t) => { const hit = s.s.find((x) => t.includes(x) || t.includes(short(x))); if (hit) notesOf.get(hit).push(t); else rest.push(t); });
  const flows = trEdges().filter((e) => lsRefParts(e.r).some((p) => p.proc === P.p && (p.codes || []).some((c) => c === s.c || s.c.startsWith(c + '.'))));
  return `<div class="tr-step">
      <div class="tr-sw"><i>до</i><div>${s.pv.length ? s.pv.map(nb).join('') : '<div class="tr-nb ev">начало процесса</div>'}</div></div>
      <div class="tr-scur"><div class="tr-scur-r">${trEsc(lsRole(s))}</div><div class="tr-scur-t"><b>${s.c || 'без номера'}</b>${trEsc(s.t)}</div>
        <div class="ls-scur-s">${s.s.map((x) => { const from = lsKey(x) === trCtxSys(n); return `<div class="ls-ssys k-${trKind(lsKey(x))}${from ? ' from' : ''}"><b>${trSys(lsKey(x))}</b>${from ? '<em class="tr-from">↑ вы пришли из этой системы</em>' : ''}${notesOf.get(x).map((t) => `<q>${trEsc(t)}</q>`).join('')}</div>`; }).join('') || '<span class="tr-n">систем в шаге нет</span>'}</div>
        ${s.d.length ? `<div class="ls-scur-d"><i>документы</i>${trEsc(s.d.join('; '))}</div>` : ''}${rest.map((t) => `<q>${trEsc(t)}</q>`).join('')}</div>
      <div class="tr-sw"><i>после</i><div>${s.nx.length ? s.nx.map(nb).join('') : '<div class="tr-nb ev">конец процесса</div>'}</div></div>
    </div>
    ${flows.length ? `<h3>Связи схемы на этом шаге <em class="ls-bk-n">${flows.length}</em></h3><ul class="ls-ab-l">${flows.map((e) => trEdgeLi(e)).join('')}</ul>` : '<p class="tr-n">В потоках данных на схеме этот шаг не показан — данные между системами по BPMN.</p>'}
    <h3>Как выглядит в ABAI ${s.v ? `<span>слайд «${trEsc(s.v[2])}», действие ${s.v[3]}</span>` : ''}</h3>
    ${TR.view !== 'dream' ? '<p class="tr-n">Презентации и прототипы построены по Dream TO BE — переключите вид, чтобы увидеть экраны шага.</p>'
      : `<p class="tr-links">${s.v ? `<a class="ls-slide" href="${lsSlideHref(P, s)}" target="_blank">Открыть в презентации ↗</a>` : '<span class="tr-n">этого шага нет в быстром сценарии презентации</span> '}<a class="ls-slide" href="${lsProtoHref(P, s)}" target="_blank">Шаг в прототипе ↗</a></p>
        ${s.v ? `<div class="ls-st-frame"><iframe src="${lsSlideHref(P, s)}" title="Слайд презентации" loading="lazy"></iframe></div>` : ''}`}`;
}

// Схема блока / слоя: посередине — рамка блока с его частями (ЦД пласта, ЦД скважины …) и системами, которые участвуют в обмене;
// снизу — источники, сверху — получатели. Каждая связь — своя колонка и своя стрелка: от источника прямо в систему внутри блока
// (или из неё — к получателю); на подписи — куда именно («→ в ABAI ЦРНС 2.0 · ЦД пласта»), что передаётся, кто и шаг BPMN.
function trBlockScheme(host, S, o = {}) {
  const COL = 172, LW = 162, NH = 42, IW = 160, IG = 12, GP = 10, GH = 20, GG = 18, CUR = 42, M = 14, OT = 26;
  const grpOf = (n) => lsGroup(lsAnchor(TR.grid, n), TR.view).title;
  const kindOf = (n) => trKind(n);
  // Связи «внешняя система ↔ система блока»: одинаковые пары объединены
  const pairs = (list, ext, inner) => {
    const m = new Map();
    list.forEach((e) => { const k = ext(e) + '|' + inner(e); if (!m.has(k)) m.set(k, { ext: ext(e), inner: inner(e), w: [], r: [], refs: [], k: e.k, f: e.f, t: e.t }); const q = m.get(k); if (!q.w.includes(e.w)) q.w.push(e.w); q.r.push(e.r); q.refs.push(e.r); });
    return [...m.values()].map((q) => Object.assign(q, { w: q.w.join('; '), r: q.r.join(' · ') }));
  };
  const I = pairs(S.inn, (e) => e.f, (e) => e.t), O = pairs(S.out, (e) => e.t, (e) => e.f);
  if (!I.length && !O.length) { host.innerHTML = ''; return; }
  // ---- Порядок: системы блока по группам, колонки связей — по источнику / получателю, всё — по соседям (меньше пересечений) ----
  const inner = [...new Set(I.map((x) => x.inner).concat(O.map((x) => x.inner)))].map((n, i) => ({ n, g: grpOf(n), pos: i }));
  const byN = new Map(inner.map((x) => [x.n, x]));
  const cols = (E) => {
    const ext = new Map();
    E.forEach((e) => { if (!ext.has(e.ext)) ext.set(e.ext, []); ext.get(e.ext).push(e); });
    return [...ext.values()].map((l) => ({ l: l.sort((a, b) => byN.get(a.inner).pos - byN.get(b.inner).pos), m: l.reduce((s, e) => s + byN.get(e.inner).pos, 0) / l.length }))
      .sort((a, b) => a.m - b.m).flatMap((x) => x.l);
  };
  let CI = cols(I), CO = cols(O);
  for (let it = 0; it < 4; it++) {
    const at = new Map(inner.map((x) => [x.n, []]));
    const nb = CI.length || 1, no = CO.length || 1, ni = inner.length;
    CI.forEach((e, j) => at.get(e.inner).push(((j + 0.5) / nb) * ni));
    CO.forEach((e, j) => at.get(e.inner).push(((j + 0.5) / no) * ni));
    inner.forEach((x) => { const a = at.get(x.n); x.m = a.length ? a.reduce((s, v) => s + v, 0) / a.length : x.pos; });
    const groups = [...new Set(inner.map((x) => x.g))].map((g) => ({ g, l: inner.filter((x) => x.g === g) })).map((G) => Object.assign(G, { m: G.l.reduce((s, x) => s + x.m, 0) / G.l.length }));
    groups.sort((a, b) => a.m - b.m);
    let k = 0; groups.forEach((G) => G.l.sort((a, b) => a.m - b.m).forEach((x) => { x.pos = k++; }));
    inner.sort((a, b) => a.pos - b.pos);
    CI = cols(I); CO = cols(O);
  }
  const groups = [...new Set(inner.map((x) => x.g))].map((g) => ({ g, l: inner.filter((x) => x.g === g) }));
  // ---- Геометрия ----
  groups.forEach((G) => { G.w = G.l.length * IW + (G.l.length - 1) * IG + 2 * GP; });
  const midW = groups.reduce((s, G) => s + G.w, 0) + (groups.length - 1) * GG + 2 * GP;
  const W = Math.max(CI.length * COL, CO.length * COL, midW) + 2 * M;
  const hT = CO.map((e, j) => (o._h && o._h.t[j]) || 70), hB = CI.map((e, j) => (o._h && o._h.b[j]) || 70);
  const yT = M, gapT = CO.length ? Math.max(...hT) + 14 + 2 * CUR : 0;
  const yM = CO.length ? yT + NH + gapT : M;
  const yG = yM + OT + GP, yI = yG + GH, frameH = OT + GP + GH + NH + GP + GP;
  const yB = yM + frameH + (CI.length ? Math.max(...hB) + 14 + 2 * CUR : 0);
  const H = CI.length ? yB + NH + M : yM + frameH + M;
  let gx = (W - midW) / 2 + GP;
  groups.forEach((G) => { G.x = gx; G.l.forEach((x, i) => { x.x = gx + GP + i * (IW + IG); }); gx += G.w + GG; });
  const colX0 = (n) => (W - n * COL) / 2;
  CI.forEach((e, j) => { e.cx = colX0(CI.length) + j * COL + COL / 2; });
  CO.forEach((e, j) => { e.cx = colX0(CO.length) + j * COL + COL / 2; });
  // Точки крепления на системах блока — по ширине узла, в порядке колонок
  inner.forEach((x) => {
    [[CI, 'pb'], [CO, 'pt']].forEach(([C, key]) => { const l = C.filter((e) => e.inner === x.n); l.forEach((e, i) => { e[key] = x.x + (IW * (i + 1)) / (l.length + 1); }); });
  });
  // Внешние системы: узел над / под своими колонками
  const extNodes = (C, y) => { const out = []; C.forEach((e, j) => { const last = out[out.length - 1]; if (last && last.n === e.ext) last.j1 = j; else out.push({ n: e.ext, j0: j, j1: j, y, C }); }); return out; };
  const EB = extNodes(CI, yB), ET = extNodes(CO, yT);
  // ---- Разметка ----
  const mk = (k, c) => `<marker id="trbA-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${c}"/></marker>`;
  let paths = '', labels = '';
  const lbl = (e, j, dir, top) => {
    const who = lsWho(Object.assign({}, e, { refs: e.refs }), TR.view);
    return `<div class="tr-bl k-${e.k}" data-${dir}="${j}" style="left:${e.cx - LW / 2}px;top:${top}px;width:${LW}px">
      <i>${dir === 'b' ? `→ в <b>${trEsc(e.inner)}</b>` : `из <b>${trEsc(e.inner)}</b> →`}<small>${trEsc(byN.get(e.inner).g)}</small></i>
      <span>${trEsc(e.w)}</span>${who ? `<em class="ls-who">кто: ${trEsc(who)}</em>` : ''}<em>${trEsc(e.r)}</em></div>`;
  };
  CI.forEach((e, j) => {
    const top = yB - 14 - hB[j], yIn = yI + NH;
    paths += `<path class="k-${e.k}" d="M${e.cx},${yB} L${e.cx},${top} C${e.cx},${top - CUR} ${e.pb},${yIn + CUR} ${e.pb},${yIn}" marker-end="url(#trbA-${e.k})"/>`;
    labels += lbl(e, j, 'b', top);
  });
  CO.forEach((e, j) => {
    const top = yT + NH + 14, bot = top + hT[j];
    paths += `<path class="k-${e.k}" d="M${e.pt},${yI} C${e.pt},${yI - CUR} ${e.cx},${bot + CUR} ${e.cx},${bot} L${e.cx},${yT + NH}" marker-end="url(#trbA-${e.k})"/>`;
    labels += lbl(e, j, 't', top);
  });
  // Внешним системам — подпись их места на схеме ЦД; системам блока она не нужна: она на рамке
  const node = (n, x, y, w, cls) => `<div class="ls-fnode k-${kindOf(n)} tr-click ${cls || ''}" data-n="${trEsc(n)}" title="Открыть в дереве" style="left:${x}px;top:${y}px;width:${w}px;height:${NH}px">${cls === 'tr-ext' ? `<span>${trEsc(grpOf(n))}</span>` : ''}<b>${trEsc(n)}</b></div>`;
  const extHTML = EB.concat(ET).map((q) => { const x0 = colX0(q.C.length) + q.j0 * COL + 6, x1 = colX0(q.C.length) + (q.j1 + 1) * COL - 6; return node(q.n, x0, q.y, x1 - x0, 'tr-ext'); }).join('');
  const titleOf = (G) => (G.g === S.label ? '' : G.g);
  host.innerHTML = `<div class="ls-fcanvas tr-bs v-${TR.view}" style="width:${W}px;height:${H}px">
    <div class="tr-bf" style="left:${(W - midW) / 2}px;top:${yM}px;width:${midW}px;height:${frameH}px"><span>${trEsc(S.title || S.label)}</span></div>
    ${groups.filter((G) => titleOf(G)).map((G) => `<div class="ls-fgrp g-cd" style="left:${G.x}px;top:${yG}px;width:${G.w}px;height:${GH + NH + GP}px"><span>${trEsc(titleOf(G))}</span></div>`).join('')}
    <svg width="${W}" height="${H}"><defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}${mk('pub', '#0e7490')}</defs>${paths}</svg>
    ${inner.map((x) => node(x.n, x.x, yI, IW, 'tr-inn')).join('')}${extHTML}
    <div class="tr-bls">${labels}</div>
  </div>`;
  // Второй проход: подписи по их реальной высоте
  if (!o._h) {
    const h = { t: [], b: [] };
    host.querySelectorAll('.tr-bl').forEach((x) => { if (x.dataset.b !== undefined) h.b[+x.dataset.b] = x.offsetHeight; else h.t[+x.dataset.t] = x.offsetHeight; });
    return trBlockScheme(host, S, Object.assign({}, o, { _h: h }));
  }
  host.querySelectorAll('.ls-fnode[data-n]').forEach((x) => (x.onclick = () => trGoSys(x.dataset.n)));
  lsRail(host);
}

// ---------- Отрисовка: дерево схемой (колонки уровней слева направо, линии от родителя к детям) и карточка узла ----------
function trSub(k) {
  if (k.type === 'view') return LS_VIEWS[TR.view].sub;
  if (k.type === 'layer') return k.desc;
  if (k.type === 'block') return `${k.keys.length} ${trPlural(k.keys.length, 'система', 'системы', 'систем')}${k.info ? ' · описание по стратсессии' : ''}`;
  if (k.type === 'in' || k.type === 'out') return k.kids.map((x) => x.id).join(', ');
  if (k.type === 'next') return k.kids.map((x) => (x.type === 'step' ? x.s.c : x.type === 'proc' ? x.P.p : 'конец')).join(', ');
  if (k.type === 'end') return k.why;
  if (k.type === 'step' && k.cond) return `«${k.cond}» · ${lsRole(k.s)}`;
  if (k.type === 'proc' && k.jump) return `переход в смежный процесс · ${LS_MOD_NAME[k.P.m]} · ${k.list.length} шагов`;
  if (k.type === 'sys' && k.note) return k.note;
  if (k.type === 'sys') { const st = trStepsOf(k.id), n = st.reduce((s, x) => s + x.list.length, 0), l = lsLinksOf(TR.view, k.id).length; return `${n} ${trPlural(n, 'шаг', 'шага', 'шагов')} · ${st.length} ${trPlural(st.length, 'процесс', 'процесса', 'процессов')} · ${l} ${trPlural(l, 'связь', 'связи', 'связей')}`; }
  if (k.type === 'proc') return `${LS_MOD_NAME[k.P.m]} · ${k.list.length} ${trPlural(k.list.length, 'шаг', 'шага', 'шагов')}`;
  if (k.type === 'step') return `${lsRole(k.s)}${k.s.s.length ? ' · ' + k.s.s.join(', ') : ''}`;
  if (k.type === 'mod') return k.sub;
  if (k.type === 'mods') return k.desc;
  return '';
}
function trCanvas(host, chain, kids) {
  const W = 236, H = 56, G = 8, CG = 70, P = 14;
  const cols = chain.map((x, i) => (i ? trKids(chain[i - 1]) : [x]));
  if (kids.length) cols.push(kids);
  const pos = new Map();
  cols.forEach((col, i) => {
    const pc = i ? pos.get(chain[i - 1]).y + H / 2 : 0;
    const h = col.length * (H + G) - G;
    col.forEach((x, j) => pos.set(x, { x: P + i * (W + CG), y: pc - h / 2 + j * (H + G) }));
  });
  const ys = [...pos.values()].map((q) => q.y), minY = Math.min(...ys);
  pos.forEach((q) => (q.y += P + 18 - minY)); // сверху — подписи колонок
  const CW = P * 2 + cols.length * W + (cols.length - 1) * CG, CH = Math.max(...[...pos.values()].map((q) => q.y)) + H + P;
  const last = kids.length ? cols.length - 1 : -1;
  let lines = '', nodes = '';
  cols.forEach((col, i) => {
    const par = i ? chain[i - 1] : null, pp = par && pos.get(par);
    col.forEach((x) => {
      const q = pos.get(x), on = chain.includes(x), isNew = i === last;
      if (pp) {
        const x0 = pp.x + W, y0 = pp.y + H / 2, x1 = q.x, y1 = q.y + H / 2;
        lines += `<path class="${on ? 'on' : isNew ? 'new' : 'off'}" d="M${x0},${y0} C${x0 + CG / 2},${y0} ${x1 - CG / 2},${y1} ${x1},${y1}"/>`;
      }
      const kind = x.type === 'sys' ? ` k-${trKind(x.id)}` : '';
      nodes += `<button class="tr-nd t-${x.type}${kind}${x === TR.node ? ' cur' : on ? ' sel' : isNew ? ' new' : ' dim'}" style="left:${q.x}px;top:${q.y}px;width:${W}px;height:${H}px" data-path="${trEsc(trKey(x))}" title="${trEsc(x.label)}">
        ${x.num ? `<i class="ls-stage">${x.num}</i>` : x.type === 'sys' ? `<i class="tr-dot k-${trKind(x.id)}"></i>` : ''}<b>${trEsc(x.type === 'view' ? 'Дерево ЦД · ' + x.label : x.label)}</b><span>${trEsc(trSub(x))}</span></button>`;
    });
  });
  host.style.width = CW + 'px'; host.style.height = CH + 'px';
  host.innerHTML = `<svg width="${CW}" height="${CH}">${lines}</svg>${nodes}<div class="tr-cv-l">${cols.map((col, i) => { const cnt = {}; col.forEach((x) => (cnt[x.type] = (cnt[x.type] || 0) + 1)); const t = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0][0]; return `<span style="left:${P + i * (W + CG)}px">${TR_TYPES[t]}${cnt[t] > 1 ? ` · ${cnt[t]}` : ''}</span>`; }).join('')}</div>`;
  // Текущий узел — в поле зрения
  const box = host.parentElement, cur = pos.get(TR.node);
  box.scrollLeft = Math.max(0, cur.x + W + (kids.length ? CG + W : 0) - box.clientWidth + 30);
  box.scrollTop = Math.max(0, cur.y + H / 2 - box.clientHeight / 2);
}
function trRender() {
  const n = TR.node;
  const chain = []; for (let x = n; x; x = x.parent) chain.unshift(x);
  const order = trOrder(), pos = order.indexOf(trKey(n));
  const kids = trKids(n);
  TR_SCHEMES.length = 0;
  document.querySelector('.tr-main').innerHTML = `
    <div class="tr-cv"><div class="tr-cv-in"></div></div>
    <div class="tr-detail">
      <div class="tr-crumbs">${chain.map((x, i) => `${i ? '<i>›</i>' : ''}<a href="#" data-path="${trEsc(trKey(x))}">${trEsc(x.type === 'view' ? 'Дерево ЦД · ' + x.label : x.label)}</a>`).join('')}</div>
      <div class="tr-head"><span class="tr-type t-${n.type}">${TR_TYPES[n.type]}${n.type === 'sys' ? ` · ${trEsc(lsGroup(lsAnchor(TR.grid, n.id), TR.view).title)}` : ''}</span>
        <h1>${n.num ? `<i class="ls-stage">${n.num}</i>` : ''}${trEsc(n.type === 'view' ? 'Дерево ЦД · ' + n.label : n.label)}</h1>
        ${pos >= 0 ? `<span class="tr-pos">${pos + 1} из ${order.length} в показе ${TR_DEPTHS.find((d) => d[0] === TR.depth)[1]}</span>` : '<span class="tr-pos">вне показа выбранной глубины</span>'}</div>
      <div class="tr-content">${trBody(n)}</div>
      ${!kids.length && n.type === 'step' ? `<p class="tr-hint">В этом шаге BPMN указана только «${trEsc(trCtxSys(n) || '')}» — других систем нет, дальше по шагу идти некуда. Вернуться — «Назад» или клик по узлу выше на дереве; соседние шаги — в цепочке процесса.</p>` : ''}
      ${kids.length ? `<p class="tr-hint">Внутри — ${kids.length}: ${TR_TYPES[kids[0].type].toLowerCase()}${kids.length > 1 ? ' и др.' : ''} — справа на дереве сверху; клик по узлу — провалиться глубже${n.type === 'step' ? ' (системы шага: их процессы и шаги — полная цепочка, даже если они уже встречались выше)' : ''}.</p>` : ''}
    </div>`;
  trCanvas(document.querySelector('.tr-cv-in'), chain, kids);
  // Схемы «откуда → блок → куда»
  document.querySelectorAll('.tr-fs').forEach((el) => trBlockScheme(el.querySelector('.ls-focus'), TR_SCHEMES[+el.dataset.fs]));

  // Путь данных системы — та же схема, что на портале
  const ph = document.querySelector('.tr-path');
  if (TR.path) { TR.path.stop(); TR.path = null; }
  if (ph) TR.path = lsPaths(ph, TR.grid, n.id, TR.view, { onPick: trGoSys });
  document.querySelectorAll('[data-kid]').forEach((b) => (b.onclick = () => { const k = trKids(n).find((x) => x.type + ':' + x.id === b.dataset.kid); if (k) trGo(k); }));
  // Цепочка процесса: любой шаг — внутрь (шаг без текущей системы добавляется в дерево, как переход в систему)
  document.querySelectorAll('[data-chstep]').forEach((b) => (b.onclick = () => {
    const s = n.P.s[+b.dataset.chstep];
    let k = trKids(n).find((x) => x.type === 'step' && x.s === s);
    if (!k) { k = trNode(n, 'step', s.c || 'i' + b.dataset.chstep, `${s.c || 'без номера'} ${s.t}`, { P: n.P, s }); n.kids = trKids(n).concat(k); }
    trGo(k);
  }));
  document.querySelectorAll('[data-path]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); trGo(trFind(a.dataset.path ? a.dataset.path.split('/').map(decodeURIComponent) : [])); }));
  document.querySelectorAll('.tr-detail [data-go-sys], .tr-detail [data-pick]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); trGoSys(a.dataset.goSys || a.dataset.pick); }));
  document.querySelectorAll('.tr-detail [data-scen]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); if (TR.path) { TR.path.show(a.dataset.scen); document.querySelector('.tr-path').scrollIntoView({ behavior: 'smooth' }); } }));
  document.querySelector('[data-nav="-1"]').disabled = !trPrev(n);
  document.querySelector('[data-nav="1"]').disabled = !trNext(n);
  document.querySelector('.tr-main').scrollTop = 0;
}
// Переход в систему из текущего узла — дочерним узлом (цепочка продолжается); если система — ребёнок узла, просто в неё
function trGoSys(name) {
  const n = TR.node;
  for (let x = n.type === 'sys' ? n : n.parent; x; x = x.parent) if (x.type === 'sys') { if (x.id === name) return trGo(x); break; }
  const kid = trKids(n).find((x) => x.type === 'sys' && x.id === name)
    || trKids(n).filter((g) => g.type === 'in' || g.type === 'out').flatMap((g) => trKids(g)).find((x) => x.id === name);
  if (kid) return trGo(kid);
  const x = trNode(n, 'sys', name, name);
  n.kids = trKids(n).concat(x);
  trGo(x);
}
function trGo(n) {
  if (!n) return;
  TR.node = n;
  history.replaceState(null, '', '#' + [TR.view, TR.depth, trKey(n)].filter((x) => x !== '').join('/'));
  trRender();
}
function trSetView(v) {
  TR.view = v;
  TR.root = null;
  trBuildGrid(v);
  document.querySelectorAll('[data-view]').forEach((b) => b.classList.toggle('on', b.dataset.view === v));
}
function trStart() {
  const [v, d, ...p] = location.hash.replace(/^#/, '').split('/');
  TR.depth = TR_DEPTHS.some((x) => x[0] === +d) ? +d : 3;
  document.querySelector('#trDepth').value = TR.depth;
  trSetView(LS_VIEWS[v] ? v : 'dream');
  trGo(trFind(p.map(decodeURIComponent)));
}
function trInit() {
  document.querySelector('.tr-views').innerHTML = Object.entries(LS_VIEWS).map(([k, x]) => `<button data-view="${k}"><b>${x.name}</b><span>${x.sub}</span></button>`).join('');
  document.querySelector('#trDepth').innerHTML = TR_DEPTHS.map(([k, t]) => `<option value="${k}">Показ ${t}</option>`).join('');
  document.querySelectorAll('[data-view]').forEach((b) => (b.onclick = () => { trSetView(b.dataset.view); trGo(trFind(trPath(TR.node))); }));
  document.querySelector('#trDepth').onchange = (e) => { TR.depth = +e.target.value; trGo(TR.node); };
  document.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => trGo(b.dataset.nav === '1' ? trNext(TR.node) : trPrev(TR.node))));
  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('select, input, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); trGo(trNext(TR.node)); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); trGo(trPrev(TR.node)); }
    else if (e.key === 'Backspace' && TR.node.parent) { e.preventDefault(); trGo(TR.node.parent); }
  });
  lsTrailLoad().then(trStart);
}
trInit();
