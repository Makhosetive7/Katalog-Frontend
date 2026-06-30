
import axios from "axios";
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearAuthSession } from "./authStorage";
import { API_BASE_URL } from "./apiBaseUrl";

async function handleUnauthorized() {
  clearAuthSession();
  window.location.href = "/auth/login";
}

// Type-safe API creator
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCustomApi<Endpoints extends Record<string, any>>(
  reducerPath: string,
  endpoints: (builder: import("@reduxjs/toolkit/query/react").EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
    string,
    string
  >) => Endpoints
) {
  return createApi({
    reducerPath,
    baseQuery: fetchBaseQuery({
      baseUrl: API_BASE_URL,
      prepareHeaders: (headers) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("token");
          if (token) headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    }),
    endpoints,
  });
}



/**
 * Axios instance for direct API calls outside of RTK Query
 */
export const apiConfig = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add token automatically
apiConfig.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 globally
apiConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      void handleUnauthorized();
    }
    return Promise.reject(error);
  }
);
