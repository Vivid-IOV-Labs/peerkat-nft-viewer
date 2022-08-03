import { devlog } from "./devlog";

function command(message: any) {
  console.log("command", message);
  console.log("command", window.ReactNativeWebView);

  if (typeof window.ReactNativeWebView !== "undefined") {
    console.log("command postMessage");

    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
}

export function openBrowser(url: string): void {
  console.log("openBrowser", url);
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
