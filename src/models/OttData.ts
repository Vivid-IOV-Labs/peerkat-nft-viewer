export interface OttData {
  version: string;
  locale: string;
  currency: string;
  style: string;
  nodetype: string; //TESTNET
  account: string;
  accounttype: string;
  user: string;
  user_device: {
    currency: string;
  };
}
