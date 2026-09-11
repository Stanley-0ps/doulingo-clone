/**
 * Centralized image imports.
 *
 * Import every image used in the app from this object instead of requiring
 * assets directly inside screens/components.
 *
 * Note: the source file for the mascot logo is named `moscot-logo.png` on disk
 * (intentional asset filename) but is exposed here as `mascotLogo`.
 */

import apple from "@/assets/images/apple.png";
import earth from "@/assets/images/earth.png";
import eyeOff from "@/assets/images/eye-off.png";
import eye from "@/assets/images/eye.png";
import facebook from "@/assets/images/facebook.png";
import google from "@/assets/images/google.png";
import mascotAuth from "@/assets/images/mascot-auth.png";
import mascotLogo from "@/assets/images/moscot-logo.png";
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import sparkle from "@/assets/images/sparkle.png";

export const images = {
  /** Fox-head mark used in the app-wordmark lockup. */
  mascotLogo,
  /** Waving fox mascot used as the onboarding hero illustration. */
  mascotWelcome,
  /** Peeking fox mascot used as the auth screens hero illustration. */
  mascotAuth,
  /**
   * Landmarks standing on a globe, used as the language selection screen's
   * bottom illustration. Transparent bands are baked into the asset — see
   * `EARTH_BAND` in `app/languages.tsx` before sizing it.
   */
  earth,
  /** Brand marks for the social auth buttons. */
  google,
  facebook,
  apple,
  /** Password visibility toggle icons. */
  eye,
  eyeOff,
  /** Solid white 4-point star, tinted at runtime (`tintColor`). */
  sparkle,
} as const;

export type ImageName = keyof typeof images;
