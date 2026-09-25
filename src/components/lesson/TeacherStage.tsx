import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import type { ComponentProps, ReactNode } from "react";
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
/** The self-view is pinned the same distance in from the top and right. */
const SELFIE_INSET = 16;
const SELFIE_WIDTH = 95;
const SELFIE_HEIGHT = 143;
const SELFIE_RADIUS = 10;
const SELFIE_BORDER = 2;
/** The learner's own video sits above the bottom stack, never behind it. */
const SELFIE_ICON = 30;
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

type TeacherStageProps = {
  /** The teacher's "video feed" — a still stands in until Stream is wired up. */
  backdrop: ComponentProps<typeof Image>["source"];
  /** Camera off hides the self-view tile entirely. */
  cameraOn: boolean;
  /** The learner's avatar. Falls back to a neutral placeholder. */
  selfieUri?: string;
  /** The teacher's line and the lesson controls, stacked at the bottom. */
  children: ReactNode;
};

/**
 * The stage the lesson plays on: a wide, rounded panel holding the teacher's
 * feed, the learner's self-view, and — anchored to the bottom — everything the
 * learner interacts with.
 *
 * Nothing here talks to Stream yet, so the feed is the app's mascot rather than
 * a live track.
 */
export default function TeacherStage({
  backdrop,
  cameraOn,
  selfieUri,
  children,
}: TeacherStageProps) {
  return (
    <View
      className="flex-1"
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
        style={StyleSheet.absoluteFill}
      />

      {cameraOn ? (
        <View
          style={{
            position: "absolute",
            top: SELFIE_INSET,
            right: SELFIE_INSET,
            width: SELFIE_WIDTH,
            height: SELFIE_HEIGHT,
            borderRadius: SELFIE_RADIUS,
            borderWidth: SELFIE_BORDER,
            borderColor: colors.background,
            backgroundColor: colors.surface,
            overflow: "hidden",
          }}
        >
          {selfieUri ? (
            <Image
              source={{ uri: selfieUri }}
              contentFit="cover"
              accessibilityLabel="Your camera"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            /* Signed in without a profile picture — a neutral head stands in. */
            <View className="flex-1 items-center justify-center">
              <Ionicons name="person" size={SELFIE_ICON} color="#C7CBDA" />
            </View>
          )}
        </View>
      ) : null}

      <View
        className="flex-1 justify-end"
        style={{ paddingBottom: BOTTOM_INSET, gap: STACK_GAP }}
      >
        {children}
      </View>
    </View>
  );
}
