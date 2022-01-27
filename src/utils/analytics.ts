/* eslint-disable no-undef */
const mixpanel_id = import.meta.env.VITE_MIXPANEL_ID;
const google_analytics_id = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
const google_tag_manager_id = import.meta.env.VITE_GOOGLE_TAG_MANAGER;

import mixpanel from "mixpanel-browser";

const dataLayer = (window as any).dataLayer || [];
function gtag(...args: (string | boolean | Date | undefined)[]) {
  dataLayer.push(args);
}
console.log(dataLayer);

const ga = (window as any).ga;
interface trackEventParams {
  category: string;
  action: string;
  label: string;
}
export function trackInit(): void {
  mixpanel.init(mixpanel_id, {
    api_host: "https://api-eu.mixpanel.com",
    batch_requests: true,
    ignore_dnt: true,
  });
  ga("create", google_analytics_id, "auto");
  ga("send", "pageview");
  gtag("js", new Date());

  gtag("config", google_tag_manager_id);
}

export const trackUser = (walletAddress: string): void => {
  mixpanel.identify(walletAddress);
  ga("send", "&uid", walletAddress);
  dataLayer.push({
    "&uid": walletAddress,
  });
};

export const trackPage = (path: string): void => {
  mixpanel.track(`Page view: ${path}`);
  ga("send", "pageview", path);
  dataLayer.push({
    event: "pageview",
    page: {
      url: path,
    },
  });
};

export const trackEvent = ({
  category,
  action,
  label,
}: trackEventParams): void => {
  mixpanel.track(`${category}`, { action, label });
  ga("send", "event", category, action, label);
  dataLayer.push({
    event: "event",
    eventProps: {
      category: category,
      action: action,
      label: label,
    },
  });
};
