export function isInXumm(): boolean {
  const urlParams = new URLSearchParams(document.location.href);
  const jwtToke = urlParams.get("xAppToken");
  const xAppTokenInUrl = urlParams.has("xAppToken");
  console.log("urlParams", urlParams);
  console.log("xAppTokenInUrl", xAppTokenInUrl);
  console.log("jwtToke", jwtToke);

  return /xumm/.test(navigator.userAgent) || xAppTokenInUrl;
}
