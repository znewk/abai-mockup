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
      <div class="ls-fbody"><div class="ls-focus"></div>
        <ol class="ls-fsteps">${fl.e.map(([f, t, w, r, k], i) => `<li data-fi="${i}" class="k-${k}"><b>${i + 1}</b><div><span class="ft">${f} → ${t}</span>${w}<em>${r} · ${LS_KINDS[k]}</em></div></li>`).join('')}</ol></div>
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
  const drawFocus = (o) => focus && lsFocus(focus, grid, base, view, o);
  draw(base); drawFocus();
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
      lsBus(pop.querySelector('.ls-focus'), grid, key, list, view);
      // Схема вертикальная: ставим сбоку от системы, если не влезает по высоте — уменьшаем
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
  // Наведение на пункт списка — выделить одну стрелку
  root.querySelectorAll('[data-fi]').forEach((li) => {
    li.onmouseenter = () => drawFocus({ hot: +li.dataset.fi });
    li.onmouseleave = () => drawFocus();
  });
  if (root._ro) root._ro.disconnect();
  root._ro = new ResizeObserver(() => { draw(base); drawFocus(); });
  root._ro.observe(grid);
}

// ---------- Компактная схема сценария: только участвующие системы, снизу вверх по направлению потока (как на большой схеме) ----------
// Группа системы на компактной схеме: в какой ЦД / слой она входит на большой схеме
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
  const mk = (k, c) => `<marker id="lsfArr-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  host.innerHTML = `<div class="ls-fcanvas v-${view}" style="width:${CW}px;height:${CH}px">
    ${[...groups.values()].map((g) => `<div class="ls-fgrp g-${g.type}" style="left:${g.x + sh}px;top:${g.y + sv}px;width:${g.w}px;height:${g.h}px"><span>${g.title}</span></div>`).join('')}
    <svg width="${CW}" height="${CH}"><defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}</defs><g transform="translate(${sh},${sv})">${paths}</g></svg>
    ${[...nodes.values()].map((n) => `<div class="ls-fnode k-${n.kind}" style="left:${n.x + sh}px;top:${n.y0 + sv}px;width:${NW}px;height:${NH}px"><b>${n.k}</b></div>`).join('')}
    <div class="ls-flbls" style="transform:translate(${sh}px,${sv}px)">${labels}</div>
  </div>`;
  // Второй проход: раскладка подписей по их реальной высоте
  if (!o._h) lsFocus(host, grid, edges, view, Object.assign({}, o, { _h: [...host.querySelectorAll('.ls-fl')].map((x) => x.offsetHeight) }));
}

// ---------- Всплывающая схема связей одной системы ----------
// Система — широкая полоса посередине; кто передаёт ей данные — снизу, кому передаёт она — сверху (снизу вверх, как большая схема).
// Каждая связь — прямая вертикальная стрелка под своей системой, подпись — на стрелке; двусторонняя связь — две стрелки рядом.
const LS_ROW_ORDER = ['users', 'eng', 'cd', 'data', 'manual', 'ext', 'mes', 'asu'];
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
  const NW = 156, NH = 42, CG = 18, P = 10, HDR = 22, GG = 18, BH = 58, LW = NW + CG - 6, M = 20;
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
      labels += `<div class="ls-fl k-${it.e.k}" data-i="${it.i}" style="left:${cx - LW / 2}px;top:${ty}px;width:${LW}px"><b>${it.upArrow ? '↑' : '↓'}</b><span>${it.e.w}<em>${it.e.r}</em></span></div>`;
      ty += it.h + 6;
    });
  });
  const mk = (k, c) => `<marker id="lsbArr-${k}" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`;
  const nIn = list.filter((e) => e.t === key).length, nOut = list.length - nIn;
  host.innerHTML = `<div class="ls-fcanvas v-${view}" style="width:${W}px;height:${H}px">
    ${gl.map((g) => `<div class="ls-fgrp g-${g.type}" style="left:${g.x}px;top:${g.y}px;width:${g.w}px;height:${FH}px"><span>${g.title}</span></div>`).join('')}
    <svg width="${W}" height="${H}"><defs>${mk('auto', '#2a78d6')}${mk('input', '#0f7a55')}${mk('seq', '#6b7383')}${mk('manual', '#c2413a')}${mk('int', '#d08a1e')}</defs>${paths}</svg>
    <div class="ls-fnode ls-bus k-${me.kind}" style="left:0;top:${yBus}px;width:${W}px;height:${BH}px"><span>${me.g.title}</span><b>${key}</b><span>${[nIn ? `получает: ${nIn}` : '', nOut ? `передаёт: ${nOut}` : ''].filter(Boolean).join(' · ')}</span></div>
    ${[...peers.values()].map((p) => `<div class="ls-fnode k-${p.kind}" style="left:${p.x}px;top:${p.y0}px;width:${NW}px;height:${NH}px"><b>${p.k}</b></div>`).join('')}
    <div class="ls-flbls">${labels}</div>
  </div>`;
  // Второй проход: подписи по их реальной высоте
  if (!o._h) {
    const h = [];
    host.querySelectorAll('.ls-fl[data-i]').forEach((x) => (h[+x.dataset.i] = x.offsetHeight));
    lsBus(host, grid, key, list, view, { _h: h });
  }
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
