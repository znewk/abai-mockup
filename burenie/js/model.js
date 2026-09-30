// Справочники модуля «Бурение»: системы, роли, метаданные процессов.
// Шаги, дорожки и системы по шагам берутся из BPMN (bpmn-data.js).

const MODULE = { id: 'burenie', name: 'Бурение', letter: 'Б', org: 'АО «Озенмунайгаз»' };

// В каждом BPMN четыре пула. Dream TO BE построен на детальном AS IS (as is KMGD) — с ним и сравниваем.
const VARIANTS = {
  asisn: { name: 'AS IS Nedra', sub: 'Как сейчас — в описании Nedra', tone: 'asis' },
  asis:  { name: 'AS IS', sub: 'Как сейчас — детально (as is KMGD)', tone: 'asis' },
  nedra: { name: 'TO BE Nedra', sub: 'С продуктами Nedra', tone: 'nedra' },
  dream: { name: 'Dream TO BE', sub: 'Наш вариант на ABAI', tone: 'dream' },
};

// Системы: kind — abai | nedra | ext (отраслевые и корпоративные) | manual (ручной труд)
const SYS = {
  'ABAI БД 2.0':   { kind: 'abai', desc: 'Единая база данных: карточка скважины, формы, документы, статусы и уведомления' },
  'ABAI ЦРНС 2.0': { kind: 'abai', desc: 'Цифровая разработка: подбор точек бурения, атлас, ковёр бурения' },
  'ABAI ПДИМ 2.0': { kind: 'abai', desc: 'Планирование добычи и мониторинг: планы по новым скважинам, показатели работы' },
  'ABAI ТР 2.0':   { kind: 'abai', desc: 'Технологические режимы скважин' },
  'ABAI ПАЭГТМ':   { kind: 'abai', desc: 'Планирование и анализ эффективности ГТМ: кандидаты на КРС/ПРС и эффект' },
  'КХД':           { kind: 'abai', desc: 'Корпоративное хранилище данных — слой интеграций (станция ГТИ, КМГ)' },
  'ИС ABAI':       { kind: 'abai', desc: 'Текущая версия ABAI (AS IS)' },
  'Цифровая программа бурения': { kind: 'nedra', desc: 'Nedra: совместная разработка и согласование программы бурения' },
  'Система ведения суточной отчётности': { kind: 'nedra', desc: 'Nedra: цифровая суточная отчётность по бурению' },
  'Система мониторинга бурения': { kind: 'nedra', desc: 'Nedra: мониторинг бурения в реальном времени' },
  'Real-Time Data': { kind: 'nedra', desc: 'Nedra: передача данных реального времени со станции' },
  'Цифровая система планирования ПП': { kind: 'nedra', desc: 'Nedra: планирование производственной программы' },
  'Платформа данных по скважинам': { kind: 'nedra', desc: 'Nedra: дата-платформа по скважинам' },
  'Единая инженерная среда': { kind: 'nedra', desc: 'Nedra: единая среда инженерных приложений' },
  'Система инженерных расчётов': { kind: 'nedra', desc: 'Nedra: инженерные расчёты для экспертизы' },
  'Система аналитики': { kind: 'nedra', desc: 'Nedra: аналитика по бурению' },
  'LLM+RAG':       { kind: 'nedra', desc: 'Nedra: база знаний с языковой моделью' },
  'SLB Petrel':    { kind: 'ext', desc: 'Геологическое моделирование' },
  'SLB Techlog':   { kind: 'ext', desc: 'Петрофизика и геомеханика' },
  'COMPASS':       { kind: 'ext', desc: 'Проектирование траектории скважины' },
  'WellPlan':      { kind: 'ext', desc: 'Инженерные расчёты бурения: гидравлика, нагрузки' },
  'Sysdrill':      { kind: 'ext', desc: 'Проектирование траектории и КНБК' },
  'tNavigator':    { kind: 'ext', desc: 'Гидродинамическое моделирование' },
  'AutoCAD':       { kind: 'ext', desc: 'Чертежи и проектирование' },
  'ArcReader':     { kind: 'ext', desc: 'Просмотр карт' },
  'ОПИ':           { kind: 'ext', desc: 'Опытно-промышленные испытания' },
  'ПК ЭРА':        { kind: 'ext', desc: 'Расчёт выбросов и нормативов ООС' },
  'Государственный портал': { kind: 'ext', desc: 'elicense.kz — разрешения госорганов' },
  'Портал закупок Самрук-Казына': { kind: 'ext', desc: 'Тендеры и договоры' },
  'Петролайн ДЭЛ-140/150': { kind: 'ext', desc: 'Станция ГТИ: глубина, нагрузка, обороты, давление' },
  'Контроль бурения и ремонта скважин': { kind: 'ext', desc: 'Текущая система контроля бурения и ремонта' },
  'Инженерные расчёты': { kind: 'ext', desc: 'Инженерные расчёты подрядчика' },
  'АВР+':          { kind: 'ext', desc: 'Акты выполненных работ и заказ-наряды подрядчиков' },
  'Directum':      { kind: 'ext', desc: 'СЭД: согласование ПОР' },
  'Рабочий чат':   { kind: 'manual', desc: 'Мессенджер (WhatsApp) — согласования и отклонения в переписке' },
};
const sysKind = (name) => (SYS[name] ? SYS[name].kind : /Excel|Outlook|Word|MS Office|Телефон|чат/i.test(name) ? 'manual' : 'ext');

// Названия систем в BPMN склеены («ABAI БД 2.0, SLB Petrel; COMPASS») и пишутся по-разному — приводим к справочнику
const SYS_ALIAS = {
  'Государственный портал (elicense.kz)': 'Государственный портал', 'Directum (СЭД)': 'Directum',
  'Единая инженерная среда: Petrel': 'Единая инженерная среда', 'Techlog': 'SLB Techlog',
  'Система суточной отчётности': 'Система ведения суточной отчётности',
};
function normSys(list) {
  const out = [];
  list.forEach((s) => s.split(/[,;]\s*/).forEach((x) => {
    x = x.trim();
    if (!x) return;
    if (/^[а-я]/.test(x)) x = x[0].toUpperCase() + x.slice(1);
    x = SYS_ALIAS[x] || x;
    if (!out.includes(x)) out.push(x);
  }));
  return out;
}
BPMN.forEach((p) => p.pools.forEach((pl) => pl.nodes.forEach((n) => { if (n.sys) n.sys = normSys(n.sys); })));
// Название процесса — из имени пула (в имени файла оно сокращено): «Б2. Подготовка … площадки — DREAM TO-BE ABAI»
BPMN.forEach((p) => { const d = p.pools.find((x) => x.variant === 'dream'); if (d) p.title = d.pool.replace(/^Б\d+\.\s*/, '').replace(/\s+—\s+.*$/, ''); });

// Ручной труд шага: документы в Excel / Word / PDF и согласования в рабочем чате
const manualOf = (t) => t.docs.filter((d) => /Excel|Word|PDF/.test(d)).length + t.sys.filter((s) => sysKind(s) === 'manual').length;

// Цвета ролей — по названию дорожки, одинаковые во всех процессах
const ROLE_COLORS = ['#1c5cab', '#0f7a55', '#b45309', '#6b3fa0', '#b0305e', '#0e7490', '#4a5568', '#9a3412'];
const ROLE_FIXED = {
  'ОМГ (ДЗО)': '#0f7a55', 'Геологи ОМГ': '#1c5cab', 'Подрядная организация': '#b45309', 'Буровая бригада подрядчика': '#9a3412',
  'КМГИ (Ф)': '#b0305e', 'КМГИ (ГО)': '#6b3fa0', 'КМГ': '#4a5568', 'КазНИПИ': '#0e7490', 'Маркшейдеры': '#0369a1',
};
function roleColor(name) {
  name = name.split(' · ')[0];
  if (ROLE_FIXED[name]) return ROLE_FIXED[name];
  let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ROLE_COLORS[h % ROLE_COLORS.length];
}

// Метаданные процессов: короткие названия, главная роль рабочего места, суть изменений
const PROC_META = {
  1: { short: 'Проектирование', icon: '⌖', owner: 'ОМГ (ДЗО)', ws: 'Портфель проектирования скважин',
       idea: 'Точки бурения, атлас и ковёр ведутся в ЦРНС 2.0, производственная программа — в БД 2.0 с планами добычи из ПДИМ 2.0. ТЗ, техпроект, экспертиза и замечания — в карточке скважины с историей версий, без пересылки Excel и PDF.' },
  2: { short: 'Подготовка к бурению', icon: '▦', owner: 'ОМГ (ДЗО)', ws: 'Готовность скважин к бурению',
       idea: 'Тендерный пакет собирается из техпроекта, подрядчик получает доступ к проекту и разрешениям в БД 2.0 вместо почты. Программа бурения, ГТН, МТР, площадка и ВМР — один чек-лист готовности до допуска к бурению.' },
  3: { short: 'Мониторинг бурения', icon: '⟟', owner: 'ОМГ (ДЗО)', ws: 'Бурение онлайн: РВД и отклонения',
       idea: 'Данные станции ГТИ идут через КХД в БД 2.0 онлайн. Суточный рапорт собирается автоматически, отклонения от программы подсвечиваются сами, мероприятия согласуются статусом вместо рабочего чата, дело скважины собирается без ручной работы.' },
  4: { short: 'Освоение', icon: '◉', owner: 'ОМГ (ДЗО)', ws: 'Освоение новых скважин',
       idea: 'Приёмка, программа освоения, операции и паспорт скважины — в БД 2.0 на данных Б1–Б3. Работа новой скважины за месяц и сравнение с соседями — из ПДИМ 2.0, режим ставится на контроль в ТР 2.0.' },
  5: { short: 'Бригады ВСР', icon: '⛟', owner: 'ОМГ (ДЗО)', ws: 'График и контроль бригад КРС/ПРС',
       idea: 'Годовой план КРС/ПРС строится по кандидатам ПАЭГТМ, график движения бригад и назначения — в БД 2.0, заказ-наряд — в АВР+. Бригадо-часы считаются из суточных рапортов, статус бригад и простои видны онлайн.' },
};

// Помощники по данным BPMN
const proc = (num) => BPMN.find((p) => p.num === +num);
const pool = (num, v) => proc(num).pools.find((p) => p.variant === v);
// Имя дорожки; если такое же имя есть в другой организации — уточняем родителем («Дирекция · КМГ»)
function laneName(pl, id) {
  const l = pl.lanes.find((x) => x.id === id);
  if (!l) return '—';
  const twins = pl.lanes.filter((x) => x.name === l.name && !x.group);
  const parent = l.parent && pl.lanes.find((x) => x.id === l.parent);
  return twins.length > 1 && parent ? `${l.name} · ${parent.name}` : l.name;
}
const baseRole = (name) => name.split(' · ')[0];
const tasksOf = (pl) => pl.nodes.filter((n) => n.kind === 'task');
// Роли процесса: дорожки Dream TO BE, где есть шаги, по убыванию числа шагов
function rolesOf(num) {
  const pl = pool(num, 'dream');
  const cnt = {};
  tasksOf(pl).forEach((t) => { const n = laneName(pl, t.lane); cnt[n] = (cnt[n] || 0) + 1; });
  return Object.entries(cnt).sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n }));
}
// Шаги с одинаковым кодом в одном пуле (5.3.1 у ОМГ и подрядчика) различаем по названию и роли
const stepKey = (t, pl) => `${t.code}|${laneName(pl, t.lane)}`;
// Сопоставление шагов вариантов по коду (1.4, 2.5.1 …)
function stepMatrix(num) {
  const rows = new Map();
  Object.keys(VARIANTS).forEach((v) => {
    const pl = pool(num, v);
    tasksOf(pl).forEach((t) => {
      const key = t.code ? stepKey(t, pl) : `~${t.title}`;
      if (!rows.has(key)) rows.set(key, { code: t.code, title: t.title, lane: laneName(pl, t.lane) });
      const r = rows.get(key);
      r[v] = { sys: t.sys, docs: t.docs, manual: manualOf(t) };
      if (v === 'dream') { r.title = t.title; r.lane = laneName(pl, t.lane); }
    });
  });
  const codeKey = (c) => (c ? c.split('.').map((x) => x.padStart(3, '0')).join('.') : 'zzz');
  return [...rows.values()].sort((a, b) => codeKey(a.code).localeCompare(codeKey(b.code)));
}
// Счётчики ручного труда и систем по варианту
function variantStats(num, v) {
  const pl = pool(num, v);
  const all = tasksOf(pl).flatMap((t) => t.sys);
  return {
    steps: tasksOf(pl).length,
    manual: tasksOf(pl).reduce((s, t) => s + manualOf(t), 0),
    abai: new Set(all.filter((s) => sysKind(s) === 'abai')).size,
    nedra: new Set(all.filter((s) => sysKind(s) === 'nedra')).size,
    systems: [...new Set(all)],
  };
}
// Шаги Dream TO BE, которых нет в описании Nedra (детализация as is KMGD)
function detailSteps(num) {
  const n = new Set(tasksOf(pool(num, 'asisn')).map((t) => t.code));
  return tasksOf(pool(num, 'dream')).filter((t) => !n.has(t.code));
}
// Оптимизации — аннотации Dream TO BE с пометкой «Оптимизация:»
// (одинаковый текст у параллельных шагов 5.6.1 / 5.6.2 объединяется)
function optimizations(num) {
  const out = [];
  tasksOf(pool(num, 'dream')).forEach((t) => t.notes.filter((x) => /^Оптимизация/.test(x)).forEach((x) => {
    const text = x.replace(/^Оптимизация:\s*/, '');
    const same = out.find((o) => o.text === text);
    if (same) same.codes.push(t.code); else out.push({ t, text, codes: [t.code] });
  }));
  out.forEach((o) => o.codes.sort());
  return out;
}
