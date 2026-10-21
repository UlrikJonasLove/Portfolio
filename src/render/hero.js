import { clearElement, escapeHtml } from '../dom.js';

function calculateAge(birthDateString = '1993-10-22') {
  const birthDate = new Date(`${birthDateString}T00:00:00`);
  const today = new Date();

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const hasHadBirthdayThisYear = monthDiff > 0 || (monthDiff === 0 && today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}

function renderCtaButton(href, label, variant = 'primary') {
  if (!href) {
    return '';
  }

  const isPrimary = variant === 'primary';
  const base = 'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition';
  const styles = isPrimary
    ? 'bg-teal-400/20 text-teal-200 border border-teal-300/50 hover:bg-teal-400/30'
    : 'bg-slate-900 text-slate-200 border border-slate-700 hover:border-teal-300/40 hover:text-teal-200';

  return `<a href="${escapeHtml(href)}" class="${base} ${styles}">${escapeHtml(label)}</a>`;
}

export function renderHero(root, data) {
  if (!root) {
    return;
  }

  clearElement(root);

  const profile = data.profile || {};
  const links = data.links || {};
  const age = calculateAge(profile.birthDate || '1993-10-22');
  const badges = (profile.badges || []).map((badge) => (
    `<li class="px-3 py-1 rounded-full border border-slate-700 bg-slate-900/70 text-xs text-slate-200">${escapeHtml(badge)}</li>`
  )).join('');

  root.innerHTML = `
    <article class="panel rounded-3xl p-6 sm:p-8 lg:p-10">
      <div class="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div>
          <p class="text-xs sm:text-sm mono uppercase tracking-[0.2em] text-slate-400">BOOT_SEQUENCE::ONLINE</p>
          <h1 class="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-white">${escapeHtml(profile.name || '')}</h1>
          <p class="mt-3 text-lg sm:text-2xl font-semibold text-teal-300">${escapeHtml(profile.title || '')}</p>

          <div class="mt-5 panel rounded-xl p-4 mono text-xs sm:text-sm text-slate-300">
            <p>> STATUS: Tillgänglig för nya uppdrag</p>
            <p>> PLATS: ${escapeHtml(profile.location || '')}</p>
            <p>> ALDER: ${age !== null ? `${age} år` : 'Okänd'}</p>
          </div>

          <p class="mt-6 text-slate-300 max-w-2xl leading-relaxed">${escapeHtml(profile.bio || '')}</p>

          <ul class="mt-6 flex flex-wrap gap-2" aria-label="Teknikbadges">
            ${badges}
          </ul>

          <div class="mt-7 flex flex-wrap gap-3" aria-label="Call to action">
            ${renderCtaButton(links.github, 'GitHub', 'primary')}
            ${renderCtaButton(links.linkedin, 'LinkedIn')}
            ${renderCtaButton(links.email, 'Kontakt')}
          </div>
        </div>

        <div class="flex justify-center lg:justify-end">
          <figure class="panel rounded-3xl p-4 max-w-xs w-full">
            <img src="${escapeHtml(profile.photo || '')}" alt="Profilbild på ${escapeHtml(profile.name || 'Ulrik Rosberg')}" class="w-full aspect-square object-cover rounded-2xl border border-slate-700" loading="eager" decoding="async" />
            <figcaption class="mt-3 text-xs mono text-slate-400">profile.photo => ${escapeHtml(profile.photo || '')}</figcaption>
          </figure>
        </div>
      </div>
    </article>
  `;
}

export { calculateAge };
