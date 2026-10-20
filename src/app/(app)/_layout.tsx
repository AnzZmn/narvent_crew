import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Profiler,
  ProfilerOnRenderCallback,
  ProfilerProps,
  useEffect,
  useRef,
} from "react";
import { RenderProfiler } from "@/components/RenderProfiler";

export default function AppLayout() {
  return (
    <RenderProfiler id="root">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </GestureHandlerRootView>
    </RenderProfiler>
  );
}
