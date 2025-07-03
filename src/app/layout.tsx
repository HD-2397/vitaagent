/** @format */

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {AppProviders} from "@/app/providers/AppProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your App",
  description: "VitaAgent - Resume Critique & Job Match Assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
