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
  title: "DoorBel - Fast & Reliable Delivery in Ghana",
  description: "DoorBel is Ghana's premier delivery platform connecting customers with trusted riders. Send packages, track deliveries in real-time, and enjoy secure mobile money payments.",
  keywords: "delivery, Ghana, package delivery, mobile money, logistics, DoorBel",
  authors: [{ name: "DoorBel Team" }],
  openGraph: {
    title: "DoorBel - Fast & Reliable Delivery in Ghana",
    description: "Ghana's premier delivery platform for fast, secure, and reliable package delivery services.",
    type: "website",
    locale: "en_GH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
