interface Category {
  name: string;
  id: string;
}
export interface Media {
  type?: string;
  earn?: boolean;
  publisher: {
    walletAddress: string;
  };
  mediaID: string;
  balanceTotal?: number;
  balanceAvailable?: number;
  categories?: string | string[];
  mediaCategories?: Array<Category>;
  list: {
    highlighted: boolean;
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
