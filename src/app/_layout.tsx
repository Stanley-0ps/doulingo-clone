import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "../../global.css";

import { appFonts } from "@/constants/fonts";

/**
 * Reads the Clerk publishable key and fails loudly if it is missing.
 *
 * Metro only inlines `EXPO_PUBLIC_*` variables into the app bundle, and env
 * reads that happen inside `node_modules` are not inlined at all in production
 * builds — so the key is read here and passed to ClerkProvider explicitly.
 */
function getPublishableKey(): string {
  const key = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error(
      "Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to the .env file at the project root.",
    );
  }

  return key;
}

const publishableKey = getPublishableKey();

// Keep the splash screen visible until the Poppins fonts are ready.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(appFonts);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // `tokenCache` keeps the session in the device keychain (via expo-secure-store),
  // so a signed-in user is still signed in after the app restarts.
  // Every screen draws its own header (back button + title), so the navigator
  // header stays off app-wide.
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
