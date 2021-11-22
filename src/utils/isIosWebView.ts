// const isIosWebView = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
//   navigator.userAgent
// );
export function isIosWebView(): boolean {
  return !!navigator.userAgent
    .toLowerCase()
    .match(/\(ip.*applewebkit(?!.*(version|crios))/);
}
export function isAndroidWebView(): boolean {
  return !!navigator.userAgent
    .toLowerCase()
    .match(/android.*applewebkit(?=.*version)/);
}
export function isWebView(): boolean {
  return isIosWebView() || isAndroidWebView();
}
