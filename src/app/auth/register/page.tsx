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
  Person,
  Book,
} from "@mui/icons-material";
import { useRegisterMutation } from "@/redux/api/books";
import Lottie from "lottie-react";
import candidateAnimation from "@/public/animations/dashboard2.json";

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
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { firstName, lastName, username, email, password } = formData;

    if (!firstName || !lastName || !username || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setError("");
      const result = await register({
        firstName,
        lastName,
        username,
        email,
        password,
      }).unwrap();

      console.log("Register success:", result);
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Register failed:", error);
      setError(
        error?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit(event as any);
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
                Join Our Community!
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
                Start your reading journey today and build your personal digital
                library
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
                  Discover new stories
                </Typography>
              </Box>
            </Grid>

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
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Join our reading community today
                  </Typography>
                </Box>

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

                {/* Register Form */}
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ width: "100%" }}
                >
                  {/* Name Fields */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        sx={{
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
                        placeholder="Enter your first name"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        sx={{
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
                        placeholder="Enter your last name"
                      />
                    </Grid>
                  </Grid>

                  {/* Username */}
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={handleChange("username")}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    sx={{
                      mb: 2,
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
                    placeholder="Choose a username"
                  />

                  {/* Email */}
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange("email")}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    sx={{
                      mb: 2,
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

                  {/* Password */}
                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange("password")}
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
                    placeholder="Create a password (min. 6 characters)"
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
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
                        Creating Account...
                      </Box>
                    ) : (
                      "Create Account"
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
                    Already have an account?
                  </Typography>
                </Divider>

                {/* Additional Options */}
                <Box sx={{ textAlign: "center" }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => router.push("/auth/login")}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                    }}
                  >
                    Sign In to Existing Account
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
