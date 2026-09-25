import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import LessonCard from "@/components/lesson/LessonCard";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonTabs, { type LessonTab } from "@/components/lesson/LessonTabs";
import { images } from "@/constants/images";
import { getLanguageById } from "@/data/languages";
import { getLessonStatus, getUnitProgress } from "@/data/progress";
import { useLanguageStore } from "@/store/languageStore";
import type { Lesson } from "@/types/learning";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/06-lesson-screen.png`, converted
 * to points at the reference scale S = 546px / 390pt = 1.4.
 *
 * Values ride in `style` rather than as arbitrary Tailwind classes because a
 * class name has to be a static string — NativeWind cannot read a constant.
 * ------------------------------------------------------------------------ */
const GUTTER = 19; // 26px — the header text and every lesson card
const HERO_GAP = 20; // header → the illustration
const HERO_HEIGHT = 246; // 344px, full bleed: the design gives it no radius
const LIST_GAP = 17; // the tab control → the first lesson
const CARD_GAP = 6; // lesson → lesson

/**
 * Learn tab — the unit the learner is working through.
 *
 * The hero and the header follow the lesson they are on, and tapping a card
 * opens it: the lesson runs on its own screen, on top of the tabs, so this list
 * keeps showing where the learner stands. Nothing is locked, so every card is
 * tappable.
 *
 * Sign-in and course gates live in the tab layout, so this screen can assume
 * the learner has picked a language.
 */
export default function LearnScreen() {
  const router = useRouter();

  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const [tab, setTab] = useState<LessonTab>("lessons");

  const language = selectedLanguageId
    ? getLanguageById(selectedLanguageId)
    : undefined;

  if (!language) {
    return null;
  }

  const progress = getUnitProgress(language.id);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        {progress ? (
          <ScrollView
            contentContainerStyle={{ paddingBottom: GUTTER }}
            showsVerticalScrollIndicator={false}
          >
            <LessonHero
              selected={progress.currentLesson}
              unitOrder={progress.unit.order}
              reachedCount={progress.reachedCount}
              totalLessons={progress.totalLessons}
              tab={tab}
              onTabChange={setTab}
              onBack={() => {
                // The tab has no screen above it when it is opened from the tab
                // bar, so there is only something to go back to sometimes.
                if (router.canGoBack()) {
                  router.back();
                }
              }}
            />

            {tab === "lessons" ? (
              <View
                style={{ paddingHorizontal: GUTTER, marginTop: LIST_GAP }}
              >
                {progress.lessons.map((lesson) => (
                  <View key={lesson.id} style={{ marginBottom: CARD_GAP }}>
                    <LessonCard
                      lesson={lesson}
                      status={getLessonStatus(
                        lesson,
                        progress.completedCount,
                      )}
                      onPress={() => router.push(`/lesson/${lesson.id}`)}
                    />
                  </View>
                ))}
              </View>
            ) : (
              /* Nothing to practise yet: the activities live inside a lesson
                 and the player that runs them does not exist. */
              <View
                className="items-center rounded-card border border-border px-6 py-10"
                style={{ marginHorizontal: GUTTER, marginTop: LIST_GAP }}
              >
                <Text className="text-center text-h3 text-ink">
                  Practice is on its way
                </Text>
                <Text className="mt-2 text-center text-body text-muted">
                  Soon you will be able to rehearse this unit&apos;s words and
                  phrases without working through a whole lesson.
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          /* No content to teach — German is selectable on the language screen
             but ships with no units yet. */
          <View style={{ paddingHorizontal: GUTTER, paddingTop: GUTTER }}>
            <View className="items-center rounded-card border border-border px-6 py-10">
              <Text className="text-center text-h3 text-ink">
                {language.name} is on its way
              </Text>
              <Text className="mt-2 text-center text-body text-muted">
                We are still writing this course. In the meantime, pick one of
                the languages that is ready.
              </Text>
              <Pressable
                onPress={() => router.push("/languages")}
                accessibilityRole="button"
                className="mt-6 items-center rounded-btn bg-primary px-8 py-3 active:opacity-85"
              >
                <Text className="text-[16px] font-poppins-semibold text-white">
                  Choose a language
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

type LessonHeroProps = {
  /** The lesson the header and illustration follow. */
  selected: Lesson;
  unitOrder: number;
  reachedCount: number;
  totalLessons: number;
  tab: LessonTab;
  onTabChange: (tab: LessonTab) => void;
  onBack: () => void;
};

/**
 * Everything above the lesson list — header, illustration, and the tab control
 * that overlaps the illustration's foot.
 */
function LessonHero({
  selected,
  unitOrder,
  reachedCount,
  totalLessons,
  tab,
  onTabChange,
  onBack,
}: LessonHeroProps) {
  return (
    <>
      <View style={{ paddingHorizontal: GUTTER }}>
        <LessonHeader
          title={selected.title}
          unitOrder={unitOrder}
          reachedCount={reachedCount}
          totalLessons={totalLessons}
          onBack={onBack}
        />
      </View>

      <Image
        source={artworkSource(selected)}
        contentFit="cover"
        accessibilityLabel={`${selected.title} illustration`}
        style={{ width: "100%", height: HERO_HEIGHT, marginTop: HERO_GAP }}
      />

      <LessonTabs value={tab} onChange={onTabChange} />
    </>
  );
}

/**
 * A lesson's artwork, ready for `<Image>`. The data says whether the
 * illustration is a bundled asset or a remote placeholder; only the lesson
 * object knows which lesson it belongs to.
 */
function artworkSource(lesson: Lesson) {
  return lesson.artwork.kind === "asset"
    ? images[lesson.artwork.name]
    : { uri: lesson.artwork.uri };
}
