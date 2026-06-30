"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForgotPasswordMutation } from "@/redux/api/books";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthLink, { AuthFooterText } from "@/components/auth/AuthLink";
import { getApiErrorMessage } from "@/components/auth/getApiErrorMessage";
import { AUTH, authFieldSx, authPrimaryButtonSx, authAlertSx } from "@/components/auth/authTheme";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    try {
      setError("");
      await forgotPassword({ email }).unwrap();
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send reset email. Please try again."));
    }
  };

  return (
    <AuthLayout
      quote="Happens to the best of us."
      title={sent ? "Email sent" : "Forgot password?"}
      subtitle={
        sent
          ? `Check ${email} for a reset link. It expires in 1 hour.`
          : "We'll email you a link to choose a new password."
      }
      footer={
        <AuthFooterText>
          <AuthLink href="/auth/login">← Back to sign in</AuthLink>
        </AuthFooterText>
      }
    >
      {error && (
        <Alert severity="error" sx={authAlertSx}>
          {error}
        </Alert>
      )}

      {sent ? (
        <Alert severity="success" sx={{ ...authAlertSx, mb: 0 }}>
          Didn&apos;t get it? Check spam, or try again in a few minutes.
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            size="small"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            sx={{ ...authFieldSx, mb: 2.5 }}
          />

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
                Sending…
              </Box>
            ) : (
              "Send reset link"
            )}
          </Button>
        </Box>
      )}
    </AuthLayout>
  );
}
