/**
 * lingua design system — border radius tokens.
 *
 * Reusable radii for the playful, rounded card-and-button UI.
 * The named tokens (`card`, `btn`, `pill`) are also wired into the Tailwind
 * theme in `global.css` (`rounded-card`, `rounded-btn`, `rounded-pill`).
 */

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  card: 16,
  btn: 14,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof radius;
