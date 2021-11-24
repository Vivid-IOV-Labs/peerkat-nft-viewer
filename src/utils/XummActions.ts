function command(message: any) {
  if (
    window.ReactNativeWebView &&
    typeof window.ReactNativeWebView !== "undefined"
  ) {
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }
}

export function openBrowser(url: string): void {
  window.ReactNativeWebView.postMessage(
    JSON.stringify({
      command: "openBrowser",
      url,
    })
  );
  // command("openBrowser", { url });
}
