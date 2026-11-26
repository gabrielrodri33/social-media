#!/usr/bin/env bash
# Atalho: scripts/render-post.sh brands/<marca>/posts/<dia> [--only=feed|story]
exec node "$(dirname "$0")/render-post.mjs" "$@"
