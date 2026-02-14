import React from "react";
import { Inter } from "next/font/google";
import RootLayoutClient from "@/components/layout/layout-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Media Masala CRM",
  description: "Enterprise CRM for Media Masala",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <RootLayoutClient>{children}</RootLayoutClient>
          <Toaster richColors position="top-right" />
        </ErrorBoundary>
      </body>
    </html>
  );
}
