// Реестр модулей мокапа ABAI: портал и переходы между модулями.
// Подключается во всех приложениях: <script src="…/shared/modules.js" data-root="…/"></script>

const ABAI_MODULES = [
  {
    id: 'geologiya', name: 'Геология', short: 'Геология', block: 'Геология и разведка', color: '#5b6b2f',
    desc: '6 процессов: контракт на недропользование, доразведка, полевые СРР, обработка и интерпретация сейсмики, геологическая модель.',
    processes: 6, v1: 'geologiya/', v2: 'geologiya/v2/',
  },
  {
    id: 'razrabotka', name: 'Разработка', short: 'Разработка', block: 'Разработка месторождений', color: '#0e7490',
    desc: '5 процессов: выбор системы разработки, программа ГТМ, среднесрочный профиль добычи, оптимизация ППД, моделирование пласта.',
    processes: 5, v1: 'razrabotka/', v2: 'razrabotka/v2/',
  },
  {
    id: 'burenie', name: 'Бурение', short: 'Бурение', block: 'Бурение', color: '#9c4221',
    desc: '5 процессов: проектирование скважин, подготовка к бурению, мониторинг бурения, освоение, бригады ВСР.',
    processes: 5, v1: 'burenie/', v2: 'burenie/v2/',
  },
  {
    id: 'osvoenie', name: 'Освоение скважин', short: 'Освоение', block: 'Бурение', color: '#b7791f',
    desc: 'Освоение скважины после бурения: приёмка, программа освоения, операции, наблюдение, АВР и паспорт.',
    processes: 1, v1: 'osvoenie/', v2: 'osvoenie/v2/',
  },
  {
    id: 'dobycha', name: 'Добыча', short: 'Добыча', block: 'Добыча', color: '#0f7a55',
    desc: '9 процессов: учёт и мониторинг добычи, потенциал, ИМА, подбор ГНО, энергоэффективность, трубопроводы, мехфонд.',
    processes: 9, v1: 'dobycha/', v2: 'dobycha/v2/',
  },
];

// Корень сайта относительно текущей страницы — задаётся атрибутом data-root у тега <script>
const ABAI_ROOT = (document.currentScript && document.currentScript.dataset.root) || './';

// Выпадающий переключатель модулей для шапки приложения
function abaiModuleSwitch(currentId, kind = 'v1') {
  const cur = ABAI_MODULES.find((m) => m.id === currentId);
  return `<div class="abai-mod">
    <button class="abai-mod-btn" type="button" aria-haspopup="true">
      <span class="abai-mod-dot" style="background:${cur ? cur.color : '#1c5cab'}"></span>${cur ? cur.short : 'Модули'}<span class="abai-mod-caret">▾</span>
    </button>
    <div class="abai-mod-menu" role="menu">
      <a class="abai-mod-home" href="${ABAI_ROOT}">⌂ Все модули</a>
      ${ABAI_MODULES.map((m) => `<div class="abai-mod-item${m.id === currentId ? ' on' : ''}">
        <span class="abai-mod-dot" style="background:${m.color}"></span><b>${m.name}</b>
        <a href="${ABAI_ROOT}${m.v1}" class="${m.id === currentId && kind === 'v1' ? 'on' : ''}">Прототип</a>
        <a href="${ABAI_ROOT}${m.v2}" class="${m.id === currentId && kind === 'v2' ? 'on' : ''}">Презентация</a>
      </div>`).join('')}
    </div>
  </div>`;
}

// Стили переключателя — одинаковые во всех приложениях
(function injectStyles() {
  if (document.getElementById('abai-mod-css')) return;
  const css = `
  .abai-mod { position: relative; display: inline-block; font-family: "Segoe UI", Roboto, Arial, sans-serif; }
  .abai-mod-btn { display: inline-flex; align-items: center; gap: 7px; border: 1px solid #d5dbe5; background: #fff; border-radius: 8px; padding: 5px 10px; font-size: 13px; color: #16191f; cursor: pointer; white-space: nowrap; }
  .abai-mod-btn:hover { border-color: #1c5cab; }
  .abai-mod-caret { color: #7a8291; font-size: 11px; }
  .abai-mod-dot { width: 9px; height: 9px; border-radius: 50%; display: inline-block; flex: none; }
  .abai-mod-menu { display: none; position: absolute; left: 0; top: calc(100% + 6px); min-width: 330px; background: #fff; border: 1px solid #dfe3ea; border-radius: 10px; box-shadow: 0 12px 32px rgba(16,24,40,.18); padding: 6px; z-index: 100; }
  .abai-mod.open .abai-mod-menu { display: block; }
  .abai-mod-home { display: block; padding: 8px 10px; font-size: 13px; color: #1c5cab; text-decoration: none; border-bottom: 1px solid #eef1f5; margin-bottom: 4px; }
  .abai-mod-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 7px; font-size: 13px; }
  .abai-mod-item.on { background: #f3f7fd; }
  .abai-mod-item b { flex: 1; font-weight: 600; color: #16191f; }
  .abai-mod-item a { font-size: 12px; color: #4d5563; text-decoration: none; border: 1px solid #dfe3ea; border-radius: 6px; padding: 2px 8px; }
  .abai-mod-item a:hover { border-color: #1c5cab; color: #1c5cab; }
  .abai-mod-item a.on { background: #1c5cab; border-color: #1c5cab; color: #fff; }`;
  const st = document.createElement('style');
  st.id = 'abai-mod-css';
  st.textContent = css;
  document.head.appendChild(st);
  // Открытие по клику, закрытие по клику вне меню
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.abai-mod-btn');
    document.querySelectorAll('.abai-mod.open').forEach((m) => { if (!btn || m !== btn.parentElement) m.classList.remove('open'); });
    if (btn) btn.parentElement.classList.toggle('open');
  });
})();
