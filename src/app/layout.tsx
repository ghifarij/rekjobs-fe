import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/main/navbar/Navbar";
import Script from "next/script";
import { SessionProvider } from "@/context/sessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RekJobs - Lowongan Kerja mudah dan ramah pengguna",
  description:
    "Temukan pekerjaan impian Anda dengan RekJobs. Platform lowongan kerja terbaik dengan gaji bersaing dan peluang karir yang menjanjikan.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "RekJobs - Lowongan Kerja mudah dan ramah pengguna",
    description:
      "Temukan pekerjaan impian Anda dengan RekJobs. Platform lowongan kerja terbaik dengan gaji bersaing dan peluang karir yang menjanjikan.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
