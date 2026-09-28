/**
 * Clerk, server-side only.
 *
 * This module verifies the session token the app sends with every API request
 * and turns it into the one thing the rest of the server trusts: a user id that
 * the client cannot choose.
 *
 * It lives in its own file so the rule is easy to state and easy to check —
 * **nothing under `app/api/` may read a user id out of a request body.** The id
 * comes from `verifyToken()` below, or the request is rejected.
 *
 * `CLERK_SECRET_KEY` is a server secret: it must never be prefixed with
 * `EXPO_PUBLIC_`, and it must never reach the app bundle. See `.env`.
 */

import { createClerkClient, verifyToken } from "@clerk/backend";

/** Who the request is from, once the session token checks out. */
export type AuthenticatedUser = {
  /** The Clerk user id — the only user id the server will ever act on. */
  id: string;
  /** Display name, for the call UI. Falls back to the id. */
  name: string;
  /** Profile picture URL, when the account has one. */
  imageUrl?: string;
};

/** Read the secret key, failing loudly rather than serving anonymous requests. */
function getSecretKey(): string {
  const key = process.env.CLERK_SECRET_KEY;

  if (!key) {
    throw new Error(
      "Add CLERK_SECRET_KEY to the .env file at the project root. It is the " +
        "server-side Clerk secret (the `sk_test_…` / `sk_live_…` key from the " +
        "Clerk dashboard) — do not prefix it with EXPO_PUBLIC_.",
    );
  }

  return key;
}

/**
 * The `Authorization: Bearer <token>` header Clerk's `getToken()` fills in.
 *
 * Returns an empty string for anything that is not a bearer header, so the
 * caller has one "no token" path instead of three.
 */
function readBearerToken(request: Request): string {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, value] = header.split(" ");

  return scheme?.toLowerCase() === "bearer" && value ? value.trim() : "";
}

/**
 * Verify the caller's Clerk session, or return `null`.
 *
 * `null` covers every rejection — missing header, expired token, token signed
 * for another instance — because the API route answers all of them the same
 * way: 401. A misconfigured server (no secret key) throws instead, so it shows
 * up as a 500 rather than as "you are not signed in".
 */
export async function authenticateRequest(
  request: Request,
): Promise<AuthenticatedUser | null> {
  const token = readBearerToken(request);

  if (!token) {
    return null;
  }

  try {
    // The token is signed by this Clerk instance, so a valid signature plus a
    // `sub` claim is proof of who is calling.
    const payload = await verifyToken(token, { secretKey: getSecretKey() });

    if (!payload?.sub) {
      return null;
    }

    // Read the profile from Clerk rather than from the request body: the
    // display name on the call screen is then the account's real name, not a
    // string the client picked.
    const user = await createClerkClient({
      secretKey: getSecretKey(),
    }).users.getUser(payload.sub);

    return {
      id: payload.sub,
      name: user.fullName ?? user.username ?? payload.sub,
      imageUrl: user.imageUrl,
    };
  } catch (error) {
    // An invalid or expired token is a 401, not a crash. Anything else (a Clerk
    // outage, a bad secret) is rethrown so it surfaces as a 500.
    if (isTokenError(error)) {
      return null;
    }

    throw error;
  }
}

/** Clerk's verification failures all carry a `reason`; network faults do not. */
function isTokenError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "reason" in error &&
    typeof (error as { reason?: unknown }).reason === "string"
  );
}
