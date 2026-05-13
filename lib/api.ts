import { toast } from "@/store/toast.store";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { tokenStorage } from "./auth/tokenStorage";
import { buildQueryParams } from "./buildQueryParams";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type RequestOptions = {
  path: string;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
};

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

client.interceptors.request.use(
  async (config) => {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // 토큰이 필요하지 않은 인증 API들은 토큰 갱신을 시도하지 않음
      if (originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const response = await axios.post(`${API_URL}/auth/reissue`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        await tokenStorage.setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        await tokenStorage.clearTokens();
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

type CallOptions = {
  /** `true`로 설정하면 에러 발생 시 toast를 표시하지 않습니다. */
  ignoreErrorToast?: boolean;
};

async function request<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  { path, params, headers, body }: RequestOptions,
  { ignoreErrorToast = false }: CallOptions = {},
): Promise<{ data: T; status: number }> {
  const url = `${path}${buildQueryParams(params)}`;

  const config: AxiosRequestConfig = {
    url,
    method,
    headers,
    ...(method === "GET" ? {} : { data: body }),
  };

  try {
    const res = await client.request<{ data: T; status: number }>(config);
    return res.data;
  } catch (err) {
    const e = err as AxiosError;
    const status = e.response?.status;
    const statusText =
      (e.response as any)?.statusText || e.message || "Unknown Error";

    const errorMessage = `API Error: ${status ?? "N/A"}`;

    if (
      !ignoreErrorToast &&
      (status === 500 || status === 401 || status === 403)
    ) {
      toast.show(errorMessage);
    }

    throw new Error(`${errorMessage} ${statusText}`);
  }
}

export const api = {
  get: <T>(options: RequestOptions, callOptions?: CallOptions) =>
    request<T>("GET", options, callOptions),
  post: <T>(options: RequestOptions, callOptions?: CallOptions) =>
    request<T>("POST", options, callOptions),
  put: <T>(options: RequestOptions, callOptions?: CallOptions) =>
    request<T>("PUT", options, callOptions),
  delete: <T>(options: RequestOptions, callOptions?: CallOptions) =>
    request<T>("DELETE", options, callOptions),
  patch: <T>(options: RequestOptions, callOptions?: CallOptions) =>
    request<T>("PATCH", options, callOptions),
};
