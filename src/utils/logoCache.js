const LOGO_STAGE_GOOGLE = 0;
const LOGO_STAGE_CLEARBIT = 1;
const LOGO_STAGE_FALLBACK = 2;

// Persists across re-renders and re-mounts so logos don't flicker
const logoStageCache = new Map();

function getCachedStage(domain) {
  return domain ? logoStageCache.get(domain) ?? LOGO_STAGE_GOOGLE : LOGO_STAGE_GOOGLE;
}

function setCachedStage(domain, stage) {
  if (domain) logoStageCache.set(domain, stage);
}

function getLogoSrc(domain, stage) {
  if (stage === LOGO_STAGE_GOOGLE && domain) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }
  if (stage === LOGO_STAGE_CLEARBIT && domain) {
    return `https://logo.clearbit.com/${domain}`;
  }
  return null;
}

export {
  LOGO_STAGE_GOOGLE,
  LOGO_STAGE_CLEARBIT,
  LOGO_STAGE_FALLBACK,
  logoStageCache,
  getCachedStage,
  setCachedStage,
  getLogoSrc,
};
