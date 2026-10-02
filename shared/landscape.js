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
      ['Замеры и датчики', 'SCADA, СДМО / СДМС, АГЗУ, ИСУ — данные остаются в промысловых системах'],
      ['Сводки в файлах', 'рапорты и сводки собираются в MS Office: в «Добыче» 111 привязок шагов к MS Office'],
      ['Пересылка', 'почта, рабочий чат, СЭД, сетевые папки'],
      ['Ручной ввод', 'перенос в текущие модули ABAI и инженерное ПО — Petrel, tNavigator, COMPASS'],
      ['Отчётность', 'руководству ДЗО, КМГИ и КЦ — снова файлы'],
    ],
  },
  nedra: {
    name: 'TO BE Nedra', sub: 'ЦД на Nedra.PLATFORM', v: 'nedra',
    lead: 'Целевое видение стратсессии: ЦД Актива — единая платформа на базе Nedra.PLATFORM над слоем данных КХД + NDP. Данные АСУ ТП собирает MES, внешние системы подключаются через адаптеры.',
    flow: [
      ['АСУ ТП → MES', 'сбор, верификация, хранение и обработка данных в зоне ДЗО'],
      ['Слой данных', 'потоки данных в КХД + NDP (Nedra Data Platform): ETL, стриминг, озеро данных'],
      ['Бизнес-модули ЦД', 'ЦД скважины, пласта, добычи и наземной инфраструктуры читают и пишут через слой данных'],
      ['Платформа ЦД Актива', 'каталог процессов, BPM, AI-агенты, сквозная аналитика активов'],
      ['Web-доступ', 'КЦ, КМГИ, ЦИО и ДЗО работают в одном контуре; SAP, СЭД, гос. порталы — через интеграции'],
    ],
  },
  dream: {
    name: 'Dream TO BE', sub: 'ЦД на ABAI', v: 'dream',
    lead: 'Наш вариант: та же архитектура ЦД, но бизнес-модули — продукты ABAI (соответствие Nedra ↔ ABAI — стратсессия, слайд 34), единая база — ABAI БД 2.0, слой бизнес-интеграций — КХД.',
    flow: [
      ['АСУ ТП → сбор', 'SCADA, СДМО / СДМС, ИСУ, АСКУЭ / АСТУЭ — данные поступают автоматически'],
      ['КХД', 'слой бизнес-интеграций: собирает данные промысла и обменивается с SAP, СЭД, гос. порталами'],
      ['ABAI БД 2.0', 'единая база: скважины, замеры, документы, статусы и уведомления'],
      ['ЦД на модулях ABAI', 'ЦРНС 2.0, УЗ 2.0, ПДИМ 2.0, ТР 2.0, ПГНО, ПАЭГТМ, Цифровое бурение, мониторинг ТКРС'],
      ['Решения по ролям', 'КЦ, КМГИ, ЦИО и ДЗО видят одни данные; MS Office, почта и рабочий чат в шагах Dream TO BE не используются'],
    ],
  },
};

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
  const alt = (t) => (nedra || !t ? '' : `<em class="alt">вместо ${t}</em>`);
  const A = (s, n, prev) => `<span class="ls-chip k-abai big" data-sys="${lsKey(s)}">${s}${n ? `<small>${n}</small>` : ''}${alt(prev || '')}</span>`;
  const N = (s, n) => `<span class="ls-chip k-nedra big" data-sys="${lsKey(s)}">${s}${n ? `<small>${n}</small>` : ''}</span>`;
  const E = (s, n) => `<span class="ls-chip k-ext big" data-sys="${lsKey(s)}">${s}${n ? `<small>${n}</small>` : ''}</span>`;
  const twins = nedra
    ? [
      ['ЦД скважины', N('Nedra.RTM', 'бурение') + N('Nedra.WWO', 'ТКРС')],
      ['ЦД пласта', N('Nedra.NUMEX', 'система разработки') + N('Nedra.NUMEX Optimize', 'заводнение, ГТМ') + A('ABAI ПАЭГТМ') + A('ABAI ЦРНС 2.0') + '<div class="ls-note">в BPMN TO BE Nedra также: ' + ['Nedra.DS', 'Nedra.GCORE', 'Терра', 'Geomate'].map((s) => lsChip(s, 'nedra')).join('') + lsChip('ABAI БД 2.0', 'abai') + '</div>'],
      ['ЦД добычи и наземной инфраструктуры', N('Nedra.DIGITAL TWIN') + N('Nedra.INFRAPLAN', 'наземка · гидравлика · экономика') + N('Nedra.DIGITAL TWIN Pipe', 'предиктивная аналитика отказов') + A('ABAI УЗ 2.0') + A('ABAI ПДИМ 2.0') + A('ABAI ТР 2.0') + A('ABAI ПГНО') + E('Интеллектуальное месторождение')],
    ]
    : [
      ['ЦД скважины', A('ABAI Цифровое бурение', 'аналог Nedra.RTM', 'Nedra.RTM') + A('ABAI Цифровой мониторинг ТКРС', '', 'Nedra.WWO')],
      ['ЦД пласта', A('ABAI ЦРНС 2.0', 'система разработки', 'Nedra.NUMEX') + A('ABAI УЗ 2.0', 'управление заводнением', 'NUMEX Optimize') + A('ABAI ПАЭГТМ', 'ГТМ и мероприятия')],
      ['ЦД добычи и наземной инфраструктуры', A('ABAI ПДИМ 2.0', 'план/факт, отклонения', 'Nedra.DIGITAL TWIN') + A('ABAI ПДИМ 2.0 · целостность трубопроводов', '', 'DIGITAL TWIN Pipe') + A('ABAI Наземная инфраструктура', '', 'Nedra.INFRAPLAN') + A('ABAI ТР 2.0', 'режимы') + A('ABAI ПГНО', 'подбор ГНО') + E('Интеллектуальное месторождение')],
    ];
  return `<div class="ls-zone cz ${view}">
      <div class="ls-zone-h">Централизованная зона — развёртывание и администрирование: KMG-Digital ${lsSrc(nedra ? 'стратсессия, слайд 54' : 'стратсессия, слайды 34 и 54')}</div>
      ${nedra
    ? lsBox('ЦД Актива — единая платформа на базе Nedra.PLATFORM', `<div class="ls-plat"><b>Каталог процессов · конструктор бизнес-сценариев · сквозная аналитика активов</b>
          <div class="ls-cols c4">${['BPM — планировщик сквозных процессов (low-code, SLA, аудит)', 'AI-агенты', 'Регистраторы систем и хранилищ · адаптеры (REST / gRPC / Queue / Desktop Agent / Script / Excel)', 'Общие сервисы: уведомления · BI · визуализация'].map((t) => `<div class="ls-cell">${t}</div>`).join('')}</div></div>`, 'plat')
    : lsBox('ЦД Актива на модулях ABAI', `<div class="ls-plat abai">${A('ABAI БД 2.0', 'единая база: скважины, замеры, документы, статусы и уведомления')}<div class="ls-note">Платформенный слой (каталог процессов, BPM, AI-агенты) в стратсессии описан только для Nedra.PLATFORM — для ABAI не детализирован</div></div>`, 'plat')}
      ${lsPipe('вызов модулей и сервисов', { both: true })}
      ${lsBox('Бизнес-модули и вычислительные системы ЦД' + (nedra ? ' (Nedra · ABAI · инж. ПО)' : ' (ABAI · инж. ПО)'), `<div class="ls-cols c3 twins">${twins.map(([t, b]) => `<div class="ls-twin"><div class="ls-twin-h">${t}</div><div class="ls-twin-b">${b}</div></div>`).join('')}</div>`, 'mods')}
    </div>
    ${lsPipe('чтение / запись данных', { both: true })}
    <div class="ls-datarow"><div class="ls-zone data ${view}">
      <div class="ls-zone-h">${nedra ? 'Слой данных — КХД + NDP (Nedra Data Platform) · кластер OpenShift / OKD' : 'Слой данных — КХД: слой бизнес-интеграций'} ${lsSrc(nedra ? 'стратсессия, слайд 54' : 'стратсессия, слайды 34 и 54: Nedra.DATA → КХД')}</div>
      <div class="ls-tech">${nedra ? lsChip('КХД', 'abai') + lsChip('Nedra.DATA', 'nedra', 'NDP') : lsChip('КХД', 'abai', 'вместо Nedra.DATA')}
        ${['NiFi — ETL', 'Kafka + Debezium — стриминг / CDC', 'Trino — SQL-запросы', 'S3 / MinIO — озеро данных', 'Hive Metastore', 'SQL-СУБД', 'ElasticSearch + Kibana', 'AirFlow — оркестрация ETL', 'Superset — BI', 'Keycloak — SSO'].map((t) => `<span class="ls-t">${t}</span>`).join('')}</div>
      ${nedra ? '' : '<div class="ls-note">Технологический стек слоя данных — со слайда 54 (КХД + NDP); для варианта ABAI стратсессия его отдельно не описывает</div>'}
    </div>${lsExtRow(view)}</div>`;
}

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
    ${lsPipe(asis ? 'замеры и телеметрия' : 'сбор данных', { up: true, manual: false })}
    ${lsBox('Данные с датчиков / АСУ ТП', ['SCADA (WinCC, DeltaV)', 'АГЗУ', 'ВРП', 'ИСУ', 'КУУН', 'СДМО (ЭМГ)', 'СДМС (ОМГ)', 'ДЭЛ-140/150', 'СУ ШГН', 'Датчики СТПА', 'АСКУЭ / АСТУЭ', 'GPRS'].map((s) => lsChip(s, 'ext')).join(''), 'asu')}
  </div>`;
}

function lsExternal(view) {
  return lsBox('Внешние системы и источники', ['SAP ERP / SAP ТОРО', 'СЭД', 'QAZSTAT', 'eLicense', 'eQurylys', 'ЦОН', 'Государственный портал', 'ИСЭЗ Самрук-Казына', 'Портал закупок Самрук-Казына'].map((s) => lsChip(s, 'ext')).join('')
    + `<div class="ls-note">${view === 'asis' ? 'данные вносятся и выгружаются вручную' : 'обмен через интеграции (адаптеры) слоя данных'} · стратсессия, слайд 54; порталы Самрук-Казына — BPMN</div>`, 'ext');
}

const lsExtRow = (view) => `<div class="ls-hlink ${view === 'asis' ? 'manual' : ''}"><i></i><span>${view === 'asis' ? 'вручную' : 'интеграции'}</span></div>${lsExternal(view)}`;

function abaiLandscape(root, view = 'dream', flow) {
  LS_CUR = view;
  const V = LS_VIEWS[view];
  const flows = LS_FLOWS[view] || [];
  const fl = flow === null ? null : flows.find((f) => f.id === flow) || flows[0];
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
      <div><b>${LS_MODS.length}</b><span>модуля мокапа: ${LS_MODS.map((m) => m.name).join(', ')}</span></div>
    </div>
    <div class="ls-fbar">
      <div class="ls-fbar-h"><b>Потоки данных</b><span>выберите сценарий — стрелки покажут, что и куда передаётся · наведите на систему — её входящие и исходящие потоки</span></div>
      <div class="ls-fbtns">${flows.map((f) => `<button data-fl="${f.id}" class="${fl && f.id === fl.id ? 'on' : ''}">${f.name}<span>${f.mods}</span></button>`).join('')}<button data-fl="" class="off ${fl ? '' : 'on'}">Без стрелок</button></div>
      ${fl ? `<div class="ls-fnote">${fl.note}</div>
      <div class="ls-focus"></div>
      <div class="ls-fkinds">${[...new Set(fl.e.map((x) => x[4]))].map((k) => `<span class="k-${k}">${LS_KINDS[k]}</span>`).join('')}</div>` : ''}
    </div>
    <div class="ls-scroll"><div class="ls-grid ${view}">
        ${lsBox('Пользователи и уровни управления', `<div class="ls-cols c3">${[['КЦ', '<b>КЦ</b> — стратегический уровень: портфель, целевые КПД, портфельная аналитика'], ['КМГИ', '<b>КМГИ</b> — методология, сложные расчёты, экспертиза, R&D'], ['ЦИО / ДЗО', '<b>ЦИО / ДЗО</b> — оперативное управление, ИМА, выполнение производственной программы']].map(([k, t]) => `<div class="ls-cell" data-sys="${k}">${t}</div>`).join('')}</div>`, 'users')}
        ${lsPipe(view === 'asis' ? 'отчёты в файлах, почта, СЭД' : 'Web-доступ к ЦД', { manual: view === 'asis', both: true })}
        <div class="ls-mods-h">Процессы мокапа — системы по шагам BPMN (${V.name}) · число — сколько шагов используют систему · клик — открыть модуль</div>
        <div class="ls-mods">${lsModules(view)}</div>
        ${lsPipe(view === 'asis' ? 'каждая служба — в своей системе' : 'процессы выполняются в ЦД', { manual: view === 'asis', both: true })}
        ${lsCentral(view)}
        ${lsPipe(view === 'asis' ? 'выгрузки из промысловых систем' : 'потоки данных', { up: true, manual: view === 'asis' })}
        ${lsDzo(view)}
        <svg class="ls-svg"></svg><div class="ls-lbls"></div>
    </div></div>
    <ol class="ls-flow">${V.flow.map(([t, d], i) => `<li><b>${i + 1}. ${t}</b><span>${d}</span></li>`).join('')}</ol>`;
  root.querySelectorAll('[data-ls]').forEach((b) => (b.onclick = () => { abaiLandscape(root, b.dataset.ls); history.replaceState(null, '', '#' + b.dataset.ls); }));
  root.querySelectorAll('[data-fl]').forEach((b) => (b.onclick = () => abaiLandscape(root, view, b.dataset.fl || null)));
  const grid = root.querySelector('.ls-grid');
  const base = fl ? fl.e.map(([f, t, w, r, k], i) => ({ f, t, w, r, k, n: i + 1 })) : [];
  const focus = root.querySelector('.ls-focus');
  const mark = () => {
    lsDraw(grid, []);
    grid.classList.toggle('fl-on', base.length > 0);
    base.forEach((e) => [e.f, e.t].forEach((k) => { const a = lsAnchor(grid, k); if (a) a.classList.add('ep'); }));
  };
  const draw = (edges, o) => (edges === base ? mark() : lsDraw(grid, edges, o));
  draw(base);
  if (focus) lsSeq(focus, grid, base, view);
  // Наведение на систему: её потоки во всех сценариях вида
  root.querySelectorAll('.ls-chip, .ls-cell[data-sys]').forEach((c) => {
    c.onmouseenter = () => {
      const key = c.dataset.sys;
      root.classList.add('hl');
      root.querySelectorAll(`.ls-chip[data-sys="${CSS.escape(key)}"]`).forEach((x) => x.classList.add('on'));
      const seen = new Map();
      flows.forEach((x) => x.e.forEach(([f, t, w, r, k]) => {
        if (f !== key && t !== key) return;
        const id = f + '|' + t;
        if (seen.has(id)) { const e = seen.get(id); if (!e.w.includes(w)) { e.w += '; ' + w; e.r += ' · ' + r; } } else seen.set(id, { f, t, w, r, k });
      }));
      if (!seen.size) return;
      // Связи системы — всплывающей компактной схемой рядом, на большой схеме только подсветка участников
      const list = [...seen.values()];
      grid.querySelectorAll('.ep').forEach((x) => x.classList.remove('ep'));
      grid.classList.add('fl-on');
      list.forEach((e) => [e.f, e.t].forEach((k) => { const a = lsAnchor(grid, k); if (a) a.classList.add('ep'); }));
      let pop = document.querySelector('.ls-pop');
      if (!pop) { pop = document.createElement('div'); pop.className = 'ls ls-pop'; document.body.appendChild(pop); }
      const name = c.classList.contains('ls-cell') ? key : c.dataset.sys;
      pop.innerHTML = `<div class="ls-pop-h"><b>${name}</b> — потоки данных · ${V.name} · ${list.length}</div><div class="ls-focus"></div>`;
      pop.style.transform = ''; pop.style.width = 'auto'; pop.style.maxWidth = 'none'; pop.style.display = 'block';
      lsEgo(pop.querySelector('.ls-focus'), grid, key, list, view);
      // Ставим сбоку от системы; если не влезает — уменьшаем
      const r = c.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
      const sc = Math.min(1, (innerHeight - 24) / ph, (innerWidth - 24) / pw);
      pop.style.transform = sc < 1 ? `scale(${sc})` : '';
      const w = pw * sc, h = ph * sc;
      const right = r.right + 16 + w < innerWidth - 12, left = r.left - 16 - w > 12;
      pop.style.left = (right && (r.left + r.right) / 2 < innerWidth / 2 ? r.right + 16 : left ? r.left - 16 - w : right ? r.right + 16 : Math.max(12, (innerWidth - w) / 2)) + 'px';
      pop.style.top = Math.max(12, Math.min(innerHeight - h - 12, (r.top + r.bottom) / 2 - h / 2)) + 'px';
    };
    c.onmouseleave = () => {
      root.classList.remove('hl'); root.querySelectorAll('.ls-chip.on').forEach((x) => x.classList.remove('on'));
      const pop = document.querySelector('.ls-pop'); if (pop) pop.style.display = 'none';
      draw(base);
    };
  });
  if (root._ro) root._ro.disconnect();
  root._ro = new ResizeObserver(() => draw(base));
  root._ro.observe(grid);
}

// ---------- Схемы потоков сценария и системы ----------
// Группа системы на схеме потоков: в какой ЦД / слой она входит на большой схеме
function lsGroup(el, view) {
  if (!el) return { key: 'other', title: 'Прочее', type: 'eng' };
  const box = el.closest('.ls-box'), boxT = box && box.querySelector('.ls-box-h') ? box.querySelector('.ls-box-h').textContent.trim() : '';
  if (el.closest('.ls-box.users')) return { key: 'users', title: 'Пользователи и уровни управления', type: 'users' };
  if (el.closest('.ls-box.ext')) return { key: 'ext', title: 'Внешние системы', type: 'ext' };
  if (el.closest('.ls-twin')) {
    if (el.closest('.ls-note') && el.classList.contains('k-abai')) return { key: 'abai-bpmn', title: 'ИС ABAI (по BPMN TO BE Nedra)', type: 'cd' };
    const t = el.closest('.ls-twin').querySelector('.ls-twin-h').textContent.trim();
    return { key: t, title: t, type: 'cd' };
  }
  if (el.closest('.ls-box.plat')) return { key: 'plat', title: view === 'dream' ? 'ЦД актива — единая база' : boxT, type: 'cd' };
  if (el.closest('.ls-zone.data')) {
    if (view === 'asis') return { key: boxT, title: boxT, type: 'data' };
    return { key: 'data', title: view === 'nedra' ? 'Слой данных — КХД + NDP' : 'Слой данных — КХД', type: 'data' };
  }
  if (el.closest('.ls-manual')) return { key: 'manual', title: 'Ручной обмен: файлы, почта, чат', type: 'manual' };
  if (el.closest('.ls-zone.asis')) return { key: boxT, title: boxT, type: el.classList.contains('k-abai') ? 'cd' : 'eng' };
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

// ---------- Схемы потоков: у каждой связи своя строка, подпись — на стрелке ----------
// Слой системы слева направо — как на большой схеме снизу вверх: зона ДЗО → слой данных → внешние → ЦД → процессы → ручной обмен → пользователи
const lsLayer = (g) => (g.type === 'users' ? 7 : g.type === 'manual' ? 6 : /^Процесс:/.test(g.key) ? 5 : g.type === 'cd' ? 4 : g.type === 'ext' ? 3 : g.type === 'data' ? 2 : g.type === 'eng' ? 1 : 0);
function lsNode(grid, k, view) {
  const el = lsAnchor(grid, k);
  const kind = el && el.classList.contains('ls-chip') ? (el.className.match(/k-(\w+)/) || [])[1] : 'user';
  return { k, kind: kind || 'ext', g: lsGroup(el, view) };
}

// Сценарий: системы — колонки в рамках ЦД / слоёв, шаги — строки сверху вниз, стрелка от колонки к колонке
function lsSeq(host, grid, edges, view) {
  if (!edges.length) { host.innerHTML = ''; return; }
  const nodes = new Map();
  edges.forEach((e) => [e.f, e.t].forEach((k) => { if (!nodes.has(k)) nodes.set(k, Object.assign(lsNode(grid, k, view), { first: nodes.size, bal: 0 })); }));
  edges.forEach((e) => { nodes.get(e.f).bal--; nodes.get(e.t).bal++; });
  const groups = new Map();
  nodes.forEach((n) => {
    if (!groups.has(n.g.key)) groups.set(n.g.key, Object.assign({}, n.g, { nodes: [], first: n.first, bal: 0 }));
    const g = groups.get(n.g.key); g.nodes.push(n); g.bal += n.bal;
  });
  // В одном слое и в одной рамке: левее те, кто больше передаёт, правее — кто получает
  const gl = [...groups.values()].sort((a, b) => lsLayer(a) - lsLayer(b) || a.bal - b.bal || a.first - b.first);
  gl.forEach((g) => g.nodes.sort((a, b) => a.bal - b.bal || a.first - b.first));
  // Колонки: номер, [промежуток, системы рамки]…, промежуток, шаг BPMN
  const cols = ['26px'];
  gl.forEach((g) => {
    cols.push('10px'); g.c0 = cols.length + 1;
    g.nodes.forEach((n) => { n.w = Math.round(Math.min(190, Math.max(132, 30 + n.k.length * 7.4))); n.c = cols.length + 1; cols.push(n.w + 'px'); });
    g.c1 = cols.length + 1;
  });
  cols.push('10px', '210px');
  const refC = cols.length;
  host.innerHTML = `<div class="ls-sq v-${view}" style="grid-template-columns:${cols.join(' ')};grid-template-rows:auto auto repeat(${edges.length}, auto) 10px">
    ${gl.map((g) => `<div class="ls-fgrp g-${g.type}" style="grid-column:${g.c0}/${g.c1};grid-row:1/-1"></div><div class="ls-fgt g-${g.type}" style="grid-column:${g.c0}/${g.c1};grid-row:1">${g.title}</div>`).join('')}
    ${[...nodes.values()].map((n) => `<div class="ls-fnode k-${n.kind}" style="grid-column:${n.c};grid-row:2"><b>${n.k}</b></div><div class="ls-sq-life" style="grid-column:${n.c};grid-row:3/-1"></div>`).join('')}
    ${edges.map((e, i) => {
      const a = nodes.get(e.f), b = nodes.get(e.t), fw = a.c < b.c, lo = fw ? a : b, hi = fw ? b : a, r = 3 + i;
      return `<b class="ls-sq-n k-${e.k}" style="grid-column:1;grid-row:${r}" data-r="${i}">${e.n || i + 1}</b>
        <div class="ls-sq-e k-${e.k} ${fw ? 'fw' : 'bw'}" style="grid-column:${lo.c}/${hi.c + 1};grid-row:${r};margin:0 ${hi.w / 2}px 0 ${lo.w / 2}px" data-r="${i}" title="${e.f} → ${e.t}"><span>${e.w}</span><i></i></div>
        <div class="ls-sq-r" style="grid-column:${refC};grid-row:${r}" data-r="${i}">${e.r}<em>${LS_KINDS_SHORT[e.k]}</em></div>`;
    }).join('')}
  </div>`;
  // Наведение на строку — выделить связь
  host.querySelectorAll('[data-r]').forEach((x) => {
    const row = () => host.querySelectorAll(`[data-r="${x.dataset.r}"]`);
    x.onmouseenter = () => row().forEach((y) => y.classList.add('hot'));
    x.onmouseleave = () => row().forEach((y) => y.classList.remove('hot'));
  });
}

// Связи одной системы: слева — кто передаёт ей данные, справа — кому передаёт она; рамки сверху вниз — как на большой схеме
function lsEgo(host, grid, key, list, view) {
  const me = lsNode(grid, key, view);
  const side = (arr, peerOf) => {
    const groups = new Map();
    arr.forEach((e) => {
      const n = lsNode(grid, peerOf(e), view);
      if (!groups.has(n.g.key)) groups.set(n.g.key, Object.assign({}, n.g, { rows: [] }));
      groups.get(n.g.key).rows.push({ n, e });
    });
    return [...groups.values()].sort((a, b) => lsLayer(b) - lsLayer(a));
  };
  const inn = list.filter((e) => e.t === key), out = list.filter((e) => e.f === key);
  const html = (gs, left) => {
    if (!gs.length) return '';
    const nc = left ? 1 : 2, ac = left ? 2 : 1;
    let r = 2, h = `<div class="ls-ego-cap" style="grid-column:1/3;grid-row:1">${left ? 'Откуда приходят данные' : 'Куда уходят данные'}</div>`;
    gs.forEach((g, gi) => {
      if (gi) { h += `<div class="ls-ego-gap" style="grid-row:${r}"></div>`; r++; }
      const r0 = r;
      h += `<div class="ls-fgt g-${g.type}" style="grid-column:${nc};grid-row:${r}">${g.title}</div>`; r++;
      g.rows.forEach(({ n, e }) => {
        h += `<div class="ls-fnode k-${n.kind}" style="grid-column:${nc};grid-row:${r}"><b>${n.k}</b></div>
          <div class="ls-ego-e k-${e.k}" style="grid-column:${ac};grid-row:${r}"><i></i><span>${e.w}<em>${e.r}</em></span></div>`;
        r++;
      });
      h += `<div class="ls-fgrp g-${g.type}" style="grid-column:${nc};grid-row:${r0}/${r}"></div>`;
    });
    return `<div class="ls-ego-side ${left ? 'l' : 'r'}">${h}</div>`;
  };
  host.innerHTML = `<div class="ls-ego v-${view}">
    ${html(side(inn, (e) => e.f), true)}
    <div class="ls-ego-me ls-fnode k-${me.kind}"><b>${key}</b><span>${inn.length ? `← входящих: ${inn.length}` : ''}${inn.length && out.length ? '<br>' : ''}${out.length ? `исходящих: ${out.length} →` : ''}</span></div>
    ${html(side(out, (e) => e.t), false)}
  </div>`;
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
  const mk = (k, c) => `<marker id="lsArr-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  svg.innerHTML = `<defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}</defs>${paths}`;
  lbls.innerHTML = labels;
}
