import { devlog } from "./devlog";

function command(message: any) {
  if (typeof window.ReactNativeWebView !== "undefined") {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
  // else {
  //   window && window.open(message, "_blank").focus();
  // }
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
  devlog("Opensinge request uuid", uuid);
}
