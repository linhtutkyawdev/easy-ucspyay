"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import StoreProvider from "./StoreProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </ThemeProvider>
    </StoreProvider>
  );
}
