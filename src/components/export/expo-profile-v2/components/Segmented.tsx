import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { C, EASE, font, useGlass } from "./theme";

type Props = {
  options: string[];
  index: number;
  onChange: (index: number) => void;
  height?: number;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
};

const PAD = 4;
const BORDER = 1;

/** Segmented control with a sliding thumb. Profile tabs, payout mode, tools answer. */
export default function Segmented({
  options,
  index,
  onChange,
  height = 40,
  fontSize = 11.5,
  style,
}: Props) {
  const glass = useGlass();
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const seg = w > 0 ? (w - PAD * 2 - BORDER * 2) / options.length : 0;

  useEffect(() => {
    Animated.timing(x, {
      toValue: index * seg,
      duration: 380,
      easing: EASE,
      useNativeDriver: true,
    }).start();
  }, [index, seg, x]);

  return (
    <View
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
      style={[
        styles.wrap,
        { height, borderRadius: height / 2 },
        glass ? styles.glass : styles.flat,
        style,
      ]}
    >
      {seg > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              width: seg,
              borderRadius: (height - PAD * 2) / 2,
              transform: [{ translateX: x }],
            },
            glass ? styles.thumbGlass : styles.thumbFlat,
          ]}
        />
      )}
      {options.map((o, i) => (
        <Pressable
          key={o}
          onPress={() => onChange(i)}
          accessibilityRole="tab"
          accessibilityState={{ selected: i === index }}
          style={styles.item}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.label,
              { fontSize, color: i === index ? C.violet : C.idle },
            ]}
          >
            {o}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", padding: PAD, borderWidth: BORDER },
  glass: { backgroundColor: C.glassSoft, borderColor: C.glassEdge },
  flat: { backgroundColor: C.flatSoft, borderColor: C.flatSoft },
  thumb: { position: "absolute", top: PAD, bottom: PAD, left: PAD },
  thumbGlass: {
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#3C288C",
    shadowOpacity: 0.3,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
  },
  thumbFlat: { backgroundColor: C.white, elevation: 2 },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  label: font("500", 11.5, C.idle),
});
