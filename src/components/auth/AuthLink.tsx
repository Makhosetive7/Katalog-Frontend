"use client";

import Link from "next/link";
import { Typography, alpha } from "@mui/material";
import { AUTH } from "./authTheme";

export default function AuthLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Typography
      component={Link}
      href={href}
      sx={{
        fontFamily: AUTH.font,
        fontWeight: 600,
        fontSize: "0.8125rem",
        color: AUTH.wine,
        textDecoration: "none",
        "&:hover": { color: AUTH.wineDark, textDecoration: "none" },
      }}
    >
      {children}
    </Typography>
  );
}

export function AuthFooterText({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      sx={{
        fontFamily: AUTH.font,
        fontSize: "0.8125rem",
        color: alpha(AUTH.dark, 0.45),
        textAlign: "center",
        lineHeight: 1.5,
      }}
    >
      {children}
    </Typography>
  );
}
