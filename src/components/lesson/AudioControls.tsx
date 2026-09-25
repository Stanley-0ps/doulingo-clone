import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — measured off `prompt_material/07-audio-lesson-screen.png`,
 * converted to points at the reference scale S = 652px / 390pt = 1.6718.
 * ------------------------------------------------------------------------ */
const DISC_SIZE = 57; // 96px
const DISC_ICON = 34;
/** 85pt from one disc's centre to the next. */
const DISC_GAP = 28;
/** 12px labels, 16pt line box — the row's height has to stay fixed. */
const LABEL_GAP = 13;
const LABEL_LINE = 16;

/** The red disc at the end of the row — the design's only coloured control. */
const END_CALL_RED = "#E84E44";

/**
 * The violet-leaning slate the design labels the controls with — the same one
 * the header's "Online" line and `LessonSubtitles` use.
 */
const SLATE = "#585E86";

type IconName = ComponentProps<typeof Ionicons>["name"];

type AudioControlsProps = {
  cameraOn: boolean;
  micOn: boolean;
  subtitlesOn: boolean;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleSubtitles: () => void;
  onEndCall: () => void;
};

/**
 * The four controls that run the lesson, sitting across the foot of the stage.
 *
 * The first three are toggles — a muted mic or a hidden camera reads from the
 * glyph, so the discs themselves keep the design's plain white. Subtitles are
 * the exception: they switch the transcript for the lesson's phrase list, so
 * that disc tints while it is on.
 */
export default function AudioControls({
  cameraOn,
  micOn,
  subtitlesOn,
  onToggleCamera,
  onToggleMic,
  onToggleSubtitles,
  onEndCall,
}: AudioControlsProps) {
  return (
    <View className="flex-row justify-center" style={{ gap: DISC_GAP }}>
      <ControlDisc
        icon={cameraOn ? "videocam" : "videocam-off"}
        label="Camera"
        onPress={onToggleCamera}
        accessibilityLabel={cameraOn ? "Turn the camera off" : "Turn the camera on"}
        selected={cameraOn}
      />

      <ControlDisc
        icon={micOn ? "mic" : "mic-off"}
        label="Mic"
        onPress={onToggleMic}
        accessibilityLabel={micOn ? "Mute the mic" : "Unmute the mic"}
        selected={micOn}
      />

      <ControlDisc
        icon="language"
        label="Subtitles"
        onPress={onToggleSubtitles}
        accessibilityLabel={
          subtitlesOn ? "Hide the subtitles" : "Show the subtitles"
        }
        selected={subtitlesOn}
        tint={subtitlesOn ? colors["primary-deep"] : colors.ink}
      />

      <ControlDisc
        icon="call"
        label="End Call"
        onPress={onEndCall}
        accessibilityLabel="End the lesson"
        fill={END_CALL_RED}
        tint={colors.background}
        rotated
      />
    </View>
  );
}

type ControlDiscProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
  selected?: boolean;
  /** Disc background — only the end-call control deviates from white. */
  fill?: string;
  tint?: string;
  /** The handset points up-right; a horizontal one is the hang-up glyph. */
  rotated?: boolean;
};

/** One disc and the word under it. */
function ControlDisc({
  icon,
  label,
  onPress,
  accessibilityLabel,
  selected,
  fill = colors.background,
  tint = colors.ink,
  rotated = false,
}: ControlDiscProps) {
  return (
    <View className="items-center" style={{ width: DISC_SIZE }}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={selected === undefined ? undefined : { selected }}
        className="items-center justify-center active:opacity-80"
        style={{
          width: DISC_SIZE,
          height: DISC_SIZE,
          borderRadius: DISC_SIZE / 2,
          backgroundColor: fill,
        }}
      >
        <Ionicons
          name={icon}
          size={DISC_ICON}
          color={tint}
          style={rotated ? { transform: [{ rotate: "135deg" }] } : undefined}
        />
      </Pressable>

      <Text
        numberOfLines={1}
        className="text-[12px] font-poppins-medium"
        style={{ marginTop: LABEL_GAP, lineHeight: LABEL_LINE, color: SLATE }}
      >
        {label}
      </Text>
    </View>
  );
}
