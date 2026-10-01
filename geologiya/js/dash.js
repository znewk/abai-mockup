// Рабочие места процессов геологии (Dream TO BE). Демо-данные: участки, секторы, скважины и показатели вымышлены.
// Каждое: { steps: [коды шагов BPMN], html(), mount(root, rerender) }; sysWidget — мини-экран шага на вкладке «Процесс».

const nf = (v, d = 0) => Number(v).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const kpi = (v, l, sub, tone) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div>${sub ? `<div class="small ${tone || 'muted'}">${sub}</div>` : ''}</div>`;
const chip = (t, tone = '') => `<span class="chip ${tone}">${t}</span>`;
const sysChips = (list) => list.map((s) => `<span class="chip sys ${sysKind(s)}" title="${(SYS[s] || {}).desc || ''}">${s}</span>`).join(' ');
const card = (title, body, extra = '') => `<div class="card"><div class="card-h"><h2>${title}</h2>${extra}</div>${body}</div>`;
const stages = (list, at) => `<div class="stg">${list.map((s, i) => `<span class="${i < at ? 'ok' : i === at ? 'cur' : ''}" title="${s}">${i < at ? '✓' : ''}</span>`).join('')}</div>`;
const stHead = (list) => list.map((s) => `<span class="stg-h" title="${s}">${s.slice(0, 3)}</span>`).join('');

const DASH = {};

// ---------- Г1. Контракт: ИИ-ранжирование секторов в ЦРНС 2.0 ----------
DASH[1] = {
  steps: ['1.3.7', '1.3.8', '1.3.10', '1.3.12', '1.3.15', '1.3.18', '1.4'],
  top: 10,
  sectors: [
    { id: 'С-14', h: 'Ю-XIII', qn: 18.4, wc: 38, infra: 'куст 211 · 0,8 км', added: true },
    { id: 'С-22', h: 'Ю-XIV', qn: 16.9, wc: 42, infra: 'куст 207 · 1,2 км' },
    { id: 'С-07', h: 'Ю-XIII', qn: 15.2, wc: 35, infra: 'нужен шлейф 2,4 км' },
    { id: 'С-31', h: 'Ю-XV', qn: 13.8, wc: 47, infra: 'куст 219 · 0,5 км' },
    { id: 'С-19', h: 'Ю-XIV', qn: 12.6, wc: 51, infra: 'куст 207 · 1,9 км' },
  ],
  path: ['Кандидаты', 'НТС', 'ИК № 1', 'Контракт', 'Программа ГРР', 'ИК № 2', 'Права в ОМГ'],
  html() {
    const r = rnd(5);
    const cells = Array.from({ length: 96 }, (_, i) => { const v = r(); return `<i style="--v:${v.toFixed(2)}" class="${v > (this.top === 10 ? 0.9 : 0.8) ? 'top' : ''}"></i>`; }).join('');
    return `
      <div class="flow-strip mb">${sysChips(['ABAI ЦРНС 2.0'])}<span class="arrow">карты ОИЗ, НИЗ, ННТ из геомодели (Г3.4) → сетка → ИИ-ранжирование →</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">перечень кандидатов, НТС с ЭЦП →</span><span class="chip">ИК КМГ · контракт</span></div>
      <div class="stats">
        ${kpi('96', 'секторов в сетке · Узень, Ю-XIII–XV', 'пересчитаны 28.09 после публикации геомодели', 'good-t')}
        ${kpi(this.top === 10 ? '10' : '19', `секторов в ТОП-${this.top} %`, 'фильтр: обводнённость < 55 %')}
        ${kpi(this.sectors.filter((s) => s.added).length, 'точек в перечне кандидатов', 'единый перечень — в БД 2.0')}
        ${kpi('0', 'писем со справками и картами', 'было: пакет по участку в Outlook')}
      </div>
      <div class="grid g-1-2 mt">
        ${card('Сетка секторов · рейтинг ИИ', `<div class="card-b"><div class="seg mb"><button data-g1top="10" class="${this.top === 10 ? 'sel' : ''}">ТОП-10 %</button><button data-g1top="20" class="${this.top === 20 ? 'sel' : ''}">ТОП-20 %</button></div>
          <div class="heat">${cells}</div><div class="small muted mt-s">Цвет — рейтинг сектора: чем темнее, тем выше прогноз Qн при низкой обводнённости; обведены ТОП-${this.top} %</div></div>`, '<span class="muted small">ABAI ЦРНС 2.0</span>')}
        ${card('Отобранные секторы', `<table class="t"><thead><tr><th>Сектор</th><th>Горизонт</th><th class="num">Qн прогноз, т/сут</th><th class="num">Обводн.</th><th>Инфраструктура</th><th></th></tr></thead><tbody>
          ${this.sectors.map((s, i) => `<tr><td><b>${s.id}</b></td><td>${s.h}</td><td class="num">${nf(s.qn, 1)}</td><td class="num ${s.wc > 50 ? 'warn-t' : ''}">${s.wc} %</td><td>${s.infra}</td>
          <td class="num">${s.added ? chip('✓ в кандидатах', 'good') : `<button class="btn sm primary" data-g1="${i}">В кандидаты</button>`}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">прогноз Qж, Qн, обводнённость · альтернативные горизонты</span>')}
      </div>
      ${card('Путь к контракту на недропользование', `<div class="card-b"><div class="path">${this.path.map((p, i) => `<div class="${i < 1 ? 'ok' : i === 1 ? 'cur' : ''}"><b>${i + 1}</b><span>${p}</span></div>`).join('')}</div>
        <div class="row mt"><span class="small muted grow">Следующий шаг — НТС по перспективности участка: материалы из ЦРНС 2.0, решение и подписи — в БД 2.0 через NCA Layer.</span><button class="btn primary sm" id="g1nts">Сформировать перечень для НТС</button></div></div>`)}`;
  },
  mount(root, rerender) {
    root.querySelectorAll('[data-g1top]').forEach((b) => (b.onclick = () => { this.top = +b.dataset.g1top; rerender(); }));
    root.querySelectorAll('[data-g1]').forEach((b) => (b.onclick = () => { const s = this.sectors[+b.dataset.g1]; s.added = true; toast(`Сектор ${s.id} добавлен в список кандидатов (ЦРНС 2.0)`); rerender(); }));
    root.querySelector('#g1nts').onclick = () => toast(`Единый перечень: ${this.sectors.filter((s) => s.added).length} точ. — передан КМГИ (ГО) на проверку, НТС назначен`);
  },
};

// ---------- Г3. Доразведка: дорожная карта и проектные точки ----------
const G3_ST = ['Дорожная карта', 'ПП · ГПЗ · БП', 'СРР', 'Обработка', 'Интерпретация', 'Точки', 'Бурение', 'Керн и ГИС', 'Модель', 'Запасы ГКЗ'];
DASH[2] = {
  steps: ['3.1.1', '3.2', '3.5', '3.10.4', '3.20.11', '3.21.1', '3.22.1', '3.36'],
  fields: [
    { f: 'Узень · Ю-XIII–XV', at: 5, note: 'проектные точки на согласовании', act: 'points' },
    { f: 'Карамандыбас · Ю-I', at: 3, note: 'обработка сейсмики · PGSK' },
    { f: 'Узень · южное крыло', at: 7, note: 'керн 2 скв. в лаборатории КазНИПИ' },
    { f: 'Карамандыбас · Ю-III', at: 9, note: 'отчёт по подсчёту запасов в ГКЗ' },
  ],
  cand: [
    { w: 'Т-О-01', cat: 'C2', score: 0.91, ok: false }, { w: 'Т-О-02', cat: 'C2', score: 0.86, ok: false }, { w: '4517 (углубление)', cat: 'C2', score: 0.78, ok: true },
  ],
  html() {
    return `
      <div class="flow-strip mb">${sysChips(['ABAI БД 2.0'])}<span class="arrow">дорожная карта →</span><span class="chip">ПП · ГПЗ · БП без повторного ввода</span><span class="arrow">→</span>${sysChips(['ABAI ЦРНС 2.0'])}<span class="arrow">рейтинг секторов, LAS, керн, паспорта →</span>${sysChips(['ABAI Цифровое бурение'])}</div>
      <div class="stats">
        ${kpi('4', 'объекта доразведки в дорожной карте', '2026–2028 · утверждена КМГ')}
        ${kpi('62 %', 'обязательств по контракту выполнено', 'риск: 3D СРР Карамандыбас — 2 мес. запаса', 'warn-t')}
        ${kpi(this.cand.filter((c) => c.ok).length + ' из ' + this.cand.length, 'скважин-кандидатов C2 согласовано', 'ранжированный перечень ЦРНС')}
        ${kpi('0', 'ручных загрузок LAS и паспортов', 'подрядчик загружает сам, ОМГ подтверждает')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Объекты доразведки', `<table class="t"><thead><tr><th>Объект</th><th>Этап</th><th>${stHead(G3_ST)}</th><th></th></tr></thead><tbody>
          ${this.fields.map((x, i) => `<tr><td><b>${x.f}</b></td><td>${x.at >= G3_ST.length ? chip('✓ запасы утверждены', 'good') : `<b>${G3_ST[x.at]}</b>`}<div class="small muted">${x.note}</div></td><td>${stages(G3_ST, x.at)}</td>
          <td class="num">${x.act === 'points' ? `<button class="btn primary sm" data-g3="${i}">Согласовать точки</button>` : ''}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI БД 2.0 · маршрут согласования с ЭЦП</span>')}
        ${card('Скважины-кандидаты C2', `<table class="t"><thead><tr><th>Скв.</th><th>Кат.</th><th class="num">Рейтинг</th><th></th></tr></thead><tbody>
          ${this.cand.map((c, i) => `<tr><td><b>${c.w}</b></td><td>${c.cat}</td><td class="num">${nf(c.score, 2)}</td><td class="num">${c.ok ? chip('✓ согласовано', 'good') : `<button class="btn sm" data-g3c="${i}">Согласовать</button>`}</td></tr>`).join('')}</tbody></table>
          <div class="alarm warn" style="margin:10px 14px 14px"><b>Риск по обязательствам контракта</b><span>3D СРР Карамандыбас: выполнено 41 из 120 км² при 2 мес. до срока (реестр обязательств Г1)</span></div>`, '<span class="muted small">ABAI ЦРНС 2.0</span>')}
      </div>`;
  },
  mount(root, rerender) {
    root.querySelectorAll('[data-g3]').forEach((b) => (b.onclick = () => { const x = this.fields[+b.dataset.g3]; x.at = 6; x.note = 'точки согласованы КМГ с ЭЦП · план работ для ИСЭЗ'; delete x.act; toast('Проектные точки оценочного бурения согласованы, план работ выгружен для закупа в ИСЭЗ'); rerender(); }));
    root.querySelectorAll('[data-g3c]').forEach((b) => (b.onclick = () => { const c = this.cand[+b.dataset.g3c]; c.ok = true; toast(`Скважина ${c.w} согласована как кандидат на доразведку`); rerender(); }));
  },
};

// ---------- Г3.1. Полевые СРР: план-факт и качество данных ----------
DASH[3] = {
  steps: ['3.1.12', '3.1.13.1', '3.1.13.2', '3.1.13.4', '3.1.19', '3.1.20'],
  issues: [
    { what: 'Координаты 214 ПВ вне проектной сетки > 25 м', where: 'профили 1140–1162', sev: 'crit', sent: false },
    { what: 'Число каналов 9 812 при дизайне 10 080', where: 'сутки 23.09', sev: 'warn', sent: false },
    { what: 'Пустые заголовки SEG-D (field record)', where: '3 файла · 22.09', sev: 'warn', sent: true },
  ],
  html() {
    return `
      <div class="flow-strip mb"><span class="chip">Подрядчик: суточные сводки, SEG-D</span><span class="arrow">→</span>${sysChips(['ABAI ЦРНС 2.0'])}<span class="arrow">план-факт и автопроверка против дизайна СРР →</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">замечания подрядчику, приёмка →</span><span class="chip">Г3.2</span></div>
      <div class="stats">
        ${kpi('3D Узень-Юг', 'съёмка · 120 км²', 'сейсмопартия № 4 · с 02.09')}
        ${kpi('18 640 / 21 000', 'ПВ: факт / план на 30.09', '−11 % к графику', 'warn-t')}
        ${kpi('97,8 %', 'кондиционных записей', 'автопроверка SEG-D при загрузке')}
        ${kpi(this.issues.filter((x) => !x.sent).length, 'замечаний ждут отправки', 'формируются системой', this.issues.some((x) => !x.sent) ? 'warn-t' : 'good-t')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Пункты возбуждения: план и факт, нарастающим', '<div class="card-b"><div id="g31chart"></div></div>', '<span class="muted small">из суточных сводок · ABAI ЦРНС 2.0</span>')}
        ${card('Автопроверка полевых данных', `<div class="card-b"><div class="alarms">
          ${this.issues.map((x, i) => `<div class="alarm ${x.sev}"><b>${x.what}</b><span>${x.where} · ${x.sent ? 'направлено подрядчику' : 'не отправлено'}</span></div>`).join('')}</div>
          <div class="row mt">${this.issues.some((x) => !x.sent) ? '<button class="btn primary sm" id="g31send">Направить замечания подрядчику</button>' : chip('✓ все замечания направлены', 'good')}</div></div>`, '<span class="muted small">заголовки, координаты, ПВ, каналы</span>')}
      </div>`;
  },
  mount(root, rerender) {
    const days = 28, rows = [];
    let f = 0; const r = rnd(9);
    for (let i = 1; i <= days; i++) { f += 600 + (r() - 0.5) * 260 - (i > 18 ? 90 : 0); rows.push({ day: `${String(i + 2).padStart(2, '0')}.09`, plan: Math.round(21000 / days * i), fact: Math.round(Math.min(f, 18640 * i / days * 1.02)) }); }
    rows[rows.length - 1].fact = 18640;
    lineChart(root.querySelector('#g31chart'), rows, [{ key: 'plan', name: 'План', color: 'var(--series-1)', unit: 'ПВ' }, { key: 'fact', name: 'Факт', color: 'var(--series-2)', unit: 'ПВ' }], { height: 230, xLabel: (x) => x.day, tipTitle: (x) => x.day });
    const s = root.querySelector('#g31send');
    if (s) s.onclick = () => { this.issues.forEach((x) => (x.sent = true)); toast('Замечания автопроверки направлены подрядчику через ABAI'); rerender(); };
  },
};

// ---------- Г3.2. Обработка сейсмики ----------
const G32_ST = [['Приёмка данных', '05.09', '06.09'], ['Первичная подготовка', '12.09', '13.09'], ['Повышение качества', '26.09', '27.09'], ['Скоростная модель', '10.10', null], ['Временная / глубинная', '31.10', null], ['Отчёт и комплект', '14.11', null]];
DASH[4] = {
  steps: ['3.2.2', '3.2.5.2.-3.2.7.2', '3.2.9.1', '3.2.10'],
  appr: { 'ОМГ': 'wait', 'КМГ': 'ok', 'КМГИ (ГО)': 'wait' },
  html() {
    const tone = { ok: chip('✓ согласовано', 'good'), wait: chip('на рассмотрении', 'warn') };
    return `
      <div class="flow-strip mb">${sysChips(['ABAI ЦРНС 2.0'])}<span class="arrow">пакет исходных данных по полигону, доступ PGSK →</span>${sysChips(['Spark'])}<span class="arrow">обработка, результаты через интеграцию →</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">параллельное согласование с ЭЦП →</span><span class="chip">Г3.3</span></div>
      <div class="stats">
        ${kpi('3D Узень-Юг', 'объект обработки', 'PGSK · договор до 30.11')}
        ${kpi('3 из 6', 'этапов выполнено', 'по графику обработки и интерпретации')}
        ${kpi('+1 сут', 'отставание по этапу «Повышение качества»', 'уведомление ОМГ 27.09', 'warn-t')}
        ${kpi('0', 'носителей и писем с результатами', 'было: физ. носители и Email')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('График обработки', `<table class="t"><thead><tr><th>Этап</th><th>План</th><th>Факт</th><th></th></tr></thead><tbody>
          ${G32_ST.map(([n, p, f]) => `<tr><td>${n}</td><td>${p}</td><td>${f || '—'}</td><td>${f ? (f > p ? chip('+1 сут', 'warn') : chip('✓ в срок', 'good')) : chip('впереди')}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">план-факт считается автоматически</span>')}
        ${card('Промежуточный результат: согласование', `<div class="card-b"><div class="small muted">Раздел отчёта «Повышение качества сигнала» · SEG-Y · 27.09</div>
          <table class="t mt-s"><tbody>${Object.entries(this.appr).map(([k, v]) => `<tr><td>${roleChip(k)}</td><td>${tone[v]}</td></tr>`).join('')}</tbody></table>
          <div class="row mt">${this.appr['ОМГ'] === 'wait' ? '<button class="btn primary sm" id="g32ok">Согласовать (ЭЦП)</button><button class="btn sm" id="g32back">Замечания</button>' : chip('✓ ОМГ согласовало', 'good')}</div></div>`, '<span class="muted small">параллельный маршрут ОМГ · КМГ · КМГИ</span>')}
      </div>`;
  },
  mount(root, rerender) {
    const a = root.querySelector('#g32ok'), b = root.querySelector('#g32back');
    if (a) a.onclick = () => { this.appr['ОМГ'] = 'ok'; toast('Результат согласован ОМГ с ЭЦП; ждём КМГИ (ГО)'); rerender(); };
    if (b) b.onclick = () => toast('Замечания к промежуточным результатам направлены PGSK');
  },
};

// ---------- Г3.3. Интерпретация: слои для ЦРНС ----------
DASH[5] = {
  steps: ['3.3.1.2.-3.3.11.2', '3.3.9.1', '3.3.13', '3.3.14.1'],
  layers: [
    { n: 'Структурная карта по кровле Ю-XIII', fmt: '.grd', chk: [1, 1, 1], pub: true },
    { n: 'Атрибутная карта RMS-амплитуд', fmt: '.grd', chk: [1, 1, 1], pub: false },
    { n: 'Прогноз пористости (вероятностная карта)', fmt: '.grd', chk: [1, 1, 0], pub: false },
    { n: 'Перспективные зоны и рекомендации', fmt: '.shp', chk: [1, 1, 1], pub: false },
  ],
  html() {
    const ck = (v) => (v ? '<span class="good-t">✓</span>' : '<span class="crit-t">✕</span>');
    return `
      <div class="flow-strip mb">${sysChips(['SLB Petrel', 'Kingdom'])}<span class="arrow">интерпретация через интеграцию →</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">интерпретационный пакет, перспективные зоны →</span>${sysChips(['ABAI ЦРНС 2.0'])}<span class="arrow">публикация слоёв запускает →</span><span class="chip">Г3.4</span></div>
      <div class="stats">
        ${kpi('8 из 11', 'этапов интерпретации выполнено', 'план-факт по графику')}
        ${kpi(this.layers.filter((l) => l.pub).length + ' из ' + this.layers.length, 'слоёв опубликовано в ЦРНС 2.0', 'проверка СК, экстента, атрибутов')}
        ${kpi('ГТС 14.10', 'рассмотрение окончательного отчёта', 'протокол — в ABAI с ЭЦП')}
        ${kpi('0', 'отчётов на носителях и по Email', 'отчёт загружается в ABAI')}
      </div>
      ${card('Слои для ЦРНС 2.0', `<table class="t"><thead><tr><th>Слой</th><th>Формат</th><th>СК</th><th>Экстент</th><th>Атрибуты</th><th></th></tr></thead><tbody>
        ${this.layers.map((l, i) => `<tr><td><b>${l.n}</b></td><td>${l.fmt}</td>${l.chk.map((v) => `<td>${ck(v)}</td>`).join('')}
        <td class="num">${l.pub ? chip('✓ опубликован', 'good') : l.chk.every(Boolean) ? `<button class="btn primary sm" data-g33="${i}">Опубликовать</button>` : chip('нет атрибута «вероятность»', 'crit')}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">проверка при загрузке · ABAI ЦРНС 2.0</span>')}`;
  },
  mount(root, rerender) {
    root.querySelectorAll('[data-g33]').forEach((b) => (b.onclick = () => {
      const l = this.layers[+b.dataset.g33]; l.pub = true;
      toast(this.layers.filter((x) => x.chk.every(Boolean)).every((x) => x.pub) ? 'Слои опубликованы — КазНИПИ получил задачу на актуализацию геомодели (Г3.4)' : `Слой «${l.n}» опубликован в ЦРНС 2.0`);
      rerender();
    }));
  },
};

// ---------- Г3.4. Геологическая модель ----------
const G34_ST = ['ТЗ', 'Исходные данные', 'Корреляция', 'Каркас', 'Петрофизика', 'Контакты', 'Литология', 'Кубы свойств', 'Сопоставление', 'Согласование', 'Публикация'];
DASH[6] = {
  steps: ['3.4.1', '3.4.10', '3.4.11', '3.4.13', '3.4.15'],
  models: [
    { m: 'Узень · Ю-XIII–XV', at: 9, note: 'модель v4 ждёт внутреннего согласования', act: 'sign' },
    { m: 'Карамандыбас · Ю-I–III', at: 4, note: 'Techlog · интервалы коллекторов' },
    { m: 'Узень · южное крыло', at: 1, note: 'задача создана после публикации слоёв Г3.3' },
  ],
  html() {
    return `
      <div class="flow-strip mb"><span class="chip">Публикация интерпретации (Г3.3) или новых скважин (Г3)</span><span class="arrow">→ задача →</span>${sysChips(['ABAI ЦРНС 2.0'])}<span class="arrow">исходные данные через интеграцию →</span>${sysChips(['SLB Petrel', 'SLB Techlog'])}<span class="arrow">→ согласование с ЭЦП →</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">→ публикация →</span><span class="chip">Г1 · Г3 · Р5</span></div>
      <div class="stats">
        ${kpi(this.models.length, 'моделей в работе', 'КазНИПИ')}
        ${kpi('2', 'задачи созданы автоматически', 'по публикации данных Г3 и Г3.3')}
        ${kpi('III кв.', 'промежуточное рассмотрение', 'план-факт формируется сам', 'good-t')}
        ${kpi('96', 'секторов пересчитают после публикации', 'ИИ-ранжирование Г1 и Г3')}
      </div>
      ${card('Модели', `<table class="t"><thead><tr><th>Модель</th><th>Этап</th><th>${stHead(G34_ST)}</th><th></th></tr></thead><tbody>
        ${this.models.map((x, i) => `<tr><td><b>${x.m}</b></td><td>${x.at >= G34_ST.length ? chip('✓ опубликована', 'good') : `<b>${G34_ST[x.at]}</b>`}<div class="small muted">${x.note}</div></td><td>${stages(G34_ST, x.at)}</td>
        <td class="num">${x.act === 'sign' ? `<button class="btn primary sm" data-g34="${i}">Согласовать (ЭЦП)</button>` : x.act === 'pub' ? `<button class="btn primary sm" data-g34="${i}">Опубликовать в ЦРНС</button>` : ''}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI ЦРНС 2.0 · БД 2.0</span>')}`;
  },
  mount(root, rerender) {
    root.querySelectorAll('[data-g34]').forEach((b) => (b.onclick = () => {
      const x = this.models[+b.dataset.g34];
      if (x.act === 'sign') { x.at = 10; x.act = 'pub'; x.note = 'согласована с ЭЦП · отчёт и карты для ЦРНС готовы'; toast('Модель согласована; материалы приняты ОМГ'); }
      else { x.at = 11; delete x.act; x.note = 'опубликована · слои доступны в ЦРНС 2.0'; toast('Модель опубликована: запущен пересчёт ИИ-ранжирования секторов (Г1, Г3), Р5 получил актуальную модель'); }
      rerender();
    }));
  },
};

// ---------- Мини-экраны ABAI на вкладке «Процесс» ----------
function sysWidget(t, num) {
  const has = (s) => t.sys.includes(s);
  const win = (title, body) => `<div class="mini"><div class="mini-top"><i></i><b>ABAI</b><span>${title}</span></div><div class="mini-b">${body}</div></div>`;
  const txt = t.title.toLowerCase();
  if (has('ABAI ЦРНС 2.0') && /ранжир|сетк|сектор/.test(txt)) return win('ЦРНС 2.0 · ИИ-ранжирование секторов', `<div class="mini-kpi"><div><b>96</b><span>секторов</span></div><div><b class="good-t">10</b><span>в ТОП-10 %</span></div><div><b>18,4</b><span>Qн прогноз, т/сут</span></div></div><div class="alarm ok"><b>Сетка пересчитана 28.09</b><span>после публикации геомодели (Г3.4)</span></div>`);
  if (has('ABAI ЦРНС 2.0') && /мониторинг|контрол|план-факт|сроков/.test(txt)) return win('ЦРНС 2.0 · план-факт работ', `<div class="mini-kpi"><div><b>18 640</b><span>ПВ факт</span></div><div><b>21 000</b><span>ПВ план</span></div><div><b class="warn-t">−11 %</b><span>к графику</span></div></div><div class="alarm warn"><b>Отставание от графика</b><span>уведомление отправлено автоматически</span></div>`);
  if (has('ABAI ЦРНС 2.0') && /качеств|проверк|приемк|приёмк|комплектн/.test(txt)) return win('ЦРНС 2.0 · автопроверка данных', `<table class="t"><tr><td>Заголовки SEG-D</td><td>${chip('✓', 'good')}</td></tr><tr><td>Координаты против дизайна</td><td>${chip('214 ПВ вне сетки', 'crit')}</td></tr><tr><td>Комплектность по метаданным</td><td>${chip('✓', 'good')}</td></tr></table>`);
  if (has('ABAI ЦРНС 2.0') && /публикац|слоё|слое|карт/.test(txt)) return win('ЦРНС 2.0 · публикация слоёв', `<table class="t"><tr><td>Структурная карта Ю-XIII</td><td>${chip('опубликован', 'good')}</td></tr><tr><td>Прогноз пористости</td><td>${chip('проверка', 'warn')}</td></tr></table><div class="alarm ok"><b>Публикация запускает следующий процесс</b><span>задача создаётся автоматически</span></div>`);
  if (has('ABAI ЦРНС 2.0') && (has('SLB Petrel') || has('Kingdom') || has('SLB Techlog'))) return win('ЦРНС 2.0 ⇄ Petrel · через интеграцию', `<div class="mini-flow"><span>ЦРНС 2.0: исходные данные</span><em>→</em><span>${t.sys.filter((s) => sysKind(s) === 'ext').join(', ')}</span><em>→</em><span class="hl">результат — обратно в ABAI</span></div>`);
  if (has('ABAI ЦРНС 2.0')) return win('ЦРНС 2.0 · данные участка', `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc((t.docs[0] || t.title).replace(/\s*\([^)]*\)$/, ''))}</div><div class="sub">загружено в ЦРНС 2.0 · доступно всем ролям процесса</div></div>${chip('в системе', 'good')}</div>`);
  if (has('ABAI БД 2.0') && /соглас|утвержд|рассмотр|нтс|гтс/.test(txt)) return win('БД 2.0 · маршрут согласования', `<table class="t"><tr><td>${roleChip('ОМГ (ДЗО)')}</td><td>${chip('✓ ЭЦП', 'good')}</td></tr><tr><td>${roleChip('КМГИ (ГО)')}</td><td>${chip('на рассмотрении · срок 2 дня', 'warn')}</td></tr><tr><td>${roleChip('КМГ')}</td><td>${chip('ожидает')}</td></tr></table>`);
  if (has('ИСЭЗ Самрук-Казына')) return win('Закупка · ИСЭЗ Самрук-Казына', `<div class="doc"><div class="ic pdf">PDF</div><div class="grow"><div class="name">${esc((t.docs[0] || 'Техническая спецификация').replace(/\s*\([^)]*\)$/, ''))}</div><div class="sub">выгружено из ABAI для закупа</div></div>${chip('в закупке', 'warn')}</div>`);
  if (has('АВР+')) return win('АВР+ · акт работ', `<div class="doc"><div class="ic pdf">PDF</div><div class="grow"><div class="name">Акт выполненных работ</div><div class="sub">согласование — Directum, оплата — SAP ERP</div></div>${chip('на подписании', 'warn')}</div>`);
  return defaultWidget(t);
}
