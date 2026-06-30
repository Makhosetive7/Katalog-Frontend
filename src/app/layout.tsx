"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store/store";
import { CssBaseline } from "@mui/material";
import Navbar from "@/components/layout/navBar";
import AppThemeProvider from "@/components/providers/AppThemeProvider";
import AuthCacheSync from "@/components/providers/AuthCacheSync";
import "@/app/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Provider store={store}>
          <AppThemeProvider>
            <AuthCacheSync />
            <CssBaseline />
            <Navbar/>
            {children}
          </AppThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
