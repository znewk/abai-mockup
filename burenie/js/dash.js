// Рабочие места процессов бурения (Dream TO BE). Демо-данные: скважины, подрядчики и показатели вымышлены.
// Каждое: { steps: [коды шагов BPMN], html(), mount(root, rerender) }

const nf = (v, d = 0) => Number(v).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
const rnd = (seed) => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const kpi = (v, l, sub, tone) => `<div class="stat"><div class="v">${v}</div><div class="l">${l}</div>${sub ? `<div class="small ${tone || 'muted'}">${sub}</div>` : ''}</div>`;
const chip = (t, tone = '') => `<span class="chip ${tone}">${t}</span>`;
const sysChips = (list) => list.map((s) => `<span class="chip sys ${sysKind(s)}" title="${(SYS[s] || {}).desc || ''}">${s}</span>`).join(' ');
const card = (title, body, extra = '') => `<div class="card"><div class="card-h"><h2>${title}</h2>${extra}</div>${body}</div>`;
// Этапы в строке таблицы: ● готово, ◐ в работе, ○ впереди
const stages = (list, at) => `<div class="stg">${list.map((s, i) => `<span class="${i < at ? 'ok' : i === at ? 'cur' : ''}" title="${s}">${i < at ? '✓' : ''}</span>`).join('')}</div>`;

const DASH = {};

// ---------- Б1. Проектирование: от точки на карте до разрешений ----------
const B1_ST = ['Точка', 'Ковёр', 'ПП', 'ТЗ', 'Техпроект', 'Экспертиза КМГИ', 'Внутр. экспертиза', 'ООС и слушания', 'Разрешения'];
DASH[1] = {
  steps: ['1.1.6', '1.1.7', '1.2', '1.5', '1.8', '1.12'],
  atlas: 'review',
  wells: [
    { w: '7418', f: 'Узень', type: 'добывающая', at: 9, note: 'передана в Б2 · тендер' },
    { w: '7421', f: 'Узень', type: 'добывающая', at: 6, note: 'проект v3 от КМГИ (Ф)', act: 'review' },
    { w: '7425', f: 'Узень', type: 'нагнетательная', at: 5, note: 'расчёты КМГИ (ГО) · геомеханика' },
    { w: 'КМБ-212', f: 'Карамандыбас', type: 'горизонтальная', at: 4, note: 'ТЗ выдано 12.09 · КМГИ (Ф)' },
    { w: '7431', f: 'Узень', type: 'добывающая', at: 3, note: 'ГТД собраны из БД 2.0', act: 'tz' },
    { w: 'КМБ-215', f: 'Карамандыбас', type: 'добывающая', at: 2, note: 'ПП 2027 на согласовании в КМГ' },
  ],
  html() {
    const act = { review: ['Замечаний нет — согласовать', 'Вернуть с замечаниями'], tz: ['Выдать ТЗ в КМГИ (Ф)'] };
    return `
      <div class="flow-strip mb">${sysChips(['ABAI ЦРНС 2.0'])}<span class="arrow">точки, атлас, ковёр →</span>${sysChips(['ABAI БД 2.0', 'ABAI ПДИМ 2.0'])}<span class="arrow">ПП, ТЗ, техпроект, экспертиза →</span>${sysChips(['КХД'])}<span class="arrow">→ КМГ ·</span>${sysChips(['Государственный портал'])}</div>
      <div class="stats">
        ${kpi('17 из 20', 'точек атласа подтверждено', '3 на отбивке у маркшейдеров', 'warn-t')}
        ${kpi('56', 'скважин в ПП 2027', 'Узень 42 · Карамандыбас 14')}
        ${kpi(this.wells.filter((x) => x.at >= 4 && x.at < 8).length, 'техпроектов в работе', '1 ждёт внутренней экспертизы ОМГ', 'warn-t')}
        ${kpi('0', 'писем и файлов между ОМГ и КМГИ', 'было: ТЗ, проект и замечания в PDF по почте')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Скважины в проектировании', `<table class="t"><thead><tr><th>Скважина</th><th>Этап</th><th>${B1_ST.map((s) => `<span class="stg-h" title="${s}">${s.slice(0, 3)}</span>`).join('')}</th><th></th></tr></thead><tbody>
          ${this.wells.map((x, i) => `<tr><td><b>${x.w}</b><div class="small muted">${x.f} · ${x.type}</div></td><td>${x.at >= B1_ST.length ? chip('✓ Разрешения получены', 'good') : `<b>${B1_ST[x.at]}</b>`}<div class="small muted">${x.note}</div></td><td>${stages(B1_ST, x.at)}</td>
          <td class="num">${(act[x.act] || []).map((t, k) => `<button class="btn ${k ? '' : 'primary'} sm" data-b1="${i}" data-k="${k}">${t}</button>`).join(' ')}</td></tr>`).join('')}
          </tbody></table>`, '<span class="muted small">ABAI БД 2.0 · карточка скважины с историей версий</span>')}
        ${card('Атлас 20 точек · сентябрь', `<div class="card-b">
          <div class="small muted">КазНИПИ · собран в ЦРНС 2.0 из подтверждённых точек</div>
          <div class="atlas mt-s">${Array.from({ length: 20 }, (_, i) => `<i class="${i === 6 || i === 11 || i === 17 ? 'wait' : 'ok'}" title="Т-${String(i + 1).padStart(2, '0')}">${i + 1}</i>`).join('')}</div>
          <div class="small mt-s"><span class="good-t">■</span> подтверждена маркшейдером · <span class="warn-t">■</span> на отбивке</div>
          ${this.atlas === 'review' ? `<div class="row mt"><button class="btn primary sm" id="atlasOk">Согласовать атлас</button><button class="btn sm" id="atlasBack">Замечания КазНИПИ</button></div>`
            : this.atlas === 'ok' ? `<div class="callout good mt">✓ Атлас согласован. 17 точек включены в ковёр бурения — основа ПП (1.2).</div>` : '<div class="callout wait mt">Замечания отправлены КазНИПИ уведомлением.</div>'}
        </div>`, '<span class="muted small">ABAI ЦРНС 2.0</span>')}
      </div>`;
  },
  mount(root, rerender) {
    root.querySelectorAll('[data-b1]').forEach((b) => (b.onclick = () => {
      const x = this.wells[+b.dataset.b1];
      if (x.act === 'tz') { x.at = 4; x.note = 'ТЗ выдано сегодня · КМГИ (Ф) получила уведомление'; toast(`Скв. ${x.w}: ТЗ выдано, КМГИ (Ф) получила доступ и уведомление`); }
      else if (b.dataset.k === '0') { x.at = 7; x.note = 'проект согласован · раздел ООС в работе'; toast(`Скв. ${x.w}: проект согласован без замечаний`); }
      else { x.at = 4; x.note = 'замечания ОМГ у КМГИ (Ф)'; toast(`Скв. ${x.w}: замечания отправлены КМГИ (Ф) уведомлением`); }
      delete x.act;
      rerender();
    }));
    const a = root.querySelector('#atlasOk'), r = root.querySelector('#atlasBack');
    if (a) a.onclick = () => { this.atlas = 'ok'; toast('Атлас согласован: точки включены в ковёр бурения'); rerender(); };
    if (r) r.onclick = () => { this.atlas = 'back'; toast('Замечания по атласу отправлены КазНИПИ'); rerender(); };
  },
};

// ---------- Б2. Подготовка: чек-лист готовности до допуска к бурению ----------
const B2_ST = ['Договор', 'Проект у подрядчика', 'Программа бурения', 'ГТН с НГДУ', 'МТР', 'Площадка', 'ВМР', 'Разрешение'];
DASH[2] = {
  steps: ['2.3', '2.5', '2.5.1', '2.5.3', '2.9', '2.10'],
  wells: [
    { w: '7412', c: 'Альфа-Бурение', rig: 'ZJ-40 № 3', ok: [1, 1, 1, 1, 1, 1, 1, 1], adm: false },
    { w: '7418', c: 'Альфа-Бурение', rig: 'ZJ-40 № 5', ok: [1, 1, 1, 1, 1, 1, 0.6, 1] },
    { w: '7416', c: 'Бета Дриллинг', rig: 'БУ-3000 № 2', ok: [1, 1, 0.5, 0, 1, 1, 0, 1], prog: true },
    { w: 'КМБ-209', c: 'Бета Дриллинг', rig: 'БУ-3000 № 4', ok: [1, 1, 1, 0.5, 0.5, 1, 0, 1] },
    { w: '7421', c: 'тендер', rig: 'подрядчик не выбран', ok: [0.5, 0, 0, 0, 0, 0, 0, 0] },
  ],
  html() {
    const cell = (v) => (v === 1 ? '<td class="ck ok">✓</td>' : v > 0 ? '<td class="ck cur">◐</td>' : '<td class="ck">·</td>');
    const ready = (x) => x.ok.every((v) => v === 1);
    return `
      <div class="flow-strip mb">${sysChips(['ABAI БД 2.0'])}<span class="arrow">тендерный пакет из техпроекта →</span>${sysChips(['Портал закупок Самрук-Казына'])}<span class="arrow">→ доступ подрядчику к проекту →</span><span class="chip">Программа · ГТН · МТР · ВМР</span><span class="arrow">→</span>${sysChips(['АВР+', 'Государственный портал'])}<span class="arrow">→ допуск</span></div>
      <div class="stats">
        ${kpi(this.wells.length, 'скважин в подготовке', 'Узень 4 · Карамандыбас 1')}
        ${kpi(this.wells.filter((x) => ready(x) && !x.adm).length, 'готовы к допуску', 'все пункты закрыты', 'good-t')}
        ${kpi('1', 'ГТН на согласовании НГДУ', 'КМБ-209 · 2 дня')}
        ${kpi('0', 'пересылок проекта подрядчику', 'было: техпроект и разрешения по почте')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Готовность к бурению', `<table class="t ckt"><thead><tr><th>Скважина</th>${B2_ST.map((s) => `<th class="ck">${s}</th>`).join('')}<th></th></tr></thead><tbody>
          ${this.wells.map((x, i) => `<tr><td><b>${x.w}</b><div class="small muted">${x.c} · ${x.rig}</div></td>${x.ok.map(cell).join('')}
          <td class="num">${x.adm ? chip('✓ Допущена', 'good') : ready(x) ? `<button class="btn primary sm" data-b2="${i}">Допустить к бурению</button>` : x.prog ? `<button class="btn sm" data-b2p="${i}">Согласовать программу</button>` : chip('в работе', 'warn')}</td></tr>`).join('')}
          </tbody></table>`, '<span class="muted small">ABAI БД 2.0 · факт ВМР онлайн, акт — в АВР+</span>')}
        ${card('Помесячный план бурения', '<div class="card-b"><div id="b2plan"></div></div>', '<span class="muted small">ковёр и ПП из Б1</span>')}
      </div>`;
  },
  mount(root, rerender) {
    barChart(root.querySelector('#b2plan'), [
      { label: 'Октябрь', value: 6, highlight: true }, { label: 'Ноябрь', value: 5 }, { label: 'Декабрь', value: 4 }, { label: 'Январь', value: 3 }, { label: 'Февраль', value: 4 }, { label: 'Март', value: 5 },
    ], { unit: 'скв.', valueName: 'Начало бурения', median: false });
    root.querySelectorAll('[data-b2]').forEach((b) => (b.onclick = () => { const x = this.wells[+b.dataset.b2]; x.adm = true; toast(`Скв. ${x.w}: разрешение на начало бурения выдано, ${x.c} получил допуск уведомлением`); rerender(); }));
    root.querySelectorAll('[data-b2p]').forEach((b) => (b.onclick = () => { const x = this.wells[+b.dataset.b2p]; x.ok[2] = 1; x.ok[3] = 0.5; x.prog = false; toast(`Скв. ${x.w}: программа бурения согласована, ГТН ушёл в НГДУ на согласование`); rerender(); }));
  },
};

// ---------- Б3. Мониторинг бурения онлайн ----------
DASH[3] = {
  steps: ['3.3', '3.4', '3.5', '3.7', '3.9.2'],
  devs: [
    { w: '7412', what: 'Нагрузка на долото 16,8 т при программе 10–14 т', int: '1 080–1 146 м', risk: 'crit', st: 'new', meas: 'Снизить нагрузку до 12 т, контроль вибрации' },
    { w: '7409', what: 'Отставание от графика 1,5 сут', int: 'под кондуктор', risk: 'warn', st: 'new', meas: 'Замена долота, ускорение СПО' },
    { w: 'КМБ-207', what: 'Поглощение бурового раствора 4 м³/ч', int: '1 620 м', risk: 'crit', st: 'done', meas: 'Кольматация, снижение плотности' },
  ],
  html() {
    const tone = { crit: chip('высокий', 'crit'), warn: chip('средний', 'warn') };
    const stx = { new: chip('мероприятия от подрядчика', 'warn'), ok: chip('✓ согласовано', 'good'), done: chip('✓ исполнено', 'good') };
    return `
      <div class="flow-strip mb">${sysChips(['Петролайн ДЭЛ-140/150'])}<span class="arrow">станция ГТИ →</span>${sysChips(['КХД'])}<span class="arrow">→ онлайн →</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">→ суточный рапорт, РВД, реестр отклонений →</span><span class="chip">Дело скважины</span></div>
      <div class="stats">
        ${kpi('4', 'скважины в бурении', 'Узень 3 · Карамандыбас 1')}
        ${kpi(this.devs.filter((d) => d.st === 'new').length, 'отклонения ждут решения ОМГ', 'уведомления вместо рабочего чата', this.devs.some((d) => d.st === 'new') ? 'warn-t' : 'good-t')}
        ${kpi('4 из 4', 'суточных рапорта собраны сами', 'подрядчик вносит только ручные поля')}
        ${kpi('−1,5 сут', 'отставание по скв. 7409', 'от графика программы бурения', 'warn-t')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Скв. 7412 · глубина: программа и факт, м', '<div class="card-b"><div id="b3depth"></div></div>', '<span class="muted small">данные станции ГТИ · обновлено 2 мин назад</span>')}
        ${card('Скважины в бурении', `<table class="t"><thead><tr><th>Скв.</th><th>Интервал</th><th class="num">Забой</th><th></th></tr></thead><tbody>
          <tr><td><b>7412</b></td><td>под экспл. колонну</td><td class="num">1 146 м</td><td>${chip('отклонение', 'crit')}</td></tr>
          <tr><td><b>7409</b></td><td>под кондуктор</td><td class="num">410 м</td><td>${chip('отставание', 'warn')}</td></tr>
          <tr><td><b>7405</b></td><td>спуск колонны</td><td class="num">1 980 м</td><td>${chip('по программе', 'good')}</td></tr>
          <tr><td><b>КМБ-207</b></td><td>под экспл. колонну</td><td class="num">1 655 м</td><td>${chip('по программе', 'good')}</td></tr></tbody></table>`)}
      </div>
      ${card('Реестр отклонений', `<table class="t"><thead><tr><th>Скв.</th><th>Отклонение</th><th>Интервал</th><th>Риск</th><th>Мероприятие подрядчика</th><th>Статус</th><th></th></tr></thead><tbody>
        ${this.devs.map((d, i) => `<tr><td><b>${d.w}</b></td><td>${d.what}</td><td>${d.int}</td><td>${tone[d.risk]}</td><td>${d.meas}</td><td>${stx[d.st]}</td>
        <td class="num">${d.st === 'new' ? `<button class="btn primary sm" data-b3="${i}">Согласовать</button>` : ''}</td></tr>`).join('')}</tbody></table>`, '<span class="muted small">ABAI БД 2.0 · отклонения подсвечиваются автоматически</span>')}`;
  },
  mount(root, rerender) {
    const r = rnd(11);
    const plan = [0, 30, 120, 260, 420, 650, 650, 780, 900, 1010, 1120, 1230, 1340, 1450];
    const fact = [0, 30, 110, 240, 400, 620, 650, 740, 860, 980, 1080, 1146];
    const rows = plan.map((p, i) => ({ day: `${i + 1} сут`, plan: p, fact: fact[i] !== undefined ? fact[i] : null }));
    lineChart(root.querySelector('#b3depth'), rows.slice(0, fact.length).map((x) => ({ ...x, fact: x.fact + Math.round((r() - 0.5) * 4) })), [{ key: 'plan', name: 'Программа', color: 'var(--series-1)', unit: 'м' }, { key: 'fact', name: 'Факт', color: 'var(--series-2)', unit: 'м' }],
      { height: 220, xLabel: (x) => x.day, tipTitle: (x) => x.day + ' бурения' });
    root.querySelectorAll('[data-b3]').forEach((b) => (b.onclick = () => { const d = this.devs[+b.dataset.b3]; d.st = 'ok'; toast(`Скв. ${d.w}: мероприятие согласовано, подрядчик получил уведомление`); rerender(); }));
  },
};

// ---------- Б4. Освоение новых скважин ----------
const B4_ST = ['Приёмка', 'Подготовка', 'Программа', 'Согласование', 'Операции', 'Наблюдение', 'Паспорт'];
DASH[4] = {
  steps: ['4.0', '4.3', '4.4.5', '4.4.6', '4.5'],
  wells: [
    { w: '7405', c: 'Альфа-Бурение', at: 6, note: '30 суток стабильной работы · Qн 21,2 т/сут', act: 'pass' },
    { w: '7398', c: 'Альфа-Бурение', at: 5, note: '12 из 30 суток · ПДИМ 2.0' },
    { w: 'КМБ-201', c: 'Бета Дриллинг', at: 4, note: 'перфорация и промывка · суточный рапорт' },
    { w: '7403', c: 'Бета Дриллинг', at: 3, note: 'программа освоения от подрядчика', act: 'prog' },
    { w: '7412', c: 'Альфа-Бурение', at: 0, note: 'бурение завершается · дело скважины из Б3' },
  ],
  html() {
    return `
      <div class="flow-strip mb"><span class="chip">Техпроект Б1 · акт ВМР Б2 · дело скважины Б3</span><span class="arrow">→</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">→ операции →</span>${sysChips(['ABAI ПДИМ 2.0', 'ABAI ТР 2.0'])}<span class="arrow">→ паспорт, АВР →</span>${sysChips(['АВР+'])}</div>
      <div class="stats">
        ${kpi(this.wells.length, 'скважин в освоении', 'от приёмки до паспорта')}
        ${kpi('1', 'программа ждёт согласования', 'службы согласуют параллельно')}
        ${kpi('21,2 т/сут', 'Qн скв. 7405 за месяц', '+14 % к соседним скважинам', 'good-t')}
        ${kpi('0', 'Excel-сводок наблюдения', 'было: месячная сводка и сравнение в Excel')}
      </div>
      <div class="grid g-2-1 mt">
        ${card('Скважины в освоении', `<table class="t"><thead><tr><th>Скважина</th><th>Этап</th><th>${B4_ST.map((s) => `<span class="stg-h" title="${s}">${s.slice(0, 3)}</span>`).join('')}</th><th></th></tr></thead><tbody>
          ${this.wells.map((x, i) => `<tr><td><b>${x.w}</b><div class="small muted">${x.c}</div></td><td>${x.at >= B4_ST.length ? chip('✓ В действующем фонде', 'good') : `<b>${B4_ST[x.at]}</b>`}<div class="small muted">${x.note}</div></td><td>${stages(B4_ST, x.at)}</td>
          <td class="num">${x.act === 'pass' ? `<button class="btn primary sm" data-b4="${i}">Обновить паспорт</button>` : x.act === 'prog' ? `<button class="btn primary sm" data-b4="${i}">Согласовать программу</button>` : ''}</td></tr>`).join('')}
          </tbody></table>`, '<span class="muted small">ABAI БД 2.0 · дело скважины</span>')}
        ${card('Скв. 7405 и соседние, Qн т/сут', '<div class="card-b"><div id="b4cmp"></div></div>', '<span class="muted small">ABAI ПДИМ 2.0</span>')}
      </div>`;
  },
  mount(root, rerender) {
    barChart(root.querySelector('#b4cmp'), [
      { label: '7405 (новая)', value: 21.2, highlight: true }, { label: '7401', value: 18.6 }, { label: '7396', value: 17.9 }, { label: '7389', value: 16.4 },
    ], { unit: 'т/сут', valueName: 'Qн', median: false });
    root.querySelectorAll('[data-b4]').forEach((b) => (b.onclick = () => {
      const x = this.wells[+b.dataset.b4];
      if (x.act === 'pass') { x.at = 7; x.note = 'паспорт обновлён · АВР по освоению в АВР+'; toast(`Скв. ${x.w}: паспорт обновлён, скважина переведена в действующий фонд`); }
      else { x.at = 4; x.note = 'программа согласована · подрядчик начал операции'; toast(`Скв. ${x.w}: программа освоения согласована, подрядчик получил уведомление`); }
      delete x.act;
      rerender();
    }));
  },
};

// ---------- Б5. Бригады ВСР: график и контроль ----------
DASH[5] = {
  steps: ['5.1', '5.2', '5.3.1', '5.4.1', '5.6.1', '5.7.1', '5.8'],
  crews: [
    { id: 'КРС-04', kind: 'КРС', jobs: [[0, 4, '3057'], [5, 9, '2231']], st: 'work', well: '3057' },
    { id: 'КРС-07', kind: 'КРС', jobs: [[0, 6, '0719'], [7, 7, 'переезд'], [8, 13, '1284']], st: 'work', well: '0719' },
    { id: 'ПРС-11', kind: 'ПРС', jobs: [[0, 1, '5520'], [2, 2, 'переезд'], [3, 5, '5531'], [6, 8, '5547']], st: 'move', well: '→ 5531' },
    { id: 'ПРС-12', kind: 'ПРС', jobs: [[0, 2, '6102'], [3, 5, 'простой'], [6, 8, '6110']], st: 'idle', well: '6102' },
    { id: 'ПРС-15', kind: 'ПРС', jobs: [[0, 3, '4471'], [4, 6, '4480']], st: 'work', well: '4471' },
  ],
  queue: [{ w: '4492', kind: 'ПРС', eff: '+4,2 т/сут', crew: null }, { w: '1290', kind: 'КРС', eff: '+9,4 т/сут', crew: null }],
  html() {
    const stx = { work: chip('в работе', 'good'), move: chip('переезд', 'warn'), idle: chip('простой 3 ч', 'crit') };
    const D = 14;
    return `
      <div class="flow-strip mb">${sysChips(['ABAI ПАЭГТМ'])}<span class="arrow">кандидаты КРС/ПРС →</span>${sysChips(['ABAI БД 2.0'])}<span class="arrow">годовой план, график, назначения →</span>${sysChips(['АВР+'])}<span class="arrow">заказ-наряд →</span><span class="chip">Бригадо-часы из рапортов</span></div>
      <div class="stats">
        ${kpi('12', 'бригад ВСР', '10 в работе · 1 переезд · 1 простой')}
        ${kpi('64 % / 71 %', 'годовой план КРС / ПРС', 'на 30.09.2026')}
        ${kpi('8 412 ч', 'бригадо-часов за сентябрь', 'план 8 640 · считаются из рапортов')}
        ${kpi('0', 'Excel-учётов бригадо-часов', 'было: две таблицы — ОМГ и подрядчика')}
      </div>
      ${card('График движения бригад · 01–14.10', `<div class="card-b"><div class="gantt" style="--d:${D}">
        <div class="g-h"><span></span>${Array.from({ length: D }, (_, i) => `<span>${String(i + 1).padStart(2, '0')}</span>`).join('')}</div>
        ${this.crews.map((c) => `<div class="g-r"><span><b>${c.id}</b> ${stx[c.st]}</span><div class="g-t">${c.jobs.map(([a, b, t]) => `<i class="${t === 'переезд' ? 'mv' : t === 'простой' ? 'idle' : c.kind === 'КРС' ? 'krs' : 'prs'}" style="grid-column:${a + 1}/${b + 2}">${/\d/.test(t) ? 'скв. ' + t : t}</i>`).join('')}</div></div>`).join('')}
      </div><div class="small muted mt-s"><span class="lg-krs">■</span> КРС · <span class="lg-prs">■</span> ПРС · <span class="lg-mv">■</span> переезд · <span class="lg-idle">■</span> простой</div></div>`, '<span class="muted small">ABAI БД 2.0 · факт бригад онлайн</span>')}
      <div class="grid g-1-1 mt">
        ${card('Очередь на назначение', `<table class="t"><thead><tr><th>Скв.</th><th>Вид</th><th>Эффект (ПАЭГТМ)</th><th></th></tr></thead><tbody>
          ${this.queue.map((q, i) => `<tr><td><b>${q.w}</b></td><td>${q.kind}</td><td class="good-t">${q.eff}</td><td class="num">${q.crew ? `${chip(q.crew, 'good')} <button class="btn sm" data-b5z="${i}">Заказ-наряд в АВР+</button>` : `<button class="btn primary sm" data-b5="${i}">Назначить бригаду</button>`}</td></tr>`).join('')}</tbody></table>`)}
        ${card('Бригадо-часы: ОМГ и подрядчик', `<table class="t"><thead><tr><th>Бригада</th><th class="num">ОМГ</th><th class="num">Подрядчик</th><th></th></tr></thead><tbody>
          <tr><td>КРС-04</td><td class="num">712</td><td class="num">712</td><td>${chip('совпадает', 'good')}</td></tr>
          <tr><td>КРС-07</td><td class="num">698</td><td class="num">698</td><td>${chip('совпадает', 'good')}</td></tr>
          <tr><td>ПРС-12</td><td class="num">655</td><td class="num">668</td><td>${chip('простой 13 ч — на разбор', 'warn')}</td></tr></tbody></table>`, '<span class="muted small">из суточных рапортов бригад</span>')}
      </div>`;
  },
  mount(root, rerender) {
    root.querySelectorAll('[data-b5]').forEach((b) => (b.onclick = () => { const q = this.queue[+b.dataset.b5]; q.crew = q.kind === 'КРС' ? 'КРС-04 с 11.10' : 'ПРС-15 с 08.10'; toast(`Скв. ${q.w}: назначена бригада ${q.crew}, подрядчик получил уведомление`); rerender(); }));
    root.querySelectorAll('[data-b5z]').forEach((b) => (b.onclick = () => toast(`Скв. ${this.queue[+b.dataset.b5z].w}: заказ-наряд оформлен в АВР+`)));
  },
};

// ---------- Мини-экраны ABAI на вкладке «Процесс» ----------
// Мини-экран ABAI для шага — по главной системе шага
function sysWidget(t, num) {
  const has = (s) => t.sys.includes(s);
  const win = (title, body) => `<div class="mini"><div class="mini-top"><i></i><b>ABAI</b><span>${title}</span></div><div class="mini-b">${body}</div></div>`;
  const form = (t.docs.find((d) => /^Форма БД 2\.0/.test(d)) || '').replace(/^Форма БД 2\.0:\s*/, '');
  if (has('ABAI ЦРНС 2.0')) return win('ЦРНС 2.0 · точки бурения', `<div class="mini-kpi"><div><b>20</b><span>точек в заказ-наряде</span></div><div><b class="good-t">17</b><span>подтверждено маркшейдерами</span></div><div><b class="warn-t">3</b><span>на отбивке</span></div></div>
    <table class="t"><tr><td>Т-07 · Узень</td><td class="num">X 5 142 380</td><td class="num">Y 7 318 905</td><td>${chip('подтверждена', 'good')}</td></tr><tr><td>Т-12 · Узень</td><td class="num">X 5 143 010</td><td class="num">Y 7 319 450</td><td>${chip('отбивка', 'warn')}</td></tr></table>`);
  if (has('Петролайн ДЭЛ-140/150') && has('КХД')) return win('КХД · данные станции ГТИ', `<div class="mini-flow"><span>Петролайн ДЭЛ-150 ✓</span><em>→ КХД →</em><span class="hl">БД 2.0: данные раз в 10 с</span></div><div class="alarm ok"><b>Канал работает</b><span>глубина, нагрузка, обороты, давление</span></div>`);
  if (has('Петролайн ДЭЛ-140/150')) return win('БД 2.0 · бурение онлайн', `<div class="mini-kpi"><div><b>1 146 м</b><span>текущий забой</span></div><div><b>12,4 т</b><span>нагрузка</span></div><div><b>62 об/мин</b><span>обороты</span></div></div><div class="alarm ok"><b>Данные станции ГТИ идут онлайн</b><span>проходка пишется без ручного ввода</span></div>`);
  if (has('ABAI ПДИМ 2.0') && has('ABAI ТР 2.0')) return win('ПДИМ 2.0 · новая скважина', `<div class="mini-kpi"><div><b>38,5</b><span>Qж, м³/сут</span></div><div><b>21,2</b><span>Qн, т/сут</span></div><div><b>34 %</b><span>обводнённость</span></div></div><div class="alarm ok"><b>Режим поставлен на контроль в ТР 2.0</b><span>30 суток стабильной работы</span></div>`);
  if (has('ABAI ПДИМ 2.0') && has('ABAI БД 2.0')) return win('БД 2.0 · производственная программа', `<table class="t"><tr><th>Месторождение</th><th class="num">Скважин</th><th class="num">+Qн, т/сут</th><th class="num">Стоимость, млрд ₸</th></tr><tr><td>Узень</td><td class="num">42</td><td class="num">+640</td><td class="num">38,6</td></tr><tr><td>Карамандыбас</td><td class="num">14</td><td class="num">+190</td><td class="num">12,1</td></tr></table>`);
  if (has('ABAI ПДИМ 2.0')) return win('ПДИМ 2.0 · сравнение с соседями', `<table class="t"><tr><th>Скв.</th><th class="num">Qн, т/сут</th><th class="num">Обв.</th></tr><tr class="hl"><td><b>7421 (новая)</b></td><td class="num">21,2</td><td class="num">34 %</td></tr><tr><td>7418</td><td class="num">18,6</td><td class="num">41 %</td></tr><tr><td>7409</td><td class="num">16,9</td><td class="num">45 %</td></tr></table>`);
  if (has('ABAI ПАЭГТМ')) return win('ПАЭГТМ · кандидаты на КРС/ПРС', `<table class="t"><tr><td>Скв. 3057 · КРС</td><td class="num">+9,4 т/сут</td><td>${chip('в план', 'good')}</td></tr><tr><td>Скв. 0719 · ПРС</td><td class="num">+4,2 т/сут</td><td>${chip('в план', 'good')}</td></tr><tr><td>Скв. 2231 · КРС</td><td class="num">+1,1 т/сут</td><td>${chip('нерентабельно', 'crit')}</td></tr></table>`);
  if (has('АВР+') && !has('ABAI БД 2.0')) return win('АВР+ · документ подрядчика', `<div class="doc"><div class="ic pdf">PDF</div><div class="grow"><div class="name">${esc(form || (num === 5 ? 'Заказ-наряд КРС/ПРС' : 'Акт выполненных работ'))}</div><div class="sub">связан с карточкой скважины в ABAI</div></div>${chip('подписан ЭЦП', 'good')}</div>`);
  if (has('Государственный портал')) return win('Госпортал elicense.kz → БД 2.0', `<table class="t"><tr><td>Разрешение на эмиссии</td><td>до 31.12.2027</td><td>${chip('действует', 'good')}</td></tr><tr><td>Экспертиза проекта</td><td>до 15.06.2027</td><td>${chip('действует', 'good')}</td></tr><tr><td>Разрешение на бурение</td><td>—</td><td>${chip('подано', 'warn')}</td></tr></table>`);
  if (has('Портал закупок Самрук-Казына')) return win('Закупка · портал Самрук-Казына', `<div class="doc"><div class="ic pdf">PDF</div><div class="grow"><div class="name">Договор с буровым подрядчиком</div><div class="sub">итог тендера фиксируется по скважине в БД 2.0</div></div>${chip('заключён', 'good')}</div>`);
  if (has('КХД')) return win('КХД → КМГ', `<div class="mini-flow"><span>БД 2.0 ОМГ</span><em>→ КХД →</em><span class="hl">КМГ: данные по скважинам</span></div><div class="alarm ok"><b>Передано без писем и файлов</b><span>статус и замечания возвращаются уведомлением</span></div>`);
  if (t.sys.some((s) => ['COMPASS', 'WellPlan', 'SLB Petrel', 'SLB Techlog', 'Sysdrill', 'ПК ЭРА'].includes(s))) return win('БД 2.0 · техпроект и расчёты', `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(form || 'Технический проект')}</div><div class="sub">расчёты из ${t.sys.filter((s) => sysKind(s) === 'ext').join(', ')} приложены к карточке</div></div>${chip('версия 3', 'warn')}</div>`);
  const docs = t.docs.length ? t.docs.map((d) => d.replace(/^Форма БД 2\.0:\s*/, '')) : ['Запись шага'];
  return win('БД 2.0 · карточка скважины', docs.map((d) => `<div class="doc"><div class="ic">DOC</div><div class="grow"><div class="name">${esc(d)}</div><div class="sub">форма в ABAI БД 2.0 · статус и уведомления</div></div></div>`).join(''));
}
