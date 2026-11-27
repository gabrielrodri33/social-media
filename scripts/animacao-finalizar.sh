#!/usr/bin/env bash
# Finaliza um vídeo do GrowKaz Stickman Studio: logo oficial (PNG do brand-kit, sem alteração) + volume -14 LUFS
# + cópia para o Drive (≤ 3 MB, limite de upload desta ferramenta).
# Uso: scripts/animacao-finalizar.sh <slug-do-projeto> [inicio-do-logo-em-s]
#   ex.: scripts/animacao-finalizar.sh nexora-cadeira-vazia 24.9
# Logo só existe para a Nexora (nexora-logo-branco.png). Sem 2º argumento, não sobrepõe logo.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
P="$ROOT/growkaz-stickman-studio/projects/$1"
IN="$(ls "$P"/out/*.mp4 | grep -v -- '-final\|-drive' | head -1)"
OUT="$P/out/$1-final.mp4"; DRV="$P/out/$1-drive.mp4"
LOGO="$ROOT/brands/nexora/brand-kit/png/nexora-logo-branco.png"
W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$IN")
if [ -n "${2:-}" ]; then
  LW=$(( W * 340 / 720 )); LY=$(( W * 200 / 720 ))   # logo ~31% da largura, topo dentro da área segura do reel
  ffmpeg -v error -y -i "$IN" -loop 1 -i "$LOGO" -filter_complex \
    "[1:v]scale=${LW}:-1,format=rgba,fade=in:st=$2:d=0.5:alpha=1[lg];[0:v][lg]overlay=(W-w)/2:${LY}:enable='gte(t,$2)':shortest=1[v]" \
    -map "[v]" -map 0:a -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p \
    -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k "$OUT"
else
  ffmpeg -v error -y -i "$IN" -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:a aac -b:a 192k "$OUT"
fi
ffmpeg -v error -y -i "$OUT" -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -c:a copy "$DRV"
echo "final: $OUT ($(du -h "$OUT" | cut -f1))"
echo "drive: $DRV ($(du -h "$DRV" | cut -f1))"
ffmpeg -i "$OUT" -af loudnorm=print_format=summary -f null - 2>&1 | grep "Input Integrated" || true
