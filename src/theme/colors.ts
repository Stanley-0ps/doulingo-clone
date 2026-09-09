/**
 * lingua design system — color tokens.
 *
 * Mirrors the "COLORS" section of the 01-design-system design sheet.
 * These are also wired into the Tailwind theme in `global.css`
 * (e.g. `bg-primary`, `text-ink`) — keep both files in sync.
 */

export const colors = {
  // Brand / Primary
  primary: "#6C4EF5", // Lingua Purple
  "primary-deep": "#5B3BF6", // Lingua Deep Purple
  "primary-blue": "#4D8BFF", // Lingua Blue
  "primary-green": "#21C16B", // Lingua Green

  // Semantic
  success: "#21C16B",
  warning: "#FFC800",
  streak: "#FF8A00",
  error: "#FF4D4F",
  info: "#4D8BFF",

  // Neutrals
  ink: "#0D132B", // Text / primary
  muted: "#6B7280", // Text / secondary
  border: "#E5E7EB",
  surface: "#F6F7FB",
  background: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof colors;
