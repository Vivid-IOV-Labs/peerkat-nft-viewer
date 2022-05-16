export function isInXumm(): boolean {
  const xAppTokenInUrl = !new URLSearchParams(document.location.href).get(
    "xAppToken"
  );
  return /xumm/.test(navigator.userAgent) || xAppTokenInUrl;
}
