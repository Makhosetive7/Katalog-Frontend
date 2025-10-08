
import axios from "axios";
import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

// Type-safe API creator
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
      baseUrl: "http://localhost:5000/api",
      prepareHeaders: (headers) => {
        const token = localStorage.getItem("token");
        if (token) headers.set("Authorization", `Bearer ${token}`);
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
  baseURL: "http://localhost:5000/api", 
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add token automatically
apiConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 globally
apiConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
