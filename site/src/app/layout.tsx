import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BillyBee",
  description: "Taking the sting out of getting paid."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
