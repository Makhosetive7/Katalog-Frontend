"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Book,
} from "@mui/icons-material";
import { useLoginMutation } from "@/redux/api/books";
import Lottie from "lottie-react";
import candidateAnimation from "@/public/animations/andidate.json";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setError("");
      const result = await login({ email, password }).unwrap();
      console.log("Login success:", result);

      // Save token locally
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            maxWidth: 1000,
            width: "100%",
          }}
        >
          <Grid container>
            {/* Animation Side */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: { xs: 4, md: 6 },
                textAlign: "center",
                borderRight: { md: "1px solid #e0e0e0" },
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 320, mb: 4 }}>
                <Lottie
                  animationData={candidateAnimation}
                  loop={true}
                  style={{ width: "100%", height: "auto" }}
                />
              </Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary"
                gutterBottom
                sx={{ mb: 2 }}
              >
                Welcome Back!
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: 400,
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Continue your reading journey and discover new stories in your
                personal library
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "primary.main",
                }}
              >
                <Book sx={{ fontSize: 28 }} />
                <Typography variant="body1" fontWeight="medium">
                  Your stories await
                </Typography>
              </Box>
            </Grid>

            {/* Form Side */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                p: { xs: 4, md: 6 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "white",
              }}
            >
              <Box sx={{ maxWidth: 400, width: "100%", mx: "auto" }}>
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                  >
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enter your credentials to access your account
                  </Typography>
                </Box>

                {/* Error Alert */}
                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      "& .MuiAlert-message": {
                        width: "100%",
                      },
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {/* Login Form */}
                <Box component="form" sx={{ width: "100%" }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                    variant="outlined"
                    placeholder="Enter your email address"
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    sx={{
                      mb: 4,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            color="primary"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    placeholder="Enter your password"
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleLogin}
                    disabled={isLoading}
                    sx={{
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      borderRadius: 2,
                      background:
                        "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                        transform: "translateY(-1px)",
                        boxShadow: "0 6px 20px rgba(25, 118, 210, 0.3)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                      transition: "all 0.2s ease",
                      mb: 2,
                      textTransform: "none",
                    }}
                  >
                    {isLoading ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CircularProgress size={20} color="inherit" />
                        Signing In...
                      </Box>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Box>

                {/* Divider */}
                <Divider sx={{ my: 4 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ px: 2 }}
                  >
                    or
                  </Typography>
                </Divider>

                {/* Additional Options */}
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Don't have an account?{" "}
                    <Button
                      color="primary"
                      onClick={() => router.push("/signup")}
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign up here
                    </Button>
                  </Typography>
                  <Button
                    color="primary"
                    onClick={() => router.push("/forgot-password")}
                    size="small"
                    sx={{
                      textTransform: "none",
                      fontWeight: "normal",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Forgot your password?
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
