/**
 * POST /api/stream/session
 *
 * The only place the app can get Stream credentials. It answers with an API key
 * and a short-lived user token — never the API secret.
 *
 * The security contract, in order:
 *
 * 1. **Verify the Clerk session first.** No token, no credentials. Nothing below
 *    the `authenticateRequest` call runs for an anonymous request.
 * 2. **The user id comes from the verified session only.** The body cannot
 *    choose who it is; a `userId` field sent by the client is ignored.
 * 3. **The lesson and language are inputs, not credentials.** They select which
 *    room to open, so they are validated against the hardcoded course and then
 *    kept server-side. They are not echoed back in the response.
 *
 * Called twice per lesson: once to connect, and again by the Stream client's
 * token provider when the token is close to expiring.
 */

import { getLanguageById } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import { authenticateRequest } from "@/lib/clerk-server";
import {
  LESSON_CALL_TYPE,
  createLessonCall,
  createUserToken,
  getStreamApiKey,
  lessonCallId,
} from "@/lib/stream-server";
import type { LanguageId } from "@/types/learning";

/** What the app sends. Both fields are optional so the client can connect early. */
type SessionRequest = {
  lessonId?: unknown;
  languageId?: unknown;
};

/** A validated lesson/language pair, or `null` when the client sent nonsense. */
type LessonSelection = {
  lessonId: string;
  languageId: LanguageId;
};

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

/**
 * Check the requested lesson against the course data the server already has.
 *
 * Anything not in `src/data/lessons.ts` is rejected here, so a hand-crafted
 * request cannot open a room for a lesson that does not exist.
 */
function validateSelection(input: SessionRequest): LessonSelection | null {
  const { lessonId, languageId } = input;

  if (typeof lessonId !== "string" || typeof languageId !== "string") {
    return null;
  }

  const lesson = getLessonById(lessonId);

  if (!lesson || lesson.languageId !== languageId) {
    return null;
  }

  if (!getLanguageById(languageId as LanguageId)) {
    return null;
  }

  return { lessonId, languageId: lesson.languageId };
}

/** Never let a malformed body take the route down. */
async function readBody(request: Request): Promise<SessionRequest> {
  try {
    return (await request.json()) as SessionRequest;
  } catch {
    return {};
  }
}

export async function POST(request: Request): Promise<Response> {
  // 1. Who is calling? If we cannot prove it, we stop here.
  const user = await authenticateRequest(request);

  if (!user) {
    return json({ error: "unauthorized" }, 401);
  }

  const selection = validateSelection(await readBody(request));

  // 2. A lesson session needs a real lesson. Connecting without one is allowed
  //    only so the app can warm up the client before a lesson is chosen.
  const callId = selection
    ? await lessonCallId({ ...selection, userId: user.id })
    : null;

  if (selection && callId) {
    // 3. Create the room server-side, owned by the verified user, with the
    //    lesson context kept on the call for the AI teacher session.
    await createLessonCall({ callId, userId: user.id, ...selection });
  }

  // 4. Hand back only what the client needs to connect: the public API key, a
  //    token minted for the verified user, and the room to join.
  return json({
    apiKey: getStreamApiKey(),
    token: createUserToken(user.id),
    userId: user.id,
    userName: user.name,
    userImage: user.imageUrl,
    callType: callId ? LESSON_CALL_TYPE : null,
    callId,
  });
}
