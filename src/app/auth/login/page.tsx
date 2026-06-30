"use client";

import { Suspense, useEffect, useState } from "react";
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
  Divider,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  useLoginMutation,
  useDemoLoginMutation,
  useGetAuthConfigQuery,
} from "@/redux/api/books";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthLink, { AuthFooterText } from "@/components/auth/AuthLink";
import { getApiErrorMessage } from "@/components/auth/getApiErrorMessage";
import {
  AUTH,
  authFieldSx,
  authPrimaryButtonSx,
  authGhostButtonSx,
  authAlertSx,
} from "@/components/auth/authTheme";
import { setAuthSession } from "@/utils/authStorage";
import { googleSignInUrl } from "@/utils/apiBaseUrl";

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_disabled: "Google sign-in is not available in this environment.",
  google_cancelled: "Google sign-in was cancelled.",
  google_failed: "Google sign-in failed. Please try again.",
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: authConfig, isLoading: isConfigLoading } = useGetAuthConfigQuery();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const [demoLogin, { isLoading: isDemoLoading }] = useDemoLoginMutation();

  const allowLocal = authConfig?.allowLocal ?? true;
  const allowDemo = authConfig?.allowDemo ?? true;
  const allowGoogle = authConfig?.allowGoogle ?? false;

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError && GOOGLE_ERROR_MESSAGES[oauthError]) {
      setError(GOOGLE_ERROR_MESSAGES[oauthError]);
    }
  }, [searchParams]);

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

  const handleGoogleSignIn = () => {
    window.location.href = googleSignInUrl();
  };

  if (isConfigLoading) {
    return (
      <AuthLayout quote="Pick up where you left off." title="Sign in" subtitle="Loading…">
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      quote="Pick up where you left off."
      title="Sign in"
      subtitle={
        allowGoogle && !allowLocal
          ? "Continue with your Google account."
          : "Welcome back — your shelf is waiting."
      }
      footer={
        allowLocal ? (
          <AuthFooterText>
            New to Katalog? <AuthLink href="/auth/register">Create an account</AuthLink>
          </AuthFooterText>
        ) : undefined
      }
    >
      {error && (
        <Alert severity="error" sx={authAlertSx}>
          {error}
        </Alert>
      )}

      <Stack spacing={1.5}>
        {allowGoogle && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            disabled={isLoading || isDemoLoading}
            sx={{
              py: 1.1,
              textTransform: "none",
              fontWeight: 600,
              borderColor: alphaBorder,
              color: AUTH.dark,
              "&:hover": { borderColor: AUTH.dark, bgcolor: "rgba(0,0,0,0.03)" },
            }}
          >
            Continue with Google
          </Button>
        )}

        {allowGoogle && allowLocal && (
          <Divider>
            <Typography variant="caption" color="text.secondary">
              or
            </Typography>
          </Divider>
        )}

        {allowLocal && (
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
                          {showPassword ? (
                            <VisibilityOff sx={{ fontSize: 16 }} />
                          ) : (
                            <Visibility sx={{ fontSize: 16 }} />
                          )}
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
          </Box>
        )}

        {allowDemo && (
          <Button
            fullWidth
            variant="text"
            onClick={handleDemoLogin}
            disabled={isDemoLoading || isLoading}
            sx={authGhostButtonSx}
          >
            {isDemoLoading ? "Loading demo…" : "Try demo instead"}
          </Button>
        )}
      </Stack>
    </AuthLayout>
  );
}

const alphaBorder = "rgba(0,0,0,0.18)";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout quote="Pick up where you left off." title="Sign in" subtitle="Loading…">
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        </AuthLayout>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
