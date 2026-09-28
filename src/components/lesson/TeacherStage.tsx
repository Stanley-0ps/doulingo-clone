import { Image } from "expo-image";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/07-audio-lesson-screen.png`,
 * converted to points at the reference scale S = 652px / 390pt = 1.6718.
 *
 * The design's stage is 566pt tall because its canvas is a 972pt-tall phone.
 * Here it takes whatever height is left between the header and the feedback
 * card, so the lesson controls stay above the fold on a real device.
 * ------------------------------------------------------------------------ */
const INSET = 10; // the stage runs wider than everything else on the page
const RADIUS = 24; // 40px
/** Controls → the stage's bottom edge. */
const BOTTOM_INSET = 23;
/** The teacher's line → the controls. */
const STACK_GAP = 32;
/**
 * The shortest the stage may get. A short phone cannot fit the stage, the
 * subtitles and the controls at once, and the screen scrolls rather than
 * cropping the top of the teacher's card.
 */
const MIN_HEIGHT = 320;

/**
 * The mascot's ink — ears to paws — sits 3.9% below the centre of its square
 * canvas, so a contained fit reads low in the stage. `app/onboarding.tsx` corrects
 * the same asset the same way.
 */
const MASCOT_INK_OFFSET = 0.039;

type TeacherStageProps = {
  /** The teacher's "video feed" — a still stands in until Stream is wired up. */
  backdrop: ComponentProps<typeof Image>["source"];
  /** The teacher's line and the lesson controls, stacked at the bottom. */
  children: ReactNode;
};

/**
 * The stage the lesson plays on: a wide, rounded panel holding the teacher's
 * feed and — anchored to the bottom — everything the learner interacts with.
 *
 * Nothing here talks to Stream yet, so the feed is the app's mascot rather than
 * a live track. There is no self-view: the lesson is audio only.
 */
export default function TeacherStage({ backdrop, children }: TeacherStageProps) {
  // The nudge is a share of the fitted image, and `contain` fits the square
  // asset to the stage's shorter side — so the stage has to be measured.
  const [stage, setStage] = useState({ width: 0, height: 0 });
  const fittedSide = Math.min(stage.width, stage.height);

  return (
    <View
      className="flex-1"
      onLayout={(event) => setStage(event.nativeEvent.layout)}
      style={{
        marginHorizontal: INSET,
        minHeight: MIN_HEIGHT,
        borderRadius: RADIUS,
        backgroundColor: colors.surface,
        overflow: "hidden",
      }}
    >
      <Image
        source={backdrop}
        contentFit="contain"
        accessibilityLabel="Your AI teacher"
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ translateY: -fittedSide * MASCOT_INK_OFFSET }] },
        ]}
      />

      <View
        className="flex-1 justify-end"
        style={{ paddingBottom: BOTTOM_INSET, gap: STACK_GAP }}
      >
        {children}
      </View>
    </View>
  );
}
