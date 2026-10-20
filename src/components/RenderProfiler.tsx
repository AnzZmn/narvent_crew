import React, { Profiler } from "react";
import { Platform } from "react-native";
import { profilerService } from "./ProfilerService";

export function RenderProfiler({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <Profiler
      id={id}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
      ) => {
        profilerService.record({
          timestamp: new Date().toISOString(),
          platform: Platform.OS,
          id,
          phase,
          actualDuration,
          baseDuration,
          startTime,
          commitTime,
          renderToCommit: commitTime - startTime,
        });
      }}
    >
      {children}
    </Profiler>
  );
}
