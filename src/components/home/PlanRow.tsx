import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import type { PlanStep, PlanStepId } from "@/data/home";

/* ---------------------------------------------------------------------------
 * Design grid — same reference frame as the rest of the home screen:
 * S = 520px / 390pt = 1.3333.
 * ------------------------------------------------------------------------ */
const ROW_HEIGHT = 65; // 87px — the pitch between two rows
const TILE_SIZE = 40; // 53px rounded square
const TILE_RADIUS = 10; // 13px
const TEXT_GAP = 25; // tile → the row's first line
const LINE_GAP = 5; // first line → second line
const CHECK_SIZE = 22; // 30px circle, centred on the tile

/**
 * Two greys the design sheet has no token for. The ring is a violet-leaning
 * grey and the subtitle a violet-leaning slate — both noticeably bluer than the
 * design system's neutral `muted`, which is why neither reuses it. `TabBar`
 * keeps its own inactive grey for the same reason.
 */
const OUTLINE_COLOR = "#B0B2C0";
const SUBTITLE_COLOR = "#585E86";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Each step of the day gets its own tile: what the learner does, and the colour
 * it reads as. Vocabulary is coral rather than purple so the third row does not
 * disappear into the two above it.
 */
const STEP_APPEARANCE: Record<
  PlanStepId,
  { icon: IoniconName; tileClassName: string }
> = {
  lesson: { icon: "book", tileClassName: "bg-primary" },
  conversation: { icon: "headset", tileClassName: "bg-primary" },
  vocabulary: { icon: "chatbox-ellipses", tileClassName: "bg-[#ED7570]" },
};

type PlanRowProps = {
  step: PlanStep;
};

/**
 * One line of today's plan: what it is, what today's version of it covers, and
 * whether it is done.
 */
export default function PlanRow({ step }: PlanRowProps) {
  const { icon, tileClassName } = STEP_APPEARANCE[step.id];

  return (
    <View className="flex-row items-center" style={{ height: ROW_HEIGHT }}>
      <View
        className={`items-center justify-center ${tileClassName}`}
        style={{
          width: TILE_SIZE,
          height: TILE_SIZE,
          borderRadius: TILE_RADIUS,
        }}
      >
        <Ionicons name={icon} size={20} color="#FFFFFF" />
      </View>

      {/* The two lines are centred against the tile rather than against the
          row, so they stay put as the subtitle's length changes. */}
      <View className="flex-1" style={{ marginLeft: TEXT_GAP }}>
        <Text
          numberOfLines={1}
          className="text-[14px] font-poppins-semibold leading-[1.3] text-ink"
        >
          {step.title}
        </Text>
        <Text
          numberOfLines={1}
          className="text-[13px] font-poppins leading-[1.4]"
          style={{ marginTop: LINE_GAP, color: SUBTITLE_COLOR }}
        >
          {step.subtitle}
        </Text>
      </View>

      {step.done ? <DoneBox /> : <EmptyBox />}
    </View>
  );
}

/** A finished step: filled disc with a white tick. */
function DoneBox() {
  return (
    <View
      className="items-center justify-center rounded-full bg-primary"
      style={{ width: CHECK_SIZE, height: CHECK_SIZE }}
    >
      <Ionicons name="checkmark" size={15} color="#FFFFFF" />
    </View>
  );
}

/**
 * A step still to do: the ring the tick will sit in. It keeps the same
 * footprint as `DoneBox`, so ticking a step never shifts the row.
 */
function EmptyBox() {
  return (
    <View
      className="rounded-full"
      style={{
        width: CHECK_SIZE,
        height: CHECK_SIZE,
        borderWidth: 2.5,
        borderColor: OUTLINE_COLOR,
      }}
    />
  );
}
