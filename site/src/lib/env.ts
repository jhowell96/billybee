const RUNTIME_TARGETS = ["static-marketing", "server-authenticated"] as const;

type RuntimeTarget = (typeof RUNTIME_TARGETS)[number];

function getRuntimeTarget(): RuntimeTarget {
  const value = process.env.BILLYBEE_RUNTIME_TARGET ?? "static-marketing";
  if (RUNTIME_TARGETS.includes(value as RuntimeTarget)) {
    return value as RuntimeTarget;
  }

  throw new Error(
    `Invalid BILLYBEE_RUNTIME_TARGET "${value}". Expected one of: ${RUNTIME_TARGETS.join(", ")}.`
  );
}

function requiredWhenServerAuth(env: string[]): string[] {
  const missing: string[] = [];
  for (const key of env) {
    if (!process.env[key] || process.env[key]?.trim() === "") {
      missing.push(key);
    }
  }
  return missing;
}

export function assertAppEnvConfigured(): void {
  const runtimeTarget = getRuntimeTarget();
  if (runtimeTarget !== "server-authenticated") {
    return;
  }

  const missing = requiredWhenServerAuth([
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "DATABASE_URL",
    "APP_URL"
  ]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables for server-authenticated runtime: ${missing.join(", ")}`
    );
  }
}
