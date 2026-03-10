"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignOutPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    void signOut({ redirectUrl: "/" });
  }, [signOut]);

  return (
    <main>
      <p>Signing out...</p>
    </main>
  );
}
