// Справочники модуля «Добыча»: системы, роли, метаданные процессов.
// Шаги, дорожки и системы по шагам берутся из BPMN (bpmn-data.js).

const VARIANTS = {
  asis:  { name: 'AS IS', sub: 'Как сейчас', tone: 'asis' },
  nedra: { name: 'TO BE Nedra', sub: 'С продуктами Nedra', tone: 'nedra' },
  dream: { name: 'Dream TO BE', sub: 'Наш вариант на ABAI', tone: 'dream' },
};

// Системы: kind — abai | nedra | ext (промысловые и корпоративные) | manual (ручной труд)
const SYS = {
  'ABAI БД 2.0':   { kind: 'abai', desc: 'Единая база данных: скважины, документы, программы, акты' },
  'ABAI ПДИМ 2.0': { kind: 'abai', desc: 'Планирование добычи и мониторинг: план/факт, отклонения, алармы полноты данных' },
  'ABAI ПАЭГТМ':   { kind: 'abai', desc: 'Планирование и анализ эффективности ГТМ и мероприятий' },
  'ABAI ТР 2.0':   { kind: 'abai', desc: 'Технологические режимы скважин' },
  'ABAI ПГНО':     { kind: 'abai', desc: 'Подбор глубинно-насосного оборудования' },
  'ABAI ЦРНС 2.0': { kind: 'abai', desc: 'Выбор системы разработки, режимов и заканчивания скважин' },
  'ABAI ПФ':       { kind: 'abai', desc: 'Модуль ABAI для пакета исходных данных (по BPMN, шаг 4.2.1)' },
  'ABAI БД':       { kind: 'abai', desc: 'Текущая база данных ABAI' },
  'КХД':           { kind: 'abai', desc: 'Корпоративное хранилище данных — слой бизнес-интеграций' },
  'Nedra.DATA':    { kind: 'nedra', desc: 'Дата-платформа Nedra' },
  'DigitalTwin':   { kind: 'nedra', desc: 'Nedra.DIGITAL TWIN — цифровой двойник добычи' },
  'NUMEX':         { kind: 'nedra', desc: 'Nedra.NUMEX — гидродинамическое моделирование' },
  'INFRAPLAN':     { kind: 'nedra', desc: 'Nedra.INFRAPLAN — наземная инфраструктура' },
  'WWO':           { kind: 'nedra', desc: 'Nedra.WWO — внутрискважинные работы' },
  'ПАОТ':          { kind: 'nedra', desc: 'Предиктивный анализ отказов трубопроводов' },
  'СДМО':          { kind: 'ext', desc: 'Промысловая система: замеры и параметры работы скважин' },
  'Green Data':    { kind: 'ext', desc: 'Промысловые данные' },
  'ИМ':            { kind: 'ext', desc: 'Интеллектуальное месторождение' },
  'ИСУТО':         { kind: 'ext', desc: 'Учёт техобслуживания и ремонтов' },
  'АВР+':          { kind: 'ext', desc: 'Акты выполненных работ подрядчиков' },
  'Procu':         { kind: 'ext', desc: 'Закупки' },
  'АСКУЭ':         { kind: 'ext', desc: 'Коммерческий учёт электроэнергии' },
  'АСТУЭ':         { kind: 'ext', desc: 'Технический учёт электроэнергии' },
  'SCADA':         { kind: 'ext', desc: 'Телеметрия АСУ ТП' },
  'PipeSim':       { kind: 'ext', desc: 'Моделирование скважины и трубопроводов' },
  'UniSim':        { kind: 'ext', desc: 'Моделирование процессов подготовки' },
  'AutoCAD':       { kind: 'ext', desc: 'Проектирование' },
  'Questor':       { kind: 'ext', desc: 'Стоимостная оценка' },
  'PipeSim UniSim': { kind: 'ext', desc: 'Инженерные расчёты' },
  'Questor AutoCAD': { kind: 'ext', desc: 'Проектирование и стоимостная оценка' },
};
const sysKind = (name) => (SYS[name] ? SYS[name].kind : /Excel|Outlook|Word|MS Office|Телефон/i.test(name) ? 'manual' : 'ext');

// Цвета ролей — по названию дорожки, одинаковые во всех процессах
const ROLE_COLORS = ['#1c5cab', '#0f7a55', '#b45309', '#6b3fa0', '#b0305e', '#0e7490', '#4a5568', '#9a3412'];
const ROLE_FIXED = {
  'ЦИТО': '#1c5cab', 'СОУП НГДУ': '#0e7490', 'Промысел': '#b45309', 'НГДУ': '#9a3412', 'Службы НГДУ': '#0f7a55',
  'ДДНГ': '#6b3fa0', 'ЭМГ (ДЗО)': '#1c5cab', 'КМГИ': '#b0305e', 'КМГИ АФ': '#b0305e', 'КМГИ (Ф)': '#b0305e', 'КМГИ ГО': '#b0305e',
  'Дирекция': '#4a5568', 'Дирекции': '#4a5568', 'ДАЦ': '#4a5568', 'КМГ': '#4a5568', 'БЭиФ': '#0e7490', 'ПО': '#b45309',
  'Подрядная организация': '#b45309', 'Служба ГМ': '#0f7a55', 'ПТД': '#6b3fa0', 'Дирекция ЭМГ': '#1c5cab', 'Геол. служба НГДУ': '#0e7490',
};
function roleColor(name) {
  name = name.split(' · ')[0];
  if (ROLE_FIXED[name]) return ROLE_FIXED[name];
  let h = 0; for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return ROLE_COLORS[h % ROLE_COLORS.length];
}

// Метаданные процессов: короткие названия, главная роль рабочего места, суть изменений
const PROC_META = {
  1: { short: 'Учёт добычи', icon: '▤', owner: 'ЦИТО', ws: 'Суточная сводка и сверка источников',
       idea: 'Данные СДМО, Green Data и ИМ собираются в КХД, ПДИМ 2.0 сам проверяет полноту и расхождения, ЦИТО подтверждает — без Excel-сводок и запросов по почте.' },
  2: { short: 'Мониторинг добычи', icon: '◔', owner: 'СОУП НГДУ', ws: 'План/факт и карточки отклонений',
       idea: 'Отклонения выявляются в ПДИМ 2.0 и оформляются карточкой, причины и потери разбираются по ТР 2.0, мероприятия ведутся в ПАЭГТМ.' },
  3: { short: 'Потенциал базовой добычи', icon: '◭', owner: 'ДДНГ', ws: 'Потенциал базовой добычи по сценариям',
       idea: 'Новый шаг 3.4а: потенциал базовой добычи считается по сценариям на данных ПДИМ, ТР и ПГНО; решения и изменения ПП идут через БД 2.0.' },
  4: { short: 'ИМА', icon: '⌬', owner: 'ДДНГ', ws: 'Интегрированная модель актива',
       idea: 'Новый шаг 4.2а: интегрированная модель «пласт – скважина – инфраструктура» актуализируется в ABAI, расчёты и рекомендации хранятся в БД 2.0.' },
  5: { short: 'Потенциал мероприятия', icon: '◈', owner: 'ДДНГ', ws: 'Мероприятия: потенциал и экономика',
       idea: 'Новый шаг 5.3а: эффект мероприятия считается по сценариям в ПАЭГТМ («целеполагание от потенциала»), ТЭО и экономика — в одном контуре.' },
  6: { short: 'Подбор ГНО', icon: '⚙', owner: 'ДДНГ', ws: 'Заявки и подбор погружного оборудования',
       idea: 'Новый шаг 6.3а: исходные данные для подбора собираются автоматически. Подбор, дизайн и сопровождение ГНО — в ABAI ПГНО вместо Excel и PipeSim-файлов.' },
  7: { short: 'Энергоэффективность', icon: '⚡', owner: 'Дирекция ЭМГ', ws: 'Дашборд энергоэффективности',
       idea: 'Новый шаг 7.2а: УРЭ и КПД отслеживаются на дашборде ПДИМ 2.0, данные АСКУЭ/АСТУЭ и СДМО сводятся в БД 2.0.' },
  8: { short: 'Трубопроводы', icon: '═', owner: 'Служба ГМ', ws: 'Реестр трубопроводов и риски',
       idea: 'Новый шаг 8.6а: риск отказа и остаточный ресурс трубопроводов оцениваются в ПДИМ 2.0; паспорта, диагностика и программа надёжности — в одной системе.' },
  9: { short: 'Мехфонд', icon: '⛭', owner: 'Службы НГДУ', ws: 'Состояние механизированного фонда',
       idea: 'Отказы и отклонения мехфонда выявляются по ТР 2.0, причины по ГНО — в ПГНО, мероприятия и наряд-заказы — в ПАЭГТМ и БД 2.0.' },
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
// Сопоставление шагов вариантов по коду (1.4, 6.3.2 …); новые шаги Dream TO BE — с буквой «а»
function stepMatrix(num) {
  const rows = new Map();
  ['asis', 'nedra', 'dream'].forEach((v) => {
    const pl = pool(num, v);
    tasksOf(pl).forEach((t) => {
      const key = t.code || `~${t.title}`;
      if (!rows.has(key)) rows.set(key, { code: t.code, title: t.title, lane: laneName(pl, t.lane) });
      const r = rows.get(key);
      r[v] = { sys: t.sys, docs: t.docs };
      if (v === 'dream') { r.title = t.title; r.lane = laneName(pl, t.lane); }
    });
  });
  const codeKey = (c) => (c ? c.replace(/а$/, '.5').split('.').map((x) => x.padStart(3, '0')).join('.') : 'zzz');
  return [...rows.values()].sort((a, b) => codeKey(a.code).localeCompare(codeKey(b.code)));
}
// Счётчики ручного труда и систем по варианту
function variantStats(num, v) {
  const pl = pool(num, v);
  const all = tasksOf(pl).flatMap((t) => t.sys);
  return {
    steps: tasksOf(pl).length,
    manual: all.filter((s) => sysKind(s) === 'manual').length,
    abai: new Set(all.filter((s) => sysKind(s) === 'abai')).size,
    nedra: new Set(all.filter((s) => sysKind(s) === 'nedra')).size,
    systems: [...new Set(all)],
  };
}
