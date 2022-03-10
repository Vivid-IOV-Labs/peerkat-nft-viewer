export interface NFT {
  issuer: string;
  balanceFormatted?: string;
  limitFormatted?: string;
  desc?: string;
  author?: string;
  currency: string;
  tokenName: string;
  url?: string;
  media_type?: string | null;
}
