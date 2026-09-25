import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { images } from "@/constants/images";
import { COMPLETED_ACTIVITY_COUNT, type LessonStatus } from "@/data/progress";
import type { Lesson } from "@/types/learning";
import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/06-lesson-screen.png`, converted
 * to points at the reference scale S = 546px / 390pt = 1.4.
 * ------------------------------------------------------------------------ */
const CARD_RADIUS = 14; // 19px
const PADDING_H = 20; // 28px — every line and the status marker stop here
/** Two lines of text plus this much padding top and bottom is the card's 80pt. */
const PADDING_V = 17; // 24px
const MIN_HEIGHT = 80; // 112px — a finished lesson carries no third line
const LABEL_GAP = 9; // "Lesson 3" → the lesson title
const STATUS_GAP = 5; // the lesson title → "In progress" / "0 / 3 activities"
const CHECK_SIZE = 27; // 31px disc
const LOCK_SIZE = 24; // 23×31px, so the outlined lock is the taller of the two
/** The design's marker here is a themed 3D illustration; the mascot stands in. */
const MARKER_SIZE = 40;

/**
 * The violet-leaning slate the design uses for every secondary line — the same
 * one `PlanRow`, `LessonHeader` and the tab bar keep, and noticeably bluer than
 * the design system's neutral `muted`.
 */
const SLATE = "#585E86";

/**
 * Sampled from the design's tick. It is a yellower green than the design
 * system's `success` (#21C16B), which is why it does not reuse that token.
 */
const TICK_GREEN = "#64C039";

/** Fill and border of the lesson the learner is on. */
const ACTIVE_FILL = "#F9F8FD"; // 249,248,253

type LessonCardProps = {
  lesson: Lesson;
  status: LessonStatus;
  onPress: () => void;
};

/**
 * One lesson on the list: which one it is, what it covers, and where the
 * learner stands with it.
 *
 * The three states are the design's, not a locking rule — the card is pressable
 * either way, so a learner can preview any lesson in the unit.
 */
export default function LessonCard({
  lesson,
  status,
  onPress,
}: LessonCardProps) {
  const isActive = status === "in-progress";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Lesson ${lesson.order}: ${lesson.title}`}
      className="flex-row items-center active:opacity-90"
      style={{
        minHeight: MIN_HEIGHT,
        paddingHorizontal: PADDING_H,
        paddingVertical: PADDING_V,
        borderRadius: CARD_RADIUS,
        borderWidth: 1,
        borderColor: isActive ? colors.primary : colors.border,
        backgroundColor: isActive ? ACTIVE_FILL : colors.background,
      }}
    >
      <View className="flex-1">
        <Text
          className="text-[13px] font-poppins-medium"
          style={{ lineHeight: 17, color: isActive ? colors["primary-deep"] : SLATE }}
        >
          Lesson {lesson.order}
        </Text>

        <Text
          numberOfLines={1}
          className="text-[14px] font-poppins-semibold text-ink"
          style={{ marginTop: LABEL_GAP, lineHeight: 18 }}
        >
          {lesson.title}
        </Text>

        {/* A finished lesson carries no third line — the tick says it. */}
        {status === "completed" ? null : (
          <Text
            className={
              isActive
                ? "text-[12px] font-poppins-medium"
                : "text-[11px] font-poppins"
            }
            style={{
              marginTop: STATUS_GAP,
              lineHeight: 15,
              color: isActive ? colors["primary-deep"] : SLATE,
            }}
          >
            {isActive
              ? "In progress"
              : `${COMPLETED_ACTIVITY_COUNT} / ${lesson.activities.length} activities`}
          </Text>
        )}
      </View>

      <View style={{ marginLeft: 12 }}>
        <StatusMarker status={status} />
      </View>
    </Pressable>
  );
}

/** What the right-hand side of the card shows for each state. */
function StatusMarker({ status }: { status: LessonStatus }) {
  if (status === "completed") {
    return (
      <Ionicons name="checkmark-circle" size={CHECK_SIZE} color={TICK_GREEN} />
    );
  }

  if (status === "in-progress") {
    return (
      <Image
        source={images.mascotLogo}
        contentFit="contain"
        style={{ width: MARKER_SIZE, height: MARKER_SIZE }}
      />
    );
  }

  return <Ionicons name="lock-closed-outline" size={LOCK_SIZE} color={SLATE} />;
}
