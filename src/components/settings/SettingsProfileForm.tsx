"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Grid,
} from "@mui/material";
import { useUpdateProfileMutation } from "@/redux/api/books";
import ProfileSection from "@/components/profile/ProfileSection";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { modalFieldSx, modalPrimaryButtonSx } from "@/components/book/modalTheme";
import { setAuthSession } from "@/utils/authStorage";

type ProfileFormProps = {
  initial: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    readingPreferences?: string[];
  };
};

export default function SettingsProfileForm({ initial }: ProfileFormProps) {
  const [firstName, setFirstName] = useState(initial.firstName ?? "");
  const [lastName, setLastName] = useState(initial.lastName ?? "");
  const [bio, setBio] = useState(initial.bio ?? "");
  const [preferencesText, setPreferencesText] = useState(
    (initial.readingPreferences ?? []).join(", ")
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    setFirstName(initial.firstName ?? "");
    setLastName(initial.lastName ?? "");
    setBio(initial.bio ?? "");
    setPreferencesText((initial.readingPreferences ?? []).join(", "));
  }, [initial]);

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    const readingPreferences = preferencesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const user = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim(),
        readingPreferences,
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
          : "Failed to save profile.";
      setError(message);
    }
  };

  return (
    <ProfileSection title="Profile details" accent={DASH.wine}>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          Profile saved.
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
            sx={modalFieldSx}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
            sx={modalFieldSx}
          />
        </Grid>
      </Grid>

      <TextField
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        multiline
        rows={3}
        placeholder="A line or two about your reading life…"
        fullWidth
        sx={{ ...modalFieldSx, mb: 2 }}
      />

      <TextField
        label="Reading preferences"
        value={preferencesText}
        onChange={(e) => setPreferencesText(e.target.value)}
        placeholder="Fiction, Fantasy, Non-fiction"
        helperText="Comma-separated genres or topics you enjoy"
        fullWidth
        sx={{ ...modalFieldSx, mb: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isLoading}
          sx={modalPrimaryButtonSx}
        >
          {isLoading ? "Saving…" : "Save profile"}
        </Button>
      </Box>
    </ProfileSection>
  );
}
