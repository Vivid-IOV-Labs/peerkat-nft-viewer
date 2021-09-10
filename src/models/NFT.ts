interface Category {
  name: string;
  id: string;
}

export interface NFT {
  id: string;
  details: {
    token_name: string;
    title: string;
    subtitle?: string;
    description?: string;
    tags?: string[];
    mediaurl: string;
    categories: Category[];
    brand_name: string;
    transferable_copyright: boolean;
  };
  status: string;
}
