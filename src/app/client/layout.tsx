"use client";

import React from "react";
import { ThemeProvider } from "@material-tailwind/react";
import StoreProvider from "./storeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <html lang="en">
          <body className="min-h-screen">{children}</body>
        </html>
      </ThemeProvider>
    </StoreProvider>
  );
}
