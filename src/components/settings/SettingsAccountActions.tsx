"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Typography, alpha } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useLogoutMutation } from "@/redux/api/books";
import ProfileSection from "@/components/profile/ProfileSection";
import { DASH } from "@/components/dashboard/dashboardTheme";
import { clearAuthSession } from "@/utils/authStorage";

export default function SettingsAccountActions() {
  const router = useRouter();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* proceed with local logout */
    }
    clearAuthSession();
    router.push("/auth/login");
  };

  return (
    <ProfileSection title="Account" accent={DASH.wine}>
      <Typography
        sx={{
          fontFamily: DASH.font,
          fontSize: "0.8125rem",
          color: alpha(DASH.dark, 0.55),
          mb: 2,
          lineHeight: 1.5,
        }}
      >
        Sign out of Katalog on this device. You can log back in anytime.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Button
          variant="outlined"
          startIcon={<Logout sx={{ fontSize: "18px !important" }} />}
          onClick={handleLogout}
          disabled={isLoading}
          sx={{
            textTransform: "none",
            fontFamily: DASH.font,
            fontWeight: 600,
            fontSize: "0.8125rem",
            color: DASH.wine,
            borderColor: alpha(DASH.wine, 0.3),
            borderRadius: 0,
            px: 2,
            py: 0.85,
            "&:hover": {
              borderColor: DASH.wine,
              bgcolor: alpha(DASH.wine, 0.04),
            },
          }}
        >
          {isLoading ? "Signing out…" : "Sign out"}
        </Button>
      </Box>
    </ProfileSection>
  );
}
