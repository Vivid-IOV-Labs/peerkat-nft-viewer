import { devlog } from "./devlog";
const xapp = new xAppSdk();

function command(message: any) {
  if (typeof window.ReactNativeWebView !== "undefined") {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
  // else {
  //   window && window.open(message, "_blank").focus();
  // }
}

export function openBrowser(url: string): void {
  // command({
  //   command: "openBrowser",
  //   url,
  // });

  xapp
    .openBrowser({ url })
    .then((d) => {
      // d (returned value) can be Error or return data:
      console.log("openBrowser response:", d instanceof Error ? d.message : d);
    })
    .catch((e) => console.log("Error:", e.message));
}

export function openSignRequest(uuid: string): void {
  xapp
    .openSignRequest({ uuid })
    .then((d) => {
      // d (returned value) can be Error or return data:
      console.log(
        "openSignRequest response:",
        d instanceof Error ? d.message : d
      );
    })
    .catch((e) => console.log("Error:", e.message));
  // command({
  //   command: "openSignRequest",
  //   uuid,
  // });
  // devlog("Opensinge request uuid", uuid);
}
