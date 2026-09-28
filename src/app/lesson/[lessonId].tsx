import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, type ComponentType } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AudioLessonHeader from "@/components/lesson/AudioLessonHeader";
import CaptionBubble from "@/components/lesson/CaptionBubble";
import LessonFeedbackCard from "@/components/lesson/LessonFeedbackCard";
import LessonIdleSession from "@/components/lesson/LessonIdleSession";
import LessonSubtitles from "@/components/lesson/LessonSubtitles";
import TeacherStage from "@/components/lesson/TeacherStage";
import type {
  LessonIdlePhase,
  SessionControlsProps,
} from "@/components/lesson/session";
import { images } from "@/constants/images";
import { getLanguageById } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
import { useLessonCall, type LessonCallPhase } from "@/hooks/useLessonCall";
import { getStreamSdk } from "@/lib/stream-native";
import { colors } from "@/theme";
import type { Phrase } from "@/types/learning";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/07-audio-lesson-screen.png`,
 * converted to points at the reference scale S = 652px / 390pt = 1.6718.
 * ------------------------------------------------------------------------ */
/**
 * The feedback card → the bottom of the screen. The design's 15pt to a floating
 * tab bar is the starting point, but the bar is gone here: the lesson covers it,
 * and the home indicator underneath is already cleared by the safe area.
 */
const BOTTOM_GAP = 20;

/** The design's online dot, shared with the lesson list's completion tick. */
const TICK_GREEN = "#64C039";

/** The violet-leaning slate the header's secondary line uses. */
const SLATE = "#585E86";

let liveSession: ComponentType<SessionControlsProps> | undefined;

/**
 * The live session, loaded only on a build that can actually run it.
 *
 * `LessonLiveSession` imports the Stream SDK at the top of its file, so requiring
 * it where the native module is missing would throw. Metro evaluates a module
 * the first time it is required, so hiding the require behind the guard below is
 * what keeps this screen — and the app — renderable in Expo Go.
 */
function loadLiveSession(): ComponentType<SessionControlsProps> | undefined {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  liveSession ??= require("@/components/lesson/LessonLiveSession").default;
  return liveSession;
}

/** The idle session has no `ready` of its own — a joined call that left is `ended`. */
function idlePhase(phase: LessonCallPhase): LessonIdlePhase {
  return phase === "ready" ? "ended" : phase;
}

// Resolved once, when this screen is first navigated to. Both are module-level so
// they keep a stable identity across renders — a component rebuilt on every
// render would remount the whole session subtree each time.
const sdk = getStreamSdk();
const LiveSession = sdk ? loadLiveSession() : undefined;

/**
 * The AI Teacher's audio lesson.
 *
 * It is audio only: the teacher is the app's mascot rather than a video track,
 * and everything that runs the session — mic, subtitles, end call — is laid out
 * over the bottom of the stage.
 *
 * The screen lives above the tabs rather than inside them, so nothing sits
 * under the lesson; the swipe back returns to wherever it was opened from. The
 * sign-in and course gates are in `app/lesson/_layout.tsx`, and the lesson id
 * arrives from the Learn screen.
 *
 * Opening the screen joins a real Stream audio call. `useLessonCall` runs the
 * handshake: it asks our API route for credentials, then joins the room the
 * server opened for this learner and this lesson.
 */
export default function AudioLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();

  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const language = lesson ? getLanguageById(lesson.languageId) : undefined;

  // The camera starts off: the lesson is audio only, and the call is created
  // server-side with `camera_default_on: false` to match.
  const [cameraOn, setCameraOn] = useState(false);
  const [alertsOn, setAlertsOn] = useState(true);
  // The design opens on the caption bubble, which is what subtitles off shows.
  const [subtitlesOn, setSubtitlesOn] = useState(false);

  const { call, phase, error, retry, endCall } = useLessonCall({
    lessonId: lessonId ?? "",
    languageId: lesson?.languageId ?? "",
  });

  /**
   * Back to the lesson list. The screen is a push from a tab, so it can almost
   * always go back — the replace covers a deep link that arrived with nothing
   * behind it. Also used by "End Call" once the session is over.
   */
  const leave = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/learn");
    }
  };

  if (!lesson || !language) {
    return (
      <View className="flex-1 bg-white">
        <SafeAreaView style={{ flex: 1 }}>
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-center text-h3 text-ink">
              This lesson is not available
            </Text>
            <Text className="mt-2 text-center text-body text-muted">
              It may have been moved or renamed since you last opened it.
            </Text>
            <Pressable
              onPress={leave}
              accessibilityRole="button"
              className="mt-6 items-center rounded-btn bg-primary px-8 py-3 active:opacity-85"
            >
              <Text className="text-[16px] font-poppins-semibold text-white">
                Back to lessons
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  /** The teacher opens on the lesson's first phrase — typed, but hardcoded. */
  const openingPhrase: Phrase | undefined = lesson.phrases[0];

  /**
   * The camera is the one control the screen has to own: its disc appears twice
   * — here in the header and again over the stage — and both have to agree. The
   * call still does the work; `?.` covers the moment before it exists.
   */
  const toggleCamera = () => {
    setCameraOn((current) => !current);
    void call?.camera.toggle();
  };

  const sessionControls = {
    cameraOn,
    subtitlesOn,
    onToggleCamera: toggleCamera,
    onToggleSubtitles: () => setSubtitlesOn((current) => !current),
    onEndCall: endCall,
    onBack: leave,
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <AudioLessonHeader
          title="AI Teacher"
          status={headerStatus(phase)}
          statusColor={headerStatusColor(phase)}
          xpReward={lesson.xpReward}
          cameraOn={cameraOn}
          alertsOn={alertsOn}
          onToggleCamera={toggleCamera}
          onToggleAlerts={() => setAlertsOn((current) => !current)}
          onBack={leave}
        />

        {/* Grow to fill a tall screen; scroll when a short one cannot fit the
            stage, the subtitles and the controls together. */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <TeacherStage backdrop={images.mascotWelcome}>
            {subtitlesOn ? (
              <LessonSubtitles
                eyebrow={`${language.name} · Lesson ${lesson.order}`}
                title={lesson.title}
                goal={lesson.goals.summary}
                phrases={lesson.phrases}
              />
            ) : openingPhrase ? (
              <CaptionBubble
                line={openingPhrase.text}
                translation={openingPhrase.translation}
              />
            ) : null}

            {/* `StreamCall` is a context provider, not a container — it adds no
                view, so the stage's layout is exactly what it was. It is only
                mounted once the call exists, which is why the two branches
                below are separate components rather than one with a flag. */}
            {sdk && call && LiveSession ? (
              <sdk.StreamCall call={call}>
                <LiveSession {...sessionControls} />
              </sdk.StreamCall>
            ) : (
              <LessonIdleSession
                {...sessionControls}
                phase={idlePhase(phase)}
                error={error}
                onRetry={retry}
              />
            )}
          </TeacherStage>

          <LessonFeedbackCard />

          <View style={{ height: BOTTOM_GAP }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/**
 * The header's session line. It reports the session's life cycle — the live
 * details (muted, reconnecting) are the chip's job over the stage, because only
 * the call itself knows them.
 */
function headerStatus(phase: LessonCallPhase) {
  switch (phase) {
    case "ready":
      return "Online";
    case "failed":
      return "Unavailable";
    case "ended":
      return "Ended";
    case "unavailable":
      return "Needs a dev build";
    default:
      return "Connecting…";
  }
}

/** The design's green dot means "Online"; the other states get their own tone. */
function headerStatusColor(phase: LessonCallPhase) {
  switch (phase) {
    case "ready":
      return TICK_GREEN;
    case "failed":
    case "unavailable":
      return colors.error;
    case "ended":
      return SLATE;
    default:
      return colors.warning;
  }
}
