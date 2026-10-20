#!/bin/zsh

set -e

echo "==> Starting socat TCP forwarder..."

osascript <<'APPLESCRIPT'
tell application "Terminal"
    activate
    do script "socat TCP-LISTEN:8081,fork,reuseaddr TCP:192.168.50.1:8081"
end tell
APPLESCRIPT

echo "==> socat started."

sleep 1

echo "==> Opening ADB terminal..."

osascript <<'APPLESCRIPT'
tell application "Terminal"
    activate
    do script "while true; do DEVICE=$(adb devices | awk 'NR>1 && $2==\"device\" {print $1; exit}'); if [ -n \"$DEVICE\" ]; then echo \"Authorized Android device found: $DEVICE\"; adb reverse tcp:8081 tcp:8081; echo \"adb reverse configured.\"; break; else echo \"Waiting for authorized Android device...\"; sleep 2; fi; done"
end tell
APPLESCRIPT

echo "==> ADB terminal opened."

sleep 2

echo "==> Finding iPhone 18 Pro Max simulator..."

SIMULATOR_UDID=$(xcrun simctl list devices available | \
    grep -F "iPhone 18 Pro Max" | \
    head -n 1 | \
    sed -E 's/.*\(([A-F0-9-]+)\).*/\1/')

if [[ -z "$SIMULATOR_UDID" ]]; then
    echo "ERROR: iPhone 18 Pro Max simulator not found."
    echo
    echo "Available iPhone simulators:"
    xcrun simctl list devices available | grep "iPhone"
    exit 1
fi

echo "==> Simulator UDID: $SIMULATOR_UDID"

echo "==> Opening Simulator..."

open -a Simulator

sleep 2

echo "==> Booting iPhone 18 Pro Max..."

xcrun simctl boot "$SIMULATOR_UDID" 2>/dev/null || true

sleep 2

open -a Simulator

echo "==> iPhone 18 Pro Max started."
echo "==> Done."
