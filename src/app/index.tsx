import { useAuth } from "@clerk/expo";
import { Redirect, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Home screen — only reachable once signed in.
 *
 * Temporary home UI. Later features replace this with the real (authenticated)
 * home — for now it links to language selection and signs the user back out.
 */
export default function Index() {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const router = useRouter();

  // Clerk restores the session from the keychain asynchronously, so wait for
  // `isLoaded` before deciding — otherwise every cold start flashes the
  // signed-out branch.
  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center text-h1 text-ink">
            Welcome to{"\n"}
            <Text className="font-poppins-bold text-[#5841EC]">Domingo</Text>
          </Text>
          <Text className="mt-3 text-center text-body text-muted">
            Your AI language teacher.
          </Text>

          <View className="mt-10 w-full gap-3">
            {/* Language selection — the screen the learner picks their course
                on. It is a normal route for now; the store that forces this
                step after sign-up lands next. */}
            <Pressable
              onPress={() => router.push("/languages")}
              accessibilityRole="button"
              className="w-full items-center rounded-btn border border-border py-4 active:opacity-85"
            >
              <Text className="text-body-lg font-poppins-semibold text-ink">
                Choose a language
              </Text>
            </Pressable>

            {/* Dropping the session flips `isSignedIn`, and the guard above
                sends us back to onboarding — no manual navigation needed. */}
            <Pressable
              onPress={() => void signOut()}
              accessibilityRole="button"
              className="w-full items-center rounded-btn bg-[#5841EC] py-4 active:opacity-85"
            >
              <Text className="text-body-lg font-poppins-bold uppercase text-white">
                Sign Out
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
