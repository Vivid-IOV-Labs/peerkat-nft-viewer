// import { isInXumm } from "../utils/isInXumm";
// let xapp: any;
// if (isInXumm()) {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const xAppSdk = require("xumm-xapp-sdk");
//   console.log("isInXumm", isInXumm);
//   console.log("xAppSdk", xAppSdk);
//   xapp = new xAppSdk();
// }

// export function openBrowser(url: string): void {
//   // command({
//   //   command: "openBrowser",
//   //   url,
//   // });

//   xapp
//     .openBrowser({ url })
//     .then((d: any) => {
//       // d (returned value) can be Error or return data:
//       console.log("openBrowser response:", d instanceof Error ? d.message : d);
//     })
//     .catch((e: any) => console.log("Error:", e.message));
// }

// export function openSignRequest(uuid: string): void {
//   xapp
//     .openSignRequest({ uuid })
//     .then((d: any) => {
//       // d (returned value) can be Error or return data:
//       console.log(
//         "openSignRequest response:",
//         d instanceof Error ? d.message : d
//       );
//     })
//     .catch((e: any) => console.log("Error:", e.message));
//   // command({
//   //   command: "openSignRequest",
//   //   uuid,
//   // });
//   // devlog("Opensinge request uuid", uuid);
// }
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
}
