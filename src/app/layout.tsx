import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "İSG Platform",
  description: "İSG Uzmanları için Profesyonel Platform",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/apple-touch-icon.png",
    },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
