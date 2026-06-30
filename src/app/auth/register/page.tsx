"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRegisterMutation } from "@/redux/api/books";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthLink, { AuthFooterText } from "@/components/auth/AuthLink";
import { getApiErrorMessage } from "@/components/auth/getApiErrorMessage";
import { AUTH, authFieldSx, authPrimaryButtonSx, authAlertSx } from "@/components/auth/authTheme";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { firstName, lastName, username, email, password } = formData;

    if (!firstName || !lastName || !username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      await register({ firstName, lastName, username, email, password }).unwrap();
      router.push("/auth/login");
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."));
    }
  };

  return (
    <AuthLayout
      quote="Start your reading streak."
      title="Create account"
      subtitle="Free forever. Add your first book in under a minute."
      footer={
        <AuthFooterText>
          Already have an account? <AuthLink href="/auth/login">Sign in</AuthLink>
        </AuthFooterText>
      }
    >
      {error && (
        <Alert severity="error" sx={authAlertSx}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={1.5}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="First name"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                disabled={isLoading}
                sx={authFieldSx}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Last name"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                disabled={isLoading}
                sx={authFieldSx}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            size="small"
            label="Username"
            autoComplete="username"
            value={formData.username}
            onChange={handleChange("username")}
            disabled={isLoading}
            sx={authFieldSx}
          />

          <TextField
            fullWidth
            size="small"
            label="Email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange("email")}
            disabled={isLoading}
            sx={authFieldSx}
          />

          <TextField
            fullWidth
            size="small"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange("password")}
            disabled={isLoading}
            helperText="Min. 6 characters"
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
              formHelperText: { sx: { fontFamily: AUTH.font, mx: 0, mt: 0.5 } },
            }}
          />
        </Stack>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{ ...authPrimaryButtonSx, mt: 2.5 }}
        >
          {isLoading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} color="inherit" />
              Creating account…
            </Box>
          ) : (
            "Create account"
          )}
        </Button>
      </Box>
    </AuthLayout>
  );
}
