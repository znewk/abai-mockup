// Справочники и демо-данные мокапа «ABAI · Освоение скважин».
// Процесс — «Б4. Освоение — умеренный TO BE ОМГ» из 04_4. Освоение.bpmn.

const ROLES = {
  contractor: { id: 'contractor', name: 'Подрядная организация', short: 'Подрядчик', user: 'Жумабаев Е. К.', org: 'ТОО «Демо Бурсервис»', color: '#8a5a00' },
  geologist:  { id: 'geologist',  name: 'Геологи ОМГ',           short: 'Геолог ОМГ', user: 'Серикова А. М.', org: 'АО «Озенмунайгаз», отдел геологии', color: '#1c5cab' },
  dzo:        { id: 'dzo',        name: 'ОМГ (ДЗО)',             short: 'ОМГ (ДЗО)',  user: 'Ахметов Н. Б.',  org: 'АО «Озенмунайгаз», ПТО',            color: '#0f7a55' },
};

const SYSTEMS = {
  bd:   { name: 'ABAI БД 2.0',  desc: 'Единая база данных скважин: документы, акты, программы' },
  tr:   { name: 'ABAI ТР',      desc: 'Технологические режимы: данные о работе скважины' },
  tr2:  { name: 'ABAI ТР 2.0',  desc: 'Аналитика технологических режимов, сравнение скважин' },
  kp:   { name: 'КП 2.0',       desc: 'Карточка / паспорт скважины' },
  avr:  { name: 'АВР+',         desc: 'Акты выполненных работ подрядчика' },
  scada:{ name: 'SCADA',        desc: 'Телеметрия, суточный отчёт по интеграции' },
  kxd:  { name: 'КХД',          desc: 'Корпоративное хранилище данных. Слой бизнес-интеграций' },
  nca:  { name: 'NCA Layer',    desc: 'Подписание ЭЦП (НУЦ РК)' },
};

// Шаги процесса. code — номер из BPMN, role — дорожка, sys — хранилища данных, note — аннотации из BPMN.
const STEPS = [
  { id: 'upload', code: '—',   title: 'Загрузка акта приёмки в ИС', role: 'contractor', sys: ['bd'],
    out: ['Акт приёмки скважины (скан физического документа)'],
    note: 'Подрядчик загружает акт приёмки в ABAI БД 2.0 — дальше документ живёт в системе, а не в почте.' },
  { id: 'accept', code: '4.0', title: 'Проверить и принять скважину после бурения по техническому проекту', role: 'geologist', sys: ['bd', 'nca'],
    in: ['Акт приёмки скважины', 'Технический проект'], out: ['Акт приёмки, подписанный ЭЦП'],
    note: 'Документ открывается из системы для проверки и подписания. Подписание через NCA Layer; подписанный акт поступает в БД.' },
  { id: 'send',   code: '—',   title: 'Направить подписанный акт подрядчику по ИС', role: 'geologist', sys: ['bd'],
    out: ['Уведомление подрядчику'],
    note: 'Подписанный акт уходит подрядчику внутри ИС — без пересылки по Outlook.' },
  { id: 'prep',   code: '4.1', title: 'Подготовить скважину к освоению после бурения', role: 'contractor', sys: ['bd', 'avr'],
    in: ['Подписанный акт приёмки'], out: ['Акт об окончании бурения', 'Подтверждение готовности'],
    note: 'В системе уже есть акт приёмки, далее подрядная организация загружает акт об окончании бурения.' },
  { id: 'program',code: '4.2', title: 'Разработать программу освоения после бурения', role: 'contractor', sys: ['bd'],
    in: ['Технический проект', 'Финальный отчёт по бурению'], out: ['Программа освоения (рабочая)'],
    note: 'Тех. проект загружается в систему; программа освоения отправляется в БД на согласование.' },
  { id: 'approve',code: '4.3', title: 'Согласовать программу освоения после бурения', role: 'dzo', sys: ['bd', 'nca'],
    in: ['Программа освоения (рабочая)'], out: ['Согласованная программа освоения', 'ПОР'],
    note: 'Подписание через NCA Layer. Подписанная программа освоения хранится в ABAI БД 2.0.' },
  { id: 'ops',    code: '4.4', title: 'Провести операции освоения с ведением цифровой отчётности', role: 'contractor', sys: ['bd', 'tr'],
    in: ['Согласованная программа освоения'], out: ['Суточные рапорты', 'Материалы ГИС', 'Акт перфорации и промывки', 'Запись о спуске оборудования', 'Данные о притоке'],
    note: 'Каждая операция фиксируется в ABAI БД 2.0; результаты ГИС и данные о притоке передаются в ABAI ТР.' },
  { id: 'observe',code: '4.4.5', title: 'Наблюдать стабильную работу скважины в течение месяца', role: 'geologist', sys: ['scada', 'tr'],
    in: ['Суточный отчёт SCADA (интеграция)'], out: ['Подтверждение выхода на технологический режим'],
    note: 'Суточный отчёт попадает в ТР из SCADA по интеграции. Запись данных о работе скважины, выход на тех. режим.' },
  { id: 'compare',code: '4.4.6', title: 'Сравнить показатели с соседними скважинами', role: 'geologist', sys: ['tr2'],
    in: ['Технологический режим скважины и окружения'], out: ['Сравнительный анализ скважин'],
    note: 'Сравнение выполняется внутри ABAI ТР 2.0 — без выгрузок в Excel.' },
  { id: 'report', code: '4.5', title: 'Сформировать отчётность и обновить цифровое дело скважины', role: 'dzo', sys: ['bd', 'kp', 'avr', 'kxd', 'nca'],
    in: ['Суточные рапорты', 'Акты', 'Сравнительный анализ'], out: ['Акт выполненных работ', 'Обновлённый паспорт скважины'],
    note: 'Вся информация из ИС ABAI попадает в КХД.' },
];

// Подшаги операций освоения (4.4.1 — 4.4.4)
const OPS = [
  { id: 'gis',   code: '4.4.1', title: 'Геофизические исследования скважины', sys: ['bd', 'tr'], doc: 'Материалы ГИС (PDF)',
    fields: [
      { k: 'method',   label: 'Комплекс ГИС', type: 'select', opts: ['АКЦ + СГДТ + ГК + ЛМ', 'ГК + НГК + ЛМ', 'АКЦ + ГК + ЛМ + термометрия'] },
      { k: 'interval', label: 'Интервал исследований, м', type: 'text', ph: '1050–1240' },
      { k: 'cement',   label: 'Качество цементирования', type: 'select', opts: ['Сплошной контакт', 'Частичный контакт', 'Отсутствие контакта в интервале'] },
      { k: 'concl',    label: 'Заключение', type: 'textarea', ph: 'Кратко: продуктивные пропластки, рекомендации по интервалам перфорации' },
    ],
    demo: { method: 'АКЦ + СГДТ + ГК + ЛМ', interval: '1048–1236', cement: 'Сплошной контакт', concl: 'Выделены нефтенасыщенные пропластки горизонта XIV: 1182–1188 м, 1194–1199 м. Рекомендована перфорация в указанных интервалах.' } },
  { id: 'perf',  code: '4.4.2', title: 'Перфорация и промывка скважины', sys: ['bd'], doc: 'Акт перфорации и промывки (PDF)',
    fields: [
      { k: 'intervals', label: 'Интервалы перфорации, м', type: 'text', ph: '1182–1188; 1194–1199' },
      { k: 'gun',       label: 'Тип перфоратора', type: 'select', opts: ['ПКС-105', 'ПКО-89', 'ПКС-80'] },
      { k: 'density',   label: 'Плотность, отв./м', type: 'number', ph: '20' },
      { k: 'wash',      label: 'Объём промывки, м³', type: 'number', ph: '24' },
    ],
    demo: { intervals: '1182–1188; 1194–1199', gun: 'ПКС-105', density: 20, wash: 26 } },
  { id: 'equip', code: '4.4.3', title: 'Спуск воронки и гидромуфты', sys: ['bd'], doc: 'Запись о спуске оборудования',
    fields: [
      { k: 'funnel', label: 'Глубина спуска воронки, м', type: 'number', ph: '1170' },
      { k: 'hydro',  label: 'Глубина установки гидромуфты, м', type: 'number', ph: '1120' },
      { k: 'tubing', label: 'НКТ', type: 'select', opts: ['73 мм', '60 мм', '89 мм'] },
    ],
    demo: { funnel: 1172, hydro: 1118, tubing: '73 мм' } },
  { id: 'inflow',code: '4.4.4', title: 'Получение притока жидкости', sys: ['bd', 'tr'], doc: 'Данные о полученном притоке',
    fields: [
      { k: 'method', label: 'Способ вызова притока', type: 'select', opts: ['Свабирование', 'Компрессирование', 'Замена жидкости на облегчённую'] },
      { k: 'ql',     label: 'Дебит жидкости, т/сут', type: 'number', ph: '38' },
      { k: 'wc',     label: 'Обводнённость, %', type: 'number', ph: '52' },
      { k: 'pwf',    label: 'Забойное давление, атм', type: 'number', ph: '64' },
    ],
    demo: { method: 'Свабирование', ql: 41, wc: 54, pwf: 63 } },
];

const FIELDS = ['Узень', 'Карамандыбас'];

// Детерминированный генератор, чтобы графики не «прыгали» между перезагрузками
function seeded(seed) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => (s = s * 16807 % 2147483647) / 2147483647;
}

// 30 суток работы скважины после освоения (суточный отчёт SCADA → ABAI ТР)
function genObservation(seed, ql0 = 44, wc0 = 58) {
  const r = seeded(seed), rows = [];
  const start = new Date(2026, 7, 20);
  for (let d = 0; d < 30; d++) {
    const settle = Math.exp(-d / 6);
    const ql = ql0 * (0.82 + 0.18 * settle) + (r() - 0.5) * 2.2;
    const wc = wc0 - 6 * (1 - settle) + (r() - 0.5) * 1.6;
    const date = new Date(start); date.setDate(start.getDate() + d);
    rows.push({ day: d + 1, date, ql: +ql.toFixed(1), qo: +(ql * (1 - wc / 100) * 0.86).toFixed(1), wc: +wc.toFixed(1), hours: r() < 0.08 ? 21 + Math.round(r() * 2) : 24 });
  }
  return rows;
}

function genNeighbors(seed, name) {
  const r = seeded(seed + 7);
  const base = parseInt(name.replace(/\D/g, ''), 10) || 7400;
  return Array.from({ length: 6 }, (_, i) => {
    const ql = 22 + r() * 30, wc = 45 + r() * 35;
    return { name: `${base - 37 + i * 13}`, dist: Math.round(280 + r() * 700), ql: +ql.toFixed(1), wc: +wc.toFixed(1), qo: +(ql * (1 - wc / 100) * 0.86).toFixed(1), year: 2019 + Math.floor(r() * 7) };
  });
}

function makeWell(o) {
  return Object.assign({
    type: 'ННС', horizon: 'XIV', contractor: 'ТОО «Демо Бурсервис»', rig: 'ZJ-40 № 12',
    step: 0, ops: 0, docs: [], log: [], data: {}, returned: null, done: false,
  }, o);
}

function demoWells() {
  const d = (s) => s; // даты храним строками — удобно для localStorage
  const wells = [
    makeWell({ id: 'u7412', name: '7412', field: 'Узень', pad: '312', depth: 1260, drillEnd: d('2026-09-19'), step: 0 }),
    makeWell({ id: 'u7398', name: '7398', field: 'Узень', pad: '309', depth: 1245, drillEnd: d('2026-09-14'), step: 1 }),
    makeWell({ id: 'k1184', name: '1184', field: 'Карамандыбас', pad: '41', depth: 2980, type: 'ГС', horizon: 'Ю-XIII', drillEnd: d('2026-09-08'), step: 4 }),
    makeWell({ id: 'u7377', name: '7377', field: 'Узень', pad: '305', depth: 1238, drillEnd: d('2026-09-02'), step: 5 }),
    makeWell({ id: 'u7351', name: '7351', field: 'Узень', pad: '301', depth: 1252, drillEnd: d('2026-08-27'), step: 6, ops: 2 }),
    makeWell({ id: 'u7320', name: '7320', field: 'Узень', pad: '297', depth: 1249, drillEnd: d('2026-08-12'), step: 7 }),
    makeWell({ id: 'k1171', name: '1171', field: 'Карамандыбас', pad: '39', depth: 2940, type: 'ГС', horizon: 'Ю-XIII', drillEnd: d('2026-08-01'), step: 8 }),
    makeWell({ id: 'u7295', name: '7295', field: 'Узень', pad: '294', depth: 1241, drillEnd: d('2026-07-21'), step: 9 }),
    makeWell({ id: 'u7260', name: '7260', field: 'Узень', pad: '290', depth: 1236, drillEnd: d('2026-07-02'), step: 10, done: true }),
  ];
  // Для скважин, уже прошедших шаги, дозаполняем документы и журнал — чтобы дело выглядело «живым»
  wells.forEach((w, i) => backfill(w, i));
  return wells;
}

function backfill(w, seedIdx) {
  const t0 = new Date(w.drillEnd + 'T09:00:00');
  const at = (h) => new Date(t0.getTime() + h * 3600e3).toISOString();
  let h = 2;
  for (let s = 0; s < Math.min(w.step, STEPS.length); s++) {
    const st = STEPS[s], who = ROLES[st.role];
    h += 6 + (s * 7) % 11;
    if (st.id === 'ops') {
      OPS.forEach((op) => { w.data[op.id] = Object.assign({}, op.demo); addDoc(w, { name: op.doc, step: 'ops', by: who.user, at: at(h) }); h += 20; });
      w.ops = OPS.length;
    } else if (st.id === 'observe') {
      w.data.observeOk = true;
    } else if (st.id === 'compare') {
      w.data.compareConcl = 'Показатели скважины соответствуют окружению.';
      addDoc(w, { name: 'Сравнительный анализ скважин', step: 'compare', by: who.user, at: at(h), sys: 'tr2' });
    } else {
      (st.out || []).forEach((n) => addDoc(w, { name: n, step: st.id, by: who.user, at: at(h), signed: st.sys.includes('nca') }));
    }
    w.log.push({ at: at(h), role: st.role, user: who.user, text: `${st.code !== '—' ? st.code + ' · ' : ''}${st.title} — выполнено` });
  }
  if (w.step === 6 && w.ops) {
    OPS.slice(0, w.ops).forEach((op) => { w.data[op.id] = Object.assign({}, op.demo); addDoc(w, { name: op.doc, step: 'ops', by: ROLES.contractor.user, at: at(h += 20) }); });
  }
  if (w.done) w.log.push({ at: at(h + 4), role: 'dzo', user: ROLES.dzo.user, text: 'АВР оформлен, паспорт скважины обновлён. Данные переданы в КХД' });
}

function addDoc(w, d) {
  w.docs.push(Object.assign({ id: 'd' + Math.random().toString(36).slice(2, 8), size: (180 + Math.floor(Math.random() * 2400)) + ' КБ', signed: false, sys: 'bd' }, d));
}

// Сравнение вариантов процесса — из трёх пулов BPMN
const PROCESS_VARIANTS = [
  { key: 'asis', title: 'AS IS', sub: 'Как сейчас', tone: 'asis',
    lanes: 'Подрядчик · Геологи ОМГ · ОМГ (ДЗО)',
    points: ['Документы — Word / PDF / Excel', 'Каждый шаг передаётся через Microsoft Outlook (10 передач)', 'Мониторинг месяца и сравнение с соседями — в Excel', 'Паспорт скважины обновляется вручную; ИС ABAI и АВР+ — только в конце'],
  },
  { key: 'tobe', title: 'Умеренный TO BE ОМГ', sub: 'На продуктах ABAI — этот мокап', tone: 'tobe',
    lanes: 'Подрядчик · Геологи ОМГ · ОМГ (ДЗО)',
    points: ['Все документы загружаются и хранятся в ABAI БД 2.0', 'Подписание ЭЦП через NCA Layer прямо в ИС', 'Суточный отчёт SCADA поступает в ABAI ТР по интеграции', 'Сравнение с соседними скважинами — в ABAI ТР 2.0', 'Цифровое дело скважины (БД 2.0 + КП 2.0) → КХД'],
  },
  { key: 'nedra', title: 'TO BE Nedra', sub: 'Целевой вариант с продуктами Nedra', tone: 'nedra',
    lanes: 'Подрядчик · ОМГ (ДЗО)',
    points: ['Цифровая программа бурения', 'Система ведения суточной отчётности', 'Цифровой маршрут согласования', 'Отчётность: ИС ABAI + АВР+ + LLM + RAG', 'Шаги 4.4.1–4.4.6 свёрнуты в один шаг 4.4'],
  },
];

// Пошаговое сравнение систем по вариантам (из BPMN)
const PROCESS_MATRIX = [
  { step: 'Приёмка скважины (4.0)', asis: 'PDF + Outlook', tobe: 'ABAI БД 2.0 + ЭЦП (NCA Layer)', nedra: 'АВР+, система суточной отчётности (в 4.1)' },
  { step: '4.1 Подготовка к освоению', asis: 'PDF + АВР+ + Outlook', tobe: 'ABAI БД 2.0 + АВР+', nedra: 'АВР+, система суточной отчётности' },
  { step: '4.2 Программа освоения', asis: 'Word / PDF + Outlook', tobe: 'ABAI БД 2.0', nedra: 'Цифровая программа бурения' },
  { step: '4.3 Согласование программы', asis: 'Word / PDF + Outlook', tobe: 'ABAI БД 2.0 + ЭЦП (NCA Layer)', nedra: 'Цифровая программа бурения (цифровой маршрут)' },
  { step: '4.4.1–4.4.4 Операции освоения', asis: 'PDF + Outlook (4 передачи)', tobe: 'ABAI БД 2.0 + ABAI ТР', nedra: 'Система ведения суточной отчётности' },
  { step: '4.4.5 Наблюдение месяц', asis: 'Excel + Outlook', tobe: 'SCADA → ABAI ТР (интеграция)', nedra: '—' },
  { step: '4.4.6 Сравнение с соседями', asis: 'Excel + Outlook', tobe: 'ABAI ТР 2.0', nedra: '—' },
  { step: '4.5 Отчётность и паспорт', asis: 'ИС ABAI + АВР+ (вручную)', tobe: 'ABAI БД 2.0 + КП 2.0 → КХД', nedra: 'ИС ABAI + АВР+ + система отчётности + LLM + RAG' },
];
