import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "PulseBoard Docs"
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  );
}

