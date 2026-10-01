// Рабочие места процессов разработки (Dream TO BE; для Р5 — AS IS). Демо-данные: объекты, скважины и показатели вымышлены.
// Каждое: { steps: [коды шагов BPMN], html(), mount(root, rerender) }; sysWidget — мини-экран шага на вкладке «Процесс».

const nf = (v, d = 0) => Number(v).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const kpi = (v, l, sub, tone) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div>${sub ? `<div class="small ${tone || 'muted'}">${sub}</div>` : ''}</div>`;
const chip = (t, tone = '') => `<span class="chip ${tone}">${t}</span>`;
const sysChips = (list) => list.map((s) => `<span class="chip sys ${sysKind(s)}" title="${(SYS[s] || {}).desc || ''}">${s}</span>`).join(' ');
const card = (title, body, extra = '') => `<div class="card"><div class="card-h"><h2>${title}</h2>${extra}</div>${body}</div>`;
const path = (list, at) => `<div class="path">${list.map((p, i) => `<div class="${i < at ? 'ok' : i === at ? 'cur' : ''}"><b>${i + 1}</b><span>${p}</span></div>`).join('')}</div>`;

const DASH = {};

// ---------- Р1. Варианты системы разработки ----------
DASH[1] = {
  steps: ['1.5', '1.7', '1.8', '1.13', '1.15', '1.16'],
  chosen: null,
  vars: [
    { id: 'A', name: 'База: уплотнение сетки', vns: 42, ppd: 'приконтурное', kin: 0.412, qmax: 1180, npv: 186 },
    { id: 'B', name: 'Уплотнение + очаговое заводнение', vns: 56, ppd: 'очаговое, 14 нагн.', kin: 0.438, qmax: 1420, npv: 241 },
    { id: 'C', name: 'Горизонтальные скважины + ВПП', vns: 31, ppd: 'очаговое + ВПП', kin: 0.429, qmax: 1305, npv: 228 },
  ],
  html() {
    return `
      <div class="flow-strip mb">${sysChips(['ABAI БД 2.0', 'ABAI ПДИМ 2.0'])}<span class="arrow">исходные данные без запросов →</span>${sysChips(['ABAI ЦРНС 2.0', 'ABAI УЗ 2.0'])}<span class="arrow">ОИЗ, точки, ППД, ГТМ на ГДМ →</span>${sysChips(['SLB Petrel', 'tNavigator'])}<span class="arrow">→ ТЭО и выбор →</span><span class="chip">Р4 · Б1 · проектный документ</span></div>
      <div class="stats">
        ${kpi('Узень · Ю-XIII–XV', 'объект проектирования', 'актуализация технологической схемы')}
        ${kpi('3', 'варианта системы разработки', 'расчёт на актуальной ГДМ (Р5)')}
        ${kpi('56', 'проектных точек проверено на ГДМ', 'из ЦРНС 2.0 · 1.7')}
        ${kpi('1 запрос', 'недостающих исходных данных', 'было: запрос всего пакета у ОМГ и НГДУ', 'good-t')}
      </div>
      ${card('Варианты системы разработки · ТЭО', `<table class="t"><thead><tr><th>Вариант</th><th class="num">ВНС, скв.</th><th>ППД</th><th class="num">КИН</th><th class="num">Qн макс, тыс. т/год</th><th class="num">NPV, млрд ₸</th><th></th></tr></thead><tbody>
        ${this.vars.map((v) => `<tr class="${this.chosen === v.id ? 'hl' : ''}"><td><b>${v.id}</b> · ${v.name}</td><td class="num">${v.vns}</td><td>${v.ppd}</td><td class="num">${nf(v.kin, 3)}</td><td class="num">${nf(v.qmax)}</td><td class="num ${v.id === 'B' ? 'good-t' : ''}">${v.npv}</td>
        <td class="num">${this.chosen === v.id ? chip('✓ рекомендован', 'good') : this.chosen ? '' : `<button class="btn sm ${v.id === 'B' ? 'primary' : ''}" data-r1="${v.id}">Рекомендовать</button>`}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ЦРНС 2.0 · УЗ 2.0 · экономика — в БД 2.0</span>')}
      <div class="grid g-1-1 mt">
        ${card('Добыча нефти по вариантам, тыс. т/год', '<div class="card-b"><div id="r1chart"></div></div>')}
        ${card('Этапы', `<div class="card-b">${path(['Исходные данные', 'ОИЗ и точки', 'Решения ППД, ГТМ, техника', 'Варианты и ТЭО', 'Выбор и согласование', 'Проектный документ'], this.chosen ? 4 : 3)}
          <div class="small muted mt">После согласования ОМГ рекомендованный вариант уходит в Р4 (оптимизация ППД), Б1 (проектирование скважин) и в технические разделы проектного документа.</div></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    const yrs = [2027, 2028, 2029, 2030, 2031, 2032, 2033];
    const base = [980, 1050, 1120, 1180, 1150, 1100, 1040];
    lineChart(root.querySelector('#r1chart'), yrs.map((y, i) => ({ day: String(y), A: base[i], B: Math.round(base[i] * (1 + 0.04 * i)), C: Math.round(base[i] * (1 + 0.025 * i)) })),
      [{ key: 'A', name: 'A', color: 'var(--series-3, #9aa1ad)', unit: 'тыс. т' }, { key: 'B', name: 'B', color: 'var(--series-1)', unit: 'тыс. т' }, { key: 'C', name: 'C', color: 'var(--series-2)', unit: 'тыс. т' }], { height: 210 });
    root.querySelectorAll('[data-r1]').forEach((b) => (b.onclick = () => { this.chosen = b.dataset.r1; toast(`Вариант ${this.chosen} рекомендован — комплект документов направлен ОМГ на согласование`); rerender(); }));
  },
};

// ---------- Р2. Программа ГТМ ----------
DASH[2] = {
  steps: ['2.4.2', '2.5', '2.8', '2.10', '2.15.1', '2.16', '2.18'],
  gtm: [
    { t: 'ГРП', n: 64, q: 152, npv: 18.4, st: 'ok' }, { t: 'ОПЗ', n: 118, q: 61, npv: 6.2, st: 'ok' }, { t: 'ПВЛГ / РИР', n: 42, q: 33, npv: 2.9, st: 'ok' },
    { t: 'Перевод на вышележащий горизонт', n: 27, q: 48, npv: 4.1, st: 'fix' }, { t: 'Зарезка бокового ствола', n: 15, q: 71, npv: 9.8, st: 'ok' },
  ],
  month: [
    { w: '3057', t: 'ГРП', q: 9.4, ngdu: 'ok' }, { w: '1284', t: 'ГРП', q: 7.8, ngdu: 'ok' }, { w: '0719', t: 'ОПЗ', q: 3.1, ngdu: 'wait' }, { w: '2231', t: 'РИР', q: 2.4, ngdu: 'wait' },
  ],
  done: false,
  html() {
    const st = { ok: chip('рентабельно', 'good'), fix: chip('на корректировку', 'warn') };
    const ng = { ok: chip('✓ НГДУ', 'good'), wait: chip('ждёт НГДУ', 'warn') };
    return `
      <div class="flow-strip mb">${sysChips(['ABAI БД 2.0', 'ABAI ПАЭГТМ'])}<span class="arrow">предложения служб, эффект, экономика →</span><span class="chip">годовая программа ГТМ</span><span class="arrow">→ ПП (ПДИМ 2.0) →</span><span class="chip">месячный план</span><span class="arrow">→ эффект →</span>${sysChips(['ABAI ПДИМ 2.0'])}</div>
      <div class="stats">
        ${kpi(this.gtm.reduce((s, x) => s + x.n, 0), 'ГТМ в проекте программы 2027', '5 видов мероприятий')}
        ${kpi('+' + nf(this.gtm.reduce((s, x) => s + x.q, 0)) + ' тыс. т', 'ожидаемая доп. добыча', 'эффект согласован КазНИПИ и КМГИ')}
        ${kpi('1 вид', 'на корректировке после экономики', 'перевод на вышележащий горизонт', 'warn-t')}
        ${kpi('0', 'файлов для сведения предложений', 'было: Excel от КазНИПИ и НГДУ')}
      </div>
      <div class="grid g-1-1 mt">
        ${card('Годовая программа ГТМ', `<table class="t"><thead><tr><th>Вид ГТМ</th><th class="num">Скв.</th><th class="num">Доп. добыча, тыс. т</th><th class="num">NPV, млрд ₸</th><th></th></tr></thead><tbody>
          ${this.gtm.map((x) => `<tr><td>${x.t}</td><td class="num">${x.n}</td><td class="num">${x.q}</td><td class="num">${nf(x.npv, 1)}</td><td>${st[x.st]}</td></tr>`).join('')}</tbody></table>
          <div class="row" style="padding:10px 14px">${this.done ? chip('✓ включено в ПП ОМГ', 'good') : '<button class="btn primary sm" id="r2pp">Согласовать и включить в ПП</button>'}</div>`, '<span class="muted small">ABAI ПАЭГТМ</span>')}
        ${card('План ГТМ на ноябрь', `<table class="t"><thead><tr><th>Скв.</th><th>ГТМ</th><th class="num">Эффект, т/сут</th><th>Согласование</th></tr></thead><tbody>
          ${this.month.map((x) => `<tr><td><b>${x.w}</b></td><td>${x.t}</td><td class="num">+${nf(x.q, 1)}</td><td>${ng[x.ngdu]}</td></tr>`).join('')}</tbody></table>
          <div class="small muted" style="padding:10px 14px">Адресные ГТМ НГДУ и КазНИПИ (в части ГРП) согласуются в ПАЭГТМ; после согласования ОМГ утверждает план — он уходит в Б5, Б6 и Д5.</div>`, '<span class="muted small">ABAI ПАЭГТМ</span>')}
      </div>`;
  },
  mount(root, rerender) {
    const b = root.querySelector('#r2pp');
    if (b) b.onclick = () => { this.done = true; toast('Программа ГТМ согласована и включена в производственную программу ОМГ (ПДИМ 2.0); Р3 получил ГТМ для профиля'); rerender(); };
  },
};

// ---------- Р3. Профиль добычи на 5 лет ----------
DASH[3] = {
  steps: ['3.3', '3.4', '3.8', '3.12', '3.14'],
  appr: [['КазНИПИ', 'ok'], ['КМГИ (ГО)', 'ok'], ['КМГ', 'wait']],
  years: [[2027, 4120, 210, 160, 30], [2028, 3910, 260, 340, 70], [2029, 3720, 280, 470, 110], [2030, 3540, 270, 560, 150], [2031, 3370, 250, 610, 180]],
  html() {
    const max = Math.max(...this.years.map((y) => y[1] + y[2] + y[3] + y[4]));
    const tone = { ok: chip('✓ согласовано', 'good'), wait: chip('на согласовании', 'warn') };
    return `
      <div class="flow-strip mb">${sysChips(['ABAI БД 2.0'])}<span class="arrow">факт добычи и фонда →</span>${sysChips(['ABAI ПДИМ 2.0'])}<span class="arrow">база, падение, Кэ, ГТМ (Р2), ВНС, МУН →</span><span class="chip">профиль на 5 лет</span><span class="arrow">→</span><span class="chip">БП · Д2 · Д3</span></div>
      <div class="stats">
        ${kpi('4 520', 'тыс. т в 2027', 'интегральный профиль, ОМГ')}
        ${kpi('−4,8 %', 'коэффициент падения базы', 'скользящий год по ПДИМ 2.0')}
        ${kpi('0,962', 'коэффициент эксплуатации', 'с учётом плановых МРП и ПРС')}
        ${kpi('2 из 3', 'согласований получено', 'КазНИПИ → КМГИ → КМГ')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Профиль добычи нефти, тыс. т', `<div class="card-b"><div class="stack">${this.years.map(([y, b, g, v, m]) => `<div><div class="bar">${[[b, 'b'], [g, 'g'], [v, 'v'], [m, 'm']].map(([x, c]) => `<i class="${c}" style="height:${(x / max) * 100}%" title="${x}"></i>`).join('')}</div><b>${nf(b + g + v + m)}</b><span>${y}</span></div>`).join('')}</div>
          <div class="small mt-s"><span class="lg-b">■</span> база · <span class="lg-g">■</span> ГТМ · <span class="lg-v">■</span> ввод новых скважин · <span class="lg-m">■</span> МУН и новые технологии</div></div>`, '<span class="muted small">ABAI ПДИМ 2.0</span>')}
        ${card('Согласование профиля', `<table class="t"><tbody>${this.appr.map(([r, s]) => `<tr><td>${roleChip(r)}</td><td>${tone[s]}</td></tr>`).join('')}</tbody></table>
          <div class="row" style="padding:10px 14px">${this.appr[2][1] === 'ok' ? chip('✓ профиль утверждён — передан в БП', 'good') : '<button class="btn primary sm" id="r3ok">Утвердить итоговый вариант</button>'}</div>`)}
      </div>`;
  },
  mount(root, rerender) {
    const b = root.querySelector('#r3ok');
    if (b) b.onclick = () => { this.appr[2][1] = 'ok'; toast('Профиль добычи на 5 лет утверждён и передан в бизнес-план, Д2 и Д3'); rerender(); };
  },
};

// ---------- Р4. Оптимизация ППД ----------
DASH[4] = {
  steps: ['4.3.1', '4.5', '4.7.1', '4.8', '4.10', '4.14'],
  ez: [
    { e: 'ЭЗ-12 · Ю-XIII', comp: 78, p: -2.4, prob: 'недокомпенсация', m: 'Увеличить закачку 3 нагн. на 15 %', q: 14.2, ok: false },
    { e: 'ЭЗ-07 · Ю-XIV', comp: 134, p: 1.1, prob: 'прорыв воды к 2 доб.', m: 'ВПП в 2 нагн.', q: 9.6, ok: false },
    { e: 'ЭЗ-21 · Ю-XIII', comp: 92, p: -0.8, prob: 'неравномерный охват', m: 'Перераспределение закачки', q: 6.1, ok: true },
    { e: 'ЭЗ-03 · Ю-XV', comp: 88, p: -1.6, prob: 'бездействующая нагн.', m: 'Вывод из бездействия', q: 5.3, ok: false },
  ],
  html() {
    return `
      <div class="flow-strip mb">${sysChips(['ABAI БД 2.0'])}<span class="arrow">добыча, закачка, фонд →</span>${sysChips(['ABAI УЗ 2.0'])}<span class="arrow">энергетика, ЭЗ, мероприятия на ГДМ →</span>${sysChips(['Intersect', 'tNavigator'])}<span class="arrow">→ эффект, экономика →</span><span class="chip">Р2 · Д3</span></div>
      <div class="stats">
        ${kpi('1 602', 'варианта рассчитано в УЗ 2.0', 'целевая функция — NPV')}
        ${kpi('+' + nf(this.ez.reduce((s, x) => s + x.q, 0), 1), 'т/сут потенциальный эффект', 'по ранжированным ЭЗ')}
        ${kpi('91 %', 'компенсация отборов закачкой', 'объект Ю-XIII–XV, сентябрь', 'warn-t')}
        ${kpi('0', 'ручных выгрузок для анализа', 'данные из БД 2.0 автоматически')}
      </div>
      ${card('Ранжированные элементы заводнения', `<table class="t"><thead><tr><th>Элемент</th><th class="num">Компенсация</th><th class="num">ΔРпл, атм</th><th>Проблема</th><th>Мероприятие (УЗ 2.0)</th><th class="num">Эффект, т/сут</th><th></th></tr></thead><tbody>
        ${this.ez.map((x, i) => `<tr><td><b>${x.e}</b></td><td class="num ${x.comp < 90 || x.comp > 120 ? 'warn-t' : ''}">${x.comp} %</td><td class="num">${nf(x.p, 1)}</td><td>${x.prob}</td><td>${x.m}</td><td class="num good-t">+${nf(x.q, 1)}</td>
        <td class="num">${x.ok ? chip('✓ согласовано', 'good') : `<button class="btn sm primary" data-r4="${i}">Согласовать</button>`}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI УЗ 2.0 · ГДМ</span>')}
      ${card('Реакция добывающих скважин после корректировки закачки, т/сут', '<div class="card-b"><div id="r4chart"></div></div>', '<span class="muted small">мониторинг 4.12 · ЭЗ-21</span>')}`;
  },
  mount(root, rerender) {
    const r = rnd(4);
    lineChart(root.querySelector('#r4chart'), Array.from({ length: 30 }, (_, i) => ({ day: `${i + 1}`, plan: 62 + (i > 8 ? Math.min(6, (i - 8) * 0.5) : 0), fact: Math.round((61 + (i > 10 ? Math.min(6.4, (i - 10) * 0.45) : 0) + (r() - 0.5) * 1.6) * 10) / 10 })),
      [{ key: 'plan', name: 'Ожидаемо', color: 'var(--series-1)', unit: 'т/сут' }, { key: 'fact', name: 'Факт', color: 'var(--series-2)', unit: 'т/сут' }], { height: 190, xLabel: (x) => x.day + ' сут' });
    root.querySelectorAll('[data-r4]').forEach((b) => (b.onclick = () => { const x = this.ez[+b.dataset.r4]; x.ok = true; toast(`${x.e}: мероприятие согласовано и включено в перечень ППД`); rerender(); }));
  },
};

// ---------- Р5. Моделирование пласта (AS IS) ----------
DASH[5] = {
  steps: ['5.3', '5.5', '5.7', '5.9', '5.10', '5.15'],
  accepted: false,
  html() {
    return `
      <div class="flow-strip mb"><span class="chip">Геомодель Г3.4</span><span class="arrow">→</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">исходные данные →</span>${sysChips(['SLB Petrel', 'Intersect', 'tNavigator'])}<span class="arrow">инициализация, адаптация, прогноз →</span><span class="chip">Р1 · Р4 · Б3</span></div>
      <div class="stats">
        ${kpi('Узень · Ю-XIII–XV', 'ГДМ · актуализация 2026', 'заказ-наряд ОМГ № 14')}
        ${kpi('±4,8 %', 'расхождение по накопленной нефти', 'адаптация на историю · цель ±5 %', 'good-t')}
        ${kpi('±7,9 %', 'расхождение по обводнённости', 'цель ±5 % — доадаптация', 'warn-t')}
        ${kpi('3', 'прогнозных варианта', 'для Р1 и Р4')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Адаптация: накопленная добыча нефти, млн т', '<div class="card-b"><div id="r5chart"></div></div>', '<span class="muted small">Intersect / tNavigator</span>')}
        ${card('Приёмка ГДМ', `<div class="card-b">${path(['Исходные данные', 'Инициализация', 'PVT и ОФП', 'Адаптация', 'Прогноз', 'Приёмка'], this.accepted ? 6 : 5)}
          <div class="row mt">${this.accepted ? chip('✓ ГДМ принята — доступна Р1 и Р4', 'good') : '<button class="btn primary sm" id="r5ok">Принять работы по ГДМ</button>'}</div></div>`)}
      </div>`;
  },
  mount(root, rerender) {
    const rows = Array.from({ length: 16 }, (_, i) => { const y = 2010 + i; const h = 2.1 * i + 0.04 * i * i; return { day: String(y), hist: Math.round(h * 10) / 10, calc: Math.round(h * (1 + (i % 3 - 1) * 0.03) * 10) / 10 }; });
    lineChart(root.querySelector('#r5chart'), rows, [{ key: 'hist', name: 'История', color: 'var(--series-1)', unit: 'млн т' }, { key: 'calc', name: 'Модель', color: 'var(--series-2)', unit: 'млн т' }], { height: 210 });
    const b = root.querySelector('#r5ok');
    if (b) b.onclick = () => { this.accepted = true; toast('Работы по ГДМ приняты: модель и паспорт переданы в фонды КазНИПИ и ОМГ'); rerender(); };
  },
};

// ---------- Мини-экраны ABAI на вкладке «Процесс» ----------
function sysWidget(t, num) {
  const has = (s) => t.sys.includes(s);
  const win = (title, body) => `<div class="mini"><div class="mini-top"><i></i><b>ABAI</b><span>${title}</span></div><div class="mini-b">${body}</div></div>`;
  const txt = t.title.toLowerCase();
  if (has('ABAI УЗ 2.0')) return win('УЗ 2.0 · управление заводнением', `<div class="mini-kpi"><div><b>1 602</b><span>варианта</span></div><div><b class="good-t">+35,2</b><span>т/сут потенциал</span></div><div><b>91 %</b><span>компенсация</span></div></div><div class="alarm warn"><b>ЭЗ-12: недокомпенсация 78 %</b><span>рекомендация — увеличить закачку</span></div>`);
  if (has('ABAI ПАЭГТМ')) return win('ПАЭГТМ · мероприятия ГТМ', `<table class="t"><tr><td>ГРП · 64 скв.</td><td class="num">+152 тыс. т</td><td>${chip('рентабельно', 'good')}</td></tr><tr><td>ОПЗ · 118 скв.</td><td class="num">+61 тыс. т</td><td>${chip('рентабельно', 'good')}</td></tr><tr><td>Перевод на вышележащий</td><td class="num">+48 тыс. т</td><td>${chip('корректировка', 'warn')}</td></tr></table>`);
  if (has('ABAI ПДИМ 2.0') && /профил|добыч|коэфф/.test(txt)) return win('ПДИМ 2.0 · профиль добычи', `<div class="mini-kpi"><div><b>4 520</b><span>тыс. т в 2027</span></div><div><b>−4,8 %</b><span>падение базы</span></div><div><b>0,962</b><span>Кэ</span></div></div>`);
  if (has('ABAI ЦРНС 2.0')) return win('ЦРНС 2.0 · ОИЗ и проектные точки', `<div class="mini-kpi"><div><b>56</b><span>проектных точек</span></div><div><b>3</b><span>варианта разработки</span></div><div><b>0,438</b><span>КИН варианта B</span></div></div>`);
  if (has('ABAI ПДИМ 2.0')) return win('ПДИМ 2.0 · отчётность', `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(t.docs[0] || 'Отчёт')}</div><div class="sub">формируется в ПДИМ 2.0 автоматически</div></div>${chip('готов', 'good')}</div>`);
  if (has('ABAI БД 2.0') && /соглас|рассмотр|утвержд/.test(txt)) return win('БД 2.0 · согласование', `<table class="t"><tr><td>${roleChip('КазНИПИ')}</td><td>${chip('✓', 'good')}</td></tr><tr><td>${roleChip('ОМГ (ДЗО)')}</td><td>${chip('на рассмотрении', 'warn')}</td></tr></table>`);
  if (has('ABAI БД 2.0') && /данн|запрос/.test(txt)) return win('БД 2.0 · исходные данные', `<table class="t"><tr><td>Добыча и закачка по скважинам</td><td>${chip('✓ из БД 2.0', 'good')}</td></tr><tr><td>Фонд и конструкции</td><td>${chip('✓ из БД 2.0', 'good')}</td></tr><tr><td>Исследования ГДИС 2026</td><td>${chip('запрошено', 'warn')}</td></tr></table>`);
  if (t.sys.some((s) => ['tNavigator', 'Intersect', 'SLB Petrel', 'Eclipse'].includes(s))) return win('ГДМ · расчёт', `<div class="mini-flow"><span>ABAI БД: исходные данные</span><em>→</em><span>${t.sys.filter((s) => sysKind(s) === 'ext').join(', ')}</span><em>→</em><span class="hl">результаты — в ABAI</span></div>`);
  return defaultWidget(t);
}
