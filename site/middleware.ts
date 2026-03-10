import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/app(.*)", "/api/app(.*)"]);
const runtimeTarget = process.env.BILLYBEE_RUNTIME_TARGET ?? "static-marketing";

export default clerkMiddleware(
  async (auth, req) => {
    if (runtimeTarget !== "server-authenticated") {
      return NextResponse.next();
    }

    if (isProtectedRoute(req)) {
      await auth.protect();
    }
  },
  {
    signInUrl: "/sign-in"
  }
);

export const config = {
  matcher: ["/app/:path*", "/api/app/:path*"]
};
