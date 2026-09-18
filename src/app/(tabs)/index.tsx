import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ContinueLearningCard from "@/components/home/ContinueLearningCard";
import DailyGoalCard from "@/components/home/DailyGoalCard";
import HomeHeader from "@/components/home/HomeHeader";
import PlanRow from "@/components/home/PlanRow";
import { getTodayPlan } from "@/data/home";
import { getLanguageById } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";

/* ---------------------------------------------------------------------------
 * Design grid
 *
 * Measured off `prompt_material/05-home-and-tab-navigation.png`, converted to
 * points at the reference scale S = 520px / 390pt = 1.3333. Values ride in
 * `style` rather than as arbitrary Tailwind classes because a class name has to
 * be a static string — NativeWind cannot read a value out of a constant.
 * ------------------------------------------------------------------------ */
const SCREEN_PADDING = 24; // 32px — every card and the header share this gutter
const HEADER_TOP = 20; // safe area → the header row
const HEADER_CARD_GAP = 25; // header → the daily goal card
const CARD_GAP = 20; // daily goal → continue learning
const SECTION_GAP = 23; // continue learning → "Today's plan"
/**
 * The gap below "Today's plan" is measured to the *box* around the heading, not
 * to the artwork: each plan row is a 65pt slot with a 40pt tile centred inside
 * it, so the stack carries 12.5pt of its own padding before the first tile
 * shows.
 */
const LIST_GAP = 12; // "Today's plan" → the row stack

/**
 * Home tab.
 *
 * The learner's day in one screen: what they have earned so far, the course
 * they are part-way through, and the three things today's plan asks of them.
 *
 * Sign-in and course gates live in the tab layout, so this screen can assume
 * both are satisfied.
 */
export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const selectedLanguageId = useLanguageStore(
    (state) => state.selectedLanguageId,
  );
  const language = selectedLanguageId
    ? getLanguageById(selectedLanguageId)
    : undefined;

  if (!language) {
    return null;
  }

  const plan = getTodayPlan(language.id);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        {/* The measured design is taller than a phone viewport, so the page
            scrolls. The bottom padding is the same gutter the cards keep on the
            sides, so the last plan row sits off the tab bar rather than against
            it. */}
        <ScrollView
          contentContainerClassName="grow"
          contentContainerStyle={{
            paddingHorizontal: SCREEN_PADDING,
            paddingTop: HEADER_TOP,
            paddingBottom: SCREEN_PADDING,
          }}
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader
            greeting={language.greeting}
            firstName={user?.firstName ?? "there"}
            flagUri={language.flag}
            streakDays={plan?.streakDays ?? 0}
          />

          {plan ? (
            <>
              <View style={{ marginTop: HEADER_CARD_GAP }}>
                <DailyGoalCard
                  earnedXp={plan.earnedXp}
                  goalXp={plan.goalXp}
                  progress={plan.progress}
                />
              </View>

              <View style={{ marginTop: CARD_GAP }}>
                <ContinueLearningCard
                  languageName={language.name}
                  level={plan.unit.level}
                  unitOrder={plan.unit.order}
                  onPress={() => router.push("/learn")}
                />
              </View>

              <View
                className="flex-row items-center justify-between"
                style={{ marginTop: SECTION_GAP }}
              >
                <Text className="text-[14px] font-poppins-semibold leading-[1.4] text-ink">
                  Today&apos;s plan
                </Text>
                <Pressable
                  onPress={() => router.push("/learn")}
                  accessibilityRole="button"
                  className="active:opacity-60"
                >
                  <Text className="text-[14px] font-poppins-semibold leading-[1.4] text-primary-deep">
                    View all
                  </Text>
                </Pressable>
              </View>

              {/* The rows carry their own height and spacing, so the gap above
                  the list is the heading's margin rather than a wrapper's. */}
              <View style={{ marginTop: LIST_GAP }}>
                {plan.steps.map((step) => (
                  <PlanRow key={step.id} step={step} />
                ))}
              </View>
            </>
          ) : (
            /* No lessons to plan around — German ships as a selectable language
               with no units yet. The header still greets the learner, so the
               way out is to pick a course that has content. */
            <View
              className="items-center rounded-card border border-border px-6 py-10"
              style={{ marginTop: HEADER_CARD_GAP }}
            >
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
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
