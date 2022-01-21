/* eslint-disable no-undef */
const mixpanel_id = import.meta.env.VITE_MIXPANEL_ID;
const google_analytics_id = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
import mixpanel from "mixpanel-browser";
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
}

export const trackUser = (walletAddress: string): void => {
  mixpanel.identify(walletAddress);
  ga("send", "&uid", walletAddress);
};

export const trackPage = (path: string): void => {
  mixpanel.track(`Page view: ${path}`);
  ga("send", "pageview", path);
};

export const trackEvent = ({
  category,
  action,
  label,
}: trackEventParams): void => {
  try {
    mixpanel.track(`${category}`, { action, label });
    ga("send", "event", category, action, label);
  } catch (error) {
    console.log(error);
  }
};
