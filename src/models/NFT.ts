export interface NFT {
  issuer: string;
  balanceFormatted?: string;
  limitFormatted?: string;
  desc?: string;
  standard?: string;
  author?: string;
  currency: string;
  tokenName: string;
  url?: string;
  media_type?: string | null;
  selloffers?: any[];
  buyoffers?: any[];
}
