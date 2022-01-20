/* eslint-disable no-undef */
const mixpanel_id = import.meta.env.VITE_LOCIZE_API_KEY;
const google_analytics_id = import.meta.env.VITE_LOCIZE_PROJECT_ID;
import mixpanel from "mixpanel-browser";
let ga: any;
interface trackEventParams {
  category: string;
  action: string;
  label: string;
}
export function trackInit(): void {
  mixpanel.init(mixpanel_id, {
    api_host: "https://api-eu.mixpanel.com",
    batch_requests: true,
  });
  ga("create", google_analytics_id, "auto");
  ga("send", "pageview");
}

export const trackUser = (walletAddress: string): void => {
  mixpanel.identify(walletAddress);
  ga("send", "&uid", walletAddress);
  trackEvent({
    category: "Loading View",
    action: "login-user",
    label: walletAddress,
  });
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
