import type { ViewStyle } from "react-native";

/**
 * lingua design system — shadow tokens.
 *
 * Shadows differ per platform, so per project rules they live here as
 * StyleSheet-ready objects instead of Tailwind classes.
 *
 * Note: `elevation` is used on Android, `shadow*` props on iOS — including
 * both on one object works on every platform.
 */

type ShadowStyle = Pick<
  ViewStyle,
  "shadowColor" | "shadowOffset" | "shadowOpacity" | "shadowRadius" | "elevation"
>;

export const shadows = {
  /** Soft lift for cards and floating surfaces. */
  card: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  } satisfies ShadowStyle,

  /** Small lift for buttons. */
  button: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  } satisfies ShadowStyle,
} as const;

export type ShadowToken = keyof typeof shadows;
