"use client";

import { useState } from "react";
import { Box, Button, Alert, Typography, alpha } from "@mui/material";
import { Download, Email } from "@mui/icons-material";
import {
  useExportBooksCsvMutation,
  usePreviewNudgesQuery,
  useSendNudgeEmailMutation,
} from "@/redux/api/books";
import ProfileSection from "@/components/profile/ProfileSection";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { modalPrimaryButtonSx } from "@/components/book/modalTheme";

export default function SettingsExportSection() {
  const [exportCsv, { isLoading: exporting }] = useExportBooksCsvMutation();
  const [sendNudge, { isLoading: sending }] = useSendNudgeEmailMutation();
  const { data: nudgePreview } = usePreviewNudgesQuery();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setError(null);
    setMessage(null);
    try {
      const blob = await exportCsv().unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "katalog-books.csv";
      a.click();
      URL.revokeObjectURL(url);
      setMessage("Library exported as CSV.");
    } catch {
      setError("Export failed. Please try again.");
    }
  };

  const handleSendNudge = async () => {
    setError(null);
    setMessage(null);
    try {
      const result = await sendNudge().unwrap();
      if (result.sent) {
        setMessage("Reading nudge email sent.");
      } else {
        setMessage(result.reason === "notifications_disabled" ? "Enable email notifications first." : "No nudges to send right now.");
      }
    } catch {
      setError("Could not send nudge email.");
    }
  };

  return (
    <ProfileSection title="Data & reminders" accent={DASH.gold}>
      <Typography sx={{ fontFamily: DASH.font, fontSize: "0.875rem", color: alpha(DASH.dark, 0.6), mb: 2 }}>
        Export your library or send yourself a reading reminder.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 0, fontFamily: DASH.font }}>
          {message}
        </Alert>
      )}

      {nudgePreview?.nudges && nudgePreview.nudges.length > 0 && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: alpha(DASH.dark, 0.03), border: `1px solid ${alpha(DASH.dark, 0.08)}` }}>
          <Typography sx={{ fontFamily: DASH.font, fontSize: "0.75rem", fontWeight: 700, color: alpha(DASH.dark, 0.5), mb: 0.5 }}>
            Preview
          </Typography>
          {nudgePreview.nudges.map((n, i) => (
            <Typography key={i} sx={{ fontFamily: DASH.font, fontSize: "0.8125rem", color: alpha(DASH.dark, 0.7) }}>
              · {n}
            </Typography>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExport}
          disabled={exporting}
          sx={modalPrimaryButtonSx}
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Email />}
          onClick={handleSendNudge}
          disabled={sending || !nudgePreview?.emailEnabled}
          sx={{
            textTransform: "none",
            fontFamily: DASH.font,
            borderColor: alpha(DASH.wine, 0.3),
            color: DASH.wine,
          }}
        >
          {sending ? "Sending…" : "Send reading nudge"}
        </Button>
      </Box>
    </ProfileSection>
  );
}
