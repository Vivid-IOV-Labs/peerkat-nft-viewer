export interface UserState {
  network: string;
  nodetype: string;
  address: string;
  user: string;
}

const state = (): UserState => ({
  address: "",
  network: "",
  nodetype: "",
  user: "default",
});

export default state;
