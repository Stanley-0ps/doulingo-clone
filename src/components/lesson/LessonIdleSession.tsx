import { useUser } from "@clerk/expo";

import AudioControls from "@/components/lesson/AudioControls";
import LessonSessionStatus from "@/components/lesson/LessonSessionStatus";
import type {
  LessonIdlePhase,
  SessionControlsProps,
} from "@/components/lesson/session";

/**
 * The lesson before its call exists, after it ended, or on a build that cannot
 * run Stream at all.
 *
 * Same stage, same controls, same status chip as the live session — the
 * difference is that nothing here is live, so the controls are inert and the
 * chip explains why. This file must never import the Stream SDK: it is what
 * Expo Go renders in place of the call.
 */
export default function LessonIdleSession({
  phase,
  error,
  onRetry,
  onBack,
  cameraOn,
  subtitlesOn,
  onToggleCamera,
  onToggleSubtitles,
  onEndCall,
}: SessionControlsProps & {
  phase: LessonIdlePhase;
  error: Error | undefined;
  onRetry: () => void;
}) {
  const { user } = useUser();
  const name = user?.fullName ?? user?.username ?? "You";

  return (
    <>
      <LessonSessionStatus
        name={name}
        image={user?.imageUrl}
        micOn={false}
        connected={false}
        notice={idleNotice(phase, error, onRetry, onBack)}
      />

      <AudioControls
        cameraOn={cameraOn}
        micOn={false}
        subtitlesOn={subtitlesOn}
        onToggleCamera={onToggleCamera}
        onToggleMic={noop}
        onToggleSubtitles={onToggleSubtitles}
        onEndCall={onEndCall}
      />
    </>
  );
}

function noop() {
  // There is no call to control yet.
}

/** The notice for a session that never started, ended, or cannot run here. */
function idleNotice(
  phase: LessonIdlePhase,
  error: Error | undefined,
  onRetry: () => void,
  onBack: () => void,
) {
  // Not a failure to retry: the native module is missing from the build itself,
  // so the way out is a development build, not another attempt.
  if (phase === "unavailable") {
    return {
      tone: "error" as const,
      title: "Development build required",
      message:
        "A live lesson runs on Stream's audio engine, which is native code Expo Go does not include. It works in a development build of this app.",
      actionLabel: "Back to lessons",
      onAction: onBack,
    };
  }

  if (phase === "failed") {
    return {
      tone: "error" as const,
      title: "Lesson unavailable",
      message: error?.message ?? "The lesson could not be started.",
      actionLabel: "Try again",
      onAction: onRetry,
    };
  }

  if (phase === "ended") {
    return {
      tone: "info" as const,
      title: "Lesson ended",
      message: "Your progress on this lesson has been saved.",
      actionLabel: "Back to lessons",
      onAction: onBack,
    };
  }

  return {
    tone: "info" as const,
    title: "Connecting…",
    message: "Setting up your lesson with the AI teacher.",
  };
}
