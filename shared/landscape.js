// Схема на портале: модули, продукты и системы, потоки данных в ЦД — AS IS / TO BE Nedra / Dream TO BE (ABAI).
// Архитектура TO BE — по стратсессии (слайд 54 «Целевое видение единой платформы данных и интеграций»,
// слайд 34 — соответствие продуктов Nedra и ABAI); AS IS — по BPMN модулей и слайдам 3, 35–37, 53, 54.
// Системы по модулям — из BPMN (shared/landscape-data.js, генерирует tools/build_landscape.js).

const LS_MODS = [
  { id: 'geologiya', name: 'Геология', sub: 'Г1, Г3, Г3.1–Г3.4' },
  { id: 'razrabotka', name: 'Разработка', sub: 'Р1–Р5' },
  { id: 'burenie', name: 'Бурение и освоение', sub: 'Б1–Б5 (Б4 — модуль «Освоение»)' },
  { id: 'dobycha', name: 'Добыча', sub: 'Д1–Д9 · ОМГ' },
];

// Одинаковые системы под разными именами в BPMN и на схеме — один ключ для подсветки и стрелок
const LS_ALIAS = {
  NUMEX: 'Nedra.NUMEX', DigitalTwin: 'Nedra.DIGITAL TWIN', INFRAPLAN: 'Nedra.INFRAPLAN', WWO: 'Nedra.WWO', 'ABAI УЗ': 'ABAI УЗ 2.0',
  'SLB Petrel': 'Petrel', 'SLB Techlog': 'Techlog', 'SCADA (WinCC, DeltaV)': 'SCADA', 'СДМС (ОМГ)': 'СДМС', 'СДМО (ЭМГ)': 'СДМО',
  'MS Office (Excel, Word)': 'MS Office', 'SAP ERP / SAP ТОРО': 'SAP', 'СЭД (Directum)': 'СЭД', 'Петролайн ДЭЛ-140/150': 'ДЭЛ-140/150',
};
// В AS IS «Разработка» называет текущие модули «ABAI БД 2.0», «ABAI ПДИМ 2.0» — это те же текущие модули ABAI
const LS_ALIAS_ASIS = { 'ABAI БД 2.0': 'ABAI БД', 'ABAI ПДИМ 2.0': 'ABAI ПДИМ', 'ABAI ТР 2.0': 'ABAI ТР' };
let LS_CUR = 'asis';
const lsKey = (s) => (LS_CUR === 'asis' && LS_ALIAS_ASIS[s]) || LS_ALIAS[s] || s;

const LS_VIEWS = {
  asis: {
    name: 'AS IS', sub: 'как сейчас', v: 'asis',
    lead: 'Единого цифрового двойника нет: у каждой функции свои системы, данные между ними переносятся вручную — через Excel и Word, почту, рабочий чат и СЭД.',
    flow: [
      ['Замеры и датчики', 'SCADA, СДМО / СДМС, АГЗУ, ИСУ — данные остаются в промысловых системах', '.ls-box.asu > .ls-box-h'],
      ['Сводки в файлах', 'рапорты и сводки собираются в MS Office: в «Добыче» 111 привязок шагов к MS Office', '.ls-manual'],
      ['Пересылка', 'почта, рабочий чат, СЭД, сетевые папки', '.ls-zone.data > .ls-zone-h'],
      ['Ручной ввод', 'перенос в текущие модули ABAI и инженерное ПО — Petrel, tNavigator, COMPASS', '.ls-zone.asis:not(.data) > .ls-zone-h'],
      ['Отчётность', 'руководству ДЗО, КМГИ и КЦ — снова файлы', '.ls-box.users > .ls-box-h'],
    ],
  },
  nedra: {
    name: 'TO BE Nedra', sub: 'ЦД на Nedra.PLATFORM', v: 'nedra',
    lead: 'Целевое видение стратсессии: ЦД Актива — единая платформа на базе Nedra.PLATFORM над слоем данных КХД + NDP. Данные АСУ ТП собирает MES, внешние системы подключаются через адаптеры.',
    flow: [
      ['АСУ ТП → MES', 'сбор, верификация, хранение и обработка данных в зоне ДЗО', '.ls-box.mes > .ls-box-h'],
      ['Слой данных', 'потоки данных в КХД + NDP (Nedra Data Platform): ETL, стриминг, озеро данных', '.ls-zone.data > .ls-zone-h'],
      ['Бизнес-модули ЦД', 'ЦД пласта, скважины, добычи и наземной инфраструктуры читают и пишут через слой данных', '.ls-box.mods > .ls-box-h'],
      ['Платформа ЦД Актива', 'каталог процессов, BPM, AI-агенты, сквозная аналитика активов', '.ls-box.plat > .ls-box-h'],
      ['Web-доступ', 'КЦ, КМГИ, ЦИО и ДЗО работают в одном контуре; SAP, СЭД, гос. порталы — через интеграции', '.ls-box.users > .ls-box-h'],
    ],
  },
  dream: {
    name: 'Dream TO BE', sub: 'ЦД на ABAI', v: 'dream',
    lead: 'Наш вариант: та же архитектура ЦД, но бизнес-модули — продукты ABAI (соответствие Nedra ↔ ABAI — стратсессия, слайд 34), единая база — ABAI БД 2.0, слой бизнес-интеграций — КХД.',
    flow: [
      ['АСУ ТП → сбор', 'SCADA, СДМО / СДМС, ИСУ, АСКУЭ / АСТУЭ — данные поступают автоматически', '.ls-box.asu > .ls-box-h'],
      ['КХД', 'слой бизнес-интеграций: собирает данные промысла и обменивается с SAP, СЭД, гос. порталами', '.ls-zone.data > .ls-zone-h'],
      ['ABAI БД 2.0', 'единая база: скважины, замеры, документы, статусы и уведомления', '.ls-box.plat > .ls-box-h'],
      ['ЦД на базе ABAI', 'ЦРНС 2.0, УЗ 2.0, ПДИМ 2.0, ТР 2.0, ПГНО, ПАЭГТМ, Цифровое бурение, мониторинг ТКРС', '.ls-box.mods > .ls-box-h'],
      ['Решения по ролям', 'КЦ, КМГИ, ЦИО и ДЗО видят одни данные', '.ls-box.users > .ls-box-h'],
    ],
  },
};

// Что даёт ЦД — по встрече по ЦД 01.10, с привязкой к процессам мокапа
const LS_VALUE = [
  ['Увижу, что мероприятия не те или неэкономичны', 'эффективность ГТМ и экономика', [['razrabotka', 'Р2 Программа ГТМ'], ['dobycha', 'Д3 Потенциал по базовой добыче'], ['dobycha', 'Д5 Расчёт потенциала мероприятия']]],
  ['Подскажет, что наиболее эффективно', 'сценарные расчёты', [['dobycha', 'Д4 ИМА'], ['razrabotka', 'Р1 Система разработки'], ['razrabotka', 'Р4 Оптимизация ППД']]],
  ['Добыча', 'план / факт, отклонения, мехфонд', [['dobycha', 'Д1 Учёт добычи'], ['dobycha', 'Д2 Мониторинг добычи'], ['dobycha', 'Д9 Мехфонд']]],
  ['Подскажет, как бурить', 'проектирование и мониторинг бурения', [['burenie', 'Б1 Проектирование'], ['burenie', 'Б3 Мониторинг бурения']]],
  ['Подскажет, какую бригаду отправлять', 'сейчас бригады приезжают несогласованно', [['burenie', 'Б5 Бригады ВСР']]],
];
function lsValue() {
  const href = (id) => { const m = typeof ABAI_MODULES !== 'undefined' && ABAI_MODULES.find((x) => x.id === id); return m ? m.v1 : id + '/'; };
  return `<div class="ls-value">
    <div class="ls-value-h"><b>Что даёт ЦД</b><span>эффективность ГТМ, добыча, экономика · встреча по ЦД 01.10</span></div>
    <div class="ls-value-c">${LS_VALUE.map(([t, d, ps]) => `<div><b>${t}</b><span>${d}</span><div>${ps.map(([m, p]) => `<a href="${href(m)}#/">${p}</a>`).join('')}</div></div>`).join('')}</div>
    <div class="ls-note">Пилот ЦД КМГ — Восточный Молдабек (ЭМГ): около 700 сценарных расчётов за 6 дней, раньше — 38; план — 12 крупнейших месторождений, 90 % добычи (digitalbusiness.kz, 31.08.2026).</div>
  </div>`;
}

// ---------- Разметка ----------
const lsChip = (name, kind, note) => `<span class="ls-chip k-${kind}" data-sys="${lsKey(name)}">${name}${note ? `<em>${note}</em>` : ''}</span>`;
const lsBox = (title, body, cls = '') => `<div class="ls-box ${cls}"><div class="ls-box-h">${title}</div><div class="ls-box-b">${body}</div></div>`;
const lsPipe = (label, o = {}) => `<div class="ls-link ${o.manual ? 'manual' : ''} ${o.up ? 'up' : ''} ${o.both ? 'both' : ''}"><i></i><span>${label}</span></div>`;
const lsSrc = (t) => `<div class="ls-src">${t}</div>`;

function lsModules(view) {
  const v = LS_VIEWS[view].v;
  return LS_MODS.map((m) => {
    const meta = (typeof ABAI_MODULES !== 'undefined' && ABAI_MODULES.find((x) => x.id === m.id)) || { color: '#1c5cab', v1: m.id + '/' };
    const d = ABAI_LANDSCAPE_DATA[m.id][v];
    if (!d) return '';
    const sys = d.sys.filter((s) => s[1] !== 'manual').slice(0, view === 'asis' ? 9 : 8);
    const man = d.sys.filter((s) => s[1] === 'manual');
    const share = (n) => Math.round((n / d.steps) * 100);
    return `<a class="ls-mod" href="${meta.v1}#/" style="--c:${meta.color}">
      <div class="ls-mod-h"><b>${m.name}</b><span>${m.sub}</span></div>
      <div class="ls-mod-k">
        <div><b>${d.abai}</b> из ${d.steps}<span>шагов в ABAI · ${share(d.abai)} %</span></div>
        ${view === 'nedra' ? `<div><b>${d.nedra}</b><span>шагов с Nedra</span></div>` : ''}<div class="${d.manual ? 'bad' : 'ok'}"><b>${d.manual}</b><span>ручная работа</span></div>
      </div>
      ${d.procs < d.of ? `<div class="ls-mod-n">вариант есть в ${d.procs} из ${d.of} процессов BPMN</div>` : ''}
      <div class="ls-mod-s">${sys.map((s) => lsChip(s[0], s[1], s[2])).join('')}${man.map((s) => lsChip(s[0], 'manual', s[2])).join('')}</div>
    </a>`;
  }).join('');
}

// Центральная зона: системы / ЦД
function lsCentral(view) {
  if (view === 'asis') {
    return `<div class="ls-zone asis">
      <div class="ls-zone-h">Нет единого ЦД — системы по функциям ${lsSrc('BPMN AS IS · стратсессия, слайды 3, 35–37, 53')}</div>
      <div class="ls-cols c4">
        ${lsBox('Геология и разработка', ['Petrel', 'Kingdom', 'Spark', 'Techlog', 'tNavigator', 'Intersect', 'Eclipse'].map((s) => lsChip(s, 'ext')).join(''))}
        ${lsBox('Текущие модули ABAI', ['ИС ABAI', 'ABAI БД', 'ABAI ТР', 'ABAI ПДИМ', 'ABAI ПГНО', 'ABAI ПАЭГТМ', 'ABAI УЗ 2.0', 'ABAI ЦРНС 2.0', 'ABAI КП'].map((s) => lsChip(s, 'abai')).join('') + '<div class="ls-note">используются точечно: в «Разработке» 54 шага из 118, в «Геологии» 8 из 195</div>')}
        ${lsBox('Бурение', ['COMPASS', 'WellPlan', 'Sysdrill', 'Петролайн ДЭЛ-140/150', 'StarSteer', 'Landmark'].map((s) => lsChip(s, 'ext')).join(''))}
        ${lsBox('Наземная инфраструктура', ['PipeSim', 'UniSim', 'AutoCAD', 'Questor', 'ABC-4'].map((s) => lsChip(s, 'ext')).join(''))}
      </div>
      <div class="ls-manual">${['MS Office (Excel, Word)', 'Outlook', 'Рабочий чат', 'СЭД (Directum)', 'Сетевые папки'].map((s) => lsChip(s, 'manual')).join('')}<span>— обмен данными между системами и службами вручную</span></div>
    </div>
    ${lsPipe('ручная выгрузка и ввод', { manual: true, both: true })}
    <div class="ls-datarow"><div class="ls-zone data asis">
      <div class="ls-zone-h">Хранение данных — разрозненно ${lsSrc('стратсессия, слайды 3 и 54')}</div>
      <div class="ls-cols c2">
        ${lsBox('Локальные хранилища', ['GreenData', 'Локальные Excel', 'Directum', 'Сетевые папки'].map((s) => lsChip(s, s === 'Локальные Excel' ? 'manual' : 'ext')).join(''))}
        ${lsBox('КХД — собственная разработка КМГ', lsChip('КХД', 'abai') + '<div class="ls-note">существует, но в шагах AS IS BPMN не используется</div>')}
      </div>
    </div>${lsExtRow(view)}</div>`;
  }
  const nedra = view === 'nedra';
  // Заменяемый продукт Nedra — в скобках за названием модуля ABAI (стратсессия, слайд 34)
  const alt = (t) => (nedra || !t ? '' : ` <em class="alt">(${t})</em>`);
  const A = (s, n, prev) => `<span class="ls-chip k-abai big" data-sys="${lsKey(s)}"><span>${s}${alt(prev || '')}</span>${n ? `<small>${n}</small>` : ''}</span>`;
  const N = (s, n) => `<span class="ls-chip k-nedra big" data-sys="${lsKey(s)}">${s}${n ? `<small>${n}</small>` : ''}</span>`;
  const E = (s, n) => `<span class="ls-chip k-ext big" data-sys="${lsKey(s)}">${s}${n ? `<small>${n}</small>` : ''}</span>`;
  const twins = nedra
    ? [
      ['ЦД пласта', N('Nedra.NUMEX', 'система разработки') + N('Nedra.NUMEX Optimize', 'заводнение, ГТМ') + A('ABAI ПАЭГТМ') + A('ABAI ЦРНС 2.0') + '<div class="ls-note">в BPMN TO BE Nedra также: ' + ['Nedra.DS', 'Nedra.GCORE', 'Терра', 'Geomate'].map((s) => lsChip(s, 'nedra')).join('') + lsChip('ABAI БД 2.0', 'abai') + '</div>'],
      ['ЦД скважины', N('Nedra.RTM', 'бурение') + N('Nedra.WWO', 'ТКРС')],
      ['ЦД добычи и наземной инфраструктуры', N('Nedra.DIGITAL TWIN') + N('Nedra.INFRAPLAN', 'наземка · гидравлика · экономика') + N('Nedra.DIGITAL TWIN Pipe', 'предиктивная аналитика отказов') + A('ABAI УЗ 2.0') + A('ABAI ПДИМ 2.0') + A('ABAI ТР 2.0') + A('ABAI ПГНО') + E('Интеллектуальное месторождение')],
    ]
    : [
      ['ЦД пласта', A('ABAI ЦРНС 2.0', 'система разработки', 'Nedra.NUMEX') + A('ABAI УЗ 2.0', 'управление заводнением', 'NUMEX Optimize') + A('ABAI ПАЭГТМ', 'ГТМ и мероприятия')],
      ['ЦД скважины', A('ABAI Цифровое бурение', 'бурение', 'Nedra.RTM') + A('ABAI Цифровой мониторинг ТКРС', '', 'Nedra.WWO')],
      ['ЦД добычи и наземной инфраструктуры', A('ABAI ПДИМ 2.0', 'план/факт, отклонения', 'Nedra.DIGITAL TWIN') + A('ABAI ПДИМ 2.0 · целостность трубопроводов', '', 'DIGITAL TWIN Pipe') + A('ABAI Наземная инфраструктура', '', 'Nedra.INFRAPLAN') + A('ABAI ТР 2.0', 'режимы') + A('ABAI ПГНО', 'подбор ГНО') + E('Интеллектуальное месторождение')],
    ];
  return `<div class="ls-zone cz ${view}">
      <div class="ls-zone-h">Централизованная зона — развёртывание и администрирование: KMG-Digital ${lsSrc(nedra ? 'стратсессия, слайд 54' : 'стратсессия, слайды 34 и 54')}</div>
      ${nedra
    ? lsBox('ЦД Актива — единая платформа на базе Nedra.PLATFORM', `<div class="ls-plat"><b>Каталог процессов · конструктор бизнес-сценариев · сквозная аналитика активов</b>
          <div class="ls-cols c4">${['BPM — планировщик сквозных процессов (low-code, SLA, аудит)', 'AI-агенты', 'Регистраторы систем и хранилищ · адаптеры (REST / gRPC / Queue / Desktop Agent / Script / Excel)', 'Общие сервисы: уведомления · BI · визуализация'].map((t) => `<div class="ls-cell">${t}</div>`).join('')}</div></div>`, 'plat')
    : lsBox('ЦД Актива на модулях ABAI', `<div class="ls-plat abai">${A('ABAI БД 2.0', 'единая база: скважины, замеры, документы, статусы и уведомления')}<div class="ls-note">Платформенный слой (каталог процессов, BPM, AI-агенты) в стратсессии описан только для Nedra.PLATFORM — для ABAI не детализирован</div></div>`, 'plat')}
      ${lsPipe('вызов модулей и сервисов', { both: true })}
      ${lsBox('Бизнес-модули и вычислительные системы ЦД' + (nedra ? ' (Nedra · ABAI · инж. ПО)' : ' (ABAI · инж. ПО) <span class="ls-box-n">в скобках — продукт Nedra, который заменяет модуль ABAI (стратсессия, слайд 34)</span>'), `<div class="ls-cols c3 twins">${twins.map(([t, b]) => `<div class="ls-twin"><div class="ls-twin-h">${t}</div><div class="ls-twin-b">${b}</div></div>`).join('')}</div>`, 'mods')}
    </div>
    ${lsPipe('чтение / запись данных', { both: true })}
    <div class="ls-datarow"><div class="ls-zone data ${view}">
      <div class="ls-zone-h">${nedra ? 'Слой данных — КХД + NDP (Nedra Data Platform) · кластер OpenShift / OKD' : 'Слой данных — КХД: слой бизнес-интеграций'} ${lsSrc(nedra ? 'стратсессия, слайд 54' : 'стратсессия, слайды 34 и 54: Nedra.DATA → КХД')}</div>
      <div class="ls-tech">${nedra ? lsChip('КХД', 'abai') + lsChip('Nedra.DATA', 'nedra', 'NDP') : lsChip('КХД', 'abai', '(Nedra.DATA)')}
        ${['NiFi — ETL', 'Kafka + Debezium — стриминг / CDC', 'Trino — SQL-запросы', 'S3 / MinIO — озеро данных', 'Hive Metastore', 'SQL-СУБД', 'ElasticSearch + Kibana', 'AirFlow — оркестрация ETL', 'Superset — BI', 'Keycloak — SSO'].map((t) => `<span class="ls-t">${t}</span>`).join('')}</div>
      ${nedra ? '' : '<div class="ls-note">Технологический стек слоя данных — со слайда 54 (КХД + NDP); для варианта ABAI стратсессия его отдельно не описывает</div>'}
    </div>${lsExtRow(view)}</div>`;
}

// Производственные системы ДЗО вне BPMN модулей — по встрече по ЦД 01.10 и публикациям КМГ; потоки данных не показаны (источника нет)
const LS_PROD = [
  ['HSE — работы повышенной опасности', 'ЦД скважины и ЦД добычи: ТКРС, работы на промысле', [
    ['Электронный наряд-допуск', 'модуль ABAI (предварительно) · оформление и согласование с ЭЦП · ОМГ, ЭМГ, Казгермунай, Каражанбас', 'abai'],
    ['TUMAR', 'ИИ-видеоаналитика охраны труда · 60 бригад ТКРС'],
  ]],
  ['ТКРС', 'ЦД скважины: ремонт скважин', [
    ['Электронный заказ-наряд ПРС/КРС', 'формирование и многоуровневое согласование · ОМГ; в BPMN Dream (Б5 5.4.1) заказ-наряд оформляется в АВР+'],
  ]],
  ['Транспорт и спецтехника', 'наземная инфраструктура: заказ транспорта и техники', [
    ['ИС УТО', '«Управление поездками»: заявки на транспорт, план-разнарядка, GPS-мониторинг, маршрутизация спецтехники'],
  ]],
];
const lsProd = (view) => lsBox('Производственные системы ДЗО — HSE, ТКРС, транспорт',
  `<div class="ls-cols c3">${LS_PROD.map(([t, to, list]) => `<div class="ls-prod"><b>${t}</b><span>→ ${view === 'asis' ? to.replace(/^.*?:\s*/, '') : to}</span>${list.map(([n, d, k]) => lsChip(n, k || 'ext', d)).join('')}</div>`).join('')}</div>
  <div class="ls-note">Не корпоративные, а часть производственных систем; «Транспорт… может быть на всех ЦД» — ${'встреча по ЦД 01.10'}. Описания — пресс-релизы КМГ 2023–2026. В BPMN модулей этих систем нет, поэтому потоки данных для них не показаны.</div>`, 'prod');

function lsDzo(view) {
  const asis = view === 'asis', nedra = view === 'nedra';
  return `<div class="ls-zone dzo">
    <div class="ls-zone-h">Зона ДЗО — ОМГ, ЭМГ: промысел, НГДУ, ЦИО, буровая площадка ${lsSrc('стратсессия, слайд 54 · BPMN «Добыча» и «Бурение»')}</div>
    <div class="ls-cols c3">
      ${lsBox('Инженерное ПО на рабочих местах', (nedra ? lsChip('Nedra.NUMEX', 'nedra', 'клиент') + lsChip('Nedra.NUMEX Optimize', 'nedra', 'клиент') + lsChip('Nedra.RTM', 'nedra', 'клиент') + lsChip('Nedra.WWO', 'nedra', 'клиент в НГДУ') : '')
        + (asis ? ['tNavigator', 'Petrel', 'Techlog'] : ['Petrel', 'tNavigator', 'Techlog', 'Intersect', 'Kingdom', 'Spark', 'UniSim', 'PipeSim', 'AutoCAD']).map((s) => lsChip(s, 'ext')).join('')
        + (asis ? lsChip('MS Office', 'manual') : nedra ? lsChip('MS Office', 'manual', 'остаётся в BPMN') : ''))}
      ${lsBox(asis ? 'Сбор данных' : 'Слой сбора данных (MES)', asis ? '<div class="ls-note">отдельного слоя сбора нет: замеры уходят в промысловые системы и в рапорты в Excel</div>' : '<div class="ls-cell" data-sys="MES">MES-система: сбор · верификация · хранение · обработка данных</div>', asis ? 'warn' : 'mes')}
      ${lsBox('Промысловые системы и хранилища', ['АСРПРС', 'АВР+', 'ЕКПД', 'Промысловая отчётность'].map((s) => lsChip(s, 'ext')).join('') + (asis ? ['GreenData', 'Directum'].map((s) => lsChip(s, 'ext')).join('') : ''))}
    </div>
    ${lsProd(view)}
    ${lsPipe(asis ? 'замеры и телеметрия' : 'сбор данных', { up: true, manual: false })}
    ${lsBox('Данные с датчиков / АСУ ТП', ['SCADA (WinCC, DeltaV)', 'АГЗУ', 'ВРП', 'ИСУ', 'КУУН', 'СДМО (ЭМГ)', 'СДМС (ОМГ)', 'ДЭЛ-140/150', 'СУ ШГН', 'Датчики СТПА', 'АСКУЭ / АСТУЭ', 'GPRS'].map((s) => lsChip(s, 'ext')).join(''), 'asu')}
  </div>`;
}

function lsExternal(view) {
  return lsBox('Внешние системы и источники', ['SAP ERP / SAP ТОРО', 'СЭД', 'QAZSTAT', 'eLicense', 'eQurylys', 'ЦОН', 'Государственный портал', 'ИСЭЗ Самрук-Казына', 'Портал закупок Самрук-Казына'].map((s) => lsChip(s, 'ext')).join('')
    + `<div class="ls-note">${view === 'asis' ? 'данные вносятся и выгружаются вручную' : 'обмен через интеграции (адаптеры) слоя данных'} · стратсессия, слайд 54; порталы Самрук-Казына — BPMN</div>`, 'ext');
}

const lsExtRow = (view) => `<div class="ls-hlink ${view === 'asis' ? 'manual' : ''}"><i></i><span>${view === 'asis' ? 'вручную' : 'интеграции'}</span></div>${lsExternal(view)}`;

// ---------- Режим просмотра потоков: простой (что передаётся) и подробный (шаги BPMN по каждой связи) ----------
let LS_MODE = (() => { try { return localStorage.getItem('abai-ls-mode') === 'full' ? 'full' : 'simple'; } catch (e) { return 'simple'; } })();
let LS_PIN = false;
// Формат — из документов шагов и описания связи, как записано в BPMN («Суточная сводка (Excel)», «план работ (.xlsx)»)
const LS_FMT = [[/xlsx|excel/i, 'Excel'], [/word|docx/i, 'Word'], [/pdf/i, 'PDF'], [/\bLAS\b/, 'LAS'], [/email|почт/i, 'почта'], [/физ\. носител/i, 'физ. носители'], [/чат/i, 'рабочий чат']];
function lsSteps(view, ref) {
  return lsRefParts(ref).map((p) => (p.codes ? Object.assign({}, p, { steps: p.codes.map((c) => ({ code: c, list: (LS_STEPS[view] || {})[p.proc + ' ' + c] || [] })) }) : p));
}
// Исполнитель шага с организацией: «ДОУП · ОМГ (ДЗО)», «Службы НГДУ», «КазНИПИ»
const lsRole = (x) => (!x.o || x.r === x.o || x.r.includes(x.o) ? x.r : `${x.r} · ${x.o}`);
// Кто выполняет шаги связи: «откуда → куда» по шагам BPMN
function lsWho(e, view) {
  const parts = (e.refs || [e.r]).flatMap((r) => lsSteps(view, r)).filter((p) => p.steps);
  const roles = (st) => [...new Set(st.flatMap((s) => s.list.map(lsRole)))].join(', ');
  const who = [...new Set(parts.map((p) => (p.arrow && p.steps.length === 2 ? `${roles([p.steps[0]])} → ${roles([p.steps[1]])}` : roles(p.steps))).filter(Boolean))].join('; ');
  return who || (typeof LS_WHO !== 'undefined' && LS_WHO[e.f + '|' + e.t]) || '';
}
// Организации — группы блока «Кто что делает»
const LS_ORGS = [[/^КМГ$/, 'КМГ — корпоративный центр'], [/^КМГИ|КазНИПИ/, 'КМГИ и КазНИПИ'], [/ОМГ|НГДУ/, 'ДЗО — ОМГ и НГДУ'], [/[Пп]одряд|бригада/, 'Подрядчики']];
const lsOrgCat = (o) => (LS_ORGS.find(([re]) => re.test(o)) || [0, 'Другие участники'])[1];
function lsRoles(edges, view, open) {
  const m = new Map();
  edges.forEach((e) => (e.refs || [e.r]).flatMap((r) => lsSteps(view, r)).forEach((p) => (p.steps || []).forEach((s) => s.list.forEach((x) => {
    const cat = lsOrgCat(x.o || x.r);
    if (!m.has(cat)) m.set(cat, new Map());
    const rm = m.get(cat), role = lsRole(x);
    if (!rm.has(role)) rm.set(role, new Map());
    rm.get(role).set(`${p.proc} ${x.c}`, x.t);
  }))));
  if (!m.size) return '';
  const order = LS_ORGS.map((x) => x[1]).concat('Другие участники');
  const cats = [...m].sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
  return `<div class="ls-roles">
    <div class="ls-roles-h"><b>Кто что делает</b><span>исполнители шагов BPMN, на которые опираются связи (дорожки BPMN) · клик по роли — свернуть / развернуть её шаги</span></div>
    <div class="ls-roles-c">${cats.map(([cat, rm]) => `<div><b>${cat}</b>${[...rm].sort((a, b) => b[1].size - a[1].size).map(([role, st]) => `<details${open ? ' open' : ''}><summary>${role} <em>${st.size}</em></summary><ul>${[...st].map(([code, t]) => `<li><span>${code}</span> ${t}</li>`).join('')}</ul></details>`).join('')}</div>`).join('')}</div>
  </div>`;
}

function lsDetail(e, view) {
  const parts = (e.refs || [e.r]).flatMap((r) => lsSteps(view, r));
  const docs = parts.flatMap((p) => (p.steps || []).flatMap((s) => s.list.flatMap((x) => x.d)));
  const fmt = LS_FMT.filter(([re]) => re.test(e.w) || docs.some((d) => re.test(d))).map((x) => x[1]);
  let proc = null;
  const step = (x, tag) => `<div class="ls-d-st"><i>${tag}</i><div><b>${x.c}</b> ${x.t}
    <span>исполнитель: ${lsRole(x)}${x.s.length ? ` · системы: ${x.s.join(', ')}` : ''}</span>
    ${x.d.length ? `<span>документ: ${x.d.join('; ')}</span>` : ''}${x.n.map((n) => `<q>${n}</q>`).join('')}</div></div>`;
  return `<div class="ls-d">
    <div class="ls-d-row"><i>Как</i><span>${LS_KINDS[e.k]}</span></div>
    <div class="ls-d-row"><i>Формат</i><span>${fmt.length ? fmt.join(', ') : '<em>в BPMN не указан</em>'}</span></div>
    ${parts.map((p) => {
      if (!p.steps) return `<div class="ls-d-src">${/слайд|стратсесс|встреча|пресс-релиз|dprom/.test(p.text) ? 'Источник' : 'Пометка в ссылке'}: ${p.text}</div>`;
      const head = p.proc !== proc && LS_PROCS[p.proc] ? `<div class="ls-d-p">${p.proc} · ${LS_PROCS[p.proc]}</div>` : '';
      proc = p.proc;
      const tags = p.arrow && p.steps.length === 2 ? ['откуда', 'куда'] : p.steps.map(() => 'шаг');
      return head + (p.note ? `<div class="ls-d-src">${p.note}</div>` : '') + p.steps.map((s, i) => (s.list.length ? s.list.map((x) => step(x, tags[i])).join('') : `<div class="ls-d-st"><i>${tags[i]}</i><div><b>${s.code}</b></div></div>`)).join('');
    }).join('')}
  </div>`;
}

// Связи системы во всех сценариях вида; одинаковые «откуда → куда» объединены (refs — все ссылки на шаги)
function lsLinksOf(view, key) {
  const seen = new Map();
  (LS_FLOWS[view] || []).forEach((x) => x.e.forEach(([f, t, w, r, k]) => {
    if (f !== key && t !== key) return;
    const id = f + '|' + t;
    if (seen.has(id)) { const e = seen.get(id); if (!e.w.includes(w)) { e.w += '; ' + w; e.r += ' · ' + r; e.refs.push(r); } } else seen.set(id, { f, t, w, r, k, refs: [r] });
  }));
  return [...seen.values()];
}
function abaiLandscape(root, view = 'dream', flow) {
  LS_CUR = view;
  lsUnpin();
  const V = LS_VIEWS[view];
  const full = LS_MODE === 'full';
  const flows = LS_FLOWS[view] || [];
  // «Вся сеть» — все связи вида; одинаковые «откуда → куда» из разных сценариев объединяются в одну связь
  const lsAll = () => {
    const m = new Map();
    flows.forEach((f) => f.e.forEach(([a, z, w, r, k]) => {
      const id = a + '|' + z;
      if (!m.has(id)) { m.set(id, [a, z, w, r, k, [r], [f.name]]); return; }
      const e = m.get(id);
      if (!e[2].includes(w)) e[2] += '; ' + w;
      if (!e[5].includes(r)) { e[5].push(r); e[3] += ' · ' + r; }
      if (!e[6].includes(f.name)) e[6].push(f.name);
    }));
    return { id: 'all', name: 'Вся сеть', e: [...m.values()],
      note: `Все системы и связи вида на одной схеме: ${m.size} связей из ${flows.length} сценариев, одинаковые «откуда → куда» объединены. Ряды — как на большой схеме, снизу вверх. Наведите на номер или систему — подсветятся связи; клик по номеру — связь в списке ниже, там же шаги BPMN.` };
  };
  const fl = flow === null ? null : flow === 'all' ? lsAll() : flows.find((f) => f.id === flow) || flows[0];
  const isAll = !!fl && fl.id === 'all';
  const tot = (k) => LS_MODS.reduce((s, m) => s + ((ABAI_LANDSCAPE_DATA[m.id][V.v] || {})[k] || 0), 0);
  root.innerHTML = `
    <div class="ls-top">
      <div class="ls-tabs">${Object.entries(LS_VIEWS).map(([k, x]) => `<button data-ls="${k}" class="${k === view ? 'on' : ''} t-${k}"><b>${x.name}</b><span>${x.sub}</span></button>`).join('')}</div>
      <div class="ls-legend"><span class="k-abai">ABAI и КХД</span><span class="k-nedra">Nedra</span><span class="k-ext">промысловые, инженерные, внешние</span><span class="k-manual">ручная работа</span><span class="lg-flow">поток данных</span>${view === 'asis' ? '<span class="lg-man">ручной перенос</span>' : ''}</div>
    </div>
    <p class="ls-lead">${V.lead}</p>
    <div class="ls-kpis">
      <div><b>${tot('abai')}</b> из ${tot('steps')}<span>шагов BPMN с системами ABAI</span></div>
      ${view === 'nedra' ? `<div><b>${tot('nedra')}</b><span>шагов с продуктами Nedra</span></div>` : ''}
      <div class="${tot('manual') ? 'bad' : 'ok'}"><b>${tot('manual')}</b><span>привязок к ручным инструментам (Excel / Word / PDF, MS Office, чат)</span></div>
      <div class="ls-kpi-sys"><b>${new Set(LS_MODS.flatMap((m) => ((ABAI_LANDSCAPE_DATA[m.id][V.v] || {}).sys || []).filter((x) => x[1] !== 'manual').map((x) => x[0]))).size}</b><span>систем в шагах BPMN, ${new Set(flows.flatMap((f) => f.e.flatMap((e) => [e[0], e[1]]))).size} из них — в потоках данных на схеме. Встреча по ЦД 01.10: «чтобы ЦД работал, около 50 систем обмениваются данными»</span></div>
      <div><b>${LS_MODS.length}</b><span>модуля мокапа: ${LS_MODS.map((m) => m.name).join(', ')}</span></div>
    </div>
    ${view === 'asis' ? '' : lsValue()}
    <div class="ls-fbar">
      <div class="ls-fbar-h"><b>Потоки данных</b><span>выберите сценарий — стрелки покажут, что и куда передаётся · наведите на систему — её входящие и исходящие потоки, клик — закрепить окно</span>
        <div class="ls-mode" title="Подробно — по каждой связи шаги BPMN: действие, исполнитель, системы, документы и аннотации">${[['simple', 'Простой'], ['full', 'Подробный']].map(([k, t]) => `<button data-mode="${k}" class="${LS_MODE === k ? 'on' : ''}">${t}</button>`).join('')}</div></div>
      <div class="ls-fbtns"><button data-fl="all" class="all ${isAll ? 'on' : ''}">Вся сеть<span>все связи</span></button>${flows.map((f) => `<button data-fl="${f.id}" class="${fl && f.id === fl.id ? 'on' : ''}">${f.name}<span>${f.mods}</span></button>`).join('')}<button data-fl="" class="off ${fl ? '' : 'on'}">Без стрелок</button></div>
      ${fl ? `<div class="ls-fnote">${fl.note}</div>
      <div class="ls-fbody ${isAll ? 'all' : ''}"><div class="ls-focus"></div>
        <ol class="ls-fsteps ${full ? 'full' : ''}">${fl.e.map(([f, t, w, r, k, refs, sc], i) => `<li data-fi="${i}" class="k-${k}"><b>${i + 1}</b><div><span class="ft">${f} → ${t}</span>${w}<em>${r} · ${LS_KINDS[k]}${sc ? ` · ${sc.join(', ')}` : ''}</em>${(() => { const who = lsWho({ f, t, r, refs }, view); return who ? `<span class="ls-who">кто: ${who}</span>` : ''; })()}${isAll
          ? `<details${full ? ' open' : ''}><summary>подробно: шаги BPMN</summary>${lsDetail({ f, t, w, r, k, refs }, view)}</details>`
          : full ? lsDetail({ f, t, w, r, k }, view) : ''}</div></li>`).join('')}</ol></div>
      ${lsRoles(fl.e.map(([f, t, w, r, k, refs]) => ({ r, refs })), view, full || !isAll)}
      <div class="ls-fkinds">${[...new Set(fl.e.map((x) => x[4]))].map((k) => `<span class="k-${k}">${LS_KINDS[k]}</span>`).join('')}</div>` : ''}
    </div>
    <div class="ls-scroll"><div class="ls-grid ${view}">
        ${lsBox('Пользователи и уровни управления', `<div class="ls-cols c3">${[
          ['КЦ', '<b>КЦ</b> — стратегический уровень: портфель, целевые КПД, портфельная аналитика', 'единый актив по всем ДЗО: отчёт по месторождению, экономика'],
          ['КМГИ', '<b>КМГИ</b> — методология, сложные расчёты, экспертиза, R&D', ''],
          ['ЦИО / ДЗО', '<b>ЦИО / ДЗО</b> — оперативное управление, ИМА, выполнение производственной программы', 'только свой актив, свой уровень отчётности и визуализации; возможно, сравнение с другими'],
        ].map(([k, t, acc]) => `<div class="ls-cell" data-sys="${k}">${t}${acc && view !== 'asis' ? `<em class="ls-acc">Доступ в ЦД: ${acc}</em>` : ''}</div>`).join('')}</div>${view !== 'asis' ? `<div class="ls-note">Уровни доступа — встреча по ЦД 01.10</div>` : ''}`, 'users')}
        ${lsPipe(view === 'asis' ? 'отчёты в файлах, почта, СЭД' : 'Web-доступ к ЦД', { manual: view === 'asis', both: true })}
        <div class="ls-mods-h">Процессы мокапа — системы по шагам BPMN (${V.name}) · число — сколько шагов используют систему · клик — открыть модуль</div>
        <div class="ls-mods">${lsModules(view)}</div>
        ${lsPipe(view === 'asis' ? 'каждая служба — в своей системе' : 'процессы выполняются в ЦД', { manual: view === 'asis', both: true })}
        ${lsCentral(view)}
        ${lsPipe(view === 'asis' ? 'выгрузки из промысловых систем' : 'потоки данных', { up: true, manual: view === 'asis' })}
        ${lsDzo(view)}
        <svg class="ls-svg"></svg><div class="ls-lbls"></div>
    </div></div>
    <ol class="ls-flow">${V.flow.map(([t, d], i) => `<li><b><i class="ls-stage">${i + 1}</i>${t}</b><span>${d}</span></li>`).join('')}</ol>`;
  root.querySelectorAll('[data-ls]').forEach((b) => (b.onclick = () => { abaiLandscape(root, b.dataset.ls); history.replaceState(null, '', '#' + b.dataset.ls); }));
  root.querySelectorAll('[data-fl]').forEach((b) => (b.onclick = () => abaiLandscape(root, view, b.dataset.fl || null)));
  root.querySelectorAll('[data-mode]').forEach((b) => (b.onclick = () => {
    LS_MODE = b.dataset.mode;
    try { localStorage.setItem('abai-ls-mode', LS_MODE); } catch (e) { /* без localStorage — только на эту страницу */ }
    abaiLandscape(root, view, fl ? fl.id : null);
  }));
  const grid = root.querySelector('.ls-grid');
  // Номера этапов — те же, что в плашке под схемой, на блоках схемы
  V.flow.forEach(([t, , sel], i) => { const el = sel && grid.querySelector(sel); if (el) el.insertAdjacentHTML('afterbegin', `<i class="ls-stage" title="Этап ${i + 1}: ${t}">${i + 1}</i>`); });
  // Заголовки верхнего уровня (ЦД пласта, слой данных, зона ДЗО …) — клик: что это такое
  grid.querySelectorAll('.ls-twin-h, .ls-box > .ls-box-h, .ls-zone > .ls-zone-h').forEach((h) => {
    const B = lsBlockOf(h);
    // В AS IS слой данных — «хранение разрозненно»: описание целевого слоя из стратсессии к нему не относится
    if (!B || !LS_BLOCKS[B.id] || (view === 'asis' && B.id === 'data')) return;
    h.classList.add('ls-hq');
    const note = h.querySelector('.ls-box-n');
    (note || h).insertAdjacentHTML(note ? 'beforebegin' : 'beforeend', '<i class="ls-hq-i">что это?</i>');
    h.onclick = (ev) => { ev.stopPropagation(); lsUnpin(); lsBlockInfo(root, grid, h, view); };
  });
  const base = fl ? fl.e.map(([f, t, w, r, k, refs], i) => ({ f, t, w, r, k, refs, n: i + 1 })) : [];
  const focus = root.querySelector('.ls-focus');
  const mark = () => {
    lsDraw(grid, []);
    grid.classList.toggle('fl-on', base.length > 0);
    base.forEach((e) => [e.f, e.t].forEach((k) => { const a = lsAnchor(grid, k); if (a) a.classList.add('ep'); }));
  };
  const draw = (edges, o) => (edges === base ? mark() : lsDraw(grid, edges, o));
  // Вся сеть: клик по номеру на схеме — раскрыть связь в списке
  const pick = (i) => {
    const li = root.querySelector(`[data-fi="${i}"]`); if (!li) return;
    const d = li.querySelector('details'); if (d) d.open = true;
    li.classList.add('pick'); setTimeout(() => li.classList.remove('pick'), 1800);
    li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  const drawFocus = (o) => focus && (isAll ? (o && o.hot !== undefined ? focus._hot(o.hot) : lsNet(focus, grid, base, view, { onPick: pick })) : lsFocus(focus, grid, base, view, o));
  draw(base); drawFocus();
  // Наведение на систему: её потоки во всех сценариях вида; клик — закрепить окно (его можно прокрутить и прочитать)
  const linksOf = (key) => lsLinksOf(view, key);
  const lit = (key, list) => {
    root.classList.add('hl');
    root.querySelectorAll(`.ls-chip[data-sys="${CSS.escape(key)}"]`).forEach((x) => x.classList.add('on'));
    // На большой схеме — только подсветка участников связей
    grid.querySelectorAll('.ep').forEach((x) => x.classList.remove('ep'));
    grid.classList.add('fl-on');
    list.forEach((e) => [e.f, e.t].forEach((k) => { const a = lsAnchor(grid, k); if (a) a.classList.add('ep'); }));
  };
  // Наведение — краткая схема связей; без связей — только число шагов BPMN. Клик — панель «История системы».
  const show = (c) => {
    const key = c.dataset.sys, list = linksOf(key), tr = lsTrailOf(view, key);
    const nSt = tr.reduce((s, x) => s + x.list.length, 0);
    if (!list.length && !nSt) return false;
    lit(key, list);
    let pop = document.querySelector('.ls-pop');
    if (!pop) { pop = document.createElement('div'); pop.className = 'ls ls-pop'; document.body.appendChild(pop); }
    pop.innerHTML = `<div class="ls-pop-h"><b>${key}</b> — ${V.name} · связей на схеме: ${list.length}${nSt ? ` · шагов BPMN: ${nSt}` : ''}<span>клик — история шагов и связи</span></div>${list.length ? '<div class="ls-focus"></div>' : ''}`;
    pop.style.transform = ''; pop.style.width = 'auto'; pop.style.maxWidth = 'none'; pop.style.display = 'block';
    if (list.length) lsBus(pop.querySelector('.ls-focus'), grid, key, list, view, {});
    // Схема вертикальная: ставим сбоку от системы, если не влезает — уменьшаем
    const r = c.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    const sc = Math.min(1, (innerHeight - 24) / ph, (innerWidth - 24) / pw);
    pop.style.transform = sc < 1 ? `scale(${sc})` : '';
    const w = pw * sc, h = ph * sc;
    const right = r.right + 16 + w < innerWidth - 12, left = r.left - 16 - w > 12;
    pop.style.left = (right && (r.left + r.right) / 2 < innerWidth / 2 ? r.right + 16 : left ? r.left - 16 - w : right ? r.right + 16 : Math.max(12, (innerWidth - w) / 2)) + 'px';
    pop.style.top = Math.max(12, Math.min(innerHeight - h - 12, (r.top + r.bottom) / 2 - h / 2)) + 'px';
    return true;
  };
  root.querySelectorAll('.ls-chip, .ls-cell[data-sys]').forEach((c) => {
    c.onmouseenter = () => { if (!LS_PIN) show(c); lsTrailLoad(); };
    c.onmouseleave = () => {
      if (LS_PIN) return;
      root.classList.remove('hl'); root.querySelectorAll('.ls-chip.on').forEach((x) => x.classList.remove('on'));
      const pop = document.querySelector('.ls-pop'); if (pop) pop.style.display = 'none';
      draw(base);
    };
    // Клик по системе — панель «История системы»: шаги BPMN и связи (если нет ни того, ни другого — как раньше, открывается модуль)
    c.onclick = (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      const key = c.dataset.sys, a = c.closest('a[href]');
      lsTrailLoad().then(() => {
        const list = linksOf(key);
        if (!list.length && !lsTrailOf(view, key).length) { if (a) location.href = a.href; return; }
        const pop = document.querySelector('.ls-pop'); if (pop) pop.style.display = 'none';
        lit(key, list);
        LS_PIN = () => { root.classList.remove('hl'); root.querySelectorAll('.ls-chip.on').forEach((x) => x.classList.remove('on')); draw(base); };
        lsSide(root, grid, key, list, view);
      });
    };
  });
  // Наведение на пункт списка — выделить одну стрелку
  root.querySelectorAll('[data-fi]').forEach((li) => {
    li.onmouseenter = () => drawFocus({ hot: +li.dataset.fi });
    li.onmouseleave = () => (isAll ? focus._hot(null) : drawFocus());
  });
  if (root._ro) root._ro.disconnect();
  root._ro = new ResizeObserver(() => { draw(base); drawFocus(); });
  root._ro.observe(grid);
}

function lsUnpin() {
  const pop = document.querySelector('.ls-pop'), bg = document.querySelector('.ls-pop-bg');
  if (pop) { pop.style.display = 'none'; pop.classList.remove('pin'); }
  if (bg) bg.style.display = 'none';
  document.querySelectorAll('.ls-side, .ls-center').forEach((x) => x.classList.remove('open'));
  if (LS_STORY) { LS_STORY.stop(); LS_STORY = null; }
  LS_SLIDE_SYNC = null;
  if (LS_PATH_STOP) { LS_PATH_STOP(); LS_PATH_STOP = null; }
  if (typeof LS_PIN === 'function') LS_PIN();
  LS_PIN = false;
}
let LS_STORY = null; // история по шагам в центральном окне: { step(±1), stop() }
let LS_PATH_STOP = null; // остановить проигрывание пути данных при закрытии
let LS_SLIDE_SYNC = null; // встроенный слайд сообщает, какое действие на экране (shared/proc/v2/present.js → notifyParent)
window.addEventListener('message', (e) => { const m = e.data && e.data.abaiSlide; if (m && LS_SLIDE_SYNC) LS_SLIDE_SYNC(m); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && LS_PIN) lsUnpin();
  if (LS_STORY && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); LS_STORY.step(e.key === 'ArrowRight' ? 1 : -1); }
});

// ---------- Верхний уровень схемы: что такое блок (ЦД пласта, слой данных, зона ДЗО …) — по стратсессии ----------
// Каждое утверждение — со слайдом стратсессии 18.09.2026; расшифровки сокращений — общепринятые термины.
const LS_BLOCKS = {
  'ЦД пласта': {
    what: [
      ['Цифровая модель пласта в интегрированной модели актива: давление, насыщенность, закачка; приток, пластовое давление, обводнённость. Модели пласта, скважины и инфраструктуры синхронизируются с автоматическим пересчётом сценариев при изменениях', 'сл. 14'],
      ['Основа — оперативная постоянно действующая геолого-гидродинамическая модель (ПДГГДМ): отражает текущее состояние пласта и становится обязательным расчётным инструментом для ключевых решений, единым контуром управления «данные → модель → сценарии → решение → эффект», а не расчётом «по запросу»', 'сл. 6'],
    ],
    asis: [['Сейчас ГДМ строится под проектные документы, обновляется редко и не является рабочим инструментом ДЗО; операционные решения часто принимаются без модели', 'сл. 6']],
    use: [['Прогноз добычи и дебитов; эффекты ГТМ / ЗБС / ГРП; оптимизация ППД; варианты бурения; анализ план / факт', 'сл. 6']],
    cycle: [['Сбор факта', 'добыча, закачка, режимы, ГИС / ГДИС — ДЗО'], ['QC данных', 'проверка полноты и качества данных'], ['Обновление', 'актуализация ПДГГДМ'], ['Сценарии', 'ГТМ, ППД, ЗБС, ГРП, бурение — ДЗО'], ['Решение', 'выбор варианта с учётом экономики — ДЗО'], ['Эффект', 'фактический эффект возвращается в модель — ДЗО и КМГИ']],
    cycleSrc: 'сл. 6',
    roles: [['КМГ', 'требования и контроль внедрения'], ['КМГИ', 'методология, поддержка сложных моделей по контракту'], ['ДЗО', 'владелец модели, обновление модели, расчёты']],
    rolesSrc: 'сл. 6',
    mods: [
      ['ABAI ЦРНС 2.0 (Nedra.NUMEX)', 'работа с существующими 3D ГМ / ГДМ из tNavigator, Petrel / Eclipse; подбор размещения и заканчивания скважин; автоадаптация на историю — «сокращает время актуализации ГДМ»; размещение фонда по картам результатов ГДМ', 'сл. 24–28, 34'],
      ['ABAI УЗ 2.0 (Nedra.NUMEX Optimize)', 'автоматический подбор режимов скважин на гидродинамической модели; пересчёт ГГДМ; оптимизация закачки (многовариантные расчёты на актуализированной ГДМ)', 'сл. 29–31, 34'],
    ],
    deploy: [['Восточный Молдабек: адаптация системы под оставшиеся пласты с учётом ГДМ; настройка и создание проектов', 'сл. 55']],
    terms: [['ГМ', 'геологическая модель'], ['ГДМ', 'гидродинамическая модель'], ['ГГДМ', 'геолого-гидродинамическая модель'], ['ПДГГДМ', 'постоянно действующая ГГДМ'], ['ППД', 'поддержание пластового давления'], ['ГТМ', 'геолого-технические мероприятия'], ['ЗБС', 'зарезка боковых стволов'], ['ГРП', 'гидроразрыв пласта'], ['ГИС / ГДИС', 'геофизические / гидродинамические исследования скважин']],
  },
  'ЦД скважины': {
    what: [['Цифровая модель скважины в интегрированной модели актива: конструкция скважины, режимы работы; режимы, дебиты, ограничения ГНО', 'сл. 14']],
    mods: [
      ['ABAI Цифровое бурение (Nedra.RTM)', 'модули «Сводки» и «Онлайн-мониторинг» (офис и буровая), WITSML-сервер и клиент, данные реального времени', 'сл. 34, 55'],
      ['ABAI Цифровой мониторинг ТКРС (Nedra.WWO)', 'адаптация коробочного решения (нормы времени, КР / ТР, ПЗ / ПР), ролевая модель согласования наряд-заказов и планов работ', 'сл. 34, 55'],
    ],
    deploy: [['Восточный Молдабек: внедрение ABAI Цифровое бурение и Цифровой мониторинг ТКРС', 'сл. 55']],
    terms: [['ГНО', 'глубинно-насосное оборудование'], ['ТКРС', 'текущий и капитальный ремонт скважин'], ['КР / ТР', 'капитальный / текущий ремонт'], ['WITSML', 'стандарт передачи данных бурения']],
  },
  'ЦД добычи и наземной инфраструктуры': {
    what: [['Модель инфраструктуры в интегрированной модели актива: наземные объекты, сбор, транспортировка, сдача; пропускная способность, мощности, возможности сдачи. Потенциал ищется на всех элементах и узлах производственной цепочки; ИМА и модель ограничений рассчитывают локальные решения с учётом влияния на смежные узлы', 'сл. 14']],
    use: [['Работа с потенциалом: выявление ограничений → сценарная оценка вариантов → ранжирование и программа мероприятий → подтверждение эффекта и пересчёт потенциала', 'сл. 14']],
    mods: [
      ['ABAI ПДИМ 2.0 (Nedra.DIGITAL TWIN)', 'конфигурация технологических и сопутствующих расчётов, структур данных, пользовательских экранов', 'сл. 34, 55'],
      ['ABAI ПДИМ 2.0 · целостность трубопроводов (Nedra.DIGITAL TWIN Pipe)', 'обучение ML-моделей', 'сл. 34, 56'],
      ['ABAI Наземная инфраструктура (Nedra.INFRAPLAN)', 'построение моделей инфраструктуры, расчёт технологических и экономических кейсов', 'сл. 34, 55'],
    ],
    deploy: [['Восточный Молдабек: внедрение ПДИМ 2.0, Наземной инфраструктуры и целостности трубопроводов', 'сл. 55–56']],
    terms: [['ИМА', 'интегрированная модель актива'], ['ГНО', 'глубинно-насосное оборудование']],
  },
  plat: {
    title: 'ЦД Актива',
    what: [['Единая платформа централизованной зоны, в которую входят цифровые двойники и слой данных', 'сл. 54'], ['Сквозной слой: внедрение единого ЦД Актива и слоя данных', 'сл. 56'], ['Интегрированная модель актива: пласт, скважина, инфраструктура синхронизированы, сценарии пересчитываются автоматически', 'сл. 14']],
    deploy: [['Восточный Молдабек: внедрение Цифрового двойника Актива', 'сл. 56']],
    terms: [['ИМА', 'интегрированная модель актива']],
  },
  cz: { title: 'Централизованная зона', what: [['Единая платформа, включающая в себя цифровые двойники и слой данных', 'сл. 54']] },
  mods: { title: 'Бизнес-модули и вычислительные системы ЦД', what: [['ЦД пласта, скважины, добычи и наземной инфраструктуры — продукты, внедряемые в ЦД; соответствие продуктов Nedra и ABAI', 'сл. 34, 55–56']] },
  data: {
    title: 'Слой данных',
    what: [['Обеспечивает хранение и обработку данных для аналитики и цифровых продуктов', 'сл. 54'], ['КХД — слой бизнес-интеграций (в варианте Nedra — Nedra.DATA)', 'сл. 34'], ['КХД — собственная разработка КМГ; единый слой хранения, обработки и аналитики данных (дата-платформа) для автоматизированного обмена данными', 'сл. 3']],
    deploy: [['Восточный Молдабек: слой данных ЦД — внедрение NDP; интеграции', 'сл. 56']],
    terms: [['КХД', 'корпоративное хранилище данных'], ['NDP', 'Nedra Data Platform']],
  },
  dzo: { title: 'Зона ДЗО', what: [['Промысловые и производственные системы, системы хранения и данные АСУ ТП', 'сл. 54']], terms: [['ДЗО', 'дочерние и зависимые организации'], ['АСУ ТП', 'автоматизированная система управления технологическим процессом'], ['MES', 'система управления производством']] },
  ext: { title: 'Внешние системы', what: [['Интеграции обеспечивают бесшовный обмен данными между централизованными сервисами, внешними системами (SAP, СЭД) и производственными площадками', 'сл. 54']], terms: [['СЭД', 'система электронного документооборота']] },
  users: { title: 'Пользователи и уровни управления', what: [['Поддержка принятия решения от операционного (ДЗО) до стратегического (КЦ) уровня', 'сл. 54']], terms: [['КЦ', 'корпоративный центр'], ['КМГИ', 'КМГ Инжиниринг'], ['ЦИО', 'центр интегрированных операций']] },
};
// Блок по заголовку на схеме
function lsBlockOf(h) {
  if (h.classList.contains('ls-twin-h')) return { id: lsHText(h), box: h.closest('.ls-twin') };
  const pairs = [['.ls-box.plat', 'plat'], ['.ls-box.mods', 'mods'], ['.ls-box.users', 'users'], ['.ls-box.ext', 'ext'], ['.ls-zone.data', 'data'], ['.ls-zone.dzo', 'dzo'], ['.ls-zone.cz', 'cz']];
  for (const [sel, id] of pairs) { const b = h.parentElement; if (b && b.matches(sel)) return { id, box: b }; }
  return null;
}
function lsBlockInfo(root, grid, h, view) {
  const B = lsBlockOf(h);
  if (!B || !LS_BLOCKS[B.id]) return;
  const D = LS_BLOCKS[B.id], V = LS_VIEWS[view];
  const title = D.title || B.id;
  const src = (s) => (s ? `<em class="ls-bk-src">${s}</em>` : '');
  const keys = [...new Set([...B.box.querySelectorAll('[data-sys]')].map((x) => x.dataset.sys))];
  const kindOf = (n) => { const a = lsAnchor(grid, n); return a && a.classList.contains('ls-chip') ? (a.className.match(/k-(\w+)/) || [])[1] : 'user'; };
  const steps = (n) => LS_MODS.reduce((s, m) => s + (((ABAI_LANDSCAPE_DATA[m.id] || {})[V.v] || {}).sys || []).filter(([x]) => lsKey(x) === n).reduce((a, x) => a + x[2], 0), 0);
  const descOf = (n) => { const d = Object.entries(typeof ABAI_SYS_DESC !== 'undefined' ? ABAI_SYS_DESC : {}).filter(([x]) => lsKey(x) === n).flatMap(([, l]) => l); return d.length ? d[0][1] : ''; };
  // Связи блока с остальной схемой (все сценарии вида; одинаковые «откуда → куда» — один раз)
  const all = new Map();
  (LS_FLOWS[view] || []).forEach((f) => f.e.forEach(([a, z, w, r, k]) => { const id = a + '|' + z; if (!all.has(id)) all.set(id, { f: a, t: z, w, r, k }); }));
  const inB = (n) => keys.includes(n);
  const E = [...all.values()];
  const ein = E.filter((e) => !inB(e.f) && inB(e.t)), eout = E.filter((e) => inB(e.f) && !inB(e.t)), eins = E.filter((e) => inB(e.f) && inB(e.t));
  const sysA = (n) => (lsAnchor(grid, n) ? `<a href="#" class="ls-ab-s k-${kindOf(n)}" data-pick="${n}">${n}</a>` : `<span class="ls-ab-s">${n}</span>`);
  const eli = (e) => `<li>${sysA(e.f)} → ${sysA(e.t)} — ${e.w}<em>${LS_KINDS[e.k]} · ${e.r}</em></li>`;
  const list = (t, l, s) => (l && l.length ? `<h4>${t}${src(s)}</h4><ul class="ls-bk-l">${l.map(([x, y]) => `<li>${x}${y ? src(y) : ''}</li>`).join('')}</ul>` : '');
  let center = document.querySelector('.ls-center');
  if (!center) { center = document.createElement('section'); center.className = 'ls ls-center'; document.body.appendChild(center); }
  const side = document.querySelector('.ls-side'); if (side) side.classList.remove('open');
  center.classList.add('solo');
  center.innerHTML = `
    <div class="ls-center-h"><b>${title}</b><span class="ls-bk-v">${V.name} · что это и что входит</span><span class="ls-center-hint">клик по системе — её окно · Esc — закрыть</span><button class="ls-pop-x" title="Закрыть (Esc)">×</button></div>
    <div class="ls-center-b"><div class="ls-bk">
      ${list('Что это', D.what)}
      ${list('Как сейчас (AS IS)', D.asis)}
      ${list('Где применяется', D.use)}
      ${D.cycle ? `<h4>Цикл работы с моделью${src(D.cycleSrc)}</h4><ol class="ls-bk-cy">${D.cycle.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>` : ''}
      ${D.roles ? `<h4>Роли${src(D.rolesSrc)}</h4><div class="ls-bk-r">${D.roles.map(([t, d]) => `<div><b>${t}</b><span>${d}</span></div>`).join('')}</div>` : ''}
      ${D.mods ? `<h4>Модули ABAI и что они делают</h4><ul class="ls-bk-l">${D.mods.map(([t, d, s]) => `<li><b>${t}</b> — ${d}${src(s)}</li>`).join('')}</ul>` : ''}
      ${list('Внедрение', D.deploy)}
      ${keys.length ? `<h4>Системы в блоке на схеме · ${V.name} <em class="ls-bk-n">${keys.length}</em></h4>
        <table class="ls-ab-t"><thead><tr><th>Система</th><th>Что это</th><th>Шагов BPMN</th><th>Связей на схеме</th></tr></thead><tbody>${keys.map((n) => `<tr><td>${sysA(n)}</td><td>${descOf(n) || '<span>—</span>'}</td><td>${steps(n) || '<span>—</span>'}</td><td>${E.filter((e) => e.f === n || e.t === n).length || '<span>—</span>'}</td></tr>`).join('')}</tbody></table>` : ''}
      ${ein.length || eout.length ? `<div class="ls-ab-c2"><div><h4>Что приходит в блок <em class="ls-bk-n">${ein.length}</em></h4><ul class="ls-ab-l ls-bk-e">${ein.map(eli).join('') || '<li>—</li>'}</ul></div>
        <div><h4>Что уходит из блока <em class="ls-bk-n">${eout.length}</em></h4><ul class="ls-ab-l ls-bk-e">${eout.map(eli).join('') || '<li>—</li>'}</ul></div></div>` : ''}
      ${eins.length ? `<h4>Связи внутри блока <em class="ls-bk-n">${eins.length}</em></h4><ul class="ls-ab-l ls-bk-e">${eins.map(eli).join('')}</ul>` : ''}
      ${D.terms ? `<h4>Сокращения</h4><dl class="ls-bk-t">${D.terms.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>` : ''}
      <p class="ls-bk-f">Источник — стратсессия 18.09.2026 (номера слайдов у каждого пункта); системы и связи — схема портала и BPMN модулей.</p>
    </div></div>`;
  center.querySelector('.ls-pop-x').onclick = lsUnpin;
  center.querySelectorAll('[data-pick]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); const el = [...grid.querySelectorAll('[data-sys]')].find((x) => x.dataset.sys === a.dataset.pick); if (el) { lsUnpin(); el.click(); } }));
  let bg = document.querySelector('.ls-pop-bg');
  if (!bg) { bg = document.createElement('div'); bg.className = 'ls-pop-bg'; document.body.appendChild(bg); }
  bg.style.display = 'block'; bg.onclick = lsUnpin;
  LS_PIN = LS_PIN || (() => {});
  requestAnimationFrame(() => center.classList.add('open'));
}

// ---------- История системы: центральное окно (схема связей / история по шагам) и сайдбар справа (списки шагов BPMN и связей) ----------
// Шаги — shared/landscape-trail.js (генерирует tools/build_landscape.js), подгружается при первом открытии.
let LS_TRAIL_WAIT = null;
function lsTrailLoad() {
  if (typeof LS_TRAIL !== 'undefined') return Promise.resolve();
  if (!LS_TRAIL_WAIT) {
    LS_TRAIL_WAIT = new Promise((ok) => {
      const me = document.querySelector('script[src*="landscape.js"]');
      const s = document.createElement('script');
      s.src = me ? me.getAttribute('src').replace('landscape.js', 'landscape-trail.js') : 'shared/landscape-trail.js';
      s.onload = ok; s.onerror = ok;
      document.head.appendChild(s);
    });
  }
  return LS_TRAIL_WAIT;
}
// Шаги системы по процессам: [{ P: процесс, list: [номера шагов] }]
function lsTrailOf(view, key) {
  if (typeof LS_TRAIL === 'undefined') return [];
  return (LS_TRAIL[view] || []).map((P) => ({ P, list: P.s.map((s, i) => (s.s.some((x) => lsKey(x) === key) ? i : -1)).filter((i) => i >= 0) })).filter((x) => x.list.length);
}
const LS_MOD_NAME = { geologiya: 'Геология', razrabotka: 'Разработка', burenie: 'Бурение', dobycha: 'Добыча' };
// Слайд презентации (v — из landscape-trail.js, только Dream TO BE: презентации построены по нему) и экран шага в прототипе
// Адрес модуля от корня сайта (ABAI_ROOT из modules.js: на портале «./», на странице в подпапке «../»)
const lsModHref = (m, k) => { const x = typeof ABAI_MODULES !== 'undefined' && ABAI_MODULES.find((y) => y.id === m); return (typeof ABAI_ROOT !== 'undefined' ? ABAI_ROOT : '') + (x ? x[k] : m + '/' + (k === 'v2' ? 'v2/' : '')); };
// Явно index.html: при открытии сайта с диска ссылка на папку показывает список файлов
const lsSlideHref = (P, s) => (s.v ? `${lsModHref(P.m, 'v2')}index.html#${s.v[0]}/${s.v[1]}/all/a${s.v[3] || 1}` : '');
const lsProtoHref = (P, s) => `${lsModHref(P.m, 'v1')}index.html#/p/${P.n}/flow/${s.id}`;
// Ссылки на слайды шагов BPMN из ссылки связи («Д1 1.2 → 1.3 · Д2 2.2») — только в Dream TO BE
function lsRefSlides(view, ref) {
  if (view !== 'dream' || typeof LS_TRAIL === 'undefined') return '';
  const seen = new Set(), out = [];
  lsRefParts(ref).forEach((p) => (p.codes || []).forEach((c) => {
    const P = LS_TRAIL.dream.find((x) => x.p === p.proc);
    const st = P && (P.s.find((x) => x.c === c) || P.s.find((x) => x.c.startsWith(c + '.')));
    if (!st) return;
    const href = st.v ? lsSlideHref(P, st) : lsProtoHref(P, st);
    if (seen.has(href)) return;
    seen.add(href);
    out.push(`<a class="ls-slide" href="${href}" target="_blank" title="${st.v ? 'Слайд презентации: ' + st.v[2] : 'Слайда нет — шаг в прототипе'}">${p.proc} ${c} ${st.v ? 'слайд' : 'прототип'} ↗</a>`);
  }));
  return out.length ? `<span class="ls-slides">${out.join('')}</span>` : '';
}

function lsSide(root, grid, key, links, view) {
  const V = LS_VIEWS[view], full = LS_MODE === 'full';
  const anchor = lsAnchor(grid, key);
  const kind = anchor && anchor.classList.contains('ls-chip') ? (anchor.className.match(/k-(\w+)/) || [])[1] : 'user';
  const trail = lsTrailOf(view, key);
  const nSteps = trail.reduce((s, x) => s + x.list.length, 0);
  // Шаги, на которые опираются связи схемы: «Г1 1.1» → связи
  const marks = new Map();
  links.forEach((e) => (e.refs || [e.r]).flatMap((r) => lsSteps(view, r)).forEach((p) => (p.steps || []).forEach((s) => s.list.forEach((x) => {
    const k = p.proc + ' ' + x.c;
    if (!marks.has(k)) marks.set(k, []);
    if (!marks.get(k).includes(e)) marks.get(k).push(e);
  }))));
  const sysChips = (list) => list.map((x) => { const k = lsKey(x), a = lsAnchor(grid, k); const kd = a && a.classList.contains('ls-chip') ? (a.className.match(/k-(\w+)/) || [])[1] : x === 'MS Office' ? 'manual' : 'ext'; return `<span class="ls-sc k-${kd}">${x}</span>`; }).join('');
  const nb = (P, x) => {
    if (typeof x[0] !== 'number') return `<div class="ls-tn"><em>${x[0]}</em></div>`;
    const s = P.s[x[0]];
    return `<div class="ls-tn"><b>${s.c || '—'}</b> ${s.t}<span>${lsRole(s)}${s.s.length ? ' · ' + s.s.join(', ') : ''}</span>${x[1] ? `<q>${x[1]}</q>` : ''}</div>`;
  };
  // Связь одной строкой: откуда → куда, что, как, шаг, кто
  const linkRow = (e) => `<div class="ls-sl k-${e.k}">
      <div class="ls-sl-h"><span class="${e.f === key ? 'me' : ''}">${e.f}</span><i>→</i><span class="${e.t === key ? 'me' : ''}">${e.t}</span></div>
      <div class="ls-sl-w">${e.w}</div>
      <div class="ls-sl-m"><span>как: ${LS_KINDS[e.k]}</span><span>шаг: ${e.r}</span>${lsRefSlides(view, e.r)}${(() => { const who = lsWho(e, view); return who ? `<span>кто: ${who}</span>` : ''; })()}</div>
      ${full ? lsDetail(e, view) : ''}
    </div>`;
  const inn = links.filter((e) => e.t === key), out = links.filter((e) => e.f === key);
  const linksHTML = links.length
    ? [['Получает данные', inn], ['Передаёт данные', out]].filter(([, l]) => l.length).map(([t, l]) => `<div class="ls-sg"><div class="ls-sg-h">${t} <em>${l.length}</em></div>${l.map(linkRow).join('')}</div>`).join('')
    : '<div class="ls-empty">Связей этой системы на схеме нет — потоки данных ведутся по сценариям, а эта система в них не участвует.</div>';
  // История: процессы по модулям, шаги по порядку номеров; «до / после» — соседние шаги BPMN (через развилки)
  const mods = [...new Set(trail.map((x) => x.P.m))];
  const frames = trail.flatMap(({ P, list }) => list.map((i) => ({ P, i })));
  const fIx = new Map(frames.map((f, k) => [f.P.p + '|' + f.i, k]));
  const roles = new Map();
  trail.forEach(({ P, list }) => list.forEach((i) => { const r = lsRole(P.s[i]); roles.set(r, (roles.get(r) || 0) + 1); }));
  const histHTML = !nSteps ? '<div class="ls-empty">В шагах BPMN этого вида система не указана.</div>' : `
    <div class="ls-hf">${['', ...mods].map((m) => `<button data-hm="${m}" class="${m ? '' : 'on'}">${m ? LS_MOD_NAME[m] : 'Все'} <em>${m ? trail.filter((x) => x.P.m === m).reduce((s, x) => s + x.list.length, 0) : nSteps}</em></button>`).join('')}</div>
    <div class="ls-hr"><b>Кто работает с системой:</b> ${(() => { const rs = [...roles].sort((a, b) => b[1] - a[1]); return rs.slice(0, 6).map(([r, n]) => `${r} <em>${n}</em>`).join(' · ') + (rs.length > 6 ? ` · <span title="${rs.slice(6).map(([r, n]) => `${r} (${n})`).join(', ')}">ещё ${rs.length - 6}</span>` : ''); })()}</div>
    ${trail.map(({ P, list }) => {
      const prs = [...new Set(list.map((i) => lsRole(P.s[i])))];
      return `<details class="ls-tp" data-m="${P.m}"${nSteps <= 20 || trail.length === 1 ? ' open' : ''}>
        <summary><button class="ls-play" data-story="${fIx.get(P.p + '|' + list[0])}" title="Пройти шаги процесса по схеме">▶ по шагам</button>${(() => { const st = P.s.find((x) => x.v); return st ? `<a class="ls-slide fr" href="${lsModHref(P.m, 'v2')}index.html#${st.v[0]}/1/all" target="_blank" title="Презентация процесса — сценарий глазами ролей">презентация ↗</a>` : ''; })()}<b>${P.p}</b> ${P.t}<span>${list.length} ${list.length === 1 ? 'шаг' : list.length < 5 ? 'шага' : 'шагов'} · ${prs.join(', ')}</span></summary>
        <div class="ls-tl">${list.map((i, j) => {
          const s = P.s[i], prev = list[j - 1], next = list[j + 1];
          const pv = s.pv.filter((x) => x[0] !== prev), nx = s.nx.filter((x) => x[0] !== next);
          const mk = marks.get(P.p + ' ' + s.c) || [];
          const other = s.s.filter((x) => lsKey(x) !== key);
          const linked = next !== undefined && s.nx.some((x) => x[0] === next);
          return `${pv.length ? `<div class="ls-tw pv"><i>до</i><div>${pv.map((x) => nb(P, x)).join('')}</div></div>` : j ? '' : '<div class="ls-tw pv"><i>до</i><div><div class="ls-tn"><em>начало процесса</em></div></div></div>'}
            <div class="ls-ts" data-story="${fIx.get(P.p + '|' + i)}" title="Показать шаг в центре">
              <span class="ls-play">▶ показать</span>${s.v ? `<a class="ls-slide fr" href="${lsSlideHref(P, s)}" target="_blank" title="Слайд презентации: ${s.v[2]}">слайд ↗</a>` : ''}
              <div class="ls-ts-h"><b>${s.c || 'без номера'}</b>${s.t}</div>
              <div class="ls-ts-r">${lsRole(s)}</div>
              ${other.length ? `<div class="ls-ts-x"><i>вместе с</i>${sysChips(other)}</div>` : ''}
              ${s.d.length ? `<div class="ls-ts-x"><i>документы</i><span>${s.d.join('; ')}</span></div>` : ''}
              ${s.n.map((n) => `<q>${n}</q>`).join('')}
              ${mk.length ? mk.map((e) => `<div class="ls-ts-f k-${e.k}">на схеме: ${e.f === key ? `передаёт → <b>${e.t}</b>` : `получает ← <b>${e.f}</b>`} · ${e.w}</div>`).join('') : '<div class="ls-ts-f none">в потоках данных на схеме не показан</div>'}
            </div>
            ${next === undefined ? (nx.length ? `<div class="ls-tw nx"><i>после</i><div>${nx.map((x) => nb(P, x)).join('')}</div></div>` : '<div class="ls-tw nx"><i>после</i><div><div class="ls-tn"><em>конец процесса</em></div></div></div>')
              : `${nx.length ? `<div class="ls-tw nx"><i>после</i><div>${nx.map((x) => nb(P, x)).join('')}</div></div>` : ''}<div class="ls-tg">${linked ? '↓ следующий шаг' : '⋯ другие шаги процесса'}</div>`}`;
        }).join('')}</div>
      </details>`;
    }).join('')}`;
  let side = document.querySelector('.ls-side'), center = document.querySelector('.ls-center');
  if (!side) { side = document.createElement('aside'); side.className = 'ls ls-side'; document.body.appendChild(side); }
  if (!center) { center = document.createElement('section'); center.className = 'ls ls-center'; document.body.appendChild(center); }
  center.classList.remove('solo');
  const tab0 = nSteps ? 'hist' : 'links';
  side.innerHTML = `
    <div class="ls-side-h">
      <div><span class="ls-side-g">${lsGroup(anchor, view).title} · ${V.name}</span><b class="k-${kind}">${key}</b>
        <span class="ls-side-s">в BPMN: <b>${nSteps}</b> ${nSteps === 1 ? 'шаг' : nSteps > 1 && nSteps < 5 ? 'шага' : 'шагов'} в ${trail.length} ${trail.length === 1 ? 'процессе' : 'процессах'} · связей на схеме: <b>${links.length}</b></span></div>
      <button class="ls-pop-x" title="Закрыть (Esc)">×</button>
    </div>
    <div class="ls-side-t"><button data-tab="hist" class="${tab0 === 'hist' ? 'on' : ''}">Шаги BPMN <em>${nSteps}</em></button><button data-tab="links" class="${tab0 === 'links' ? 'on' : ''}">Связи на схеме <em>${links.length}</em></button></div>
    <div class="ls-side-b" data-pane="hist" ${tab0 === 'hist' ? '' : 'hidden'}>${histHTML}</div>
    <div class="ls-side-b" data-pane="links" ${tab0 === 'links' ? '' : 'hidden'}>${linksHTML}</div>`;
  center.innerHTML = `
    <div class="ls-center-h">
      <b class="k-${kind}">${key}</b>
      <div class="ls-center-m">${links.length ? `<button data-cm="path">Путь данных</button><button data-cm="bus">Связи системы <em>${links.length}</em></button>` : ''}${nSteps ? `<button data-cm="story">История по шагам <em>${nSteps}</em></button>` : ''}</div>
      <span class="ls-center-hint"></span>
    </div>
    <div class="ls-center-b" data-cpane="path" hidden><div class="ls-pth-host"></div><div class="ls-about"></div></div>
    <div class="ls-center-b" data-cpane="bus" hidden>${links.length ? '<div class="ls-center-sub">Все связи системы на схеме ЦД: снизу — кто передаёт ей данные, сверху — кому передаёт она. Справа — их список и все шаги BPMN системы.</div><div class="ls-focus"></div>' : ''}<div class="ls-about"></div></div>
    <div class="ls-center-b ls-story" data-cpane="story" hidden></div>`;
  // Схема связей — в натуральную величину: широкая прокручивается, а не сжимается. Рисуется, когда окно видно (подписи меряются по факту)
  let busDone = false, path = null;
  // Текущий шаг истории — подсвечен в списке сайдбара
  const syncSide = (k) => {
    side.querySelectorAll('.ls-ts.cur').forEach((x) => x.classList.remove('cur'));
    const el = side.querySelector(`.ls-ts[data-story="${k}"]`);
    if (!el) return;
    el.classList.add('cur');
    const d = el.closest('details'); if (d) d.open = true;
    const tp = el.closest('.ls-tp'); if (tp && tp.hidden) side.querySelector('[data-hm=""]').click();
    if (side.querySelector('[data-pane="hist"]').hidden) side.querySelector('[data-tab="hist"]').click();
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  const story = lsStoryPane(center.querySelector('[data-cpane="story"]'), grid, key, view, frames, marks, sysChips, syncSide);
  // Клик по другой системе — её окно
  const pick = (n) => { const el = [...grid.querySelectorAll('[data-sys]')].find((x) => x.dataset.sys === n); if (el) { lsUnpin(); el.click(); } };
  // «О системе» — под схемой во всех режимах: что это, откуда и куда данные, по процессам и сценариям, реестр задействованных систем
  const about = lsAbout(grid, key, view, links, trail);
  center.querySelectorAll('.ls-about').forEach((el) => {
    el.innerHTML = about;
    el.querySelectorAll('[data-pick]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); pick(a.dataset.pick); }));
    el.querySelectorAll('[data-scen]').forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); mode('path'); path.show(a.dataset.scen); center.querySelector('[data-cpane="path"]').scrollTop = 0; }));
  });
  const mode = (m, k) => {
    center.querySelectorAll('[data-cm]').forEach((x) => x.classList.toggle('on', x.dataset.cm === m));
    center.querySelectorAll('[data-cpane]').forEach((x) => (x.hidden = x.dataset.cpane !== m));
    center.querySelector('.ls-center-hint').textContent = m === 'story' ? '← → — листать шаги · Esc — закрыть' : m === 'path' ? 'клик по системе — её путь данных · Esc — закрыть' : 'наведите на подпись — шаг BPMN связи · Esc — закрыть';
    if (path && m !== 'path') path.stop();
    if (m === 'path' && !path) path = lsPaths(center.querySelector('[data-cpane="path"] .ls-pth-host'), grid, key, view, { onPick: pick }) || { stop() {}, show() {} };
    center.querySelector('.ls-center-b:not([hidden])').scrollTop = 0;
    if (m === 'bus' && !busDone) { busDone = true; lsBus(center.querySelector('[data-cpane="bus"] .ls-focus'), grid, key, links, view, { full: LS_MODE === 'full' }); }
    if (m === 'story') story.open(k || 0); else { story.close(); side.querySelectorAll('.ls-ts.cur').forEach((x) => x.classList.remove('cur')); }
  };
  center.querySelectorAll('[data-cm]').forEach((b) => (b.onclick = () => mode(b.dataset.cm)));
  side.querySelectorAll('[data-story]').forEach((b) => (b.onclick = (ev) => { if (ev.target.closest('a')) return; ev.preventDefault(); ev.stopPropagation(); mode('story', +b.dataset.story); }));
  side.querySelectorAll('[data-tab]').forEach((b) => (b.onclick = () => {
    side.querySelectorAll('[data-tab]').forEach((x) => x.classList.toggle('on', x === b));
    side.querySelectorAll('[data-pane]').forEach((x) => (x.hidden = x.dataset.pane !== b.dataset.tab));
  }));
  side.querySelectorAll('[data-hm]').forEach((b) => (b.onclick = () => {
    side.querySelectorAll('[data-hm]').forEach((x) => x.classList.toggle('on', x === b));
    side.querySelectorAll('.ls-tp').forEach((x) => (x.hidden = !!b.dataset.hm && x.dataset.m !== b.dataset.hm));
  }));
  side.querySelector('.ls-pop-x').onclick = lsUnpin;
  let bg = document.querySelector('.ls-pop-bg');
  if (!bg) { bg = document.createElement('div'); bg.className = 'ls-pop-bg'; document.body.appendChild(bg); }
  bg.style.display = 'block'; bg.onclick = lsUnpin;
  side.scrollTop = 0;
  LS_PATH_STOP = () => path && path.stop();
  mode(links.length ? 'path' : 'story');
  requestAnimationFrame(() => { side.classList.add('open'); center.classList.add('open'); });
  return true;
}

// ---------- «О системе»: кратко — что это, откуда и как берёт данные, что отдаёт дальше, по процессам и сценариям, реестр систем ----------
// Всё из тех же источников: справочники систем модулей (ABAI_SYS_DESC), связи схемы (LS_FLOWS), шаги BPMN (LS_TRAIL).
function lsAbout(grid, key, view, links, trail) {
  const V = LS_VIEWS[view];
  const dataKind = {};
  LS_MODS.forEach((m) => (((ABAI_LANDSCAPE_DATA[m.id] || {})[V.v] || {}).sys || []).forEach(([n, k]) => (dataKind[lsKey(n)] = k)));
  const kindOf = (n) => { const a = lsAnchor(grid, n); return a ? (a.classList.contains('ls-chip') ? (a.className.match(/k-(\w+)/) || [])[1] : 'user') : dataKind[n] || 'ext'; };
  // Система — ссылкой на её окно, если она есть на схеме
  const sys = (n) => (lsAnchor(grid, n) && n !== key ? `<a href="#" class="ls-ab-s k-${kindOf(n)}" data-pick="${n}">${n}</a>` : `<span class="ls-ab-s k-${kindOf(n)}">${n}</span>`);
  const plural = (n, a, b, c) => (n % 10 === 1 && n % 100 !== 11 ? a : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? b : c);
  const short = key.replace(/^(ABAI|SLB)\s+/, '').replace(/\s+2\.0$/, '');
  // Что это
  const desc = Object.entries(typeof ABAI_SYS_DESC !== 'undefined' ? ABAI_SYS_DESC : {}).filter(([n]) => lsKey(n) === key).flatMap(([, l]) => l);
  const uniq = desc.filter((x, i) => desc.findIndex((y) => y[1] === x[1]) === i);
  const nSteps = trail.reduce((s, x) => s + x.list.length, 0);
  // Откуда берёт и что отдаёт
  const inn = links.filter((e) => e.t === key), out = links.filter((e) => e.f === key);
  const li = (e, other, arrow) => `<li><b class="ar">${arrow}</b>${sys(other)} — ${e.w}<em>${LS_KINDS[e.k]} · ${e.r}</em>${lsRefSlides(view, e.r)}</li>`;
  // По процессам: что система делает (аннотации шагов о ней, иначе названия шагов) и что процесс отдаёт дальше
  const procs = trail.map(({ P, list }) => {
    const st = list.map((i) => P.s[i]);
    const notes = [...new Set(st.flatMap((s) => s.n.filter((n) => n.includes(short) || n.includes(key))))].slice(0, 3);
    const what = notes.length ? notes.map((n) => `<q>${n}</q>`).join('') : `<span class="ls-ab-st">${st.slice(0, 3).map((s) => `${s.c} ${s.t}`).join('; ')}${st.length > 3 ? '…' : ''}</span>`;
    const gives = out.filter((e) => lsRefParts(e.r).some((p) => p.proc === P.p));
    const gets = inn.filter((e) => lsRefParts(e.r).some((p) => p.proc === P.p));
    const first = st.find((s) => s.v), anyV = P.s.find((s) => s.v);
    const roles = [...new Set(st.map((s) => s.r))];
    return `<li><div class="ls-ab-ph"><b>${P.p}</b> ${P.t}<span>${st.length} ${plural(st.length, 'шаг', 'шага', 'шагов')} · ${roles.slice(0, 4).join(', ')}${roles.length > 4 ? '…' : ''}</span>
        ${anyV ? `<a class="ls-slide" href="${lsModHref(P.m, 'v2')}index.html#${anyV.v[0]}/1/all" target="_blank">презентация ↗</a>` : ''}${first ? `<a class="ls-slide" href="${lsSlideHref(P, first)}" target="_blank">первый шаг на слайде ↗</a>` : ''}<a class="ls-slide" href="${lsProtoHref(P, st[0])}" target="_blank">прототип ↗</a></div>
      <div class="ls-ab-pw"><i>что делает</i><div>${what}</div></div>
      ${gets.length ? `<div class="ls-ab-pw"><i>получает</i><div>${gets.map((e) => `${sys(e.f)} — ${e.w}`).join('; ')}</div></div>` : ''}
      ${gives.length ? `<div class="ls-ab-pw"><i>отдаёт дальше</i><div>${gives.map((e) => `${sys(e.t)} — ${e.w}`).join('; ')}</div></div>` : ''}</li>`;
  });
  // По сценариям: что даёт сценарий (его описание) и роль системы в нём
  const scen = (LS_FLOWS[view] || []).filter((f) => f.e.some((e) => e[0] === key || e[1] === key)).map((f) => `<li>
      <div class="ls-ab-ph"><a href="#" data-scen="${f.id}">${f.name}</a><span>${f.mods}</span></div>
      <div class="ls-ab-pw"><i>что даёт</i><div>${f.note}</div></div>
      <div class="ls-ab-pw"><i>здесь</i><div>${f.e.filter((e) => e[0] === key || e[1] === key).map((e) => (e[1] === key ? `получает от ${sys(e[0])}: ${e[2]}` : `передаёт в ${sys(e[1])}: ${e[2]}`)).join('; ')}</div></div></li>`);
  // Реестр задействованных систем и инструментов: в общих шагах BPMN и в связях схемы
  const reg = new Map();
  const r = (n) => { if (!reg.has(n)) reg.set(n, { n, steps: 0, procs: new Set(), inn: [], out: [] }); return reg.get(n); };
  trail.forEach(({ P, list }) => list.forEach((i) => P.s[i].s.forEach((x) => { const k = lsKey(x); if (k === key) return; const q = r(k); q.steps++; q.procs.add(P.p); })));
  inn.forEach((e) => r(e.f).inn.push(e));
  out.forEach((e) => r(e.t).out.push(e));
  const KINDS = [['abai', 'ABAI и КХД'], ['nedra', 'Nedra'], ['ext', 'Инженерное ПО, промысловые и внешние системы'], ['manual', 'Ручная работа'], ['user', 'Пользователи']];
  const rows = [...reg.values()].map((q) => Object.assign(q, { kind: kindOf(q.n) })).sort((a, b) => b.steps + 3 * (b.inn.length + b.out.length) - a.steps - 3 * (a.inn.length + a.out.length));
  const regHTML = KINDS.map(([k, t]) => {
    const list = rows.filter((q) => (KINDS.some(([x]) => x === q.kind) ? q.kind : 'ext') === k);
    return list.length ? `<tbody><tr class="ls-ab-g"><td colspan="3">${t} <em>${list.length}</em></td></tr>${list.map((q) => `<tr>
      <td>${sys(q.n)}</td>
      <td>${q.steps ? `в ${q.steps} ${plural(q.steps, 'общем шаге', 'общих шагах', 'общих шагах')}<span>${[...q.procs].join(', ')}</span>` : '<span>—</span>'}</td>
      <td>${q.inn.map((e) => `<div>← передаёт сюда: ${e.w}</div>`).join('')}${q.out.map((e) => `<div>→ получает отсюда: ${e.w}</div>`).join('')}${q.inn.length + q.out.length ? '' : '<span>—</span>'}</td></tr>`).join('')}</tbody>` : '';
  }).join('');
  return `<div class="ls-ab">
    <h3>О системе «${key}» · ${V.name}</h3>
    <div class="ls-ab-lead">${uniq.length ? uniq.map(([m, d]) => `<div><b>${LS_MOD_NAME[m] || m}:</b> ${d}</div>`).join('') : ''}
      <div class="ls-ab-k">в BPMN — ${nSteps} ${plural(nSteps, 'шаг', 'шага', 'шагов')} в ${trail.length} ${plural(trail.length, 'процессе', 'процессах', 'процессах')}; на схеме — получает ${inn.length}, передаёт ${out.length} ${plural(out.length, 'связь', 'связи', 'связей')}; задействовано ${reg.size} ${plural(reg.size, 'система', 'системы', 'систем')}</div></div>
    <div class="ls-ab-c2">
      <div><h4>Откуда и как берёт данные <em>${inn.length}</em></h4>${inn.length ? `<ul class="ls-ab-l">${inn.map((e) => li(e, e.f, '←')).join('')}</ul>` : '<p class="ls-ab-n">На схеме данные в систему не приходят — она источник или в потоках не участвует.</p>'}</div>
      <div><h4>Что отдаёт дальше <em>${out.length}</em></h4>${out.length ? `<ul class="ls-ab-l">${out.map((e) => li(e, e.t, '→')).join('')}</ul>` : '<p class="ls-ab-n">На схеме система данные дальше не передаёт.</p>'}</div>
    </div>
    ${procs.length ? `<h4>По процессам BPMN <em>${procs.length}</em></h4><ul class="ls-ab-p">${procs.join('')}</ul>` : ''}
    ${scen.length ? `<h4>По сценариям потоков <em>${scen.length}</em> <span>клик — путь данных сценария</span></h4><ul class="ls-ab-p">${scen.join('')}</ul>` : ''}
    ${reg.size ? `<h4>Реестр задействованных систем и инструментов <em>${reg.size}</em> <span>с кем система в одних шагах BPMN и в связях схемы · клик — окно системы</span></h4>
      <table class="ls-ab-t"><thead><tr><th>Система</th><th>В шагах BPMN вместе</th><th>Связь на схеме</th></tr></thead>${regHTML}</table>` : ''}
  </div>`;
}

// ---------- Путь данных: откуда данные приходят в систему и куда уходят дальше — через промежуточные системы ----------
// По сценариям потоков (landscape-flows.js): сценарий — связная история («Суточная добыча», «Строительство скважины»),
// в нём — цепочки до системы и после неё. «Все сценарии» — связи всех сценариев, но не дальше двух передач в каждую сторону
// (через БД 2.0 и КХД иначе в путь попадает вся сеть).
function lsPaths(host, grid, key, view, o = {}) {
  const fl = (LS_FLOWS[view] || []).filter((f) => f.e.some((e) => e[0] === key || e[1] === key));
  const tabs = fl.map((f) => ({ id: f.id, name: f.name, sub: f.mods, flows: [f], depth: Infinity })).concat(fl.length > 1 ? [{ id: '*', name: 'Все сценарии', sub: 'до 2 передач в каждую сторону', flows: LS_FLOWS[view], depth: 2 }] : []);
  host.innerHTML = `<div class="ls-pth-t">${tabs.map((t, i) => `<button data-pt="${i}"><b>${t.name}</b><span>${t.sub}</span></button>`).join('')}</div><div class="ls-pth-b"></div>`;
  let cur = null;
  const show = (i) => {
    if (cur) cur.stop();
    host.querySelectorAll('[data-pt]').forEach((b) => b.classList.toggle('on', +b.dataset.pt === i));
    cur = lsLineage(host.querySelector('.ls-pth-b'), grid, key, view, Object.assign({}, o, { flows: tabs[i].flows, depth: tabs[i].depth, scen: tabs[i] })) || { stop() {} };
  };
  host.querySelectorAll('[data-pt]').forEach((b) => (b.onclick = () => show(+b.dataset.pt)));
  show(0);
  return { stop: () => cur && cur.stop(), show: (id) => { const i = tabs.findIndex((t) => t.id === id); if (i >= 0) show(i); } };
}
function lsLineage(host, grid, key, view, o = {}) {
  const NH = 46, HG = 26, VG = 92, VW = 14, BR = 9;
  // Связи выбранных сценариев: одинаковые «откуда → куда» объединены
  const E = [], byId = new Map();
  (o.flows || LS_FLOWS[view] || []).forEach((f) => f.e.forEach(([a, z, w, r, k]) => {
    const id = a + '|' + z;
    if (!byId.has(id)) { const e = { f: a, t: z, w, r, k }; byId.set(id, e); E.push(e); } else { const e = byId.get(id); if (!e.w.includes(w)) { e.w += '; ' + w; e.r += ' · ' + r; } }
  }));
  const depth = o.depth || Infinity;
  const bfs = (dir) => {
    const dist = new Map([[key, 0]]), q = [key];
    while (q.length) { const v = q.shift(); if (dist.get(v) >= depth) continue; E.forEach((e) => { const [from, to] = dir > 0 ? [e.f, e.t] : [e.t, e.f]; if (from === v && !dist.has(to)) { dist.set(to, dist.get(v) + 1); q.push(to); } }); }
    return dist;
  };
  const up = bfs(-1), down = bfs(1); // up — источники (сколько передач до системы), down — получатели
  // Сторона системы на пути: до неё (уровень < 0) или после (> 0) — по ближайшей; связи — только внутри своей стороны
  const lvl = (n) => (n === key ? 0 : up.has(n) && (!down.has(n) || up.get(n) <= down.get(n)) ? -up.get(n) : down.get(n));
  const edges = E.filter((e) => (up.has(e.f) && up.has(e.t) && lvl(e.f) <= 0 && lvl(e.t) <= 0) || (down.has(e.f) && down.has(e.t) && lvl(e.f) >= 0 && lvl(e.t) >= 0));
  if (!edges.length) { host.innerHTML = '<div class="ls-empty">Связей этой системы на схеме нет — путь данных не построить.</div>'; return; }
  const kindOf = (n) => { const a = lsAnchor(grid, n); return a && a.classList.contains('ls-chip') ? (a.className.match(/k-(\w+)/) || [])[1] : 'user'; };
  const nodes = new Map();
  edges.forEach((e) => [e.f, e.t].forEach((n) => { if (!nodes.has(n)) nodes.set(n, { n, real: true, L: lvl(n), kind: kindOf(n), g: lsGroup(lsAnchor(grid, n), view).title, w: Math.round(Math.min(210, Math.max(118, 26 + n.length * 7.2))), e: [] }); }));
  const minL = Math.min(...[...nodes.values()].map((x) => x.L)), maxL = Math.max(...[...nodes.values()].map((x) => x.L));
  // Длинные связи — через промежуточные ряды (точки-проводники), обратные (против хода данных) — дугой справа
  const items = edges.map((e, i) => {
    const a = nodes.get(e.f), b = nodes.get(e.t), it = { e, a, b, back: b.L <= a.L, via: [] };
    if (!it.back) for (let L = a.L + 1; L < b.L; L++) { const v = { real: false, L, w: VW, e: [it] }; nodes.set('~' + i + '~' + L, v); it.via.push(v); }
    a.e.push(it); b.e.push(it);
    return it;
  });
  const rows = Array.from({ length: maxL - minL + 1 }, (_, r) => [...nodes.values()].filter((x) => x.L === minL + r));
  // Соседи узла в соседних рядах (с учётом проводников)
  const chainOf = (it) => [it.a, ...it.via, it.b];
  const nbr = (x, dL) => items.filter((it) => !it.back).flatMap((it) => { const ch = chainOf(it), i = ch.indexOf(x); return i < 0 ? [] : [ch[i + dL]].filter((y) => y && y.L === x.L + dL); });
  // Порядок в рядах — по соседям (барицентры), затем координаты: как можно ближе к соседям, без наложений
  const cx = (x) => x.x + x.w / 2;
  const pack = (row) => { let x = 0; row.forEach((n) => { n.x = x; x += n.w + HG; }); row.wd = x - HG; };
  rows.forEach(pack);
  const W0 = () => Math.max(...rows.map((r) => r.wd));
  rows.forEach((r) => { const dx = (W0() - r.wd) / 2; r.forEach((n) => (n.x += dx)); });
  for (let it = 0; it < 10; it++) {
    const sweep = it % 2 ? rows.slice().reverse() : rows;
    sweep.forEach((row) => {
      const dL = it % 2 ? 1 : -1;
      row.forEach((n) => { const nb = nbr(n, dL).concat(nbr(n, -dL).map((y) => y)); n.bc = nb.length ? nb.reduce((s, y) => s + cx(y), 0) / nb.length : cx(n); });
      row.sort((p, q) => p.bc - q.bc);
      // Желаемые позиции по соседям, затем раздвигаем, сохраняя порядок
      row.forEach((n) => (n.x = n.bc - n.w / 2));
      for (let i = 1; i < row.length; i++) row[i].x = Math.max(row[i].x, row[i - 1].x + row[i - 1].w + HG);
      for (let i = row.length - 2; i >= 0; i--) row[i].x = Math.min(row[i].x, row[i + 1].x - row[i].w - HG);
    });
  }
  const minX = Math.min(...[...nodes.values()].map((n) => n.x));
  nodes.forEach((n) => (n.x -= minX - 64));
  const backN = items.filter((it) => it.back).length;
  const W = Math.max(...[...nodes.values()].map((n) => n.x + n.w)) + 20;
  const yOf = (L) => 14 + (maxL - L) * (NH + VG);
  nodes.forEach((n) => (n.y = yOf(n.L)));
  const H = yOf(minL) + NH + 14;
  // Точки крепления: по ширине узла, в порядке другого конца
  const ports = new Map();
  const port = (n, side, it, other) => { const k = n.n + side; if (!ports.has(k)) ports.set(k, []); ports.get(k).push({ it, other }); };
  items.filter((it) => !it.back).forEach((it) => { const ch = chainOf(it); port(it.a, 't', it, cx(ch[1])); port(it.b, 'b', it, cx(ch[ch.length - 2])); });
  ports.forEach((list, k) => {
    const n = nodes.get(k.slice(0, -1)), side = k.slice(-1);
    list.sort((p, q) => p.other - q.other).forEach((p, j) => { const x = n.x + (n.w * (j + 1)) / (list.length + 1); if (side === 't') p.it.x0 = x; else p.it.x1 = x; });
  });
  // Номера связей — по этапам (ряд источника), внутри — слева направо
  const fwd = items.filter((it) => !it.back).sort((p, q) => p.a.L - q.a.L || p.x0 - q.x0);
  const order = fwd.concat(items.filter((it) => it.back));
  order.forEach((it, i) => (it.n = i + 1));
  const stages = [...new Set(fwd.map((it) => it.a.L))].sort((p, q) => p - q);
  let paths = '', badges = '';
  const placed = [];
  const nodeBox = [...nodes.values()].filter((n) => n.real).map((n) => ({ l: n.x, t: n.y, r: n.x + n.w, b: n.y + NH }));
  const ov = (p, q) => Math.max(0, Math.min(p.r, q.r) - Math.max(p.l, q.l)) * Math.max(0, Math.min(p.b, q.b) - Math.max(p.t, q.t));
  let bi = 0;
  order.forEach((it) => {
    let d, pts;
    if (it.back) {
      bi++;
      const xa = Math.min(it.a.x + it.a.w - 8, cx(it.a) + 16), xb = Math.min(it.b.x + it.b.w - 8, cx(it.b) + 16);
      if (it.a.L === it.b.L) {
        const y = it.a.y + NH, dy = 34 + bi * 6;
        d = `M${xa},${y} C${xa},${y + dy} ${xb},${y + dy} ${xb},${y + 2}`;
        pts = [[(xa + xb) / 2, y + dy * 0.75]];
      } else {
        const y0 = it.a.y + NH, y1 = it.b.y, m = (y1 - y0) / 2;
        d = `M${xa},${y0} C${xa},${y0 + m} ${xb},${y1 - m} ${xb},${y1}`;
        pts = [0.5, 0.35, 0.65].map((t) => { const u = 1 - t; return [u * u * u * xa + 3 * u * u * t * xa + 3 * u * t * t * xb + t * t * t * xb, u * u * u * y0 + 3 * u * u * t * (y0 + m) + 3 * u * t * t * (y1 - m) + t * t * t * y1]; });
      }
    } else {
      // Ломаная по рядам: вверх от источника, через проводники, к получателю; плавные переходы между рядами
      const P = [[it.x0, it.a.y]];
      it.via.forEach((v) => { P.push([cx(v), v.y + NH], [cx(v), v.y]); });
      P.push([it.x1, it.b.y + NH]);
      d = `M${P[0][0]},${P[0][1]}`;
      for (let i = 1; i < P.length; i++) {
        const [x0, y0] = P[i - 1], [x1, y1] = P[i];
        if (x0 === x1 && i % 2 === 0) d += ` L${x1},${y1}`; else { const m = (y0 - y1) / 2; d += ` C${x0},${y0 - m} ${x1},${y1 + m} ${x1},${y1}`; }
      }
      // Номер — на последнем переходе, ближе к получателю
      const [x0, y0] = P[P.length - 2], [x1, y1] = P[P.length - 1];
      pts = [0.55, 0.4, 0.7, 0.3, 0.8].map((t) => { const u = 1 - t, m = (y0 - y1) / 2; return [u * u * u * x0 + 3 * u * u * t * x0 + 3 * u * t * t * x1 + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * (y0 - m) + 3 * u * t * t * (y1 + m) + t * t * t * y1]; });
    }
    let best = null;
    pts.forEach(([x, y]) => { const q = { l: x - BR, t: y - BR, r: x + BR, b: y + BR }; const sc = placed.reduce((s, z) => s + 3 * ov(q, z), 0) + nodeBox.reduce((s, z) => s + ov(q, z), 0); if (!best || sc < best.sc) best = { sc, x, y }; });
    placed.push({ l: best.x - BR - 2, t: best.y - BR - 2, r: best.x + BR + 2, b: best.y + BR + 2 });
    paths += `<path d="${d}" class="k-${it.e.k}${it.back ? ' back' : ''}" data-e="${it.n}" marker-end="url(#lsnArr-${it.e.k})"/><path d="${d}" class="hit" data-e="${it.n}"/>`;
    badges += `<b class="ls-nb k-${it.e.k}" data-e="${it.n}" style="left:${best.x - BR}px;top:${best.y - BR}px">${it.n}</b>`;
  });
  const mk = (k, c) => `<marker id="lsnArr-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${c}"/></marker>`;
  const stageName = (L) => (L < -1 ? 'раньше — по пути к системе' : L === -1 ? `в «${key}»` : L === 0 ? `из «${key}»` : 'дальше');
  const edgeLine = (it) => `<li data-e="${it.n}" class="k-${it.e.k}"><b>${it.n}</b><span class="ft">${it.e.f} → ${it.e.t}</span> — ${it.e.w}<em>${it.e.r} · ${LS_KINDS[it.e.k]}</em>${lsRefSlides(view, it.e.r)}</li>`;
  host.innerHTML = `
    <div class="ls-ln-bar">
      <div class="ls-ln-sum">${(() => { const nu = up.size - 1, nd = down.size - 1; // все, кто передаёт системе / получает от неё на этом пути, включая обратные связи
        return `<span>${nu ? `<b>${nu}</b> ${nu === 1 ? 'система передаёт' : 'систем передают'} данные в «${key}»` : `в «${key}» данные не приходят — она источник`}</span><span>${nd ? `<b>${nd}</b> ${nd === 1 ? 'система получает' : 'систем получают'} их дальше` : 'дальше данные не уходят'}</span>`; })()}</div>
      <div class="ls-ln-ctl"><button data-st="-1">◀ Этап</button><button data-st="play" class="play">▶ Проиграть путь</button><button data-st="1">Этап ▶</button><button data-st="all">Весь путь</button></div>
    </div>
    <div class="ls-ln-cap">Весь путь данных: снизу — откуда данные изначально приходят, посередине — «${key}», сверху — куда уходят. Наведите на номер или систему — что передаётся; клик по системе — её путь данных.</div>
    <div class="ls-ln-wrap"><div class="ls-fcanvas ls-net ls-ln v-${view}" style="width:${W}px;height:${H}px">
      ${rows.map((r, i) => `<div class="ls-ln-row${minL + i === 0 ? ' me' : ''}" style="top:${yOf(minL + i) - 8}px;height:${NH + 16}px"><span>${minL + i === 0 ? 'система' : minL + i < 0 ? `−${-(minL + i)}` : `+${minL + i}`}</span></div>`).join('')}
      <svg width="${W}" height="${H}"><defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}${mk('pub', '#0e7490')}</defs>${paths}</svg>
      ${[...nodes.values()].filter((n) => n.real).map((n) => `<div class="ls-fnode k-${n.kind}${n.n === key ? ' me' : ''}" data-n="${n.n}" title="${n.n === key ? '' : 'Клик — путь данных этой системы'}" style="left:${n.x}px;top:${n.y}px;width:${n.w}px;height:${NH}px"><span>${n.g}</span><b>${n.n}</b></div>`).join('')}
      <div class="ls-nbs">${badges}</div>
      <div class="ls-ncall"></div>
    </div></div>
    <div class="ls-ln-list">${stages.map((L) => `<div><h4>Этап ${stages.indexOf(L) + 1} · ${stageName(L)}</h4><ol>${fwd.filter((it) => it.a.L === L).map(edgeLine).join('')}</ol></div>`).join('')}
      ${backN ? `<div><h4>Обратные связи · данные возвращаются против хода пути</h4><ol>${items.filter((it) => it.back).map(edgeLine).join('')}</ol></div>` : ''}</div>`;
  // ---- Подсветка, этапы, клик по системе ----
  const canvas = host.querySelector('.ls-ln'), call = host.querySelector('.ls-ncall');
  lsRail(host.querySelector('.ls-ln-wrap'));
  const byN = new Map(order.map((it) => [it.n, it]));
  let stage = null, timer = null;
  const paint = () => {
    canvas.classList.toggle('staged', stage !== null);
    if (stage === null) { canvas.querySelectorAll('.done, .now').forEach((x) => x.classList.remove('done', 'now')); host.querySelectorAll('.ls-ln-list li').forEach((x) => x.classList.remove('done', 'now')); host.querySelector('.ls-ln-cap').innerHTML = `Весь путь данных: снизу — откуда данные изначально приходят, посередине — «${key}», сверху — куда уходят. Наведите на номер или систему — что передаётся; клик по системе — её путь данных.`; return; }
    const L = stages[stage];
    const st = (it) => (it.back ? '' : it.a.L < L ? 'done' : it.a.L === L ? 'now' : '');
    canvas.querySelectorAll('[data-e]').forEach((x) => { const c = st(byN.get(+x.dataset.e)); x.classList.toggle('done', c === 'done'); x.classList.toggle('now', c === 'now'); });
    host.querySelectorAll('.ls-ln-list li').forEach((x) => { const c = st(byN.get(+x.dataset.e)); x.classList.toggle('done', c === 'done'); x.classList.toggle('now', c === 'now'); });
    const reached = new Set(fwd.filter((it) => it.a.L <= L).flatMap((it) => [it.a.n, it.b.n]));
    canvas.querySelectorAll('.ls-fnode').forEach((x) => { x.classList.toggle('done', reached.has(x.dataset.n)); });
    const now = fwd.filter((it) => it.a.L === L);
    host.querySelector('.ls-ln-cap').innerHTML = `<b>Этап ${stage + 1} из ${stages.length} · ${stageName(L)}:</b> ${now.map((it) => `${it.e.f} → ${it.e.t} <i>(${it.e.w})</i>`).join('; ')}`;
  };
  const stop = () => { clearInterval(timer); timer = null; host.querySelector('[data-st="play"]').textContent = '▶ Проиграть путь'; };
  host.querySelectorAll('[data-st]').forEach((b) => (b.onclick = () => {
    const a = b.dataset.st;
    if (a === 'all') { stop(); stage = null; paint(); return; }
    if (a === 'play') {
      if (timer) { stop(); return; }
      stage = stage === null || stage >= stages.length - 1 ? 0 : stage + 1; paint();
      b.textContent = '❚❚ Пауза';
      timer = setInterval(() => { if (stage >= stages.length - 1) { stop(); return; } stage++; paint(); }, 2600);
      return;
    }
    stop(); stage = stage === null ? (+a > 0 ? 0 : stages.length - 1) : Math.max(0, Math.min(stages.length - 1, stage + +a)); paint();
  }));
  const hot = (ids, it) => {
    canvas.classList.toggle('focus', !!ids);
    canvas.querySelectorAll('[data-e]').forEach((x) => x.classList.toggle('hot', !!ids && ids.includes(+x.dataset.e)));
    canvas.querySelectorAll('.ls-fnode').forEach((x) => x.classList.toggle('hot', !!ids && order.some((q) => ids.includes(q.n) && (q.a.n === x.dataset.n || q.b.n === x.dataset.n))));
    if (it) {
      const bx = canvas.querySelector(`.ls-nb[data-e="${it.n}"]`);
      call.innerHTML = `<b>${it.n}</b> ${it.e.f} → ${it.e.t}<span>${it.e.w}</span><em>${it.e.r} · ${LS_KINDS[it.e.k]}</em>`;
      call.style.display = 'block';
      const L = parseFloat(bx.style.left) + 24, T = parseFloat(bx.style.top) - 6;
      call.style.left = (L + call.offsetWidth > W ? Math.max(4, L - 48 - call.offsetWidth) : L) + 'px'; call.style.top = Math.min(T, H - call.offsetHeight - 4) + 'px';
    } else call.style.display = 'none';
  };
  canvas.querySelectorAll('[data-e]').forEach((x) => { const it = byN.get(+x.dataset.e); x.onmouseenter = () => hot([it.n], it); x.onmouseleave = () => hot(null); });
  host.querySelectorAll('.ls-ln-list li').forEach((x) => { const it = byN.get(+x.dataset.e); x.onmouseenter = () => hot([it.n]); x.onmouseleave = () => hot(null); });
  canvas.querySelectorAll('.ls-fnode').forEach((x) => {
    const n = nodes.get(x.dataset.n);
    x.onmouseenter = () => hot(n.e.map((q) => q.n));
    x.onmouseleave = () => hot(null);
    if (n.n !== key && o.onPick) x.onclick = () => { stop(); o.onPick(n.n); };
  });
  return { stop };
}

// ---------- История по шагам: каждый шаг BPMN системы — вертикальная схема снизу вверх ----------
// Внизу — откуда пришли: предыдущий шаг BPMN и связи схемы, по которым система получает данные на этом шаге;
// посередине — сам шаг: исполнитель, системы (аннотации BPMN — под системой, о которой они), документы;
// вверху — куда дальше: следующий шаг BPMN и связи, по которым система передаёт данные. На большой схеме подсвечены системы шага.
function lsStoryPane(pane, grid, key, view, frames, marks, sysChips, onFrame) {
  let cur = 0, timer = null;
  pane.innerHTML = '<div class="ls-st-main"></div><div class="ls-st-view"></div><div class="ls-about"></div><div class="ls-st-navw"></div>';
  const main = pane.querySelector('.ls-st-main'), viewEl = pane.querySelector('.ls-st-view'), navw = pane.querySelector('.ls-st-navw');
  // «Как выглядит в ABAI»: слайд презентации, открытый на действии этого шага. Синхронно в обе стороны:
  // шаг сверху → слайд переходит на его действие (меняется только якорь адреса — без перезагрузки);
  // слайд листают снизу → презентация сообщает (postMessage) слайд и действие → сверху открывается шаг этого действия.
  let sent = null, tick = 0;
  const same = (x, y) => !!x && !!y && x.mod === y.mod && x.scn === y.scn && x.idx === y.idx && x.act === y.act;
  const syncNote = (t, kind) => { const el = viewEl.querySelector('.ls-st-sync'); if (el) { el.textContent = t; el.className = 'ls-st-sync ' + (kind || ''); } };
  const showView = (P, s, fromSlide) => {
    const head = (t, sub, links) => `<div class="ls-st-vh"><b>${t}</b><span>${sub}</span>${links}</div>`;
    if (view !== 'dream') { if (!viewEl.innerHTML) viewEl.innerHTML = head('Как выглядит в ABAI', 'презентации и прототипы построены по Dream TO BE — откройте систему в виде Dream TO BE, чтобы увидеть экраны шага', ''); return; }
    // Шага нет в презентации — ближайший слайд процесса (сначала предыдущий шаг со слайдом, иначе следующий)
    const i = P.s.indexOf(s), near = s.v ? s : P.s.slice(0, i).reverse().find((x) => x.v) || P.s.slice(i + 1).find((x) => x.v);
    const proto = lsProtoHref(P, s);
    const a = (href, t) => `<a href="${href}" target="_blank">${t}</a>`;
    if (!viewEl.querySelector('.ls-st-vw')) viewEl.innerHTML = '<div class="ls-st-vw"></div><div class="ls-st-sync"></div><div class="ls-st-fw"></div>';
    viewEl.querySelector('.ls-st-vw').innerHTML = s.v
      ? head('Как выглядит в ABAI', `слайд «${s.v[2]}», действие ${s.v[3]} — экраны ролей на этом шаге`, a(lsSlideHref(P, s), 'Открыть в презентации ↗') + a(proto, 'Шаг в прототипе ↗'))
      : head('Как выглядит в ABAI', `этого шага нет в быстром сценарии презентации${near ? ` — ближайший слайд процесса: шаг ${near.c}, «${near.v[2]}»` : ''}; экран самого шага — в прототипе`, (near ? a(lsSlideHref(P, near), 'Ближайший слайд ↗') : '') + a(proto, 'Шаг в прототипе ↗'));
    const fw = viewEl.querySelector('.ls-st-fw');
    if (!near) { fw.innerHTML = ''; sent = null; syncNote(''); return; }
    syncNote(s.v ? '⇅ слайд и шаг синхронны: листайте шаги сверху или слайд снизу' : 'ближайший слайд процесса — сам шаг в презентации не показан', s.v ? 'on' : '');
    if (fromSlide) return; // слайд уже на этом действии — его и листали
    const target = { mod: P.m, scn: near.v[0], idx: near.v[1], act: near.v[3] || 1 };
    const base = `${lsModHref(P.m, 'v2')}index.html`, url = `${base}#${target.scn}/${target.idx}/all/a${target.act}/${++tick}`;
    sent = target;
    let fr = fw.querySelector('iframe');
    if (fr && fr.dataset.base === base) fr.src = url; // тот же файл — меняется только якорь
    else { fw.innerHTML = `<div class="ls-st-frame"><iframe data-base="${base}" src="${url}" title="Слайд презентации"></iframe></div>`; fr = fw.querySelector('iframe'); }
    fr.parentElement.classList.toggle('near', !s.v);
  };
  // Презентация сообщила слайд и действие: свой же переход — ничего; иначе — шаг этого действия, если в нём есть система
  const onSlide = (m) => {
    if (same(m, sent)) return;
    sent = null;
    if (!m.act || m.role !== 'all') { syncNote('на слайде карта сценария или итог — шаги сверху не меняются'); return; }
    const hit = (fr) => { const x = fr.P.s[fr.i]; return x.v && same(m, { mod: fr.P.m, scn: x.v[0], idx: x.v[1], act: x.v[3] }); };
    if (hit(frames[cur])) { syncNote('⇅ слайд и шаг синхронны: листайте шаги сверху или слайд снизу', 'on'); return; }
    const k = frames.findIndex(hit);
    if (k < 0) { syncNote(`на слайде действие ${m.act} — оно не относится к шагам BPMN, где указана «${key}»; шаг сверху не меняется`, 'off'); return; }
    if (timer) stopPlay();
    go(k, true);
  };
  const kindOf = (name) => { const a = lsAnchor(grid, lsKey(name)); return a && a.classList.contains('ls-chip') ? (a.className.match(/k-(\w+)/) || [])[1] : name === 'MS Office' ? 'manual' : 'ext'; };
  const short = (n) => n.replace(/^(ABAI|SLB)\s+/, '');
  const stepCard = (P, x, dir) => {
    if (typeof x[0] !== 'number') return `<div class="ls-sn ev" data-a="seq"><i>${dir}</i><em>${x[0]}</em></div>`;
    const s = P.s[x[0]];
    return `<div class="ls-sn step" data-a="seq"><i>${dir} · шаг BPMN</i><div><b>${s.c || '—'}</b> ${s.t}</div><span class="ls-sn-r">${lsRole(s)}</span>${s.s.length ? `<div class="ls-sn-s">${sysChips(s.s)}</div>` : ''}${x[1] ? `<q>${x[1]}</q>` : ''}</div>`;
  };
  const flowCard = (e, inn) => `<div class="ls-sn sys k-${kindOf(inn ? e.f : e.t)}" data-a="${e.k}"><i>${inn ? 'передаёт данные' : 'получает данные'} · связь на схеме</i><b>${inn ? e.f : e.t}</b><span>${e.w}</span><em>${LS_KINDS[e.k]}</em></div>`;
  const mark = (s, mk) => {
    grid.querySelectorAll('.ep').forEach((x) => x.classList.remove('ep'));
    grid.classList.add('fl-on');
    s.s.map(lsKey).concat(mk.flatMap((e) => [e.f, e.t])).forEach((k) => { const a = lsAnchor(grid, k); if (a) a.classList.add('ep'); });
  };
  const render = (fromSlide) => {
    const f = frames[cur], P = f.P, s = P.s[f.i];
    const mk = marks.get(P.p + ' ' + s.c) || [];
    const inF = mk.filter((e) => e.t === key), outF = mk.filter((e) => e.f === key);
    // Аннотации — к системе, которую они называют («…берётся из БД 2.0»); остальные — под шагом
    const notesOf = new Map(s.s.map((x) => [x, []])), rest = [];
    s.n.forEach((n) => { const hit = s.s.find((x) => n.includes(x) || n.includes(short(x))); if (hit) notesOf.get(hit).push(n); else rest.push(n); });
    const bot = s.pv.map((x) => stepCard(P, x, 'до')).concat(inF.map((e) => flowCard(e, true)));
    const top = s.nx.map((x) => stepCard(P, x, 'после')).concat(outF.map((e) => flowCard(e, false)));
    // Полоса прогресса: процессы и шаги системы в них
    const strip = [];
    frames.forEach((fr, k) => { if (!k || frames[k - 1].P !== fr.P) strip.push({ P: fr.P, ks: [] }); strip[strip.length - 1].ks.push(k); });
    main.innerHTML = `
      <div class="ls-st-strip">${strip.map(({ P: Q, ks }) => `<div class="${Q === P ? 'on' : ''}" title="${Q.p} · ${Q.t}"><span>${Q.p}</span><div>${ks.map((k) => `<button data-go="${k}" class="${k < cur ? 'done' : k === cur ? 'cur' : ''}" title="${Q.s[frames[k].i].c} ${Q.s[frames[k].i].t}"></button>`).join('')}</div></div>`).join('')}</div>
      <div class="ls-st-h"><span>${LS_MOD_NAME[P.m]} · <b>${P.p}</b> ${P.t}</span><em>шаг ${cur + 1} из ${frames.length}</em></div>
      <div class="ls-st-c">
        <div class="ls-st-row">${top.length ? top.join('') : '<div class="ls-sn ev"><em>конец процесса</em></div>'}</div>
        <div class="ls-scur">
          <div class="ls-scur-r">${lsRole(s)}</div>
          <div class="ls-scur-t"><b>${s.c || 'без номера'}</b>${s.t}</div>
          <div class="ls-scur-s">${s.s.map((x) => `<div class="ls-ssys k-${kindOf(x)}${lsKey(x) === key ? ' me' : ''}"><b>${x}</b>${notesOf.get(x).map((n) => `<q>${n}</q>`).join('')}</div>`).join('')}</div>
          ${s.d.length ? `<div class="ls-scur-d"><i>документы</i>${s.d.join('; ')}</div>` : ''}
          ${rest.map((n) => `<q>${n}</q>`).join('')}
          ${mk.length ? '' : '<div class="ls-scur-n">в потоках данных на схеме этот шаг не показан — данные между системами по BPMN</div>'}
        </div>
        <div class="ls-st-row">${bot.length ? bot.join('') : '<div class="ls-sn ev"><em>начало процесса</em></div>'}</div>
        <svg class="ls-st-svg"></svg>
      </div>
      <div class="ls-st-lg"><span class="seq">порядок шагов BPMN</span>${[...new Set(mk.map((e) => e.k))].map((k) => `<span class="k-${k}">${LS_KINDS[k]}</span>`).join('')}</div>`;
    navw.innerHTML = `
      <div class="ls-st-nav"><button data-nav="-1" ${cur ? '' : 'disabled'}>◀ Назад</button><button data-nav="play" class="play">${timer ? '❚❚ Пауза' : '▶ Проиграть'}</button><button data-nav="1" ${cur < frames.length - 1 ? '' : 'disabled'}>Далее ▶</button><span>← → на клавиатуре</span></div>`;
    // Стрелки: снизу — в шаг, из шага — вверх; у каждой карточки своя вертикальная стрелка
    const c = pane.querySelector('.ls-st-c'), svg = pane.querySelector('.ls-st-svg'), mid = pane.querySelector('.ls-scur');
    const cb = c.getBoundingClientRect(), m = mid.getBoundingClientRect();
    const [rowT, rowB] = pane.querySelectorAll('.ls-st-row');
    let d = '';
    const arrow = (el, up) => {
      const r = el.getBoundingClientRect(), cx = r.left + r.width / 2;
      const x = Math.max(m.left + 16, Math.min(m.right - 16, cx)) - cb.left;
      const k = el.dataset.a || 'seq';
      d += up === 'in' ? `<path class="k-${k}" d="M${cx - cb.left},${r.top - cb.top} C${cx - cb.left},${r.top - cb.top - 24} ${x},${m.bottom - cb.top + 24} ${x},${m.bottom - cb.top}" marker-end="url(#lssA-${k})"/>`
        : `<path class="k-${k}" d="M${x},${m.top - cb.top} C${x},${m.top - cb.top - 24} ${cx - cb.left},${r.bottom - cb.top + 24} ${cx - cb.left},${r.bottom - cb.top}" marker-end="url(#lssA-${k})"/>`;
    };
    rowB.querySelectorAll('.ls-sn[data-a]').forEach((el) => arrow(el, 'in'));
    rowT.querySelectorAll('.ls-sn[data-a]').forEach((el) => arrow(el, 'out'));
    const mkr = (k, col) => `<marker id="lssA-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${col}"/></marker>`;
    svg.setAttribute('width', c.scrollWidth); svg.setAttribute('height', c.scrollHeight);
    svg.innerHTML = `<defs>${mkr('seq', '#8a93a6')}${mkr('auto', '#2a78d6')}${mkr('input', '#0f7a55')}${mkr('manual', '#c2413a')}${mkr('int', '#d08a1e')}${mkr('pub', '#0e7490')}</defs>${d}`;
    pane.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => go(+b.dataset.go)));
    pane.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => (b.dataset.nav === 'play' ? play() : step(+b.dataset.nav))));
    mark(s, mk);
    showView(P, s, fromSlide);
  };
  const go = (k, fromSlide) => { cur = Math.max(0, Math.min(frames.length - 1, k)); render(fromSlide); pane.querySelector('.ls-st-c').classList.add('enter'); if (onFrame) onFrame(cur); };
  const step = (dk) => { if (timer && dk) stopPlay(); go(cur + dk); };
  const stopPlay = () => { clearInterval(timer); timer = null; };
  const play = () => {
    if (timer) { stopPlay(); render(); return; }
    if (cur >= frames.length - 1) cur = -1;
    timer = setInterval(() => { if (cur >= frames.length - 1) { stopPlay(); render(); return; } go(cur + 1); }, 3500);
    go(cur + 1);
  };
  const open = (k) => { LS_STORY = { step, stop: stopPlay }; LS_SLIDE_SYNC = onSlide; go(k); };
  const close = () => { stopPlay(); if (LS_STORY && LS_STORY.step === step) LS_STORY = null; if (LS_SLIDE_SYNC === onSlide) LS_SLIDE_SYNC = null; };
  return { open, close };
}

// Ось слева от вертикальной схемы: схема читается снизу вверх — внизу откуда данные приходят, вверху куда уходят
function lsRail(el) {
  if (!el || el.querySelector(':scope > .ls-rail')) return;
  el.classList.add('ls-railed');
  el.insertAdjacentHTML('afterbegin', '<div class="ls-rail" title="Схема читается снизу вверх: внизу — откуда данные приходят, вверху — куда уходят"><span>куда</span><i></i><span>откуда</span></div>');
}

// ---------- Компактная схема сценария: только участвующие системы, снизу вверх по направлению потока (как на большой схеме) ----------
// Группа системы на компактной схеме: в какой ЦД / слой она входит на большой схеме
// Текст заголовка без номера этапа, значка «что это?» и подписи источника
const lsHText = (h) => [...h.childNodes].filter((n) => !(n.nodeType === 1 && n.matches('.ls-stage, .ls-hq-i, .ls-src'))).map((n) => n.textContent).join('').trim();
function lsGroup(el, view) {
  if (!el) return { key: 'other', title: 'Прочее', type: 'eng' };
  const box = el.closest('.ls-box'), boxT = box && box.querySelector('.ls-box-h') ? lsHText(box.querySelector('.ls-box-h')) : '';
  if (el.closest('.ls-box.users')) return { key: 'users', title: 'Пользователи и уровни управления', type: 'users' };
  if (el.closest('.ls-box.ext')) return { key: 'ext', title: 'Внешние системы', type: 'ext' };
  if (el.closest('.ls-twin')) {
    if (el.closest('.ls-note') && el.classList.contains('k-abai')) return { key: 'abai-bpmn', title: 'ИС ABAI (по BPMN TO BE Nedra)', type: 'cd' };
    const t = lsHText(el.closest('.ls-twin').querySelector('.ls-twin-h'));
    return { key: t, title: t, type: 'cd' };
  }
  if (el.closest('.ls-box.plat')) return { key: 'plat', title: view === 'dream' ? 'ЦД актива — единая база' : boxT, type: 'cd' };
  if (el.closest('.ls-zone.data')) {
    if (view === 'asis') return { key: boxT, title: boxT, type: 'data' };
    return { key: 'data', title: view === 'nedra' ? 'Слой данных — КХД + NDP' : 'Слой данных — КХД', type: 'data' };
  }
  if (el.closest('.ls-manual')) return { key: 'manual', title: 'Ручной обмен: файлы, почта, чат', type: 'manual' };
  if (el.closest('.ls-zone.asis')) return { key: boxT, title: boxT, type: el.classList.contains('k-abai') ? 'cd' : 'eng' };
  if (el.closest('.ls-box.prod')) return { key: 'prod', title: 'Производственные системы ДЗО', type: 'prod' };
  if (el.closest('.ls-box.asu')) return { key: 'asu', title: 'Данные с датчиков / АСУ ТП', type: 'asu' };
  if (el.closest('.ls-box.mes') || el.closest('.ls-box.warn')) return { key: 'mes', title: boxT, type: 'mes' };
  if (el.closest('.ls-zone.dzo')) {
    const eng = /Инженерное/.test(boxT);
    return { key: boxT, title: eng ? 'Инженерное ПО на рабочих местах' : boxT, type: eng ? 'eng' : 'asu' };
  }
  const mod = el.closest('.ls-mod');
  if (mod) { const t = 'Процесс: ' + mod.querySelector('.ls-mod-h b').textContent; return { key: t, title: t, type: 'eng' }; }
  return { key: 'other', title: 'Прочее', type: 'eng' };
}

// Ряды по направлению потока: порядок с минимумом обратных связей (эвристика Идса — Лина — Смита),
// затем ранг = самый длинный путь без обратных связей. outOf может возвращать узел несколько раз (вес связи).
function lsRanks(list, outOf) {
  const out = new Map(list.map((n) => [n, outOf(n).filter((m) => m !== n && list.includes(m))]));
  const inn = new Map(list.map((n) => [n, []]));
  list.forEach((n) => out.get(n).forEach((m) => inn.get(m).push(n)));
  const left = [], right = [], rest = new Set(list);
  const deg = (n, map) => map.get(n).filter((m) => rest.has(m)).length;
  while (rest.size) {
    let moved = true;
    while (moved) {
      moved = false;
      [...rest].forEach((n) => { if (rest.has(n) && !deg(n, out)) { right.unshift(n); rest.delete(n); moved = true; } });
      [...rest].forEach((n) => { if (rest.has(n) && !deg(n, inn)) { left.push(n); rest.delete(n); moved = true; } });
    }
    if (rest.size) { const u = [...rest].sort((p, q) => (deg(q, out) - deg(q, inn)) - (deg(p, out) - deg(p, inn)))[0]; left.push(u); rest.delete(u); }
  }
  const pos = new Map(left.concat(right).map((n, i) => [n, i]));
  const rank = new Map();
  left.concat(right).forEach((n) => rank.set(n, Math.max(0, ...inn.get(n).filter((m) => pos.get(m) < pos.get(n)).map((m) => rank.get(m) + 1))));
  return rank;
}

function lsFocus(host, grid, edges, view, o = {}) {
  if (!edges.length) { host.innerHTML = ''; return; }
  // ---- Узлы и группы ----
  const nodes = new Map();
  const node = (k) => {
    if (!nodes.has(k)) {
      const el = lsAnchor(grid, k);
      const kind = el && el.classList.contains('ls-chip') ? (el.className.match(/k-(\w+)/) || [])[1] : 'user';
      nodes.set(k, { id: k, k, kind: kind || 'ext', g: lsGroup(el, view), out: [], inn: [] });
    }
    return nodes.get(k);
  };
  const items = edges.map((e, i) => { const a = node(e.f), b = node(e.t); a.out.push(b); b.inn.push(a); return { e, i, a, b }; });
  // Пользователи, внешние системы, АСУ ТП: если в группе есть и чистые источники, и чистые получатели — две рамки
  // («кто передаёт» снизу, «кто получает» сверху). Рамка ЦД всегда одна.
  const byKey = {};
  nodes.forEach((n) => (byKey[n.g.key] = byKey[n.g.key] || []).push(n));
  Object.values(byKey).forEach((list) => {
    const intra = list.some((n) => n.out.some((m) => list.includes(m)));
    const src = list.filter((n) => !n.inn.length), snk = list.filter((n) => !n.out.length);
    if (list[0].g.type !== 'cd' && !intra && src.length && snk.length && src.length + snk.length === list.length) snk.forEach((n) => { n.g = Object.assign({}, n.g, { key: n.g.key + '#out' }); });
  });
  const groups = new Map();
  nodes.forEach((n) => { if (!groups.has(n.g.key)) groups.set(n.g.key, { id: n.g.key, ...n.g, nodes: [], out: [] }); groups.get(n.g.key).nodes.push(n); n.G = groups.get(n.g.key); });
  items.forEach((it) => { if (it.a.G !== it.b.G) it.a.G.out.push(it.b.G); });
  const gRank = lsRanks([...groups.values()], (g) => g.out);
  // Внутри группы — подряды по направлению связей внутри неё
  groups.forEach((g) => {
    const r = lsRanks(g.nodes, (n) => n.out.filter((m) => m.G === g));
    g.nodes.forEach((n) => { n.sub = r.get(n); });
    g.subs = Math.max(...g.nodes.map((n) => n.sub)) + 1;
    g.rowsOf = Array.from({ length: g.subs }, (_, s) => g.nodes.filter((n) => n.sub === s));
  });
  // ---- Вертикальная раскладка: ряды снизу вверх по ходу данных (источники внизу), группы ряда — рядом ----
  const NW = 172, NH = 34, HG = 22, IGV = 74, P = 12, HDR = 24, GG = 30, GAPV = 96;
  groups.forEach((g) => {
    g.cmax = Math.max(...g.rowsOf.map((r) => r.length));
    g.w = Math.max(g.cmax * NW + (g.cmax - 1) * HG + 2 * P, Math.min(320, 40 + g.title.length * 6.6));
    g.h = HDR + g.subs * NH + (g.subs - 1) * IGV + 2 * P;
  });
  const R = Math.max(...[...gRank.values()]) + 1;
  const rows = Array.from({ length: R }, (_, r) => [...groups.values()].filter((g) => gRank.get(g) === r));
  // Порядок групп в ряду и систем в группе — по соседям (меньше пересечений)
  const xOf = (n) => (n.G.cx || 0) + (n.x1 || 0);
  rows.forEach((list) => list.forEach((g, i) => { g.cx = i * 400; g.rowsOf.forEach((rw) => rw.forEach((n, j) => (n.x1 = j * 100))); }));
  for (let it = 0; it < 6; it++) {
    rows.forEach((list) => {
      list.forEach((g) => { const nb = items.filter((x) => (x.a.G === g) !== (x.b.G === g)).map((x) => (x.a.G === g ? x.b : x.a)); g.bc = nb.length ? nb.reduce((s, n) => s + xOf(n), 0) / nb.length : g.cx; });
      list.sort((a, b) => a.bc - b.bc).forEach((g, i) => (g.cx = i * 400));
    });
    groups.forEach((g) => g.rowsOf.forEach((rw) => {
      rw.forEach((n) => { const nb = n.out.concat(n.inn); n.bc = nb.length ? nb.reduce((s, m) => s + xOf(m), 0) / nb.length : n.x1; });
      rw.sort((a, b) => a.bc - b.bc).forEach((n, i) => (n.x1 = i * 100));
    }));
  }
  const rowW = rows.map((list) => list.reduce((s, g) => s + g.w, 0) + (list.length - 1) * GG);
  const rowH = rows.map((list) => Math.max(...list.map((g) => g.h)));
  const W0 = Math.max(...rowW, 600);
  let y = 0;
  const rowY = [];
  rows.slice().reverse().forEach((list) => {
    const r = rows.indexOf(list);
    rowY[r] = y;
    let x = (W0 - rowW[r]) / 2;
    list.forEach((g) => {
      g.x = x; g.y = y + (rowH[r] - g.h) / 2; x += g.w + GG;
      g.rowsOf.forEach((rw, s) => {
        const span = rw.length * NW + (rw.length - 1) * HG, off = (g.w - span) / 2;
        rw.forEach((n, i) => { n.x = g.x + off + i * (NW + HG); n.y0 = g.y + HDR + P + (g.subs - 1 - s) * (NH + IGV); });
      });
    });
    y += rowH[r] + GAPV;
  });
  const H0 = y - GAPV;
  // ---- Стрелки: по ходу данных — вверх, обратные — вниз; мимо чужих блоков ----
  const ord = (n) => gRank.get(n.G) * 100 + n.sub;
  items.forEach((it) => {
    it.back = ord(it.b) <= ord(it.a);
    const same = ord(it.b) === ord(it.a); // в одном ряду — дугой справа
    it.sa = same ? 'r' : it.back ? 'b' : 't'; it.sb = same ? 'r' : it.back ? 't' : 'b'; it.same = same;
  });
  const ports = new Map();
  const add = (n, side, it, other) => { const k = n.k + '|' + side; if (!ports.has(k)) ports.set(k, []); ports.get(k).push({ it, other, n, side }); };
  items.forEach((it) => { add(it.a, it.sa, it, it.sa === 'r' ? it.b.y0 : it.b.x); add(it.b, it.sb, it, it.sb === 'r' ? it.a.y0 : it.a.x); });
  ports.forEach((list) => {
    list.sort((p, q) => p.other - q.other);
    list.forEach((p, j) => {
      const d = list.length > 1 ? j - (list.length - 1) / 2 : 0;
      const pt = p.side === 'r' ? [p.n.x + NW, p.n.y0 + NH / 2 + d * Math.min(8, (NH - 8) / list.length)] : [p.n.x + NW / 2 + d * Math.min(28, (NW - 30) / list.length), p.side === 'b' ? p.n.y0 + NH : p.n.y0];
      if (p.it.a === p.n && p.it.sa === p.side && !p.it.p0) p.it.p0 = pt; else p.it.p1 = pt;
    });
  });
  const obst = [...nodes.values()].map((n) => ({ l: n.x - 4, t: n.y0 - 4, r: n.x + NW + 4, b: n.y0 + NH + 4 }))
    .concat([...groups.values()].map((g) => ({ l: g.x, t: g.y, r: g.x + Math.min(g.w, 30 + g.title.length * 6.4), b: g.y + HDR })));
  const bez = (a, c1, c2, b) => Array.from({ length: 21 }, (_, j) => { const t = j / 20, u = 1 - t; return [u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]]; });
  const maxR = Math.max(...[...groups.values()].map((g) => g.x + g.w));
  const placed = [], lanes = {};
  let paths = '', labels = '', backN = 0;
  items.forEach((it) => {
    const [x0, y0] = it.p0, [x1, y1] = it.p1;
    let d, pts;
    if (it.same) {
      backN++; const rx = maxR + 26 + backN * 20;
      d = `M${x0},${y0} C${rx},${y0} ${rx},${y1} ${x1},${y1}`; pts = bez([x0, y0], [rx, y0], [rx, y1], [x1, y1]);
    } else {
      const sg = it.back ? 1 : -1; // направление по вертикали: по ходу данных — вверх
      const dy = sg * Math.max(36, Math.abs(y1 - y0) * 0.45);
      const straight = bez([x0, y0], [x0, y0 + dy], [x1, y1 - dy], [x1, y1]);
      const rects = [...nodes.values()].filter((n) => n !== it.a && n !== it.b).map((n) => ({ l: n.x - 6, t: n.y0 - 6, r: n.x + NW + 6, b: n.y0 + NH + 6 }))
        .concat([...groups.values()].filter((g) => g !== it.a.G && g !== it.b.G).map((g) => ({ l: g.x - 4, t: g.y - 4, r: g.x + g.w + 4, b: g.y + g.h + 4 })));
      const hits = rects.filter((q) => straight.some(([px, py]) => px > q.l && px < q.r && py > q.t && py < q.b));
      // Участок обхода [ya → yb] по ходу стрелки
      const ya = !hits.length ? 0 : sg > 0 ? Math.max(y0 + 22, Math.min(...hits.map((q) => q.t)) - 16) : Math.min(y0 - 22, Math.max(...hits.map((q) => q.b)) + 16);
      const yb = !hits.length ? 0 : sg > 0 ? Math.min(y1 - 22, Math.max(...hits.map((q) => q.b)) + 16) : Math.max(y1 + 22, Math.min(...hits.map((q) => q.t)) - 16);
      if (hits.length && (yb - ya) * sg > 0) {
        // Обход: слева, справа или в просвете между препятствиями на этом участке
        const block = rects.filter((q) => q.b > Math.min(ya, yb) && q.t < Math.max(ya, yb)).map((q) => [q.l, q.r]).sort((p, q) => p[0] - q[0]);
        const lo = Math.min(...block.map((q) => q[0])), hi = Math.max(...block.map((q) => q[1]));
        const cand = [lo - 16, hi + 16];
        let cur = block[0][1];
        block.slice(1).forEach(([l, r]) => { if (l - cur >= 26) cand.push((l + cur) / 2); cur = Math.max(cur, r); });
        const want = (x0 + x1) / 2;
        let wx = cand.sort((p, q) => Math.abs(p - want) - Math.abs(q - want))[0];
        const key = Math.round(ya) + ':' + Math.round(wx);
        lanes[key] = (lanes[key] || 0) + 1; wx += (lanes[key] - 1) * (wx <= lo ? -14 : 14);
        const dya = sg * Math.max(20, Math.abs(ya - y0) * 0.5), dyb = sg * Math.max(20, Math.abs(y1 - yb) * 0.5);
        d = `M${x0},${y0} C${x0},${y0 + dya} ${wx},${ya - dya} ${wx},${ya} L${wx},${yb} C${wx},${yb + dyb} ${x1},${y1 - dyb} ${x1},${y1}`;
        pts = Array.from({ length: 21 }, (_, j) => [wx, ya + ((yb - ya) * j) / 20]).concat(bez([x0, y0], [x0, y0 + dya], [wx, ya - dya], [wx, ya]), bez([wx, yb], [wx, yb + dyb], [x1, y1 - dyb], [x1, y1]));
      } else {
        d = `M${x0},${y0} C${x0},${y0 + dy} ${x1},${y1 - dy} ${x1},${y1}`; pts = straight;
      }
    }
    const cls = `k-${it.e.k}${o.hot === it.i ? ' hot' : ''}${o.hot !== undefined && o.hot !== it.i ? ' dim' : ''}`;
    paths += `<path d="${d}" class="${cls}" marker-end="url(#lsfArr-${it.e.k})"/>`;
    // Подпись: на линии, при наложении — со сдвигом вбок
    const lw = Math.min(210, Math.max(110, 30 + it.e.w.length * 5.6));
    const lines = Math.max(1, Math.ceil((it.e.w.length * 6.2) / (lw - 30))), lh = (o._h && o._h[it.i]) || 8 + lines * 14;
    const ov = (r, q) => Math.max(0, Math.min(r.r, q.r) - Math.max(r.l, q.l)) * Math.max(0, Math.min(r.b, q.b) - Math.max(r.t, q.t));
    const order = pts.map((q, j) => [q, j]).sort((p, q) => Math.abs(p[1] - 10) - Math.abs(q[1] - 10)).slice(0, 15);
    let pos = null, best = Infinity;
    for (const dx of [0, lw / 2 + 12, -(lw / 2 + 12), lw + 20, -(lw + 20)]) {
      for (const [[px0, py], j] of order) {
        const px = px0 + dx, r = { l: px - lw / 2, t: py - lh / 2, r: px + lw / 2, b: py + lh / 2 };
        const score = obst.reduce((sum, q) => sum + 3 * ov(r, q), 0) + placed.reduce((sum, q) => sum + 2 * ov(r, q), 0) + Math.abs(dx) * 0.25 + Math.abs(j - 10) * 2;
        if (score < best) { best = score; pos = r; }
      }
      if (best < 60) break;
    }
    placed.push({ l: pos.l - 3, t: pos.t - 3, r: pos.r + 3, b: pos.b + 3 });
    labels += `<div class="ls-fl ${cls}" style="left:${pos.l}px;top:${pos.t}px;width:${lw}px" title="${it.e.f} → ${it.e.t} · ${it.e.r}">${it.e.n ? `<b>${it.e.n}</b>` : ''}${it.e.w}</div>`;
  });
  const all = [...groups.values()].map((g) => ({ l: g.x, t: g.y, r: g.x + g.w, b: g.y + g.h })).concat(placed, [{ l: 0, t: 0, r: maxR + 30 + backN * 20, b: H0 }]);
  const minX = Math.min(...all.map((q) => q.l)), minY = Math.min(...all.map((q) => q.t)), maxX = Math.max(...all.map((q) => q.r)), maxY = Math.max(...all.map((q) => q.b));
  const sh = -minX + 2, sv = -minY + 2, CW = maxX - minX + 4, CH = maxY - minY + 4;
  const mk = (k, c) => `<marker id="lsfArr-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${c}"/></marker>`;
  host.innerHTML = `<div class="ls-fcanvas v-${view}" style="width:${CW}px;height:${CH}px">
    ${[...groups.values()].map((g) => `<div class="ls-fgrp g-${g.type}" style="left:${g.x + sh}px;top:${g.y + sv}px;width:${g.w}px;height:${g.h}px"><span>${g.title}</span></div>`).join('')}
    <svg width="${CW}" height="${CH}"><defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}${mk('pub', '#0e7490')}</defs><g transform="translate(${sh},${sv})">${paths}</g></svg>
    ${[...nodes.values()].map((n) => `<div class="ls-fnode k-${n.kind}" style="left:${n.x + sh}px;top:${n.y0 + sv}px;width:${NW}px;height:${NH}px"><b>${n.k}</b></div>`).join('')}
    <div class="ls-flbls" style="transform:translate(${sh}px,${sv}px)">${labels}</div>
  </div>`;
  // Второй проход: раскладка подписей по их реальной высоте
  if (!o._h) lsFocus(host, grid, edges, view, Object.assign({}, o, { _h: [...host.querySelectorAll('.ls-fl')].map((x) => x.offsetHeight) }));
  else lsRail(host);
}

// ---------- Всплывающая схема связей одной системы ----------
// Система — широкая полоса посередине; кто передаёт ей данные — снизу, кому передаёт она — сверху (снизу вверх, как большая схема).
// Каждая связь — прямая вертикальная стрелка под своей системой, подпись — на стрелке; двусторонняя связь — две стрелки рядом.
const LS_ROW_ORDER = ['users', 'eng', 'cd', 'data', 'manual', 'ext', 'prod', 'mes', 'asu'];
function lsBus(host, grid, key, list, view, o = {}) {
  const info = (k) => {
    const el = lsAnchor(grid, k);
    const kind = el && el.classList.contains('ls-chip') ? (el.className.match(/k-(\w+)/) || [])[1] : 'user';
    return { k, kind: kind || 'ext', g: lsGroup(el, view) };
  };
  const me = info(key);
  const peers = new Map();
  list.forEach((e) => {
    const k = e.f === key ? e.t : e.f;
    if (!peers.has(k)) peers.set(k, Object.assign(info(k), { inn: null, out: null }));
    peers.get(k)[e.t === key ? 'inn' : 'out'] = e;
  });
  // Рамки: ЦД — всегда одна; в остальных источники и получатели расходятся в две рамки (снизу и сверху)
  const groups = new Map();
  peers.forEach((p) => {
    const gk = p.g.type === 'cd' || (p.inn && p.out) ? p.g.key : p.g.key + (p.out ? '#up' : '#down');
    if (!groups.has(gk)) groups.set(gk, Object.assign({}, p.g, { nodes: [] }));
    groups.get(gk).nodes.push(p);
  });
  const gl = [...groups.values()];
  gl.forEach((g) => { g.side = g.nodes.every((p) => !p.out) ? 'down' : g.nodes.every((p) => !p.inn) ? 'up' : null; });
  // Рамки с двусторонними связями — на ту сторону, где систем меньше
  const cnt = { up: 0, down: 0 };
  gl.filter((g) => g.side).forEach((g) => (cnt[g.side] += g.nodes.length));
  gl.filter((g) => !g.side).sort((a, b) => b.nodes.length - a.nodes.length).forEach((g) => { g.side = cnt.up <= cnt.down ? 'up' : 'down'; cnt[g.side] += g.nodes.length; });
  gl.forEach((g) => g.nodes.forEach((p) => (p.side = g.side)));
  const ordOf = (g) => { const i = LS_ROW_ORDER.indexOf(g.type); return i < 0 ? 9 : i; };
  // ---- Раскладка ----
  // В подробном режиме колонки шире: в подписи — шаги BPMN связи
  const NW = o.full ? 300 : 156, NH = 42, CG = 18, P = 10, HDR = 22, GG = 18, BH = 58, LW = NW + CG - 6, M = 20;
  const FH = HDR + P + NH + P;
  const row = (side) => gl.filter((g) => g.side === side).sort((a, b) => ordOf(a) - ordOf(b));
  const place = (gs) => {
    let x = 0;
    gs.forEach((g) => {
      const nw = g.nodes.length * NW + (g.nodes.length - 1) * CG;
      g.w = Math.max(nw + 2 * P, Math.min(330, 30 + g.title.length * 7.4));
      g.x = x;
      g.nodes.forEach((p, i) => (p.x = x + (g.w - nw) / 2 + i * (NW + CG)));
      x += g.w + GG;
    });
    return Math.max(0, x - GG);
  };
  const up = row('up'), down = row('down');
  const wU = place(up), wD = place(down), W = Math.max(wU, wD, 460);
  [[up, wU], [down, wD]].forEach(([gs, w]) => gs.forEach((g) => { g.x += (W - w) / 2; g.nodes.forEach((p) => (p.x += (W - w) / 2)); }));
  // Подписи: на стрелке, в промежутке между системой и полосой; высота — оценка, во втором проходе — по факту
  const items = [];
  peers.forEach((p) => {
    const isUp = p.side === 'up';
    // Стрелки по экрану: «↑» — данные идут вверх, «↓» — вниз
    [p.inn, p.out].filter(Boolean).forEach((e) => items.push({ p, e, upArrow: isUp === (e === p.out), isUp }));
  });
  items.forEach((it, i) => {
    it.i = i;
    const txt = it.e.w.length + it.e.r.length * 0.85;
    it.h = (o._h && o._h[i]) || 10 + Math.ceil((txt * 6.1) / (LW - 34)) * 14;
  });
  const stackH = (side) => Math.max(0, ...[...peers.values()].filter((p) => p.side === side).map((p) => items.filter((it) => it.p === p).reduce((s, it) => s + it.h, 0) + 6 * (items.filter((it) => it.p === p).length - 1)));
  const gapU = Math.max(64, stackH('up') + 2 * M), gapD = Math.max(64, stackH('down') + 2 * M);
  const yBus = (up.length ? FH : 0) + (up.length ? gapU : 0), yDown = yBus + BH + gapD;
  up.forEach((g) => { g.y = 0; g.nodes.forEach((p) => (p.y0 = HDR + P)); });
  down.forEach((g) => { g.y = yDown; g.nodes.forEach((p) => (p.y0 = yDown + HDR + P)); });
  const H = down.length ? yDown + FH : yBus + BH;
  // ---- Стрелки и подписи ----
  let paths = '', labels = '';
  peers.forEach((p) => {
    const its = items.filter((it) => it.p === p);
    const cx = p.x + NW / 2;
    const isUp = its[0].isUp;
    // Две стрелки: «вверх» — левее, «вниз» — правее; подписи стопкой в том же порядке
    its.sort((a, b) => (b.upArrow ? 1 : 0) - (a.upArrow ? 1 : 0));
    const total = its.reduce((s, it) => s + it.h, 0) + 6 * (its.length - 1);
    const g0 = isUp ? FH - P : yBus + BH, g1 = isUp ? yBus : yDown + P;
    let ty = (g0 + g1) / 2 - total / 2;
    its.forEach((it, j) => {
      const x = its.length > 1 ? cx + (j ? 14 : -14) : cx;
      const yNode = isUp ? p.y0 + NH : p.y0, yB = isUp ? yBus : yBus + BH;
      const [y0, y1] = (it.e === p.out) ? [yB, yNode] : [yNode, yB];
      paths += `<path d="M${x},${y0} L${x},${y1}" class="k-${it.e.k}" marker-end="url(#lsbArr-${it.e.k})"/>`;
      labels += `<div class="ls-fl k-${it.e.k}" data-i="${it.i}" style="left:${cx - LW / 2}px;top:${ty}px;width:${LW}px"><b>${it.upArrow ? '↑' : '↓'}</b><span>${o.full ? `<strong>${it.e.w}</strong><em>${it.e.f} → ${it.e.t}</em>${lsDetail(it.e, view)}` : `${it.e.w}${(() => { const who = lsWho(it.e, view); return who ? `<i class="ls-who">кто: ${who}</i>` : ''; })()}<em>${it.e.r}</em>`}</span></div>`;
      ty += it.h + 6;
    });
  });
  const mk = (k, c) => `<marker id="lsbArr-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${c}"/></marker>`;
  const nIn = list.filter((e) => e.t === key).length, nOut = list.length - nIn;
  host.innerHTML = `<div class="ls-fcanvas v-${view}" style="width:${W}px;height:${H}px">
    ${gl.map((g) => `<div class="ls-fgrp g-${g.type}" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${FH}px"><span>${g.title}</span></div>`).join('')}
    <svg width="${W}" height="${H}"><defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}${mk('pub', '#0e7490')}</defs>${paths}</svg>
    <div class="ls-fnode ls-bus k-${me.kind}" style="left:0;top:${yBus}px;width:${W}px;height:${BH}px"><span>${me.g.title}</span><b>${key}</b><span>${[nIn ? `получает: ${nIn}` : '', nOut ? `передаёт: ${nOut}` : ''].filter(Boolean).join(' · ')}</span></div>
    ${[...peers.values()].map((p) => `<div class="ls-fnode k-${p.kind}" style="left:${p.x}px;top:${p.y0}px;width:${NW}px;height:${NH}px"><b>${p.k}</b></div>`).join('')}
    <div class="ls-flbls">${labels}</div>
  </div>`;
  // Второй проход: подписи по их реальной высоте
  if (!o._h) {
    const h = [];
    host.querySelectorAll('.ls-fl[data-i]').forEach((x) => (h[+x.dataset.i] = x.offsetHeight));
    lsBus(host, grid, key, list, view, Object.assign({}, o, { _h: h }));
  } else lsRail(host);
}

// ---------- Вся сеть: все системы и связи вида на одной схеме ----------
// Ряды — как на большой схеме, снизу вверх: АСУ ТП → промысловые, производственные системы и инженерное ПО → слой данных и внешние →
// модули ЦД → ЦД актива и ручной обмен → пользователи. Стрелки ортогональные: от системы в коридор между рядами, по своей дорожке,
// между рамками — по свободному вертикальному коридору. На стрелке — номер связи, описание — в списке под схемой.
function lsNetRow(el) {
  if (!el) return 3;
  if (el.closest('.ls-box.users')) return 5;
  if (el.closest('.ls-box.plat') || el.closest('.ls-manual')) return 4;
  if (el.closest('.ls-zone.cz') || el.closest('.ls-zone.asis:not(.data)') || el.closest('.ls-mod')) return 3;
  if (el.closest('.ls-zone.data') || el.closest('.ls-box.ext')) return 2;
  if (el.closest('.ls-box.asu')) return 0;
  return 1;
}
function lsNet(host, grid, edges, view, o = {}) {
  if (!edges.length) { host.innerHTML = ''; return; }
  const NH = 38, P = 9, HDR = 22, HG = 12, GG = 40, CM = 14, TS = 8, BR = 9;
  const FH = HDR + P + NH + P;
  // ---- Узлы, рамки, ряды ----
  const nodes = new Map();
  const node = (k) => {
    if (!nodes.has(k)) {
      const el = lsAnchor(grid, k);
      const kind = el && el.classList.contains('ls-chip') ? (el.className.match(/k-(\w+)/) || [])[1] : 'user';
      nodes.set(k, { k, kind: kind || 'ext', g: lsGroup(el, view), row: lsNetRow(el), w: Math.round(Math.min(150, Math.max(92, 22 + k.length * 6.4))), e: [] });
    }
    return nodes.get(k);
  };
  const items = edges.map((e, i) => { const a = node(e.f), b = node(e.t); const it = { e, i, a, b }; a.e.push(it); b.e.push(it); return it; });
  const groups = new Map();
  nodes.forEach((n) => {
    const gk = n.row + '|' + n.g.key;
    if (!groups.has(gk)) groups.set(gk, Object.assign({}, n.g, { id: gk, row: n.row, nodes: [] }));
    groups.get(gk).nodes.push(n); n.G = groups.get(gk);
  });
  const used = [...new Set([...nodes.values()].map((n) => n.row))].sort((a, b) => a - b);
  const rowIx = new Map(used.map((r, i) => [r, i]));
  nodes.forEach((n) => (n.r = rowIx.get(n.row)));
  const R = used.length;
  const rows = Array.from({ length: R }, (_, r) => [...groups.values()].filter((g) => rowIx.get(g.row) === r));
  items.forEach((it) => {
    it.dir = it.b.r > it.a.r ? 'up' : it.b.r < it.a.r ? 'down' : 'same';
    it.sa = it.dir === 'down' ? 'b' : 't'; it.sb = it.dir === 'up' ? 'b' : 't';
  });
  // Система с множеством связей шире — точки крепления не сливаются, стрелки идут почти прямо
  nodes.forEach((n) => { const c = (sd) => n.e.filter((it) => (it.a === n && it.sa === sd) || (it.b === n && it.sb === sd)).length; n.w = Math.max(n.w, Math.min(820, Math.max(c('t'), c('b')) * 28)); });
  // ---- По горизонтали: порядок рамок и систем по соседям (меньше пересечений) ----
  const place = () => {
    rows.forEach((gs) => {
      let x = 0;
      gs.forEach((g) => {
        const nw = g.nodes.reduce((s, n) => s + n.w, 0) + (g.nodes.length - 1) * HG;
        g.w = Math.max(nw + 2 * P, Math.min(270, 26 + g.title.length * 6.9));
        g.x = x;
        let nx = x + (g.w - nw) / 2;
        g.nodes.forEach((n) => { n.x = nx; nx += n.w + HG; });
        x += g.w + GG;
      });
      gs.wd = Math.max(0, x - GG);
    });
    const W = Math.max(...rows.map((gs) => gs.wd));
    rows.forEach((gs) => { const dx = (W - gs.wd) / 2; gs.forEach((g) => { g.x += dx; g.nodes.forEach((n) => (n.x += dx)); }); });
    return W;
  };
  const cx = (n) => n.x + n.w / 2;
  place();
  for (let it = 0; it < 8; it++) {
    rows.forEach((gs) => {
      gs.forEach((g) => {
        const nb = g.nodes.flatMap((n) => n.e.map((x) => (x.a === n ? x.b : x.a))).filter((m) => m.G !== g);
        g.bc = nb.length ? nb.reduce((s, m) => s + cx(m), 0) / nb.length : g.x + g.w / 2;
        g.nodes.forEach((n) => { const m = n.e.map((x) => (x.a === n ? x.b : x.a)); n.bc = m.length ? m.reduce((s, q) => s + cx(q), 0) / m.length : cx(n); });
        g.nodes.sort((p, q) => p.bc - q.bc);
      });
      gs.sort((p, q) => p.bc - q.bc);
    });
    place();
  }
  const W = place();
  // ---- Маршруты по горизонтали: каналы между рядами и вертикальные коридоры ----
  // Канал c — над рядом c (между рядами c и c + 1)
  const free = (r) => {
    const b = rows[r].map((g) => [g.x - 8, g.x + g.w + 8]).sort((p, q) => p[0] - q[0]);
    const out = []; let cur = -1e6;
    b.forEach(([l, h]) => { if (l > cur) out.push([cur, l]); cur = Math.max(cur, h); });
    out.push([cur, 1e6]);
    return out;
  };
  const corr = [];
  const corridor = (r0, r1, want) => {
    // Свободно во всех рядах r0..r1
    let iv = [[-1e6, 1e6]];
    for (let r = r0; r <= r1; r++) {
      const f = free(r), nx = [];
      iv.forEach(([l, h]) => f.forEach(([a, b]) => { const L = Math.max(l, a), H = Math.min(h, b); if (H - L > 14) nx.push([L, H]); }));
      iv = nx;
    }
    let best = null;
    iv.forEach(([l, h]) => { const x = Math.max(l + 8, Math.min(h - 8, want)); if (!best || Math.abs(x - want) < Math.abs(best.x - want)) best = { x, l, h }; });
    let x = best.x, k = 0;
    // Несколько связей в одном коридоре — дорожки через 7 px
    while (corr.some((c) => Math.abs(c.x - x) < 6 && c.r0 <= r1 && r0 <= c.r1) && k < 40) { k++; x = best.x + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 7; if (x < best.l + 4 || x > best.h - 4) x = best.x + k * 7 * (best.x - best.l < best.h - best.x ? 1 : -1); }
    corr.push({ x, r0, r1 });
    return x;
  };
  const ports = new Map();
  const port = (n, side, it) => { const key = n.k + side; if (!ports.has(key)) ports.set(key, []); ports.get(key).push(it); };
  items.forEach((it) => { port(it.a, it.sa, it); port(it.b, it.sb, it); });
  // Точки крепления: по ширине системы, по порядку другого конца
  ports.forEach((list, key) => {
    const n = nodes.get(key.slice(0, -1)), side = key.slice(-1);
    list.sort((p, q) => cx(p.a === n && p.sa === side ? p.b : p.a) - cx(q.a === n && q.sa === side ? q.b : q.a));
    list.forEach((it, j) => { const x = n.x + (n.w * (j + 1)) / (list.length + 1); if (it.a === n && it.sa === side && it.xa === undefined) it.xa = x; else it.xb = x; });
  });
  const hseg = []; // { c, x1, x2, it, k }
  items.forEach((it) => {
    const { a, b } = it;
    // U — конец отрезка, от которого линия идёт вверх, L — вниз (для порядка дорожек без лишних пересечений)
    if (it.dir === 'same') { hseg.push(it.h1 = { c: a.r, x1: it.xa, x2: it.xb, it, same: true }); return; }
    const up = it.dir === 'up', c1 = up ? a.r : a.r - 1, c2 = up ? b.r - 1 : b.r;
    if (c1 === c2) { hseg.push(it.h1 = { c: c1, x1: it.xa, x2: it.xb, it, U: up ? it.xb : it.xa, L: up ? it.xa : it.xb }); return; }
    const lo = up ? a.r + 1 : b.r + 1, hi = up ? b.r - 1 : a.r - 1;
    it.xc = corridor(lo, hi, (it.xa + it.xb) / 2);
    hseg.push(it.h1 = { c: c1, x1: it.xa, x2: it.xc, it, U: up ? it.xc : it.xa, L: up ? it.xa : it.xc }, it.h2 = { c: c2, x1: it.xc, x2: it.xb, it, U: up ? it.xb : it.xc, L: up ? it.xc : it.xb });
  });
  // Дорожки в канале: отрезки не перекрываются на одной дорожке
  const tracks = {};
  hseg.forEach((s) => { s.l = Math.min(s.x1, s.x2); s.h = Math.max(s.x1, s.x2); });
  // Порядок сверху вниз: уходящие влево — по возрастанию U, затем уходящие вправо — по убыванию U, внизу — связи внутри ряда
  // (так линии из одной системы не перекрещиваются); перекрывающиеся отрезки — на разных дорожках, остальные делят дорожку
  const okey = (s) => (s.same ? [2, s.h - s.l] : s.L <= s.U ? [0, s.U] : [1, -s.U]);
  [...new Set(hseg.map((s) => s.c))].forEach((c) => {
    const list = hseg.filter((s) => s.c === c).sort((p, q) => { const a = okey(p), b = okey(q); return a[0] - b[0] || a[1] - b[1]; });
    list.forEach((s, i) => { s.k = Math.max(-1, ...list.slice(0, i).filter((q) => q.l < s.h + 10 && s.l < q.h + 10).map((q) => q.k)) + 1; });
    tracks[c] = Math.max(...list.map((s) => s.k)) + 1;
  });
  // ---- По вертикали: сверху вниз ----
  const chH = (c) => (tracks[c] ? 2 * CM + (tracks[c] - 1) * TS : 26);
  let y = tracks[R - 1] ? chH(R - 1) : 0;
  const rowY = [];
  for (let r = R - 1; r >= 0; r--) { rowY[r] = y; y += FH + (r ? chH(r - 1) : 0); }
  const H = y + (tracks[-1] ? chH(-1) : 0);
  groups.forEach((g) => { g.y = rowY[rowIx.get(g.row)]; });
  nodes.forEach((n) => { n.y0 = rowY[n.r] + HDR + P; });
  const chTop = (c) => (c >= R - 1 ? 0 : rowY[c + 1] + FH); // канал над рядом c
  const ty = (s) => chTop(s.c) + CM + s.k * TS;
  // ---- Пути: скруглённые ломаные ----
  const poly = (pts) => {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const r1 = Math.min(5, Math.hypot(x1 - x0, y1 - y0) / 2), r2 = Math.min(5, Math.hypot(x2 - x1, y2 - y1) / 2);
      const ax = x1 - Math.sign(x1 - x0) * r1, ay = y1 - Math.sign(y1 - y0) * r1, bx = x1 + Math.sign(x2 - x1) * r2, by = y1 + Math.sign(y2 - y1) * r2;
      d += ` L${ax},${ay} Q${x1},${y1} ${bx},${by}`;
    }
    const [lx, ly] = pts[pts.length - 1];
    return d + ` L${lx},${ly}`;
  };
  const nodeBox = [...nodes.values()].map((n) => ({ l: n.x - 2, t: n.y0 - 2, r: n.x + n.w + 2, b: n.y0 + NH + 2 }));
  const placed = [];
  let paths = '', badges = '';
  items.forEach((it) => {
    const { a, b } = it;
    const ya = it.sa === 't' ? a.y0 : a.y0 + NH, yb = it.sb === 't' ? b.y0 : b.y0 + NH;
    const pts = it.h2
      ? [[it.xa, ya], [it.xa, ty(it.h1)], [it.xc, ty(it.h1)], [it.xc, ty(it.h2)], [it.xb, ty(it.h2)], [it.xb, yb]]
      : [[it.xa, ya], [it.xa, ty(it.h1)], [it.xb, ty(it.h1)], [it.xb, yb]];
    it.pts = pts;
    paths += `<path d="${poly(pts)}" class="k-${it.e.k}" data-e="${it.i}" marker-end="url(#lsnArr-${it.e.k})"/><path d="${poly(pts)}" class="hit" data-e="${it.i}"/>`;
    // Номер: на отрезке, где не мешает другим номерам и системам
    const segs = []; for (let s = 0; s < pts.length - 1; s++) segs.push([pts[s], pts[s + 1]]);
    let best = null;
    const order = segs.map((sg, s) => [sg, s]).sort((p, q) => Math.hypot(q[0][1][0] - q[0][0][0], q[0][1][1] - q[0][0][1]) - Math.hypot(p[0][1][0] - p[0][0][0], p[0][1][1] - p[0][0][1]));
    for (const [[p0, p1]] of order) for (const t of [0.5, 0.3, 0.7, 0.15, 0.85]) {
      const x = p0[0] + (p1[0] - p0[0]) * t, yy = p0[1] + (p1[1] - p0[1]) * t, q = { l: x - BR, t: yy - BR, r: x + BR, b: yy + BR };
      const ov = (z) => Math.max(0, Math.min(q.r, z.r) - Math.max(q.l, z.l)) * Math.max(0, Math.min(q.b, z.b) - Math.max(q.t, z.t));
      const sc = placed.reduce((s, z) => s + 3 * ov(z), 0) + nodeBox.reduce((s, z) => s + 2 * ov(z), 0) + Math.abs(t - 0.5) * 4;
      if (!best || sc < best.sc) best = { sc, x, y: yy };
      if (sc < 1) break;
    }
    placed.push({ l: best.x - BR - 2, t: best.y - BR - 2, r: best.x + BR + 2, b: best.y + BR + 2 });
    badges += `<b class="ls-nb k-${it.e.k}" data-e="${it.i}" style="left:${best.x - BR}px;top:${best.y - BR}px">${it.e.n}</b>`;
  });
  const minX = Math.min(0, ...corr.map((c) => c.x - 10)), maxX = Math.max(W, ...corr.map((c) => c.x + 10));
  const sh = -minX + 4, CW = maxX - minX + 8;
  const mk = (k, c) => `<marker id="lsnArr-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${c}"/></marker>`;
  host.innerHTML = `<div class="ls-fcanvas ls-net v-${view}" style="width:${CW}px;height:${H}px">
    ${[...groups.values()].map((g) => `<div class="ls-fgrp g-${g.type}" style="left:${g.x + sh}px;top:${g.y}px;width:${g.w}px;height:${FH}px"></div><div class="ls-ngt g-${g.type}" title="${g.title}" style="left:${g.x + sh + 1}px;top:${g.y + 1}px;max-width:${g.w - 2}px">${g.title}</div>`).join('')}
    <svg width="${CW}" height="${H}"><defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}${mk('pub', '#0e7490')}</defs><g transform="translate(${sh},0)">${paths}</g></svg>
    ${[...nodes.values()].map((n) => `<div class="ls-fnode k-${n.kind}" data-n="${n.k}" title="${n.k}" style="left:${n.x + sh}px;top:${n.y0}px;width:${n.w}px;height:${NH}px"><b>${n.k}</b></div>`).join('')}
    <div class="ls-nbs" style="transform:translate(${sh}px,0)">${badges}</div>
    <div class="ls-ncall"></div>
  </div>`;
  // ---- Подсветка: наведение на номер, стрелку или систему; клик по номеру — раскрыть связь в списке ----
  const canvas = host.querySelector('.ls-net'), call = host.querySelector('.ls-ncall');
  const hot = (ids, it) => {
    canvas.classList.toggle('focus', !!ids);
    canvas.querySelectorAll('[data-e]').forEach((x) => x.classList.toggle('hot', !!ids && ids.includes(+x.dataset.e)));
    canvas.querySelectorAll('.ls-fnode').forEach((x) => x.classList.toggle('hot', !!ids && items.some((q) => ids.includes(q.i) && (q.a.k === x.dataset.n || q.b.k === x.dataset.n))));
    if (it) {
      const bx = canvas.querySelector(`.ls-nb[data-e="${it.i}"]`);
      const who = lsWho(it.e, view);
      call.innerHTML = `<b>${it.e.n}</b> ${it.e.f} → ${it.e.t}<span>${it.e.w}</span>${who ? `<i>кто: ${who}</i>` : ''}<em>${it.e.r} · ${LS_KINDS[it.e.k]}</em>`;
      call.style.display = 'block';
      const L = parseFloat(bx.style.left) + sh + 24, T = parseFloat(bx.style.top) - 6;
      call.style.left = Math.min(L, CW - call.offsetWidth - 4) + 'px'; call.style.top = Math.min(T, H - call.offsetHeight - 4) + 'px';
      if (L > CW - call.offsetWidth - 4) call.style.left = Math.max(4, L - 48 - call.offsetWidth) + 'px';
    } else call.style.display = 'none';
  };
  canvas.querySelectorAll('[data-e]').forEach((x) => {
    const it = items[+x.dataset.e];
    x.onmouseenter = () => hot([it.i], it);
    x.onmouseleave = () => hot(null);
    x.onclick = () => o.onPick && o.onPick(it.i);
  });
  canvas.querySelectorAll('.ls-fnode').forEach((x) => {
    const n = nodes.get(x.dataset.n);
    x.onmouseenter = () => hot(n.e.map((q) => q.i));
    x.onmouseleave = () => hot(null);
  });
  host._hot = (i) => hot(i === null ? null : [i], i === null ? null : items[i]);
  lsRail(host);
  // Широкая сеть — уменьшаем, чтобы вся карта была видна без прокрутки
  const avail = host.clientWidth - 30;
  canvas.style.zoom = CW > avail && avail > 300 ? (avail / CW).toFixed(3) : '';
}

// ---------- Стрелки потоков на большой схеме (при наведении на систему) ----------
// Конец стрелки — элемент с этим ключом; если их несколько, приоритет у ЦД и центральной зоны, затем слой данных, внешние, ДЗО, пользователи, модули
function lsAnchor(grid, key) {
  const pr = (el) => (el.closest('.ls-zone.cz') || el.closest('.ls-zone.asis:not(.data)') ? 1 : el.closest('.ls-zone.data') ? 2 : el.closest('.ls-box.ext') ? 3 : el.closest('.ls-zone.dzo') ? 4 : el.closest('.ls-box.users') ? 5 : 9);
  return [...grid.querySelectorAll(`[data-sys="${CSS.escape(key)}"]`)].sort((a, b) => pr(a) - pr(b))[0];
}

function lsDraw(grid, edges, o = {}) {
  const svg = grid.querySelector('.ls-svg'), lbls = grid.querySelector('.ls-lbls');
  if (!svg) return;
  grid.querySelectorAll('.ep').forEach((x) => x.classList.remove('ep'));
  grid.classList.toggle('fl-on', edges.length > 0);
  const g = grid.getBoundingClientRect();
  const W = grid.scrollWidth, H = grid.scrollHeight;
  svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const box = (el) => { const r = el.getBoundingClientRect(); return { l: r.left - g.left, t: r.top - g.top, r: r.right - g.left, b: r.bottom - g.top, cx: (r.left + r.right) / 2 - g.left, cy: (r.top + r.bottom) / 2 - g.top, w: r.width }; };
  const items = edges.map((e) => ({ e, a: lsAnchor(grid, e.f), z: lsAnchor(grid, e.t) })).filter((x) => {
    if (!x.a || !x.z) { console.warn('Схема: нет элемента для потока', x.e.f, '→', x.e.t); return false; }
    return true;
  });
  // Сторона выхода и входа: вниз/вверх, на одном уровне — дугой сверху
  items.forEach((x) => {
    x.A = box(x.a); x.Z = box(x.z);
    if (x.Z.t >= x.A.b - 2) { x.sa = 'b'; x.sz = 't'; } else if (x.Z.b <= x.A.t + 2) { x.sa = 't'; x.sz = 'b'; } else { x.sa = 't'; x.sz = 't'; }
  });
  // Несколько стрелок у одного края элемента — разносим точки крепления
  const ports = new Map();
  const port = (el, side, x, other) => { const k = side; if (!ports.has(el)) ports.set(el, {}); const m = ports.get(el); (m[k] = m[k] || []).push({ x, other }); };
  items.forEach((x) => { port(x.a, x.sa, x, x.Z.cx); port(x.z, x.sz, x, x.A.cx); });
  ports.forEach((m, el) => Object.entries(m).forEach(([side, list]) => {
    list.sort((p, q) => p.other - q.other);
    const b = box(el), span = Math.min(b.w - 12, list.length * 18);
    list.forEach((p, i) => {
      const dx = list.length > 1 ? -span / 2 + (span * i) / (list.length - 1) : 0;
      const pt = [b.cx + dx, side === 'b' ? b.b : b.t];
      if (p.x.a === el && p.x.sa === side && !p.x.p0) p.x.p0 = pt; else p.x.p1 = pt;
    });
  }));
  let paths = '';
  const placed = [];
  let labels = '';
  items.forEach((x, i) => {
    const [x0, y0] = x.p0, [x1, y1] = x.p1;
    let c1, c2;
    if (x.sa === 't' && x.sz === 't') { const top = Math.min(y0, y1) - 46; c1 = [x0, top]; c2 = [x1, top]; } else { const d = (y1 - y0) * 0.45; c1 = [x0, y0 + d]; c2 = [x1, y1 - d]; }
    const pt = (t) => { const u = 1 - t; return [u * u * u * x0 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x1, u * u * u * y0 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y1]; };
    const cls = `k-${x.e.k}${o.hot === i ? ' hot' : ''}${o.hot !== undefined && o.hot !== i ? ' dim' : ''}`;
    paths += `<path d="M${x0},${y0} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x1},${y1}" class="${cls}" marker-end="url(#lsArr-${x.e.k})"/>`;
    // Подпись: середина кривой, при наложении — сдвиг вдоль кривой
    const lw = Math.min(200, 26 + x.e.w.length * 5.6), lh = x.e.w.length > 30 ? 34 : 20;
    let pos = null;
    for (const t of [0.5, 0.38, 0.62, 0.28, 0.72, 0.2, 0.8]) {
      const [px, py] = pt(t), r = { l: px - lw / 2, t: py - lh / 2, r: px + lw / 2, b: py + lh / 2 };
      if (!placed.some((q) => r.l < q.r && r.r > q.l && r.t < q.b && r.b > q.t)) { pos = r; break; }
    }
    if (!pos) { const [px, py] = pt(0.5); pos = { l: px - lw / 2, t: py - lh / 2, r: px + lw / 2, b: py + lh / 2 }; }
    placed.push(pos);
    labels += `<div class="ls-fl ${cls}" style="left:${pos.l}px;top:${pos.t}px;width:${lw}px" title="${x.e.f} → ${x.e.t}: ${x.e.w} · ${x.e.r}">${x.e.n ? `<b>${x.e.n}</b>` : ''}${x.e.w}</div>`;
    x.a.classList.add('ep'); x.z.classList.add('ep');
  });
  const mk = (k, c) => `<marker id="lsArr-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:${c}"/></marker>`;
  svg.innerHTML = `<defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}${mk('pub', '#0e7490')}</defs>${paths}`;
  lbls.innerHTML = labels;
}
