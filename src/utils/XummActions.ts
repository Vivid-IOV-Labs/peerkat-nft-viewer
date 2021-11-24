function command(command: string, ...args: any) {
  if (
    window.ReactNativeWebView &&
    typeof window.ReactNativeWebView !== "undefined"
  ) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        command,
        ...args,
      })
    );
  }
}

export function openBrowser(url: string): void {
  command("openBrowser", { url });
}
