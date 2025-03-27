import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppLayout from "./_layout";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "AI Chatbot that's faster than making a lemonade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> */}
      <body className="antialiased">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
