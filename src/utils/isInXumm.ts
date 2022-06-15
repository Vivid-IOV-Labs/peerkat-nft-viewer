export function isInXumm(): boolean {
  const urlParams = new URLSearchParams(document.location.href);
  const jwtToke = urlParams.get("xAppToken");
  const xAppTokenInUrl = urlParams.has("xAppToken");
  console.log("document.location.href", document.location.href);
  console.log("urlParams", urlParams);
  console.log("xAppToken", jwtToke);
  console.log("xAppTokenInUrl", xAppTokenInUrl);
  return /xumm/.test(navigator.userAgent) || xAppTokenInUrl;
}
