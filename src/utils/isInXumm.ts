export function isInXumm(): boolean {
  const urlParams = new URLSearchParams(document.location.href);
  const xAppTokenInUrl = urlParams.has("xAppToken");
  return (
    /xumm/.test(navigator.userAgent) ||
    xAppTokenInUrl ||
    document.location.href.includes("https://xappdev.peerkat.io")
  );
}
