import { test, expect, describe, vi } from "vitest";
import {
  constructXls20NFT,
  createUrlFromDomain,
  createUrlFromURI,
  getOneXls20,
  getXLS20MediaUrl,
  hexToDec,
  hexToString,
} from "../../services/XrpService";

const rawNFTNoURI = {
  Flags: 8,
  Issuer: "rG5qYqxdmDmLkVnPrLcWKE6LYTMeFGhYy9",
  NFTokenID: "00080000AC7377C74DD53E77C8161537F5EBF56B0CE8FD3B57EC9EFA00001144",
  NFTokenTaxon: 37,
  nft_serial: 4420,
};

const rawNFT = {
  Flags: 8,
  Issuer: "rfsuQDie8MqtkkTUdHmyR2oJa4Dp7bt1iF",
  NFTokenID: "00083A98425D5408873C7C141C270879D254C84AC1CC10F0A15E6442000003A7",
  NFTokenTaxon: 0,
  TransferFee: 15000,
  URI: "697066733A2F2F6261666B726569686672723637676B66657868736A7A77326877703532766A64726371356676796F7A78646F647564727765337066326478333465",
  nft_serial: 935,
};
const NFTMetadata = {
  attributes: [
    {
      trait_type: "Background",
      value: "Background Xrp",
    },
    {
      trait_type: "Base",
      value: "Base Beard",
    },
    {
      trait_type: "Eye",
      value: "Eyes Suspicious Bloodshot",
    },
    {
      trait_type: "Hat",
      value: "Hat Unicorn",
    },
    {
      trait_type: "Shirt",
      value: "Shirt White Rags",
    },
    {
      trait_type: "Mouth",
      value: "Mouth Sad",
    },
  ],
  category: "Art",
  collection: { name: "xPEPE" },
  description:
    "xPEPE vol 1 - An XRPL community collection of 5,000 generative xPEPEs - Minted on xrpnft.com - Art by Link",
  external_link: "xrpepe.com",
  external_url: "",
  fee_recipient: "r3gpBgxueWCDkH9985UzrB1Pt9DhLC8ATz",
  hash: "7cd83be19b9a77c5e850062e4a5553ea",
  image: "QmUoqwgAq5mFuj4hYn1mnnRyHdW8AqQJ9vSUkKb56q2fx9/1497.png",
  name: "xPEPE #1497",
  seller_fee_basis_points: 589,
};
// const nft = {
//   Flags: 8,
//   Issuer: "rfUkZ3BVmgx5aD3Zo5bZk68hrUrhNth8y3",
//   NFTokenID:
//     "000817024409AFED2C9EC5604D4095464C0F0DC015198D2FCEFD6772000005D8",
//   NFTokenTaxon: 1,
//   TransferFee: 5890,
//   URI: "516D556A71565134524B35597A647937765159435664635351503252314B5771567A5A4B386F364A6B4479517639",
//   nft_serial: 1496,
// };

global.fetch = vi.fn();

function createFetchResponse(data: any): any {
  return { json: () => new Promise((resolve) => resolve(data)) };
}

describe("XrpService tests", () => {
  test("hexToString", () => {
    const string = "6369616f";
    const convertedString = hexToString(string);
    expect(convertedString).toEqual("ciao");
  });

  test("hexToString", () => {
    const string = "213";
    const convertedString = hexToDec(string);
    expect(convertedString).toEqual("531");
  });

  test("getXLS20MediaUrl", () => {
    const NFTokenID =
      "000817024409AFED2C9EC5604D4095464C0F0DC015198D2FCEFD6772000005D8";
    const name = getXLS20MediaUrl(NFTokenID);
    expect(name).toEqual(
      "000817024409AFED2C9EC5604D4095464C0F0DC015198D2FCEFD6772000005D8"
    );
  });

  test("constructXls20NFT", async () => {
    const user = {
      id: "12345",
      displayName: "fakeTechExec",
      firstName: "fake",
      middleName: "Tech",
      lastName: "Exec",
      profilePicture: "faketechexec.jpg",
    };

    const getMetadataFromStore = vi.fn();
    getMetadataFromStore.mockResolvedValue(user);

    const name = await constructXls20NFT(NFTMetadata, rawNFT);
    console.log(name);
  });

  test("createUrlFromDomain", () => {
    const domain = "ipfs://QmT7WeBWD1JSYauacZgkA3RLi5o3dezvvkE167dMCUamjz/";
    const NFTokenID =
      "0008138889FDD429502FFD67568F65D6CBCFAD6B349C68F5000009B000000000";
    const url = createUrlFromDomain(domain, NFTokenID);
    expect(url).toEqual(
      "QmT7WeBWD1JSYauacZgkA3RLi5o3dezvvkE167dMCUamjz/0008138889FDD429502FFD67568F65D6CBCFAD6B349C68F5000009B000000000.json"
    );
  });

  test("createUrlFromURI cid:bafybeignu67z7yimitdl74tis4v6b47bbcuzzsp7d64v4psny4uqdcsvy4", () => {
    const URI =
      "cid:bafybeignu67z7yimitdl74tis4v6b47bbcuzzsp7d64v4psny4uqdcsvy4";
    const url = createUrlFromURI(URI);
    expect(url).toEqual(
      "bafybeignu67z7yimitdl74tis4v6b47bbcuzzsp7d64v4psny4uqdcsvy4"
    );
  });

  test("createUrlFromURI https://bafybeignu67z7yimitdl74tis4v6b47bbcuzzsp7d64v4psny4uqdcsvy4.ipfs.w3s.link/metadata.json", () => {
    const URI =
      "cid:bafybeignu67z7yimitdl74tis4v6b47bbcuzzsp7d64v4psny4uqdcsvy4";
    const url = createUrlFromURI(URI);
    expect(url).toEqual(
      "bafybeignu67z7yimitdl74tis4v6b47bbcuzzsp7d64v4psny4uqdcsvy4"
    );
  });

  test("createUrlFromURI bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi", () => {
    const URI = "bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi";
    const url = createUrlFromURI(URI);
    expect(url).toEqual(
      "bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi"
    );
  });

  test("ipfs://bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi/metadata.json", () => {
    const URI = "bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi";
    const url = createUrlFromURI(URI);
    expect(url).toEqual(
      "bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi"
    );
  });

  test("https://ipfs.io/ipfs/bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi/metadata.json", () => {
    const URI = "bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi";
    const url = createUrlFromURI(URI);
    expect(url).toEqual(
      "bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi"
    );
  });

  test("https://somedomain/bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi", () => {
    const URI = "bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi";
    const url = createUrlFromURI(URI);
    expect(url).toEqual(
      "bafybeibxjchfxkfcki4dtmums24fgxyjot52sklnzpphm4fl2vd5dypdxi"
    );
  });
});
