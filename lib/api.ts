import { toast } from "@/store/toast.store";
import { ENDPOINTS } from "@/types/api.generated";
import * as Sentry from "@sentry/react-native";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { tokenStorage } from "./auth/tokenStorage";
import { buildQueryParams } from "./buildQueryParams";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export class ApiError extends Error {
  statusCode: number;
  constructor(status: number, statusText: string) {
    super(`API Error: ${status} ${statusText}`);
    this.statusCode = status;
  }
}

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

let refreshPromise: Promise<string> | null = null;

async function reissueTokens(): Promise<string> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new ApiError(401, "No refresh token");
  }

  const response = await axios.post(
    `${API_URL}${ENDPOINTS.AUTH_TOKEN_REISSUE}`,
    null,
    {
      headers: { Authorization: `Bearer ${refreshToken}` },
    },
  );

  const { accessToken, refreshToken: newRefreshToken } = response.data.data;

  await tokenStorage.setTokens(accessToken, newRefreshToken);
  return accessToken;
}

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
        refreshPromise ??= reissueTokens().finally(() => {
          refreshPromise = null;
        });
        const accessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        const status = axios.isAxiosError(refreshError)
          ? refreshError.response?.status
          : refreshError instanceof ApiError
            ? refreshError.statusCode
            : undefined;

        if (status === 401 || status === 403) {
          await tokenStorage.clearTokens();
          console.error("Token refresh failed:", refreshError);
          Sentry.captureException(new Error("TokenRefreshFailed"));
        }
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

    if (!ignoreErrorToast && status !== undefined && status >= 500) {
      toast.show("잠시후 다시 시도해주세요.");
      console.log(errorMessage, statusText);
      Sentry.captureException(new Error(`ServerError ${status}: ${url}`));
    }

    throw new ApiError(status ?? 0, statusText);
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
