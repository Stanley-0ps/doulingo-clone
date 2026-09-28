import { useUser } from "@clerk/expo";
import {
  CallingState,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-native-sdk";

import AudioControls from "@/components/lesson/AudioControls";
import LessonSessionStatus from "@/components/lesson/LessonSessionStatus";
import type { SessionControlsProps } from "@/components/lesson/session";

/**
 * The lesson while its call is live.
 *
 * This has to render *inside* `<StreamCall>` — `useCallStateHooks` reads from
 * the call context, and there is no call to read outside it. The mic badge and
 * the session notice are live SDK state: they follow the real microphone and
 * the real connection, not a local guess.
 *
 * The SDK import above is a normal one, and it is safe because nothing imports
 * *this file* until `getStreamSdk()` has already proved the native module is
 * there. Metro only evaluates a module when it is required, so on a build
 * without WebRTC this file is never loaded and the import never runs. See
 * `lib/stream-native.ts`.
 */
export default function LessonLiveSession({
  cameraOn,
  subtitlesOn,
  onToggleCamera,
  onToggleSubtitles,
  onEndCall,
  onBack,
}: SessionControlsProps) {
  const call = useCall();
  const { useCallCallingState, useMicrophoneState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const { isMute, isSpeakingWhileMuted } = useMicrophoneState();

  const { user } = useUser();
  const name = user?.fullName ?? user?.username ?? "You";

  return (
    <>
      <LessonSessionStatus
        name={name}
        image={user?.imageUrl}
        micOn={!isMute}
        connected={callingState === CallingState.JOINED}
        speakingWhileMuted={isSpeakingWhileMuted}
        notice={noticeFor(callingState, onBack)}
      />

      <AudioControls
        cameraOn={cameraOn}
        micOn={!isMute}
        subtitlesOn={subtitlesOn}
        onToggleCamera={onToggleCamera}
        // The SDK queues device changes until the call is joined, so an early
        // tap is applied rather than dropped.
        onToggleMic={() => void call?.microphone.toggle()}
        onToggleSubtitles={onToggleSubtitles}
        onEndCall={onEndCall}
      />
    </>
  );
}

/** Maps the SDK's connection state onto the one line the learner needs. */
function noticeFor(callingState: CallingState, onBack: () => void) {
  switch (callingState) {
    case CallingState.JOINED:
      return undefined;
    case CallingState.RECONNECTING:
    case CallingState.MIGRATING:
      return {
        tone: "info" as const,
        title: "Reconnecting…",
        message: "Holding your place in the lesson.",
      };
    case CallingState.RECONNECTING_FAILED:
    case CallingState.OFFLINE:
      return {
        tone: "error" as const,
        title: "Connection lost",
        message: "The lesson resumes as soon as you are back online.",
      };
    case CallingState.LEFT:
      return {
        tone: "info" as const,
        title: "Lesson ended",
        message: "Your progress on this lesson has been saved.",
        actionLabel: "Back to lessons",
        onAction: onBack,
      };
    default:
      return {
        tone: "info" as const,
        title: "Connecting…",
        message: "Setting up your lesson with the AI teacher.",
      };
  }
}
