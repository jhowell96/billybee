import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { assertAppEnvConfigured, isServerAuthenticatedRuntime } from "@/lib/env";
import "./globals.css";

assertAppEnvConfigured();

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
      <body>
        {isServerAuthenticatedRuntime() ? <ClerkProvider>{children}</ClerkProvider> : children}
      </body>
    </html>
  );
}
