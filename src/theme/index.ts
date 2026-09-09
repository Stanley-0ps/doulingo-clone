/**
 * lingua design system — token entry point.
 *
 * Import from here when you need design values in TS/JS:
 *
 *   import { colors, textStyles } from "@/theme";
 */

export { colors } from "./colors";
export type { ColorToken } from "./colors";

export { fonts, fontSizes, lineHeights, fontWeights, textStyles } from "./typography";
export type { FontFamily, TextStyleName } from "./typography";

export { spacing } from "./spacing";
export type { SpacingToken } from "./spacing";

export { radius } from "./radius";
export type { RadiusToken } from "./radius";

export { shadows } from "./shadows";
export type { ShadowToken } from "./shadows";
