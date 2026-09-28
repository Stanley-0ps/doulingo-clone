/**
 * What the two lesson sessions share.
 *
 * `LessonLiveSession` and `LessonIdleSession` render the same controls and the
 * same status chip from the same props — the only difference is whether the
 * call is real. They live in separate files because the live one imports the
 * Stream SDK and the idle one must not: in Expo Go that import throws, and the
 * idle session is exactly what renders there instead.
 */

/** The switches that run the lesson. The screen owns them, so the header's copy
 * of each toggle and the disc over the stage always agree. */
export type SessionControlsProps = {
  cameraOn: boolean;
  subtitlesOn: boolean;
  onToggleCamera: () => void;
  onToggleSubtitles: () => void;
  onEndCall: () => void;
  /** Leave the lesson screen — the way out once a session is over. */
  onBack: () => void;
};

/**
 * Why there is no live call.
 *
 * `connecting` and `failed` are the handshake going right and wrong;
 * `ended` is a session the learner finished; `unavailable` is a build that
 * cannot run the SDK at all, which retrying will never fix.
 */
export type LessonIdlePhase = "connecting" | "failed" | "ended" | "unavailable";
