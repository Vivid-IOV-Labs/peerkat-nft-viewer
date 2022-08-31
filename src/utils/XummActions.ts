function command(message: any) {
  if (typeof window.ReactNativeWebView !== "undefined") {
    console.log(" ReactNativeWebView", message);

    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  } else {
    window.parent.postMessage(JSON.stringify(message), "*");
    console.log("NO ReactNativeWebView");
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
}
