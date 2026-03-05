import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KSA Mail | Professional Email Service for Saudi Arabia",
  description: "Reliable, encrypted, and scalable email hosting built for Saudi businesses and government-aligned enterprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
