export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function clearElement(element) {
  if (element) {
    element.textContent = '';
  }
}

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderErrorCard(root, title, message) {
  if (!root) {
    return;
  }

  root.innerHTML = `
    <article role="alert" class="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-6">
      <p class="text-xs uppercase tracking-[0.2em] text-rose-300">Fel</p>
      <h2 class="mt-2 text-xl font-semibold text-rose-100">${escapeHtml(title)}</h2>
      <p class="mt-3 text-rose-200/90">${escapeHtml(message)}</p>
    </article>
  `;
}
