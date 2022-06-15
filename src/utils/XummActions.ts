import { devlog } from "./devlog";

function command(message: any) {
  if (typeof window.ReactNativeWebView !== "undefined") {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
}

export function openBrowser(url: string): void {
  command({
    command: "openBrowser",
    url,
  });
}

export function openSignRequest(uuid: string): void {
  command({
    command: "openSignRequest",
    uuid,
  });
  window.ReactNativeWebView.onMessage(console.log);
  devlog("Opensinge request uuid");
}
