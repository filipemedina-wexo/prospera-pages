export const trackMetaEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, parameters);
  }
};

export const getCampaignParams = () => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
    .reduce((campaign, key) => {
      const value = params.get(key);
      if (value) campaign[key] = value;
      return campaign;
    }, {});
};
