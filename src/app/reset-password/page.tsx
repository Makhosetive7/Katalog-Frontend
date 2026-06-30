"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useResetPasswordMutation } from "@/redux/api/books";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthLink, { AuthFooterText } from "@/components/auth/AuthLink";
import { getApiErrorMessage } from "@/components/auth/getApiErrorMessage";
import { AUTH, authFieldSx, authPrimaryButtonSx, authAlertSx } from "@/components/auth/authTheme";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      setError("");
      await resetPassword({ token, newPassword: password }).unwrap();
      setDone(true);
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not reset password. The link may have expired."));
    }
  };

  return (
    <AuthLayout
      quote="Fresh start."
      title={done ? "All set" : "New password"}
      subtitle={
        done ? "Redirecting to sign in…" : "Make it something you'll remember this time."
      }
      footer={
        !done && (
          <AuthFooterText>
            <AuthLink href="/auth/login">← Back to sign in</AuthLink>
          </AuthFooterText>
        )
      }
    >
      {error && (
        <Alert severity="error" sx={authAlertSx}>
          {error}
        </Alert>
      )}

      {done ? (
        <Alert severity="success" sx={{ borderRadius: 0, fontFamily: AUTH.font }}>
          Password updated successfully.
        </Alert>
      ) : !token ? (
        <Alert severity="warning" sx={{ borderRadius: 0, fontFamily: AUTH.font }}>
          Invalid link. <AuthLink href="/auth/forgot-password">Request a new one</AuthLink>
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={1.5} sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              size="small"
              label="New password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              sx={authFieldSx}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Confirm password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={isLoading}
              sx={authFieldSx}
            />
          </Stack>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={authPrimaryButtonSx}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} color="inherit" />
                Updating…
              </Box>
            ) : (
              "Update password"
            )}
          </Button>
        </Box>
      )}
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
