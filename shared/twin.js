// Дерево ЦД Актива: показ «погружением» — от ЦД Актива к его частям (единые данные, ЦД пласта, скважины, добычи),
// модулям ABAI, процессам BPMN и шагам. На каждом уровне — ветви обмена данными с той подробностью, на которой мы сейчас:
// наверху части ЦД целиком, на уровне части — её модули, глубже — отдельные системы и шаги BPMN.
// Иерархия — по стратсессии 18.09.2026: сл. 54 (целевое видение: ЦД и слой данных), сл. 34 (соответствие Nedra ↔ ABAI),
// сл. 14 (интегрированная модель актива), сл. 55–56 (дорожная карта ЦД Актива: ЦД пласта, скважины, добычи, сквозной слой данных).
// Связи — LS_FLOWS (Dream TO BE), шаги — LS_TRAIL, место внешних систем — скрытая большая схема портала (abaiLandscape).

const TW_V = 'dream';
const TW = { node: null, root: null, grid: null, net: (() => { try { return localStorage.getItem('abai-tw-net') !== 'off'; } catch (e) { return true; } })() };
const TW_MAXSHOW = 2; // «Далее» идёт по частям и модулям; процессы и шаги — по клику
const twEsc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const twPlural = (n, a, b, c) => (n % 10 === 1 && n % 100 !== 11 ? a : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? b : c);
const twSrc = (s) => (s ? `<em class="ls-bk-src">${s}</em>` : '');

// ---------- Иерархия ЦД Актива ----------
// Порядок частей: сверху — сквозной слой данных (общий для всех двойников), затем двойники по ходу производства: пласт → скважина → добыча.
// mods: sys — ключ системы (как на схеме портала), alt — продукт Nedra, который заменяет модуль (сл. 34), f — что делает (со слайдом).
const TW_DEF = {
  t: 'ЦД Актива на базе ABAI',
  what: [
    ['Единая платформа централизованной зоны, в которую входят цифровые двойники и слой данных; поддержка принятия решений от операционного уровня (ДЗО) до стратегического (КЦ)', 'сл. 54'],
    ['Наш вариант: та же архитектура, бизнес-модули — продукты ABAI, единая база — ABAI БД 2.0, слой бизнес-интеграций — КХД', 'сл. 34, 54'],
  ],
  parts: [
    { id: 'data', t: 'Единые данные ЦД', sub: 'КХД → ABAI БД 2.0 · сквозной слой', block: 'data',
      lead: 'Сквозной слой, общий для всех двойников: данные промысла собираются в КХД, хранятся в единой базе ABAI БД 2.0, двойники читают и пишут через неё; внешние системы подключаются через интеграции КХД.',
      mods: [
        { sys: 'КХД', alt: 'Nedra.DATA', f: [['Слой бизнес-интеграций', 'сл. 34'], ['Собственная разработка КМГ: единый слой хранения, обработки и аналитики данных для автоматизированного обмена между службами — чтобы избежать ручного ввода и переноса данных из системы в систему', 'сл. 3'], ['Бесшовный обмен данными с внешними системами (SAP, СЭД) и производственными площадками — через интеграции', 'сл. 54']] },
        { sys: 'ABAI БД 2.0', f: [['Единая база ЦД Актива на модулях ABAI: скважины, замеры, документы, статусы и уведомления', 'сл. 54 · BPMN Dream TO BE']] },
      ] },
    { id: 'plast', t: 'ЦД пласта', block: 'ЦД пласта',
      lead: 'Цифровая модель пласта: давление, насыщенность, закачка; приток, пластовое давление, обводнённость. Основа — оперативная постоянно действующая геолого-гидродинамическая модель.',
      mods: [
        { sys: 'ABAI ЦРНС 2.0', alt: 'Nedra.NUMEX', f: [
          ['Подбор системы разработки: тип системы, плотность сетки, направление; размещение и заканчивание скважин (ННС / ГС / МЗС, ГРП / МГРП), режимы работы скважин', 'сл. 24'],
          ['Серийные оптимизационные расчёты и автоадаптация на историю — «сокращает время актуализации ГДМ»', 'сл. 25'],
          ['Размещение фонда по картам результатов ГДМ (физически информированное машинное обучение), рентабельные границы, варианты системы ППД', 'сл. 26–27'],
          ['Работа с существующими 3D ГМ / ГДМ из tNavigator, Petrel / Eclipse: импорт модели, регионы PVT, ОФП', 'сл. 28'],
        ] },
        { sys: 'ABAI УЗ 2.0', alt: 'Nedra.NUMEX Optimize', f: [
          ['Автоматический подбор оптимальных режимов скважин на гидродинамической модели для увеличения NPV и КИН; оптимизация заводнения и подбор ГТМ для поддержания базовой добычи', 'сл. 29'],
          ['Мероприятия: перевод добывающей скважины в ППД, остановка / вывод из бездействия, изменение закачки и забойного давления, перераспределение закачки', 'сл. 29'],
          ['Пересчёт ГГДМ: целевая функция (НДН, NPV), ограничения, локальный оптимум; расчётная среда — tNavigator', 'сл. 29–30'],
          ['Многовариантная оптимизация закачки на актуализированной ГДМ: 1602 варианта нестационарной закачки', 'сл. 31'],
        ] },
        { sys: 'ABAI ПАЭГТМ' },
      ] },
    { id: 'skv', t: 'ЦД скважины', block: 'ЦД скважины',
      lead: 'Цифровая модель скважины: конструкция, режимы работы; режимы, дебиты, ограничения ГНО. Строительство скважины и ремонты.',
      mods: [
        { sys: 'ABAI Цифровое бурение', alt: 'Nedra.RTM', f: [['Модули «Сводки» и «Онлайн-мониторинг» — в офисе и на буровой; WITSML-сервер и клиент, данные реального времени', 'сл. 55']] },
        { sys: 'ABAI Цифровой мониторинг ТКРС', alt: 'Nedra.WWO', f: [['Коробочное решение: нормы времени, КР / ТР, ПЗ / ПР; ролевая модель согласования наряд-заказов и планов работ', 'сл. 55']] },
      ] },
    { id: 'dob', t: 'ЦД добычи и наземной инфраструктуры', block: 'ЦД добычи и наземной инфраструктуры',
      lead: 'Модель инфраструктуры: наземные объекты, сбор, транспортировка, сдача; пропускная способность, мощности. Добыча, режимы, потенциал и мероприятия.',
      mods: [
        { sys: 'ABAI ПДИМ 2.0', alt: 'Nedra.DIGITAL TWIN', f: [['Конфигурация технологических и сопутствующих расчётов, структур данных, пользовательских экранов, скриптов специальных расчётов', 'сл. 55']] },
        { sys: 'ABAI ПДИМ 2.0 · целостность трубопроводов', alt: 'Nedra.DIGITAL TWIN Pipe', f: [['Обучение ML-моделей', 'сл. 56']] },
        { sys: 'ABAI Наземная инфраструктура', alt: 'Nedra.INFRAPLAN', f: [['Построение моделей инфраструктуры, расчёт технологических и экономических кейсов', 'сл. 55']] },
        { sys: 'ABAI ТР 2.0' },
        { sys: 'ABAI ПГНО' },
        { sys: 'Интеллектуальное месторождение', ext: true, f: [['Упоминается в стратсессии среди систем Upstream', 'сл. 3']] },
      ] },
  ],
  // Интегрированная модель актива: что синхронизируется между двойниками (сл. 14; направление не указано — двусторонняя серая связь)
  ima: [
    ['plast', 'skv', 'синхронизация моделей: приток, пластовое давление, обводнённость ⇄ режимы, дебиты, ограничения ГНО'],
    ['skv', 'dob', 'синхронизация моделей: режимы, дебиты, ограничения ГНО ⇄ пропускная способность, мощности, возможности сдачи'],
  ],
  // Дорожная карта внедрения ЦД Актива (Восточный Молдабек, октябрь 2026 – январь 2027)
  road: [
    ['ЦД пласта', 'адаптация системы под оставшиеся пласты с учётом ГДМ, настройка налоговой базы; настройка и создание проектов', 'сл. 55'],
    ['ЦД скважины', 'ABAI Цифровое бурение (сводки, онлайн-мониторинг, WITSML, данные реального времени); ABAI Цифровой мониторинг ТКРС', 'сл. 55'],
    ['ЦД добычи и наземного обустройства', 'ABAI ПДИМ 2.0; ABAI Наземная инфраструктура; ПДИМ 2.0 · целостность трубопроводов', 'сл. 55–56'],
    ['Сквозной слой', 'слой данных ЦД, интеграции, внедрение ЦД Актива', 'сл. 56'],
  ],
};
const TW_IX = new Map();
TW_DEF.parts.forEach((p) => p.mods.forEach((m) => TW_IX.set(m.sys, { p, m })));
const TW_PART = (id) => TW_DEF.parts.find((p) => p.id === id);
const TW_LEVELS = ['ЦД Актива', 'Части ЦД', 'Модули и системы', 'Процессы BPMN', 'Шаги BPMN'];
const TW_TYPES = { akt: 'ЦД Актива', part: 'Часть ЦД', mod: 'Модуль', proc: 'Процесс BPMN', step: 'Шаг BPMN' };

// ---------- Узлы ----------
const twNode = (parent, type, id, label, extra = {}) => Object.assign({ parent, type, id: String(id), label, depth: parent ? parent.depth + 1 : 0, kids: null }, extra);
const twPath = (n) => (n.parent ? twPath(n.parent).concat(n.type + ':' + n.id) : []);
const twKey = (n) => twPath(n).map(encodeURIComponent).join('/');
const twTrail = () => (typeof LS_TRAIL !== 'undefined' ? LS_TRAIL[TW_V] || [] : []);
const twShort = (x) => x.replace(/^(ABAI|SLB)\s+/, '');
function twRoot() { if (!TW.root) TW.root = twNode(null, 'akt', 'akt', TW_DEF.t); return TW.root; }
function twKids(n) {
  if (n.kids) return n.kids;
  let k = [];
  if (n.type === 'akt') k = TW_DEF.parts.map((p) => twNode(n, 'part', p.id, p.t, { def: p }));
  else if (n.type === 'part') k = n.def.mods.map((m) => twNode(n, 'mod', m.sys, m.sys, { def: m, part: n.def }));
  else if (n.type === 'mod') k = lsTrailOf(TW_V, n.id).map(({ P, list }) => twNode(n, 'proc', P.p, `${P.p} ${P.t}`, { P, list }));
  else if (n.type === 'proc') k = n.list.map((i) => { const s = n.P.s[i]; return twNode(n, 'step', s.c || 'i' + i, `${s.c || 'без номера'} ${s.t}`, { P: n.P, s }); });
  n.kids = k;
  return k;
}
function twFind(path) {
  let n = twRoot();
  for (const seg of path) { const kid = twKids(n).find((k) => k.type + ':' + k.id === seg); if (!kid) break; n = kid; }
  return n;
}
const twModNode = (sys) => { const h = TW_IX.get(sys); return h ? twFind(['part:' + h.p.id, 'mod:' + sys]) : null; };
const twPartNode = (id) => twFind(['part:' + id]);
// Последовательный показ: обход по порядку до модулей; глубже «Далее» идёт по соседям
function twNext(n) {
  const kids = n.depth < TW_MAXSHOW ? twKids(n) : [];
  if (kids.length) return kids[0];
  for (let x = n; x.parent; x = x.parent) { const sib = twKids(x.parent); const i = sib.indexOf(x); if (i < sib.length - 1) return sib[i + 1]; }
  return null;
}
function twPrev(n) {
  if (!n.parent) return null;
  const sib = twKids(n.parent), i = sib.indexOf(n);
  if (i === 0) return n.parent;
  let x = sib[i - 1];
  for (;;) { const k = x.depth < TW_MAXSHOW ? twKids(x) : []; if (!k.length) return x; x = k[k.length - 1]; }
}

// ---------- Системы: вид и место вне ЦД (по скрытой большой схеме) ----------
const twKind = (k) => { const h = TW_IX.get(k); if (h) return h.m.ext ? 'ext' : 'abai'; const a = lsAnchor(TW.grid, k); return a ? (a.classList.contains('ls-chip') ? (a.className.match(/k-(\w+)/) || [])[1] || 'ext' : 'user') : 'ext'; };
// Окружение ЦД: зона ДЗО (АСУ ТП, промысловые и производственные системы, инженерное ПО), внешние системы, пользователи
function twCtx(k) {
  const g = lsGroup(lsAnchor(TW.grid, k), TW_V);
  if (g.type === 'users') return { id: 'users', t: 'Пользователи', type: 'users', row: 3 };
  if (g.type === 'ext') return { id: 'ext', agg: 'Внешние системы', t: 'Внешние системы', zone: 'ext', zt: 'Внешние системы', type: 'ext', row: 1 };
  if (g.type === 'eng') return { id: 'eng', agg: 'Инженерное ПО', t: 'Зона ДЗО · инженерное ПО', zone: 'dzo', zt: 'Зона ДЗО', type: 'eng', row: 0 };
  if (g.type === 'prod' || /Промысловые/.test(g.title)) return { id: 'field', agg: 'Промысловые и производственные системы', t: 'Зона ДЗО · промысловые и производственные', zone: 'dzo', zt: 'Зона ДЗО', type: 'asu', row: 0 };
  return { id: 'asu', agg: 'АСУ ТП и датчики', t: 'Зона ДЗО · АСУ ТП и датчики', zone: 'dzo', zt: 'Зона ДЗО', type: 'asu', row: 0 };
}
const twW = (s) => Math.round(Math.min(250, Math.max(96, 24 + s.length * 6.6)));
// Узел схемы обмена для системы k на уровне lvl ({ depth, part }): чем глубже — тем подробнее.
// ЦД Актива: части и окружение целиком (единые данные — одним узлом); часть: её модули отдельно, КХД и БД 2.0 — отдельно;
// модуль и глубже — каждая система отдельно, с подписью части, где она стоит.
function twUnit(k, lvl) {
  const h = TW_IX.get(k);
  if (h) {
    const data = h.p.id === 'data';
    const ind = lvl.depth >= 2 || (lvl.depth === 1 && (data || h.p.id === lvl.part));
    if (ind) return { k, kind: h.m.ext ? 'ext' : 'abai', g: { key: 'p:' + h.p.id, title: h.p.t, type: data ? 'data' : 'cd' }, row: data ? 1 : 2, w: twW(k), ord: h.p.mods.indexOf(h.m), nav: () => twModNode(k) };
    if (data) return { k: h.p.t, kind: 'abai', g: { key: 'data', title: 'Сквозной слой: КХД → ABAI БД 2.0', type: 'data' }, row: 1, w: twW(h.p.t) + 30, nav: () => twPartNode('data') };
    return { k: h.p.t, kind: 'abai', g: { key: 'twins', title: lvl.depth ? 'Другие двойники ЦД Актива' : 'Цифровые двойники ЦД Актива', type: 'cd' }, row: 2, w: twW(h.p.t), ord: TW_DEF.parts.indexOf(h.p), nav: () => twPartNode(h.p.id) };
  }
  const c = twCtx(k);
  if (c.id === 'users') return lvl.depth ? { k, kind: 'user', g: { key: 'users', title: c.t, type: 'users' }, row: 3, w: twW(k) } : { k: 'Пользователи', kind: 'user', g: { key: 'users', title: 'Решения по ролям', type: 'users' }, row: 3, w: 150 };
  if (lvl.depth >= 2) return { k, kind: twKind(k), g: { key: c.id, title: c.t, type: c.type }, row: c.row, w: twW(k) };
  return { k: c.agg, kind: 'ext', ctx: c.id, g: { key: c.zone, title: c.zt, type: c.type }, row: c.row, w: twW(c.agg) };
}

// ---------- Связи ----------
// Все связи вида: одинаковые «откуда → куда» из разных сценариев объединены
function twEdges() {
  const m = new Map();
  (LS_FLOWS[TW_V] || []).forEach((f) => f.e.forEach(([a, z, w, r, k]) => {
    const id = a + '|' + z;
    if (!m.has(id)) m.set(id, { f: a, t: z, w, r, k, sc: [f.name] });
    else { const e = m.get(id); if (!e.w.includes(w)) { e.w += '; ' + w; e.r += ' · ' + r; } if (!e.sc.includes(f.name)) e.sc.push(f.name); }
  }));
  return [...m.values()];
}
// Системы узла дерева (для отбора связей)
function twKeysOf(n) {
  if (n.type === 'akt') return null;
  if (n.type === 'part') return n.def.mods.map((m) => m.sys);
  for (let x = n; x; x = x.parent) if (x.type === 'mod') return [x.id];
  return [];
}
// Связи, которые показываем на узле: ЦД Актива — все; часть и модуль — касающиеся их систем; процесс — ещё и с шагами этого процесса;
// шаг — все связи этого шага
function twRaw(n) {
  const E = twEdges(), keys = twKeysOf(n);
  const inProc = (e, P, code) => lsRefParts(e.r).some((p) => p.proc === P.p && (!code || (p.codes || []).some((c) => c === code || code.startsWith(c + '.'))));
  if (n.type === 'akt') return E;
  if (n.type === 'step') return E.filter((e) => inProc(e, n.P, n.s.c));
  const touch = E.filter((e) => keys.includes(e.f) || keys.includes(e.t));
  return n.type === 'proc' ? touch.filter((e) => inProc(e, n.P)) : touch;
}
// Связи на уровне узла: концы — узлы схемы этого уровня (twUnit); связи внутри одного свёрнутого узла — в счётчике «внутри».
// На верхних уровнях (ЦД Актива, часть) «туда» и «обратно» между двумя узлами — одна двусторонняя ветвь; глубже — каждое направление отдельно.
function twLinks(n) {
  const lvl = { depth: Math.min(n.depth, 2), part: n.type === 'part' ? n.id : null };
  const merge = lvl.depth <= 1;
  const units = new Map(), m = new Map(), inside = new Map();
  const add = (a, b, e) => {
    units.set(a.k, a); units.set(b.k, b);
    const id = merge ? [a.k, b.k].sort().join('|') : a.k + '|' + b.k;
    if (!m.has(id)) m.set(id, { f: a.k, t: b.k, dirs: new Map() });
    const q = m.get(id), d = a.k + '|' + b.k;
    if (!q.dirs.has(d)) q.dirs.set(d, { f: a.k, t: b.k, items: [] });
    if (e) q.dirs.get(d).items.push(e);
    return q;
  };
  twRaw(n).forEach((e) => {
    const a = twUnit(e.f, lvl), b = twUnit(e.t, lvl);
    if (a.k === b.k) { inside.set(a.k, (inside.get(a.k) || 0) + 1); return; }
    add(a, b, e);
  });
  const L = [...m.values()].map((q) => {
    const dirs = [...q.dirs.values()].map((d) => Object.assign(d, { w: [...new Set(d.items.flatMap((e) => e.w.split('; ')))].join('; ') }));
    const items = dirs.flatMap((d) => d.items), kinds = [...new Set(items.map((e) => e.k))];
    const both = dirs.length > 1;
    return { f: dirs[0].f, t: dirs[0].t, both, dirs, items,
      w: both ? dirs.map((d) => `${d.f} → ${d.t}: ${d.w}`).join(' · ') : dirs[0].w,
      r: items.map((e) => e.r).join(' · '), k: kinds.length === 1 ? kinds[0] : kinds.includes('auto') ? 'auto' : kinds[0] };
  });
  // Верхний уровень: синхронизация моделей пласта, скважины и инфраструктуры (сл. 14) — направление не указано
  if (n.type === 'akt') TW_DEF.ima.forEach(([a, b, w]) => {
    const A = twUnit(TW_PART(a).mods[0].sys, lvl), B = twUnit(TW_PART(b).mods[0].sys, lvl);
    units.set(A.k, A); units.set(B.k, B);
    L.push({ f: A.k, t: B.k, both: true, ima: true, dirs: [{ f: A.k, t: B.k, w, items: [] }], items: [], w, r: 'стратсессия, сл. 14', k: 'ima' });
  });
  // Номера — снизу вверх: от источников к получателям
  const row = (k) => units.get(k).row;
  L.forEach((e) => { if (e.both && row(e.f) > row(e.t)) { const x = e.f; e.f = e.t; e.t = x; } });
  L.sort((p, q) => row(p.f) - row(q.f) || row(p.t) - row(q.t) || (p.ima ? 1 : 0) - (q.ima ? 1 : 0));
  L.forEach((e, i) => (e.n = i + 1));
  return { L, units, inside };
}

// ---------- Схема обмена данными уровня ----------
function twSceneHTML(n) {
  const head = {
    akt: ['Обмен данными между частями ЦД Актива', 'части ЦД и окружение — целиком; погрузитесь в часть, чтобы увидеть её модули и системы'],
    part: [`Обмен данными: «${n.label}»`, n.id === 'data' ? 'КХД и ABAI БД 2.0 — со всеми частями ЦД и окружением' : 'модули части — отдельно, остальные двойники и окружение — целиком'],
    mod: [`Обмен данными: «${n.label}»`, 'с какими системами, что передаётся и на каком шаге BPMN'],
    proc: [`Обмен данными «${n.parent ? n.parent.label : ''}» в процессе ${n.P ? n.P.p : ''}`, 'связи этого процесса'],
    step: [`Обмен данными на шаге ${n.s ? n.s.c : ''}`, 'связи схемы, записанные на этом шаге BPMN'],
  }[n.type];
  return `<section class="tw-scene${TW.net ? '' : ' off'}">
    <div class="tw-scene-h"><b>⇄ ${twEsc(head[0])}</b><span>${twEsc(head[1])}</span>
      <button class="tw-net-t" title="Показать / скрыть ветви обмена данными">${TW.net ? 'Скрыть обмен данными' : 'Показать обмен данными'}</button></div>
    <div class="tw-scene-b"><div class="tw-net"></div><div class="tw-links"></div></div>
  </section>`;
}
function twScene(n, X) {
  const sec = document.querySelector('.tw-scene');
  if (!sec) return;
  sec.querySelector('.tw-net-t').onclick = () => { TW.net = !TW.net; try { localStorage.setItem('abai-tw-net', TW.net ? 'on' : 'off'); } catch (e) {} twRender(); };
  if (!TW.net) return;
  const { L, units, inside } = X;
  const host = sec.querySelector('.tw-net'), list = sec.querySelector('.tw-links');
  if (!L.length) {
    host.innerHTML = `<p class="tr-n">${n.type === 'mod' ? `В шагах BPMN Dream TO BE обмен данными «${twEsc(n.label)}» с другими системами не записан — в схеме связей не рисуем (ничего не выдумываем).` : n.type === 'step' ? 'На этом шаге передача данных между системами в BPMN не записана.' : n.type === 'proc' ? 'В этом процессе связи модуля с другими системами в BPMN не записаны.' : 'На этом уровне связей схемы нет.'}</p>`;
    list.innerHTML = '';
    return;
  }
  lsNet(host, TW.grid, L, TW_V, { info: (k) => units.get(k), order: (k) => units.get(k).ord || 0, onPick: (i) => twPick(i) });
  host.querySelectorAll('.ls-fnode[data-n]').forEach((x) => {
    const u = units.get(x.dataset.n);
    if (!u || !u.nav) return;
    x.classList.add('tw-go');
    x.title = 'Погрузиться: ' + x.dataset.n;
    x.onclick = () => twGo(u.nav());
  });
  const ins = [...inside].map(([k, c]) => `<span>внутри «${twEsc(k)}» — ещё ${c} ${twPlural(c, 'связь', 'связи', 'связей')}</span>`);
  const sysA = (x) => (TW_IX.has(x) ? `<a href="#" class="tr-s k-${twKind(x)}" data-go-sys="${twEsc(x)}">${twEsc(x)}</a>` : `<b>${twEsc(x)}</b>`);
  // Направление ветви: что передаётся; если за ним несколько связей систем или концы свёрнуты — раскрывается списком с шагами BPMN
  const dirHTML = (d, e) => {
    const same = d.items.length === 1 && d.items[0].f === d.f && d.items[0].t === d.t;
    return `<div class="tw-lt"><span class="tw-u">${twEsc(d.f)}</span> <i>→</i> <span class="tw-u">${twEsc(d.t)}</span> — ${twEsc(d.w)}</div>
      ${!d.items.length ? `<em>${LS_KINDS[e.k]} · ${twEsc(e.r)}</em>`
    : same ? `<em>${LS_KINDS[d.items[0].k]} · ${twEsc(d.items[0].r)}</em>${lsRefSlides(TW_V, d.items[0].r)}`
      : `<details><summary>${d.items.length} ${twPlural(d.items.length, 'связь', 'связи', 'связей')} систем · шаги BPMN</summary><ul class="ls-ab-l">${d.items.map((x) => `<li>${sysA(x.f)} → ${sysA(x.t)} — ${twEsc(x.w)}<em>${LS_KINDS[x.k]} · ${twEsc(x.r)}</em>${lsRefSlides(TW_V, x.r)}</li>`).join('')}</ul></details>`}`;
  };
  list.innerHTML = `${ins.length ? `<p class="tw-ins">${ins.join('')}<em>— видны при погружении</em></p>` : ''}
    <ol class="tw-ll">${L.map((e, i) => `<li class="k-${e.k}" data-l="${i}"><b class="ls-nb k-${e.k}">${e.n}</b>
      <div>${e.ima ? `<div class="tw-lt"><span class="tw-u">${twEsc(e.f)}</span> <i>⇄</i> <span class="tw-u">${twEsc(e.t)}</span> — ${twEsc(e.w)}</div><em>${LS_KINDS.ima}</em>`
    : e.both ? `<div class="tw-lh"><span class="tw-u">${twEsc(e.f)}</span> <i>⇄</i> <span class="tw-u">${twEsc(e.t)}</span></div>${e.dirs.map((d) => `<div class="tw-ld">${dirHTML(d, e)}</div>`).join('')}`
      : dirHTML(e.dirs[0], e)}</div></li>`).join('')}</ol>`;
  list.querySelectorAll('[data-l]').forEach((li) => { const no = L[+li.dataset.l].n; li.onmouseenter = () => { if (host._hot) host._hot(+li.dataset.l); twXHot(no, true); }; li.onmouseleave = () => { if (host._hot) host._hot(null); twXHot(no, false); }; });
  list.querySelectorAll('[data-go-sys]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); twGo(twModNode(a.dataset.goSys)); }));
}
function twPick(i) {
  const li = document.querySelector(`.tw-ll [data-l="${i}"]`);
  if (!li) return;
  const d = li.querySelector('details'); if (d) d.open = true;
  li.scrollIntoView({ behavior: 'smooth', block: 'center' });
  li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash');
}

// ---------- Содержимое карточки ----------
const twList = (l) => l.map(([t, s]) => `<li>${t}${twSrc(s)}</li>`).join('');
function twBlockHTML(D, skip = []) {
  if (!D) return '';
  return `${D.asis || D.use ? `<div class="tr-c2 tr-pair">${D.asis ? `<div class="tr-box asis"><b>Как сейчас (AS IS)</b>${D.asis.map(([t, s]) => `<p>${t}${twSrc(s)}</p>`).join('')}</div>` : '<div></div>'}${D.use ? `<div class="tr-box use"><b>Где применяется</b>${D.use.map(([t, s]) => `<p>${t}${twSrc(s)}</p>`).join('')}</div>` : ''}</div>` : ''}
    ${D.cycle ? `<h3>Цикл работы с моделью${twSrc(D.cycleSrc)}</h3><ol class="ls-bk-cy">${D.cycle.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>` : ''}
    ${D.roles ? `<h3>Роли${twSrc(D.rolesSrc)}</h3><div class="ls-bk-r">${D.roles.map(([t, d]) => `<div><b>${t}</b><span>${d}</span></div>`).join('')}</div>` : ''}
    ${(D.what || []).filter((x) => !skip.includes(x[1])).length ? `<details class="tr-more"><summary>Подробнее по стратсессии</summary><ul class="ls-bk-l">${twList(D.what)}</ul>${D.deploy ? `<h3>Внедрение</h3><ul class="ls-bk-l">${twList(D.deploy)}</ul>` : ''}${D.terms ? `<h3>Сокращения</h3><dl class="ls-bk-t">${D.terms.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>` : ''}</details>` : ''}`;
}
// Карточки детей: клик — погрузиться
function twKidCards(n, sub) {
  return `<div class="tw-kids">${twKids(n).map((k) => `<button class="tw-kid t-${k.type} k-${k.type === 'mod' ? twKind(k.id) : ''}" data-kid="${twEsc(k.type + ':' + k.id)}">
    <b>${twEsc(k.label)}${k.def && k.def.alt ? ` <em class="alt">(${twEsc(k.def.alt)})</em>` : ''}</b><span>${twEsc(sub(k))}</span></button>`).join('')}</div>`;
}
function twStepsCount(sys) { const st = lsTrailOf(TW_V, sys); return { n: st.reduce((s, x) => s + x.list.length, 0), p: st.length }; }
function twSub(k) {
  if (k.type === 'akt') return 'единые данные · ЦД пласта · ЦД скважины · ЦД добычи';
  if (k.type === 'part') return k.def.sub || k.def.mods.map((m) => twShort(m.sys)).join(' · ');
  if (k.type === 'mod') { const c = twStepsCount(k.id); return `${k.def && k.def.alt ? '(' + k.def.alt + ') · ' : ''}${c.n ? `${c.n} ${twPlural(c.n, 'шаг', 'шага', 'шагов')} BPMN · ${c.p} ${twPlural(c.p, 'процесс', 'процесса', 'процессов')}` : 'в шагах BPMN нет'}`; }
  if (k.type === 'proc') return `${LS_MOD_NAME[k.P.m]} · ${k.list.length} ${twPlural(k.list.length, 'шаг', 'шага', 'шагов')} с ${twShort(k.parent.id)}`;
  if (k.type === 'step') return lsRole(k.s);
  return '';
}
// Кто пользуется (исполнители шагов BPMN) и как (процессы) — для модуля
function twUsageHTML(key) {
  const orgs = new Map();
  twTrail().forEach((P) => P.s.forEach((s) => {
    if (!s.s.some((x) => lsKey(x) === key)) return;
    const cat = lsOrgCat(s.o || s.r), role = lsRole(s);
    if (!orgs.has(cat)) orgs.set(cat, new Map());
    orgs.get(cat).set(role, (orgs.get(cat).get(role) || 0) + 1);
  }));
  if (!orgs.size) return '';
  const order = LS_ORGS.map((x) => x[1]).concat('Другие участники');
  return `<h3>Кто работает в модуле <span>исполнители шагов BPMN · число шагов</span></h3><div class="tr-orgs tw-orgs">
    ${[...orgs].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0])).map(([c, m]) => `<div class="tr-org"><b>${c}</b>${[...m].sort((a, b) => b[1] - a[1]).map(([r, k]) => `<span>${twEsc(r)} <em>${k}</em></span>`).join('')}</div>`).join('')}</div>`;
}
function twBody(n) {
  if (n.type === 'akt') {
    return `<ul class="tw-what">${twList(TW_DEF.what)}</ul>
      <h3>Из чего состоит <span>сверху — общий слой данных, ниже — двойники по ходу производства · клик — погрузиться</span></h3>
      ${twKidCards(n, (k) => k.def.lead)}
      <h3>Интегрированная модель актива ${twSrc('сл. 14')}</h3>
      <div class="tw-ima">${[['Пласт', 'давление, насыщенность, закачка', 'приток, пластовое давление, обводнённость', 'plast'], ['Скважина', 'конструкция скважины, режимы работы', 'режимы, дебиты, ограничения ГНО', 'skv'], ['Инфраструктура', 'наземные объекты, сбор, транспортировка, сдача', 'пропускная способность, мощности, возможности сдачи', 'dob']].map(([t, a, b, id]) => `<button data-kid="part:${id}"><b>${t}</b><span>${a}</span><em>${b}</em></button>`).join('<i>⇄</i>')}</div>
      <p class="tr-n">Модели пласта, скважины и инфраструктуры синхронизируются с автоматическим пересчётом сценариев при изменениях; потенциал ищется на всех элементах производственной цепочки, решения считаются с учётом влияния на смежные узлы (сл. 14).</p>
      <h3>Что даёт ЦД <span>встреча по ЦД 01.10 · клик — процесс в мокапе</span></h3>
      <div class="tw-val">${LS_VALUE.map(([t, d, ps]) => `<div><b>${t}</b><span>${d}</span><div>${ps.map(([m, p]) => `<a href="${lsModHref(m, 'v1')}index.html#/" target="_blank">${p}</a>`).join('')}</div></div>`).join('')}</div>
      <h3>Дорожная карта внедрения — Восточный Молдабек, октябрь 2026 – январь 2027</h3>
      <ol class="tw-road">${TW_DEF.road.map(([t, d, s]) => `<li><b>${t}</b><span>${d}${twSrc(s)}</span></li>`).join('')}</ol>`;
  }
  if (n.type === 'part') {
    const D = LS_BLOCKS[n.def.block];
    return `<p class="tr-lead">${twEsc(n.def.lead)}</p>
      <h3>${n.id === 'data' ? 'Системы слоя' : 'Модули ABAI'} <span>в скобках — продукт Nedra, который заменяет модуль (сл. 34) · клик — погрузиться</span></h3>
      ${twKidCards(n, (k) => twSub(k).replace(/^\(.*?\) · /, ''))}
      ${n.id === 'data' ? `<ul class="tw-what">${twList(D.what)}</ul>` : `<ul class="tw-what">${twList(D.what.slice(0, 1))}</ul>`}
      ${twBlockHTML(n.id === 'data' ? Object.assign({}, D, { what: [] }) : D)}`;
  }
  if (n.type === 'mod') {
    const m = n.def, desc = Object.entries(typeof ABAI_SYS_DESC !== 'undefined' ? ABAI_SYS_DESC : {}).filter(([x]) => lsKey(x) === n.id).flatMap(([, l]) => l);
    const P = twKids(n);
    return `${m.f ? `<h3>Что делает</h3><ul class="tw-what">${twList(m.f)}</ul>` : ''}
      ${desc.length ? `<h3>Что делает в процессах <span>справочники систем модулей мокапа · по BPMN Dream TO BE</span></h3><ul class="tw-what">${[...new Map(desc.map((d) => [d[1], d])).values()].map(([mm, d]) => `<li><b>${LS_MOD_NAME[mm] || mm}:</b> ${twEsc(d)}</li>`).join('')}</ul>` : ''}
      ${P.length ? `<h3>Где используется <span>процессы BPMN · клик — погрузиться в процесс</span></h3>${twKidCards(n, twSub)}${twUsageHTML(n.id)}`
    : '<p class="tr-n">В шагах BPMN Dream TO BE модуль не указан — процессов и шагов нет. Описание — по стратсессии.</p>'}`;
  }
  if (n.type === 'proc') return twProcHTML(n);
  if (n.type === 'step') return twStepHTML(n);
  return '';
}
// Процесс: полная цепочка шагов, шаги модуля выделены
function twProcHTML(n) {
  const P = n.P, ctx = n.parent.id, mine = new Set(n.list), anyV = P.s.find((s) => s.v);
  const notes = [...new Set(n.list.flatMap((i) => P.s[i].n.filter((t) => t.includes(twShort(ctx).replace(/\s+2\.0$/, '')))))];
  const chain = P.s.map((s, i) => `<button class="tr-ch${mine.has(i) ? ' me' : ' other'}" data-chstep="${i}"><b>${s.c || '—'}</b><span>${twEsc(s.t)}</span><em>${twEsc(lsRole(s))}${s.s.length ? ' · ' + twEsc(s.s.join(', ')) : ''}</em></button>`).join('<i class="tr-ar">→</i>');
  return `<p class="tr-lead">${LS_MOD_NAME[P.m]} · ${P.s.length} ${twPlural(P.s.length, 'шаг', 'шага', 'шагов')} BPMN Dream TO BE · с «${twEsc(ctx)}» — ${n.list.length}
      ${anyV ? `<a class="ls-slide" href="${lsModHref(P.m, 'v2')}index.html#${anyV.v[0]}/1/all" target="_blank">презентация процесса ↗</a>` : ''}<a class="ls-slide" href="${lsProtoHref(P, P.s[n.list[0]] || P.s[0])}" target="_blank">прототип ↗</a></p>
    ${notes.length ? `<h3>Что «${twEsc(ctx)}» делает в процессе <span>аннотации шагов BPMN</span></h3><ul class="ls-bk-l">${notes.map((t) => `<li>${twEsc(t)}</li>`).join('')}</ul>` : ''}
    <h3>Цепочка процесса <span>выделены шаги с «${twEsc(ctx)}» · клик по шагу — внутрь</span></h3>
    <div class="tr-chain">${chain}</div>`;
}
// Шаг: до / после, системы шага с аннотациями, документы, слайд презентации
function twStepHTML(n) {
  const P = n.P, s = n.s, from = n.parent.parent.id;
  const nb = (x) => (typeof x[0] !== 'number' ? `<div class="tr-nb ev">${twEsc(x[0])}</div>` : (() => { const q = P.s[x[0]]; return `<div class="tr-nb"><b>${q.c || '—'}</b> ${twEsc(q.t)}<span>${twEsc(lsRole(q))}${q.s.length ? ' · ' + twEsc(q.s.join(', ')) : ''}</span>${x[1] ? `<q>${twEsc(x[1])}</q>` : ''}</div>`; })());
  const notesOf = new Map(s.s.map((x) => [x, []])), rest = [];
  s.n.forEach((t) => { const hit = s.s.find((x) => t.includes(x) || t.includes(twShort(x))); if (hit) notesOf.get(hit).push(t); else rest.push(t); });
  const sysA = (x) => (TW_IX.has(lsKey(x)) ? `<a href="#" class="tr-s k-${twKind(lsKey(x))}" data-go-sys="${twEsc(lsKey(x))}">${twEsc(x)}</a>` : `<b>${twEsc(x)}</b>`);
  return `<div class="tr-step">
      <div class="tr-sw"><i>до</i><div>${s.pv.length ? s.pv.map(nb).join('') : '<div class="tr-nb ev">начало процесса</div>'}</div></div>
      <div class="tr-scur"><div class="tr-scur-r">${twEsc(lsRole(s))}</div><div class="tr-scur-t"><b>${s.c || 'без номера'}</b>${twEsc(s.t)}</div>
        <div class="ls-scur-s">${s.s.map((x) => `<div class="ls-ssys k-${twKind(lsKey(x))}${lsKey(x) === from ? ' from' : ''}">${sysA(x)}${notesOf.get(x).map((t) => `<q>${twEsc(t)}</q>`).join('')}</div>`).join('') || '<span class="tr-n">систем в шаге нет</span>'}</div>
        ${s.d.length ? `<div class="ls-scur-d"><i>документы</i>${twEsc(s.d.join('; '))}</div>` : ''}${rest.map((t) => `<q>${twEsc(t)}</q>`).join('')}</div>
      <div class="tr-sw"><i>после</i><div>${s.nx.length ? s.nx.map(nb).join('') : '<div class="tr-nb ev">конец процесса</div>'}</div></div>
    </div>
    <h3>Как выглядит в ABAI ${s.v ? `<span>слайд «${twEsc(s.v[2])}», действие ${s.v[3]}</span>` : ''}</h3>
    <p class="tr-links">${s.v ? `<a class="ls-slide" href="${lsSlideHref(P, s)}" target="_blank">Открыть в презентации ↗</a>` : '<span class="tr-n">этого шага нет в быстром сценарии презентации</span> '}<a class="ls-slide" href="${lsProtoHref(P, s)}" target="_blank">Шаг в прототипе ↗</a></p>
    ${s.v ? `<div class="ls-st-frame"><iframe src="${lsSlideHref(P, s)}" title="Слайд презентации" loading="lazy"></iframe></div>` : ''}`;
}

// ---------- Ветви обмена на дереве: куда и откуда идут данные узла — с той же подробностью, что и схема уровня ----------
// Конец связи на дереве: система вне ЦД — плашка справа («Вне ЦД»); система ЦД — узел дерева: часть (у ЦД Актива), модуль (у части и модуля),
// тот же процесс в ветке другого модуля (у процесса), шаг этого процесса, на котором система отдаёт / принимает данные (у шага).
function twTreeLinks(n, X) {
  const lvl = { depth: Math.min(n.depth, 2), part: n.type === 'part' ? n.id : null };
  const keys = twKeysOf(n) || [];
  // Шаг процесса pr, на котором система отдаёт (side 'f') / принимает ('t') данные: «Р1 1.10 → 1.11» — отдаёт на 1.10, принимает на 1.11
  const stepIn = (pr, e, side) => {
    const codes = lsRefParts(e.r).filter((p) => p.proc === pr.P.p && p.codes).flatMap((p) => (p.arrow && p.codes.length === 2 ? [p.codes[side === 'f' ? 0 : 1]] : p.codes));
    return twKids(pr).find((x) => codes.some((c) => x.s.c === c || x.s.c.startsWith(c + '.')));
  };
  const end = (k, e, side) => {
    const u = twUnit(k, lvl);
    if (!u.nav) return { pill: u.k, u };
    if (n.depth >= 2 && keys.includes(k)) {
      // Своя система: у модуля — тот его процесс, где записан обмен; у процесса — тот шаг
      if (e && n.type === 'mod') { const procs = lsRefParts(e.r).map((p) => p.proc).filter(Boolean); const pr = twKids(n).find((x) => procs.includes(x.P.p)); if (pr) return { node: pr }; }
      if (e && n.type === 'proc') { const st = stepIn(n, e, side); if (st) return { node: st }; }
      return { node: n };
    }
    let t = u.nav();
    if (t && n.depth >= 3 && t.type === 'mod') {
      const pr = twKids(t).find((x) => x.P.p === n.P.p);
      if (pr) { t = pr; const st = e && stepIn(pr, e, side); if (st) t = st; }
    }
    return { node: t };
  };
  const A = new Map(), pills = new Map(), nodes = new Set();
  const add = (ea, eb, num, k, w, both) => {
    if ((!ea.node && !ea.pill) || (!eb.node && !eb.pill)) return;
    const ka = twEndKey(ea), kb = twEndKey(eb);
    if (ka === kb) return;
    [ea, eb].forEach((x) => (x.pill ? pills.set(x.pill, x.u) : nodes.add(x.node)));
    const id = [ka, kb].sort().join('|');
    if (!A.has(id)) A.set(id, { a: ea, b: eb, ka, kb, dirs: new Set(), nums: new Set(), ks: new Set(), w: [] });
    const q = A.get(id);
    q.dirs.add(ka + '>' + kb); if (both) q.dirs.add(kb + '>' + ka);
    q.nums.add(num); q.ks.add(k); if (!q.w.includes(w)) q.w.push(w);
  };
  X.L.forEach((l) => {
    if (l.ima) {
      const pr = TW_DEF.ima.find((x) => TW_PART(x[0]).t === l.f && TW_PART(x[1]).t === l.t);
      if (pr) add({ node: twPartNode(pr[0]) }, { node: twPartNode(pr[1]) }, l.n, 'ima', `${l.f} ⇄ ${l.t}: ${l.w}`, true);
      return;
    }
    l.items.forEach((e) => add(end(e.f, e, 'f'), end(e.t, e, 't'), l.n, e.k, `${e.f} → ${e.t}: ${e.w}`));
  });
  return { arrows: [...A.values()], pills, nodes };
}
const twEndKey = (x) => (x.node ? 'n:' + twKey(x.node) : 'p:' + x.pill);
const TW_KC = { auto: '#2a78d6', input: '#0f7a55', seq: '#6b7383', manual: '#c2413a', int: '#d08a1e', pub: '#0e7490', ima: '#8a93a6' };
// Подсветка ветви обмена по номеру связи — на дереве (из списка под схемой и с номера на дереве)
function twXHot(no, on) {
  const hit = document.querySelectorAll(`.tw-xs [data-ns~="${no}"]`);
  hit.forEach((x) => x.classList.toggle('hot', on));
  const cv = document.querySelector('.tr-cv-in');
  if (cv) cv.classList.toggle('xfocus', on && hit.length > 0);
}

// ---------- Дерево схемой: колонки уровней слева направо, линии от родителя к детям; поверх — ветви обмена данными ----------
function twCanvas(host, n, X) {
  const W = 290, H0 = 60, G = 10, GG = 26, P = 14, PW = 210, PH0 = 44, TS = 24, CGMIN = 64;
  const chain = []; for (let x = n; x; x = x.parent) chain.unshift(x);
  const XA = X ? twTreeLinks(n, X) : { arrows: [], pills: new Map(), nodes: new Set() };
  // Видимые узлы: путь к текущему с соседями, дети текущего; ветви, куда / откуда идут данные, — путём от корня
  const V = new Set([twRoot()]), tgt = new Set();
  chain.forEach((c) => { if (c.parent) twKids(c.parent).forEach((k) => V.add(k)); });
  twKids(n).forEach((k) => V.add(k));
  XA.nodes.forEach((t) => { for (let x = t; x; x = x.parent) { if (!V.has(x)) tgt.add(x); V.add(x); } });
  XA.nodes.forEach((t) => { if (t !== n && !chain.includes(t)) tgt.add(t); });
  const cols = [];
  const walk = (x) => { (cols[x.depth] = cols[x.depth] || []).push(x); twKids(x).filter((k) => V.has(k)).forEach(walk); };
  walk(twRoot());
  const maxD = cols.length - 1, depthOf = new Map();
  cols.forEach((col, d) => col.forEach((x) => depthOf.set(x, d)));

  // ---- Ветви обмена: тип маршрута и стороны узлов ----
  // x — между колонками (из правого края левого узла в левый край правого), same — внутри колонки (справа),
  // pill — от узла последней колонки к плашке «Вне ЦД», lane — от узла не из последней колонки к плашке по дорожке над деревом
  const endOf = (e) => (e.pill ? { pill: e.pill, key: 'p:' + e.pill } : depthOf.has(e.node) ? { node: e.node, d: depthOf.get(e.node), key: twEndKey(e) } : null);
  const plan = [];
  XA.arrows.forEach((q) => {
    const [s, t] = q.dirs.has(q.ka + '>' + q.kb) ? [q.a, q.b] : [q.b, q.a];
    const S = endOf(s), T = endOf(t);
    if (!S || !T || S.key === T.key) return;
    const a = { q, S, T, side: {} };
    if (S.pill || T.pill) {
      const N = S.pill ? T : S, Pl = S.pill ? S : T;
      if (!N.node) return;
      a.type = N.d === maxD ? 'pill' : 'lane'; a.N = N; a.Pl = Pl;
      a.side[N.key] = 'r'; a.side[Pl.key] = 'l';
    } else if (S.d === T.d) { a.type = 'same'; a.side[S.key] = 'r'; a.side[T.key] = 'r'; }
    else { const L = S.d < T.d ? S : T, R = L === S ? T : S; a.type = 'x'; a.side[L.key] = 'r'; a.side[R.key] = 'l'; a.gap = R.d - 1; }
    plan.push(a);
  });
  // Точки крепления: у каждой стрелки своя, узел с множеством связей — выше
  const ports = new Map();
  plan.forEach((a) => [a.S, a.T].forEach((E) => { const k = E.key + a.side[E.key]; if (!ports.has(k)) ports.set(k, []); ports.get(k).push(a); }));
  const portsOf = (key) => Math.max((ports.get(key + 'r') || []).length, (ports.get(key + 'l') || []).length);
  const hOf = (x) => Math.max(H0, portsOf('n:' + twKey(x)) * 12 + 16);
  // ---- По вертикали: колонки, в колонке — группы детей одного родителя напротив родителя, без наложений ----
  const pos = new Map();
  cols.forEach((col, d) => {
    let bottom = -1e9;
    const groups = [];
    col.forEach((x) => { const g = groups[groups.length - 1]; if (g && g.p === x.parent) g.l.push(x); else groups.push({ p: x.parent, l: [x] }); });
    groups.forEach((g) => {
      const hs = g.l.map(hOf), gh = hs.reduce((s, v) => s + v, 0) + G * (g.l.length - 1);
      let top = g.p ? pos.get(g.p).y + pos.get(g.p).h / 2 - gh / 2 : 0;
      if (top < bottom + GG) top = bottom + GG;
      let y = top;
      g.l.forEach((x, j) => { pos.set(x, { y, h: hs[j], d }); y += hs[j] + G; });
      bottom = top + gh;
    });
  });
  const pillH = (k) => Math.max(PH0, portsOf('p:' + k) * 12 + 12);
  const top0 = Math.min(...[...pos.values()].map((q) => q.y));
  const pillY = (k) => {
    const ys = plan.filter((a) => a.type === 'pill' && a.Pl.pill === k).map((a) => pos.get(a.N.node)).map((q) => q.y + q.h / 2);
    return ys.length ? ys.reduce((s, v) => s + v, 0) / ys.length : top0;
  };
  const pp = new Map();
  let pb = -1e9;
  [...XA.pills.keys()].map((k) => ({ k, h: pillH(k), y: pillY(k) - pillH(k) / 2 })).sort((a, b) => a.y - b.y)
    .forEach((q) => { const y = Math.max(q.y, pb + G); pp.set(q.k, { y, h: q.h, pill: true }); pb = y + q.h; });
  const lanes = plan.filter((a) => a.type === 'lane');
  lanes.forEach((a, j) => (a.lane = j));
  const LS = lanes.length ? 16 + lanes.length * 10 : 0;
  const all = [...pos.values(), ...pp.values()], minY = Math.min(...all.map((q) => q.y));
  all.forEach((q) => (q.y += P + 20 + LS - minY));
  const laneY = (j) => P + 20 + 8 + j * 10;
  // Порты: по порядку другого конца — линии у узла не перекрещиваются
  const rect = (E) => (E.pill ? pp.get(E.pill) : pos.get(E.node));
  const cy = (E) => { const r = rect(E); return r.y + r.h / 2; };
  ports.forEach((list, k) => {
    const key = k.slice(0, -1), r = list[0].S.key === key ? rect(list[0].S) : rect(list[0].T);
    const other = (a) => (a.S.key === key ? a.T : a.S);
    list.sort((p, q) => (p.type === 'lane' ? -1e6 : cy(other(p))) - (q.type === 'lane' ? -1e6 : cy(other(q))));
    const step = Math.min(12, (r.h - 12) / list.length);
    list.forEach((a, j) => { a.py = a.py || {}; a.py[k] = r.y + r.h / 2 + (j - (list.length - 1) / 2) * step; });
  });
  const py = (a, E) => a.py[E.key + a.side[E.key]];
  // ---- Дорожки в коридорах: вертикальный участок каждой стрелки — своя дорожка; не пересекающиеся по высоте делят дорожку ----
  const gaps = new Map(); // ключ: номер колонки слева от коридора; maxD — коридор перед «Вне ЦД»
  const use = (g, a, y1, y2, part) => { if (!gaps.has(g)) gaps.set(g, []); gaps.get(g).push({ a, l: Math.min(y1, y2), h: Math.max(y1, y2), part }); };
  plan.forEach((a) => {
    if (a.type === 'x') use(a.gap, a, py(a, a.S), py(a, a.T), 'v');
    else if (a.type === 'same') use(a.S.d, a, py(a, a.S), py(a, a.T), 'v');
    else if (a.type === 'pill') use(maxD, a, py(a, a.N), py(a, a.Pl), 'v');
    else { use(a.N.d, a, laneY(a.lane), py(a, a.N), 'up'); use(maxD, a, laneY(a.lane), py(a, a.Pl), 'down'); }
  });
  const ntr = new Map();
  gaps.forEach((list, g) => {
    const tracks = [];
    // Ближе к узлам — связи внутри колонки и между колонками, дальше — к плашкам «Вне ЦД»; внутри группы — короткие ближе
    const rank = (it) => ({ same: 0, x: 1, pill: 2, lane: 2 })[it.a.type];
    list.sort((p, q) => rank(p) - rank(q) || (p.h - p.l) - (q.h - q.l)).forEach((it) => {
      let k = tracks.findIndex((tr, i) => i >= (it.min || 0) && tr.every((o) => it.l > o.h + 34 || o.l > it.h + 34));
      if (k < 0) { k = tracks.length; tracks.push([]); }
      tracks[k].push(it); it.k = k;
      list.forEach((o) => { if (rank(o) > rank(it)) o.min = Math.max(o.min || 0, k + 1); });
    });
    ntr.set(g, tracks.length);
  });
  // ---- По горизонтали: коридор — по числу дорожек ----
  const gw = (g) => Math.max(g === maxD ? 120 : CGMIN, 44 + (ntr.get(g) || 0) * TS);
  const colX = [P];
  for (let d = 1; d <= maxD; d++) colX[d] = colX[d - 1] + W + gw(d - 1);
  const pxX = colX[maxD] + W + gw(maxD);
  const trX = (g, k) => colX[g] + W + 22 + k * TS;
  pos.forEach((q) => (q.x = colX[q.d]));
  pp.forEach((q) => (q.x = pxX));
  const CW = (pp.size || ntr.get(maxD) ? pxX + (pp.size ? PW : 0) : colX[maxD] + W) + P + 40;
  const CH = Math.max(...all.map((q) => q.y + q.h)) + P;
  // ---- Иерархия ----
  let lines = '', nodes = '';
  V.forEach((x) => {
    const q = pos.get(x);
    if (!q) return;
    const on = chain.includes(x), isNew = x.parent === n, tg = tgt.has(x);
    if (x.parent && pos.has(x.parent)) {
      const pq = pos.get(x.parent), x0 = pq.x + W, y0 = pq.y + pq.h / 2, x1 = q.x, y1 = q.y + q.h / 2, c = (x1 - x0) / 2;
      lines += `<path class="${on ? 'on' : isNew ? 'new' : tg ? 'tgt' : 'off'}" d="M${x0},${y0} C${x0 + c},${y0} ${x1 - c},${y1} ${x1},${y1}"/>`;
    }
    const kind = x.type === 'mod' ? ` k-${twKind(x.id)}` : '';
    nodes += `<button class="tr-nd tw-nd t-${x.type}${x.type === 'part' ? ' p-' + x.id : ''}${kind}${x === n ? ' cur' : on ? ' sel' : isNew ? ' new' : tg ? ' tgt' : ' dim'}" style="left:${q.x}px;top:${q.y}px;width:${W}px;height:${q.h}px" data-path="${twEsc(twKey(x))}" title="${twEsc(x.label)}">
      ${x.type === 'mod' ? `<i class="tr-dot k-${twKind(x.id)}"></i>` : ''}<b>${twEsc(x.label)}</b><span>${twEsc(twSub(x))}</span></button>`;
  });
  const pills = [...pp].map(([k, q]) => { const u = XA.pills.get(k); return `<div class="tw-pill g-${u.g.type}" style="left:${q.x}px;top:${q.y}px;width:${PW}px;height:${q.h}px" title="${twEsc(u.g.title)}"><span>${twEsc(u.g.title)}</span><b>${twEsc(k)}</b></div>`; }).join('');
  // ---- Стрелки: ортогонально, со скруглением; номер — на вертикальном участке своей дорожки ----
  const poly = (pts) => pts.map((p, i) => {
    if (!i || i === pts.length - 1) return (i ? 'L' : 'M') + p[0] + ',' + p[1];
    const [x0, y0] = pts[i - 1], [x2, y2] = pts[i + 1], r1 = Math.min(7, Math.hypot(p[0] - x0, p[1] - y0) / 2), r2 = Math.min(7, Math.hypot(x2 - p[0], y2 - p[1]) / 2);
    return `L${p[0] - Math.sign(p[0] - x0) * r1},${p[1] - Math.sign(p[1] - y0) * r1} Q${p[0]},${p[1]} ${p[0] + Math.sign(x2 - p[0]) * r2},${p[1] + Math.sign(y2 - p[1]) * r2}`;
  }).join(' ');
  const trOf = (a, part) => { for (const [g, list] of gaps) { const it = list.find((o) => o.a === a && (!part || o.part === part)); if (it) return trX(g, it.k); } return 0; };
  const edgeX = (E, side) => { const r = rect(E); return side === 'r' ? r.x + (E.pill ? PW : W) : r.x; };
  const boxes = all.map((q) => ({ l: q.x - 2, t: q.y - 2, r: q.x + (q.pill ? PW : W) + 2, b: q.y + q.h + 2 }));
  const placed = [];
  const free = (x, y) => { const r = { l: x - 12, t: y - 11, r: x + 12, b: y + 11 }; const hit = (z) => r.l < z.r && z.l < r.r && r.t < z.b && z.t < r.b; return !placed.some(hit) && !boxes.some(hit); };
  let xp = '', xb = '';
  plan.forEach((a) => {
    const { q, S, T } = a;
    const sx = edgeX(S, a.side[S.key]), sy = py(a, S), tx = edgeX(T, a.side[T.key]), ty = py(a, T);
    let pts, vx, v0, v1;
    if (a.type === 'lane') {
      const ly = laneY(a.lane), x1 = trOf(a, 'up'), x2 = trOf(a, 'down');
      const nx = edgeX(a.N, 'r'), ny = py(a, a.N), px = edgeX(a.Pl, 'l'), pyy = py(a, a.Pl);
      pts = [[nx, ny], [x1, ny], [x1, ly], [x2, ly], [x2, pyy], [px, pyy]];
      if (a.Pl === S) pts.reverse();
      vx = null; v0 = x1; v1 = x2;
    } else {
      vx = trOf(a);
      pts = [[sx, sy], [vx, sy], [vx, ty], [tx, ty]];
    }
    const k = q.ks.has('auto') ? 'auto' : [...q.ks][0], both = q.dirs.size > 1, ns = [...q.nums].sort((x, y) => x - y);
    xp += `<path class="tw-xp k-${k}" data-ns="${ns.join(' ')}" d="${poly(pts)}" marker-end="url(#twX-${k})"${both ? ` marker-start="url(#twX-${k})"` : ''}/>`;
    const ts = [0.5, 0.35, 0.65, 0.2, 0.8, 0.1, 0.9];
    const cand = vx !== null
      ? ts.map((t) => [vx, sy + (ty - sy) * t]).concat(ts.map((t) => [sx + (vx - sx) * t, sy]), ts.map((t) => [vx + (tx - vx) * t, ty]))
      : ts.map((t) => [v0 + (v1 - v0) * t, laneY(a.lane)]);
    const [bx, by] = cand.find(([x, y]) => free(x, y)) || cand[0];
    placed.push({ l: bx - 12, t: by - 11, r: bx + 12, b: by + 11 });
    xb += `<b class="ls-nb tw-xn k-${k}" data-ns="${ns.join(' ')}" style="left:${bx - 9}px;top:${by - 9}px" title="${twEsc(q.w.join('\n'))}">${ns.join(',')}</b>`;
  });
  const mk = (k, c) => `<marker id="twX-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${c}"/></marker>`;
  host.style.width = CW + 'px'; host.style.height = CH + 'px';
  host.classList.toggle('xon', plan.length > 0);
  host.innerHTML = `<svg width="${CW}" height="${CH}">${lines}</svg>${nodes}${pills}
    <svg class="tw-xs tw-xsv" width="${CW}" height="${CH}"><defs>${Object.entries(TW_KC).map(([k, c]) => mk(k, c)).join('')}</defs>${xp}</svg><div class="tw-xs tw-xbs">${xb}</div>
    <div class="tr-cv-l">${cols.map((col, i) => `<span style="left:${colX[i]}px">${TW_LEVELS[i]}${col.length > 1 ? ` · ${col.length}` : ''}</span>`).join('')}${pp.size ? `<span style="left:${pxX}px">Вне ЦД · ${pp.size}</span>` : ''}</div>`;
  host.querySelectorAll('.tw-xn').forEach((b) => {
    const ns = b.dataset.ns.split(' ').map(Number);
    b.onmouseenter = () => ns.forEach((no) => twXHot(no, true));
    b.onmouseleave = () => ns.forEach((no) => twXHot(no, false));
    b.onclick = () => twPick(ns[0] - 1);
  });
  const box = host.parentElement, cur = pos.get(n);
  box.scrollLeft = Math.max(0, cur.x + W + 300 - box.clientWidth + 30);
  box.scrollTop = Math.max(0, cur.y + cur.h / 2 - box.clientHeight / 2);
}

// ---------- Отрисовка ----------
function twRender() {
  const n = TW.node;
  const chain = []; for (let x = n; x; x = x.parent) chain.unshift(x);
  const kids = twKids(n);
  const typeT = n.type === 'mod' ? (n.def.ext ? 'Система' : n.part.id === 'data' && !/^ABAI/.test(n.id) ? 'Система данных' : 'Модуль ABAI') + ' · ' + n.part.t : TW_TYPES[n.type];
  document.querySelector('.tr-main').innerHTML = `
    <div class="tr-cv"><div class="tr-cv-in"></div></div>
    <div class="tr-detail">
      <div class="tw-depth">${TW_LEVELS.map((t, i) => `<span class="${i < n.depth ? 'was' : i === n.depth ? 'on' : ''}">${i ? '<i>›</i>' : ''}${t}</span>`).join('')}<em>уровень погружения ${n.depth + 1} из ${TW_LEVELS.length}</em></div>
      <div class="tr-crumbs">${chain.map((x, i) => `${i ? '<i>›</i>' : ''}<a href="#" data-path="${twEsc(twKey(x))}">${twEsc(x.label)}</a>`).join('')}</div>
      <div class="tr-head"><span class="tr-type tw-t-${n.type}">${twEsc(typeT)}</span>
        <h1>${twEsc(n.label)}${n.def && n.def.alt ? ` <em class="alt">(${twEsc(n.def.alt)})</em>` : ''}</h1></div>
      ${twSceneHTML(n)}
      <div class="tr-content">${twBody(n)}</div>
    </div>`;
  const X = TW.net ? twLinks(n) : null;
  twCanvas(document.querySelector('.tr-cv-in'), n, X);
  twScene(n, X);
  document.querySelectorAll('[data-kid]').forEach((b) => (b.onclick = () => { const k = twFind(twPath(n).concat(b.dataset.kid)); if (k) twGo(k); }));
  document.querySelectorAll('[data-chstep]').forEach((b) => (b.onclick = () => {
    const i = +b.dataset.chstep, s = n.P.s[i];
    let k = twKids(n).find((x) => x.s === s);
    if (!k) { k = twNode(n, 'step', s.c || 'i' + i, `${s.c || 'без номера'} ${s.t}`, { P: n.P, s }); n.kids = twKids(n).concat(k); }
    twGo(k);
  }));
  document.querySelectorAll('[data-path]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); twGo(twFind(a.dataset.path ? a.dataset.path.split('/').map(decodeURIComponent) : [])); }));
  document.querySelectorAll('.tr-content [data-go-sys]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); twGo(twModNode(a.dataset.goSys)); }));
  const nx = twNext(n), pv = twPrev(n);
  const bN = document.querySelector('[data-nav="1"]'), bP = document.querySelector('[data-nav="-1"]');
  bN.disabled = !nx; bP.disabled = !pv;
  bN.innerHTML = `Далее ▶${nx ? `<small>${twEsc(nx.label)}</small>` : ''}`;
  bP.innerHTML = `◀ Назад${pv ? `<small>${twEsc(pv.label)}</small>` : ''}`;
  document.querySelector('.tr-main').scrollTop = 0;
}
function twGo(n) {
  if (!n) return;
  TW.node = n;
  history.replaceState(null, '', '#' + twKey(n));
  twRender();
}
function twStart() {
  const p = location.hash.replace(/^#/, '').split('/').filter(Boolean).map(decodeURIComponent);
  twGo(twFind(p));
}
function twInit() {
  const h = document.getElementById('tr-hidden');
  abaiLandscape(h, TW_V, null);
  TW.grid = h.querySelector('.ls-grid');
  document.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => twGo(b.dataset.nav === '1' ? twNext(TW.node) : twPrev(TW.node))));
  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('select, input, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); twGo(twNext(TW.node)); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); twGo(twPrev(TW.node)); }
    else if (e.key === 'Backspace' && TW.node.parent) { e.preventDefault(); twGo(TW.node.parent); }
  });
  window.addEventListener('hashchange', () => { if (location.hash.replace(/^#/, '') !== twKey(TW.node)) twStart(); });
  lsTrailLoad().then(twStart);
}
twInit();
