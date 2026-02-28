import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "WSUA Legal Intelligence Platform",
  description: "Workstation-grade legal environment for WSUA."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="app-shell antialiased">
        {children}
      </body>
    </html>
  );
}

