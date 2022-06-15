export function isInXumm(): boolean {
  const urlParams = new URLSearchParams(document.location.href);
  console.log("xAppTokenInUrl", xAppTokenInUrl);
  const jwtToke = urlParams.get("xAppToken");
  console.log("jwtToke", jwtToke);
  const xAppTokenInUrl = urlParams.has("xAppToken");

  return /xumm/.test(navigator.userAgent) || xAppTokenInUrl;
}
