#!/usr/bin/env bash
# Renderiza um post a partir da ficha: scripts/render-post.sh brands/<marca>/posts/<post>
# Lê composition/format/frame do frontmatter de post.md e props.json. Saída em <post>/render/.
set -euo pipefail
POST="$(cd "$1" && pwd)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
get() { sed -n "s/^$1:[[:space:]]*\([^#[:space:]]*\).*/\1/p" "$POST/post.md" | head -1; }
COMP="$(get composition)"; FORMAT="$(get format)"; FRAME="$(get frame)"
[ -n "$COMP" ] || { echo "post.md sem 'composition:'"; exit 1; }
BROWSER=()
HS=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null | head -1 || true)
[ -n "$HS" ] && BROWSER=(--browser-executable="$HS")
PROPS=(); [ -f "$POST/props.json" ] && PROPS=(--props="$POST/props.json")
mkdir -p "$POST/render"
cd "$ROOT/studio"
if [ "$FORMAT" = "feed" ] || [ "$FORMAT" = "story-still" ]; then
  npx remotion still src/index.ts "$COMP" "$POST/render/$(basename "$POST").png" --frame="${FRAME:-0}" "${PROPS[@]}" "${BROWSER[@]}"
else
  npx remotion render src/index.ts "$COMP" "$POST/render/$(basename "$POST").mp4" "${PROPS[@]}" "${BROWSER[@]}"
fi
