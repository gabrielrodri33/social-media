#!/usr/bin/env bash
# Atualiza a cópia somente-leitura do kit da Nexora a partir do repo lp-nexora (fonte única).
# Uso: scripts/sync-nexora-brand.sh ../lp-nexora
set -euo pipefail
SRC="$(cd "$1" && pwd)"; ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$SRC/nexora-brand/react/NexoraLogo.tsx" ] || { echo "Não achei nexora-brand em $SRC"; exit 1; }
rm -rf "$ROOT/brands/nexora/brand-kit"
cp -r "$SRC/nexora-brand" "$ROOT/brands/nexora/brand-kit"
git -C "$SRC" rev-parse HEAD > "$ROOT/brands/nexora/brand-kit/SOURCE_COMMIT"
echo "Sincronizado de $SRC @ $(cat "$ROOT/brands/nexora/brand-kit/SOURCE_COMMIT")"
