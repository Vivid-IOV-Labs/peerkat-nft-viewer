import axios, {
  AxiosResponse,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
} from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const config: AxiosRequestConfig = {
  baseURL: baseURL,
};

const apiService: AxiosInstance = axios.create(config);

const errorHandler = (error: AxiosError) => {
  return Promise.reject({ ...error });
};

const successHandler = (response: AxiosResponse) => {
  const { data } = response;
  return data;
};

apiService.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error)
);

apiService.interceptors.request.use(function (config: AxiosRequestConfig) {
  const { url } = config;
  if (url && !["admin/login", "media/list"].includes(url)) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    } else {
      delete config.headers.token;
    }
  }
  return config;
});

// interface CallInputs {
//     method: string, body: string, url: string
// }

// async function call({ method, body, url }: CallInputs)
// try {
//     return [data: AxiosResponse, null] = await apiService[method](url, body)

// } catch (error) {

// } finally(){

// }
// }

export default apiService;
