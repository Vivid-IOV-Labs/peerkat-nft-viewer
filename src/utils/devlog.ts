const xummSandbox = import.meta.env.VITE_XUMM_SANDBOX;

export function devlog(...args: unknown[]): void {
  if (process.env.NODE_ENV !== "production" || xummSandbox != "main") {
    // eslint-disable-next-line no-console
    // console.log(...args);
  } else {
    return;
  }
}
