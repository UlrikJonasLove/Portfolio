import { clearElement, escapeHtml } from '../dom.js';

function footerLink(href, label) {
  if (!href) {
    return '';
  }

  return `<a href="${escapeHtml(href)}" class="text-slate-300 hover:text-teal-200 transition">${escapeHtml(label)}</a>`;
}

export function renderFooter(root, data) {
  if (!root) {
    return;
  }

  clearElement(root);

  const profile = data.profile || {};
  const links = data.links || {};
  const currentYear = new Date().getFullYear();

  root.innerHTML = `
    <div class="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
      <p class="text-slate-400">© ${currentYear} ${escapeHtml(profile.name || 'Ulrik Rosberg')}. Alla rättigheter förbehållna.</p>
      <div class="flex items-center gap-4">
        ${footerLink(links.github, 'GitHub')}
        ${footerLink(links.linkedin, 'LinkedIn')}
        ${footerLink(links.email, 'Email')}
      </div>
    </div>
  `;
}
