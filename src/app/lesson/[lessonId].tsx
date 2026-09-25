import { useUser } from "@clerk/expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AudioControls from "@/components/lesson/AudioControls";
import AudioLessonHeader from "@/components/lesson/AudioLessonHeader";
import CaptionBubble from "@/components/lesson/CaptionBubble";
import LessonFeedbackCard from "@/components/lesson/LessonFeedbackCard";
import LessonSubtitles from "@/components/lesson/LessonSubtitles";
import TeacherStage from "@/components/lesson/TeacherStage";
import { images } from "@/constants/images";
import { getLanguageById } from "@/data/languages";
import { getLessonById } from "@/data/lessons";
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
 */
export default function AudioLessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const { user } = useUser();

  // Session state. None of it reaches the network yet — a live agent session
  // will subscribe to these same switches when Stream is wired up.
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [alertsOn, setAlertsOn] = useState(true);
  // The design opens on the caption bubble, which is what subtitles off shows.
  const [subtitlesOn, setSubtitlesOn] = useState(false);

  const lesson = lessonId ? getLessonById(lessonId) : undefined;
  const language = lesson ? getLanguageById(lesson.languageId) : undefined;

  /**
   * Back to the lesson list. The screen is a push from a tab, so it can almost
   * always go back — the replace covers a deep link that arrived with nothing
   * behind it.
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

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <AudioLessonHeader
          title="AI Teacher"
          status="Online"
          xpReward={lesson.xpReward}
          cameraOn={cameraOn}
          alertsOn={alertsOn}
          onToggleCamera={() => setCameraOn((current) => !current)}
          onToggleAlerts={() => setAlertsOn((current) => !current)}
          onBack={leave}
        />

        {/* Grow to fill a tall screen; scroll when a short one cannot fit the
            stage, the subtitles and the controls together. */}
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <TeacherStage
            backdrop={images.mascotWelcome}
            cameraOn={cameraOn}
            selfieUri={user?.imageUrl}
          >
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

            <AudioControls
              cameraOn={cameraOn}
              micOn={micOn}
              subtitlesOn={subtitlesOn}
              onToggleCamera={() => setCameraOn((current) => !current)}
              onToggleMic={() => setMicOn((current) => !current)}
              onToggleSubtitles={() => setSubtitlesOn((current) => !current)}
              onEndCall={leave}
            />
          </TeacherStage>

          <LessonFeedbackCard />

          <View style={{ height: BOTTOM_GAP }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
