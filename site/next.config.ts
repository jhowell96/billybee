import type { NextConfig } from "next";

const runtimeTarget = process.env.BILLYBEE_RUNTIME_TARGET ?? "static-marketing";
const validRuntimeTargets = new Set(["static-marketing", "server-authenticated"]);

if (!validRuntimeTargets.has(runtimeTarget)) {
  throw new Error(
    `Invalid BILLYBEE_RUNTIME_TARGET "${runtimeTarget}". Expected "static-marketing" or "server-authenticated".`
  );
}

const nextConfig: NextConfig = {
  output: runtimeTarget === "static-marketing" ? "export" : undefined,
  images: {
    unoptimized: runtimeTarget === "static-marketing"
  }
};

export default nextConfig;
