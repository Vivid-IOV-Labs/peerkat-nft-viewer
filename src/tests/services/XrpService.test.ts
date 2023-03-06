import { test, expect } from "vitest";
import { createUrlFromDomain } from "../../services/XrpService";

const rawNFTNoURI = {
  Flags: 8,
  Issuer: "rG5qYqxdmDmLkVnPrLcWKE6LYTMeFGhYy9",
  NFTokenID: "00080000AC7377C74DD53E77C8161537F5EBF56B0CE8FD3B57EC9EFA00001144",
  NFTokenTaxon: 37,
  nft_serial: 4420,
};

const rawNFT = {
  Flags: 10,
  Issuer: "rMsZProT3MjyCHP6FD9tk4A2WrwDMc6cbE",
  NFTokenID: "000A1702DBDE606E6D2819D1E99AB9B086ABF7B01ABFFCF560A1FEBB00002263",
  NFTokenTaxon: 69,
  TransferFee: 5890,
  URI: "697066733A2F2F516D5371766A3151753836787232636139386757345661676D4C6A4B656F48444E71367833397536795459713641",
  nft_serial: 8803,
};
test("createUrlFromDomain", () => {
  const domain = "ipfs://QmT7WeBWD1JSYauacZgkA3RLi5o3dezvvkE167dMCUamjz/";
  const NFTokenID =
    "0008138889FDD429502FFD67568F65D6CBCFAD6B349C68F5000009B000000000";
  const url = createUrlFromDomain(domain, NFTokenID);
  expect(url).toEqual(
    "QmT7WeBWD1JSYauacZgkA3RLi5o3dezvvkE167dMCUamjz/0008138889FDD429502FFD67568F65D6CBCFAD6B349C68F5000009B000000000.json"
  );
});
