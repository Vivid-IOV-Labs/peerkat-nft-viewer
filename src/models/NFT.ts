export interface NFT {
  issuer: string;
  balanceFormatted?: string;
  limitFormatted?: string;
  desc?: string;
  standard?: string;
  author?: string;
  owner?: string;
  currency: string;
  tokenName: string;
  url?: string;
  media_type?: string | null;
  mediaUrl?: string;
  thumbnailUrl?: string;
  selloffers?: any[];
  buyoffers?: any[];
}
