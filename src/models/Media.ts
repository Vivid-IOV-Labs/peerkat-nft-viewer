export interface Media {
  type: string;
  earn: boolean;
  publisher: {
    walletAddress?: string;
  };
  mediaID: string;
  balanceTotal: number;
  balanceAvailable: number;
  categories?: string | Array<any>;
  mediaCategories?: Array<any>;
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
