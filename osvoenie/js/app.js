// ABAI · Освоение скважин — кликабельный мокап (MVP на чистом HTML/JS).
// Состояние живёт в localStorage, маршрутизация — через hash.

const STORE_KEY = 'abai-osvoenie-v1';
const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let state = load();
const ui = { filter: 'all', q: '', field: '', sel: {}, opsTab: {}, obsView: 'chart', cmpView: 'chart', pending: {} };

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && s.wells) return s;
  } catch (e) { /* пустое хранилище — берём демо */ }
  return { role: 'contractor', wells: demoWells() };
}
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function resetDemo() { localStorage.removeItem(STORE_KEY); state = load(); Object.assign(ui, { sel: {}, opsTab: {}, pending: {} }); toast('Демо-данные сброшены'); route(); }

// ---------- Утилиты ----------
const fmtDate = (iso) => new Date(iso).toLocaleDateString('ru-RU');
const fmtDT = (iso) => new Date(iso).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const daysSince = (iso) => Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 864e5));
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const role = () => ROLES[state.role];
const getWell = (id) => state.wells.find((w) => w.id === id);
const curStep = (w) => (w.done ? null : STEPS[w.step]);
const sysChip = (k) => `<span class="chip sys${k === 'avr' || k === 'nca' ? ' external' : ''}" title="${esc(SYSTEMS[k].desc)}">${SYSTEMS[k].name}</span>`;
const roleChip = (r) => `<span class="chip role" style="color:${ROLES[r].color};border-color:${ROLES[r].color}33">${ROLES[r].name}</span>`;
const wellTitle = (w) => `Скв. ${w.name}`;

const ICON = {
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16V4M6 10l6-6 6 6M4 20h16"/></svg>',
  sign: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3-1 5-4 7-7s4-7 7-9l3 3c-2 3-6 5-9 7s-6 4-7 7"/><path d="M14 21h7"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
};

function toast(msg) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span style="color:#7fd77f">${ICON.check.replace('<svg', '<svg width="16" height="16"')}</span>${esc(msg)}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ---------- Каркас ----------
function renderShell(active, crumbs) {
  const r = role();
  const initials = r.user.split(' ').map((p) => p[0]).slice(0, 2).join('');
  const myCount = state.wells.filter((w) => !w.done && curStep(w).role === state.role).length;
  $('#shell').innerHTML = `
    <div class="mock-banner">Мокап для обсуждения · демо-данные · процесс «Б4. Освоение» · вариант Dream TO BE</div>
    <header class="topbar">
      <div class="logo">
        <svg viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1c5cab"/><path d="M6 23 13 9l4 8 3-5 6 11z" fill="#fff"/><circle cx="23" cy="9" r="2.5" fill="#86b6ef"/></svg>
        <div>ABAI<small>Освоение скважин</small></div>
      </div>
      ${abaiModuleSwitch('osvoenie', 'v1')}
      <nav class="nav">
        <a href="#/" class="${active === 'registry' ? 'active' : ''}">Реестр освоения</a>
        <a href="#/tasks" class="${active === 'tasks' ? 'active' : ''}">Мои задачи${myCount ? ` <span class="chip warn" style="margin-left:6px">${myCount}</span>` : ''}</a>
        <a href="#/process" class="${active === 'process' ? 'active' : ''}">Процесс AS IS → Dream TO BE</a>
        <a href="v2/">Презентация v2</a>
      </nav>
      <div class="spacer"></div>
      <div class="role-switch">
        <label for="role">Роль (демо)</label>
        <select id="role">${Object.values(ROLES).map((x) => `<option value="${x.id}" ${x.id === state.role ? 'selected' : ''}>${x.name}</option>`).join('')}</select>
      </div>
      <div class="user-chip">
        <div class="avatar" style="background:${r.color}">${initials}</div>
        <div class="who"><div style="color:var(--text)">${r.user}</div><div>${r.org}</div></div>
      </div>
    </header>
    <div class="subbar">${crumbs}</div>
    <main id="view"></main>`;
  $('#role').onchange = (e) => { state.role = e.target.value; save(); toast(`Вы вошли как: ${ROLES[state.role].name}`); route(); };
}

// ---------- Маршрутизация ----------
function route() {
  const h = location.hash.replace(/^#/, '') || '/';
  const [, page, id] = h.split('/');
  if (page === 'well' && getWell(id)) return renderWell(getWell(id));
  if (page === 'process') return renderProcess();
  if (page === 'tasks') return renderRegistry(true);
  return renderRegistry(false);
}
window.addEventListener('hashchange', () => { route(); window.scrollTo(0, 0); });

// ---------- Реестр ----------
const GROUPS = [
  { k: 'all', l: 'Всего в работе', f: (w) => !w.done },
  { k: 'accept', l: 'Приёмка и согласование', f: (w) => !w.done && ['upload', 'accept', 'send', 'approve'].includes(curStep(w).id) },
  { k: 'prep', l: 'Подготовка и программа', f: (w) => !w.done && ['prep', 'program'].includes(curStep(w).id) },
  { k: 'ops', l: 'Операции освоения', f: (w) => !w.done && curStep(w).id === 'ops' },
  { k: 'observe', l: 'Наблюдение и отчётность', f: (w) => !w.done && ['observe', 'compare', 'report'].includes(curStep(w).id) },
];

function progressBar(w) {
  return `<div class="progress" title="Шаг ${Math.min(w.step + 1, STEPS.length)} из ${STEPS.length}">${STEPS.map((_, i) =>
    `<i class="${w.done || i < w.step ? 'done' : i === w.step ? 'cur' : ''}"></i>`).join('')}</div>`;
}

function renderRegistry(onlyMine) {
  renderShell(onlyMine ? 'tasks' : 'registry', onlyMine ? `<span>Мои задачи</span><span class="sep">·</span><span>${role().name}</span>` : '<span>Реестр скважин на освоении</span><span class="sep">·</span><span>АО «Озенмунайгаз»</span>');
  const v = $('#view');
  let wells = state.wells.slice();
  if (onlyMine) wells = wells.filter((w) => !w.done && curStep(w).role === state.role);
  else if (ui.filter === 'done') wells = wells.filter((w) => w.done);
  else wells = wells.filter(GROUPS.find((g) => g.k === ui.filter).f);
  if (ui.field) wells = wells.filter((w) => w.field === ui.field);
  if (ui.q) wells = wells.filter((w) => (w.name + w.pad + w.field).toLowerCase().includes(ui.q.toLowerCase()));

  v.innerHTML = `
    ${onlyMine ? `<div class="callout info" style="margin-bottom:16px"><span class="grow">Здесь скважины, где следующий шаг процесса — за вашей ролью <b>${role().name}</b>. Переключите роль вверху справа, чтобы пройти процесс за другого участника.</span></div>` : `
    <div class="kpis">
      ${GROUPS.map((g) => `<button class="kpi ${ui.filter === g.k ? 'active' : ''}" data-filter="${g.k}"><div class="v">${state.wells.filter(g.f).length}</div><div class="l">${g.l}</div></button>`).join('')}
    </div>`}
    <div class="card mt">
      <div class="toolbar">
        <input id="q" placeholder="Поиск: номер скважины, куст…" value="${esc(ui.q)}">
        <select id="field"><option value="">Все месторождения</option>${FIELDS.map((f) => `<option ${ui.field === f ? 'selected' : ''}>${f}</option>`).join('')}</select>
        ${onlyMine ? '' : `<label class="small" style="display:flex;gap:6px;align-items:center;margin-left:8px"><input type="checkbox" id="showDone" ${ui.filter === 'done' ? 'checked' : ''}> Только закрытые дела</label>`}
        <div style="flex:1"></div>
        <button class="btn" id="reset" title="Вернуть исходные демо-данные">Сбросить демо</button>
      </div>
      ${wells.length ? `
      <table class="t">
        <thead><tr><th>Скважина</th><th>Месторождение</th><th>Куст</th><th>Тип</th><th>Окончание бурения</th><th class="num">Дней</th><th>Текущий шаг</th><th>Ответственный</th><th>Прогресс</th></tr></thead>
        <tbody>${wells.map((w) => {
          const s = curStep(w);
          const mine = s && s.role === state.role;
          return `<tr class="click" data-well="${w.id}">
            <td><a href="#/well/${w.id}"><b>${w.name}</b></a></td><td>${w.field}</td><td>${w.pad}</td><td>${w.type}</td>
            <td>${fmtDate(w.drillEnd)}</td><td class="num">${w.done ? '—' : daysSince(w.drillEnd)}</td>
            <td>${s ? `${s.code !== '—' ? `<span class="muted">${s.code}</span> ` : ''}${esc(s.title)}${w.returned ? ' <span class="chip crit">возвращено</span>' : ''}` : '<span class="chip good">Дело закрыто</span>'}</td>
            <td>${s ? `<span class="${mine ? 'mine' : ''}">${ROLES[s.role].name}${mine ? ' · вы' : ''}</span>` : '—'}</td>
            <td>${progressBar(w)}</td></tr>`;
        }).join('')}</tbody>
      </table>` : `<div class="empty">${onlyMine ? 'Нет задач для вашей роли. Переключите роль, чтобы продолжить процесс.' : 'Нет скважин по фильтру'}</div>`}
    </div>`;

  v.querySelectorAll('[data-filter]').forEach((b) => (b.onclick = () => { ui.filter = b.dataset.filter; route(); }));
  v.querySelectorAll('[data-well]').forEach((tr) => (tr.onclick = () => (location.hash = `#/well/${tr.dataset.well}`)));
  const q = $('#q'); q.oninput = () => { ui.q = q.value; route(); const n = $('#q'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
  $('#field').onchange = (e) => { ui.field = e.target.value; route(); };
  if ($('#showDone')) $('#showDone').onchange = (e) => { ui.filter = e.target.checked ? 'done' : 'all'; route(); };
  $('#reset').onclick = () => { if (confirm('Сбросить все изменения мокапа к исходным демо-данным?')) resetDemo(); };
}

// ---------- Цифровое дело скважины ----------
function renderWell(w) {
  renderShell('registry', `<a href="#/">Реестр освоения</a><span class="sep">›</span><span>${w.field}</span><span class="sep">›</span><span>${wellTitle(w)}</span>`);
  const selIdx = ui.sel[w.id] ?? Math.min(w.step, STEPS.length - 1);
  const s = curStep(w);
  const v = $('#view');
  v.innerHTML = `
    <div class="card">
      <div class="well-head">
        <div>
          <div class="muted small">Цифровое дело скважины</div>
          <div class="title">${wellTitle(w)} <span class="muted" style="font-weight:400;font-size:15px">· ${w.field}, куст ${w.pad}</span></div>
          <div class="mt-s">${w.done ? '<span class="chip good">АВР оформлен, паспорт скважины обновлён</span>' : `<span class="chip">Этап: освоение после бурения</span> ${w.returned ? '<span class="chip crit">Возвращено на доработку</span>' : ''}`}</div>
        </div>
        <dl class="facts" style="margin:0 0 0 auto">
          <div><dt>Тип</dt><dd>${w.type}</dd></div>
          <div><dt>Горизонт</dt><dd>${w.horizon}</dd></div>
          <div><dt>Проектный забой</dt><dd>${w.depth} м</dd></div>
          <div><dt>Окончание бурения</dt><dd>${fmtDate(w.drillEnd)}</dd></div>
          <div><dt>Подрядчик</dt><dd>${w.contractor}</dd></div>
          <div><dt>Сейчас у</dt><dd>${s ? ROLES[s.role].name : '—'}</dd></div>
        </dl>
      </div>
    </div>
    <div class="layout mt">
      <div class="card">
        <div class="card-h"><h2>Процесс освоения</h2><span class="muted small">${w.done ? STEPS.length : w.step} / ${STEPS.length}</span></div>
        <ol class="stepper">${STEPS.map((st, i) => stepItem(w, st, i, selIdx)).join('')}</ol>
      </div>
      <div class="layout-right">
        <div class="card" id="panel"></div>
        <div class="grid" style="grid-template-columns: 1fr 1fr">
          <div class="card"><div class="card-h"><h2>Документы дела</h2><span class="muted small">ABAI БД 2.0 · ${w.docs.length}</span></div><div class="card-b docs-scroll">${docList(w.docs.slice().reverse(), true)}</div></div>
          <div class="card"><div class="card-h"><h2>Журнал</h2></div>${w.log.length ? `<ul class="log docs-scroll">${w.log.slice().reverse().map((l) => `<li><span class="when">${fmtDT(l.at)}</span><span><b style="color:${ROLES[l.role].color}">${l.user}</b> · ${esc(l.text)}</span></li>`).join('')}</ul>` : '<div class="empty">Записей пока нет</div>'}</div>
        </div>
      </div>
    </div>`;
  v.querySelectorAll('[data-step]').forEach((b) => (b.onclick = () => {
    ui.sel[w.id] = +b.dataset.step;
    if (b.dataset.op != null) ui.opsTab[w.id] = +b.dataset.op;
    renderWell(w);
  }));
  renderPanel(w, STEPS[selIdx], selIdx);
}

function stepItem(w, st, i, selIdx) {
  const status = w.done || i < w.step ? 'done' : i === w.step ? 'cur' : 'todo';
  const ret = w.returned && w.returned.step === st.id && status === 'cur';
  const sub = st.id === 'ops' ? `<ol class="stepper sub" style="padding:0">${OPS.map((op, k) => {
    const done = w.done || i < w.step || (i === w.step && k < w.ops);
    const cur = i === w.step && k === w.ops;
    return `<li class="${done ? 'done' : cur ? 'cur' : 'todo'}"><button data-step="${i}" data-op="${k}"><span class="dot"></span><span class="s-code">${op.code}</span><div class="s-title">${op.title}</div></button></li>`;
  }).join('')}</ol>` : '';
  return `<li class="${status}${i === selIdx ? ' sel' : ''}${ret ? ' returned' : ''}">
    <button data-step="${i}">
      <span class="dot">${status === 'done' ? '✓' : ret ? '!' : i + 1}</span>
      <span class="s-code">${st.code !== '—' ? st.code : 'новый шаг Dream TO BE'}</span>
      <div class="s-title">${esc(st.title)}</div>
      <div class="s-role" style="color:${ROLES[st.role].color}">${ROLES[st.role].short}${status === 'cur' && st.role === state.role ? ' · ваш шаг' : ''}</div>
    </button>${sub}</li>`;
}

function docList(docs, compact) {
  if (!docs.length) return '<div class="muted small">Документов пока нет</div>';
  return `<div class="docs">${docs.map((d) => {
    const ext = /PDF|скан|Акт|Материалы/i.test(d.name) ? 'PDF' : /Excel|анализ/i.test(d.name) ? 'XLS' : 'DOC';
    return `<div class="doc"><div class="ic ${ext === 'PDF' ? 'pdf' : ''}">${ext}</div>
      <div class="grow"><div class="name">${esc(d.name)}</div><div class="sub">${d.by} · ${fmtDT(d.at)} · ${d.size}${compact ? '' : ` · ${SYSTEMS[d.sys || 'bd'].name}`}</div></div>
      ${d.signed ? '<span class="chip good" title="Подписано через NCA Layer">ЭЦП ✓</span>' : ''}
      <button class="btn ghost" title="Просмотр" onclick="previewDoc('${d.id}')">${ICON.eye}</button></div>`;
  }).join('')}</div>`;
}

window.previewDoc = (id) => {
  // Документ может быть в деле, в очереди загрузки или «справочным» (технический проект)
  const w = state.wells.find((x) => x.docs.some((d) => d.id === id)) || getWell(location.hash.split('/')[2]);
  const d = w.docs.find((x) => x.id === id) || (ui.pending[w.id] || []).find((x) => x.id === id) || techProject(w)[0];
  openModal(`<div class="modal-h" style="background:var(--brand)"><b>${esc(d.name)}</b><button class="x" data-close>×</button></div>
    <div class="modal-b">
      <div style="border:1px solid var(--line);border-radius:6px;padding:24px;background:#fafbfc;font-size:12px;line-height:1.6;min-height:220px">
        <div style="text-align:center;font-weight:600;margin-bottom:12px">${esc(d.name.toUpperCase())}</div>
        <div>Скважина: <b>${w.name}</b> · Месторождение: ${w.field} · Куст: ${w.pad}</div>
        <div>Подрядная организация: ${w.contractor}</div>
        <div>Проектный забой: ${w.depth} м · Тип: ${w.type} · Горизонт: ${w.horizon}</div>
        <div style="margin-top:12px;color:var(--text-3)">[ предпросмотр документа — в мокапе содержимое условное ]</div>
      </div>
      <div class="small muted">Хранилище: ${SYSTEMS[d.sys || 'bd'].name} · Загружено: ${d.by}, ${fmtDT(d.at)}${d.signed ? ' · Подписано ЭЦП через NCA Layer' : ''}</div>
    </div>
    <div class="modal-f"><button class="btn" data-close>Закрыть</button><button class="btn primary" data-close>${ICON.dl} Скачать</button></div>`);
};

// ---------- Панель шага ----------
function renderPanel(w, st, idx) {
  const p = $('#panel');
  const status = w.done || idx < w.step ? 'done' : idx === w.step ? 'cur' : 'todo';
  const canAct = status === 'cur' && st.role === state.role;
  let body = '';
  if (status === 'todo') body = `<div class="callout wait"><span class="grow">Шаг ещё не начат. Станет доступен после выполнения предыдущих шагов.</span></div>${expected(st)}`;
  else if (status === 'cur' && !canAct) body = `<div class="callout wait">${ICON.user.replace('<svg', '<svg width="18" height="18"')}<span class="grow">Ожидает действия роли <b>${ROLES[st.role].name}</b> (${ROLES[st.role].user}).</span><button class="btn primary" id="switchRole">Переключиться на эту роль</button></div>${stepBody(w, st, false)}`;
  else body = (w.returned && w.returned.step === st.id && status === 'cur' ? `<div class="callout crit"><span class="grow"><b>Возвращено на доработку</b> — ${esc(w.returned.by)}: «${esc(w.returned.comment)}»</span></div>` : '') + stepBody(w, st, canAct, status === 'done');

  p.innerHTML = `
    <div class="step-h">
      <div class="meta">
        <span class="chip">${st.code !== '—' ? 'Шаг ' + st.code : 'Новый шаг Dream TO BE'}</span>${roleChip(st.role)}
        ${status === 'done' ? '<span class="chip good">✓ Выполнено</span>' : status === 'cur' ? '<span class="chip warn">В работе</span>' : '<span class="chip sys" style="--x:0">Не начат</span>'}
        <span style="flex:1"></span><span class="muted small">Системы:</span>${st.sys.map(sysChip).join('')}
      </div>
      <h2>${esc(st.title)}</h2>
      <div class="bpmn-note"><b>BPMN</b><span>${esc(st.note)}</span></div>
    </div>
    <div class="card-b" id="stepBody">${body}</div>`;
  if ($('#switchRole')) $('#switchRole').onclick = () => { state.role = st.role; save(); toast(`Вы вошли как: ${ROLES[st.role].name}`); renderWell(w); };
  bindStep(w, st, canAct);
}

function expected(st) {
  return `<div class="grid mt" style="grid-template-columns:1fr 1fr">
    <div><h3>На входе</h3><ul class="small">${(st.in || ['—']).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div><h3>Результат шага</h3><ul class="small">${(st.out || ['—']).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`;
}

const stepDocs = (w, id) => w.docs.filter((d) => d.step === id);

function uploader(key, label, canAct) {
  if (!canAct) return '';
  return `<div class="dropzone" data-drop="${key}">
    ${ICON.upload.replace('<svg', '<svg width="22" height="22"')}<div><b>${esc(label)}</b></div>
    <div class="small muted">Перетащите файл сюда или нажмите, чтобы выбрать · PDF, DOCX, XLSX</div>
    <input type="file" hidden></div>`;
}

function formHTML(fields, data, ro) {
  return `<div class="form">${fields.map((f) => {
    const val = data?.[f.k] ?? '';
    let input;
    if (f.type === 'select') input = `<select data-k="${f.k}" ${ro ? 'disabled' : ''}>${f.opts.map((o) => `<option ${o === val ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    else if (f.type === 'textarea') input = `<textarea data-k="${f.k}" placeholder="${esc(f.ph || '')}" ${ro ? 'readonly' : ''}>${esc(val)}</textarea>`;
    else input = `<input data-k="${f.k}" type="${f.type}" placeholder="${esc(f.ph || '')}" value="${esc(val)}" ${ro ? 'readonly' : ''}>`;
    return `<label class="${f.type === 'textarea' || f.full ? 'full' : ''}">${esc(f.label)}${input}</label>`;
  }).join('')}</div>`;
}
const readForm = (root) => Object.fromEntries([...root.querySelectorAll('[data-k]')].map((i) => [i.dataset.k, i.value]));

const PREP_FIELDS = [
  { k: 'readyDate', label: 'Дата готовности к освоению', type: 'date' },
  { k: 'avrNo', label: '№ акта в АВР+', type: 'text', ph: 'АВР-2026-0000' },
  { k: 'face', label: 'Фактический забой, м', type: 'number', ph: '1255' },
  { k: 'fluid', label: 'Жидкость в скважине', type: 'select', opts: ['Техническая вода', 'Солевой раствор', 'Буровой раствор'] },
];
const PROGRAM_FIELDS = [
  { k: 'method', label: 'Способ освоения', type: 'select', opts: ['Свабирование', 'Компрессирование', 'Замена жидкости на облегчённую'] },
  { k: 'perfPlan', label: 'Плановые интервалы перфорации, м', type: 'text', ph: '1182–1188; 1194–1199' },
  { k: 'duration', label: 'Плановая продолжительность, сут', type: 'number', ph: '6' },
  { k: 'crew', label: 'Бригада', type: 'text', ph: 'Бригада освоения № 4' },
];

function stepBody(w, st, canAct, done) {
  const docs = stepDocs(w, st.id);
  const pend = ui.pending[w.id] || (ui.pending[w.id] = []);
  const pendList = pend.length ? `<div class="mt-s">${docList(pend)}</div>` : '';
  switch (st.id) {
    case 'upload':
      return `${docList(docs)}${canAct ? `<div class="mt">${uploader('Акт приёмки скважины (скан физического документа)', 'Загрузить акт приёмки скважины', true)}</div>${pendList}
        <div class="mt row"><button class="btn primary" id="act" ${pend.length ? '' : 'disabled'}>${ICON.send} Отправить геологу на проверку</button><button class="btn ghost" data-demo-upload="Акт приёмки скважины (скан физического документа)">Загрузить демо-файл</button></div>` : ''}`;

    case 'accept': {
      const checks = ['Фактический забой соответствует техническому проекту', 'Конструкция скважины соответствует техническому проекту', 'Качество крепления подтверждено (АКЦ)', 'Комплект документов полный'];
      return `<h3>Документы на проверку</h3><div class="mt-s">${docList(stepDocs(w, 'upload').concat(techProject(w)))}</div>
        ${done ? `<h3 class="mt">Результат</h3><div class="mt-s">${docList(docs)}</div>` : `
        <h3 class="mt">Проверка по техническому проекту</h3>
        <div class="checklist mt-s">${checks.map((c, i) => `<label><input type="checkbox" class="chk" ${canAct ? '' : 'disabled'}> ${c}</label>`).join('')}</div>
        ${canAct ? `<div class="mt row"><button class="btn primary" id="act" disabled>${ICON.sign} Подписать ЭЦП и принять</button><button class="btn danger" id="ret">${ICON.back} Вернуть подрядчику</button></div>` : ''}`}`;
    }

    case 'send':
      return `${docList(stepDocs(w, 'accept'))}
        ${done ? '<div class="callout good mt">Акт направлен подрядчику через ИС. Уведомление доставлено.</div>' : canAct ? `
        <div class="form mt"><label class="full">Получатель<input readonly value="${w.contractor} — ${ROLES.contractor.user}"></label><label class="full">Комментарий<textarea id="msg">Скважина принята. Прошу приступить к подготовке к освоению.</textarea></label></div>
        <div class="mt"><button class="btn primary" id="act">${ICON.send} Направить подписанный акт подрядчику</button></div>` : ''}`;

    case 'prep':
      return `${formHTML(PREP_FIELDS, w.data.prep || (canAct ? { readyDate: new Date().toISOString().slice(0, 10), fluid: 'Техническая вода' } : {}), !canAct)}
        <h3 class="mt">Документы</h3><div class="mt-s">${docList(docs)}</div>
        ${canAct ? `<div class="grid mt" style="grid-template-columns:1fr 1fr">${uploader('Акт об окончании бурения', 'Акт об окончании бурения', true)}${uploader('Подтверждение готовности', 'Подтверждение готовности', true)}</div>${pendList}
        <div class="mt row"><button class="btn primary" id="act" ${pend.length >= 2 ? '' : 'disabled'}>${ICON.check} Скважина готова к освоению</button><button class="btn ghost" id="demoFill">Заполнить демо-данными</button></div>` : ''}`;

    case 'program':
      return `${formHTML(PROGRAM_FIELDS, w.data.program || {}, !canAct)}
        <h3 class="mt">Исходные данные и программа</h3><div class="mt-s">${docList(docs.length ? docs : techProject(w))}</div>
        ${canAct ? `<div class="grid mt" style="grid-template-columns:1fr 1fr 1fr">${uploader('Финальный отчёт по бурению', 'Финальный отчёт', true)}${uploader('Программа освоения (рабочая)', 'Программа освоения', true)}${uploader('Технический проект', 'Технический проект', true)}</div>${pendList}
        <div class="mt row"><button class="btn primary" id="act" ${pend.some((d) => /Программа/.test(d.name)) ? '' : 'disabled'}>${ICON.send} Отправить на согласование</button><button class="btn ghost" id="demoFill">Заполнить демо-данными</button></div>` : ''}`;

    case 'approve':
      return `<h3>Программа освоения на согласовании</h3>${formHTML(PROGRAM_FIELDS, w.data.program || {}, true)}
        <div class="mt">${docList(stepDocs(w, 'program'))}</div>
        ${done ? `<h3 class="mt">Результат</h3><div class="mt-s">${docList(docs)}</div>` : canAct ? `
        <div class="form mt"><label class="full">Замечания / комментарий<textarea id="comment" placeholder="Необязательно при согласовании; обязательно при возврате"></textarea></label></div>
        <div class="mt row"><button class="btn good" id="act">${ICON.sign} Согласовать и подписать ЭЦП</button><button class="btn danger" id="ret">${ICON.back} Вернуть на доработку</button></div>` : ''}`;

    case 'ops': return opsBody(w, canAct, done);
    case 'observe': return observeBody(w, canAct, done);
    case 'compare': return compareBody(w, canAct, done);

    case 'report': {
      const all = w.docs.filter((d) => d.step !== 'report');
      return `<div class="stats">
          <div class="stat"><div class="v">${all.length}</div><div class="l">документов в деле</div></div>
          <div class="stat"><div class="v">${all.filter((d) => d.signed).length}</div><div class="l">подписано ЭЦП</div></div>
          <div class="stat"><div class="v">0</div><div class="l">передач по e-mail</div></div>
          <div class="stat"><div class="v">${fmtN(avgLast(w, 'qo'))}</div><div class="l">Qн на тех. режиме, т/сут</div></div>
        </div>
        <h3 class="mt">Куда уходят данные</h3>
        <table class="t mt-s"><thead><tr><th>Данные</th><th>Система</th><th>Статус</th></tr></thead><tbody>
          <tr><td>Акт выполненных работ подрядчика</td><td>${sysChip('avr')}</td><td>${done ? '<span class="chip good">✓ оформлен</span>' : '<span class="chip warn">к подписанию</span>'}</td></tr>
          <tr><td>Паспорт скважины: конструкция, интервалы перфорации, оборудование, режим</td><td>${sysChip('bd')}</td><td>${done ? '<span class="chip good">✓ обновлён</span>' : '<span class="chip warn">черновик готов</span>'}</td></tr>
        </tbody></table>
        <h3 class="mt">Черновик паспорта скважины</h3>
        <table class="t mt-s"><tbody>
          <tr><td class="muted">Интервалы перфорации</td><td>${esc(w.data.perf?.intervals || '—')} (${esc(w.data.perf?.gun || '')}, ${esc(w.data.perf?.density || '—')} отв./м)</td></tr>
          <tr><td class="muted">Воронка / гидромуфта</td><td>${esc(w.data.equip?.funnel || '—')} м / ${esc(w.data.equip?.hydro || '—')} м, НКТ ${esc(w.data.equip?.tubing || '—')}</td></tr>
          <tr><td class="muted">Способ освоения</td><td>${esc(w.data.inflow?.method || '—')}</td></tr>
          <tr><td class="muted">Режим (ср. 7 сут)</td><td>Qж ${fmtN(avgLast(w, 'ql'))} т/сут · Qн ${fmtN(avgLast(w, 'qo'))} т/сут · обводнённость ${fmtN(avgLast(w, 'wc'))} %</td></tr>
          <tr><td class="muted">Заключение по сравнению</td><td>${esc(w.data.compareConcl || '—')}</td></tr>
        </tbody></table>
        ${done ? `<div class="mt">${docList(docs)}</div><div class="callout good mt"><span class="grow"><b>АВР оформлен, паспорт скважины обновлён.</b> Цифровое дело закрыто, скважина переведена в действующий фонд.</span></div>` : canAct ? `<div class="mt"><button class="btn good" id="act">${ICON.sign} Подписать АВР ЭЦП и закрыть дело</button></div>` : ''}`;
    }
  }
  return '';
}

function techProject(w) {
  return [{ id: 'tp-' + w.id, name: 'Технический проект (групповой)', by: 'КМГИ', at: new Date(new Date(w.drillEnd).getTime() - 90 * 864e5).toISOString(), size: '8,4 МБ', signed: true, sys: 'bd' }];
}

// --- 4.4 Операции освоения ---
function opsBody(w, canAct, done) {
  const tab = ui.opsTab[w.id] ?? Math.min(w.ops, OPS.length - 1);
  const op = OPS[tab];
  const opDone = done || tab < w.ops;
  const opCur = !done && tab === w.ops;
  const editable = canAct && opCur;
  const pend = ui.pending[w.id] || [];
  const opDocs = w.docs.filter((d) => d.step === 'ops' && d.name === op.doc);
  return `<div class="ops-tabs" style="margin:-16px -16px 16px">${OPS.map((o, k) => {
      const ok = done || k < w.ops;
      return `<button class="${k === tab ? 'sel' : ''}" data-optab="${k}" ${!ok && k > w.ops ? 'disabled' : ''}>${ok ? '<span class="ok">✓</span>' : ''}${o.code} ${o.title}</button>`;
    }).join('')}</div>
    <div class="meta" style="display:flex;gap:6px;margin-bottom:12px;align-items:center"><span class="muted small">Данные пишутся в:</span>${op.sys.map(sysChip).join('')}</div>
    ${formHTML(op.fields, w.data[op.id] || {}, !editable)}
    <h3 class="mt">${esc(op.doc)}</h3><div class="mt-s">${docList(opDocs)}</div>
    ${editable ? `<div class="mt">${uploader(op.doc, 'Загрузить: ' + op.doc, true)}</div>${pend.length ? `<div class="mt-s">${docList(pend)}</div>` : ''}
      <div class="mt row"><button class="btn primary" id="saveOp">${ICON.check} Сохранить операцию ${op.code}</button><button class="btn ghost" id="demoFill">Заполнить демо-данными</button></div>` : ''}
    ${!done && w.ops >= OPS.length && canAct ? `<div class="callout info mt"><span class="grow">Все операции освоения зафиксированы. Данные ГИС и притока сохранены в ABAI БД 2.0.</span><button class="btn primary" id="act">${ICON.send} Завершить освоение, передать на наблюдение</button></div>` : ''}
    ${opDone && !done && !editable && w.ops < OPS.length ? '' : ''}
    ${!opDone && !opCur ? '<div class="callout wait mt">Операция будет доступна после предыдущих.</div>' : ''}`;
}

// --- 4.4.5 Наблюдение ---
function obsRows(w) {
  return genObservation(hash(w.id), +(w.data.inflow?.ql || 44), +(w.data.inflow?.wc || 58));
}
function avgLast(w, k, n = 7) {
  const r = obsRows(w).slice(-n);
  return r.reduce((a, x) => a + x[k], 0) / r.length;
}
const fmtN = (v, d = 1) => Number(v).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });

function observeBody(w, canAct, done) {
  const rows = obsRows(w);
  const last7 = rows.slice(-7).map((r) => r.ql);
  const mean = last7.reduce((a, b) => a + b, 0) / 7;
  const cv = Math.sqrt(last7.reduce((a, b) => a + (b - mean) ** 2, 0) / 7) / mean * 100;
  const stable = cv < 5;
  return `<div class="flow-strip">${sysChip('pdim')}<span class="arrow">→ режим на контроле →</span>${sysChip('tr')}<span class="muted" style="margin-left:auto">Период: ${fmtDate(rows[0].date)} — ${fmtDate(rows[rows.length - 1].date)}</span></div>
    <div class="stats mt">
      <div class="stat"><div class="v">${fmtN(avgLast(w, 'ql'))}</div><div class="l">Qж, т/сут (ср. 7 сут)</div></div>
      <div class="stat"><div class="v">${fmtN(avgLast(w, 'qo'))}</div><div class="l">Qн, т/сут (ср. 7 сут)</div></div>
      <div class="stat"><div class="v">${fmtN(avgLast(w, 'wc'))} %</div><div class="l">Обводнённость (ср. 7 сут)</div></div>
      <div class="stat"><div class="v">${fmtN(cv)} %</div><div class="l">${stable ? '<span style="color:var(--good-ink)">✓ Режим стабилен</span>' : '<span style="color:var(--warn-ink)">⚠ Колебания дебита</span>'} (разброс Qж)</div></div>
    </div>
    <div class="row mt" style="align-items:center"><h3 style="flex:1">Работа скважины за 30 суток</h3>
      <div class="seg"><button data-obs="chart" class="${ui.obsView === 'chart' ? 'sel' : ''}">График</button><button data-obs="table" class="${ui.obsView === 'table' ? 'sel' : ''}">Таблица</button></div></div>
    ${ui.obsView === 'chart' ? `<div class="legend mt-s"><span><i style="background:var(--series-1)"></i>Дебит жидкости, т/сут</span><span><i style="background:var(--series-2)"></i>Дебит нефти, т/сут</span></div><div id="obsChart"></div>`
      : `<div style="max-height:320px;overflow:auto" class="mt-s"><table class="t"><thead><tr><th>Сутки</th><th>Дата</th><th class="num">Qж, т/сут</th><th class="num">Qн, т/сут</th><th class="num">Обводн., %</th><th class="num">Время работы, ч</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.day}</td><td>${fmtDate(r.date)}</td><td class="num">${fmtN(r.ql)}</td><td class="num">${fmtN(r.qo)}</td><td class="num">${fmtN(r.wc)}</td><td class="num">${r.hours}</td></tr>`).join('')}</tbody></table></div>`}
    ${done ? '<div class="callout good mt">Выход на технологический режим подтверждён.</div>' : canAct ? `<div class="mt row"><button class="btn primary" id="act">${ICON.check} Подтвердить выход на технологический режим</button></div>` : ''}`;
}

// --- 4.4.6 Сравнение с соседями ---
function compareBody(w, canAct, done) {
  const nb = genNeighbors(hash(w.id), w.name);
  return `<div class="row" style="align-items:center"><div class="flow-strip" style="flex:1">${sysChip('pdim')}<span class="muted">Окружение: скважины в радиусе 1 км, горизонт ${w.horizon}</span></div>
      <div class="seg"><button data-cmp="chart" class="${ui.cmpView === 'chart' ? 'sel' : ''}">График</button><button data-cmp="table" class="${ui.cmpView === 'table' ? 'sel' : ''}">Таблица</button></div></div>
    ${ui.cmpView === 'chart' ? `<h3 class="mt">Дебит нефти, т/сут — скв. ${w.name} и соседние скважины</h3><div class="legend mt-s"><span><i class="bar" style="background:var(--series-1)"></i>Скв. ${w.name} (ср. 7 сут)</span><span><i class="bar" style="background:var(--neutral-mark)"></i>Соседние скважины (текущий режим)</span></div><div id="cmpChart"></div><div class="small muted mt-s" id="cmpNote"></div>`
      : `<table class="t mt"><thead><tr><th>Скважина</th><th class="num">Расстояние, м</th><th class="num">Qж, т/сут</th><th class="num">Qн, т/сут</th><th class="num">Обводн., %</th><th class="num">Год ввода</th></tr></thead><tbody>
        <tr class="me"><td>${w.name} (освоение)</td><td class="num">—</td><td class="num">${fmtN(avgLast(w, 'ql'))}</td><td class="num">${fmtN(avgLast(w, 'qo'))}</td><td class="num">${fmtN(avgLast(w, 'wc'))}</td><td class="num">2026</td></tr>
        ${nb.map((n) => `<tr><td>${n.name}</td><td class="num">${n.dist}</td><td class="num">${fmtN(n.ql)}</td><td class="num">${fmtN(n.qo)}</td><td class="num">${fmtN(n.wc)}</td><td class="num">${n.year}</td></tr>`).join('')}</tbody></table>`}
    <div class="form mt"><label class="full">Заключение геолога<textarea id="concl" ${canAct ? '' : 'readonly'} placeholder="Вывод о соответствии показателей окружению">${esc(w.data.compareConcl || '')}</textarea></label></div>
    ${!done && canAct ? `<div class="mt row"><button class="btn primary" id="act">${ICON.check} Сохранить анализ и передать на отчётность</button><button class="btn ghost" id="autoConcl">Предложить формулировку</button></div>` : ''}`;
}

// ---------- Действия ----------
function bindStep(w, st, canAct) {
  const body = $('#stepBody');
  // Загрузка файлов: настоящий выбор файла или перетаскивание — в мокапе сохраняем только имя
  body.querySelectorAll('[data-drop]').forEach((z) => {
    const inp = z.querySelector('input');
    const add = (fileName) => { stagePending(w, z.dataset.drop, fileName); renderPanel(w, st, w.step); };
    z.onclick = () => inp.click();
    inp.onchange = () => inp.files[0] && add(inp.files[0].name);
    z.ondragover = (e) => { e.preventDefault(); z.classList.add('over'); };
    z.ondragleave = () => z.classList.remove('over');
    z.ondrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) add(f.name); };
  });
  body.querySelectorAll('[data-demo-upload]').forEach((b) => (b.onclick = () => { stagePending(w, b.dataset.demoUpload); renderPanel(w, st, w.step); }));
  body.querySelectorAll('[data-optab]').forEach((b) => (b.onclick = () => { ui.opsTab[w.id] = +b.dataset.optab; renderPanel(w, st, STEPS.indexOf(st)); }));
  body.querySelectorAll('[data-obs]').forEach((b) => (b.onclick = () => { ui.obsView = b.dataset.obs; renderPanel(w, st, STEPS.indexOf(st)); }));
  body.querySelectorAll('[data-cmp]').forEach((b) => (b.onclick = () => { ui.cmpView = b.dataset.cmp; renderPanel(w, st, STEPS.indexOf(st)); }));

  if ($('#obsChart')) lineChart($('#obsChart'), obsRows(w), [
    { key: 'ql', name: 'Qж', color: 'var(--series-1)', unit: 'т/сут' },
    { key: 'qo', name: 'Qн', color: 'var(--series-2)', unit: 'т/сут' },
  ], { xLabel: (r) => r.date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }), tipTitle: (r) => `Сутки ${r.day} · ${fmtDate(r.date)}` });
  if ($('#cmpChart')) {
    const nb = genNeighbors(hash(w.id), w.name);
    const items = [{ label: w.name, value: avgLast(w, 'qo'), highlight: true, extra: `<div class="tt-r"><span>Обводнённость</span><b>${fmtN(avgLast(w, 'wc'))} %</b></div>` }]
      .concat(nb.map((n) => ({ label: n.name, value: n.qo, extra: `<div class="tt-r"><span>Обводнённость</span><b>${fmtN(n.wc)} %</b></div><div class="tt-r"><span>Расстояние</span><b>${n.dist} м</b></div>` })));
    const med = barChart($('#cmpChart'), items, { unit: 'т/сут', valueName: 'Дебит нефти' });
    const diff = (avgLast(w, 'qo') / med - 1) * 100;
    $('#cmpNote').textContent = `Скв. ${w.name}: ${diff >= 0 ? 'выше' : 'ниже'} медианы окружения на ${fmtN(Math.abs(diff), 0)} %.`;
    ui.cmpDiff = diff;
  }

  if (!canAct) return;
  const act = $('#act');
  const me = role();

  // Чек-лист приёмки разблокирует подпись
  const chks = body.querySelectorAll('.chk');
  if (chks.length && act) chks.forEach((c) => (c.onchange = () => (act.disabled = ![...chks].every((x) => x.checked))));

  if ($('#demoFill')) $('#demoFill').onclick = () => {
    if (st.id === 'prep') { w.data.prep = { readyDate: new Date().toISOString().slice(0, 10), avrNo: `АВР-2026-${String(hash(w.id) % 9000 + 1000)}`, face: w.depth - 4, fluid: 'Техническая вода' }; stagePending(w, 'Акт об окончании бурения'); stagePending(w, 'Подтверждение готовности'); }
    if (st.id === 'program') { w.data.program = { method: 'Свабирование', perfPlan: '1182–1188; 1194–1199', duration: 6, crew: 'Бригада освоения № 4' }; stagePending(w, 'Финальный отчёт по бурению'); stagePending(w, 'Программа освоения (рабочая)'); }
    if (st.id === 'ops') { const op = OPS[ui.opsTab[w.id] ?? w.ops]; w.data[op.id] = Object.assign({}, op.demo); stagePending(w, op.doc); }
    save(); renderPanel(w, st, w.step);
  };
  if ($('#autoConcl')) $('#autoConcl').onclick = () => {
    const d = ui.cmpDiff || 0;
    $('#concl').value = Math.abs(d) < 15 ? `Дебит нефти скважины ${w.name} соответствует окружению (отклонение от медианы ${fmtN(d, 0)} %). Скважина выведена на режим, рекомендуется перевод в действующий фонд.`
      : d > 0 ? `Дебит нефти скважины ${w.name} выше медианы окружения на ${fmtN(d, 0)} %. Рекомендуется перевод в действующий фонд и контроль обводнённости.`
      : `Дебит нефти скважины ${w.name} ниже медианы окружения на ${fmtN(-d, 0)} %. Рекомендуется ГДИС и анализ качества вскрытия пласта.`;
  };

  if ($('#saveOp')) $('#saveOp').onclick = () => {
    const op = OPS[w.ops];
    const data = readForm(body);
    if (Object.values(data).some((x) => x === '')) return alert('Заполните все поля операции');
    w.data[op.id] = data;
    commitPending(w, 'ops', { sys: op.sys.includes('tr') ? 'bd' : 'bd' });
    w.log.push({ at: new Date().toISOString(), role: state.role, user: me.user, text: `${op.code} · ${op.title} — данные записаны в ${op.sys.map((k) => SYSTEMS[k].name).join(' и ')}` });
    w.ops++;
    ui.opsTab[w.id] = Math.min(w.ops, OPS.length - 1);
    save(); toast(`${op.code} сохранена в ${op.sys.map((k) => SYSTEMS[k].name).join(', ')}`); renderWell(w);
  };

  if ($('#ret')) $('#ret').onclick = () => {
    const c = ($('#comment') && $('#comment').value.trim()) || prompt('Причина возврата:');
    if (!c) return;
    const backTo = st.id === 'accept' ? 'upload' : 'program';
    w.returned = { step: backTo, comment: c, by: `${me.name}, ${me.user}` };
    w.step = STEPS.findIndex((x) => x.id === backTo);
    ui.sel[w.id] = w.step;
    w.log.push({ at: new Date().toISOString(), role: state.role, user: me.user, text: `Возвращено на доработку: ${c}` });
    save(); toast('Возвращено на доработку'); renderWell(w);
  };

  if (!act) return;
  act.onclick = () => {
    switch (st.id) {
      case 'upload': commitPending(w, 'upload'); return advance(w, st, 'Акт приёмки загружен в ABAI БД 2.0 и направлен геологу');
      case 'accept': return signNCA('Акт приёмки скважины ' + w.name, () => { addDoc(w, { name: 'Акт приёмки, подписанный ЭЦП', step: 'accept', by: me.user, at: new Date().toISOString(), signed: true }); advance(w, st, 'Акт приёмки подписан ЭЦП и сохранён в ABAI БД 2.0'); });
      case 'send': return advance(w, st, 'Подписанный акт направлен подрядчику через ИС');
      case 'prep': {
        const data = readForm(body);
        if (!data.avrNo || !data.face) return alert('Заполните № акта в АВР+ и фактический забой');
        w.data.prep = data; commitPending(w, 'prep');
        return advance(w, st, 'Скважина готова к освоению. Акт об окончании бурения в ABAI БД 2.0');
      }
      case 'program': {
        const data = readForm(body);
        if (!data.perfPlan) return alert('Укажите плановые интервалы перфорации');
        w.data.program = data; commitPending(w, 'program');
        return advance(w, st, 'Программа освоения отправлена на согласование');
      }
      case 'approve': return signNCA('Программа освоения скважины ' + w.name, () => {
        const now = new Date().toISOString();
        addDoc(w, { name: 'Согласованная программа освоения', step: 'approve', by: me.user, at: now, signed: true });
        addDoc(w, { name: 'ПОР', step: 'approve', by: me.user, at: now, signed: true });
        advance(w, st, 'Программа освоения согласована и подписана ЭЦП');
      });
      case 'ops':
        addDoc(w, { name: 'Суточные рапорты освоения (сводный)', step: 'ops', by: me.user, at: new Date().toISOString() });
        return advance(w, st, 'Операции освоения завершены. Скважина передана на наблюдение');
      case 'observe': w.data.observeOk = true; return advance(w, st, 'Выход на технологический режим подтверждён');
      case 'compare': {
        const c = $('#concl').value.trim();
        if (!c) return alert('Добавьте заключение (или нажмите «Предложить формулировку»)');
        w.data.compareConcl = c;
        addDoc(w, { name: 'Сравнительный анализ скважин', step: 'compare', by: me.user, at: new Date().toISOString(), sys: 'pdim' });
        return advance(w, st, 'Сравнительный анализ сохранён (ABAI ПДИМ 2.0)');
      }
      case 'report': return signNCA('Акт выполненных работ по освоению скважины ' + w.name, () => {
        const now = new Date().toISOString();
        addDoc(w, { name: 'Акт выполненных работ', step: 'report', by: me.user, at: now, signed: true, sys: 'avr' });
        addDoc(w, { name: 'Паспорт скважины (обновлён)', step: 'report', by: me.user, at: now, sys: 'bd' });
        w.done = true;
        advance(w, st, 'АВР оформлен, паспорт скважины обновлён. Скважина переведена в действующий фонд');
      });
    }
  };
}

function stagePending(w, docName, fileName) {
  const list = ui.pending[w.id] || (ui.pending[w.id] = []);
  if (list.some((d) => d.name === docName)) return;
  list.push({ id: 'p' + Math.random().toString(36).slice(2, 8), name: docName, file: fileName, by: role().user, at: new Date().toISOString(), size: (200 + Math.floor(Math.random() * 1800)) + ' КБ', signed: false, sys: 'bd' });
}
function commitPending(w, stepId) {
  (ui.pending[w.id] || []).forEach((d) => w.docs.push(Object.assign({}, d, { id: 'd' + d.id.slice(1), step: stepId })));
  ui.pending[w.id] = [];
}

function advance(w, st, msg) {
  w.log.push({ at: new Date().toISOString(), role: state.role, user: role().user, text: `${st.code !== '—' ? st.code + ' · ' : ''}${msg}` });
  if (w.returned && w.returned.step === st.id) w.returned = null;
  w.step = Math.min(w.step + 1, STEPS.length);
  if (w.step >= STEPS.length) w.done = true;
  ui.sel[w.id] = Math.min(w.step, STEPS.length - 1);
  save(); toast(msg); renderWell(w);
}

// ---------- Модальные окна ----------
function openModal(html) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal">${html}</div>`;
  bg.addEventListener('click', (e) => { if (e.target === bg || e.target.closest('[data-close]')) bg.remove(); });
  document.body.appendChild(bg);
  return bg;
}

// Имитация подписания через NCA Layer
function signNCA(docTitle, onSigned) {
  const me = role();
  const bg = openModal(`
    <div class="modal-h"><b>NCALayer</b><span class="small" style="opacity:.7">подписание документа</span><button class="x" data-close>×</button></div>
    <div class="modal-b">
      <div class="small">Документ: <b>${esc(docTitle)}</b></div>
      <div class="small muted">Хранилище ключей</div>
      <label class="cert sel"><span><input type="radio" name="cert" checked> <b>${me.user}</b> — ГОСТ 34.310-2004 (подпись)</span><span class="muted">${me.org} · действителен до 14.03.2027</span></label>
      <label class="cert"><span><input type="radio" name="cert"> <b>${me.user}</b> — RSA (аутентификация)</span><span class="muted">не предназначен для подписания</span></label>
      <div class="form" style="grid-template-columns:1fr"><label>Пароль к ключу<input type="password" id="pin" value="••••••••"></label></div>
      <div id="signState" class="small muted"></div>
    </div>
    <div class="modal-f"><button class="btn" data-close>Отмена</button><button class="btn primary" id="doSign">${ICON.sign} Подписать</button></div>`);
  bg.querySelector('#doSign').onclick = () => {
    const s = bg.querySelector('#signState');
    s.innerHTML = '<span style="display:flex;gap:8px;align-items:center"><span class="spinner"></span>Формирование подписи CMS…</span>';
    bg.querySelector('#doSign').disabled = true;
    setTimeout(() => { s.innerHTML = '<span style="color:var(--good-ink)">✓ Подпись сформирована и проверена (OCSP)</span>'; }, 900);
    setTimeout(() => { bg.remove(); onSigned(); }, 1600);
  };
}

// ---------- Процесс AS IS → Dream TO BE ----------
function renderProcess() {
  renderShell('process', '<span>Процесс «Б4. Освоение»</span><span class="sep">·</span><span>из 04_4. Освоение.bpmn</span>');
  const lanes = ['contractor', 'geologist', 'dzo'];
  $('#view').innerHTML = `
    <div class="variants">${PROCESS_VARIANTS.map((v) => `
      <div class="card variant ${v.tone}"><div class="card-b">
        <div class="tag">${v.sub}</div><h2 style="margin-top:4px">${v.title}</h2>
        <div class="small muted mt-s">Участники: ${v.lanes}</div>
        <ul>${v.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        ${v.key === 'tobe' ? '<div class="mt"><a class="btn primary" href="#/well/u7412">Пройти процесс на скв. 7412 →</a></div>' : ''}
      </div></div>`).join('')}
    </div>

    <div class="card mt">
      <div class="card-h"><h2>Dream TO BE — дорожки и шаги</h2><span class="muted small">Нажмите на шаг, чтобы открыть его в демо-скважине</span></div>
      <div class="swim"><div class="swim-grid">
        ${lanes.map((ln) => `<div class="swim-lane"><div class="ln" style="color:${ROLES[ln].color}">${ROLES[ln].name}</div>
          ${STEPS.map((st, i) => `<div class="cell">${st.role === ln ? `<a class="swim-task" href="#/well/u7412" data-jump="${i}" style="text-decoration:none;color:inherit"><b>${st.code !== '—' ? st.code : 'новый шаг'}</b>${esc(st.title)}<div class="s">${st.sys.map((k) => `<span>${SYSTEMS[k].name}</span>`).join('')}</div></a>` : ''}</div>`).join('')}
        </div>`).join('')}
      </div></div>
    </div>

    <div class="card mt">
      <div class="card-h"><h2>Системы по шагам: три варианта</h2></div>
      <table class="t"><thead><tr><th>Шаг</th><th>AS IS</th><th style="color:var(--brand)">Dream TO BE (ABAI)</th><th>TO BE Nedra</th></tr></thead>
        <tbody>${PROCESS_MATRIX.map((r) => `<tr><td><b>${r.step}</b></td><td class="muted">${r.asis}</td><td>${r.tobe}</td><td class="muted">${r.nedra}</td></tr>`).join('')}</tbody></table>
    </div>

    <div class="grid mt" style="grid-template-columns:1fr 1fr">
      <div class="card"><div class="card-h"><h2>Что меняется для пользователей</h2></div><div class="card-b">
        <div class="stats" style="grid-template-columns:repeat(3,1fr)">
          <div class="stat"><div class="v">10 → 0</div><div class="l">документов Word / PDF / Excel</div></div>
          <div class="stat"><div class="v">2</div><div class="l">новых шага: загрузка акта в ИС, отправка по ИС</div></div>
          <div class="stat"><div class="v">3</div><div class="l">подписи ЭЦП в ИС: акт, программа, АВР</div></div>
        </div>
        <ul class="small mt">
          <li>Геолог принимает скважину и подписывает акт в ABAI БД 2.0, а не по почте.</li>
          <li>Подрядчик ведёт цифровую отчётность по каждой операции (4.4.1–4.4.4).</li>
          <li>Месяц наблюдения — автоматически: Qж, Qн и обводнённость из ABAI ПДИМ 2.0, режим на контроле в ТР 2.0.</li>
          <li>Сравнение с соседями — в ABAI ПДИМ 2.0, без Excel.</li>
          <li>Паспорт скважины обновляется в БД 2.0, АВР по освоению — в АВР+; скважина переходит в действующий фонд.</li>
        </ul></div></div>
      <div class="card"><div class="card-h"><h2>Системы в TO BE</h2></div>
        <table class="t"><tbody>${Object.values(SYSTEMS).map((s) => `<tr><td><b>${s.name}</b></td><td class="muted">${s.desc}</td></tr>`).join('')}</tbody></table></div>
    </div>`;
  document.querySelectorAll('[data-jump]').forEach((a) => (a.onclick = () => { ui.sel.u7412 = +a.dataset.jump; }));
}

route();
