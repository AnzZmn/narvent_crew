import * as FileSystem from "expo-file-system/legacy";

export type RenderProfileEntry = {
  timestamp: string;
  platform: string;
  id: string;
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  renderToCommit: number;
};

const MAX_BUFFER_SIZE = 500;
const DEFAULT_FLUSH_INTERVAL = 5000;

const CSV_HEADER =
  [
    "timestamp",
    "platform",
    "id",
    "phase",
    "actualDuration",
    "baseDuration",
    "startTime",
    "commitTime",
    "renderToCommit",
    "renderCount",
  ].join(",") + "\n";

class ProfilerService {
  private buffer: RenderProfileEntry[] = [];

  private renderCounts = new Map<string, number>();

  private flushTimer: ReturnType<typeof setInterval> | null = null;

  private flushInterval = DEFAULT_FLUSH_INTERVAL;

  private isWriting = false;

  private initialized = false;

  private readonly filePath = `${FileSystem.documentDirectory}render-profile.csv`;

  private readonly serverURL = "http://127.0.0.1:4567";

  /**
   * Record a React Profiler event.
   */
  record(entry: RenderProfileEntry) {
    const previousCount = this.renderCounts.get(entry.id) ?? 0;

    const renderCount = previousCount + 1;

    this.renderCounts.set(entry.id, renderCount);

    this.buffer.push(entry);

    console.log(
      [
        `[RenderProfiler] ${entry.id}`,
        `platform=${entry.platform}`,
        `phase=${entry.phase}`,
        `render=${renderCount}`,
        `actual=${entry.actualDuration.toFixed(2)}ms`,
        `base=${entry.baseDuration.toFixed(2)}ms`,
        `render→commit=${entry.renderToCommit.toFixed(2)}ms`,
      ].join(" "),
    );

    /*
     * If the buffer becomes full, flush immediately.
     */
    if (this.buffer.length >= MAX_BUFFER_SIZE) {
      void this.flush();
    }
  }

  /**
   * Start periodic CSV writes.
   */
  start(interval = 5000) {
    if (this.flushTimer) {
      return;
    }

    this.flushInterval = interval;

    this.flushTimer = setInterval(() => {
      void this.flush();
    }, interval);

    console.log(`[RenderProfiler] Started (${interval}ms)`);
  }

  /**
   * Stop periodic CSV writes.
   *
   * Buffered entries are NOT discarded.
   */
  async stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    /*
     * IMPORTANT:
     * Flush anything that is still sitting
     * in the React Native memory buffer.
     */
    await this.flush();

    console.log("[RenderProfiler] Stopped and flushed");
  }

  /**
   * Flush the current in-memory buffer immediately.
   */

  async flush() {
    if (this.isWriting) {
      return;
    }

    if (this.buffer.length === 0) {
      return;
    }

    this.isWriting = true;

    const entries = this.buffer.splice(0);

    try {
      await this.uploadToArch(entries);
    } catch {
      /*
       * uploadToArch already restores the
       * entries to the buffer.
       */
    } finally {
      this.isWriting = false;
    }
  }

  /**
   * Get current profiler status.
   */
  getStatus() {
    return {
      running: this.flushTimer !== null,
      bufferSize: this.buffer.length,
      maxBufferSize: MAX_BUFFER_SIZE,
      flushInterval: this.flushInterval,
      filePath: this.filePath,
      renderCounts: Object.fromEntries(this.renderCounts),
    };
  }

  /**
   * Get CSV path.
   */
  getFilePath() {
    return this.filePath;
  }

  /**
   * Clear all in-memory data.
   */
  clearBuffer() {
    this.buffer = [];
    this.renderCounts.clear();

    console.log("[RenderProfiler] Buffer cleared");
  }

  private async initialize() {
    if (this.initialized) {
      return;
    }

    const info = await FileSystem.getInfoAsync(this.filePath);

    if (!info.exists) {
      await FileSystem.writeAsStringAsync(this.filePath, CSV_HEADER, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    }

    this.initialized = true;
  }

  private async uploadToArch(entries: RenderProfileEntry[]) {
    if (entries.length === 0) {
      return;
    }

    const rows = entries.map((entry) => this.toCSV(entry));
    console.log(
      `[RenderProfiler] Android/iOS uploading ${entries.length} entries to ${this.serverURL}`,
    );
    try {
      console.log(
        `[RenderProfiler] Uploading ${entries.length} entries → ${this.serverURL}`,
      );

      const response = await fetch(`${this.serverURL}/profiler/logs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rows),
      });

      const responseText = await response.text();

      console.log(
        `[RenderProfiler] Server response: ${response.status}`,
        responseText,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      console.log(`[RenderProfiler] Uploaded ${entries.length} entries`);
    } catch (error) {
      console.error("[RenderProfiler] Upload failed:", error);

      this.buffer.unshift(...entries);

      throw error;
    }
  }

  private toCSV(entry: RenderProfileEntry) {
    const renderCount = this.renderCounts.get(entry.id) ?? 0;

    return (
      [
        entry.timestamp,
        entry.platform,
        entry.id,
        entry.phase,
        entry.actualDuration.toFixed(3),
        entry.baseDuration.toFixed(3),
        entry.startTime.toFixed(3),
        entry.commitTime.toFixed(3),
        entry.renderToCommit.toFixed(3),
        renderCount,
      ]
        .map(this.escapeCSV)
        .join(",") + "\n"
    );
  }

  private escapeCSV(value: unknown) {
    const stringValue = String(value);

    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
  }
}

export const profilerService = new ProfilerService();
