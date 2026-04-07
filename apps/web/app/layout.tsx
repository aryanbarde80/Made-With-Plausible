import "./globals.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { getAppUrl } from "../lib/env";

export const metadata: Metadata = {
  title: "PulseBoard",
  description: "Production-grade analytics SaaS built on Plausible.",
  metadataBase: new URL(getAppUrl())
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  );
}
