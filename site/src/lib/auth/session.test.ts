import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentSession } from "@/lib/auth/session";

const { authMock, currentUserMock } = vi.hoisted(() => ({
  authMock: vi.fn(),
  currentUserMock: vi.fn()
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: authMock,
  currentUser: currentUserMock
}));

describe("getCurrentSession", () => {
  beforeEach(() => {
    authMock.mockReset();
    currentUserMock.mockReset();
  });

  it("returns null when no authenticated user exists", async () => {
    authMock.mockResolvedValue({ userId: null });

    await expect(getCurrentSession()).resolves.toBeNull();
    expect(currentUserMock).not.toHaveBeenCalled();
  });

  it("returns normalized user data when Clerk user is present", async () => {
    authMock.mockResolvedValue({ userId: "user_123" });
    currentUserMock.mockResolvedValue({
      id: "user_123",
      firstName: "Bill",
      lastName: "Bee",
      username: "billy",
      primaryEmailAddress: { emailAddress: "bill@billybee.test" }
    });

    await expect(getCurrentSession()).resolves.toEqual({
      externalUserId: "user_123",
      email: "bill@billybee.test",
      name: "Bill Bee"
    });
  });

  it("falls back to auth userId when Clerk profile fetch is unavailable", async () => {
    authMock.mockResolvedValue({ userId: "user_789" });
    currentUserMock.mockResolvedValue(null);

    await expect(getCurrentSession()).resolves.toEqual({
      externalUserId: "user_789",
      email: null,
      name: null
    });
  });
});
