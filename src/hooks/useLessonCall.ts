import { useAuth } from "@clerk/expo";
import type { Call } from "@stream-io/video-react-native-sdk";
import { useCallback, useEffect, useRef, useState } from "react";

import { useStreamClient } from "@/components/StreamVideoProvider";
import { fetchStreamSession } from "@/lib/stream";
import { getStreamSdk, isStreamVideoAvailable } from "@/lib/stream-native";

/**
 * Where the lesson is in its life cycle.
 *
 * `ready` means the call exists and has been joined — the *live* details (is the
 * mic on, are we reconnecting) come from the SDK's own hooks inside
 * `<StreamCall>`, which is the only place they can be read.
 *
 * `unavailable` is the odd one out: the build itself has no Stream native
 * module, so there is no call to make and no retry that would help.
 */
export type LessonCallPhase =
  | "connecting"
  | "ready"
  | "failed"
  | "ended"
  | "unavailable";

type UseLessonCallOptions = {
  lessonId: string;
  languageId: string;
};

type UseLessonCallResult = {
  /** Pass to `<StreamCall>` once it exists; `undefined` while connecting. */
  call: Call | undefined;
  phase: LessonCallPhase;
  error: Error | undefined;
  /** Connect and join again after a failure. */
  retry: () => void;
  /** Leave the call and stay on the screen in its `ended` state. */
  endCall: () => void;
};

/**
 * Joins this learner to their lesson's audio call.
 *
 * The whole handshake happens in two steps, and the split matters:
 *
 * 1. `fetchStreamSession` asks our own API route for credentials. The route
 *    verifies the Clerk session, opens the call server-side, and answers with
 *    an API key, a token, and the room. The app never sees the API secret.
 * 2. `client.call(...)` + `join()` connects to that room over Stream.
 *
 * Leaving is deliberately careful. `leave()` throws if the call is already left,
 * and cleanup runs on every remount, so the guard below is what stops a
 * navigation away from turning into a red screen.
 */
export function useLessonCall({
  lessonId,
  languageId,
}: UseLessonCallOptions): UseLessonCallResult {
  const { client, error: connectionError, reconnect } = useStreamClient();
  const { getToken } = useAuth();
  // Needed for `CallingState`, which is a runtime value, not a type — importing
  // it directly is exactly what crashes a build without the native module.
  const sdk = getStreamSdk();
  const [attempt, setAttempt] = useState(0);
  const [call, setCall] = useState<Call>();
  const [error, setError] = useState<Error>();
  const [phase, setPhase] = useState<LessonCallPhase>("connecting");

  // Clerk may hand back a new `getToken` between renders; reading it through a
  // ref keeps the join effect keyed on the lesson rather than on the function.
  const getTokenRef = useRef(getToken);
  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  useEffect(() => {
    // The root provider owns the client. Until it has one there is nothing to
    // join; the returned values below report that state instead of copying it
    // into more state here.
    if (!client) {
      return;
    }

    let cancelled = false;
    let joined: Call | undefined;
    // Narrowed copy: TypeScript cannot carry the `!client` check above into the
    // async function below, and this is the value the closure actually needs.
    const streamClient = client;

    async function join() {
      setPhase("connecting");
      setError(undefined);

      try {
        const session = await fetchStreamSession(await getTokenRef.current(), {
          lessonId,
          languageId,
        });

        if (cancelled) {
          return;
        }

        if (!session.callId || !session.callType) {
          throw new Error("The lesson server did not return a room to join.");
        }

        // `reuseInstance` returns the same `Call` on a second visit, so coming
        // back to a lesson rejoins the room instead of opening a second one.
        const activeCall = streamClient.call(session.callType, session.callId, {
          reuseInstance: true,
        });
        joined = activeCall;
        setCall(activeCall);

        await activeCall.join();

        if (cancelled) {
          return;
        }

        // The lesson is audio only: the call starts with the camera off, and
        // this makes sure no video track is published if it ever starts on.
        await activeCall.camera.disable().catch(() => undefined);

        setPhase("ready");
      } catch (cause) {
        if (cancelled) {
          return;
        }

        setError(
          cause instanceof Error
            ? cause
            : new Error("Could not join the lesson."),
        );
        setPhase("failed");
      }
    }

    void join();

    return () => {
      cancelled = true;
      setCall(undefined);

      if (
        sdk &&
        joined &&
        joined.state.callingState !== sdk.CallingState.LEFT
      ) {
        joined.leave().catch(() => undefined);
      }
    };
  }, [attempt, client, languageId, lessonId, sdk]);

  const retry = useCallback(() => {
    setError(undefined);
    setPhase("connecting");

    // Only the provider can fix a missing client. A failed *join* just needs
    // another attempt against the client we already have.
    if (!client) {
      reconnect();
    }

    setAttempt((value) => value + 1);
  }, [client, reconnect]);

  const endCall = useCallback(() => {
    setPhase("ended");

    if (sdk && call && call.state.callingState !== sdk.CallingState.LEFT) {
      call.leave().catch(() => undefined);
    }
  }, [call, sdk]);

  // No native module in this build, so there is no client and no join to report
  // on — and no retry that would change it.
  if (!isStreamVideoAvailable()) {
    return {
      call: undefined,
      phase: "unavailable",
      error: undefined,
      retry,
      endCall,
    };
  }

  // Without a client there is no join to report on, so the provider's own state
  // is the answer. Derived rather than stored: copying it into `phase` would
  // mean a second render and two places that could disagree.
  const hasClient = Boolean(client);

  return {
    call,
    phase: hasClient ? phase : connectionError ? "failed" : "connecting",
    error: hasClient ? error : connectionError,
    retry,
    endCall,
  };
}
