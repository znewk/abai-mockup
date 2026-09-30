// Рабочие места процессов добычи (Dream TO BE). Демо-данные.
// Каждое: { role, steps: [коды шагов BPMN], html(), mount(root) }

const NGDU = ['Доссормунайгаз', 'Жайыкмунайгаз', 'Жылыоймунайгаз', 'Кайнармунайгаз'];
const nf = (v, d = 0) => Number(v).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const kpi = (v, l, sub, tone) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div>${sub ? `<div class="small ${tone || 'muted'}">${sub}</div>` : ''}</div>`;
const chip = (t, tone = '') => `<span class="chip ${tone}">${t}</span>`;
const sysChips = (list) => list.map((s) => `<span class="chip sys ${sysKind(s)}" title="${(SYS[s] || {}).desc || ''}">${s}</span>`).join(' ');
const card = (title, body, extra = '') => `<div class="card"><div class="card-h"><h2>${title}</h2>${extra}</div>${body}</div>`;
const days = (n, start = new Date(2026, 8, 1)) => Array.from({ length: n }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
const dshort = (d) => d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });

const DASH = {};

// ---------- Д1. Учёт добычи: суточная сводка и сверка источников ----------
DASH[1] = {
  steps: ['1.2а', '1.5', '1.6', '1.7', '1.8'],
  rows: [
    { ngdu: NGDU[0], sdmo: 6412, gd: 6398, im: 6405, full: 99.2, st: 'ok' },
    { ngdu: NGDU[1], sdmo: 5874, gd: 5690, im: 5866, full: 96.1, st: 'diff' },
    { ngdu: NGDU[2], sdmo: 7208, gd: 7196, im: 7211, full: 98.7, st: 'wait' },
    { ngdu: NGDU[3], sdmo: 4821, gd: 4815, im: 4818, full: 94.3, st: 'gap' },
  ],
  html() {
    const r = this.rows;
    const st = { ok: chip('✓ Подтверждено', 'good'), wait: chip('Ожидает ЦИТО', 'warn'), diff: chip('Расхождение 3,1 %', 'crit'), gap: chip('Неполные данные', 'crit'), ask: chip('Уточнение у СОУП', 'warn') };
    const total = r.reduce((a, x) => a + x.sdmo, 0);
    return `
      <div class="flow-strip mb">${sysChips(['СДМО', 'Green Data', 'ИМ'])}<span class="arrow">→</span>${sysChips(['КХД'])}<span class="arrow">→ проверка полноты и расхождений →</span>${sysChips(['ABAI ПДИМ 2.0'])}<span class="arrow">→ подтверждение ЦИТО →</span><span class="chip">Сводка ДЗО</span></div>
      <div class="stats">
        ${kpi(nf(total), 'нефть, т/сут · 29.09.2026', 'план 24 600 · −' + nf((1 - total / 24600) * 100, 1) + ' %', 'warn-t')}
        ${kpi('97,1 %', 'полнота данных (ПДИМ 2.0)', '2 аларма полноты', 'warn-t')}
        ${kpi(r.filter((x) => x.st === 'ok').length + ' из 4', 'НГДУ подтверждено ЦИТО')}
        ${kpi('0', 'Excel-сводок и писем', 'было: 5 отчётов Excel, 4 запроса в Outlook')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Сверка источников по НГДУ, т/сут', `<table class="t"><thead><tr><th>НГДУ</th><th class="num">СДМО</th><th class="num">Green Data</th><th class="num">ИМ</th><th class="num">Полнота</th><th>Статус</th><th></th></tr></thead><tbody>
          ${r.map((x, i) => `<tr><td><b>${x.ngdu}</b></td><td class="num">${nf(x.sdmo)}</td><td class="num ${Math.abs(x.gd - x.sdmo) / x.sdmo > 0.02 ? 'crit-t' : ''}">${nf(x.gd)}</td><td class="num">${nf(x.im)}</td><td class="num ${x.full < 95 ? 'crit-t' : ''}">${nf(x.full, 1)} %</td><td>${st[x.st]}</td>
          <td class="num">${x.st === 'wait' ? `<button class="btn primary sm" data-d1="ok" data-i="${i}">Подтвердить</button>` : x.st === 'diff' || x.st === 'gap' ? `<button class="btn sm" data-d1="ask" data-i="${i}">Запросить уточнение</button>` : ''}</td></tr>`).join('')}
          </tbody></table>`)}
        ${card('Алармы ПДИМ 2.0', `<div class="alarms">
          <div class="alarm crit"><b>Нет замера по 14 скважинам</b><span>${NGDU[3]} · ГЗУ-17 · с 06:00</span></div>
          <div class="alarm crit"><b>Расхождение Green Data / СДМО 3,1 %</b><span>${NGDU[1]} · порог 2 %</span></div>
          <div class="alarm warn"><b>Замер старше 3 суток</b><span>${NGDU[2]} · 6 скважин</span></div>
          <div class="alarm ok"><b>Данные СДМО получены</b><span>все НГДУ · 06:15</span></div></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    root.querySelectorAll('[data-d1]').forEach((b) => (b.onclick = () => {
      const x = this.rows[+b.dataset.i];
      x.st = b.dataset.d1 === 'ok' ? 'ok' : 'ask';
      toast(b.dataset.d1 === 'ok' ? `${x.ngdu}: данные подтверждены и ушли в сводку ДЗО` : `${x.ngdu}: запрос на уточнение отправлен в СОУП НГДУ`);
      rerender();
    }));
  },
};

// ---------- Д2. Мониторинг добычи: план/факт и отклонения ----------
DASH[2] = {
  steps: ['2.2', '2.3', '2.4', '2.5', '2.8'],
  devs: [
    { well: '1284', ngdu: NGDU[1], loss: 18.4, since: '26.09', cause: 'Отказ ГНО', cls: 'ГНО' },
    { well: '3057', ngdu: NGDU[0], loss: 11.2, since: '27.09', cause: 'Снижение подачи', cls: '' },
    { well: '0719', ngdu: NGDU[2], loss: 9.6, since: '28.09', cause: 'Останов по энергетике', cls: 'Энергетика' },
    { well: '2231', ngdu: NGDU[3], loss: 7.1, since: '28.09', cause: 'Рост обводнённости', cls: '' },
  ],
  html() {
    return `
      <div class="stats">
        ${kpi('24 318', 'факт, т/сут', 'план 24 600')}${kpi('−282', 'отклонение, т/сут', '−1,1 % к плану', 'crit-t')}
        ${kpi(this.devs.length, 'карточки отклонений', this.devs.filter((d) => !d.cls).length + ' без классификации', 'warn-t')}
        ${kpi('7', 'мероприятий в работе', 'ПАЭГТМ')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('План / факт добычи нефти, т/сут · сентябрь', `<div class="card-b"><div class="legend"><span><i style="background:var(--series-1)"></i>План</span><span><i style="background:var(--series-2)"></i>Факт</span></div><div id="d2chart"></div></div>`)}
        ${card('Структура потерь, т/сут', `<div class="card-b"><div id="d2loss"></div></div>`)}
      </div>
      ${card('Карточки отклонений', `<table class="t"><thead><tr><th>Скважина</th><th>НГДУ</th><th class="num">Потери, т/сут</th><th>С</th><th>Признак (ТР 2.0)</th><th>Классификация причины</th><th></th></tr></thead><tbody>
        ${this.devs.map((d, i) => `<tr><td><b>${d.well}</b></td><td>${d.ngdu}</td><td class="num">${nf(d.loss, 1)}</td><td>${d.since}</td><td>${d.cause}</td>
        <td><select class="sel" data-d2="${i}"><option value="">— выбрать —</option>${['ГНО', 'НПО', 'Пласт', 'Энергетика', 'Инфраструктура'].map((c) => `<option ${d.cls === c ? 'selected' : ''}>${c}</option>`).join('')}</select></td>
        <td>${d.cls ? `<button class="btn sm" data-d2m="${i}">В мероприятие</button>` : ''}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI ПДИМ 2.0 · ТР 2.0</span>')}`;
  },
  mount(root, rerender) {
    const r = rnd(7);
    const rows = days(29).map((d, i) => ({ date: d, plan: 24600, fact: Math.round(24600 - 120 - i * 6 + (r() - 0.5) * 260) }));
    lineChart(root.querySelector('#d2chart'), rows, [{ key: 'plan', name: 'План', color: 'var(--series-1)', unit: 'т/сут' }, { key: 'fact', name: 'Факт', color: 'var(--series-2)', unit: 'т/сут' }],
      { height: 230, xLabel: (x) => dshort(x.date), tipTitle: (x) => x.date.toLocaleDateString('ru-RU') });
    barChart(root.querySelector('#d2loss'), [
      { label: 'Отказы ГНО', value: 118, highlight: true }, { label: 'ВСП / ПРС', value: 64 }, { label: 'Энергетика', value: 41 }, { label: 'Пласт', value: 37 }, { label: 'Прочее', value: 22 },
    ], { unit: 'т/сут', valueName: 'Потери', median: false });
    root.querySelectorAll('[data-d2]').forEach((s) => (s.onchange = () => { this.devs[+s.dataset.d2].cls = s.value; toast('Причина классифицирована в карточке отклонения'); rerender(); }));
    root.querySelectorAll('[data-d2m]').forEach((b) => (b.onclick = () => toast(`Скв. ${this.devs[+b.dataset.d2m].well}: мероприятие создано в ПАЭГТМ и передано на экспертизу ДДНГ`)));
  },
};

// ---------- Д3. Потенциал базовой добычи ----------
DASH[3] = {
  steps: ['3.4', '3.4а', '3.5', '3.8', '3.9'],
  sc: 1,
  html() {
    const scs = [
      { n: 'Базовый', d: 0, capex: 0, opex: 0, npv: 0, note: 'Текущие режимы' },
      { n: 'Оптимизация режимов', d: 610, capex: 0.4, opex: 1.1, npv: 9.8, note: 'ТР 2.0 + ПГНО: смена режимов на 142 скв.' },
      { n: 'Режимы + ОПЗ / ГРП', d: 1180, capex: 6.2, opex: 2.4, npv: 14.1, note: '+ 38 скв. с ОПЗ и 9 ГРП' },
    ];
    return `
      <div class="stats">${kpi('21 900', 'базовая добыча, т/сут')}${kpi('23 450', 'потенциал, т/сут', 'ПДИМ 2.0 + ТР 2.0 + ПГНО')}${kpi('1 550', 'недобор к потенциалу, т/сут', '7,1 %', 'crit-t')}${kpi('3', 'сценария оценены', 'шаг 3.4а')}</div>
      <div class="grid g-1-1 mt">
        ${card('Недобор к потенциалу по НГДУ, т/сут', `<div class="card-b"><div id="d3gap"></div></div>`)}
        ${card('Сценарии потенциала (шаг 3.4а)', `<table class="t"><thead><tr><th>Сценарий</th><th class="num">Δ, т/сут</th><th class="num">CAPEX, млрд ₸</th><th class="num">NPV, млрд ₸</th><th></th></tr></thead><tbody>
          ${scs.map((s, i) => `<tr class="${i === this.sc ? 'me' : ''}"><td><b>${s.n}</b><div class="small muted">${s.note}</div></td><td class="num">${s.d ? '+' + nf(s.d) : '—'}</td><td class="num">${s.capex ? nf(s.capex, 1) : '—'}</td><td class="num">${s.npv ? nf(s.npv, 1) : '—'}</td>
          <td>${i ? `<button class="btn sm ${i === this.sc ? 'primary' : ''}" data-d3="${i}">${i === this.sc ? 'Выбран' : 'Выбрать'}</button>` : ''}</td></tr>`).join('')}</tbody></table>
          <div class="card-b"><button class="btn good" id="d3dec">Принять решение и инициировать изменение ПП</button></div>`)}
      </div>
      ${card('Эффективность ранее реализованных мероприятий (ПАЭГТМ)', `<table class="t"><thead><tr><th>Мероприятие</th><th class="num">Скважин</th><th class="num">План, т/сут</th><th class="num">Факт, т/сут</th><th class="num">Успешность</th></tr></thead><tbody>
        <tr><td>Оптимизация режимов</td><td class="num">96</td><td class="num">410</td><td class="num">452</td><td class="num">${chip('110 %', 'good')}</td></tr>
        <tr><td>ОПЗ</td><td class="num">41</td><td class="num">290</td><td class="num">236</td><td class="num">${chip('81 %', 'warn')}</td></tr>
        <tr><td>ГРП</td><td class="num">12</td><td class="num">260</td><td class="num">271</td><td class="num">${chip('104 %', 'good')}</td></tr></tbody></table>`)}`;
  },
  mount(root, rerender) {
    barChart(root.querySelector('#d3gap'), [
      { label: NGDU[1].slice(0, 12), value: 520, highlight: true }, { label: NGDU[0].slice(0, 12), value: 430 }, { label: NGDU[2].slice(0, 12), value: 380 }, { label: NGDU[3].slice(0, 12), value: 220 },
    ], { unit: 'т/сут', valueName: 'Недобор', median: false });
    root.querySelectorAll('[data-d3]').forEach((b) => (b.onclick = () => { this.sc = +b.dataset.d3; rerender(); }));
    root.querySelector('#d3dec').onclick = () => toast('Решение зафиксировано в БД 2.0, проект изменения ПП передан на согласование в Дирекцию');
  },
};

// ---------- Д4. ИМА: пласт – скважина – инфраструктура ----------
DASH[4] = {
  steps: ['4.2а', '4.3', '4.4', '4.6', '4.7'],
  html() {
    const node = (x, y, w, t, s, tone = '') => `<g class="ima-node ${tone}"><rect x="${x}" y="${y}" width="${w}" height="54" rx="8"/><text x="${x + 12}" y="${y + 22}" class="t">${t}</text><text x="${x + 12}" y="${y + 41}" class="s">${s}</text></g>`;
    const link = (x1, y1, x2, y2, tone = '') => `<path class="ima-link ${tone}" d="M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}"/>`;
    return `
      <div class="stats">${kpi('99 %', 'загрузка ДНС-3', 'узкое место', 'crit-t')}${kpi('+340', 'т/сут при снятии ограничения')}${kpi('3', 'варианта решения')}${kpi('14.09', 'модель актуализирована', 'шаг 4.2а')}</div>
      ${card('Интегрированная модель актива · месторождение Кенбай (демо)', `<div class="card-b"><svg viewBox="0 0 1080 300" class="ima">
        ${link(190, 60, 290, 60)}${link(190, 150, 290, 150)}${link(190, 240, 290, 240)}
        ${link(470, 60, 570, 105)}${link(470, 150, 570, 105)}${link(470, 240, 570, 215)}
        ${link(750, 105, 850, 150, 'hot')}${link(750, 215, 850, 150)}
        ${node(20, 33, 170, 'Пласт Ю-III', 'Рпл 118 атм · обв. 71 %')}${node(20, 123, 170, 'Пласт Ю-IV', 'Рпл 104 атм · обв. 64 %')}${node(20, 213, 170, 'Пласт К-I', 'Рпл 96 атм · обв. 58 %')}
        ${node(290, 33, 180, 'Куст 12 · 24 скв.', 'Qж 1 920 т/сут')}${node(290, 123, 180, 'Куст 17 · 31 скв.', 'Qж 2 410 т/сут')}${node(290, 213, 180, 'Куст 21 · 18 скв.', 'Qж 1 150 т/сут')}
        ${node(570, 78, 180, 'АГЗУ-5 → коллектор', 'P 14 атм')}${node(570, 188, 180, 'АГЗУ-8 → коллектор', 'P 11 атм')}
        ${node(850, 123, 200, 'ДНС-3', 'загрузка 99 % · предел 5 500', 'hot')}
      </svg></div>`, '<span class="muted small">ABAI БД 2.0 · ПГНО · ПДИМ 2.0</span>')}
      <div class="grid g-1-1 mt">
        ${card('Варианты технического решения', `<table class="t"><thead><tr><th>Вариант</th><th class="num">Δ, т/сут</th><th class="num">CAPEX, млн ₸</th><th>Расчёт</th></tr></thead><tbody>
          <tr><td>A. Перераспределение потоков АГЗУ-5 → ДНС-2</td><td class="num">+180</td><td class="num">35</td><td>${sysChips(['UniSim'])}</td></tr>
          <tr class="me"><td>B. Доп. насосный агрегат на ДНС-3</td><td class="num">+340</td><td class="num">420</td><td>${sysChips(['UniSim', 'Questor'])}</td></tr>
          <tr><td>C. Замена участка коллектора Ø219 → Ø273</td><td class="num">+260</td><td class="num">610</td><td>${sysChips(['AutoCAD', 'Questor'])}</td></tr></tbody></table>`)}
        ${card('Рекомендации и проверка ДГиР', `<div class="card-b docs">
          <div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">Рекомендации по техническому решению</div><div class="sub">вариант B · ДДНГ · 22.09.2026</div></div>${chip('в БД 2.0')}</div>
          <div class="doc"><div class="ic">XLS</div><div class="grow"><div class="name">Оценка применимости с учётом разработки</div><div class="sub">ДГиР · ABAI ЦРНС 2.0</div></div>${chip('на проверке', 'warn')}</div>
          <button class="btn primary mt-s" id="d4dec">Передать на решение о корректировке ПП</button></div>`)}
      </div>`;
  },
  mount(root) { root.querySelector('#d4dec').onclick = () => toast('Рекомендации переданы на решение (шаг 4.8)'); },
};

// ---------- Д5. Потенциал мероприятия ----------
DASH[5] = {
  steps: ['5.1', '5.3', '5.3а', '5.4', '5.10'],
  sel: 0,
  list: [
    { well: '1284', ev: 'ГРП', d: 14.2, p: 0.78, npv: 312, pb: 8, st: 'Оценка' },
    { well: '0719', ev: 'ОПЗ', d: 6.1, p: 0.85, npv: 96, pb: 5, st: 'Оценка' },
    { well: '3057', ev: 'Оптимизация режима', d: 4.4, p: 0.92, npv: 58, pb: 2, st: 'В ПП' },
    { well: '2231', ev: 'Изоляция водопритока', d: 5.8, p: 0.64, npv: 74, pb: 7, st: 'Нужна инфраструктура' },
    { well: '4410', ev: 'ЗБС', d: 21.5, p: 0.7, npv: 540, pb: 14, st: 'Оценка' },
  ],
  html() {
    const x = this.list[this.sel];
    return `
      <div class="stats">${kpi(this.list.length, 'кандидатов на мероприятия')}${kpi('+' + nf(this.list.reduce((a, b) => a + b.d * b.p, 0), 1), 'ожидаемый прирост, т/сут', 'с учётом вероятности успеха')}${kpi(nf(this.list.reduce((a, b) => a + b.npv, 0)), 'NPV, млн ₸')}${kpi('1', 'требует инфраструктурной проработки', '→ шаг 5.6', 'warn-t')}</div>
      <div class="grid g-2-1 mt">
        ${card('Кандидаты и приоритет (ПАЭГТМ)', `<table class="t"><thead><tr><th>Скв.</th><th>Мероприятие</th><th class="num">Прирост, т/сут</th><th class="num">P успеха</th><th class="num">NPV, млн ₸</th><th class="num">Окуп., мес</th><th>Статус</th></tr></thead><tbody>
          ${this.list.map((r, i) => `<tr class="click ${i === this.sel ? 'me' : ''}" data-d5="${i}"><td><b>${r.well}</b></td><td>${r.ev}</td><td class="num">${nf(r.d, 1)}</td><td class="num">${nf(r.p * 100)} %</td><td class="num">${nf(r.npv)}</td><td class="num">${r.pb}</td><td>${chip(r.st, r.st === 'В ПП' ? 'good' : r.st === 'Оценка' ? '' : 'warn')}</td></tr>`).join('')}</tbody></table>`)}
        ${card(`Скв. ${x.well} · ${x.ev}: эффект по сценариям (шаг 5.3а)`, `<div class="card-b"><div id="d5sc"></div>
          <div class="row mt-s"><button class="btn good" id="d5ok">Включить в ПП</button><button class="btn" id="d5inf">Нужна инфраструктурная проработка</button></div></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    const x = this.list[this.sel];
    barChart(root.querySelector('#d5sc'), [
      { label: 'P90 (пессим.)', value: +(x.d * 0.55).toFixed(1) }, { label: 'P50 (базовый)', value: x.d, highlight: true }, { label: 'P10 (оптим.)', value: +(x.d * 1.45).toFixed(1) },
    ], { unit: 'т/сут', valueName: 'Прирост', median: false });
    root.querySelectorAll('[data-d5]').forEach((tr) => (tr.onclick = () => { this.sel = +tr.dataset.d5; rerender(); }));
    root.querySelector('#d5ok').onclick = () => { x.st = 'В ПП'; toast(`Скв. ${x.well}: мероприятие включено в производственную программу (шаг 5.5)`); rerender(); };
    root.querySelector('#d5inf').onclick = () => { x.st = 'Нужна инфраструктура'; toast('Сформировано ТЗ на инфраструктурную проработку (шаг 5.6)'); rerender(); };
  },
};

// ---------- Д6. Подбор ГНО ----------
DASH[6] = {
  steps: ['6.3а', '6.5', '6.6', '6.7', '6.12'],
  type: 'УЭЦН', pick: 1,
  html() {
    const pumps = {
      ШГН: [['НН2Б-57', 32, 1100, 41, 18.2], ['НН2Б-70', 46, 1050, 44, 22.9]],
      УЭВН: [['ЭВН5-63-1200', 58, 1200, 52, 21.4], ['ЭВН5-100-1000', 88, 1000, 55, 27.9]],
      УЭЦН: [['ЭЦН5-60-1300', 64, 1300, 49, 24.1], ['ЭЦН5А-80-1250', 82, 1250, 56, 23.5], ['ЭЦН5А-125-1100', 121, 1100, 51, 34.8]],
    }[this.type];
    return `
      <div class="grid g-1-2">
        ${card('Заявки на подбор', `<table class="t"><tbody>
          <tr class="me"><td><b>Скв. 1284</b><div class="small muted">Отказ ГНО · ${NGDU[1]}</div></td><td>${chip('Подбор', 'warn')}</td></tr>
          <tr><td><b>Скв. 5102</b><div class="small muted">Новая скважина</div></td><td>${chip('Исходные данные')}</td></tr>
          <tr><td><b>Скв. 0931</b><div class="small muted">Оптимизация</div></td><td>${chip('Дизайн у ПО')}</td></tr>
          <tr><td><b>Скв. 2765</b><div class="small muted">Отказ ГНО</div></td><td>${chip('✓ Спущено', 'good')}</td></tr></tbody></table>`)}
        ${card('Скв. 1284 · подбор погружного оборудования', `<div class="card-b">
          <div class="flow-strip">${chip('✓ исходные данные собраны автоматически (6.3а)', 'good')} ${sysChips(['ABAI БД 2.0', 'ABAI ТР 2.0', 'ABAI ПГНО'])}</div>
          <div class="stats mt-s">${kpi('80', 'целевой Qж, м³/сут')}${kpi('1 180', 'динамический уровень, м')}${kpi('72 %', 'обводнённость')}${kpi('2,1°/10 м', 'макс. темп набора кривизны')}</div>
          <div class="row mt" style="align-items:center"><b>Тип насоса</b><div class="seg">${['ШГН', 'УЭВН', 'УЭЦН'].map((t) => `<button data-d6t="${t}" class="${t === this.type ? 'sel' : ''}">${t}</button>`).join('')}</div><span class="muted small">рекомендовано: УЭЦН</span></div>
          <table class="t mt-s"><thead><tr><th>Модель</th><th class="num">Подача, м³/сут</th><th class="num">Напор, м</th><th class="num">КПД, %</th><th class="num">Энергия, кВт·ч/т</th><th></th></tr></thead><tbody>
            ${pumps.map((p, i) => `<tr class="${i === this.pick ? 'me' : ''}"><td><b>${p[0]}</b></td><td class="num">${p[1]}</td><td class="num">${nf(p[2])}</td><td class="num">${p[3]}</td><td class="num">${nf(p[4], 1)}</td><td><button class="btn sm ${i === this.pick ? 'primary' : ''}" data-d6p="${i}">${i === this.pick ? 'Выбран' : 'Выбрать'}</button></td></tr>`).join('')}</tbody></table>
          <div class="legend mt"><span><i style="background:var(--series-1)"></i>Напор насоса, м</span><span><i style="background:var(--series-2)"></i>Требуемый напор скважины, м</span></div><div id="d6curve"></div>
          <button class="btn good mt-s" id="d6go">Сформировать дизайн и отправить ПО на согласование</button></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    const rows = Array.from({ length: 16 }, (_, i) => { const q = i * 10; return { day: q, pump: Math.max(0, Math.round(1500 - 0.075 * q * q)), well: Math.round(820 + 0.028 * q * q) }; });
    lineChart(root.querySelector('#d6curve'), rows, [{ key: 'pump', name: 'Насос', color: 'var(--series-1)', unit: 'м' }, { key: 'well', name: 'Скважина', color: 'var(--series-2)', unit: 'м' }],
      { height: 200, xLabel: (r) => r.day, tipTitle: (r) => `Q = ${r.day} м³/сут` });
    root.querySelectorAll('[data-d6t]').forEach((b) => (b.onclick = () => { this.type = b.dataset.d6t; this.pick = 0; rerender(); }));
    root.querySelectorAll('[data-d6p]').forEach((b) => (b.onclick = () => { this.pick = +b.dataset.d6p; rerender(); }));
    root.querySelector('#d6go').onclick = () => toast('Дизайн под скв. 1284 сформирован в ПГНО и отправлен подрядчику (ПО) на согласование');
  },
};

// ---------- Д7. Энергоэффективность ----------
DASH[7] = {
  steps: ['7.1.1', '7.2', '7.2а', '7.3', '7.4.1'],
  html() {
    return `
      <div class="flow-strip mb">${sysChips(['АСКУЭ', 'АСТУЭ', 'СДМО'])}<span class="arrow">→</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">→ УРЭ и КПД →</span>${sysChips(['ABAI ПДИМ 2.0'])}</div>
      <div class="stats">${kpi('27,4', 'УРЭ, кВт·ч/т жидкости', 'норматив 25,0 · +9,6 %', 'crit-t')}${kpi('41,2 млн', 'кВт·ч за сентябрь')}${kpi('2', 'НГДУ выше норматива', '', 'warn-t')}${kpi('−3,1 млн кВт·ч', 'резерв по мероприятиям', 'ПАЭГТМ')}</div>
      <div class="grid g-1-1 mt">
        ${card('УРЭ по НГДУ, кВт·ч/т · норматив 25', `<div class="card-b"><div id="d7bar"></div></div>`)}
        ${card('УРЭ по месяцам, кВт·ч/т', `<div class="card-b"><div class="legend"><span><i style="background:var(--series-1)"></i>УРЭ</span><span><i style="background:var(--series-2)"></i>Норматив</span></div><div id="d7trend"></div></div>`)}
      </div>
      ${card('Причины и мероприятия по энергоэффективности', `<table class="t"><thead><tr><th>Причина (7.3)</th><th>Объект</th><th>Мероприятие (7.4.1)</th><th class="num">Эффект, тыс. кВт·ч/мес</th><th>Статус</th></tr></thead><tbody>
        <tr><td>Работа УЭЦН вне рабочей зоны</td><td>${NGDU[1]}, 23 скв.</td><td>Переподбор ГНО (ПГНО)</td><td class="num">410</td><td>${chip('Оценка эффекта', 'warn')}</td></tr>
        <tr><td>Перегрузка насосов ППД</td><td>КНС-4</td><td>Частотное регулирование</td><td class="num">280</td><td>${chip('В программе ЭЭ', 'good')}</td></tr>
        <tr><td>Потери в сетях 6 кВ</td><td>ПС Кошкар</td><td>Компенсация реактивной мощности</td><td class="num">150</td><td>${chip('ОПИ', '')}</td></tr></tbody></table>`)}`;
  },
  mount(root) {
    barChart(root.querySelector('#d7bar'), [
      { label: NGDU[1].slice(0, 12), value: 31.8, highlight: true }, { label: NGDU[3].slice(0, 12), value: 28.6, highlight: true }, { label: NGDU[0].slice(0, 12), value: 24.1 }, { label: NGDU[2].slice(0, 12), value: 23.7 },
    ], { unit: 'кВт·ч/т', valueName: 'УРЭ', median: false });
    const m = ['Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'];
    const v = [25.2, 25.6, 26.1, 26.4, 25.9, 25.4, 25.8, 26.3, 26.9, 27.2, 27.0, 27.4];
    lineChart(root.querySelector('#d7trend'), m.map((x, i) => ({ day: x, ure: v[i], norm: 25 })), [{ key: 'ure', name: 'УРЭ', color: 'var(--series-1)', unit: '' }, { key: 'norm', name: 'Норма', color: 'var(--series-2)', unit: '' }],
      { height: 190, xLabel: (r) => r.day, tipTitle: (r) => r.day });
  },
};

// ---------- Д8. Трубопроводы ----------
DASH[8] = {
  steps: ['8.1', '8.2', '8.6а', '8.7', '8.8'],
  html() {
    const pipes = [
      ['Нефтесборный коллектор АГЗУ-5 — ДНС-3', 1998, 6.4, 219, '15.08.2026', 'over', 4, 4],
      ['Водовод КНС-4 — куст 17', 2006, 3.1, 159, '02.11.2026', 'soon', 3, 3],
      ['Нефтепровод ДНС-3 — УПН', 2011, 12.8, 325, '20.04.2027', 'ok', 2, 4],
      ['Газопровод УПН — ГПЗ', 2015, 8.2, 273, '11.06.2027', 'ok', 1, 3],
      ['Выкидная линия скв. 1284', 2009, 0.9, 89, '01.10.2026', 'soon', 3, 2],
    ];
    const st = { over: chip('Просрочена', 'crit'), soon: chip('≤ 30 дней', 'warn'), ok: chip('По графику', 'good') };
    const matrix = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => pipes.filter((p) => p[6] === 5 - i && p[7] === j + 1).length));
    return `
      <div class="stats">${kpi('1 284 км', 'трубопроводов в реестре', '100 % паспортов в БД 2.0')}${kpi('1', 'диагностика просрочена', '', 'crit-t')}${kpi('7', 'участков высокого риска', 'шаг 8.6а', 'warn-t')}${kpi('42', 'мероприятия в программе надёжности')}</div>
      <div class="grid g-2-1 mt">
        ${card('Реестр и сроки диагностики', `<table class="t"><thead><tr><th>Участок</th><th class="num">Ввод</th><th class="num">Длина, км</th><th class="num">Ø, мм</th><th>Диагностика</th><th>Срок</th></tr></thead><tbody>
          ${pipes.map((p) => `<tr><td><b>${p[0]}</b></td><td class="num">${p[1]}</td><td class="num">${nf(p[2], 1)}</td><td class="num">${p[3]}</td><td>${p[4]}</td><td>${st[p[5]]}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI ПДИМ 2.0</span>')}
        ${card('Матрица риска отказа', `<div class="card-b"><div class="risk">
          <div class="ry">Вероятность →</div>
          ${matrix.map((row, i) => row.map((n, j) => { const lvl = (5 - i) * (j + 1); return `<div class="rc ${lvl >= 12 ? 'hi' : lvl >= 6 ? 'md' : 'lo'}">${n || ''}</div>`; }).join('')).join('')}
          <div class="rx">Последствия →</div></div>
          <div class="small muted mt-s">Оценка риска и остаточного ресурса — шаг 8.6а</div>
          <button class="btn primary mt-s" id="d8prog">Сформировать программу надёжности</button></div>`)}
      </div>`;
  },
  mount(root) { root.querySelector('#d8prog').onclick = () => toast('Программа целостности и надёжности сформирована и передана в ПТД на согласование (8.8)'); },
};

// ---------- Д9. Мехфонд ----------
DASH[9] = {
  steps: ['9.2', '9.3.1', '9.3.2', '9.4', '9.6'],
  list: [
    { well: '1284', type: 'УЭЦН', what: 'Снижение изоляции ПЭД', src: 'ГНО', mrp: 318, act: '' },
    { well: '0931', type: 'ШГН', what: 'Обрыв штанг', src: 'ГНО', mrp: 211, act: '' },
    { well: '2765', type: 'УЭЦН', what: 'Рост давления на выкиде', src: 'НПО', mrp: 540, act: '' },
    { well: '4102', type: 'УЭВН', what: 'Снижение подачи на 30 %', src: 'Режим', mrp: 402, act: '' },
  ],
  html() {
    const acts = { mode: 'Смена режима (ТР 2.0)', prs: 'ПРС — наряд-заказ', gno: 'Переподбор ГНО (Д6)' };
    return `
      <div class="stats">${kpi('1 842', 'действующий фонд')}${kpi('118', 'простаивающий', '6,4 %', 'warn-t')}${kpi('36', 'в ремонте')}${kpi('412 сут', 'МРП', '+18 к прошлому году', 'good-t')}</div>
      <div class="grid g-2-1 mt">
        ${card('Отказы и отклонения (9.2 · 9.3)', `<table class="t"><thead><tr><th>Скв.</th><th>ГНО</th><th>Отказ / отклонение</th><th>Где</th><th class="num">Наработка, сут</th><th>Решение</th></tr></thead><tbody>
          ${this.list.map((x, i) => `<tr><td><b>${x.well}</b></td><td>${x.type}</td><td>${x.what}</td><td>${chip(x.src, x.src === 'ГНО' ? 'crit' : x.src === 'НПО' ? 'warn' : '')}</td><td class="num">${x.mrp}</td>
          <td>${x.act ? chip(acts[x.act], 'good') : `<select class="sel" data-d9="${i}"><option value="">— решение —</option>${Object.entries(acts).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>`}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI ТР 2.0 · ПГНО</span>')}
        ${card('Причины отказов за 90 суток', `<div class="card-b"><div id="d9bar"></div></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    barChart(root.querySelector('#d9bar'), [
      { label: 'ПЭД / кабель', value: 21, highlight: true }, { label: 'Штанги / НКТ', value: 14 }, { label: 'Мехпримеси', value: 11 }, { label: 'Солеотложение', value: 8 }, { label: 'Прочее', value: 5 },
    ], { unit: 'отказов', valueName: 'Отказов', median: false });
    root.querySelectorAll('[data-d9]').forEach((s) => (s.onchange = () => {
      const x = this.list[+s.dataset.d9]; x.act = s.value;
      toast(x.act === 'gno' ? `Скв. ${x.well}: заявка на переподбор передана в процесс «Подбор ГНО»` : x.act === 'prs' ? `Скв. ${x.well}: наряд-заказ на ПРС сформирован` : `Скв. ${x.well}: новый режим записан в ТР 2.0`);
      rerender();
    }));
  },
};
