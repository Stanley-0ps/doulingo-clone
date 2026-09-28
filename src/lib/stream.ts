/**
 * Stream, client-side.
 *
 * Everything here runs in the app, so it may only ever touch the API key and a
 * user token. The token is minted by `/api/stream/session` from the caller's
 * verified Clerk session — the app never signs anything itself.
 */

import Constants from "expo-constants";

/** What `/api/stream/session` hands back, and everything the client is allowed. */
export type StreamSession = {
  /** The public Stream API key. Safe in the bundle; the secret never is. */
  apiKey: string;
  /** A short-lived token for `userId`. Refreshed by the token provider. */
  token: string;
  /** The id Stream knows this user by — assigned by the server, not by us. */
  userId: string;
  userName: string;
  userImage?: string;
  /** The room to join, or `null` when no lesson was selected. */
  callId: string | null;
  callType: string | null;
};

/** The lesson a call should be opened for. Omitted when warming up the client. */
export type LessonSelection = {
  lessonId?: string;
  languageId?: string;
};

/**
 * Where the API routes live.
 *
 * On the web build the app and the routes share an origin, so a relative URL is
 * correct and `""` is the whole answer. On a device `fetch("/api/…")` has no
 * origin to resolve against, so we need one: `EXPO_PUBLIC_API_ORIGIN` when it is
 * set (production), otherwise the host the dev server is already serving from.
 */
function apiOrigin(): string {
  const configured = process.env.EXPO_PUBLIC_API_ORIGIN;

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  // `hostUri` looks like "192.168.1.20:8081" while `expo start` is running.
  const hostUri = Constants.expoConfig?.hostUri;

  return hostUri ? `http://${hostUri}` : "";
}

/** Thrown for anything the caller cannot recover from by retrying as-is. */
export class StreamSessionError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "StreamSessionError";
  }
}

/**
 * Ask the server for Stream credentials.
 *
 * `clerkToken` is the session token from `useAuth().getToken()`; the server
 * verifies it and decides who we are. The `selection` tells the server which
 * lesson room to open — it is not an identity claim and the server re-validates
 * it against the course data.
 */
export async function fetchStreamSession(
  clerkToken: string | null,
  selection: LessonSelection = {},
): Promise<StreamSession> {
  if (!clerkToken) {
    throw new StreamSessionError("You need to be signed in to join a lesson.");
  }

  let response: Response;

  try {
    response = await fetch(`${apiOrigin()}/api/stream/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${clerkToken}`,
      },
      body: JSON.stringify(selection),
    });
  } catch {
    throw new StreamSessionError(
      "Could not reach the lesson server. Check your connection and try again.",
    );
  }

  if (response.status === 401) {
    throw new StreamSessionError("Your session expired. Sign in again.", 401);
  }

  if (!response.ok) {
    throw new StreamSessionError(
      `The lesson server rejected the request (${response.status}).`,
      response.status,
    );
  }

  const session = (await response.json()) as StreamSession;

  if (!session.apiKey || !session.token || !session.userId) {
    throw new StreamSessionError("The lesson server sent an incomplete session.");
  }

  return session;
}

/**
 * The function Stream calls whenever it needs a fresh token.
 *
 * The SDK keeps the call alive across a token expiring, but only if we can mint
 * a new one on demand — which is exactly the same authenticated endpoint, so
 * the identity always comes from a freshly verified Clerk session.
 */
export function createStreamTokenProvider(
  getClerkToken: () => Promise<string | null>,
  selection: LessonSelection = {},
): () => Promise<string> {
  return async () => {
    const session = await fetchStreamSession(await getClerkToken(), selection);

    return session.token;
  };
}
