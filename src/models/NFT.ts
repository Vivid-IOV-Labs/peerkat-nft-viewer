interface Category {
  name: string;
  id: string;
}
interface xumn_block {
  createdAt: number;
  details: {
    uuid: string;
    next: { always: string };
    pushed: boolean;
    refs: {
      qr_matrix: string;
      qr_png: string;
      qr_uri_quality_opts: string[];
      websocket_status: string;
    };
  };

  id: string;
  nft: string;
  updatedAt: number;
  xumm_api_status: "";
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
  current_status: string;
  previous_status: string;
  xumm: xumn_block[];
}
