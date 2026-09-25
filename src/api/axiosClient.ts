import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const getBaseURL = (): string => {
  // 1. Explicit environment variable if provided
  if (import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // 2. On browser in production (e.g. Vercel), route through relative proxy "/api/v1"
  // This proxies through vercel.json rewrite and avoids browser Mixed Content (HTTPS -> HTTP) blocks
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return "/api/v1";
  }
  // 3. Local development fallback
  return "http://localhost:8000/api/v1";
};

const API_BASE_URL = getBaseURL();

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30s default — fail fast, not 2-minute hang
});

/**
 * Pre-warm the backend so the first real request (login/register)
 * doesn't suffer a cold-start penalty. Fire-and-forget, ignores errors.
 * Uses raw axios (not axiosClient) to bypass the 401 interceptor
 * which would otherwise wipe localStorage tokens.
 */
export const prewarmBackend = (): void => {
  // Build the full URL from the base — on Vercel this becomes /api/v1/auth/me
  // which is rewritten by vercel.json to the real backend.
  const url = API_BASE_URL.startsWith("/")
    ? `${window.location.origin}${API_BASE_URL}/auth/me`
    : `${API_BASE_URL}/auth/me`;
  axios
    .get(url, { timeout: 8000 })
    .catch(() => { /* silent — 401/network is expected, just warming up */ });
};

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
