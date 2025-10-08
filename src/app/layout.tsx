"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store/store";
import { CssBaseline } from "@mui/material";
import Navbar from "@/components/layout/navBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Provider store={store}>
          <CssBaseline />
          <Navbar/>
          {children}
        </Provider>
      </body>
    </html>
  );
}
