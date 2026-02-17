import React from "react";
import localFont from "next/font/local";
import RootLayoutClient from "@/components/layout/layout-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <RootLayoutClient>{children}</RootLayoutClient>
          <Toaster richColors position="top-right" />
        </ErrorBoundary>
      </body>
    </html>
  );
}
