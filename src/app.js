import { getSiteData } from './data.js';
import { qs, qsa, renderErrorCard } from './dom.js';
import { renderHero } from './render/hero.js';
import { renderServices } from './render/services.js';
import { renderFeaturedProjects, renderProjectsPage } from './render/projects.js';
import { renderFooter } from './render/footer.js';

function updateMeta(profile, page) {
  const titleByPage = {
    home: `${profile.name} | Systemutvecklare`,
    projects: `Projekt | ${profile.name}`
  };

  document.title = titleByPage[page] || `${profile.name} | Portfolio`;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', profile.bio);
  }
}

function updateSharedName(name) {
  qsa('[data-owner-name]').forEach((element) => {
    element.textContent = name;
  });
}

function renderHomePage(data) {
  renderHero(qs('#hero-root'), data);
  renderServices(qs('#services-root'), data.services);
  renderFeaturedProjects(qs('#featured-projects-root'), data.projects, 2);
}

function renderProjectsIndexPage(data) {
  renderProjectsPage({
    controlsRoot: qs('#projects-controls-root'),
    gridRoot: qs('#projects-grid-root'),
    projects: data.projects
  });
}

function renderFailure(message) {
  const errorRoot = qs('#page-error-root') || qs('#hero-root') || qs('#projects-grid-root');
  renderErrorCard(
    errorRoot,
    'Kunde inte ladda portfolio-data',
    `${message} Kontrollera att du kör en statisk server och att data/data.json finns.`
  );
}

async function bootstrap() {
  const page = document.body?.dataset?.page || 'home';

  try {
    const data = await getSiteData();
    updateSharedName(data.profile.name);
    updateMeta(data.profile, page);

    if (page === 'projects') {
      renderProjectsIndexPage(data);
    } else {
      renderHomePage(data);
    }

    renderFooter(qs('#footer-root'), data);
  } catch (error) {
    renderFailure(error.message);
    renderFooter(qs('#footer-root'), {
      profile: { name: 'Ulrik Rosberg' },
      links: { github: '', linkedin: '', email: '' }
    });
  }
}

bootstrap();
