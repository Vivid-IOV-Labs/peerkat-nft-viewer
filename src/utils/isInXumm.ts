export function isInXumm(): boolean {
  const urlParams = new URLSearchParams(document.location.href);
  const jwtToke = urlParams.get("xAppToken");
  const xAppTokenInUrl = urlParams.has("xAppToken");
  console.log("document.location", document.location);
  console.log("document.location.href", document.location.href);
  console.log("urlParams", urlParams);
  console.log("xAppToken", jwtToke);
  console.log("xAppTokenInUrl", xAppTokenInUrl);
  console.log(
    "isInXUmm",
    /xumm/.test(navigator.userAgent) ||
      xAppTokenInUrl ||
      document.location.href.includes("https://xappdev.peerkat.io")
  );
  return (
    /xumm/.test(navigator.userAgent) ||
    xAppTokenInUrl ||
    document.location.href.includes("https://xappdev.peerkat.io")
  );
}
