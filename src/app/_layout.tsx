import { ClerkProvider, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import {
  Stack,
  useGlobalSearchParams,
  usePathname,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  PostHogProvider,
  usePostHog,
  type PostHog,
} from "posthog-react-native";
import { useEffect, useRef } from "react";

import "../../global.css";

import { posthogConfig } from "@/config/posthog";
import { appFonts } from "@/constants/fonts";

const disabledPostHog = {
  capture: () => undefined,
  captureException: () => undefined,
  identify: () => undefined,
  screen: () => undefined,
  logger: { info: () => undefined },
} as unknown as PostHog;

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

function PostHogScreenTracker() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | null>(null);
  const posthog = usePostHog();

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current,
        has_route_params: Object.keys(params).length > 0,
      });
      previousPathname.current = pathname;
    }
  }, [params, pathname, posthog]);

  return null;
}

function PostHogIdentity() {
  const { isLoaded, isSignedIn, user } = useUser();
  const posthog = usePostHog();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || identifiedUserId.current === user.id) {
      return;
    }

    posthog.identify(user.id, {
      ...(user.primaryEmailAddress?.emailAddress
        ? { email: user.primaryEmailAddress.emailAddress }
        : {}),
      ...(user.fullName ? { name: user.fullName } : {}),
    });
    identifiedUserId.current = user.id;
  }, [isLoaded, isSignedIn, posthog, user]);

  return null;
}

function AppNavigator({ withPostHog }: { withPostHog: boolean }) {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {withPostHog ? <PostHogIdentity /> : null}
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}

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
  if (!posthogConfig) {
    return (
      <PostHogProvider client={disabledPostHog} autocapture={false}>
        <AppNavigator withPostHog={false} />
      </PostHogProvider>
    );
  }

  return (
    <PostHogProvider
      apiKey={posthogConfig.projectToken}
      options={{
        host: posthogConfig.host,
        logs: {
          serviceName: "domingo-mobile",
          environment: __DEV__ ? "development" : "production",
        },
      }}
      autocapture={{ captureScreens: true, captureTouches: true }}
      debug={__DEV__}
    >
      <PostHogScreenTracker />
      <AppNavigator withPostHog />
    </PostHogProvider>
  );
}
