"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import AuthLayout from "@/components/auth/AuthLayout";
import { setAuthSession, type StoredUser } from "@/utils/authStorage";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");

    if (!token || !userParam) {
      setError("Sign-in could not be completed. Please try again.");
      return;
    }

    try {
      const user = JSON.parse(decodeURIComponent(userParam)) as StoredUser;
      setAuthSession(token, user);
      router.replace("/dashboard");
    } catch {
      setError("Sign-in could not be completed. Please try again.");
    }
  }, [router, searchParams]);

  return (
    <AuthLayout
      quote="Almost there."
      title="Signing you in"
      subtitle="Finishing Google sign-in…"
    >
      {error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={32} />
        </Box>
      )}
    </AuthLayout>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          quote="Almost there."
          title="Signing you in"
          subtitle="Finishing Google sign-in…"
        >
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        </AuthLayout>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
