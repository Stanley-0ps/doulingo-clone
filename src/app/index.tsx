import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Temporary home screen.
 * Later features replace this with the real (authenticated) home UI — for now
 * it introduces the app and links into the onboarding flow.
 */
export default function Index() {
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

          <View className="mt-10 w-full">
            <Link href="/onboarding" asChild>
              <Pressable className="w-full items-center rounded-btn bg-[#5841EC] py-4 active:opacity-85">
                <Text className="text-body-lg font-poppins-bold uppercase text-white">
                  Open onboarding
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
