/**
 * Stream, server-side only.
 *
 * Two jobs live here, and both need the API secret, which is why this file must
 * never be imported from a screen or a component:
 *
 * 1. minting a **user token** for a verified Clerk user, and
 * 2. creating the **call** the lesson joins.
 *
 * The app only ever receives the API key and a short-lived user token. If you
 * find yourself wanting `getStreamServerClient()` inside `src/app/` or
 * `src/components/`, the call belongs in an API route instead.
 */

import { StreamClient } from "@stream-io/node-sdk";

/** The Stream call type an audio lesson uses. `default` allows audio and video. */
export const LESSON_CALL_TYPE = "default";

/** Teacher sessions are short; four hours covers a long lesson without a re-mint. */
const TOKEN_TTL_SECONDS = 4 * 60 * 60;

let client: StreamClient | undefined;

/** Fail loudly on a missing secret instead of sending `undefined` to Stream. */
function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(
      `Add ${name} to the .env file at the project root. Stream credentials are ` +
        `server secrets — do not prefix them with EXPO_PUBLIC_.`,
    );
  }

  return value;
}

/**
 * The public Stream API key.
 *
 * Safe to hand to the app — it identifies the Stream app, it does not authorize
 * anything on its own. The secret beside it never leaves the server.
 */
export function getStreamApiKey(): string {
  return requireEnv(process.env.STREAM_API_KEY, "STREAM_API_KEY");
}

/**
 * The Stream server client, created once per server process.
 *
 * Lazy on purpose: building it at import time would throw while the bundler is
 * merely collecting routes, before any request has arrived.
 */
export function getStreamServerClient(): StreamClient {
  if (!client) {
    client = new StreamClient(
      getStreamApiKey(),
      requireEnv(process.env.STREAM_API_SECRET, "STREAM_API_SECRET"),
    );
  }

  return client;
}

/**
 * A short-lived token that lets this user connect to Stream.
 *
 * `user_id` must already be the id from the verified Clerk session — see
 * `src/lib/clerk-server.ts`. Never pass a value that came from the client.
 */
export function createUserToken(userId: string): string {
  return getStreamServerClient().generateUserToken({
    user_id: userId,
    validity_in_seconds: TOKEN_TTL_SECONDS,
  });
}

/**
 * The call id for one learner in one lesson.
 *
 * Deterministic, so leaving and re-entering a lesson rejoins the same room
 * instead of spawning a new one.
 *
 * Hashed rather than assembled from its parts: call ids appear in dashboards,
 * logs, and the client's own state, and neither the lesson the learner is on
 * nor their account id needs to be readable there. The server can always
 * recompute the id from the same three inputs, so nothing is lost.
 */
export async function lessonCallId(input: {
  languageId: string;
  lessonId: string;
  userId: string;
}): Promise<string> {
  // Web Crypto is available in the API route's runtime and needs no import,
  // which keeps this module free of Node-only dependencies.
  const bytes = new TextEncoder().encode(
    `${input.languageId}:${input.lessonId}:${input.userId}`,
  );
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const fingerprint = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);

  return `lesson-${fingerprint}`;
}

/**
 * Create the lesson call if it does not exist yet.
 *
 * Created from the server with the verified user id as `created_by_id`, so the
 * learner is a member of a room only they can reach. The settings make the
 * session audio-first: the microphone starts on, the camera starts off, and the
 * teacher's voice plays through the loudspeaker rather than the earpiece.
 *
 * The lesson and language are attached as `custom` data — this is where they
 * are *preserved* for the AI teacher session that will read them later. They
 * stay on the call rather than in the response.
 */
export async function createLessonCall(input: {
  callId: string;
  userId: string;
  lessonId: string;
  languageId: string;
}): Promise<void> {
  const call = getStreamServerClient().video.call(LESSON_CALL_TYPE, input.callId);

  await call.getOrCreate({
    data: {
      created_by_id: input.userId,
      members: [{ user_id: input.userId }],
      custom: {
        lessonId: input.lessonId,
        languageId: input.languageId,
      },
      settings_override: {
        audio: { default_device: "speaker", mic_default_on: true },
        video: { camera_default_on: false, enabled: false },
      },
    },
  });
}
