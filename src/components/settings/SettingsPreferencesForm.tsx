"use client";

import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  Alert,
  alpha,
} from "@mui/material";
import { useUpdateProfileMutation } from "@/redux/api/books";
import ProfileSection from "@/components/profile/ProfileSection";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { modalSelectSx, modalPrimaryButtonSx } from "@/components/book/modalTheme";
import { setAuthSession } from "@/utils/authStorage";

type Privacy = "public" | "private" | "friends-only";

type PreferencesFormProps = {
  initial: {
    emailNotifications?: boolean;
    privacy?: Privacy;
  };
};

export default function SettingsPreferencesForm({ initial }: PreferencesFormProps) {
  const [emailNotifications, setEmailNotifications] = useState(
    initial.emailNotifications ?? true
  );
  const [privacy, setPrivacy] = useState<Privacy>(initial.privacy ?? "private");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    setEmailNotifications(initial.emailNotifications ?? true);
    setPrivacy(initial.privacy ?? "private");
  }, [initial]);

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    try {
      const user = await updateProfile({
        preferences: { emailNotifications, privacy },
      }).unwrap();

      const token = localStorage.getItem("token");
      if (token) {
        setAuthSession(token, user);
      }
      setSuccess(true);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? String((err as { data?: { message?: string } }).data?.message)
          : "Failed to save preferences.";
      setError(message);
    }
  };

  return (
    <ProfileSection title="Privacy & notifications" accent={DASH.wineDark}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          Preferences saved.
        </Alert>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel sx={{ fontFamily: DASH.font }}>Profile visibility</InputLabel>
        <Select
          value={privacy}
          label="Profile visibility"
          onChange={(e) => setPrivacy(e.target.value as Privacy)}
          sx={modalSelectSx}
        >
          <MenuItem value="private" sx={{ fontFamily: DASH.font }}>
            Private — only you
          </MenuItem>
          <MenuItem value="friends-only" sx={{ fontFamily: DASH.font }}>
            Friends only
          </MenuItem>
          <MenuItem value="public" sx={{ fontFamily: DASH.font }}>
            Public
          </MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: DASH.wine },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                bgcolor: alpha(DASH.wine, 0.45),
              },
            }}
          />
        }
        label={
          <Box
            component="span"
            sx={{ fontFamily: DASH.font, fontSize: "0.875rem", color: DASH.dark }}
          >
            Email notifications
          </Box>
        }
        sx={{ mb: 2, ml: 0 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isLoading}
          sx={modalPrimaryButtonSx}
        >
          {isLoading ? "Saving…" : "Save preferences"}
        </Button>
      </Box>
    </ProfileSection>
  );
}
