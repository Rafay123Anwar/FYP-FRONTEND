import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:8000/api/v1";

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

// Request Interceptor: Attach JWT Token from localStorage
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
