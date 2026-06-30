"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { useLoginMutation, useDemoLoginMutation } from "@/redux/api/books";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthLink, { AuthFooterText } from "@/components/auth/AuthLink";
import { getApiErrorMessage } from "@/components/auth/getApiErrorMessage";
import { AUTH, authFieldSx, authPrimaryButtonSx, authGhostButtonSx, authAlertSx } from "@/components/auth/authTheme";
import { setAuthSession } from "@/utils/authStorage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const [demoLogin, { isLoading: isDemoLoading }] = useDemoLoginMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    try {
      setError("");
      const result = await login({ email, password }).unwrap();
      setAuthSession(result.token, result.user);
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Login failed. Please try again."));
    }
  };

  const handleDemoLogin = async () => {
    try {
      setError("");
      const result = await demoLogin().unwrap();
      setAuthSession(result.token, result.user);
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Demo login failed. Please try again."));
    }
  };

  return (
    <AuthLayout
      quote="Pick up where you left off."
      title="Sign in"
      subtitle="Welcome back — your shelf is waiting."
      footer={
        <AuthFooterText>
          New to Katalog? <AuthLink href="/auth/register">Create an account</AuthLink>
        </AuthFooterText>
      }
    >
      {error && (
        <Alert severity="error" sx={authAlertSx}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Stack spacing={1.5}>
          <TextField
            fullWidth
            size="small"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            sx={authFieldSx}
          />

          <TextField
            fullWidth
            size="small"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
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
                      {showPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>

        <Box sx={{ textAlign: "center", mt: 1.25, mb: 2 }}>
          <AuthLink href="/auth/forgot-password">Forgot password?</AuthLink>
        </Box>

        <Stack spacing={1}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={authPrimaryButtonSx}
          >
            {isLoading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                Signing in…
              </Box>
            ) : (
              "Sign in"
            )}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={handleDemoLogin}
            disabled={isDemoLoading || isLoading}
            sx={authGhostButtonSx}
          >
            {isDemoLoading ? "Loading demo…" : "Try demo instead"}
          </Button>
        </Stack>
      </Box>
    </AuthLayout>
  );
}
