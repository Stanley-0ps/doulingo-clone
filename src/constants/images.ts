/**
 * Centralized image imports.
 *
 * Import every image used in the app from this object instead of requiring
 * assets directly inside screens/components.
 *
 * Note: the source file for the mascot logo is named `moscot-logo.png` on disk
 * (intentional asset filename) but is exposed here as `mascotLogo`.
 */

import mascotLogo from "@/assets/images/moscot-logo.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";

export const images = {
  /** Fox-head mark used in the app-wordmark lockup. */
  mascotLogo,
  /** Waving fox mascot used as the onboarding hero illustration. */
  mascotWelcome,
} as const;

export type ImageName = keyof typeof images;
