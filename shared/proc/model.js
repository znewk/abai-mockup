// Общая модель модулей на BPMN «AS IS / TO BE Nedra / Dream TO BE» (Бурение, Геология, Разработка).
// Модуль до этого файла объявляет: BPMN (bpmn-data.js) и в config.js — MODULE, VARIANTS, SYS, SYS_ALIAS,
// LANE_ALIAS, ROLE_FIXED, PROC_META; по желанию — normSysName(name) → [имена], manualOf(task).

const ROLE_COLORS = ['#1c5cab', '#0f7a55', '#b45309', '#6b3fa0', '#b0305e', '#0e7490', '#4a5568', '#9a3412'];
const sysKind = (name) => (SYS[name] ? SYS[name].kind : /^ABAI /.test(name) ? 'abai' : /^Nedra/.test(name) ? 'nedra' : /Excel|Outlook|Word|MS Office|Телефон|чат|Email/i.test(name) ? 'manual' : 'ext');

// ---------- Нормализация данных BPMN ----------
// Названия систем бывают склеены («ABAI БД 2.0, SLB Petrel; COMPASS», «ИС ABAI (ЦРНС, УЗ, Petrel)») и пишутся по-разному
function normSys(list) {
  const out = [];
  const add = (x) => { x = x.trim(); if (!x) return; if (/^[а-я]/.test(x)) x = x[0].toUpperCase() + x.slice(1); x = SYS_ALIAS[x] || x; (Array.isArray(x) ? x : [x]).forEach((y) => { if (!out.includes(y)) out.push(y); }); };
  list.forEach((s) => {
    const custom = typeof normSysName === 'function' ? normSysName(s) : null;
    if (custom) custom.forEach(add);
    else s.split(/[,;]\s*/).forEach(add);
  });
  return out;
}
BPMN.forEach((p) => {
  p.pools.forEach((pl) => {
    pl.lanes.forEach((l) => { l.name = LANE_ALIAS[l.name] || l.name; });
    pl.nodes.forEach((n) => { if (n.sys) n.sys = normSys(n.sys); });
  });
  if (PROC_META[p.num] && PROC_META[p.num].title) p.title = PROC_META[p.num].title;
});

// ---------- Помощники по данным BPMN ----------
const proc = (num) => BPMN.find((p) => p.num === +num);
const pool = (num, v) => proc(num).pools.find((p) => p.variant === v);
const procLabel = (num) => proc(num).code || `${MODULE.letter}${num}`;
// Варианты, которые есть в BPMN процесса (в Г3.4 нет TO BE Nedra, в Р5 нет Dream TO BE)
const variantsOf = (num) => Object.keys(VARIANTS).filter((v) => pool(num, v));
// Вариант, по которому строятся процесс и рабочее место: Dream TO BE, а если его нет — AS IS
const baseVariant = (num) => (pool(num, 'dream') ? 'dream' : 'asis');
const basePool = (num) => pool(num, baseVariant(num));
const hasDream = (num) => !!pool(num, 'dream');

function roleColor(name) {
  name = name.split(' · ')[0];
  if (ROLE_FIXED[name]) return ROLE_FIXED[name];
  let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ROLE_COLORS[h % ROLE_COLORS.length];
}
// Имя дорожки; если такое же имя есть в другой организации — уточняем родителем («Дирекция · КМГ»)
function laneName(pl, id) {
  const l = pl.lanes.find((x) => x.id === id);
  if (!l) return '—';
  const twins = pl.lanes.filter((x) => x.name === l.name && !x.group);
  const parent = l.parent && pl.lanes.find((x) => x.id === l.parent);
  return twins.length > 1 && parent ? `${l.name} · ${parent.name}` : l.name;
}
const baseRole = (name) => name.split(' · ')[0];
const tasksOf = (pl) => (pl ? pl.nodes.filter((n) => n.kind === 'task') : []);
// Роли процесса: дорожки базового варианта, где есть шаги, по убыванию числа шагов
function rolesOf(num) {
  const pl = basePool(num);
  const cnt = {};
  tasksOf(pl).forEach((t) => { const n = laneName(pl, t.lane); cnt[n] = (cnt[n] || 0) + 1; });
  return Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n }));
}

// Ручная работа шага: документы Excel / Word / PDF и ручные инструменты (чат, Outlook)
function manualOfDefault(t) {
  return t.docs.filter((d) => /Excel|Word|PDF/.test(d)).length + t.sys.filter((s) => sysKind(s) === 'manual').length;
}
const manualCount = (t) => (typeof manualOf === 'function' ? manualOf(t) : manualOfDefault(t));
const isAbaiStep = (t) => t.sys.some((s) => sysKind(s) === 'abai');

// Сопоставление шагов вариантов: по коду и роли, при перенумерации — по сходству названия
const words = (s) => new Set(s.toLowerCase().replace(/ё/g, 'е').match(/[а-яa-z0-9]{4,}/g) || []);
function similarity(a, b) {
  const A = words(a), B = words(b);
  if (!A.size || !B.size) return 0;
  let k = 0; A.forEach((w) => { if (B.has(w)) k++; });
  return k / Math.max(A.size, B.size);
}
function stepMatrix(num) {
  const bv = baseVariant(num), bpl = pool(num, bv);
  const rows = tasksOf(bpl).map((t) => ({ code: t.code, title: t.title, lane: laneName(bpl, t.lane), id: t.id, [bv]: { sys: t.sys, docs: t.docs, manual: manualCount(t) } }));
  variantsOf(num).filter((v) => v !== bv).forEach((v) => {
    const pl = pool(num, v);
    const used = new Set();
    tasksOf(pl).forEach((t) => {
      const lane = laneName(pl, t.lane);
      let r = rows.find((x) => !used.has(x) && x.code && x.code === t.code && x.lane === lane && similarity(x.title, t.title) > 0.25);
      if (!r) {
        let best = null, bs = 0.55;
        rows.forEach((x) => { if (used.has(x) || x[v]) return; const s = similarity(x.title, t.title) + (x.lane === lane ? 0.1 : 0); if (s > bs) { bs = s; best = x; } });
        r = best;
      }
      if (!r) { r = { code: t.code, title: t.title, lane, only: v }; rows.push(r); }
      used.add(r);
      r[v] = { sys: t.sys, docs: t.docs, manual: manualCount(t), code: t.code };
    });
  });
  const codeKey = (c) => (c ? c.replace(/[^\d.].*$/, '').split('.').map((x) => x.padStart(3, '0')).join('.') : 'zzz');
  return rows.sort((a, b) => (a.only ? 1 : 0) - (b.only ? 1 : 0) || codeKey(a.code).localeCompare(codeKey(b.code)));
}
// Счётчики по варианту
function variantStats(num, v) {
  const pl = pool(num, v);
  const ts = tasksOf(pl);
  const all = ts.flatMap((t) => t.sys);
  return {
    steps: ts.length,
    manual: ts.reduce((s, t) => s + manualCount(t), 0),
    abaiSteps: ts.filter(isAbaiStep).length,
    abai: new Set(all.filter((s) => sysKind(s) === 'abai')).size,
    nedra: new Set(all.filter((s) => sysKind(s) === 'nedra')).size,
    systems: [...new Set(all)],
  };
}
// Шаги Dream TO BE, которых нет в описании Nedra (детализация, as is KMGD)
function detailSteps(num) {
  if (!pool(num, 'asisn') || !hasDream(num)) return [];
  const n = tasksOf(pool(num, 'asisn'));
  return tasksOf(pool(num, 'dream')).filter((t) => !n.some((x) => (x.code && x.code === t.code) || similarity(x.title, t.title) > 0.7));
}
// Оптимизации — аннотации базового варианта с пометкой («Оптимизация:», «Оптимизируется:», «Автоматизация:»)
function optimizations(num) {
  const out = [];
  const re = MODULE.optRe || /^(Оптимиз[а-яё]*|Автоматизац[а-яё]*|TO BE):\s*/i;
  tasksOf(basePool(num)).forEach((t) => t.notes.filter((x) => re.test(x)).forEach((x) => {
    const text = x.replace(re, '');
    const same = out.find((o) => o.text === text);
    if (same) same.codes.push(t.code); else out.push({ t, text, codes: [t.code] });
  }));
  out.forEach((o) => o.codes.sort());
  return out;
}
