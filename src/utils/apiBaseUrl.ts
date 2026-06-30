const DEFAULT_API_BASE_URL = "http://localhost:5000/api";

/** Ensures a full absolute API URL ending in /api */
export function normalizeApiBaseUrl(raw?: string): string {
  const value = raw?.trim();
  if (!value) return DEFAULT_API_BASE_URL;

  let url = value;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  url = url.replace(/\/$/, "");
  if (!url.endsWith("/api")) {
    url = `${url}/api`;
  }

  return url;
}

export const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

export const googleSignInUrl = () => `${API_BASE_URL}/auth/google`;
