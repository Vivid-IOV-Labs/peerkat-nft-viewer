import { User } from "../../../models/User";

export interface AuthState {
  currentUser: User | null;
}

const state = (): AuthState => ({
  currentUser: null,
});

export default state;
