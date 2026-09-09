import type { TextStyle as RNTextStyle } from "react-native";

/**
 * lingua design system — typography tokens.
 *
 * Mirrors the "TYPOGRAPHY" section of the 01-design-system design sheet:
 * font family is Poppins, loaded via `constants/fonts.ts`.
 * The same styles are exposed as single-class utilities in `global.css`
 * (`text-h1`, `text-body`, …) — keep both files in sync.
 */

/** Poppins font family names as registered with expo-font. */
export const fonts = {
  regular: "Poppins",
  medium: "Poppins-Medium",
  semibold: "Poppins-SemiBold",
  bold: "Poppins-Bold",
} as const;

export type FontFamily = (typeof fonts)[keyof typeof fonts];

/** Font sizes (px / dp). */
export const fontSizes = {
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 16,
  "body-lg": 16,
  body: 14,
  "body-sm": 13,
  caption: 11,
} as const;

/** Line heights, unitless multipliers. */
export const lineHeights = {
  h1: 1.2,
  h2: 1.3,
  h3: 1.3,
  h4: 1.4,
  "body-lg": 1.6,
  body: 1.6,
  "body-sm": 1.6,
  caption: 1.4,
} as const;

/** Font weights (Poppins has these four weights installed). */
export const fontWeights = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export type TextStyleName = keyof typeof fontSizes;

/** Complete text styles, keyed by their design-system name. */
export const textStyles: Record<TextStyleName, RNTextStyle> = {
  h1: {
    fontFamily: fonts.bold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
    fontWeight: fontWeights.bold,
  },
  h2: {
    fontFamily: fonts.semibold,
    fontSize: fontSizes.h2,
    lineHeight: lineHeights.h2,
    fontWeight: fontWeights.semibold,
  },
  h3: {
    fontFamily: fonts.semibold,
    fontSize: fontSizes.h3,
    lineHeight: lineHeights.h3,
    fontWeight: fontWeights.semibold,
  },
  h4: {
    fontFamily: fonts.medium,
    fontSize: fontSizes.h4,
    lineHeight: lineHeights.h4,
    fontWeight: fontWeights.medium,
  },
  "body-lg": {
    fontFamily: fonts.regular,
    fontSize: fontSizes["body-lg"],
    lineHeight: lineHeights["body-lg"],
    fontWeight: fontWeights.regular,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    fontWeight: fontWeights.regular,
  },
  "body-sm": {
    fontFamily: fonts.regular,
    fontSize: fontSizes["body-sm"],
    lineHeight: lineHeights["body-sm"],
    fontWeight: fontWeights.regular,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    fontWeight: fontWeights.regular,
  },
};
