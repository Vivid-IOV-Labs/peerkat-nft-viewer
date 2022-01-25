export interface NFT {
  issuer: string;
  balanceFormatted: string;
  limitFormatted: string;
  currency: string;
  tokenName: string;
  url: string;
  media_type: string | null;
}
