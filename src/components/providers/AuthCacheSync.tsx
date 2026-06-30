"use client";

import { useEffect, useRef } from "react";
import { AUTH_CHANGE_EVENT, getStoredAuth } from "@/utils/authStorage";
import { resetApiCache } from "@/redux/store/resetApiCache";

function getUserId(): string | null {
  const { user } = getStoredAuth();
  return user?.id ?? user?._id ?? null;
}

/**
 * Clears RTK Query cache when the signed-in user changes (login, logout, another tab).
 */
export default function AuthCacheSync() {
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = getUserId();

    const sync = () => {
      const nextId = getUserId();
      if (nextId !== userIdRef.current) {
        resetApiCache();
        userIdRef.current = nextId;
      }
    };

    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return null;
}
