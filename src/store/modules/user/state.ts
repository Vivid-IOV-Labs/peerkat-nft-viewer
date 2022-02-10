export interface UserState {
  nodetype: string;
  address: string;
  user: string;
}

const state = (): UserState => ({
  address: "",
  nodetype: "",
  user: "default",
});

export default state;
