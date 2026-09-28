import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { colors, shadows } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid — the chip borrows `CaptionBubble`'s surface (white, rounded,
 * soft lift) so the new session UI reads as part of the same screen.
 * ------------------------------------------------------------------------ */
const INSET = 12; // the chip's distance from the stage's top-left corner
const CHIP_GAP = 9; // avatar → name
const CHIP_PAD = 5;
const CHIP_PAD_RIGHT = 12;
const AVATAR = 30;
const BADGE = 24; // the mic disc at the end of the chip
const NAME_LINE = 18;

const NOTICE_TOP = 10;
const NOTICE_RADIUS = 16;
const NOTICE_PAD = 14;

/** The violet-leaning slate every secondary line in the lesson design uses. */
const SLATE = "#585E86";
/** Reads as "your voice is not going out" without shouting. */
const MUTED_RED = "#E84E44";

type SessionNotice = {
  tone: "error" | "info";
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

type LessonSessionStatusProps = {
  /** The signed-in learner, as Stream knows them. */
  name: string;
  image?: string;
  /** Live mic state. Ignored until `connected` — there is no mic before that. */
  micOn: boolean;
  /** False while the call is still being set up. */
  connected: boolean;
  /** Set when the learner is talking into a muted mic. */
  speakingWhileMuted?: boolean;
  /** Shown under the chip for a session that is not running. */
  notice?: SessionNotice;
};

/** Two letters for an account with no profile picture. */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

/**
 * Who is in the lesson and how the session is doing.
 *
 * It floats over the top of the stage rather than taking a row of its own: the
 * design has no room for one, and the lesson controls own the bottom. The chip
 * is the learner's own presence — avatar, name, and a mic badge that reads
 * straight off the live call — and the notice below it appears only when there
 * is something to say: still connecting, or a session that failed or ended.
 */
export default function LessonSessionStatus({
  name,
  image,
  micOn,
  connected,
  speakingWhileMuted = false,
  notice,
}: LessonSessionStatusProps) {
  // A session that is not running always has something more important to say
  // than "you're muted", so the hint only fills an otherwise empty notice slot.
  const noticeMessage: SessionNotice | undefined =
    notice ??
    (speakingWhileMuted
      ? {
          tone: "info",
          title: "You're muted",
          message: "Tap Mic to speak.",
        }
      : undefined);

  return (
    <View
      style={{ position: "absolute", top: INSET, left: INSET, right: INSET }}
      pointerEvents="box-none"
    >
      <View
        className="flex-row items-center self-start"
        style={[
          {
            padding: CHIP_PAD,
            paddingRight: CHIP_PAD_RIGHT,
            borderRadius: (AVATAR + CHIP_PAD * 2) / 2,
            backgroundColor: colors.background,
          },
          shadows.card,
        ]}
      >
        {image ? (
          <Image
            source={image}
            contentFit="cover"
            accessibilityLabel={`${name}'s profile picture`}
            style={{ width: AVATAR, height: AVATAR, borderRadius: AVATAR / 2 }}
          />
        ) : (
          <View
            className="items-center justify-center"
            style={{
              width: AVATAR,
              height: AVATAR,
              borderRadius: AVATAR / 2,
              backgroundColor: colors["primary-deep"],
            }}
          >
            <Text className="text-[12px] font-poppins-semibold text-white">
              {initialsOf(name)}
            </Text>
          </View>
        )}

        <Text
          numberOfLines={1}
          className="text-[14px] font-poppins-semibold text-ink"
          style={{ marginLeft: CHIP_GAP, lineHeight: NAME_LINE, maxWidth: 150 }}
        >
          {name}
        </Text>

        {/* The mic badge is the muted state: a spinner until the call is up,
            then the live glyph, red while the learner's voice is not going out. */}
        <View
          className="items-center justify-center"
          style={{
            width: BADGE,
            height: BADGE,
            marginLeft: CHIP_GAP,
            borderRadius: BADGE / 2,
            backgroundColor: micOn || !connected ? colors.surface : "#FDE8E7",
          }}
          accessibilityLabel={
            !connected ? "Connecting your microphone" : micOn ? "Mic on" : "Mic muted"
          }
        >
          {connected ? (
            <Ionicons
              name={micOn ? "mic" : "mic-off"}
              size={15}
              color={micOn ? colors.ink : MUTED_RED}
            />
          ) : (
            <ActivityIndicator size="small" color={SLATE} />
          )}
        </View>
      </View>

      {noticeMessage ? (
        <View
          style={[
            {
              marginTop: NOTICE_TOP,
              padding: NOTICE_PAD,
              borderRadius: NOTICE_RADIUS,
              backgroundColor: colors.background,
            },
            shadows.card,
          ]}
        >
          <View className="flex-row items-center">
            <Ionicons
              name={noticeMessage.tone === "error" ? "alert-circle" : "information-circle"}
              size={18}
              color={noticeMessage.tone === "error" ? colors.error : colors["primary-deep"]}
            />
            <Text
              className="text-[15px] font-poppins-semibold text-ink"
              style={{ marginLeft: 7 }}
            >
              {noticeMessage.title}
            </Text>
          </View>

          <Text className="mt-1 text-[13px] font-poppins" style={{ color: SLATE }}>
            {noticeMessage.message}
          </Text>

          {noticeMessage.actionLabel && noticeMessage.onAction ? (
            <Pressable
              onPress={noticeMessage.onAction}
              accessibilityRole="button"
              accessibilityLabel={noticeMessage.actionLabel}
              className="mt-3 items-center self-start rounded-btn bg-primary px-5 py-2 active:opacity-85"
            >
              <Text className="text-[14px] font-poppins-semibold text-white">
                {noticeMessage.actionLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
