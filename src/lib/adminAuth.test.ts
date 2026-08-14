import { describe, expect, it } from "vitest";
import { ADMIN_EMAIL, isAuthorizedAdmin } from "./adminAuth";

describe("isAuthorizedAdmin", () => {
  it("allows the configured admin after Google verifies the email", () => {
    expect(isAuthorizedAdmin({ email: ADMIN_EMAIL, emailVerified: true })).toBe(true);
  });

  it("rejects the configured email until it is verified", () => {
    expect(isAuthorizedAdmin({ email: ADMIN_EMAIL, emailVerified: false })).toBe(false);
  });

  it("rejects another verified Google account", () => {
    expect(isAuthorizedAdmin({ email: "another@example.com", emailVerified: true })).toBe(false);
  });

  it("matches the configured email without case sensitivity", () => {
    expect(isAuthorizedAdmin({ email: ADMIN_EMAIL.toUpperCase(), emailVerified: true })).toBe(true);
  });
});
