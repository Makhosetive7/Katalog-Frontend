"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Paper, Typography, Button } from "@mui/material";
import { useVerifyEmailMutation } from "../../../redux/api/books"; 

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<"loading" | "success" | "expired" | "error">("loading");
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail({ token }).unwrap();
        setStatus("success");
      } catch (err: any) {
        if (err?.data?.message?.includes("expired")) setStatus("expired");
        else setStatus("error");
      }
    };

    verify();
  }, [token, verifyEmail]);

  let title = "";
  let message = "";

  switch (status) {
    case "loading":
      title = "Verifying...";
      message = "Please wait while we verify your email.";
      break;
    case "success":
      title = "Email Verified!";
      message = "Your email has been successfully verified. You can now log in.";
      break;
    case "expired":
      title = "Verification Failed";
      message = "Your verification token has expired. Please request a new verification email.";
      break;
    default:
      title = "Verification Error";
      message = "Unable to verify email. Please try again or contact support.";
      break;
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f4f6f8"
    >
      <Paper elevation={3} sx={{ p: 4, width: 400, textAlign: "center" }}>
        <Typography variant="h4" mb={2} color="primary">
          {title}
        </Typography>
        <Typography variant="body1" mb={4}>
          {message}
        </Typography>
        {(status === "success" || status === "expired" || status === "error") && (
          <Button variant="contained" onClick={() => router.push("/auth/login")}>
            Go to Login
          </Button>
        )}
      </Paper>
    </Box>
  );
}
