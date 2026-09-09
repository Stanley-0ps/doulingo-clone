/**
 * lingua design system — spacing tokens.
 *
 * 4px-based scale used across screens and components.
 * The default Tailwind spacing utilities (`p-*`, `gap-*`, `mt-*`, …) already
 * follow the same 0.25rem base — this record is the TS-side source of truth
 * for values used in JS (dynamic styles, StyleSheet-only cases).
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
} as const;

export type SpacingToken = keyof typeof spacing;
