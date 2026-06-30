"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useChangePasswordMutation } from "@/redux/api/books";
import ProfileSection from "@/components/profile/ProfileSection";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { modalFieldSx, modalPrimaryButtonSx } from "@/components/book/modalTheme";

export default function SettingsPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!currentPassword || !newPassword) {
      setError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { message?: string } }).data?.message)
          : "Failed to change password.";
      setError(message);
    }
  };

  return (
    <ProfileSection title="Security" accent={DASH.gold}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          Password updated.
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
        <TextField
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          autoComplete="current-password"
          sx={modalFieldSx}
        />
        <TextField
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
          sx={modalFieldSx}
        />
        <TextField
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          autoComplete="new-password"
          sx={modalFieldSx}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={modalPrimaryButtonSx}
        >
          {isLoading ? "Updating…" : "Change password"}
        </Button>
      </Box>
    </ProfileSection>
  );
}
