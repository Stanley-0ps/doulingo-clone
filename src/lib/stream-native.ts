/**
 * The Stream Video SDK, loaded only if this build can actually run it.
 *
 * The SDK needs `@stream-io/react-native-webrtc`, which is native code. Expo Go
 * does not ship it, and importing the package there throws *at import time* —
 * before any of our code runs. A plain `import` at the top of a file would
 * therefore take the whole app down on launch, not just the lesson screen.
 *
 * So nothing imports the package directly. Everything goes through
 * `getStreamSdk`, which requires it once, on first use, and remembers whether
 * that worked. Metro evaluates a module when it is first `require`d, so the
 * failure happens here, inside a `try`, instead of on the startup path.
 */

import type * as StreamVideoSdk from "@stream-io/video-react-native-sdk";

export type StreamSdk = typeof StreamVideoSdk;

let cached: StreamSdk | null | undefined;

/**
 * The SDK, or `null` when this build has no native WebRTC module.
 *
 * The answer never changes over the life of the app, so it is safe to branch on
 * in render — but call it *before* any of the SDK's hooks, never conditionally
 * between them.
 */
export function getStreamSdk(): StreamSdk | null {
  if (cached === undefined) {
    try {
      // The `require` is the point: an `import` would be hoisted and evaluated
      // on startup, which is the crash this file exists to avoid.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      cached = require("@stream-io/video-react-native-sdk") as StreamSdk;
    } catch {
      cached = null;
    }
  }

  return cached;
}

/** True when this build can join a live lesson. False in Expo Go. */
export function isStreamVideoAvailable(): boolean {
  return getStreamSdk() !== null;
}
