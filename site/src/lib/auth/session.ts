import { auth, currentUser } from "@clerk/nextjs/server";

export type AppSession = {
  externalUserId: string;
  email: string | null;
  name: string | null;
};

function normalizeName(firstName: string | null, lastName: string | null): string | null {
  const joined = [firstName, lastName].filter(Boolean).join(" ").trim();
  return joined.length > 0 ? joined : null;
}

export async function getCurrentSession(): Promise<AppSession | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await currentUser();
  if (!user) {
    return {
      externalUserId: userId,
      email: null,
      name: null
    };
  }

  return {
    externalUserId: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    name: normalizeName(user.firstName, user.lastName) ?? user.username ?? null
  };
}
