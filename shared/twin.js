// Дерево ЦД Актива: показ «погружением» — от ЦД Актива к его частям (единые данные, ЦД пласта, скважины, добычи),
// модулям ABAI, процессам BPMN и шагам. На каждом уровне — ветви обмена данными с той подробностью, на которой мы сейчас:
// наверху части ЦД целиком, на уровне части — её модули, глубже — отдельные системы и шаги BPMN.
// Иерархия — по стратсессии 18.09.2026: сл. 54 (целевое видение: ЦД и слой данных), сл. 34 (соответствие Nedra ↔ ABAI),
// сл. 14 (интегрированная модель актива), сл. 55–56 (дорожная карта ЦД Актива: ЦД пласта, скважины, добычи, сквозной слой данных).
// Связи — LS_FLOWS (Dream TO BE), шаги — LS_TRAIL, место внешних систем — скрытая большая схема портала (abaiLandscape).

const TW_V = 'dream';
const TW = { node: null, root: null, grid: null, net: (() => { try { return localStorage.getItem('abai-tw-net') !== 'off'; } catch (e) { return true; } })() };
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
    ['Целевой вариант на ABAI: та же архитектура, бизнес-модули — продукты ABAI, единая база — ABAI БД 2.0, слой бизнес-интеграций — КХД', 'сл. 34, 54'],
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
// Уровни погружения: ЦД Актива → единые данные → двойники → модули и системы → процессы → шаги
const TW_LEVELS = ['ЦД Актива', 'Единые данные', 'Системы данных и двойники', 'Модули и системы', 'Процессы BPMN', 'Шаги BPMN'];
const twLevel = (n) => (n.type === 'akt' ? 0 : n.type === 'part' ? (n.id === 'data' ? 1 : 2) : n.type === 'mod' ? 3 : n.type === 'proc' ? 4 : 5);
// Подробность связей: 0 — ЦД Актива, 1 — часть, 2 — модуль и глубже
const twGrain = (n) => (n.type === 'akt' ? 0 : n.type === 'part' ? 1 : 2);
// Подпись колонки дерева — по типам узлов в ней
const TW_COLT = { pmr: 'Процессы модулей', pm: 'Модули', pp: 'Процессы BPMN', ps: 'Шаги BPMN', akt: 'ЦД Актива', part: 'Части ЦД', mod: 'Модули и системы', proc: 'Процессы BPMN', step: 'Шаги BPMN' };
const twColLabel = (col) => {
  if (col.length === 1 && col[0].type === 'part' && col[0].id === 'data') return 'Единые данные';
  if (col.some((x) => x.id === 'dsys')) return 'Системы данных · двойники';
  const tw = col.filter((x) => x.type === 'part'), md = col.filter((x) => x.type === 'mod');
  if (tw.length && md.length) return 'Системы данных · двойники';
  const cnt = {}; col.forEach((x) => (cnt[x.type] = (cnt[x.type] || 0) + 1));
  return Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]).map((t) => (t === 'part' ? 'Двойники' : TW_COLT[t])).join(' · ');
};
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
  // Двойники стоят на единых данных: ЦД Актива → единые данные (КХД, ABAI БД 2.0) → ЦД пласта, скважины, добычи
  if (n.type === 'akt') k = [twNode(n, 'part', 'data', TW_PART('data').t, { def: TW_PART('data') })];
  // Внутри единых данных: системы слоя (КХД, ABAI БД 2.0) — узлом рядом с двойниками, чтобы колонки были одного уровня
  else if (n.type === 'part' && n.id === 'data') k = [twNode(n, 'part', 'dsys', 'КХД и ABAI БД 2.0', { def: n.def, sub: 'системы единых данных: сбор, интеграции, единая база' })]
    .concat(TW_DEF.parts.filter((p) => p.id !== 'data').map((p) => twNode(n, 'part', p.id, p.t, { def: p })));
  else if (n.type === 'part') k = n.def.mods.map((m) => twNode(n, 'mod', m.sys, m.sys, { def: m, part: n.def }));
  else if (n.type === 'mod') k = lsTrailOf(TW_V, n.id).map(({ P, list }) => twNode(n, 'proc', P.p, `${P.p} ${P.t}`, { P, list }));
  else if (n.type === 'pmr') k = LS_MODS.map((m) => twNode(n, 'pm', m.id, m.name, { mod: m }));
  else if (n.type === 'pm') k = twTrail().filter((P) => P.m === n.id).map((P) => twNode(n, 'pp', P.p, `${P.p} ${P.t}`, { P }));
  else if (n.type === 'pp') k = n.P.s.map((s, i) => twNode(n, 'ps', s.c || 'i' + i, `${s.c || 'без номера'} ${s.t}`, { P: n.P, s }));
  else if (n.type === 'proc') k = n.list.map((i) => { const s = n.P.s[i]; return twNode(n, 'step', s.c || 'i' + i, `${s.c || 'без номера'} ${s.t}`, { P: n.P, s }); });
  n.kids = k;
  return k;
}
function twFind(path) {
  let n = twRoot();
  for (const seg of path) {
    let kid = twKids(n).find((k) => k.type + ':' + k.id === seg);
    // Старые адреса (#part:plast/…, #part:data/mod:КХД): узел теперь на уровень глубже
    if (!kid && (n.type === 'akt' || n.id === 'data')) for (const c of twKids(n)) { kid = twKids(c).find((k) => k.type + ':' + k.id === seg); if (kid) break; }
    if (!kid) break;
    n = kid;
  }
  return n;
}
const twPartPath = (id) => (id === 'data' ? ['part:data'] : ['part:data', 'part:' + id]);
const twModNode = (sys) => { const h = TW_IX.get(sys); return h ? twFind(twPartPath(h.p.id === 'data' ? 'dsys' : h.p.id).concat('mod:' + sys)) : null; };
const twPartNode = (id) => twFind(twPartPath(id));
// «Далее» раскрывает ЦД Актива и части до модулей; процессы и шаги — по клику
const twOpen = (x) => ['akt', 'part', 'pmr', 'pm', 'pp'].includes(x.type);
// Последовательный показ: обход по порядку до модулей; глубже «Далее» идёт по соседям
function twNext(n) {
  const kids = twOpen(n) ? twKids(n) : [];
  if (kids.length) return kids[0];
  for (let x = n; x.parent; x = x.parent) { const sib = twKids(x.parent); const i = sib.indexOf(x); if (i < sib.length - 1) return sib[i + 1]; }
  return null;
}
function twPrev(n) {
  if (!n.parent) return null;
  const sib = twKids(n.parent), i = sib.indexOf(n);
  if (i === 0) return n.parent;
  let x = sib[i - 1];
  for (;;) { const k = twOpen(x) ? twKids(x) : []; if (!k.length) return x; x = k[k.length - 1]; }
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
  if (n.type === 'pmr') return E.filter((e) => lsRefParts(e.r).some((p) => p.proc && twTrail().some((P) => P.p === p.proc)));
  if (n.type === 'pm') { const ps = new Set(twKids(n).map((x) => x.P.p)); return E.filter((e) => lsRefParts(e.r).some((p) => ps.has(p.proc))); }
  if (n.type === 'pp') return E.filter((e) => inProc(e, n.P));
  if (n.type === 'ps') return E.filter((e) => inProc(e, n.P, n.s.c));
  if (n.type === 'step') return E.filter((e) => inProc(e, n.P, n.s.c));
  const touch = E.filter((e) => keys.includes(e.f) || keys.includes(e.t));
  return n.type === 'proc' ? touch.filter((e) => inProc(e, n.P)) : touch;
}
// Связи на уровне узла: концы — узлы схемы этого уровня (twUnit); связи внутри одного свёрнутого узла — в счётчике «внутри».
// На верхних уровнях (ЦД Актива, часть) «туда» и «обратно» между двумя узлами — одна двусторонняя ветвь; глубже — каждое направление отдельно.
function twLinks(n) {
  const lvl = { depth: twGrain(n), part: n.type === 'part' ? n.id : null };
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
    pmr: ['Обмен между системами в процессах модулей', 'системы, связи которых записаны в шагах BPMN модулей'],
    pm: [`Обмен между системами: модуль «${n.label}»`, 'какие системы передают данные в процессах модуля'],
    pp: [`Обмен между системами: процесс ${n.P ? n.P.p : ''}`, 'связи систем, записанные в шагах процесса'],
    ps: [`Обмен между системами на шаге ${n.s ? n.s.c : ''}`, 'связи систем, записанные на этом шаге BPMN'],
  }[n.type];
  return `<section class="tw-scene${TW.net ? '' : ' off'}">
    <div class="tw-scene-h"><b>⇄ ${twEsc(head[0])}</b><span>${twEsc(head[1])}</span>
      <span class="tw-lsm" title="Подробно — по каждой связи шаги BPMN: исполнитель, системы, документы и аннотации">${[['simple', 'Простой'], ['full', 'Подробный']].map(([k, t]) => `<button data-lsm="${k}" class="${LS_MODE === k ? 'on' : ''}">${t}</button>`).join('')}</span>
      <button class="tw-net-t" title="Показать / скрыть ветви обмена данными">${TW.net ? 'Скрыть обмен данными' : 'Показать обмен данными'}</button></div>
    <div class="tw-scene-b"><div class="tw-net"></div><div class="tw-links"></div></div>
  </section>`;
}
function twScene(n, X) {
  const sec = document.querySelector('.tw-scene');
  if (!sec) return;
  sec.querySelectorAll('[data-lsm]').forEach((b) => (b.onclick = () => { LS_MODE = b.dataset.lsm; try { localStorage.setItem('abai-ls-mode', LS_MODE); } catch (e) {} twRender(); }));
  sec.querySelector('.tw-net-t').onclick = () => { TW.net = !TW.net; try { localStorage.setItem('abai-tw-net', TW.net ? 'on' : 'off'); } catch (e) {} twRender(); };
  if (!TW.net) return;
  const { L, units, inside } = X;
  const host = sec.querySelector('.tw-net'), list = sec.querySelector('.tw-links');
  if (!L.length) {
    host.innerHTML = `<p class="tr-n">${n.type === 'mod' ? `В шагах BPMN Dream TO BE обмен данными «${twEsc(n.label)}» с другими системами не описан, поэтому связи на схеме не показаны.` : n.type === 'step' ? 'На этом шаге передача данных между системами в BPMN не записана.' : n.type === 'proc' ? 'В этом процессе связи модуля с другими системами в BPMN не записаны.' : 'На этом уровне связей схемы нет.'}</p>`;
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
  const full = LS_MODE === 'full';
  const dirHTML = (d, e) => {
    const same = d.items.length === 1 && d.items[0].f === d.f && d.items[0].t === d.t;
    return `<div class="tw-lt"><span class="tw-u">${twEsc(d.f)}</span> <i>→</i> <span class="tw-u">${twEsc(d.t)}</span> — ${twEsc(d.w)}</div>
      ${!d.items.length ? `<em>${LS_KINDS[e.k]} · ${twEsc(e.r)}</em>`
    : same ? `<em>${LS_KINDS[d.items[0].k]} · ${twEsc(d.items[0].r)}</em>${lsRefSlides(TW_V, d.items[0].r)}${full ? `<div class="tw-det">${lsDetail(d.items[0], TW_V)}</div>` : ''}`
      : `<details${full ? ' open' : ''}><summary>${d.items.length} ${twPlural(d.items.length, 'связь', 'связи', 'связей')} систем · шаги BPMN</summary><ul class="ls-ab-l">${d.items.map((x) => `<li>${sysA(x.f)} → ${sysA(x.t)} — ${twEsc(x.w)}<em>${LS_KINDS[x.k]} · ${twEsc(x.r)}</em>${lsRefSlides(TW_V, x.r)}${full ? `<div class="tw-det">${lsDetail(x, TW_V)}</div>` : ''}</li>`).join('')}</ul></details>`}`;
  };
  list.innerHTML = `${ins.length ? `<p class="tw-ins">${ins.join('')}<em>— видны при погружении</em></p>` : ''}
    <ol class="tw-ll">${L.map((e, i) => `<li class="k-${e.k}" data-l="${i}"><b class="ls-nb k-${e.k}">${e.n}</b>
      <div>${e.ima ? `<div class="tw-lt"><span class="tw-u">${twEsc(e.f)}</span> <i>⇄</i> <span class="tw-u">${twEsc(e.t)}</span> — ${twEsc(e.w)}</div><em>${LS_KINDS.ima}</em>`
    : e.both ? `<div class="tw-lh"><span class="tw-u">${twEsc(e.f)}</span> <i>⇄</i> <span class="tw-u">${twEsc(e.t)}</span></div>${e.dirs.map((d) => `<div class="tw-ld">${dirHTML(d, e)}</div>`).join('')}`
      : dirHTML(e.dirs[0], e)}</div></li>`).join('')}</ol>`;
  list.querySelectorAll('[data-l]').forEach((li) => { const no = L[+li.dataset.l].n; li.onmouseenter = () => { if (host._hot) host._hot(+li.dataset.l); if (TW.mode !== 'pm') twXHot(no, true); }; li.onmouseleave = () => { if (host._hot) host._hot(null); if (TW.mode !== 'pm') twXHot(no, false); }; });
  list.querySelectorAll('[data-go-sys]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); twGo(twModNode(a.dataset.goSys)); }));
}
function twPick(i) {
  if (TW.mode === 'scen') return twScenGo(TW.sc, i + 1);
  if (TW.mode === 'pm') { const li = document.querySelector(`[data-bl="${i + 1}"]`); if (li) { li.scrollIntoView({ behavior: 'smooth', block: 'center' }); li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash'); } return; }
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
function twKidCards(n, sub, only) {
  return `<div class="tw-kids">${twKids(n).filter((k) => !only || (k.type === only && k.id !== 'dsys')).map((k) => `<button class="tw-kid t-${k.type} k-${k.type === 'mod' ? twKind(k.id) : ''}" data-kid="${twEsc(k.type + ':' + k.id)}">
    <b>${twEsc(k.label)}${k.def && k.def.alt ? ` <em class="alt">(${twEsc(k.def.alt)})</em>` : ''}${k.type === 'mod' ? lsPfIcon(k.id) : ''}</b><span>${twEsc(sub(k))}</span></button>`).join('')}</div>`;
}
function twStepsCount(sys) { const st = lsTrailOf(TW_V, sys); return { n: st.reduce((s, x) => s + x.list.length, 0), p: st.length }; }
function twSub(k) {
  if (k.type === 'akt') return 'единые данные · ЦД пласта · ЦД скважины · ЦД добычи';
  if (k.type === 'part') return k.sub || k.def.sub || k.def.mods.map((m) => twShort(m.sys)).join(' · ');
  if (k.type === 'mod') { const c = twStepsCount(k.id); return `${k.def && k.def.alt ? '(' + k.def.alt + ') · ' : ''}${c.n ? `${c.n} ${twPlural(c.n, 'шаг', 'шага', 'шагов')} BPMN · ${c.p} ${twPlural(c.p, 'процесс', 'процесса', 'процессов')}` : 'в шагах BPMN нет'}`; }
  if (k.type === 'proc') return `${LS_MOD_NAME[k.P.m]} · ${k.list.length} ${twPlural(k.list.length, 'шаг', 'шага', 'шагов')} с ${twShort(k.parent.id)}`;
  if (k.type === 'step' || k.type === 'ps') return lsRole(k.s);
  if (k.type === 'pmr') return `${LS_MODS.length} модуля · ${twTrail().length} процессов Dream TO BE`;
  if (k.type === 'pm') { const L = twTrail().filter((P) => P.m === k.id); return `${L.length} ${twPlural(L.length, 'процесс', 'процесса', 'процессов')} · ${L.reduce((t, P) => t + P.s.length, 0)} шагов`; }
  if (k.type === 'pp') return `${LS_MOD_NAME[k.P.m]} · ${k.P.s.length} ${twPlural(k.P.s.length, 'шаг', 'шага', 'шагов')}`;
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
      <h3>Из чего состоит <span>основа — единые данные, на них стоят двойники по ходу производства · клик — погрузиться</span></h3>
      <div class="tw-kids">${TW_DEF.parts.map((p) => twPartNode(p.id)).map((k, i) => `<button class="tw-kid t-part${i ? '' : ' p-data'}" data-path="${twEsc(twKey(k))}"><b>${i ? '↳ ' : ''}${twEsc(k.label)}</b><span>${twEsc(k.def.lead)}</span></button>`).join('')}</div>
      <h3>Интегрированная модель актива ${twSrc('сл. 14')}</h3>
      <div class="tw-ima">${[['Пласт', 'давление, насыщенность, закачка', 'приток, пластовое давление, обводнённость', 'plast'], ['Скважина', 'конструкция скважины, режимы работы', 'режимы, дебиты, ограничения ГНО', 'skv'], ['Инфраструктура', 'наземные объекты, сбор, транспортировка, сдача', 'пропускная способность, мощности, возможности сдачи', 'dob']].map(([t, a, b, id]) => `<button data-kid="part:${id}"><b>${t}</b><span>${a}</span><em>${b}</em></button>`).join('<i>⇄</i>')}</div>
      <p class="tr-n">Модели пласта, скважины и инфраструктуры синхронизируются с автоматическим пересчётом сценариев при изменениях; потенциал ищется на всех элементах производственной цепочки, решения считаются с учётом влияния на смежные узлы (сл. 14).</p>
      <h3>Десктоп или веб <span>как работают с системами ЦД и инженерным ПО · значок — и на дереве</span></h3>
      ${lsPfTable(TW_DEF.parts.flatMap((p) => p.mods.map((m) => m.sys)).concat(Object.keys(LS_PLATFORM).filter((k) => !TW_IX.has(k) && !/^(ИС )?ABAI/.test(k))), { link: (k) => (TW_IX.has(k) ? `<a href="#" class="tr-s k-${twKind(k)}" data-go-sys="${twEsc(k)}">${twEsc(k)}</a>${TW_IX.get(k).m.alt ? ` <em class="alt">(${twEsc(TW_IX.get(k).m.alt)})</em>` : ''}` : twEsc(k)) })}
      <h3>Что даёт ЦД <span>встреча по ЦД 01.10 · клик — процесс в мокапе</span></h3>
      <div class="tw-val">${LS_VALUE.map(([t, d, ps]) => `<div><b>${t}</b><span>${d}</span><div>${ps.map(([m, p]) => `<a href="${lsModHref(m, 'v1')}index.html#/" target="_blank">${p}</a>`).join('')}</div></div>`).join('')}</div>
      <h3>Дорожная карта внедрения — Восточный Молдабек, октябрь 2026 – январь 2027</h3>
      <ol class="tw-road">${TW_DEF.road.map(([t, d, s]) => `<li><b>${t}</b><span>${d}${twSrc(s)}</span></li>`).join('')}</ol>`;
  }
  if (n.type === 'part') {
    const D = LS_BLOCKS[n.def.block];
    return `<p class="tr-lead">${twEsc(n.def.lead)}</p>
      <h3>${n.id === 'data' ? 'Системы слоя' : 'Модули ABAI'} <span>в скобках — продукт Nedra, который заменяет модуль (сл. 34) · клик — погрузиться</span></h3>
      ${n.id === 'data' ? twKidCards(twKids(n)[0], (k) => twSub(k).replace(/^\(.*?\) · /, ''), 'mod') : twKidCards(n, (k) => twSub(k).replace(/^\(.*?\) · /, ''), 'mod')}
      ${n.id === 'data' ? `<h3>Двойники на единых данных <span>читают и пишут через КХД и ABAI БД 2.0 · клик — погрузиться</span></h3>${twKidCards(n, (k) => k.def.lead, 'part')}` : ''}
      ${n.id === 'data' ? `<ul class="tw-what">${twList(D.what)}</ul>` : `<ul class="tw-what">${twList(D.what.slice(0, 1))}</ul>`}
      ${twBlockHTML(n.id === 'data' ? Object.assign({}, D, { what: [] }) : D)}`;
  }
  if (n.type === 'mod') {
    const m = n.def, desc = Object.entries(typeof ABAI_SYS_DESC !== 'undefined' ? ABAI_SYS_DESC : {}).filter(([x]) => lsKey(x) === n.id).flatMap(([, l]) => l);
    const P = twKids(n);
    const pf = lsPf(n.id), alt = m.alt && lsPf(m.alt);
    return `${pf || alt ? `<h3>Как с ним работают <span>десктоп или веб</span></h3>${pf ? lsPfLine(n.id) : ''}${alt ? `<div class="tw-pf-alt">Заменяемый продукт ${twEsc(m.alt)}: ${lsPfLine(m.alt)}</div>` : ''}` : ''}
      ${m.f ? `<h3>Что делает</h3><ul class="tw-what">${twList(m.f)}</ul>` : ''}
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
    ${(() => { const i = n.list.find((j) => P.s[j].v); return i === undefined ? '' : twSlideHTML(P, P.s[i], `Как выглядит в ABAI: «${twEsc(ctx)}» в процессе`); })()}
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
  const lvl = { depth: twGrain(n), part: n.type === 'part' ? n.id : null };
  const keys = twKeysOf(n) || [];
  // Шаг процесса pr, на котором система отдаёт (side 'f') / принимает ('t') данные: «Р1 1.10 → 1.11» — отдаёт на 1.10, принимает на 1.11
  const stepIn = (pr, e, side) => {
    const codes = lsRefParts(e.r).filter((p) => p.proc === pr.P.p && p.codes).flatMap((p) => (p.arrow && p.codes.length === 2 ? [p.codes[side === 'f' ? 0 : 1]] : p.codes));
    return twKids(pr).find((x) => codes.some((c) => x.s.c === c || x.s.c.startsWith(c + '.')));
  };
  const end = (k, e, side) => {
    const u = twUnit(k, lvl);
    if (!u.nav) return { pill: u.k, u };
    if (twGrain(n) >= 2 && keys.includes(k)) {
      // Своя система: у модуля — тот его процесс, где записан обмен; у процесса — тот шаг
      if (e && n.type === 'mod') { const procs = lsRefParts(e.r).map((p) => p.proc).filter(Boolean); const pr = twKids(n).find((x) => procs.includes(x.P.p)); if (pr) return { node: pr }; }
      if (e && n.type === 'proc') { const st = stepIn(n, e, side); if (st) return { node: st }; }
      return { node: n };
    }
    let t = u.nav();
    if (t && (n.type === 'proc' || n.type === 'step') && t.type === 'mod') {
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
  if (!on && TW.mode === 'scen' && TW.scStep) twXHot(TW.scStep, true);
}

// ---------- Дерево схемой: колонки уровней слева направо, линии от родителя к детям; поверх — ветви обмена данными ----------
function twCanvas(host, n, X) {
  const W = 290, H0 = 60, G = 10, GG = 26, P = 14, PW = 210, PH0 = 44, TS = 24, CGMIN = 64;
  const chain = []; for (let x = n; x; x = x.parent) chain.unshift(x);
  const XA = X && X.XA ? X.XA : X ? twTreeLinks(n, X) : { arrows: [], pills: new Map(), nodes: new Set() };
  const scen = !!(X && X.scen);
  // Видимые узлы: путь к текущему с соседями, дети текущего; ветви, куда / откуда идут данные, — путём от корня
  const R0 = (X && X.root) || twRoot();
  const V = new Set([R0]), tgt = new Set();
  chain.forEach((c) => { if (c.parent) twKids(c.parent).forEach((k) => V.add(k)); });
  twKids(n).forEach((k) => V.add(k));
  XA.nodes.forEach((t) => { for (let x = t; x; x = x.parent) { if (!V.has(x) || (scen && x.parent)) tgt.add(x); V.add(x); } });
  XA.nodes.forEach((t) => { if (t !== n && !chain.includes(t)) tgt.add(t); });
  const cols = [];
  const walk = (x) => { (cols[x.depth] = cols[x.depth] || []).push(x); twKids(x).filter((k) => V.has(k)).forEach(walk); };
  walk(R0);
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
    if (S.pill && T.pill) { a.type = 'pp'; a.side[S.key] = 'r'; a.side[T.key] = 'r'; plan.push(a); return; }
    if (S.pill || T.pill) {
      const N = S.pill ? T : S, Pl = S.pill ? S : T;
      if (!N.node) return;
      a.type = N.d === maxD ? 'pill' : 'lane'; a.N = N; a.Pl = Pl;
      a.side[N.key] = 'r'; a.side[Pl.key] = 'l';
    } else if (S.d === T.d) { a.type = 'same'; a.side[S.key] = 'r'; a.side[T.key] = 'r'; }
    else {
      // Через колонку и дальше — по дорожке над деревом (xlane), чтобы не идти поперёк узлов промежуточной колонки
      const L = S.d < T.d ? S : T, R = L === S ? T : S;
      a.type = R.d - L.d > 1 ? 'xlane' : 'x'; a.L = L; a.R = R; a.side[L.key] = 'r'; a.side[R.key] = 'l'; a.gap = R.d - 1;
    }
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
      // Шаги процесса — с промежутком под стрелку последовательности
      const gap = g.l[0].type === 'ps' || g.l[0].type === 'step' ? 24 : G;
      const hs = g.l.map(hOf), gh = hs.reduce((s, v) => s + v, 0) + gap * (g.l.length - 1);
      let top = g.p ? pos.get(g.p).y + pos.get(g.p).h / 2 - gh / 2 : 0;
      if (top < bottom + GG) top = bottom + GG;
      let y = top;
      g.l.forEach((x, j) => { pos.set(x, { y, h: hs[j], d, j }); y += hs[j] + gap; });
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
  const lanes = plan.filter((a) => a.type === 'lane' || a.type === 'xlane');
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
    const up = (a) => a.type === 'lane' || a.type === 'xlane';
    list.sort((p, q) => (up(p) ? -1e6 + p.lane : cy(other(p))) - (up(q) ? -1e6 + q.lane : cy(other(q))));
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
    else if (a.type === 'pp') use(maxD + 1, a, py(a, a.S), py(a, a.T), 'v');
    else if (a.type === 'pill') use(maxD, a, py(a, a.N), py(a, a.Pl), 'v');
    else if (a.type === 'xlane') { use(a.L.d, a, laneY(a.lane), py(a, a.L), 'up'); use(a.R.d - 1, a, laneY(a.lane), py(a, a.R), 'down'); }
    else { use(a.N.d, a, laneY(a.lane), py(a, a.N), 'up'); use(maxD, a, laneY(a.lane), py(a, a.Pl), 'down'); }
  });
  const ntr = new Map();
  gaps.forEach((list, g) => {
    const tracks = [];
    // Ближе к узлам — связи внутри колонки и между колонками, дальше — к плашкам «Вне ЦД»; внутри группы — короткие ближе
    const rank = (it) => ({ same: 0, pp: 0, x: 1, xlane: 2, pill: 2, lane: 2 })[it.a.type];
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
  const trX = (g, k) => (g > maxD ? pxX + PW + 22 : colX[g] + W + 22) + k * TS;
  pos.forEach((q) => (q.x = colX[q.d]));
  pp.forEach((q) => (q.x = pxX));
  const CW = (pp.size || ntr.get(maxD) ? pxX + (pp.size ? PW : 0) : colX[maxD] + W) + P + 40 + (ntr.get(maxD + 1) ? 30 + ntr.get(maxD + 1) * TS : 0);
  const CH = Math.max(...all.map((q) => q.y + q.h)) + P;
  // ---- Последовательность шагов по BPMN (s.nx): стрелки между видимыми шагами одного процесса ----
  const isStep = (x) => x.type === 'ps' || x.type === 'step';
  const byParent = new Map();
  V.forEach((x) => { if (isStep(x) && pos.has(x)) { if (!byParent.has(x.parent)) byParent.set(x.parent, new Map()); byParent.get(x.parent).set(x.P.s.indexOf(x.s), x); } });
  const seq = [], hasPred = new Set();
  byParent.forEach((m) => m.forEach((x) => (x.s.nx || []).forEach(([t, cond]) => { const y = typeof t === 'number' && m.get(t); if (y && y !== x) { seq.push({ a: x, b: y, cond }); hasPred.add(y); } })));
  // Дорожки дуг: длинные переходы — дальше от колонки, чтобы не сливались
  seq.forEach((q) => { const A = pos.get(q.a), B = pos.get(q.b); q.y1 = A.y + A.h - 14; q.y2 = B.y + 14; q.l = Math.min(q.y1, q.y2); q.h = Math.max(q.y1, q.y2); });
  const lanesSq = [];
  seq.filter((q) => pos.get(q.b).j !== pos.get(q.a).j + 1).sort((p, q) => (p.h - p.l) - (q.h - q.l)).forEach((q) => { let k = lanesSq.findIndex((L) => L.every((o) => q.l > o.h + 4 || o.l > q.h + 4)); if (k < 0) { k = lanesSq.length; lanesSq.push([]); } lanesSq[k].push(q); q.k = k; });
  let sqPaths = '';
  seq.forEach((q) => {
    const A = pos.get(q.a), B = pos.get(q.b);
    // Соседний шаг ниже — прямая стрелка вниз; переход к несоседнему (развилка, возврат) — дуга слева
    if (B.j === A.j + 1) { const x = A.x + 34; sqPaths += `<path class="sq${q.cond ? ' br' : ''}" d="M${x},${A.y + A.h} L${x},${B.y}" marker-end="url(#twSqA)"/>`; return; }
    const x0 = A.x, bulge = Math.min(14 + q.k * 7, 52);
    sqPaths += `<path class="sq${q.cond ? ' br' : ''}" d="M${x0},${q.y1} C${x0 - bulge},${q.y1} ${x0 - bulge},${q.y2} ${x0},${q.y2}" marker-end="url(#twSqA)"/>`;
  });
  // ---- Иерархия ----
  let lines = '', nodes = '';
  V.forEach((x) => {
    const q = pos.get(x);
    if (!q) return;
    const on = chain.includes(x), isNew = x.parent === n, tg = tgt.has(x);
    if (x.parent && pos.has(x.parent) && !(hasPred.has(x) && !on)) {
      const pq = pos.get(x.parent), x0 = pq.x + W, y0 = pq.y + pq.h / 2, x1 = q.x, y1 = q.y + q.h / 2, c = (x1 - x0) / 2;
      lines += `<path class="${on ? 'on' : isNew ? 'new' : tg ? 'tgt' : 'off'}" d="M${x0},${y0} C${x0 + c},${y0} ${x1 - c},${y1} ${x1},${y1}"/>`;
    }
    const kind = x.type === 'mod' ? ` k-${twKind(x.id)}` : '';
    nodes += `<button class="tr-nd tw-nd t-${x.type}${x.type === 'part' ? ' p-' + x.id : ''}${kind}${scen ? (tg ? ' tgt' : x === n ? ' sel' : ' dim') : x === n ? ' cur' : on ? ' sel' : isNew ? ' new' : tg ? ' tgt' : ' dim'}" style="left:${q.x}px;top:${q.y}px;width:${W}px;height:${q.h}px" data-path="${twEsc(twKey(x))}" title="${twEsc(x.label)}">
      ${x.type === 'mod' ? `<i class="tr-dot k-${twKind(x.id)}"></i>` : ''}<b>${twEsc(x.label)}</b>${x.type === 'mod' ? lsPfIcon(x.id).replace('class="ls-pf ', 'class="ls-pf tw-pfc ') : ''}<span>${twEsc(twSub(x))}</span></button>`;
  });
  const pills = [...pp].map(([k, q]) => { const u = XA.pills.get(k); return `<div class="tw-pill g-${u.g.type}" style="left:${q.x}px;top:${q.y}px;width:${PW}px;height:${q.h}px" title="${twEsc(u.g.title)}"><span>${twEsc(u.g.title)}</span><b>${twEsc(k)}</b>${lsPfIcon(k).replace('class="ls-pf ', 'class="ls-pf tw-pfc ')}</div>`; }).join('');
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
    if (a.type === 'lane' || a.type === 'xlane') {
      const A0 = a.type === 'lane' ? a.N : a.L, B0 = a.type === 'lane' ? a.Pl : a.R;
      const ly = laneY(a.lane), x1 = trOf(a, 'up'), x2 = trOf(a, 'down');
      const nx = edgeX(A0, 'r'), ny = py(a, A0), px = edgeX(B0, 'l'), pyy = py(a, B0);
      pts = [[nx, ny], [x1, ny], [x1, ly], [x2, ly], [x2, pyy], [px, pyy]];
      if (B0 === S) pts.reverse();
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
  host.innerHTML = `<svg width="${CW}" height="${CH}"><defs><marker id="twSqA" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:#8a6fb5"/></marker></defs>${lines}${sqPaths}</svg>${nodes}${pills}
    <svg class="tw-xs tw-xsv" width="${CW}" height="${CH}"><defs>${Object.entries(TW_KC).map(([k, c]) => mk(k, c)).join('')}</defs>${xp}</svg><div class="tw-xs tw-xbs">${xb}</div>
    <div class="tr-cv-l">${cols.map((col, i) => `<span style="left:${colX[i]}px">${twColLabel(col)}${col.length > 1 ? ` · ${col.length}` : ''}</span>`).join('')}${pp.size ? `<span style="left:${pxX}px">${(X && X.pillLabel) || 'Вне ЦД'} · ${pp.size}</span>` : ''}</div>`;
  host.querySelectorAll('.tw-xn').forEach((b) => {
    const ns = b.dataset.ns.split(' ').map(Number);
    b.onmouseenter = () => ns.forEach((no) => twXHot(no, true));
    b.onmouseleave = () => ns.forEach((no) => twXHot(no, false));
    b.onclick = () => twPick(ns[0] - 1);
  });
  const box = host.parentElement, cur = pos.get(n);
  if (scen) { box.scrollLeft = 0; box.scrollTop = 0; return; }
  box.scrollLeft = Math.max(0, cur.x + W + 300 - box.clientWidth + 30);
  box.scrollTop = Math.max(0, cur.y + cur.h / 2 - box.clientHeight / 2);
}

// ---------- Схема BPMN процесса (Dream TO BE) — доп. блок внизу карточки модуля, процесса и шага ----------
// Данные — <модуль>/js/bpmn-data.js (те же, что у вкладки «Схемы BPMN» прототипа). У всех модулей переменная называется BPMN,
// поэтому каждый файл подгружается в своём скрытом iframe — без конфликта имён.
const TW_BPMN = {};
function twBpmnLoad(m) {
  if (!TW_BPMN[m]) {
    TW_BPMN[m] = new Promise((ok) => {
      const f = document.createElement('iframe');
      f.style.display = 'none'; f.setAttribute('aria-hidden', 'true');
      document.body.appendChild(f);
      const d = f.contentDocument;
      d.open(); d.write('<!doctype html><html><head></head><body></body></html>'); d.close();
      const s = d.createElement('script');
      s.src = new URL(lsModHref(m, 'v1') + 'js/bpmn-data.js', location.href).href;
      s.onload = () => { try { ok(f.contentWindow.eval('BPMN')); } catch (e) { ok(null); } };
      s.onerror = () => ok(null);
      d.head.appendChild(s);
    });
  }
  return TW_BPMN[m];
}
// Процесс и модуль, по которым строится схема: у процесса и шага — свой процесс, у модуля — выбранный во вкладках
function twBpmnCtx(n) {
  if (n.type === 'scen') { const L = TW.scProcs || []; return L.length ? { procNode: L.find((x) => x.P.p === TW.bpTab['sc:' + n.id]) || L[0], mod: null, list: L, me: TW.scMe, tabKey: 'sc:' + n.id } : null; }
  if (n.type === 'ps') return { procNode: n.parent, mod: null, list: [n.parent], me: new Set(), label: 'текущий шаг' };
  if (n.type === 'proc') return { procNode: n, mod: n.parent, list: [n] };
  if (n.type === 'step') return { procNode: n.parent, mod: n.parent.parent, list: [n.parent] };
  if (n.type === 'mod') { const L = twKids(n); return L.length ? { procNode: L.find((x) => x.P.p === TW.bpTab[n.id]) || L[0], mod: n, list: L } : null; }
  return null;
}
TW.bpTab = {};
TW.bpZoom = 0.7;
function twBpmnHTML(n) {
  const c = twBpmnCtx(n);
  if (!c) return '';
  const P = c.procNode.P;
  return `<section class="tw-bp">
    <div class="tw-bp-h"><b>Схема BPMN процесса · Dream TO BE</b><span>полная схема из файла BPMN · выделены ${c.label || (c.mod ? `шаги с «${twEsc(c.mod.id)}»` : 'шаги сценария')}${n.type === 'step' ? ', текущий шаг — жёлтой рамкой' : ''} · клик по шагу — открыть его в дереве</span>
      <a class="ls-slide" href="${lsModHref(P.m, 'v1')}index.html#/p/${P.n}/bpmn/dream" target="_blank">схема в прототипе ↗</a></div>
    ${c.list.length > 1 ? `<div class="tw-bp-tabs">${c.list.map((x) => `<button data-bptab="${twEsc(x.P.p)}" class="${x === c.procNode ? 'on' : ''}">${twEsc(x.P.p)}<span>${twEsc(x.P.t)}</span></button>`).join('')}</div>` : ''}
    <div class="tw-bp-bar"><span class="tw-bp-t">${twEsc(P.p)} ${twEsc(P.t)}</span>
      <span class="lg"><i class="d-abai"></i>ABAI</span><span class="lg"><i class="d-ext"></i>другие системы</span><span class="lg"><i class="me"></i>${c.label || (c.mod ? `шаг с «${twEsc(twShort(c.mod.id))}»` : 'шаг сценария')}</span>
      <span class="spacer"></span><span class="tw-bp-z"><button data-bpz="-1">−</button><b>${Math.round(TW.bpZoom * 100)} %</b><button data-bpz="1">+</button></span></div>
    <div class="tw-bp-canvas"><p class="tr-n">Загрузка схемы…</p></div>
  </section>`;
}
function twBpmnFill(n) {
  const c = twBpmnCtx(n), sec = document.querySelector('.tw-bp');
  if (!c || !sec) return;
  sec.querySelectorAll('[data-bptab]').forEach((b) => (b.onclick = () => { TW.bpTab[c.tabKey || n.id] = b.dataset.bptab; twBpmnRefresh(n); }));
  sec.querySelectorAll('[data-bpz]').forEach((b) => (b.onclick = () => { TW.bpZoom = Math.max(0.3, Math.min(1.2, +(TW.bpZoom + 0.1 * +b.dataset.bpz).toFixed(2))); twBpmnRefresh(n); }));
  const P = c.procNode.P, host = sec.querySelector('.tw-bp-canvas');
  twBpmnLoad(P.m).then((B) => {
    if (!host.isConnected) return;
    const proc = B && B.find((x) => x.num === P.n), pl = proc && proc.pools.find((x) => x.variant === 'dream');
    if (!pl) { host.innerHTML = '<p class="tr-n">Схема Dream TO BE для этого процесса в файле BPMN не найдена.</p>'; return; }
    const me = c.me || new Set(c.procNode.list.map((i) => P.s[i].id)), cur = n.type === 'step' || n.type === 'ps' ? n.s.id : null;
    host.innerHTML = twBpmnDraw(pl, me, cur, TW.bpZoom);
    // Клик по шагу схемы — этот шаг в дереве (внутри процесса текущего модуля)
    host.querySelectorAll('[data-bpn]').forEach((g) => (g.onclick = () => {
      const i = P.s.findIndex((s) => s.id === g.dataset.bpn);
      if (i < 0) return;
      const pn = c.procNode, s = P.s[i];
      let k = twKids(pn).find((x) => x.s === s);
      if (!k) { k = twNode(pn, 'step', s.c || 'i' + i, `${s.c || 'без номера'} ${s.t}`, { P, s }); pn.kids = twKids(pn).concat(k); }
      twGo(k);
    }));
    // Прокрутка: к текущему шагу, иначе — к первому шагу модуля, иначе — к началу процесса
    const focus = pl.nodes.find((x) => x.id === cur) || pl.nodes.find((x) => me.has(x.id)) || pl.nodes.find((x) => x.type === 'startEvent') || pl.nodes[0];
    if (focus) { host.scrollLeft = Math.max(0, focus.x * TW.bpZoom - 200); host.scrollTop = Math.max(0, focus.y * TW.bpZoom - host.clientHeight / 3); }
  });
}
function twBpmnRefresh(n) {
  const sec = document.querySelector('.tw-bp');
  if (!sec) return;
  sec.outerHTML = twBpmnHTML(n);
  twBpmnFill(n);
}
// Отрисовка пула BPMN по координатам из файла: дорожки, шаги (с точками систем), события, шлюзы, стрелки
function twBpmnDraw(pl, me, cur, k) {
  const dot = (s) => { const kd = twKind(lsKey(s)); return kd === 'abai' ? 'abai' : kd === 'nedra' ? 'nedra' : kd === 'manual' ? 'manual' : 'ext'; };
  const nodes = pl.nodes.map((nd) => {
    if (nd.kind === 'task' || nd.kind === 'link') {
      const dots = nd.kind === 'link' ? '' : nd.sys.map((s, i) => `<circle cx="${nd.x + 10 + i * 13}" cy="${nd.y + nd.h + 10}" r="5" class="d-${dot(s)}"><title>${twEsc(s)}</title></circle>`).join('');
      return `<g class="bn task${nd.kind === 'link' ? ' link' : ''}${me.has(nd.id) ? ' me' : ''}${nd.id === cur ? ' cur' : ''}"${nd.kind === 'task' ? ` data-bpn="${twEsc(nd.id)}"` : ''}>
        <title>${twEsc((nd.code ? nd.code + ' ' : '') + nd.title)}${nd.sys.length ? ' · ' + twEsc(nd.sys.join(', ')) : ''}</title>
        <rect x="${nd.x}" y="${nd.y}" width="${nd.w}" height="${nd.h}" rx="10"/>
        <foreignObject x="${nd.x + 4}" y="${nd.y + 3}" width="${nd.w - 8}" height="${nd.h - 6}"><div xmlns="http://www.w3.org/1999/xhtml" class="bn-t">${nd.code ? `<b>${twEsc(nd.code)}</b> ` : ''}${twEsc(nd.title)}</div></foreignObject>${dots}</g>`;
    }
    if (nd.kind === 'event') {
      const r = nd.w / 2;
      return `<g class="bn ev ${nd.type}"><circle cx="${nd.x + r}" cy="${nd.y + r}" r="${r}"/><foreignObject x="${nd.x - 60}" y="${nd.y + nd.h + 2}" width="${nd.w + 120}" height="60"><div xmlns="http://www.w3.org/1999/xhtml" class="bn-l">${twEsc(nd.name)}</div></foreignObject></g>`;
    }
    const cx = nd.x + nd.w / 2, cy = nd.y + nd.h / 2;
    return `<g class="bn gw"><path d="M${cx},${nd.y} L${nd.x + nd.w},${cy} L${cx},${nd.y + nd.h} L${nd.x},${cy} z"/><text x="${cx}" y="${cy + 7}" text-anchor="middle" class="gw-s">${nd.type === 'parallelGateway' ? '+' : '×'}</text>
      ${nd.name ? `<foreignObject x="${nd.x - 70}" y="${nd.y - 46}" width="${nd.w + 140}" height="44"><div xmlns="http://www.w3.org/1999/xhtml" class="bn-l gw-l">${twEsc(nd.name)}</div></foreignObject>` : ''}</g>`;
  }).join('');
  const flows = pl.flows.filter((f) => f.wp.length > 1).map((f) => {
    const d = f.wp.map((q, i) => `${i ? 'L' : 'M'}${q[0]},${q[1]}`).join(' ');
    const a = f.wp[Math.floor((f.wp.length - 1) / 2)], b = f.wp[Math.floor((f.wp.length - 1) / 2) + 1] || a;
    return `<path d="${d}" class="bf" marker-end="url(#twbpA)"/>${f.label ? `<foreignObject x="${(a[0] + b[0]) / 2 - 90}" y="${(a[1] + b[1]) / 2 - 22}" width="180" height="40"><div xmlns="http://www.w3.org/1999/xhtml" class="bf-l">${twEsc(f.label)}</div></foreignObject>` : ''}`;
  }).join('');
  const lanes = pl.lanes.filter((l) => !l.group).map((l, i) => `<rect x="0" y="${l.y}" width="${pl.w}" height="${l.h}" class="lane${i % 2 ? ' odd' : ''}"/>`).join('');
  const labels = pl.lanes.map((l) => (l.group
    ? `<div class="grp" style="top:${l.y * k}px;height:${l.h * k}px"><span>${twEsc(l.name)}</span></div>`
    : `<div style="top:${l.y * k}px;height:${l.h * k}px;left:${l.parent ? 26 : 0}px;width:${140 - (l.parent ? 26 : 0)}px"><span>${twEsc(l.name)}</span></div>`)).join('');
  return `<div class="tw-bp-lanes" style="height:${pl.h * k}px">${labels}</div>
    <svg width="${pl.w * k}" height="${pl.h * k}" viewBox="0 0 ${pl.w} ${pl.h}" class="tw-bp-svg">
      <defs><marker id="twbpA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" style="fill:#6b7383"/></marker></defs>
      ${lanes}${flows}${nodes}</svg>`;
}

// Экран ABAI для шага: встроенный слайд презентации на действии шага (только шаги быстрого сценария Dream TO BE — у них есть s.v)
function twSlideHTML(P, s, title) {
  if (!P || !s || !s.v) return '';
  return `<div class="tw-ui"><h3>${title || 'Как выглядит в ABAI'} <span>${twEsc(P.p)} · шаг ${twEsc(s.c)} · слайд «${twEsc(s.v[2])}», действие ${s.v[3]}</span></h3>
    <p class="tr-links"><a class="ls-slide" href="${lsSlideHref(P, s)}" target="_blank">Открыть в презентации ↗</a><a class="ls-slide" href="${lsProtoHref(P, s)}" target="_blank">Шаг в прототипе ↗</a></p>
    <div class="ls-st-frame"><iframe src="${lsSlideHref(P, s)}" title="Слайд презентации" loading="lazy"></iframe></div></div>`;
}
// Шаг со слайдом для передачи сценария: шаг-получатель, иначе шаг-источник, иначе первый шаг со слайдом из ссылки связи
function twSlideOfEdge(e) {
  for (const x of [e.eb, e.ea]) if (x && x.node && x.node.type === 'step' && x.node.s.v) return { P: x.node.P, s: x.node.s };
  for (const p of lsRefParts(e.r)) for (const c of p.codes || []) {
    const P = twTrail().find((q) => q.p === p.proc), st = P && (P.s.find((q) => q.c === c) || P.s.find((q) => q.c.startsWith(c + '.')));
    if (st && st.v) return { P, s: st };
  }
  return null;
}
// ---------- Режим «Сценарии ЦД»: выбранный сценарий потоков — полная цепочка на дереве, проигрывание по шагам ----------
// Сценарии — LS_FLOWS (Dream TO BE), те же, что на схеме портала. Конец связи — шаг BPMN процесса из ссылки связи
// («Д1 1.2а · 1.5», «Р1 1.10 → 1.11»: отдаёт на 1.10, принимает на 1.11) в ветке системы; без шага — процесс или модуль; система вне ЦД — плашка.
TW.mode = 'tree'; TW.sc = null; TW.scStep = 0;
const twScens = () => LS_FLOWS[TW_V] || [];
function twScenEnd(k, e, side) {
  if (!TW_IX.has(k)) { const u = twUnit(k, { depth: 2 }); return { pill: u.k, u }; }
  const m = twModNode(k);
  let firstPr = null;
  for (const p of lsRefParts(e.r).filter((x) => x.proc && x.codes)) {
    const pr = twKids(m).find((x) => x.P.p === p.proc);
    if (!pr) continue;
    const codes = p.arrow && p.codes.length === 2 ? [p.codes[side === 'f' ? 0 : 1]] : p.codes;
    const st = twKids(pr).find((x) => codes.some((c) => x.s.c === c || x.s.c.startsWith(c + '.')));
    if (st) return { node: st };
    firstPr = firstPr || pr;
  }
  return { node: firstPr || m };
}
function twScenLinks(sc) {
  const A = new Map(), pills = new Map(), nodes = new Set();
  const L = sc.e.map(([f, t, w, r, k], i) => ({ f, t, w, r, k, n: i + 1 }));
  L.forEach((e) => {
    const ea = twScenEnd(e.f, e, 'f'), eb = twScenEnd(e.t, e, 't');
    e.ea = ea; e.eb = eb;
    const ka = twEndKey(ea), kb = twEndKey(eb);
    if (ka === kb) return;
    [ea, eb].forEach((x) => (x.pill ? pills.set(x.pill, x.u) : nodes.add(x.node)));
    const id = [ka, kb].sort().join('|');
    if (!A.has(id)) A.set(id, { a: ea, b: eb, ka, kb, dirs: new Set(), nums: new Set(), ks: new Set(), w: [] });
    const q = A.get(id);
    q.dirs.add(ka + '>' + kb); q.nums.add(e.n); q.ks.add(e.k); q.w.push(`${e.n}. ${e.f} → ${e.t}: ${e.w}`);
  });
  return { L, XA: { arrows: [...A.values()], pills, nodes } };
}
// Узел дерева конца связи — подпись для кнопки «в дереве»
const twEndLabel = (x) => (x.pill ? x.pill : x.node.type === 'step' ? `${x.node.P.p} · ${x.node.label}` : x.node.label);
function twScenHash() { return '#sc/' + TW.sc + (TW.scStep ? '/' + TW.scStep : ''); }
function twScenGo(id, step = 0) {
  TW.mode = 'scen'; TW.sc = id; TW.scStep = step;
  history.replaceState(null, '', twScenHash());
  twRender();
}
function twRenderScen() {
  const all = twScens(), sc = all.find((x) => x.id === TW.sc) || all[0];
  TW.sc = sc.id;
  const S = twScenLinks(sc), L = S.L;
  TW.scStep = Math.max(0, Math.min(L.length, TW.scStep));
  const cur = TW.scStep ? L[TW.scStep - 1] : null;
  // Процессы сценария: по узлам-концам (процесс или шаг) — для схемы BPMN и переходов
  const procs = new Map();
  L.forEach((e) => [e.ea, e.eb].forEach((x) => { const pn = x.node && (x.node.type === 'step' ? x.node.parent : x.node.type === 'proc' ? x.node : null); if (pn && !procs.has(pn.P.p)) procs.set(pn.P.p, pn); }));
  TW.scProcs = [...procs.values()];
  TW.scMe = new Set(L.flatMap((e) => [e.ea, e.eb]).filter((x) => x.node && x.node.type === 'step').map((x) => x.node.s.id));
  const endBtn = (x) => (x.node ? `<button class="tw-sc-go" data-scnode="${twEsc(twKey(x.node))}">${twEsc(twEndLabel(x))} ↘</button>` : `<span class="tw-sc-ext">${twEsc(x.pill)} · ${twEsc(x.u.g.title)}</span>`);
  document.querySelector('.tr-main').innerHTML = `
    <div class="tr-cv"><div class="tr-cv-in"></div></div>
    <div class="tr-detail">
      <div class="tw-sc-bar"><b>Сценарии ЦД</b><span>что умеет ЦД: операции с данными от источника до получателя · на дереве — полная цепочка по шагам BPMN</span>
        <div class="tw-sc-btns">${all.map((x) => `<button data-sc="${x.id}" class="${x.id === sc.id ? 'on' : ''}">${twEsc(x.name)}<span>${twEsc(x.mods)}</span></button>`).join('')}</div></div>
      <div class="tr-head"><span class="tr-type tw-t-sc">Сценарий ЦД</span><h1>${twEsc(sc.name)}</h1><span class="tw-sc-m">${twEsc(sc.mods)} · ${L.length} ${twPlural(L.length, 'передача', 'передачи', 'передач')} данных</span></div>
      <p class="tr-lead">${twEsc(sc.note)}</p>
      <section class="tw-sc-play">
        <div class="tw-sc-ph"><button data-scs="-1" ${TW.scStep ? '' : 'disabled'}>◀</button><b>${cur ? `Шаг ${TW.scStep} из ${L.length}` : `Цепочка целиком · ${L.length} ${twPlural(L.length, 'шаг', 'шага', 'шагов')}`}</b><button data-scs="1" ${TW.scStep < L.length ? '' : 'disabled'}>▶</button>
          <span class="tw-sc-dots">${L.map((e) => `<i data-scstep="${e.n}" class="k-${e.k}${e.n === TW.scStep ? ' on' : e.n < TW.scStep ? ' done' : ''}" title="${twEsc(e.f + ' → ' + e.t)}">${e.n}</i>`).join('')}</span>
          <span class="tw-sc-hint">«Далее / Назад» и стрелки ← → — по шагам цепочки</span></div>
        ${cur ? `<div class="tw-sc-cur k-${cur.k}"><div class="tw-sc-ft"><b class="ls-nb k-${cur.k}">${cur.n}</b><span>${twEsc(cur.f)}</span><i>→</i><span>${twEsc(cur.t)}</span></div>
          <div class="tw-sc-w">${twEsc(cur.w)}</div>
          <div class="tw-sc-meta">${LS_KINDS[cur.k]} · ${twEsc(cur.r)}${(() => { const who = lsWho(cur, TW_V); return who ? ` · кто: ${twEsc(who)}` : ''; })()}</div>
          <div class="tw-sc-ends"><span>откуда:</span>${endBtn(cur.ea)}<span>куда:</span>${endBtn(cur.eb)}${lsRefSlides(TW_V, cur.r)}</div></div>
          ${(() => { const v = twSlideOfEdge(cur); return v ? twSlideHTML(v.P, v.s) : '<p class="tr-n tw-ui-no">Экрана для этого шага в быстром сценарии презентации нет — откройте шаг в прототипе по ссылке выше.</p>'; })()}`
    : '<p class="tr-n">Нажмите ▶ или «Далее», чтобы пройти цепочку по шагам: на дереве подсвечивается текущая передача данных, здесь — что передаётся, на каком шаге BPMN и кто выполняет.</p>'}
      </section>
      <section class="tw-scene"><div class="tw-scene-h"><b>⇄ Все передачи сценария</b><span>номер = номер стрелки на дереве · клик — к шагу цепочки</span></div>
        <div class="tw-scene-b"><ol class="tw-ll">${L.map((e) => `<li class="k-${e.k}${e.n === TW.scStep ? ' sel' : ''}" data-scstep="${e.n}"><b class="ls-nb k-${e.k}">${e.n}</b>
          <div><div class="tw-lt"><span class="tw-u">${twEsc(e.f)}</span> <i>→</i> <span class="tw-u">${twEsc(e.t)}</span> — ${twEsc(e.w)}</div><em>${LS_KINDS[e.k]} · ${twEsc(e.r)}</em>${lsRefSlides(TW_V, e.r)}</div></li>`).join('')}</ol>
          ${TW.scProcs.length ? `<p class="tw-sc-procs"><b>Процессы сценария:</b>${TW.scProcs.map((pn) => `<button class="tw-sc-go" data-scnode="${twEsc(twKey(pn))}">${twEsc(pn.label)} ↘</button>`).join('')}</p>` : ''}</div></section>
      ${TW.scProcs.length ? twBpmnHTML({ type: 'scen', id: sc.id }) : ''}
    </div>`;
  twCanvas(document.querySelector('.tr-cv-in'), twRoot(), { scen: true, XA: S.XA });
  if (TW.scProcs.length) twBpmnFill({ type: 'scen', id: sc.id });
  if (cur) twXHot(cur.n, true);
  const cvBox = document.querySelector('.tr-cv'), badge = cur && document.querySelector(`.tw-xn[data-ns~="${cur.n}"]`);
  if (badge) { cvBox.scrollLeft = Math.max(0, badge.offsetLeft - cvBox.clientWidth / 2); cvBox.scrollTop = Math.max(0, badge.offsetTop - cvBox.clientHeight / 2); }
  else cvBox.scrollLeft = cvBox.scrollWidth;
  // События
  document.querySelectorAll('[data-sc]').forEach((b) => (b.onclick = () => twScenGo(b.dataset.sc, 0)));
  document.querySelectorAll('[data-scs]').forEach((b) => (b.onclick = () => twScenGo(sc.id, TW.scStep + +b.dataset.scs)));
  document.querySelectorAll('[data-scstep]').forEach((b) => (b.onclick = (ev) => { if (ev.target.closest('a, button.tw-sc-go')) return; twScenGo(sc.id, +b.dataset.scstep); }));
  document.querySelectorAll('[data-scnode], .tr-cv-in [data-path]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); const k = a.dataset.scnode || a.dataset.path; twGo(twFind(k ? k.split('/').map(decodeURIComponent) : [])); }));
  document.querySelectorAll('.tw-ll [data-scstep]').forEach((li) => { const no = +li.dataset.scstep; li.onmouseenter = () => twXHot(no, true); li.onmouseleave = () => twXHot(no, false); });
  const bN = document.querySelector('[data-nav="1"]'), bP = document.querySelector('[data-nav="-1"]');
  const nx = L[TW.scStep], pv = TW.scStep ? (TW.scStep > 1 ? L[TW.scStep - 2] : 'all') : null;
  bN.disabled = !nx; bP.disabled = !pv;
  bN.innerHTML = `Далее ▶${nx ? `<small>шаг ${nx.n}: ${twEsc(nx.f)} → ${twEsc(nx.t)}</small>` : ''}`;
  bP.innerHTML = `◀ Назад${pv ? `<small>${pv === 'all' ? 'цепочка целиком' : `шаг ${pv.n}: ${twEsc(pv.f)} → ${twEsc(pv.t)}`}</small>` : ''}`;
  document.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === 'scen'));
}

// ---------- Режим «Процессы модулей»: модуль → процесс BPMN → шаг ----------
// На каждом уровне — поток данных этого уровня (на дереве и на схеме): у модуля — все связи его процессов, у процесса — его, у шага — шага.
// Модуль — карточки процессов (как главная прототипа); процесс — карта сценария, схема BPMN ⇄ экраны ABAI (синхронно в обе стороны),
// сравнение AS IS → Dream TO BE. Данные и расчёты — из самих модулей (bpmn-data.js, config.js / model.js) в скрытом iframe,
// поэтому цифры совпадают с прототипами.
const TW_ENV = {};
function twEnv(m) {
  if (!TW_ENV[m]) {
    TW_ENV[m] = new Promise((ok) => {
      const f = document.createElement('iframe');
      f.style.display = 'none'; f.setAttribute('aria-hidden', 'true');
      document.body.appendChild(f);
      const d = f.contentDocument;
      d.open(); d.write('<!doctype html><html><head></head><body></body></html>'); d.close();
      const base = new URL(lsModHref(m, 'v1'), location.href).href;
      const files = m === 'dobycha' ? ['js/bpmn-data.js', 'js/model.js'] : ['js/bpmn-data.js', 'js/config.js', '../shared/proc/model.js'];
      let i = 0;
      const next = () => {
        if (i >= files.length) return ok(f.contentWindow);
        const s = d.createElement('script');
        s.src = new URL(files[i++], base).href;
        s.onload = next; s.onerror = next;
        d.head.appendChild(s);
      };
      next();
    });
  }
  return TW_ENV[m];
}
const twEv = (w, x) => { try { return w.eval(x); } catch (e) { return undefined; } };
function twPRoot() { if (!TW.proot) TW.proot = twNode(null, 'pmr', 'pm', 'Процессы модулей'); return TW.proot; }
function twPFind(path) {
  let n = twPRoot();
  for (const seg of path) { const kid = twKids(n).find((k) => k.type + ':' + k.id === seg); if (!kid) break; n = kid; }
  return n;
}
const twRootOf = (n) => { let x = n; while (x && x.parent) x = x.parent; return x; };
// Ветви обмена на дереве процессов: система (плашка справа) → процесс / шаг, где она отдаёт данные; процесс / шаг, где принимает → система
function twPmAnchors(n, e, side) {
  const parts = lsRefParts(e.r).filter((p) => p.proc && p.codes);
  if (n.type === 'pmr') { const ms = new Set(parts.map((p) => (twTrail().find((P) => P.p === p.proc) || {}).m)); return twKids(n).filter((x) => ms.has(x.id)); }
  if (n.type === 'pm') { const ps = new Set(parts.map((p) => p.proc)); return twKids(n).filter((x) => ps.has(x.P.p)); }
  if (n.type === 'ps') return [n];
  const out = [];
  parts.filter((p) => p.proc === n.P.p).forEach((p) => {
    const codes = p.arrow && p.codes.length === 2 ? [p.codes[side === 'f' ? 0 : 1]] : p.codes;
    const st = twKids(n).find((x) => codes.some((c) => x.s.c === c || x.s.c.startsWith(c + '.')));
    if (st && !out.includes(st)) out.push(st);
  });
  return out.length ? out : [n];
}
function twPmLinks(n, X) {
  const A = new Map(), pills = new Map(), nodes = new Set();
  const pillOf = (k) => { const h = TW_IX.get(k); return { pill: k, u: h ? { k, g: { title: 'ABAI · ' + h.p.t, type: 'cd' } } : twUnit(k, { depth: 2 }) }; };
  const add = (ea, eb, num, kind, w) => {
    const ka = twEndKey(ea), kb = twEndKey(eb);
    if (ka === kb) return;
    [ea, eb].forEach((x) => (x.pill ? pills.set(x.pill, x.u) : nodes.add(x.node)));
    const id = ka + '|' + kb;
    if (!A.has(id)) A.set(id, { a: ea, b: eb, ka, kb, dirs: new Set([ka + '>' + kb]), nums: new Set(), ks: new Set(), w: [] });
    const q = A.get(id); q.nums.add(num); q.ks.add(kind); if (!q.w.includes(w)) q.w.push(w);
  };
  X.L.forEach((l) => l.items.forEach((e) => {
    const w = `${e.f} → ${e.t}: ${e.w}`;
    twPmAnchors(n, e, 'f').forEach((x) => add(pillOf(e.f), { node: x }, l.n, e.k, w));
    twPmAnchors(n, e, 't').forEach((x) => add({ node: x }, pillOf(e.t), l.n, e.k, w));
  }));
  return { arrows: [...A.values()], pills, nodes };
}
const TW_PM_LV = ['Процессы модулей', 'Модуль', 'Процесс BPMN', 'Шаг BPMN'];
const TW_PM_T = { pmr: 'Процессы модулей', pm: 'Модуль', pp: 'Процесс BPMN', ps: 'Шаг BPMN' };
const twPmLevel = (n) => ({ pmr: 0, pm: 1, pp: 2, ps: 3 })[n.type];
const twModMeta = (id) => (typeof ABAI_MODULES !== 'undefined' && ABAI_MODULES.find((x) => x.id === id)) || {};
// Ссылки прототипа и презентации процесса
function twProtoLinks(P) {
  const v1 = lsModHref(P.m, 'v1') + 'index.html', anyV = P.s.find((s) => s.v);
  return `<p class="tw-pm-links">${[['work', 'Рабочее место'], ['flow', 'Процесс Dream TO BE'], ['bpmn/dream', 'Схема BPMN'], ['compare', 'AS IS → Dream TO BE']].map(([h, t]) => `<a class="ls-slide" href="${v1}#/p/${P.n}/${h}" target="_blank">${t} ↗</a>`).join('')}${anyV ? `<a class="ls-slide" href="${lsModHref(P.m, 'v2')}index.html#${anyV.v[0]}/1/all" target="_blank">Презентация ↗</a>` : ''}</p>`;
}
function twPmBody(n) {
  if (n.type === 'pmr') {
    const D = (m, v) => ((typeof ABAI_LANDSCAPE_DATA !== 'undefined' && ABAI_LANDSCAPE_DATA[m]) || {})[v] || {};
    return `<p class="tr-lead">Процессы модулей мокапа на продуктах ABAI — по цепочке «Геология → Разработка → Бурение → Добыча». Погрузитесь в модуль, затем в процесс и шаг: на каждом уровне — поток данных этого уровня, схема BPMN, экраны ABAI и сравнение с AS IS.</p>
      <div class="tw-pm-cards">${twKids(n).map((k) => { const a = D(k.id, 'asis'), d = D(k.id, 'dream'), c = twModMeta(k.id).color || '#1c5cab'; return `<button class="tw-pm-card" data-pmkid="${twEsc(k.type + ':' + k.id)}" style="--c:${c}">
        <b>${twEsc(k.label)}</b><span>${twEsc(k.mod.sub)}</span>
        <div class="tw-pm-k"><div><b>${d.steps || '—'}</b><span>шагов Dream TO BE</span></div><div><b>${a.abai ?? '—'} → ${d.abai ?? '—'}</b><span>шагов в ABAI: AS IS → Dream</span></div><div><b>${a.manual ?? '—'} → ${d.manual ?? '—'}</b><span>ручная работа</span></div></div></button>`; }).join('')}</div>`;
  }
  if (n.type === 'pm') {
    const mm = twModMeta(n.id);
    return `<div class="tw-pm-hub" data-pmfill>Загрузка процессов модуля…</div>
      <section class="tw-cmp" data-pmcmpm><p class="tr-n">Загрузка сравнения…</p></section>
      <p class="tw-pm-links"><a class="ls-slide" href="${lsModHref(n.id, 'v1')}index.html#/" target="_blank">Прототип модуля ↗</a>${mm.v2 ? `<a class="ls-slide" href="${lsModHref(n.id, 'v2')}index.html" target="_blank">Презентация модуля ↗</a>` : ''}</p>`;
  }
  if (n.type === 'pp') {
    const P = n.P, anyV = P.s.find((s) => s.v);
    return `${twProtoLinks(P)}
      ${anyV ? `<h3>Карта сценария <span>роли × шаги из презентации · клик по шагу на карте — экран и шаг схемы ниже</span></h3>
        <div class="ls-st-frame tw-map"><iframe class="tw-map-if" src="${lsModHref(P.m, 'v2')}index.html#${anyV.v[0]}/1/all" title="Карта сценария" loading="lazy"></iframe></div>` : ''}
      <section class="tw-sync"><div class="tw-sync-h"><b>Схема BPMN ⇄ экраны ABAI</b><span>синхронно: клик по шагу схемы — его экран; листаете экран — шаг на схеме</span>
        <span class="tw-bp-z"><button data-syz="-1">−</button><b>${Math.round(TW.bpZoom * 100)} %</b><button data-syz="1">+</button></span></div>
        <div class="tw-bp-canvas tw-sync-bp"><p class="tr-n">Загрузка схемы…</p></div>
        <div class="tw-sync-info"></div>
        <div class="ls-st-frame tw-sync-fr"><iframe class="tw-sync-if" title="Экран шага" loading="lazy"></iframe></div></section>
      <section class="tw-cmp" data-pmcmp><p class="tr-n">Загрузка сравнения…</p></section>`;
  }
  if (n.type === 'ps') return twStepHTML(n);
  return '';
}
// Подгружаемые части: главная модуля, описание и сравнение процесса, синхронная схема
function twPmFill(n) {
  const m = n.type === 'pm' ? n.id : n.P ? n.P.m : null;
  if (!m) return;
  twEnv(m).then((w) => {
    if (TW.node !== n) return;
    const meta = twEv(w, 'typeof PROC_META !== "undefined" ? PROC_META : {}') || {};
    const MOD = twEv(w, 'typeof MODULE !== "undefined" ? MODULE : null');
    const stats = twEv(w, 'variantStats'), rolesOf = twEv(w, 'rolesOf'), sysKind = twEv(w, 'sysKind'), pool = twEv(w, 'pool');
    const base = (num) => (pool && pool(num, 'dream') ? 'dream' : 'asis');
    const metricAbai = !MOD || MOD.metric !== 'manual';
    const mt = (num) => { const a = stats(num, 'asis'), b = stats(num, base(num)); return { a, b }; };
    if (n.type === 'pm') {
      const host = document.querySelector('[data-pmfill]');
      if (!host) return;
      const procs = twKids(n), all = procs.map((k) => ({ k, ...mt(k.P.n) }));
      const sum = (f) => all.reduce((s, x) => s + f(x), 0);
      const top = document.querySelector('[data-pmtop]');
      host.innerHTML = `<div class="tw-pm-hero"><div><h2>${twEsc(MOD ? MOD.hubTitle : `${n.label} в ABAI: ${procs.length} процессов`)}</h2><p>${twEsc(MOD ? MOD.hubLead : 'По итоговым BPMN: AS IS в описании Nedra, AS IS ABAI, TO BE Nedra и Dream TO BE. Для каждого процесса — поток данных, схема BPMN, экраны ABAI и сравнение вариантов.')}</p></div>
        <div class="tw-pm-k"><div><b>${sum((x) => x.b.steps)}</b><span>шагов в Dream TO BE</span></div><div><b>${sum((x) => x.a.abaiSteps)} → ${sum((x) => x.b.abaiSteps)}</b><span>шагов, выполняемых в ABAI</span></div><div><b>${sum((x) => x.a.manual)} → ${sum((x) => x.b.manual)}</b><span>${metricAbai ? 'привязок к ручным инструментам' : 'документов и согласований вручную'}</span></div></div></div>
        <div class="tw-pm-grid">${all.map(({ k, a, b }) => { const pm = meta[k.P.n] || {}; return `<button class="tw-pm-proc" data-pmkid="${twEsc(k.type + ':' + k.id)}">
          <div class="tw-pm-ph"><span class="tw-pm-num">${twEsc(k.P.p)}</span>${pm.icon ? `<i>${pm.icon}</i>` : ''}<div><b>${twEsc(k.P.t)}</b><span>${twEsc(pm.ws || '')}</span></div></div>
          ${pm.idea ? `<p>${twEsc(pm.idea)}</p>` : ''}
          <div class="tw-pm-sys">${b.systems.filter((s) => sysKind(s) === 'abai').map((s) => `<span class="chip">${twEsc(s)}</span>`).join('')}</div>
          <div class="tw-pm-meta"><span>${b.steps} шагов · ${rolesOf(k.P.n).length} ролей</span><span>${metricAbai ? `шагов в ABAI: ${a.abaiSteps} → <b>${b.abaiSteps}</b>` : `ручной работы: ${a.manual} → <b>${b.manual}</b>`}</span></div></button>`; }).join('')}</div>`;
      // Заголовок, описание и цифры модуля — наверх, под заголовок страницы; карточки процессов — в карточке ниже
      const hero = host.querySelector('.tw-pm-hero');
      if (top && hero) { top.innerHTML = ''; top.appendChild(hero); host.insertAdjacentHTML('afterbegin', '<h3>Процессы модуля <span>клик — погрузиться в процесс</span></h3>'); }
      const cm = document.querySelector('[data-pmcmpm]');
      if (cm) cm.innerHTML = twCmpModHTML(w, n);
      document.querySelectorAll('[data-pmfill] [data-pmkid], [data-pmcmpm] [data-pmkid]').forEach((b) => (b.onclick = () => { const k = twKids(n).find((x) => x.type + ':' + x.id === b.dataset.pmkid); if (k) twGo(k); }));
      return;
    }
    if (n.type !== 'pp') return;
    const P = n.P, pm = meta[P.n] || {}, { a, b } = mt(P.n);
    const idea = document.querySelector('[data-pmtop]');
    if (idea) idea.innerHTML = `${pm.idea ? `<div class="bpmn-note"><b>Dream TO BE</b><span>${twEsc(pm.idea)}</span></div>` : ''}
      <div class="tw-pm-k sm"><div><b>${b.steps}</b><span>шагов Dream TO BE</span></div><div><b>${rolesOf(P.n).length}</b><span>ролей</span></div><div><b>${a.abaiSteps} → ${b.abaiSteps}</b><span>шагов в ABAI: AS IS → Dream</span></div><div><b>${a.manual} → ${b.manual}</b><span>ручная работа: AS IS → Dream</span></div></div>`;
    twSyncInit(n, w);
    const cmp = document.querySelector('[data-pmcmp]');
    if (cmp) cmp.innerHTML = twCmpHTML(w, P.n, metricAbai);
  });
}
// Сравнение вариантов процесса: карточки AS IS Nedra / AS IS / TO BE Nedra / Dream TO BE и системы по шагам (сопоставление — модель модуля)
function twCmpHTML(w, num, metricAbai) {
  const V = twEv(w, 'VARIANTS') || {}, pool = twEv(w, 'pool'), stats = twEv(w, 'variantStats'), matrix = twEv(w, 'stepMatrix'), sysKind = twEv(w, 'sysKind');
  if (!pool || !stats || !matrix) return '';
  const vs = Object.keys(V).filter((k) => pool(num, k)), bv = vs.includes('dream') ? 'dream' : 'asis';
  const st = Object.fromEntries(vs.map((k) => [k, stats(num, k)]));
  let rows = [];
  try { rows = matrix(num); } catch (e) { rows = []; }
  const chips = (c) => { if (!c) return '—'; const fm = [...new Set((c.docs || []).map((d) => (d.match(/\(([^)]*(?:Excel|Word|PDF)[^)]*)\)/) || [])[1]).filter(Boolean))]; const l = c.sys.map((s) => `<span class="tw-ch k-${sysKind(s)}">${twEsc(s)}</span>`).concat(metricAbai ? [] : fm.map((f) => `<span class="tw-ch k-manual">${twEsc(f)}</span>`)); return l.length ? l.join(' ') : '<span class="tr-n">без системы</span>'; };
  return `<h3>Сравнение: ${vs.map((k) => twEsc(V[k].name)).join(' → ')} <span>как в прототипе: шаги сопоставлены по номеру и названию из BPMN</span></h3>
    <div class="tw-cmp-v">${vs.map((k) => `<div class="tw-cmp-c t-${V[k].tone || ''}${k === bv ? ' base' : ''}"><em>${twEsc(V[k].sub || '')}</em><b>${twEsc(V[k].name)}</b>${pool(num, k).remark ? `<small>в BPMN: ${twEsc(pool(num, k).remark)}</small>` : ''}
      <div class="tw-pm-k sm"><div><b>${st[k].steps}</b><span>шагов</span></div><div><b>${st[k].abaiSteps}</b><span>шагов в ABAI</span></div><div><b class="${st[k].manual ? 'bad' : ''}">${st[k].manual}</b><span>ручная работа</span></div></div></div>`).join('')}</div>
    <details class="tr-more" open><summary>Системы и документы по шагам · ${rows.length} ${twPlural(rows.length, 'шаг', 'шага', 'шагов')}</summary>
      <div class="tw-cmp-t"><table class="ls-ab-t"><thead><tr><th>Шаг</th><th>Роль</th>${vs.map((k) => `<th class="${k === bv ? 'base' : ''}">${twEsc(V[k].name)}</th>`).join('')}</tr></thead><tbody>
      ${rows.map((r) => `<tr><td><b>${twEsc(r.code || '—')}</b> ${twEsc(r.title)}${r.only ? ` <span class="tw-ch">только в ${twEsc((V[r.only] || {}).name || r.only)}</span>` : ''}</td><td>${twEsc(r.lane || '')}</td>${vs.map((k) => `<td>${chips(r[k])}${r[k] && r[k].code && r[k].code !== r.code ? ` <span class="tr-n">(${twEsc(r[k].code)})</span>` : ''}</td>`).join('')}</tr>`).join('')}
      </tbody></table></div></details>`;
}
// Сравнение схем на уровне модуля: варианты BPMN по всем процессам модуля (в том числе тем, где нет Dream TO BE) и шаги по процессам
function twCmpModHTML(w, n) {
  const V = twEv(w, 'VARIANTS') || {}, B = twEv(w, 'BPMN') || [], pool = twEv(w, 'pool'), stats = twEv(w, 'variantStats');
  if (!pool || !stats || !B.length) return '';
  const vs = Object.keys(V).filter((k) => B.some((p) => pool(p.num, k))), bv = vs.includes('dream') ? 'dream' : 'asis';
  const rows = B.map((p) => ({ p, k: twKids(n).find((x) => x.P.n === p.num), st: Object.fromEntries(vs.map((v) => [v, pool(p.num, v) ? stats(p.num, v) : null])) }));
  const tot = (v, f) => rows.reduce((t, r) => t + (r.st[v] ? f(r.st[v]) : 0), 0), cnt = (v) => rows.filter((r) => r.st[v]).length;
  const cell = (x) => (x ? `<b>${x.steps}</b> <small class="tw-cmp-s">· в ABAI ${x.abaiSteps}${x.manual ? ` · вручную ${x.manual}` : ''}</small>` : '<small class="tw-cmp-s">нет в BPMN</small>');
  return `<h3>Сравнение схем: ${vs.map((k) => twEsc(V[k].name)).join(' → ')} <span>все процессы модуля · шаги BPMN по вариантам, как в прототипе · клик по процессу — сравнение по шагам</span></h3>
    <div class="tw-cmp-v">${vs.map((k) => `<div class="tw-cmp-c t-${V[k].tone || ''}${k === bv ? ' base' : ''}"><em>${twEsc(V[k].sub || '')}</em><b>${twEsc(V[k].name)}</b>
      <div class="tw-pm-k sm"><div><b>${cnt(k)}</b><span>процессов</span></div><div><b>${tot(k, (x) => x.steps)}</b><span>шагов</span></div><div><b>${tot(k, (x) => x.abaiSteps)}</b><span>шагов в ABAI</span></div><div><b class="${tot(k, (x) => x.manual) ? 'bad' : ''}">${tot(k, (x) => x.manual)}</b><span>ручная работа</span></div></div></div>`).join('')}</div>
    <div class="tw-cmp-t"><table class="ls-ab-t"><thead><tr><th>Процесс</th>${vs.map((k) => `<th class="${k === bv ? 'base' : ''}">${twEsc(V[k].name)}</th>`).join('')}</tr></thead><tbody>
    ${rows.map((r) => `<tr${r.k ? ` class="tw-cmp-go" data-pmkid="${twEsc(r.k.type + ':' + r.k.id)}"` : ''}><td><b>${twEsc(r.k ? r.k.P.p : r.p.code || r.p.num)}</b> ${twEsc(r.p.title)}</td>${vs.map((k) => `<td>${cell(r.st[k])}</td>`).join('')}</tr>`).join('')}
    <tr class="tw-cmp-sum"><td><b>Итого по модулю</b></td>${vs.map((k) => `<td><b>${tot(k, (x) => x.steps)}</b> <small class="tw-cmp-s">· в ABAI ${tot(k, (x) => x.abaiSteps)}${tot(k, (x) => x.manual) ? ` · вручную ${tot(k, (x) => x.manual)}` : ''}</small></td>`).join('')}</tr>
    </tbody></table></div>`;
}
// Схема BPMN ⇄ экраны ABAI: выбранный шаг подсвечен на схеме, его экран — ниже; карта сценария и экран сообщают, какой шаг на экране
function twSyncInit(n, w) {
  const P = n.P, host = document.querySelector('.tw-sync-bp'), info = document.querySelector('.tw-sync-info'), fr = document.querySelector('.tw-sync-if'), map = document.querySelector('.tw-map-if');
  if (!host) return;
  const B = twEv(w, 'BPMN'), proc = B && B.find((x) => x.num === P.n), pl = proc && proc.pools.find((x) => x.variant === 'dream');
  if (!pl) { host.innerHTML = '<p class="tr-n">Схема Dream TO BE для процесса в файле BPMN не найдена.</p>'; return; }
  TW.pmSel = TW.pmSel || {};
  let sel = TW.pmSel[P.p] || (P.s.find((s) => s.v) || P.s[0]).id;
  const draw = () => {
    host.innerHTML = twBpmnDraw(pl, new Set(), sel, TW.bpZoom);
    host.querySelectorAll('[data-bpn]').forEach((g) => (g.onclick = () => select(g.dataset.bpn, true)));
  };
  const focus = () => { const nd = pl.nodes.find((x) => x.id === sel); if (nd) { host.scrollLeft = Math.max(0, nd.x * TW.bpZoom - host.clientWidth / 2); host.scrollTop = Math.max(0, nd.y * TW.bpZoom - host.clientHeight / 3); } };
  const select = (id, load) => {
    sel = id; TW.pmSel[P.p] = id;
    host.querySelectorAll('[data-bpn]').forEach((g) => g.classList.toggle('cur', g.dataset.bpn === id));
    const i = P.s.findIndex((s) => s.id === id), s = P.s[i];
    if (!s) return;
    info.innerHTML = `<b>${twEsc(s.c || '—')}</b> ${twEsc(s.t)} <span>${twEsc(lsRole(s))}${s.s.length ? ' · ' + twEsc(s.s.join(', ')) : ''}</span>
      <button class="tw-sc-go" data-sync-open="${i}">Открыть шаг ↘</button>${s.v ? '' : '<em>экрана этого шага в быстром сценарии презентации нет</em>'}`;
    info.querySelector('[data-sync-open]').onclick = () => { const k = twKids(n)[i]; if (k) twGo(k); };
    const sn = twKids(n)[i], box = document.querySelector('.tr-cv');
    document.querySelectorAll('.tr-cv-in .tr-nd.syn').forEach((x) => x.classList.remove('syn'));
    const btn = sn && document.querySelector(`.tr-cv-in .tr-nd[data-path="${CSS.escape(twKey(sn))}"]`);
    if (btn && box) { btn.classList.add('syn'); box.scrollTop = Math.max(0, btn.offsetTop - box.clientHeight / 2 + btn.offsetHeight / 2); box.scrollLeft = Math.max(0, btn.offsetLeft + btn.offsetWidth + 260 - box.clientWidth); }
    if (load && s.v) { const u = lsSlideHref(P, s); if (fr.getAttribute('src') !== u) fr.setAttribute('src', u); }
    focus();
  };
  // Сообщения встроенных презентаций: какой слайд и действие на экране → шаг процесса
  TW.syncMsg = (m, src) => {
    const st = P.s.find((s) => s.v && s.v[0] === m.scn && s.v[1] === m.idx && (!m.act || s.v[3] === m.act)) || P.s.find((s) => s.v && s.v[0] === m.scn && s.v[1] === m.idx);
    if (st && st.id !== sel) select(st.id, map && src === map.contentWindow);
  };
  document.querySelectorAll('[data-syz]').forEach((b) => (b.onclick = () => { TW.bpZoom = Math.max(0.3, Math.min(1.2, +(TW.bpZoom + 0.1 * +b.dataset.syz).toFixed(2))); b.parentElement.querySelector('b').textContent = Math.round(TW.bpZoom * 100) + ' %'; draw(); focus(); }));
  draw();
  select(sel, true);
}
window.addEventListener('message', (e) => { const m = e.data && e.data.abaiSlide; if (m && TW.syncMsg && TW.mode === 'pm') TW.syncMsg(m, e.source); });
// Клик по узлу дерева и крошкам — переход в режиме процессов (после перерисовки дерева со стрелками назначается заново)
function twPmBind(root) {
  root.querySelectorAll('[data-pmpath], .tr-cv-in [data-path]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); const k = a.dataset.pmpath ?? a.dataset.path; twGo(twPFind(k ? k.split('/').map(decodeURIComponent) : [])); }));
}
function twRenderPm() {
  const n = TW.node;
  TW.syncMsg = null;
  const chain = []; for (let x = n; x; x = x.parent) chain.unshift(x);
  const lv = twPmLevel(n);
  document.querySelector('.tr-main').innerHTML = `
    <div class="tr-cv"><div class="tr-cv-in"></div></div>
    <div class="tr-detail">
      <div class="tw-depth">${TW_PM_LV.map((t, i) => `<span class="${i < lv ? 'was' : i === lv ? 'on' : ''}">${i ? '<i>›</i>' : ''}${t}</span>`).join('')}<em>уровень ${lv + 1} из ${TW_PM_LV.length}</em></div>
      <div class="tr-crumbs">${chain.map((x, i) => `${i ? '<i>›</i>' : ''}<a href="#" data-pmpath="${twEsc(twKey(x))}">${twEsc(x.label)}</a>`).join('')}</div>
      <div class="tr-head"><span class="tr-type tw-t-${n.type}">${TW_PM_T[n.type]}${n.type === 'pp' || n.type === 'ps' ? ' · ' + twEsc(LS_MOD_NAME[n.P.m] || '') : ''}</span><h1>${twEsc(n.label)}</h1></div>
      <div class="tw-pm-top" data-pmtop>${n.type === 'pm' || n.type === 'pp' ? '<p class="tr-n">Загрузка описания…</p>' : ''}</div>
      <section class="tw-pass" data-pass><p class="tr-n">Анализ по BPMN: связи с другими процессами, роли, документы…</p></section>
      ${twSceneHTML(n)}
      <div class="tr-content tw-pm-body">${twPmBody(n)}</div>
      ${n.type === 'ps' ? twBpmnHTML(n) : ''}
    </div>`;
  const X = TW.net ? twLinks(n) : null;
  twCanvas(document.querySelector('.tr-cv-in'), n, { root: twPRoot(), XA: { arrows: [], pills: new Map(), nodes: new Set() } });
  twScene(n, X);
  twPmFill(n);
  twPassFill(n);
  if (n.type === 'ps') twBpmnFill(n);
  document.querySelectorAll('[data-pmkid]').forEach((b) => (b.onclick = () => { const k = twKids(n).find((x) => x.type + ':' + x.id === b.dataset.pmkid); if (k) twGo(k); }));
  twPmBind(document);
  document.querySelectorAll('.tr-content [data-go-sys]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); twGo(twModNode(a.dataset.goSys)); }));
  const nx = twNext(n), pv = twPrev(n);
  const bN = document.querySelector('[data-nav="1"]'), bP = document.querySelector('[data-nav="-1"]');
  bN.disabled = !nx; bP.disabled = !pv;
  bN.innerHTML = `Далее ▶${nx ? `<small>${twEsc(nx.label)}</small>` : ''}`;
  bP.innerHTML = `◀ Назад${pv ? `<small>${twEsc(pv.label)}</small>` : ''}`;
  document.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === 'pm'));
  document.querySelector('.tr-main').scrollTop = 0;
}

// ---------- Анализ процессов Upstream по BPMN: связи между процессами, триггеры и результаты, документы, роли ----------
// Источники: в BPMN каждого процесса — смежные процессы (входящие / исходящие с данными: «Из Р5 (5.15): Актуальная ГДМ»),
// дорожки «Входящие / Исходящие» со стрелками к шагам (Геология), переходы шагов в соседние процессы (s.pv / s.nx),
// стартовое и конечное события, документы шагов. Отраслевая рамка — стратсессия, сл. 3.
const TW_STAGES = [
  { t: 'ГРР и перспективное планирование', goal: 'Коэффициент восполнения ресурсной базы', hor: '25+ лет', procs: ['Г1', 'Г3', 'Г3.1', 'Г3.2', 'Г3.3'] },
  { t: 'Геология и разработка', goal: 'Стратегия разработки с оптимальными NPV и КИН', resp: 'стратегия разработки активов на 3–5 лет', hor: 'до 5 лет', procs: ['Г3.4', 'Р1', 'Р2', 'Р3', 'Р4'] },
  { t: 'Техническая политика', goal: 'Оптимальное соотношение плана по добыче и CAPEX', resp: 'наземная инфраструктура и проектирование', hor: 'до 3 лет', procs: ['Б1', 'Д8'] },
  { t: 'Строительство скважины', goal: 'Дополнительная добыча от достижения потенциала ПЦСС', resp: 'скважина, введённая по фонду', hor: 'внутри года', procs: ['Б1', 'Б2', 'Б3', 'Б4', 'Б5'] },
  { t: 'Управление добычей', goal: 'Максимальное соотношение факта по добыче и OPEX', resp: 'выполнение производственной программы', hor: 'внутри года', procs: ['Д1', 'Д2', 'Д3', 'Д4', 'Д5', 'Д6', 'Д7', 'Д9'] },
];
const TW_CROSS = [
  ['Интегрированное моделирование на уровне ДЗО', 'синхронизация подземной и наземной части (пласт, труба, скважина); цикл от 1 года до 20+ лет', ['Д4']],
  ['Целостность и надёжность (ЦИН)', 'сквозной процесс на уровне ДЗО', ['Д8']],
  ['Производственное планирование', 'синхронизация данных для сборки и утверждения бизнес-плана; ежегодно', ['Р2', 'Р3']],
  ['Инвестиционная политика', 'инвестиционное планирование, мониторинг исполнения и пост-инвест анализ', ['Д5']],
];
const TW_MOD_ORDER = ['geologiya', 'razrabotka', 'burenie', 'dobycha'];
// Разбор записи о смежном процессе: «Из Р5 (5.15): Актуальная ГДМ», «В Р4 (4.1), Б1, КС1: …», «Д2. Мониторинг добычи», «В «Формирование …»: …»
function twAdjParse(text) {
  return String(text || '').split(/;\s*/).map((seg) => {
    seg = seg.trim().replace(/^(из|в)\s+/i, '');
    const ci = seg.search(/:\s/), head = ci >= 0 ? seg.slice(0, ci) : seg, data = ci >= 0 ? seg.slice(ci + 1).trim() : '';
    const codes = [];
    const re = /(^|[^А-Яа-яЁёA-Za-z])([ГРБД]\d+(?:\.\d+)?)(?:\s*\(([\d.,\s]+)\))?/g;
    let m, rest = head;
    while ((m = re.exec(head))) { codes.push({ code: m[2], steps: m[3] ? m[3].split(/,\s*/).map((x) => x.trim()).filter(Boolean) : [] }); rest = rest.replace(m[0].slice(m[1].length), ''); }
    // Названия процессов без кода: «Формирование …» — до запятой между ними; у процесса с кодом остаток названия отбрасываем
    const ext = codes.length && /^\s*[.\s]/.test(rest) ? [] : rest.split(/,\s*(?=«|[А-ЯA-Z])/).map((x) => x.replace(/^[\s,.]+|[\s,.]+$/g, '').replace(/^«|»$/g, '').trim()).filter((x) => x && !/^[.\s]*$/.test(x));
    return { codes, ext, data, raw: seg, title: codes.length === 1 && !data ? head.replace(/^.*?[ГРБД]\d+(?:\.\d+)?\.?\s*/, '').trim() : '' };
  }).filter((x) => x.codes.length || x.ext.length);
}
let TW_GRAPH = null;
function twGraph() {
  if (TW_GRAPH) return TW_GRAPH;
  TW_GRAPH = Promise.all(TW_MOD_ORDER.map((m) => twEnv(m).then((w) => ({ m, w, B: twEv(w, 'BPMN') || [] })))).then((all) => {
    const procs = new Map(twTrail().map((P) => [P.p, P]));
    const E = new Map(), names = new Map(), events = new Map(), env = new Map(all.map((x) => [x.m, x.w]));
    const nid = (code) => (procs.has(code) ? code : 'x:' + code);
    const add = (f, t, data, fs, ts, src) => {
      if (f === t) return;
      const k = f + '|' + t;
      if (!E.has(k)) E.set(k, { f, t, data: [], fSteps: new Set(), tSteps: new Set(), src: new Set() });
      const e = E.get(k);
      if (data && !e.data.includes(data)) e.data.push(data);
      if (fs) e.fSteps.add(fs);
      if (ts) e.tSteps.add(ts);
      e.src.add(src);
    };
    const seg2 = (seg) => seg.codes.map((c) => ({ id: nid(c.code), step: c.steps[0], name: seg.title })).concat(seg.ext.map((n) => ({ id: 'e:' + n })));
    all.forEach(({ m, B }) => B.forEach((p) => {
      const self = p.code || (m === 'dobycha' ? 'Д' + p.num : p.code), S = nid(self);
      if (!procs.has(self)) names.set(S, `${self} ${p.title}`);
      const pl = p.pools.find((x) => x.variant === 'dream') || p.pools.find((x) => x.variant === 'asis');
      // Триггер и результат: стартовое и конечное события Dream TO BE; не подписаны — из других вариантов того же BPMN
      const order = ['dream', 'asis', 'asisn', 'nedra'].map((v) => p.pools.find((x) => x.variant === v)).filter(Boolean);
      const st = order.map((x) => x.nodes.find((y) => y.type === 'startEvent' && y.name)).find(Boolean);
      const en = order.map((x) => x.nodes.filter((y) => y.type === 'endEvent' && y.name)).find((l) => l.length) || [];
      events.set(self, { start: st ? st.name : '', end: en.map((x) => x.name) });
      ['in', 'out'].forEach((dir) => ((p.adjacent || {})[dir] || []).forEach((txt) => twAdjParse(txt).forEach((seg) => seg2(seg).forEach((o) => {
        if (o.id.startsWith('x:') && o.name) names.set(o.id, `${o.id.slice(2)} ${o.name}`);
        if (dir === 'in') add(o.id, S, seg.data, o.step, null, 'adj'); else add(S, o.id, seg.data, null, o.step, 'adj');
      }))));
      // Дорожки «Входящие / Исходящие»: стрелка от смежного процесса к шагу и от шага к смежному процессу, подпись — данные
      if (pl) {
        const byId = new Map(pl.nodes.map((x) => [x.id, x]));
        pl.flows.forEach((f) => {
          const a = byId.get(f.from), b = byId.get(f.to);
          if (!a || !b) return;
          if (a.kind === 'link' && b.kind !== 'link') twAdjParse(a.title || a.name).forEach((seg) => seg2(seg).forEach((o) => add(o.id, S, f.label || '', null, b.code, 'link')));
          if (b.kind === 'link' && a.kind !== 'link') twAdjParse(b.title || b.name).forEach((seg) => seg2(seg).forEach((o) => add(S, o.id, f.label || '', a.code, null, 'link')));
        });
      }
    }));
    // Переходы шагов в соседние процессы (Добыча: «Д2. Мониторинг добычи» после шага)
    twTrail().forEach((P) => P.s.forEach((s) => {
      (s.pv || []).forEach(([x]) => { if (typeof x === 'string') twAdjParse(x).forEach((seg) => seg.codes.forEach((c) => add(nid(c.code), P.p, '', null, s.c, 'step'))); });
      (s.nx || []).forEach(([x]) => { if (typeof x === 'string') twAdjParse(x).forEach((seg) => seg.codes.forEach((c) => add(P.p, nid(c.code), '', s.c, null, 'step'))); });
    }));
    const name = (id) => (procs.has(id) ? `${id} ${procs.get(id).t}` : names.get(id) || id.replace(/^[xe]:/, ''));
    const mod = (id) => (procs.has(id) ? procs.get(id).m : null);
    return { E: [...E.values()], name, mod, procs, events, env };
  });
  return TW_GRAPH;
}
// Шаг процесса по коду (с ролью, системами и документами)
const twStepByCode = (P, c) => (c ? P.s.find((s) => s.c === c) || P.s.find((s) => s.c.startsWith(c + '.')) : null);
const twStepLine = (P, c) => { const s = P && twStepByCode(P, c); return s ? `<span class="tw-ps"><b>${twEsc(s.c)}</b> ${twEsc(s.t)}<em>${twEsc(lsRole(s))}${s.s.length ? ' · ' + twEsc(s.s.join(', ')) : ''}</em>${s.d.length ? `<i>документы: ${twEsc(s.d.join('; '))}</i>` : ''}</span>` : ''; };
// Связи уровня (модуль, процесс, шаг, все процессы): входы, выходы, внутренние — с номерами для стрелок дерева
function twBizLinks(n, G) {
  const P = n.P, inM = (id) => G.mod(id) === n.id;
  let L = [];
  if (n.type === 'pmr') L = G.E.map((e) => ({ e, dir: G.mod(e.f) && G.mod(e.t) && G.mod(e.f) === G.mod(e.t) ? 'mid' : 'x' }));
  else if (n.type === 'pm') L = G.E.filter((e) => inM(e.f) || inM(e.t)).map((e) => ({ e, dir: inM(e.f) && inM(e.t) ? 'mid' : inM(e.t) ? 'in' : 'out' }));
  else if (n.type === 'pp') L = G.E.filter((e) => e.f === P.p || e.t === P.p).map((e) => ({ e, dir: e.t === P.p ? 'in' : 'out' }));
  else if (n.type === 'ps') L = G.E.filter((e) => (e.t === P.p && [...e.tSteps].some((c) => n.s.c === c || n.s.c.startsWith(c + '.'))) || (e.f === P.p && [...e.fSteps].some((c) => n.s.c === c || n.s.c.startsWith(c + '.')))).map((e) => ({ e, dir: e.t === P.p ? 'in' : 'out' }));
  const ord = { in: 0, mid: 1, x: 1, out: 2 };
  L.sort((a, b) => ord[a.dir] - ord[b.dir]);
  L.forEach((l, i) => (l.n = i + 1));
  return L;
}
// Ветви на дереве режима процессов: модуль → модуль, процесс → процесс, шаг ← смежный процесс → шаг; остальное — плашки справа
function twBizXA(n, G, L) {
  const A = new Map(), pills = new Map(), nodes = new Set();
  const modName = (m) => (LS_MODS.find((x) => x.id === m) || {}).name || 'Смежные процессы';
  const pill = (id) => ({ pill: G.name(id), u: { g: { title: G.mod(id) ? modName(G.mod(id)) : 'Смежные процессы ОМГ / КМГ', type: G.mod(id) ? 'cd' : 'ext' } } });
  const ppNode = (code) => { const P = G.procs.get(code); if (!P) return null; const m = twKids(twPRoot()).find((x) => x.id === P.m); return m && twKids(m).find((x) => x.P.p === code); };
  const end = (id, steps) => {
    if (n.type === 'pmr') { const m = G.mod(id); return m ? { node: twKids(n).find((x) => x.id === m) } : pill(id); }
    if (n.type === 'pm') return G.mod(id) === n.id ? { node: ppNode(id) } : pill(id);
    const mine = id === n.P.p;
    if (!mine) return G.mod(id) === n.P.m && n.type === 'pp' ? { node: ppNode(id) } : pill(id);
    if (n.type === 'ps') return { node: n };
    const pp = n, st = [...steps].map((c) => twKids(pp).find((x) => x.s.c === c || x.s.c.startsWith(c + '.'))).find(Boolean);
    return { node: st || pp };
  };
  L.forEach((l) => {
    const ea = end(l.e.f, l.e.fSteps), eb = end(l.e.t, l.e.tSteps);
    if (!ea || !eb || (ea.node === undefined && !ea.pill) || (eb.node === undefined && !eb.pill)) return;
    const ka = twEndKey(ea), kb = twEndKey(eb);
    if (ka === kb) return;
    [ea, eb].forEach((x) => (x.pill ? pills.set(x.pill, x.u) : nodes.add(x.node)));
    const id = ka + '|' + kb;
    if (!A.has(id)) A.set(id, { a: ea, b: eb, ka, kb, dirs: new Set([ka + '>' + kb]), nums: new Set(), ks: new Set(), w: [] });
    const q = A.get(id); q.nums.add(l.n); q.ks.add(l.e.data.length ? 'auto' : 'seq'); q.w.push(`${l.n}. ${G.name(l.e.f)} → ${G.name(l.e.t)}${l.e.data.length ? ': ' + l.e.data.join('; ') : ''}`);
  });
  return { arrows: [...A.values()], pills, nodes };
}
// Список связей уровня: откуда (процесс, шаг, роль, система) → куда, какие данные / документы
function twBizListHTML(L, G, title, sub) {
  if (!L.length) return `<p class="tr-n">${title}: в BPMN связей с другими процессами не записано.</p>`;
  const side = (id, steps) => { const P = G.procs.get(id); return `<div class="tw-bz-e"><b>${twEsc(G.name(id))}</b>${G.mod(id) ? `<span>${twEsc((LS_MODS.find((x) => x.id === G.mod(id)) || {}).name || '')}</span>` : '<span>смежный процесс</span>'}${[...steps].map((c) => twStepLine(P, c)).join('')}</div>`; };
  const grp = { in: '⬇ Получает (входы)', out: '⬆ Отдаёт (выходы)', mid: '⇄ Внутри', x: '⇄ Между модулями и смежными процессами' };
  const groups = [...new Set(L.map((l) => l.dir))];
  return `<div class="tw-bz"><div class="tw-bz-h"><b>${title}</b><span>${sub}</span></div>
    ${groups.map((g) => `<div class="tw-bz-g g-${g}"><h4>${grp[g]} <em>${L.filter((l) => l.dir === g).length}</em></h4><ol>${L.filter((l) => l.dir === g).map((l) => `<li data-bl="${l.n}"><b class="ls-nb ${l.e.data.length ? 'k-auto' : 'k-seq'}">${l.n}</b>
      <div class="tw-bz-r">${side(l.e.f, l.e.fSteps)}<i>→</i>${side(l.e.t, l.e.tSteps)}</div>
      <p class="tw-bz-d">${l.e.data.length ? twEsc(l.e.data.join('; ')) : '<span class="tr-n">связь процессов по BPMN — данные в схеме не подписаны</span>'}</p></li>`).join('')}</ol></div>`).join('')}</div>`;
}
// Документы шагов процесса: Dream TO BE — кто и в какой системе; AS IS — как было (по сопоставлению шагов модели модуля)
function twDocsHTML(P, w) {
  const matrix = twEv(w, 'stepMatrix'), pool = twEv(w, 'pool');
  let rows = []; try { rows = matrix(P.n); } catch (e) { rows = []; }
  const asisV = pool && pool(P.n, 'asis') ? 'asis' : null;
  const asOf = (s) => { const r = rows.find((x) => x.code === s.c) || rows.find((x) => x.title === s.t); return r && asisV && r[asisV] ? r[asisV] : null; };
  const L = P.s.filter((s) => s.d.length || s.s.length);
  const docsN = P.s.reduce((t, s) => t + s.d.length, 0);
  return `<details class="tr-more tw-docs" open><summary>Документы и системы по шагам · ${docsN} ${twPlural(docsN, 'документ', 'документа', 'документов')} в Dream TO BE · как было в AS IS</summary>
    <div class="tw-cmp-t"><table class="ls-ab-t"><thead><tr><th>Шаг</th><th>Роль</th><th>Dream TO BE: системы · документы</th><th>AS IS: системы · документы</th></tr></thead><tbody>
    ${L.map((s) => { const a = asOf(s); return `<tr><td><b>${twEsc(s.c)}</b> ${twEsc(s.t)}</td><td>${twEsc(lsRole(s))}</td>
      <td>${s.s.map((x) => `<span class="tw-ch k-${twKind(lsKey(x))}">${twEsc(x)}</span>`).join(' ')}${s.d.length ? `<div class="tw-dl">${s.d.map((d) => `<span>${twEsc(d)}</span>`).join('')}</div>` : ''}</td>
      <td>${a ? `${(a.sys || []).map((x) => `<span class="tw-ch">${twEsc(x)}</span>`).join(' ') || '<span class="tr-n">без системы</span>'}${(a.docs || []).length ? `<div class="tw-dl as">${a.docs.map((d) => `<span>${twEsc(d)}</span>`).join('')}</div>` : ''}` : '<span class="tr-n">—</span>'}</td></tr>`; }).join('')}
    </tbody></table></div></details>`;
}
// Роли процесса: дорожки Dream TO BE и шаги каждой роли
function twRolesHTML(Ps) {
  const m = new Map();
  Ps.forEach((P) => P.s.forEach((s) => { const r = lsRole(s); if (!m.has(r)) m.set(r, []); m.get(r).push((Ps.length > 1 ? P.p + ' ' : '') + s.c); }));
  return `<div class="tw-roles">${[...m].sort((a, b) => b[1].length - a[1].length).map(([r, l]) => `<div><b>${twEsc(r)}</b><em>${l.length} ${twPlural(l.length, 'шаг', 'шага', 'шагов')}</em><span>${twEsc(l.slice(0, 14).join(', '))}${l.length > 14 ? ' …' : ''}</span></div>`).join('')}</div>`;
}
// Паспорт уровня: отраслевая рамка, триггер и результат, входы и выходы, роли, документы
function twPassFill(n) {
  const host = document.querySelector('[data-pass]');
  if (!host) return;
  twGraph().then((G) => {
    if (TW.node !== n || !host.isConnected) return;
    const L = twBizLinks(n, G);
    TW.bizN = L.length;
    let html = '';
    if (n.type === 'pmr') {
      html = `<h3>Upstream: этапы, цели и горизонты <span>стратсессия, сл. 3 · в мокапе — процессы этапа</span></h3>
        <div class="tw-st">${TW_STAGES.map((st) => `<div><b>${st.t}</b><span>цель: ${st.goal}</span>${st.resp ? `<span>ответственность: ${st.resp}</span>` : ''}<em>горизонт: ${st.hor}</em><div>${st.procs.filter((c) => G.procs.has(c)).map((c) => `<button class="tw-sc-go" data-pp="${c}">${c} ${twEsc(G.procs.get(c).t)}</button>`).join('')}</div></div>`).join('')}</div>
        <h3>Сквозные процессы <span>стратсессия, сл. 3</span></h3>
        <div class="tw-st x">${TW_CROSS.map(([t, d, ps]) => `<div><b>${t}</b><span>${d}</span><div>${ps.map((c) => `<button class="tw-sc-go" data-pp="${c}">${c} ${twEsc(G.procs.get(c).t)}</button>`).join('')}</div></div>`).join('')}</div>
        <h3>Карта связей между модулями <span>что процессы одного модуля передают процессам другого и смежным процессам · по BPMN · снизу вверх: геология → разработка → бурение → добыча; связи внутри модуля — на уровне модуля</span></h3><div class="tw-pmap"></div>
        ${twBizListHTML(L, G, 'Связи между процессами', 'смежные процессы, данные и шаги из BPMN')}`;
    } else if (n.type === 'pm') {
      const stg = TW_STAGES.filter((st) => st.procs.some((c) => G.mod(c) === n.id));
      html = `<h3>Место в цепочке Upstream <span>стратсессия, сл. 3</span></h3><div class="tw-st">${stg.map((st) => `<div><b>${st.t}</b><span>цель: ${st.goal}</span>${st.resp ? `<span>ответственность: ${st.resp}</span>` : ''}<em>горизонт: ${st.hor}</em></div>`).join('')}</div>
        ${twBizListHTML(L, G, `Что модуль получает и отдаёт`, 'входы из других модулей и смежных процессов, выходы, связи процессов внутри модуля · шаг, роль, система, документы')}
        <h3>Роли модуля <span>дорожки Dream TO BE · шаги</span></h3>${twRolesHTML(twKids(n).map((k) => k.P))}
        ${(() => { const Ps = twKids(n).map((k) => k.P), N = Ps.reduce((t, P) => t + P.s.reduce((u, x) => u + x.d.length, 0), 0); return N ? `<details class="tr-more tw-docs"><summary>Документы модуля · ${N} ${twPlural(N, 'документ', 'документа', 'документов')} в шагах Dream TO BE — кто готовит и в какой системе</summary>
          <div class="tw-cmp-t"><table class="ls-ab-t"><thead><tr><th>Процесс · шаг</th><th>Роль</th><th>Система</th><th>Документы</th></tr></thead><tbody>
          ${Ps.flatMap((P) => P.s.filter((x) => x.d.length).map((x) => `<tr><td><b>${twEsc(P.p)} ${twEsc(x.c)}</b> ${twEsc(x.t)}</td><td>${twEsc(lsRole(x))}</td><td>${x.s.map((y) => `<span class="tw-ch k-${twKind(lsKey(y))}">${twEsc(y)}</span>`).join(' ')}</td><td><div class="tw-dl">${x.d.map((d) => `<span>${twEsc(d)}</span>`).join('')}</div></td></tr>`)).join('')}
          </tbody></table></div></details>` : ''; })()}`;
    } else if (n.type === 'pp') {
      const ev = G.events.get(n.P.p) || {};
      html = `${ev.start || (ev.end || []).length ? `<div class="tw-te">${ev.start ? `<div class="in"><i>Триггер — что запускает процесс</i><b>${twEsc(ev.start)}</b></div>` : ''}${(ev.end || []).length ? `<div class="out"><i>Результат процесса</i><b>${twEsc(ev.end.join('; '))}</b></div>` : ''}</div>` : ''}
        ${twBizListHTML(L, G, 'Что процесс получает и отдаёт', 'смежные процессы · на каком шаге, кто, в какой системе, документы шага')}
        <h3>Роли процесса <span>дорожки Dream TO BE · шаги</span></h3>${twRolesHTML([n.P])}
        ${twDocsHTML(n.P, G.env.get(n.P.m))}`;
    } else if (n.type === 'ps') {
      html = L.length ? twBizListHTML(L, G, 'Связи шага со смежными процессами', 'что шаг получает из других процессов и что передаёт') : '';
    }
    host.innerHTML = html;
    host.querySelectorAll('[data-pp]').forEach((b) => (b.onclick = () => { const P = G.procs.get(b.dataset.pp); const m = twKids(twPRoot()).find((x) => x.id === P.m); const k = m && twKids(m).find((x) => x.P.p === P.p); if (k) twGo(k); }));
    host.querySelectorAll('[data-bl]').forEach((li) => { const no = +li.dataset.bl; li.onmouseenter = () => twXHot(no, true); li.onmouseleave = () => twXHot(no, false); });
    // Дерево: ветви потока между процессами
    if (TW.net) { const cv = document.querySelector('.tr-cv-in'); twCanvas(cv, n, { root: twPRoot(), pillLabel: 'Смежные процессы и модули', XA: twBizXA(n, G, L) }); twPmBind(cv); }
    if (n.type === 'pmr') twPMap(host.querySelector('.tw-pmap'), G, L);
  });
}
// Карта процессов Upstream: процессы рядами по модулям (снизу вверх), стрелки — передачи между процессами
function twPMap(host, G, L) {
  if (!host) return;
  const units = new Map(), row = { geologiya: 0, razrabotka: 1, burenie: 2, dobycha: 3 };
  const unit = (id) => {
    const lab = G.name(id).length > 34 ? G.name(id).slice(0, 33) + '…' : G.name(id);
    if (!units.has(lab)) { const m = G.mod(id); units.set(lab, { k: lab, kind: m ? 'abai' : 'ext', g: { key: m || 'ext', title: m ? (LS_MODS.find((x) => x.id === m) || {}).name : 'Смежные процессы ОМГ / КМГ', type: m ? 'cd' : 'ext' }, row: m ? row[m] : 4, w: 230 }); }
    return lab;
  };
  const edges = L.filter((l) => l.dir !== 'mid').map((l) => ({ f: unit(l.e.f), t: unit(l.e.t), w: l.e.data.join('; ') || 'связь процессов по BPMN', r: [...l.e.src].join(', '), k: l.e.data.length ? 'auto' : 'seq', n: l.n }));
  lsNet(host, TW.grid, edges, TW_V, { info: (k) => units.get(k), onPick: (i) => twPick(i) });
}
// ---------- Отрисовка ----------
function twRender() {
  if (TW.mode === 'scen') return twRenderScen();
  if (TW.mode === 'pm') return twRenderPm();
  document.querySelectorAll('[data-mode]').forEach((b) => b.classList.toggle('on', b.dataset.mode === 'tree'));
  const n = TW.node;
  const chain = []; for (let x = n; x; x = x.parent) chain.unshift(x);
  const kids = twKids(n);
  const typeT = n.type === 'mod' ? (n.def.ext ? 'Система' : n.part.id === 'data' && !/^ABAI/.test(n.id) ? 'Система данных' : 'Модуль ABAI') + ' · ' + n.part.t : TW_TYPES[n.type];
  document.querySelector('.tr-main').innerHTML = `
    <div class="tr-cv"><div class="tr-cv-in"></div></div>
    <div class="tr-detail">
      <div class="tw-depth">${TW_LEVELS.map((t, i) => `<span class="${i < twLevel(n) ? 'was' : i === twLevel(n) ? 'on' : ''}">${i ? '<i>›</i>' : ''}${t}</span>`).join('')}<em>уровень погружения ${twLevel(n) + 1} из ${TW_LEVELS.length}</em></div>
      <div class="tr-crumbs">${chain.map((x, i) => `${i ? '<i>›</i>' : ''}<a href="#" data-path="${twEsc(twKey(x))}">${twEsc(x.label)}</a>`).join('')}</div>
      <div class="tr-head"><span class="tr-type tw-t-${n.type}">${twEsc(typeT)}</span>
        <h1>${twEsc(n.label)}${n.def && n.def.alt ? ` <em class="alt">(${twEsc(n.def.alt)})</em>` : ''}</h1></div>
      ${twSceneHTML(n)}
      <div class="tr-content">${twBody(n)}</div>
      ${twBpmnHTML(n)}
    </div>`;
  const X = TW.net ? twLinks(n) : null;
  twCanvas(document.querySelector('.tr-cv-in'), n, X);
  twScene(n, X);
  twBpmnFill(n);
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
  const pm = twRootOf(n).type === 'pmr';
  TW.mode = pm ? 'pm' : 'tree';
  TW.node = n;
  if (pm) TW.pmNode = n; else TW.treeNode = n;
  history.replaceState(null, '', (pm ? '#pm/' : '#') + twKey(n));
  twRender();
}
const twCurHash = () => (TW.mode === 'scen' ? twScenHash() : (TW.mode === 'pm' ? '#pm/' : '#') + twKey(TW.node));
function twStart() {
  const p = location.hash.replace(/^#/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (p[0] === 'sc') { if (!TW.node) TW.node = twRoot(); return twScenGo(p[1] || (twScens()[0] || {}).id, +p[2] || 0); }
  if (p[0] === 'pm') return twGo(twPFind(p.slice(1)));
  twGo(twFind(p));
}
// «Далее / Назад»: в дереве — по узлам, в сценарии — по шагам цепочки
function twNav(d) {
  if (TW.mode === 'scen') { const n = (twScens().find((x) => x.id === TW.sc) || { e: [] }).e.length; const k = TW.scStep + d; if (k >= 0 && k <= n) twScenGo(TW.sc, k); return; }
  twGo(d > 0 ? twNext(TW.node) : twPrev(TW.node));
}
function twInit() {
  const h = document.getElementById('tr-hidden');
  abaiLandscape(h, TW_V, null);
  TW.grid = h.querySelector('.ls-grid');
  document.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => twNav(b.dataset.nav === '1' ? 1 : -1)));
  document.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => (b.dataset.mode === 'scen' ? twScenGo(TW.sc || (twScens()[0] || {}).id, 0) : b.dataset.mode === 'pm' ? twGo(TW.pmNode || twPRoot()) : twGo(TW.treeNode || twRoot()))));
  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('select, input, textarea')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); twNav(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); twNav(-1); }
    else if (e.key === 'Backspace' && TW.mode !== 'scen' && TW.node.parent) { e.preventDefault(); twGo(TW.node.parent); }
  });
  window.addEventListener('hashchange', () => { if (location.hash !== twCurHash()) twStart(); });
  lsTrailLoad().then(twStart);
}
twInit();
