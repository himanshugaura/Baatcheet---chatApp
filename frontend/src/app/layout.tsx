import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/store/storeProvider"

import ToasterProvider from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BaatCheet",
  icons: {
    icon: '/favicon.ico', 
  },
  description: "Connect instantly with friends using our real-time chat app. Secure messaging, seamless and a sleek user experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#040617]`}
      >
        <ToasterProvider/>
       <ReduxProvider>
          {children}
       </ReduxProvider>
      </body>
    </html>
  );
}
