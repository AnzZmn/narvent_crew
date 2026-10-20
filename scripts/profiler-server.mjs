import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = 4567;

const PROFILE_DIR = path.resolve("./profiles");
const CSV_FILE = path.join(PROFILE_DIR, "render-profile.csv");

const CSV_HEADER =
  "timestamp,platform,id,phase,actualDuration,baseDuration,startTime,commitTime,renderToCommit,renderCount\n";

fs.mkdirSync(PROFILE_DIR, {
  recursive: true,
});

if (!fs.existsSync(CSV_FILE)) {
  fs.writeFileSync(CSV_FILE, CSV_HEADER);
}

let profilerState = {
  running: false,
  interval: 5000,
};

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  console.log(`[HTTP] ${new Date().toISOString()} ${req.method} ${req.url}`);

  console.log("[HTTP] Headers:", req.headers);
  const url = new URL(req.url, `http://localhost:${PORT}`);

  /*
   * ----------------------------------------
   * START
   * ----------------------------------------
   */

  if (req.method === "GET" && url.pathname === "/start") {
    const interval = Number(url.searchParams.get("interval")) || 5000;

    profilerState.running = true;
    profilerState.interval = interval;

    console.log(`[Profiler] Started (${interval}ms)`);

    return sendJSON(res, 200, {
      success: true,
      command: "start",
      running: true,
      interval,
    });
  }

  /*
   * ----------------------------------------
   * STOP
   * ----------------------------------------
   */

  if (req.method === "GET" && url.pathname === "/stop") {
    profilerState.running = false;

    console.log("[Profiler] Stopped");

    return sendJSON(res, 200, {
      success: true,
      command: "stop",
      running: false,
    });
  }

  /*
   * ----------------------------------------
   * FLUSH
   * ----------------------------------------
   *
   * The actual React Native buffer lives
   * inside the app.
   *
   * This tells the app to flush.
   */

  if (req.method === "GET" && url.pathname === "/flush") {
    console.log("[Profiler] Flush requested");

    return sendJSON(res, 200, {
      success: true,
      command: "flush",
    });
  }

  /*
   * ----------------------------------------
   * STATUS
   * ----------------------------------------
   */

  if (req.method === "GET" && url.pathname === "/status") {
    return sendJSON(res, 200, {
      success: true,
      running: profilerState.running,
      interval: profilerState.interval,
      file: CSV_FILE,
    });
  }

  /*
   * ----------------------------------------
   * RECEIVE PROFILER LOGS
   * ----------------------------------------
   */

  if (req.method === "POST" && req.url === "/profiler/logs") {
    console.log("\n========== PROFILER REQUEST ==========");
    console.log("Time:", new Date().toISOString());
    console.log("Remote:", req.socket.remoteAddress);
    console.log("Headers:", req.headers);

    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      console.log("[Profiler] Received chunk:", chunk.length);
    });

    req.on("end", () => {
      console.log("[Profiler] Body length:", body.length);
      console.log("[Profiler] Body:", body);

      try {
        const rows = JSON.parse(body);

        console.log(`[Profiler] Received ${rows.length} entries`);

        // existing CSV writing logic...

        res.writeHead(200, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            ok: true,
            received: rows.length,
          }),
        );
      } catch (error) {
        console.error("[Profiler] Parse error:", error);

        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            ok: false,
            error: String(error),
          }),
        );
      }
    });

    return;
  }

  /*
   * ----------------------------------------
   * 404
   * ----------------------------------------
   */

  sendJSON(res, 404, {
    success: false,
    error: "Not found",
    path: url.pathname,
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("================================");
  console.log(" Render Profiler Server");
  console.log("================================");
  console.log(`Port: ${PORT}`);
  console.log(`CSV:  ${CSV_FILE}`);
  console.log("");
});
