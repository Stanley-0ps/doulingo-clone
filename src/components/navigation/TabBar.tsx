import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors, shadows } from "@/theme";

/* ---------------------------------------------------------------------------
 * Design grid
 *
 * Measured off `prompt_material/05-home-and-tab-navigation.png`, converted to
 * points at the reference scale S = 520px / 390pt = 1.3333: the floating bar is
 * 99px tall (74pt) and 458px wide, inset 31px (23pt) from each edge — the same
 * gutter the page's own cards use.
 *
 * The bar is 4pt taller than the design's 74pt because the design has no active
 * circle to fit. The circle is centred on the icon row and the label keeps its
 * space while it fades, so the extra height is what keeps the two from
 * colliding as the circle slides across.
 * ------------------------------------------------------------------------ */
const BAR_HEIGHT = 78;
const BAR_RADIUS = 26;
const BAR_MARGIN = 24;
/** Gap under the bar when the device has no home indicator to clear. */
const BAR_BOTTOM_GAP = 10;
const ICON_SIZE = 22;
const ICON_TOP = 14; // bar top → icon
const LABEL_GAP = 12; // icon → label
const LABEL_HEIGHT = 16; // label line box, so the bar height is fixed
const CIRCLE_SIZE = 40;
const CIRCLE_TOP = ICON_TOP + ICON_SIZE / 2 - CIRCLE_SIZE / 2;

/**
 * Inactive grey, sampled from the design's tab icons and labels. It is a
 * violet-leaning grey, noticeably bluer than the design system's `muted`, so it
 * lives here rather than reusing that token.
 */
const INACTIVE_COLOR = "#7C819E";

const SLIDE_DURATION = 140;

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Icons per route, filled for the active tab and outlined for the rest — the
 * same "solid when selected" convention the design uses for the Home tab.
 */
const TAB_ICONS: Record<string, { active: IoniconName; inactive: IoniconName }> =
  {
    index: { active: "home", inactive: "home-outline" },
    learn: { active: "book", inactive: "book-outline" },
    teacher: { active: "happy", inactive: "happy-outline" },
    chat: { active: "chatbubble", inactive: "chatbubble-outline" },
    profile: { active: "person", inactive: "person-outline" },
  };

const FALLBACK_ICONS = { active: "ellipse", inactive: "ellipse-outline" } as const;

/**
 * Bottom tab bar.
 *
 * A floating white pill with the app's five destinations. The active tab is a
 * purple disc holding just its icon; the rest show an icon with its label. One
 * disc is rendered behind the icon row and slides between tabs, so switching
 * tabs reads as the selection moving rather than two tabs swapping state.
 *
 * The nav library hands this component `state`, `descriptors` and `navigation`,
 * which is everything a bar needs to draw itself and drive navigation — the
 * default bar is simply a different implementation of the same contract.
 */
export default function TabBar({
  state,
  descriptors,
  navigation,
  insets,
}: BottomTabBarProps) {
  // Measured rather than derived from the window, so the pill keeps working if
  // its margins ever change.
  const [barWidth, setBarWidth] = useState(0);
  const tabWidth = barWidth / state.routes.length;

  // Driven by the active index, not by a tap, so the disc also moves correctly
  // when navigation happens some other way (a deep link, or a screen pushing).
  const progress = useSharedValue(state.index);

  useEffect(() => {
    // Linear, so the disc holds one speed across the whole bar. An eased curve
    // (or a spring) accelerates out of the old tab and settles into the new
    // one, which reads as a bounce rather than as the selection sliding.
    //
    // Keep this short. Linear motion has no tail to cover a long duration, so
    // the longer it runs the more the disc reads as slow to arrive rather than
    // as gliding — the tab underneath has already changed by then.
    progress.value = withTiming(state.index, {
      duration: SLIDE_DURATION,
      easing: Easing.linear,
    });
  }, [state.index, progress]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * tabWidth }],
  }));

  return (
    <View
      style={{
        paddingHorizontal: BAR_MARGIN,
        paddingBottom: Math.max(insets.bottom, BAR_BOTTOM_GAP),
      }}
    >
      <View
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
        className="flex-row items-start bg-white"
        style={[{ height: BAR_HEIGHT, borderRadius: BAR_RADIUS }, shadows.card]}
      >
        {/* The disc is hidden until the bar has been measured — at width 0 the
            slide would put it in the wrong place for a frame. */}
        {barWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: "absolute",
                top: CIRCLE_TOP,
                left: 0,
                width: tabWidth,
                alignItems: "center",
              },
              indicatorStyle,
            ]}
          >
            <View
              style={{
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                borderRadius: CIRCLE_SIZE / 2,
                backgroundColor: colors.primary,
              }}
            />
          </Animated.View>
        ) : null}

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              index={index}
              progress={progress}
              label={options.title ?? route.name}
              icons={TAB_ICONS[route.name] ?? FALLBACK_ICONS}
              focused={focused}
              onPress={onPress}
              onLongPress={() =>
                navigation.emit({ type: "tabLongPress", target: route.key })
              }
            />
          );
        })}
      </View>
    </View>
  );
}

type TabItemProps = {
  label: string;
  icons: { active: IoniconName; inactive: IoniconName };
  /** Position in the bar, which is what the slide is interpolated against. */
  index: number;
  progress: SharedValue<number>;
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

/**
 * One tab: an icon that swaps between its outline and filled form, and a label
 * that fades out as the disc arrives.
 *
 * Both icons are rendered stacked and cross-faded through their opacity rather
 * than swapped. Reanimated animates `style`, not props, so a colour passed to
 * `Ionicons` cannot be tweened — fading two coloured copies is what makes the
 * change track the disc instead of snapping ahead of it.
 */
function TabItem({
  label,
  icons,
  index,
  progress,
  focused,
  onPress,
  onLongPress,
}: TabItemProps) {
  // Rises as the disc reaches this slot and falls as it leaves, so a tab that
  // the disc is only passing over is never fully "active".
  const outlinedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [1, 0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const filledStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: focused }}
      className="flex-1 items-center active:opacity-70"
      style={{ paddingTop: ICON_TOP }}
    >
      <View style={{ width: ICON_SIZE, height: ICON_SIZE }}>
        <Animated.View style={[styles.centred, outlinedStyle]}>
          <Ionicons
            name={icons.inactive}
            size={ICON_SIZE}
            color={INACTIVE_COLOR}
          />
        </Animated.View>
        <Animated.View style={[styles.centred, filledStyle]}>
          <Ionicons name={icons.active} size={ICON_SIZE} color="#FFFFFF" />
        </Animated.View>
      </View>

      <Animated.View style={[styles.label, outlinedStyle]}>
        <Text
          numberOfLines={1}
          className="text-[12px] font-poppins-medium"
          style={{ color: INACTIVE_COLOR }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /** Fills the icon slot so the two icon variants sit exactly on top of each other. */
  centred: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: LABEL_GAP,
    height: LABEL_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
});
