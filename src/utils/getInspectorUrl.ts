// const main_networks = [
//   "wss://s2.ripple.com",
//   "wss://xrpl.link",
//   "wss://xrpcluster.com",
// ];
// const test_networks = [
//   "wss://s.altnet.rippletest.net:51233",
//   "wss://xrpl.linkwss://testnet.xrpl-labs.com",
// ];
// const custom_networks = ["wss://xls20-sandbox.rippletest.net:51233"];
// const dev_networks = ["wss://s.devnet.rippletest.net:51233"];
// const bithomUrls = [
//   "https://test.bithomp.com/",
//   "https://xls20.bithomp.com/",
//   "https://hooks.bithomp.com/",
//   "https://beta.bithomp.com/",
// ];
interface urlMap {
  [id: string]: string[];
}
export function getInspectorUrl(network: keyof urlMap, issuer: string): string {
  console.log("getInspectorUrl network", network);
  const urlMap: urlMap = {
    /*test */
    "wss://s.altnet.rippletest.net:51233": ["https://test.bithomp.com/"],
    "wss://testnet.xrpl-labs.com": ["https://test.bithomp.com/"],
    /*main */
    "wss://s2.ripple.com": ["https://bithomp.com/"],
    "wss://xrpl.link": ["https://bithomp.com/"],
    "wss://xrplcluster.com": ["https://bithomp.com/"],
    /*custom */
    "wss://xls20-sandbox.rippletest.net:51233": ["https://xls20.bithomp.com/"],
    "wss://hooks-testnet-v2.xrpl-labs.com": ["https://hooks.bithomp.com/"],
  };
  console.log("getInspectorUrl", urlMap[network]);
  console.log(
    "getInspectorUrl",
    urlMap[network] && urlMap[network][0] + issuer
  );

  return urlMap[network] ? urlMap[network][0] + issuer : "";
}
