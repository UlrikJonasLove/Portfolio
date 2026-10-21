import { clearElement, escapeHtml } from '../dom.js';

function projectLinksMarkup(links = {}) {
  const items = [
    { href: links.github, label: 'GitHub' },
    { href: links.demo, label: 'Demo' }
  ].filter((item) => item.href);

  if (!items.length) {
    return '<p class="text-xs text-slate-500">Inga publika länkar ännu.</p>';
  }

  return `<div class="flex flex-wrap gap-2">${items.map((item) => `
    <a href="${escapeHtml(item.href)}" class="inline-flex items-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:border-teal-300/40 hover:text-teal-200 transition">${escapeHtml(item.label)}</a>
  `).join('')}</div>`;
}

function projectCardMarkup(project) {
  const tags = (project.tags || []).map((tag) => (
    `<li class="rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300">${escapeHtml(tag)}</li>`
  )).join('');

  return `
    <article class="panel rounded-2xl overflow-hidden h-full flex flex-col">
      <img src="${escapeHtml(project.image || '')}" alt="Projektbild för ${escapeHtml(project.title || 'Projekt')}" class="w-full h-48 object-cover border-b border-slate-800" loading="lazy" decoding="async" />
      <div class="p-5 sm:p-6 flex flex-col gap-4 h-full">
        <div>
          <h3 class="text-lg sm:text-xl font-semibold text-white">${escapeHtml(project.title || '')}</h3>
          <p class="text-sm text-teal-300 mt-1">${escapeHtml(project.subtitle || '')}</p>
          <p class="text-sm text-slate-300 mt-3 leading-relaxed">${escapeHtml(project.description || '')}</p>
        </div>
        <ul class="flex flex-wrap gap-2" aria-label="Projekt-taggar">${tags}</ul>
        <div class="mt-auto">${projectLinksMarkup(project.links)}</div>
      </div>
    </article>
  `;
}

function collectTags(projects) {
  const tagSet = new Set();
  projects.forEach((project) => {
    (project.tags || []).forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'sv'));
}

export function renderFeaturedProjects(root, projects = [], limit = 2) {
  if (!root) {
    return;
  }

  clearElement(root);

  const featured = projects.filter((project) => project.featured).slice(0, limit);

  if (!featured.length) {
    root.innerHTML = `
      <article class="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 text-slate-300">
        Inga utvalda projekt markerade i data.json.
      </article>
    `;
    return;
  }

  root.innerHTML = `
    <div class="grid gap-5 md:grid-cols-2">
      ${featured.map(projectCardMarkup).join('')}
    </div>
  `;
}

export function renderProjectsPage({ controlsRoot, gridRoot, projects = [] }) {
  if (!controlsRoot || !gridRoot) {
    return;
  }

  const tags = collectTags(projects);
  const state = {
    activeTag: 'Alla',
    searchTerm: ''
  };

  function filterProjects() {
    const query = state.searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const tagMatch = state.activeTag === 'Alla' || (project.tags || []).includes(state.activeTag);

      if (!query) {
        return tagMatch;
      }

      const haystack = [
        project.title,
        project.subtitle,
        project.description,
        ...(project.tags || [])
      ].join(' ').toLowerCase();

      return tagMatch && haystack.includes(query);
    });
  }

  function renderGrid() {
    const visibleProjects = filterProjects();

    if (!visibleProjects.length) {
      gridRoot.innerHTML = `
        <article class="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 text-slate-300">
          Inga projekt matchar aktuell filtrering.
        </article>
      `;
      return;
    }

    gridRoot.innerHTML = `
      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        ${visibleProjects.map(projectCardMarkup).join('')}
      </div>
    `;
  }

  function renderControls() {
    controlsRoot.innerHTML = `
      <div class="panel rounded-2xl p-5 sm:p-6 space-y-4">
        <label for="project-search" class="block text-sm font-medium text-slate-200">Sök projekt</label>
        <input
          id="project-search"
          type="search"
          placeholder="Sök på titel, beskrivning eller tagg"
          class="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
          aria-label="Sök projekt"
        />
        <div>
          <p class="text-sm font-medium text-slate-200">Filtrera på taggar</p>
          <div class="mt-2 flex flex-wrap gap-2" role="group" aria-label="Taggfilter" id="project-tag-group">
            <button type="button" data-tag="Alla" class="tag-chip rounded-full border px-3 py-1.5 text-xs transition">Alla</button>
            ${tags.map((tag) => `<button type="button" data-tag="${escapeHtml(tag)}" class="tag-chip rounded-full border px-3 py-1.5 text-xs transition">${escapeHtml(tag)}</button>`).join('')}
          </div>
        </div>
      </div>
    `;

    const searchInput = controlsRoot.querySelector('#project-search');
    const tagButtons = Array.from(controlsRoot.querySelectorAll('.tag-chip'));

    function paintActiveTag() {
      tagButtons.forEach((button) => {
        const isActive = button.dataset.tag === state.activeTag;
        button.className = isActive
          ? 'tag-chip rounded-full border px-3 py-1.5 text-xs transition border-teal-300/60 bg-teal-400/20 text-teal-100'
          : 'tag-chip rounded-full border px-3 py-1.5 text-xs transition border-slate-700 bg-slate-900 text-slate-300 hover:border-teal-300/40 hover:text-teal-200';
      });
    }

    searchInput.addEventListener('input', (event) => {
      state.searchTerm = event.target.value;
      renderGrid();
    });

    tagButtons.forEach((button) => {
      button.addEventListener('click', () => {
        state.activeTag = button.dataset.tag || 'Alla';
        paintActiveTag();
        renderGrid();
      });
    });

    paintActiveTag();
  }

  renderControls();
  renderGrid();
}
