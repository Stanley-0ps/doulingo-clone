import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PlaceholderScreenProps = {
  title: string;
  description: string;
};

/**
 * Stand-in for a tab that has no screen yet.
 *
 * The tab bar is the feature being built right now, so each destination needs
 * to exist and be reachable — but only one line of UI each, so the placeholder
 * is shared rather than repeated five times.
 */
export default function PlaceholderScreen({
  title,
  description,
}: PlaceholderScreenProps) {
  return (
    <View className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-center text-h2 text-ink">{title}</Text>
          <Text className="mt-2 text-center text-body text-muted">
            {description}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
