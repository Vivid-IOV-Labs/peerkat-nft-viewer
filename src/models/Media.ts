export interface Media {
  type: string;
  earn: boolean;
  publisher: {
    walletAddress?: string;
  };
  mediaID: string;
  balanceTotal: number;
  balanceAvailable: number;
  list: {
    highlighted?: boolean;
    order?: number;
  };
  details: {
    title: string;
    subtitle?: string;
    moreInfo?: string;
    twitter?: {
      hashtags?: string[];
    };
  };
}
