import ApiService from "./ApiService";
const API_ENDPOINT = "admin";

interface LoginInput {
  email: string;
  password: string;
}
interface LoginResponse {
  data: {
    token?: string;
  };
}

async function login({
  email,
  password,
}: LoginInput): Promise<string | undefined> {
  const {
    data: { token },
  }: LoginResponse = await ApiService.post(`${API_ENDPOINT}/login`, {
    email,
    password,
  });
  if (token) {
    localStorage.setItem("token", token);
  }
  return token;
}

export default {
  login,
};
