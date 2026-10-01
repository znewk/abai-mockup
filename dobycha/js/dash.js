// Рабочие места процессов добычи ОМГ (Dream TO BE). Демо-данные.
// Каждое: { steps: [коды шагов BPMN], html(), mount(root) }

const NGDU = ['НГДУ-1', 'НГДУ-2', 'НГДУ-3', 'НГДУ-4'];
const nf = (v, d = 0) => Number(v).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const kpi = (v, l, sub, tone) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div>${sub ? `<div class="small ${tone || 'muted'}">${sub}</div>` : ''}</div>`;
const chip = (t, tone = '') => `<span class="chip ${tone}">${t}</span>`;
const sysChips = (list) => list.map((s) => `<span class="chip sys ${sysKind(s)}" title="${(SYS[s] || {}).desc || ''}">${s}</span>`).join(' ');
const card = (title, body, extra = '') => `<div class="card"><div class="card-h"><h2>${title}</h2>${extra}</div>${body}</div>`;
const days = (n, start = new Date(2026, 8, 1)) => Array.from({ length: n }, (_, i) => { const d = new Date(start); d.setDate(d.getDate() + i); return d; });
const dshort = (d) => d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });

const DASH = {};

// ---------- Д1. Учёт добычи: суточная сводка и качество данных (ДОУП) ----------
DASH[1] = {
  steps: ['1.2а', '1.5', '1.6', '1.7', '1.8'],
  rows: [
    { ngdu: NGDU[0], sdms: 3912, rap: 3905, wc: 88.4, full: 99.3, st: 'ok' },
    { ngdu: NGDU[1], sdms: 3640, rap: 3528, wc: 90.1, full: 96.4, st: 'diff' },
    { ngdu: NGDU[2], sdms: 4105, rap: 4098, wc: 87.6, full: 98.8, st: 'wait' },
    { ngdu: NGDU[3], sdms: 2471, rap: 2466, wc: 79.3, full: 94.6, st: 'gap' },
  ],
  html() {
    const r = this.rows;
    const st = { ok: chip('✓ Подтверждено', 'good'), wait: chip('Ожидает ДОУП', 'warn'), diff: chip('Расхождение 3,1 %', 'crit'), gap: chip('Неполные данные', 'crit'), ask: chip('Уточнение у ЦИТС НГДУ', 'warn') };
    const total = r.reduce((a, x) => a + x.sdms, 0);
    return `
      <div class="flow-strip mb">${sysChips(['СДМС', 'SCADA', 'ИСУ', 'ABAI БД 2.0'])}<span class="arrow">→</span>${sysChips(['КХД'])}<span class="arrow">→ проверка полноты и расхождений →</span>${sysChips(['ABAI ПДИМ 2.0'])}<span class="arrow">→ подтверждение ДОУП →</span><span class="chip">Сводка ДЗО</span></div>
      <div class="stats">
        ${kpi(nf(total), 'нефть, т/сут · 29.09.2026', 'план 14 300 · −' + nf((1 - total / 14300) * 100, 1) + ' %', 'warn-t')}
        ${kpi('97,4 %', 'полнота данных (ПДИМ 2.0)', '3 аларма качества', 'warn-t')}
        ${kpi(r.filter((x) => x.st === 'ok').length + ' из 4', 'НГДУ подтверждено ДОУП')}
        ${kpi('0', 'привязок к MS Office', 'в AS IS ABAI — 7 шагов в MS Office')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Сверка источников по НГДУ', `<table class="t"><thead><tr><th>НГДУ</th><th class="num">СДМС, т/сут</th><th class="num">Рапорт ЦИТС, т/сут</th><th class="num">Обв., %</th><th class="num">Полнота</th><th>Статус</th><th></th></tr></thead><tbody>
          ${r.map((x, i) => `<tr><td><b>${x.ngdu}</b></td><td class="num">${nf(x.sdms)}</td><td class="num ${Math.abs(x.rap - x.sdms) / x.sdms > 0.02 ? 'crit-t' : ''}">${nf(x.rap)}</td><td class="num">${nf(x.wc, 1)}</td><td class="num ${x.full < 95 ? 'crit-t' : ''}">${nf(x.full, 1)} %</td><td>${st[x.st]}</td>
          <td class="num">${x.st === 'wait' ? `<button class="btn primary sm" data-d1="ok" data-i="${i}">Подтвердить</button>` : x.st === 'diff' || x.st === 'gap' ? `<button class="btn sm" data-d1="ask" data-i="${i}">Запросить уточнение</button>` : ''}</td></tr>`).join('')}
          </tbody></table>`, '<span class="muted small">рапорт и обводнённость — из БД 2.0</span>')}
        ${card('Алармы качества данных (ПДИМ 2.0)', `<div class="alarms">
          <div class="alarm crit"><b>Нет замера по 11 скважинам</b><span>${NGDU[3]} · ГЗУ-112 · с 06:00</span></div>
          <div class="alarm crit"><b>Расхождение СДМС / рапорт 3,1 %</b><span>${NGDU[1]} · порог 2 %</span></div>
          <div class="alarm warn"><b>Обводнённость не подтверждена лабораторией</b><span>${NGDU[2]} · 6 скважин</span></div>
          <div class="alarm ok"><b>Данные СДМС и SCADA получены</b><span>все НГДУ · 06:15</span></div></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    root.querySelectorAll('[data-d1]').forEach((b) => (b.onclick = () => {
      const x = this.rows[+b.dataset.i];
      x.st = b.dataset.d1 === 'ok' ? 'ok' : 'ask';
      toast(b.dataset.d1 === 'ok' ? `${x.ngdu}: данные подтверждены и ушли в сводку ДЗО` : `${x.ngdu}: уведомление на уточнение отправлено в ЦИТС НГДУ`);
      rerender();
    }));
  },
};

// ---------- Д2. Мониторинг добычи: план/факт и отклонения (службы НГДУ) ----------
DASH[2] = {
  steps: ['2.3', '2.4', '2.5', '2.7', '2.9'],
  devs: [
    { well: '7318', ngdu: NGDU[1], loss: 16.2, since: '26.09', cause: 'Снижение подачи насоса', cls: 'Отказ ГНО' },
    { well: '4127', ngdu: NGDU[0], loss: 9.8, since: '27.09', cause: 'Остановка по энергетике', cls: '' },
    { well: '5642', ngdu: NGDU[2], loss: 8.4, since: '28.09', cause: 'Рост обводнённости', cls: '' },
    { well: '2290', ngdu: NGDU[3], loss: 6.1, since: '28.09', cause: 'Рост давления на устье', cls: '' },
  ],
  html() {
    return `
      <div class="stats">
        ${kpi('14 128', 'факт, т/сут', 'план 14 300')}${kpi('−172', 'отклонение, т/сут', '−1,2 % к плану', 'crit-t')}
        ${kpi(this.devs.length, 'карточки отклонений', this.devs.filter((d) => !d.cls).length + ' без классификации', 'warn-t')}
        ${kpi('6', 'мероприятий в ПАЭГТМ', '2 — на проработке КФК')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('План / факт добычи нефти, т/сут · сентябрь', `<div class="card-b"><div class="legend"><span><i style="background:var(--series-1)"></i>План</span><span><i style="background:var(--series-2)"></i>Факт</span></div><div id="d2chart"></div></div>`)}
        ${card('Структура потерь, т/сут', `<div class="card-b"><div id="d2loss"></div></div>`)}
      </div>
      ${card('Карточки отклонений', `<table class="t"><thead><tr><th>Скважина</th><th>НГДУ</th><th class="num">Потери, т/сут</th><th>С</th><th>Аларм ТР 2.0</th><th>Причина</th><th></th></tr></thead><tbody>
        ${this.devs.map((d, i) => `<tr><td><b>${d.well}</b></td><td>${d.ngdu}</td><td class="num">${nf(d.loss, 1)}</td><td>${d.since}</td><td>${d.cause}</td>
        <td><select class="sel" data-d2="${i}"><option value="">— выбрать —</option>${['Отказ ГНО', 'Остановка', 'ВСП', 'АСПО', 'Песок', 'Ограничение'].map((c) => `<option ${d.cls === c ? 'selected' : ''}>${c}</option>`).join('')}</select></td>
        <td>${d.cls ? `<button class="btn sm" data-d2m="${i}">В мероприятие</button>` : ''}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI ПДИМ 2.0 · ТР 2.0</span>')}`;
  },
  mount(root, rerender) {
    const r = rnd(7);
    const rows = days(29).map((d, i) => ({ date: d, plan: 14300, fact: Math.round(14300 - 70 - i * 4 + (r() - 0.5) * 160) }));
    lineChart(root.querySelector('#d2chart'), rows, [{ key: 'plan', name: 'План', color: 'var(--series-1)', unit: 'т/сут' }, { key: 'fact', name: 'Факт', color: 'var(--series-2)', unit: 'т/сут' }],
      { height: 230, xLabel: (x) => dshort(x.date), tipTitle: (x) => x.date.toLocaleDateString('ru-RU') });
    barChart(root.querySelector('#d2loss'), [
      { label: 'Отказы ГНО', value: 72, highlight: true }, { label: 'Остановки', value: 38 }, { label: 'АСПО', value: 24 }, { label: 'Песок', value: 18 }, { label: 'Прочее', value: 20 },
    ], { unit: 'т/сут', valueName: 'Потери', median: false });
    root.querySelectorAll('[data-d2]').forEach((s) => (s.onchange = () => { this.devs[+s.dataset.d2].cls = s.value; toast('Причина зафиксирована в ТР 2.0 и в карточке отклонения'); rerender(); }));
    root.querySelectorAll('[data-d2m]').forEach((b) => (b.onclick = () => toast(`Скв. ${this.devs[+b.dataset.d2m].well}: кандидат заведён в ПАЭГТМ (2.7) и уйдёт на проработку КФК (2.8)`)));
  },
};

// ---------- Д3. Потенциал базовой добычи (ДДНГ) ----------
DASH[3] = {
  steps: ['3.3', '3.4', '3.4а', '3.8', '3.9'],
  sc: 1,
  html() {
    const scs = [
      { n: 'Базовый', d: 0, capex: 0, npv: 0, note: 'Текущие режимы' },
      { n: 'Оптимизация режимов', d: 420, capex: 0.3, npv: 6.9, note: 'ТР 2.0 + ПГНО: смена режимов на 118 скв.' },
      { n: 'Режимы + ОПЗ / ГРП', d: 860, capex: 4.8, npv: 10.4, note: '+ 31 скв. с ОПЗ и 7 ГРП' },
    ];
    return `
      <div class="stats">${kpi('13 650', 'базовая добыча, т/сут')}${kpi('14 780', 'потенциал, т/сут', 'ПДИМ 2.0 + ТР 2.0 + ПГНО')}${kpi('1 130', 'недобор к потенциалу, т/сут', '7,6 %', 'crit-t')}${kpi('3', 'сценария оценены', 'шаг 3.4а · ДДНГ / ДРМ')}</div>
      <div class="grid g-1-1 mt">
        ${card('Недобор к потенциалу по НГДУ, т/сут', `<div class="card-b"><div id="d3gap"></div></div>`)}
        ${card('Сценарии потенциала (шаг 3.4а)', `<table class="t"><thead><tr><th>Сценарий</th><th class="num">Δ, т/сут</th><th class="num">CAPEX, млрд ₸</th><th class="num">NPV, млрд ₸</th><th></th></tr></thead><tbody>
          ${scs.map((s, i) => `<tr class="${i === this.sc ? 'me' : ''}"><td><b>${s.n}</b><div class="small muted">${s.note}</div></td><td class="num">${s.d ? '+' + nf(s.d) : '—'}</td><td class="num">${s.capex ? nf(s.capex, 1) : '—'}</td><td class="num">${s.npv ? nf(s.npv, 1) : '—'}</td>
          <td>${i ? `<button class="btn sm ${i === this.sc ? 'primary' : ''}" data-d3="${i}">${i === this.sc ? 'Выбран' : 'Выбрать'}</button>` : ''}</td></tr>`).join('')}</tbody></table>
          <div class="card-b"><button class="btn good" id="d3dec">Принять решение и инициировать изменение ПП</button></div>`)}
      </div>
      ${card('Эффективность ранее реализованных мероприятий (ПАЭГТМ, шаг 3.5)', `<table class="t"><thead><tr><th>Мероприятие</th><th class="num">Скважин</th><th class="num">План, т/сут</th><th class="num">Факт, т/сут</th><th class="num">Успешность</th></tr></thead><tbody>
        <tr><td>Оптимизация режимов</td><td class="num">84</td><td class="num">310</td><td class="num">338</td><td class="num">${chip('109 %', 'good')}</td></tr>
        <tr><td>ОПЗ</td><td class="num">36</td><td class="num">220</td><td class="num">176</td><td class="num">${chip('80 %', 'warn')}</td></tr>
        <tr><td>ГРП</td><td class="num">9</td><td class="num">190</td><td class="num">197</td><td class="num">${chip('104 %', 'good')}</td></tr></tbody></table>`, '<span class="muted small">один расчёт для ДДНГ / ДРМ и ДТТД</span>')}`;
  },
  mount(root, rerender) {
    barChart(root.querySelector('#d3gap'), [
      { label: NGDU[1], value: 380, highlight: true }, { label: NGDU[0], value: 320 }, { label: NGDU[2], value: 270 }, { label: NGDU[3], value: 160 },
    ], { unit: 'т/сут', valueName: 'Недобор', median: false });
    root.querySelectorAll('[data-d3]').forEach((b) => (b.onclick = () => { this.sc = +b.dataset.d3; rerender(); }));
    root.querySelector('#d3dec').onclick = () => toast('Решение зафиксировано в БД 2.0 (3.9), проект ПП ушёл на согласование департаментам КМГ и КМГИ');
  },
};

// ---------- Д4. ИМА: пласт – скважина – инфраструктура (ДДНГ) ----------
DASH[4] = {
  steps: ['4.2а', '4.2.1', '4.6', '4.7', '4.8'],
  html() {
    const node = (x, y, w, t, s, tone = '') => `<g class="ima-node ${tone}"><rect x="${x}" y="${y}" width="${w}" height="54" rx="8"/><text x="${x + 12}" y="${y + 22}" class="t">${t}</text><text x="${x + 12}" y="${y + 41}" class="s">${s}</text></g>`;
    const link = (x1, y1, x2, y2, tone = '') => `<path class="ima-link ${tone}" d="M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}"/>`;
    return `
      <div class="stats">${kpi('99 %', 'загрузка ДНС-3', 'узкое место', 'crit-t')}${kpi('+290', 'т/сут при снятии ограничения')}${kpi('3', 'варианта решения от ДТТД')}${kpi('14.09', 'модель актуализирована', 'шаг 4.2а')}</div>
      ${card('Интегрированная модель актива · месторождение Узень (демо)', `<div class="card-b"><svg viewBox="0 0 1080 300" class="ima">
        ${link(190, 60, 290, 60)}${link(190, 150, 290, 150)}${link(190, 240, 290, 240)}
        ${link(470, 60, 570, 105)}${link(470, 150, 570, 105)}${link(470, 240, 570, 215)}
        ${link(750, 105, 850, 150, 'hot')}${link(750, 215, 850, 150)}
        ${node(20, 33, 170, 'Горизонт XIII', 'Рпл 96 атм · обв. 89 %')}${node(20, 123, 170, 'Горизонт XIV', 'Рпл 102 атм · обв. 86 %')}${node(20, 213, 170, 'Горизонт XV', 'Рпл 108 атм · обв. 81 %')}
        ${node(290, 33, 180, 'Куст 12 · 26 скв.', 'Qж 2 310 м³/сут')}${node(290, 123, 180, 'Куст 17 · 33 скв.', 'Qж 2 840 м³/сут')}${node(290, 213, 180, 'Куст 21 · 19 скв.', 'Qж 1 420 м³/сут')}
        ${node(570, 78, 180, 'ГЗУ-112 → коллектор', 'P 13 атм')}${node(570, 188, 180, 'ГЗУ-118 → коллектор', 'P 10 атм')}
        ${node(850, 123, 200, 'ДНС-3', 'загрузка 99 % · предел 6 200', 'hot')}
      </svg></div>`, '<span class="muted small">ABAI БД 2.0 · ПГНО · ПДИМ 2.0</span>')}
      <div class="grid g-1-1 mt">
        ${card('Варианты технического решения (ДТТД)', `<table class="t"><thead><tr><th>Вариант</th><th class="num">Δ, т/сут</th><th class="num">CAPEX, млн ₸</th><th>Расчёт</th></tr></thead><tbody>
          <tr><td>A. Перераспределение потоков ГЗУ-112 → ДНС-2</td><td class="num">+150</td><td class="num">30</td><td>${sysChips(['ABAI ПГНО', 'PipeSim'])}</td></tr>
          <tr class="me"><td>B. Доп. насосный агрегат на ДНС-3</td><td class="num">+290</td><td class="num">390</td><td>${sysChips(['UniSim'])}</td></tr>
          <tr><td>C. Замена участка коллектора Ø219 → Ø273</td><td class="num">+220</td><td class="num">560</td><td>${sysChips(['AutoCAD', 'UniSim'])}</td></tr></tbody></table>`)}
        ${card('Рекомендации и применимость', `<div class="card-b docs">
          <div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">Рекомендации по техническому решению</div><div class="sub">вариант B · ДТТД (КМГИ АкФ) · 22.09.2026</div></div>${chip('в БД 2.0')}</div>
          <div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">Оценка применимости с учётом показателей разработки</div><div class="sub">рейтинг участков и скважин · ABAI ЦРНС 2.0</div></div>${chip('рейтинг A', 'good')}</div>
          <button class="btn primary mt-s" id="d4dec">Принять решение о корректировке ПП</button></div>`)}
      </div>`;
  },
  mount(root) { root.querySelector('#d4dec').onclick = () => toast('Решение зафиксировано в БД 2.0 и передано на корректировку ПП (4.8)'); },
};

// ---------- Д5. Потенциал мероприятия (службы НГДУ) ----------
DASH[5] = {
  steps: ['5.1', '5.3', '5.3а', '5.4', '5.5'],
  sel: 0,
  list: [
    { well: '7318', ev: 'ГРП', d: 12.6, p: 0.78, npv: 284, pb: 8, st: 'Оценка' },
    { well: '5642', ev: 'ОПЗ', d: 5.4, p: 0.85, npv: 82, pb: 5, st: 'Оценка' },
    { well: '4127', ev: 'Оптимизация режима', d: 3.9, p: 0.92, npv: 51, pb: 2, st: 'В ПП' },
    { well: '2290', ev: 'Изоляция водопритока', d: 4.8, p: 0.64, npv: 63, pb: 7, st: 'Нужна инфраструктура' },
    { well: '8015', ev: 'ЗБС', d: 18.7, p: 0.7, npv: 470, pb: 14, st: 'Оценка' },
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
    root.querySelector('#d5inf').onclick = () => { x.st = 'Нужна инфраструктура'; toast('ТЗ на инфраструктурную проработку сформировано в БД 2.0 (шаг 5.6)'); rerender(); };
  },
};

// ---------- Д6. Подбор ГНО (службы НГДУ) ----------
DASH[6] = {
  steps: ['6.1', '6.4а', '6.8', '6.9', '6.15'],
  type: 'УЭЦН', pick: 1,
  html() {
    const pumps = {
      ШГН: [['НН2Б-57', 32, 1100, 41, 18.2], ['НН2Б-70', 46, 1050, 44, 22.9]],
      УЭЦН: [['ЭЦН5-60-1300', 64, 1300, 49, 24.1], ['ЭЦН5А-80-1250', 82, 1250, 56, 23.5], ['ЭЦН5А-125-1100', 121, 1100, 51, 34.8]],
    }[this.type];
    return `
      <div class="grid g-1-2">
        ${card('Заявки на подбор', `<table class="t"><tbody>
          <tr class="me"><td><b>Скв. 7318</b><div class="small muted">Отказ УЭЦН · ${NGDU[1]}</div></td><td>${chip('Подбор', 'warn')}</td></tr>
          <tr><td><b>Скв. 8102</b><div class="small muted">Новая скважина · параметры ДГиГ, ДРМ</div></td><td>${chip('Исходные данные')}</td></tr>
          <tr><td><b>Скв. 4127</b><div class="small muted">Оптимизация</div></td><td>${chip('Дизайн у ПО')}</td></tr>
          <tr><td><b>Скв. 2765</b><div class="small muted">Отказ ШГН</div></td><td>${chip('✓ Спущено', 'good')}</td></tr></tbody></table>`)}
        ${card('Скв. 7318 · подбор погружного оборудования', `<div class="card-b">
          <div class="flow-strip">${chip('✓ исходные данные собраны автоматически (6.4а)', 'good')} ${sysChips(['ABAI БД 2.0', 'ABAI ТР 2.0', 'ABAI ПГНО'])}</div>
          <div class="stats mt-s">${kpi('80', 'целевой Qж, м³/сут')}${kpi('1 040', 'динамический уровень, м')}${kpi('78 %', 'обводнённость')}${kpi('АСПО', 'осложнение (ТР 2.0)')}</div>
          <div class="row mt-s" style="align-items:center"><b>Заключения (6.7)</b>${chip('ДТРС ✓', 'good')}${chip('ДТТД ✓', 'good')}${chip('КФК — на оценке', 'warn')}</div>
          <div class="row mt" style="align-items:center"><b>Тип насоса</b><div class="seg">${['ШГН', 'УЭЦН'].map((t) => `<button data-d6t="${t}" class="${t === this.type ? 'sel' : ''}">${t}</button>`).join('')}</div><span class="muted small">рекомендовано: УЭЦН</span></div>
          <table class="t mt-s"><thead><tr><th>Модель</th><th class="num">Подача, м³/сут</th><th class="num">Напор, м</th><th class="num">КПД, %</th><th class="num">Энергия, кВт·ч/т</th><th></th></tr></thead><tbody>
            ${pumps.map((p, i) => `<tr class="${i === this.pick ? 'me' : ''}"><td><b>${p[0]}</b></td><td class="num">${p[1]}</td><td class="num">${nf(p[2])}</td><td class="num">${p[3]}</td><td class="num">${nf(p[4], 1)}</td><td><button class="btn sm ${i === this.pick ? 'primary' : ''}" data-d6p="${i}">${i === this.pick ? 'Выбран' : 'Выбрать'}</button></td></tr>`).join('')}</tbody></table>
          <div class="legend mt"><span><i style="background:var(--series-1)"></i>Напор насоса, м</span><span><i style="background:var(--series-2)"></i>Требуемый напор скважины, м</span></div><div id="d6curve"></div>
          <button class="btn good mt-s" id="d6go">Подобрать оборудование и отправить ПО на согласование</button></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    const rows = Array.from({ length: 16 }, (_, i) => { const q = i * 10; return { day: q, pump: Math.max(0, Math.round(1500 - 0.075 * q * q)), well: Math.round(760 + 0.028 * q * q) }; });
    lineChart(root.querySelector('#d6curve'), rows, [{ key: 'pump', name: 'Насос', color: 'var(--series-1)', unit: 'м' }, { key: 'well', name: 'Скважина', color: 'var(--series-2)', unit: 'м' }],
      { height: 200, xLabel: (r) => r.day, tipTitle: (r) => `Q = ${r.day} м³/сут` });
    root.querySelectorAll('[data-d6t]').forEach((b) => (b.onclick = () => { this.type = b.dataset.d6t; this.pick = 0; rerender(); }));
    root.querySelectorAll('[data-d6p]').forEach((b) => (b.onclick = () => { this.pick = +b.dataset.d6p; rerender(); }));
    root.querySelector('#d6go').onclick = () => toast('Компоновка под скв. 7318 подобрана в ПГНО (6.15) и отправлена подрядчику (ПО) на согласование (6.12)');
  },
};

// ---------- Д7. Энергоэффективность (МЭД) ----------
DASH[7] = {
  steps: ['7.1', '7.2.1', '7.3', '7.3а', '7.4.1'],
  html() {
    return `
      <div class="flow-strip mb">${sysChips(['АСКУЭ', 'АСТУЭ'])}<span class="arrow">→</span>${sysChips(['КХД', 'ABAI БД 2.0'])}<span class="arrow">→ УРЭ и КПД →</span>${sysChips(['ABAI ПДИМ 2.0'])}<span class="arrow">+ режимы из</span>${sysChips(['ABAI ТР 2.0'])}</div>
      <div class="stats">${kpi('29,6', 'УРЭ, кВт·ч/т нефти', 'целевой КПЭ 27,0 · +9,6 %', 'crit-t')}${kpi('41,1 млн', 'кВт·ч за сентябрь', 'план 38,4 млн (шаг 7.1)', 'warn-t')}${kpi('2', 'НГДУ выше целевого УРЭ', '', 'warn-t')}${kpi('5', 'аварийных отключений', 'данные ДОУП · шаг 7.2.2')}</div>
      <div class="grid g-1-1 mt">
        ${card('УРЭ по НГДУ, кВт·ч/т · целевой 27,0', `<div class="card-b"><div id="d7bar"></div></div>`)}
        ${card('УРЭ по месяцам, кВт·ч/т', `<div class="card-b"><div class="legend"><span><i style="background:var(--series-1)"></i>УРЭ</span><span><i style="background:var(--series-2)"></i>Целевой</span></div><div id="d7trend"></div></div>`)}
      </div>
      ${card('Причины перерасхода и предложения', `<table class="t"><thead><tr><th>Причина (7.4.1)</th><th>Объект</th><th>Предложение (7.5, ПАЭГТМ)</th><th class="num">Эффект, тыс. кВт·ч/мес</th><th>Оценка (7.6)</th></tr></thead><tbody>
        <tr><td>Работа УЭЦН вне рабочей зоны</td><td>${NGDU[1]}, 21 скв.</td><td>Переподбор ГНО (ПГНО)</td><td class="num">380</td><td>${chip('техническая — департаменты', 'warn')}</td></tr>
        <tr><td>Перегрузка насосов ППД</td><td>КНС-4</td><td>Частотное регулирование</td><td class="num">260</td><td>${chip('экономическая — ДБиЭА', 'warn')}</td></tr>
        <tr><td>Аварийные отключения</td><td>ПС-12</td><td>Резервирование питания</td><td class="num">120</td><td>${chip('✓ в программе ЭЭ', 'good')}</td></tr></tbody></table>`)}`;
  },
  mount(root) {
    barChart(root.querySelector('#d7bar'), [
      { label: NGDU[1], value: 33.4, highlight: true }, { label: NGDU[3], value: 30.2, highlight: true }, { label: NGDU[0], value: 26.8 }, { label: NGDU[2], value: 26.1 },
    ], { unit: 'кВт·ч/т', valueName: 'УРЭ', median: false });
    const m = ['Окт', 'Ноя', 'Дек', 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'];
    const v = [27.3, 27.6, 28.1, 28.4, 27.9, 27.5, 27.9, 28.4, 29.0, 29.3, 29.2, 29.6];
    lineChart(root.querySelector('#d7trend'), m.map((x, i) => ({ day: x, ure: v[i], norm: 27 })), [{ key: 'ure', name: 'УРЭ', color: 'var(--series-1)', unit: '' }, { key: 'norm', name: 'Целевой', color: 'var(--series-2)', unit: '' }],
      { height: 190, xLabel: (r) => r.day, tipTitle: (r) => r.day });
  },
};

// ---------- Д8. Трубопроводы (служба ГМ) ----------
DASH[8] = {
  steps: ['8.1', '8.1а', '8.5а', '8.6', '8.8'],
  html() {
    const pipes = [
      ['Нефтесборный коллектор ГЗУ-112 — ДНС-3', 1996, 5.8, 219, '15.08.2026', 'over', 4, 4],
      ['Водовод КНС-4 — куст 17', 2004, 3.4, 159, '02.11.2026', 'soon', 3, 3],
      ['Нефтепровод ДНС-3 — ЦППН', 2010, 11.6, 325, '20.04.2027', 'ok', 2, 4],
      ['Газопровод ЦППН — ГПЗ', 2014, 7.9, 273, '11.06.2027', 'ok', 1, 3],
      ['Выкидная линия скв. 7318', 2008, 0.8, 89, '01.10.2026', 'soon', 3, 2],
    ];
    const st = { over: chip('Просрочена', 'crit'), soon: chip('≤ 30 дней', 'warn'), ok: chip('По графику', 'good') };
    const matrix = Array.from({ length: 5 }, (_, i) => Array.from({ length: 5 }, (_, j) => pipes.filter((p) => p[6] === 5 - i && p[7] === j + 1).length));
    return `
      <div class="stats">${kpi('2 140 км', 'трубопроводов в реестре', 'паспорта в ПДИМ 2.0, сканы — в БД 2.0')}${kpi('1', 'диагностика просрочена', 'напоминание ПДИМ 2.0 · шаг 8.1а', 'crit-t')}${kpi('6', 'участков высокого риска', 'шаг 8.5а', 'warn-t')}${kpi('9', 'рекомендаций УТТД', 'шаг 8.5')}</div>
      <div class="grid g-2-1 mt">
        ${card('Реестр и сроки диагностики', `<table class="t"><thead><tr><th>Участок</th><th class="num">Ввод</th><th class="num">Длина, км</th><th class="num">Ø, мм</th><th>Диагностика</th><th>Срок</th></tr></thead><tbody>
          ${pipes.map((p) => `<tr><td><b>${p[0]}</b></td><td class="num">${p[1]}</td><td class="num">${nf(p[2], 1)}</td><td class="num">${p[3]}</td><td>${p[4]}</td><td>${st[p[5]]}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI ПДИМ 2.0</span>')}
        ${card('Матрица риска отказа', `<div class="card-b"><div class="risk">
          <div class="ry">Вероятность →</div>
          ${matrix.map((row, i) => row.map((n, j) => { const lvl = (5 - i) * (j + 1); return `<div class="rc ${lvl >= 12 ? 'hi' : lvl >= 6 ? 'md' : 'lo'}">${n || ''}</div>`; }).join('')).join('')}
          <div class="rx">Последствия →</div></div>
          <div class="small muted mt-s">Риск отказа и остаточный ресурс — шаг 8.5а, по истории отказов и ремонтов из БД 2.0</div>
          <button class="btn primary mt-s" id="d8prog">Сформировать мероприятия по рискам</button></div>`)}
      </div>`;
  },
  mount(root) { root.querySelector('#d8prog').onclick = () => toast('Мероприятия сформированы в ПДИМ 2.0 (8.6) и переданы ДДНГ / ДКС на согласование и включение в план (8.7)'); },
};

// ---------- Д9. Мехфонд (службы НГДУ) ----------
DASH[9] = {
  steps: ['9.3.1', '9.3.2', '9.4', '9.6', '9.8.2'],
  list: [
    { well: '7318', type: 'УЭЦН', what: 'Снижение изоляции ПЭД', src: 'ГНО', mrp: 318, act: '' },
    { well: '4127', type: 'ШГН', what: 'Обрыв штанг', src: 'ГНО', mrp: 211, act: '' },
    { well: '2765', type: 'ШГН', what: 'Рост давления в выкидной линии', src: 'НПО', mrp: 540, act: '' },
    { well: '5642', type: 'УЭЦН', what: 'Снижение подачи на 30 %', src: 'Режим', mrp: 402, act: '' },
  ],
  html() {
    const acts = { mode: 'Смена режима (ТР 2.0)', prs: 'ПРС — наряд-заказ', gno: 'Переподбор ГНО (Д6)' };
    return `
      <div class="stats">${kpi('3 412', 'действующий фонд')}${kpi('214', 'простаивающий', '6,3 %', 'warn-t')}${kpi('58', 'в ремонте')}${kpi('386 сут', 'МРП', '+14 к прошлому году', 'good-t')}</div>
      <div class="grid g-2-1 mt">
        ${card('Отказы и отклонения', `<table class="t"><thead><tr><th>Скв.</th><th>ГНО</th><th>Отказ / отклонение</th><th>Где</th><th class="num">Наработка, сут</th><th>Решение</th></tr></thead><tbody>
          ${this.list.map((x, i) => `<tr><td><b>${x.well}</b></td><td>${x.type}</td><td>${x.what}</td><td>${chip(x.src, x.src === 'ГНО' ? 'crit' : x.src === 'НПО' ? 'warn' : '')}</td><td class="num">${x.mrp}</td>
          <td>${x.act ? chip(acts[x.act], 'good') : `<select class="sel" data-d9="${i}"><option value="">— решение —</option>${Object.entries(acts).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>`}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">аларм ТР 2.0 от ЦИТС НГДУ (9.2) · причины 9.3</span>')}
        ${card('Причины отказов за 90 суток', `<div class="card-b"><div id="d9bar"></div></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    barChart(root.querySelector('#d9bar'), [
      { label: 'ПЭД / кабель', value: 24, highlight: true }, { label: 'Штанги / НКТ', value: 17 }, { label: 'АСПО', value: 13 }, { label: 'Мехпримеси', value: 9 }, { label: 'Прочее', value: 6 },
    ], { unit: 'отказов', valueName: 'Отказов', median: false });
    root.querySelectorAll('[data-d9]').forEach((s) => (s.onchange = () => {
      const x = this.list[+s.dataset.d9]; x.act = s.value;
      toast(x.act === 'gno' ? `Скв. ${x.well}: заявка на переподбор передана в процесс «Подбор ГНО»` : x.act === 'prs' ? `Скв. ${x.well}: мероприятие заведено в ПАЭГТМ, наряд-заказ на ПРС — в БД 2.0` : `Скв. ${x.well}: новый режим записан в ТР 2.0`);
      rerender();
    }));
  },
};
