let cachedData = null;

const SITE_BASE_URL = new URL('../', import.meta.url);
const DATA_URL = new URL('data/data.json', SITE_BASE_URL);

function resolveSitePath(path = '') {
  if (!path) {
    return '';
  }

  if (/^(https?:|mailto:|tel:|#)/i.test(path)) {
    return path;
  }

  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return new URL(normalized, SITE_BASE_URL).toString();
}

function normalizeDataPaths(data) {
  return {
    ...data,
    profile: {
      ...data.profile,
      photo: resolveSitePath(data.profile?.photo)
    },
    projects: (data.projects || []).map((project) => ({
      ...project,
      image: resolveSitePath(project.image)
    }))
  };
}

function validateDataShape(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Datafilen är tom eller ogiltig.');
  }

  if (!data.profile?.name) {
    throw new Error('Datafilen saknar profile.name.');
  }

  if (!Array.isArray(data.services)) {
    throw new Error('Datafilen saknar services-array.');
  }

  if (!Array.isArray(data.projects)) {
    throw new Error('Datafilen saknar projects-array.');
  }

  return data;
}

export async function getSiteData({ force = false } = {}) {
  if (cachedData && !force) {
    return cachedData;
  }

  const response = await fetch(DATA_URL, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} vid laddning av data.`);
  }

  const json = await response.json();
  cachedData = normalizeDataPaths(validateDataShape(json));
  return cachedData;
}

export function clearDataCache() {
  cachedData = null;
}
