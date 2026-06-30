export const AUTH_CHANGE_EVENT = "katalog-auth-change";

export type StoredUser = {
  id?: string;
  _id?: string;
  username?: string;
  email?: string;
  isVerified?: boolean;
  isDemo?: boolean;
  profile?: {
    firstName?: string;
    lastName?: string;
    readingPreferences?: unknown[];
  };
};

export function getStoredAuth(): {
  user: StoredUser | null;
  isAuthenticated: boolean;
} {
  if (typeof window === "undefined") {
    return { user: null, isAuthenticated: false };
  }

  try {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!raw || !token) {
      return { user: null, isAuthenticated: false };
    }

    const user = JSON.parse(raw) as StoredUser;
    const id = user?.id ?? user?._id;
    if (!id) {
      return { user: null, isAuthenticated: false };
    }

    return { user: { ...user, id }, isAuthenticated: true };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

export function setAuthSession(token: string, user: StoredUser) {
  const { user: previousUser } = getStoredAuth();
  const previousId = previousUser?.id ?? previousUser?._id ?? null;
  const nextId = user?.id ?? user?._id ?? null;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  if (previousId !== nextId) {
    void import("../redux/store/resetApiCache").then((m) => m.resetApiCache());
  }

  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  void import("../redux/store/resetApiCache").then((m) => m.resetApiCache());
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
