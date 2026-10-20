import { profilerService } from "./ProfilerService";

const PROFILER_SERVER = "http://127.0.0.1:4567";

const POLL_INTERVAL = 1000;

let controllerStarted = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;

let lastRunning = false;
let lastInterval = 5000;

async function checkProfilerState() {
  try {
    const response = await fetch(`${PROFILER_SERVER}/status`);

    if (!response.ok) {
      return;
    }

    const state = await response.json();

    const running = state.running === true;
    const interval = state.interval ?? 5000;

    /*
     * Server changed from stopped → running
     */
    if (running && (!lastRunning || interval !== lastInterval)) {
      console.log(`[ProfilerController] Starting (${interval}ms)`);

      profilerService.start(interval);

      lastRunning = true;
      lastInterval = interval;

      return;
    }

    /*
     * Server changed from running → stopped
     */
    if (!running && lastRunning) {
      console.log("[ProfilerController] Stopping profiler");

      /*
       * Stop periodic writes AND flush
       * the remaining buffer.
       */
      await profilerService.stop();

      lastRunning = false;

      return;
    }

    lastRunning = running;
    lastInterval = interval;
  } catch (error) {
    /*
     * Don't spam the console every second
     * if the Arch machine is unavailable.
     */
  }
}

export function startProfilerController() {
  if (controllerStarted) {
    return;
  }

  controllerStarted = true;

  console.log("[ProfilerController] Started");

  void checkProfilerState();

  pollTimer = setInterval(() => {
    void checkProfilerState();
  }, POLL_INTERVAL);
}

export function stopProfilerController() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }

  controllerStarted = false;
}
