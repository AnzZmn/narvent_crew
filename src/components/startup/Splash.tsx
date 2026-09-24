import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import Splash from "@/assets/images/Splash.svg";

type SplashProps = {
  onComplete: () => void;
};

function LoadingDot({ delay }: { delay: number }) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, {
            duration: 450,
          }),
          withTiming(0.2, {
            duration: 450,
          }),
        ),
        -1,
        false,
      ),
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export default function SplashAnimation({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <View style={styles.container}>
      <Splash width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />

      <View style={styles.loading}>
        <LoadingDot delay={0} />
        <LoadingDot delay={200} />
        <LoadingDot delay={400} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7D69FF",
  },

  loading: {
    position: "absolute",
    bottom: 61,
    left: 0,
    right: 0,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    gap: 6,
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFFFFF",
  },
});
