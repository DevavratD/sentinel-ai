import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SentinelAI | Cybersecurity Middleware",
  description: "AI-powered cybersecurity middleware for authentication systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-50`}
      >
        {children}
      </body>
    </html>
  );
}
