#!/usr/bin/env bash
# Rebuilds the self-hosted WOFF2 fonts in public/fonts/ (#4).
#
# Needs Python 3 with fonttools and brotli:
#   python3 -m pip install fonttools brotli
#
# Sources:
# - Gilda Display and IBM Plex Mono: the OFL TTFs in design/fonts/.
# - Archivo: the upstream OFL variable font (wdth, wght) from google/fonts,
#   pinned to a commit. The kit's static Archivo TTFs only cover Latin-1, so
#   they can't set the Maltese ħ, ż, ġ and ċ.
#
# Every file is subset to Latin + Latin Extended, with hinting dropped.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

GF_COMMIT=45e3d5269e4a17d823f6d84470bc084dc5ae46f6
GF="https://raw.githubusercontent.com/google/fonts/$GF_COMMIT/ofl"

# Latin + Latin Extended (Google Fonts' latin and latin-ext ranges),
# plus arrows and the minus sign.
UNICODES="U+0000-00FF,U+0100-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2000-206F,U+20A0-20C0,U+2113,U+2122,U+2190-2193,U+2212,U+2215,U+2C60-2C7F,U+A720-A7FF,U+FEFF,U+FFFD"

subset() {
  python3 -m fontTools.subset "$1" \
    --unicodes="$UNICODES" \
    --layout-features='*' \
    --no-hinting \
    --desubroutinize \
    --flavor=woff2 \
    --output-file="$OUT/$2"
}

mkdir -p "$OUT"

subset "$ROOT/design/fonts/GildaDisplay-Regular.ttf" gilda-display-400.woff2
subset "$ROOT/design/fonts/IBMPlexMono-Regular.ttf" ibm-plex-mono-400.woff2
subset "$ROOT/design/fonts/IBMPlexMono-Medium.ttf" ibm-plex-mono-500.woff2

# Archivo ships as two files, which together weigh less than one variable
# file spanning both widths:
# - body text: variable weight 400–600 at normal width
# - buttons: a static SemiBold (600) instance at 125% width
curl -sSfL -o "$TMP/archivo.ttf" "$GF/archivo/Archivo%5Bwdth,wght%5D.ttf"
python3 -m fontTools.varLib.instancer "$TMP/archivo.ttf" wdth=100 wght=400:600 \
  -o "$TMP/archivo-normal.ttf" -q
python3 -m fontTools.varLib.instancer "$TMP/archivo.ttf" wdth=125 wght=600 --static \
  -o "$TMP/archivo-expanded.ttf" -q
subset "$TMP/archivo-normal.ttf" archivo-400-600.woff2
subset "$TMP/archivo-expanded.ttf" archivo-expanded-600.woff2

# OFL licences ship next to the fonts.
cp "$ROOT/design/fonts/OFL-Archivo.txt" "$OUT/OFL-Archivo.txt"
curl -sSfL -o "$OUT/OFL-GildaDisplay.txt" "$GF/gildadisplay/OFL.txt"
curl -sSfL -o "$OUT/OFL-IBMPlexMono.txt" "$GF/ibmplexmono/OFL.txt"

ls -l "$OUT"
