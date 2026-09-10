import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import "../../global.css";

import { appFonts } from "@/constants/fonts";

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

  // Every screen draws its own header (back button + title), so the navigator
  // header stays off app-wide.
  return <Stack screenOptions={{ headerShown: false }} />;
}
