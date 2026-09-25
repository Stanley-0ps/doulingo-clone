import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/06-lesson-screen.png`, converted
 * to points at the reference scale S = 546px / 390pt = 1.4.
 * ------------------------------------------------------------------------ */
const HEIGHT = 56; // 78px
const RADIUS = 28; // a full pill
const GUTTER = 15; // 21px — the control sits wider than the lesson cards
/** Overlaps the hero: the control's top is 52pt above the illustration's foot. */
const HERO_OVERLAP = -52;
const BAR_HEIGHT = 6; // 8px
const BAR_INSET = 3;

/**
 * The track's fill. The design fades it from a lavender grey at the top to
 * almost white at the bottom; a solid sits in between, which keeps the control
 * readable without pulling in a gradient.
 */
const TRACK_COLOR = "#F0ECF2";

/**
 * The violet-leaning slate the inactive tab shares with the rest of the
 * design's secondary text.
 */
const SLATE = "#585E86";

export type LessonTab = "lessons" | "practice";

const TABS: { key: LessonTab; label: string }[] = [
  { key: "lessons", label: "Lessons" },
  { key: "practice", label: "Practice" },
];

type LessonTabsProps = {
  value: LessonTab;
  onChange: (tab: LessonTab) => void;
};

/**
 * The Lessons / Practice switch sitting across the bottom of the hero.
 *
 * The active half is a white pill with a purple rule under it; the other half
 * shows the track through.
 */
export default function LessonTabs({ value, onChange }: LessonTabsProps) {
  return (
    <View
      className="flex-row"
      style={{
        height: HEIGHT,
        marginHorizontal: GUTTER,
        marginTop: HERO_OVERLAP,
        borderRadius: RADIUS,
        backgroundColor: TRACK_COLOR,
      }}
    >
      {TABS.map((tab) => {
        const active = tab.key === value;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className="flex-1 items-center justify-center"
            style={{ borderRadius: RADIUS }}
          >
            {active ? (
              <>
                <View
                  className="absolute inset-0 bg-white"
                  style={{ borderRadius: RADIUS }}
                />
                <View
                  style={{
                    position: "absolute",
                    left: BAR_INSET,
                    right: BAR_INSET,
                    bottom: 0,
                    height: BAR_HEIGHT,
                    borderRadius: BAR_HEIGHT / 2,
                    backgroundColor: colors["primary-deep"],
                  }}
                />
              </>
            ) : null}

            <Text
              className="text-[15px] font-poppins-semibold"
              style={{ color: active ? colors["primary-deep"] : SLATE }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
