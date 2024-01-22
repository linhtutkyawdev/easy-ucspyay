import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Layout from "./client/layout";
import StoreProvider from "./client/storeProvider";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "@/components/contestant-card/index.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Easy UCSP",
  description: "UCSP Fresher Welcome Voting Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Layout>{children}</Layout>
    </ClerkProvider>
  );
}
