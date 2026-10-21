import { clearElement, escapeHtml } from '../dom.js';

export function renderServices(root, services = []) {
  if (!root) {
    return;
  }

  clearElement(root);

  if (!services.length) {
    root.innerHTML = `
      <article class="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 text-slate-300">
        Inga tjänster definierade i data.json ännu.
      </article>
    `;
    return;
  }

  root.innerHTML = `
    <div class="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
      ${services.map((service) => `
        <article class="panel rounded-2xl p-5 sm:p-6 h-full">
          <p class="mono text-xs uppercase tracking-[0.2em] text-slate-400">${escapeHtml(service.id || 'service')}</p>
          <h3 class="mt-2 text-lg font-semibold text-white">${escapeHtml(service.title || '')}</h3>
          <p class="mt-3 text-slate-300 text-sm leading-relaxed">${escapeHtml(service.description || '')}</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-300">
            ${(service.highlights || []).map((item) => `<li class="flex items-start gap-2"><span class="text-teal-300">></span><span>${escapeHtml(item)}</span></li>`).join('')}
          </ul>
        </article>
      `).join('')}
    </div>
  `;
}
