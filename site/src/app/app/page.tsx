import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentSession } from "@/lib/auth/session";

export default async function AppHomePage() {
  const session = await getCurrentSession();

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">BillyBee App</p>
        <h1>Welcome{session?.name ? `, ${session.name}` : ""}</h1>
        <p>
          You are signed in as {session?.email ?? "an authenticated user"}. Dashboard modules land in
          this protected shell next.
        </p>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <UserButton afterSignOutUrl="/" />
          <Link href="/sign-out">Sign out</Link>
        </div>
      </section>
    </main>
  );
}
