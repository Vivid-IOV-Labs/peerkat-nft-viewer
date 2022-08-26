import { isInXumm } from "../utils/isInXumm";
let xapp: any;
if (isInXumm()) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  import("xumm-xapp-sdk").then((something) => {
    console.log("isInXumm", isInXumm);
    console.log("xAppSdk", something);
    const { xApp } = something;
    xapp = new xApp();
  });
}

export function openBrowser(url: string): void {
  // command({
  //   command: "openBrowser",
  //   url,
  // });

  xapp
    .openBrowser({ url })
    .then((d: any) => {
      // d (returned value) can be Error or return data:
      console.log("openBrowser response:", d instanceof Error ? d.message : d);
    })
    .catch((e: any) => console.log("Error:", e.message));
}

export function openSignRequest(uuid: string): void {
  xapp
    .openSignRequest({ uuid })
    .then((d: any) => {
      // d (returned value) can be Error or return data:
      console.log(
        "openSignRequest response:",
        d instanceof Error ? d.message : d
      );
    })
    .catch((e: any) => console.log("Error:", e.message));
  // command({
  //   command: "openSignRequest",
  //   uuid,
  // });
  // devlog("Opensinge request uuid", uuid);
}

// function command(message: any) {
//   // if (typeof window.ReactNativeWebView !== "undefined") {
//   //   console.log(" ReactNativeWebView", message);

//   window.ReactNativeWebView.postMessage(JSON.stringify(message));
//   //   } else {
//   //     console.log("NO ReactNativeWebView");
//   //   }
// }

// export function openBrowser(url: string): void {
//   console.log("openBrowser", url);

//   command({
//     command: "openBrowser",
//     url,
//   });
// }

// export function openSignRequest(uuid: string): void {
//   command({
//     command: "openSignRequest",
//     uuid,
//   });
// }
