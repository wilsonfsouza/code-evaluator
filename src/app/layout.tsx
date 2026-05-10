import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevRoast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="bg-bg-page font-sans text-text-primary">
        <Header />
        {children}
      </body>
    </html>
  );
}
