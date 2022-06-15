export function isInXumm(): boolean {
  const urlParams = new URLSearchParams(document.location.href);
  const xAppTokenInUrl = urlParams.has("xAppToken");
  console.log(xAppTokenInUrl, urlParams);
  return /xumm/.test(navigator.userAgent) || xAppTokenInUrl;
}
