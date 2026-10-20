const HOST = process.env.PROFILER_HOST ?? "localhost";

const PORT = process.env.PROFILER_PORT ?? "4567";

const command = process.argv[2];

const interval = process.argv[3] ?? "5000";

const commands = {
  start: `/start?interval=${interval}`,
  stop: "/stop",
  flush: "/flush",
  status: "/status",
};

if (!commands[command]) {
  console.log(`
Render Profiler CLI

Usage:

  bun profiler start
  bun profiler start 2000
  bun profiler stop
  bun profiler flush
  bun profiler status

Environment:

  PROFILER_HOST=192.168.50.1
  PROFILER_PORT=4567
`);
  process.exit(1);
}

const url = `http://${HOST}:${PORT}${commands[command]}`;

try {
  const response = await fetch(url);

  const text = await response.text();

  if (!response.ok) {
    console.error(`Profiler server returned HTTP ${response.status}`);

    console.error(text);

    process.exit(1);
  }

  try {
    const data = JSON.parse(text);

    console.log(data);
  } catch {
    console.error("Profiler server returned invalid JSON:");

    console.error(text);

    process.exit(1);
  }
} catch (error) {
  console.error(`Could not connect to profiler server at ${url}`);

  console.error("Make sure the profiler server is running:");

  console.error("  bun profiler:server");

  process.exit(1);
}
