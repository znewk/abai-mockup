// Презентация «Процессы Upstream: AS IS → Dream TO BE»: сводная по трём уровням процессов и борд направлений.
// Уровни: 1 — направление (Геология), 2 — процесс BPMN (Г1 …), 3 — шаг процесса (1.1 …).
// Данные — из самих модулей (bpmn-data.js, config.js / model.js в скрытом iframe, как в дереве ЦД Актива), поэтому цифры совпадают с прототипами:
// шаг — задача BPMN (variantStats), AS IS — вариант, с которым прототип сравнивает Dream TO BE.

// Направления — как в режиме «Процессы модулей» дерева ЦД Актива (LS_MODS); Освоение — процесс Б4 направления «Бурение и освоение»
const PR_DIRS = [
  { id: 'geologiya', name: 'Геология', sub: 'Г1, Г3, Г3.1–Г3.4' },
  { id: 'razrabotka', name: 'Разработка', sub: 'Р1–Р5' },
  { id: 'burenie', name: 'Бурение и освоение', sub: 'Б1–Б5 (Б4 — модуль «Освоение»)' },
  { id: 'dobycha', name: 'Добыча', sub: 'Д1–Д9 · ОМГ', pre: 'Д' },
];
const PR_SLIDES = [
  { id: 'sum', t: 'Сводная AS IS и Dream TO BE' },
  { id: 'dirs', t: 'Направления' },
];
const PR = { i: 0, D: null };
const prEsc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const prPlural = (n, a, b, c) => (n % 10 === 1 && n % 100 !== 11 ? a : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? b : c);
const prMod = (id) => ABAI_MODULES.find((m) => m.id === id) || {};
const prTree = (...path) => `../tree/index.html#pm/${path.map(encodeURIComponent).join('/')}`;

// Модуль в скрытом iframe: у всех модулей одинаковые имена переменных (BPMN, VARIANTS, pool …)
function prEnv(m) {
  return new Promise((ok) => {
    const f = document.createElement('iframe');
    f.style.display = 'none'; f.setAttribute('aria-hidden', 'true');
    document.body.appendChild(f);
    const d = f.contentDocument;
    d.open(); d.write('<!doctype html><html><head></head><body></body></html>'); d.close();
    const base = new URL(ABAI_ROOT + prMod(m).v1, location.href).href;
    const files = m === 'dobycha' ? ['js/bpmn-data.js', 'js/model.js'] : ['js/bpmn-data.js', 'js/config.js', '../shared/proc/model.js'];
    let i = 0;
    const next = () => {
      if (i >= files.length) return ok(f.contentWindow);
      const s = d.createElement('script');
      s.src = new URL(files[i++], base).href;
      s.onload = next; s.onerror = next;
      d.head.appendChild(s);
    };
    next();
  });
}
const prEv = (w, x) => { try { return w.eval(x); } catch (e) { return undefined; } };

// Цифры направления по вариантам AS IS и Dream TO BE
async function prDir(dir) {
  const w = await prEnv(dir.id);
  const B = prEv(w, 'BPMN') || [], V = prEv(w, 'VARIANTS') || {}, pool = prEv(w, 'pool'), stats = prEv(w, 'variantStats'), tasksOf = prEv(w, 'tasksOf');
  const procs = B.map((p) => {
    const st = {};
    ['asis', 'dream'].forEach((v) => { if (pool(p.num, v)) st[v] = stats(p.num, v); });
    const dp = pool(p.num, 'dream');
    return { num: p.num, code: p.code || (dir.pre || '') + p.num, t: p.title, st, tasks: dp ? tasksOf(dp) : [] };
  });
  const sum = (v, f) => procs.reduce((t, x) => t + (x.st[v] ? f(x.st[v]) : 0), 0);
  const tot = (v) => ({ procs: procs.filter((x) => x.st[v]).length, steps: sum(v, (s) => s.steps), abai: sum(v, (s) => s.abaiSteps) });
  return { ...dir, mod: prMod(dir.id), V, procs, asis: tot('asis'), dream: tot('dream') };
}

// Пример уровней — из данных: первое направление, его первый процесс, шаг 1.1 в Dream TO BE
function prExample(D) {
  const d = D[0], P = d.procs[0], ts = P ? P.tasks : [];
  const s = ts.find((x) => x.code === '1.1') || ts[0];
  return [d.name, P ? `${P.code} ${P.t}` : '', s ? `${s.code} ${s.title}` : ''];
}

const prDelta = (a, b) => { const x = b - a; return x ? `<em class="${x > 0 ? 'up' : 'dn'}">${x > 0 ? '+' : '−'}${Math.abs(x)}</em>` : '<em>без изменений</em>'; };

function prSlideSum(D) {
  const T = (v, k) => D.reduce((t, d) => t + d[v][k], 0);
  const ex = prExample(D);
  const lv = [
    { n: 1, t: 'Направления', a: D.filter((d) => d.asis.procs).length, b: D.filter((d) => d.dream.procs).length, ex: ex[0] },
    { n: 2, t: 'Процессы BPMN', a: T('asis', 'procs'), b: T('dream', 'procs'), ex: ex[1] },
    { n: 3, t: 'Шаги процессов', a: T('asis', 'steps'), b: T('dream', 'steps'), ex: ex[2] },
  ];
  // Процессы без Dream TO BE в BPMN — отдельной пометкой
  const noDream = D.flatMap((d) => d.procs.filter((p) => p.st.asis && !p.st.dream).map((p) => `${p.code} ${p.t}`));
  return `<div class="pr-slide">
    <div class="pr-h"><span>1 / ${PR_SLIDES.length}</span><h1>Процессы Upstream: AS IS и Dream TO BE</h1>
      <p>Сводные цифры всех направлений на трёх уровнях процессов: направление → процесс BPMN → шаг процесса.</p></div>
    <div class="pr-lv">${lv.map((x) => `<div class="pr-lv-c">
      <div class="pr-lv-h"><i>${x.n}</i><b>Уровень ${x.n} · ${x.t}</b></div>
      <div class="pr-lv-n"><div class="a"><span>AS IS</span><b>${x.a}</b></div><div class="arr">→</div><div class="d"><span>Dream TO BE</span><b>${x.b}</b></div></div>
      <div class="pr-lv-d">${prDelta(x.a, x.b)}</div>
      <div class="pr-lv-ex"><span>например</span>${prEsc(x.ex)}</div></div>`).join('')}</div>
    <table class="pr-t">
      <thead><tr><th rowspan="2">Направление (уровень 1)</th><th colspan="3">Процессы BPMN (уровень 2)</th><th colspan="3">Шаги процессов (уровень 3)</th></tr>
        <tr><th>AS IS</th><th class="d">Dream TO BE</th><th>изменение</th><th>AS IS</th><th class="d">Dream TO BE</th><th>изменение</th></tr></thead>
      <tbody>${D.map((d) => `<tr>
        <td><i class="pr-dot" style="background:${d.mod.color}"></i><b>${prEsc(d.name)}</b><small>${prEsc(d.sub)} · вариант ${prEsc(d.V.asis.name)}${d.V.asis.sub ? ': ' + prEsc(d.V.asis.sub.charAt(0).toLowerCase() + d.V.asis.sub.slice(1)) : ''}</small></td>
        <td>${d.asis.procs}</td><td class="d">${d.dream.procs}</td><td>${prDelta(d.asis.procs, d.dream.procs)}</td>
        <td>${d.asis.steps}</td><td class="d">${d.dream.steps}</td><td>${prDelta(d.asis.steps, d.dream.steps)}</td></tr>`).join('')}
        <tr class="sum"><td><b>Итого</b></td><td>${T('asis', 'procs')}</td><td class="d">${T('dream', 'procs')}</td><td>${prDelta(T('asis', 'procs'), T('dream', 'procs'))}</td>
          <td>${T('asis', 'steps')}</td><td class="d">${T('dream', 'steps')}</td><td>${prDelta(T('asis', 'steps'), T('dream', 'steps'))}</td></tr></tbody>
    </table>
    <p class="pr-src">Источник — итоговые BPMN направлений. Шаг — задача BPMN, счёт как в прототипах модулей. AS IS — вариант «как сейчас», с которым прототип сравнивает Dream TO BE (вид AS IS указан у каждого направления).${noDream.length ? ` В BPMN нет варианта Dream TO BE: ${prEsc(noDream.join('; '))} — процесс учтён только в AS IS.` : ''}</p>
  </div>`;
}

function prSlideDirs(D) {
  const kv = (a, b, t) => `<div><b>${a} → <u>${b}</u></b><span>${t}</span></div>`;
  const kh = '<p class="pr-dir-kh"><span>AS IS</span> → <u>Dream TO BE</u></p>';
  return `<div class="pr-slide">
    <div class="pr-h"><span>2 / ${PR_SLIDES.length}</span><h1>Направления Upstream</h1>
      <p>Карточка направления открывает его процессы в дереве ЦД Актива: сравнение схем AS IS → Dream TO BE, дерево связей процессов и схема потоков данных между системами.</p></div>
    <div class="pr-board">${D.map((d) => `<a class="pr-dir" href="${prTree('pm:' + d.id)}" style="--c:${d.mod.color}">
      <div class="pr-dir-h"><em>${prEsc(d.mod.block)}</em><b>${prEsc(d.name)}</b><span>${prEsc(d.sub)}</span></div>
      <div class="pr-dir-k">${kh}${kv(d.asis.procs, d.dream.procs, 'процессов')}${kv(d.asis.steps, d.dream.steps, 'шагов')}${kv(d.asis.abai, d.dream.abai, 'шагов в ABAI')}</div>
      <div class="pr-dir-p">${d.procs.map((p) => (p.st.dream
        ? `<span class="pr-pc" data-href="${prTree('pm:' + d.id, 'pp:' + p.code)}" title="Открыть процесс в дереве ЦД Актива"><b>${prEsc(p.code)}</b> ${prEsc(p.t)}</span>`
        : `<span class="pr-pc off" title="В BPMN нет варианта Dream TO BE"><b>${prEsc(p.code)}</b> ${prEsc(p.t)} · только AS IS</span>`)).join('')}</div>
      <div class="pr-dir-in"><span>В дереве ЦД Актива</span><i>Сравнение схем</i><i>Дерево связей</i><i>Схема потоков данных</i></div>
      <div class="pr-dir-go">Открыть процессы направления →</div></a>`).join('')}</div>
  </div>`;
}

function prRender() {
  const main = document.querySelector('.pr-main');
  if (!PR.D) return;
  main.innerHTML = PR_SLIDES[PR.i].id === 'sum' ? prSlideSum(PR.D) : prSlideDirs(PR.D);
  main.scrollTop = 0;
  // Процесс на карточке — сразу в процесс дерева, не в направление
  main.querySelectorAll('.pr-pc[data-href]').forEach((s) => (s.onclick = (e) => { e.preventDefault(); e.stopPropagation(); location.href = s.dataset.href; }));
  document.querySelector('.pr-tabs').innerHTML = PR_SLIDES.map((s, i) => `<button class="${i === PR.i ? 'on' : ''}" data-sl="${i}">${i + 1} · ${prEsc(s.t)}</button>`).join('');
  document.querySelectorAll('[data-sl]').forEach((b) => (b.onclick = () => prGo(+b.dataset.sl)));
  const nx = PR_SLIDES[PR.i + 1], pv = PR_SLIDES[PR.i - 1];
  const bN = document.querySelector('[data-nav="1"]'), bP = document.querySelector('[data-nav="-1"]');
  bN.disabled = !nx; bP.disabled = !pv;
  bN.innerHTML = `Далее ▶${nx ? `<small>${prEsc(nx.t)}</small>` : ''}`;
  bP.innerHTML = `◀ Назад${pv ? `<small>${prEsc(pv.t)}</small>` : ''}`;
}
function prGo(i) {
  if (i < 0 || i >= PR_SLIDES.length) return;
  PR.i = i;
  history.replaceState(null, '', '#' + (i + 1));
  prRender();
}
function prInit() {
  PR.i = Math.min(PR_SLIDES.length, Math.max(1, parseInt(location.hash.slice(1), 10) || 1)) - 1;
  document.querySelectorAll('[data-nav]').forEach((b) => (b.onclick = () => prGo(PR.i + (b.dataset.nav === '1' ? 1 : -1))));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); prGo(PR.i + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prGo(PR.i - 1); }
  });
  window.addEventListener('hashchange', () => { const i = (parseInt(location.hash.slice(1), 10) || 1) - 1; if (i !== PR.i) prGo(i); });
  Promise.all(PR_DIRS.map(prDir)).then((D) => { PR.D = D; prRender(); });
}
prInit();
