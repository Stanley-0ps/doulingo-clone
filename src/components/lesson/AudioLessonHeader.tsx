import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/07-audio-lesson-screen.png`,
 * converted to points at the reference scale S = 652px / 390pt = 1.6718.
 * ------------------------------------------------------------------------ */
/**
 * The design runs the title's line box straight off the safe-area edge, so
 * this is only breathing room on top of it.
 */
const TOP_GAP = 4;
const GUTTER = 21; // the discs stop 21pt short of the right edge
const TITLE_LINE = 28; // 20px Poppins-SemiBold
const STATUS_LINE = 24; // 17px
const STATUS_BOTTOM = 17; // the status line → the stage below it
const DOT_SIZE = 10;
const DOT_GAP = 6;
/** The chevron glyph's ink is only 0.375em wide — the box is pulled left. */
const CHEVRON_INSET = -9;
const CHEVRON_SIZE = 30;
const CHEVRON_TOP = 6;
const TITLE_GAP = 16; // chevron box → "AI Teacher"
const DISC_SIZE = 37;
const DISC_GAP = 4;
const DISC_TOP = 4; // the discs sit a touch below the title's cap
const DISC_ICON = 22;
/** 1px ring that separates a white disc from the white page behind it. */
const DISC_BORDER = "#E8E9EF";
/** 19px — the reward's digits are big for a badge; they carry the XP. */
const XP_LINE = 24;

/**
 * The violet-leaning slate every secondary line in the design uses — the same
 * one `LessonHeader` and the lesson cards keep.
 */
const SLATE = "#585E86";

/** The design's online dot, shared with the lesson list's completion tick. */
const TICK_GREEN = "#64C039";

type AudioLessonHeaderProps = {
  /** Screen title — the design labels the session, not the lesson. */
  title: string;
  /** Session state, e.g. "Online". Rendered behind the green dot. */
  status: string;
  /** XP the lesson is worth, shown in the middle disc. */
  xpReward: number;
  /** Whether the learner's camera is on — swaps the disc's glyph. */
  cameraOn: boolean;
  /** Whether session alerts are on — swaps the bell's glyph. */
  alertsOn: boolean;
  onToggleCamera: () => void;
  onToggleAlerts: () => void;
  onBack: () => void;
};

/**
 * The audio lesson's header: the way back, the session's status, and the three
 * controls that never move while the lesson runs.
 *
 * The discs are toggles, not decoration — the camera one mirrors the control
 * over the stage, and the bell turns the session's alerts on and off.
 */
export default function AudioLessonHeader({
  title,
  status,
  xpReward,
  cameraOn,
  alertsOn,
  onToggleCamera,
  onToggleAlerts,
  onBack,
}: AudioLessonHeaderProps) {
  return (
    <View
      className="flex-row items-start"
      style={{
        paddingTop: TOP_GAP,
        paddingHorizontal: GUTTER,
        marginBottom: STATUS_BOTTOM,
      }}
    >
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Leave the lesson"
        hitSlop={10}
        className="active:opacity-60"
        style={{ marginLeft: CHEVRON_INSET, marginTop: CHEVRON_TOP }}
      >
        <Ionicons name="chevron-back" size={CHEVRON_SIZE} color={colors.ink} />
      </Pressable>

      <View className="flex-1" style={{ marginLeft: TITLE_GAP }}>
        <Text
          numberOfLines={1}
          className="text-[20px] font-poppins-semibold text-ink"
          style={{ lineHeight: TITLE_LINE }}
        >
          {title}
        </Text>

        <View className="flex-row items-center" style={{ height: STATUS_LINE }}>
          <View
            style={{
              width: DOT_SIZE,
              height: DOT_SIZE,
              borderRadius: DOT_SIZE / 2,
              backgroundColor: TICK_GREEN,
            }}
          />
          <Text
            numberOfLines={1}
            className="text-[17px] font-poppins"
            style={{ marginLeft: DOT_GAP, color: SLATE }}
          >
            {status}
          </Text>
        </View>
      </View>

      <View className="flex-row" style={{ marginTop: DISC_TOP }}>
        <HeaderDisc
          icon={cameraOn ? "videocam" : "videocam-off"}
          label={cameraOn ? "Turn the camera off" : "Turn the camera on"}
          selected={cameraOn}
          onPress={onToggleCamera}
        />

        {/* The lesson's reward: a number, not a control. */}
        <View
          className="items-center justify-center"
          style={{
            width: DISC_SIZE,
            height: DISC_SIZE,
            marginLeft: DISC_GAP,
            borderRadius: DISC_SIZE / 2,
            borderWidth: 1,
            borderColor: DISC_BORDER,
            backgroundColor: colors.background,
          }}
        >
          <Text
            className="text-[19px] font-poppins-semibold text-ink"
            style={{ lineHeight: XP_LINE }}
          >
            {xpReward}
          </Text>
        </View>

        <HeaderDisc
          icon={alertsOn ? "notifications" : "notifications-off"}
          label={alertsOn ? "Turn lesson alerts off" : "Turn lesson alerts on"}
          selected={alertsOn}
          onPress={onToggleAlerts}
        />
      </View>
    </View>
  );
}

type HeaderDiscProps = {
  icon: "videocam" | "videocam-off" | "notifications" | "notifications-off";
  label: string;
  selected: boolean;
  onPress: () => void;
};

/** One of the two round toggles at the top right. */
function HeaderDisc({ icon, label, selected, onPress }: HeaderDiscProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      className="items-center justify-center active:opacity-70"
      style={{
        width: DISC_SIZE,
        height: DISC_SIZE,
        marginLeft: DISC_GAP,
        borderRadius: DISC_SIZE / 2,
        borderWidth: 1,
        borderColor: DISC_BORDER,
        backgroundColor: colors.background,
      }}
    >
      <Ionicons name={icon} size={DISC_ICON} color={colors.ink} />
    </Pressable>
  );
}
