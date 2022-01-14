export interface UserState {
  nodetype: string;
  address: string;
}

const state = (): UserState => ({
  address: "",
  nodetype: "",
});

export default state;
