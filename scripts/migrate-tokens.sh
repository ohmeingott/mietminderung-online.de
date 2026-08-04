#!/usr/bin/env bash
# Mechanische Farbmigration Content-Layer -> Design-Tokens.
# Nur die eindeutigen Faelle. Radien, Buttons und die Semantikfarben
# (amber/emerald) brauchen Urteil und bleiben Handarbeit.
#
# Reihenfolge ist wichtig: bg-gray-50 muss vor der allgemeinen
# gray-Regel laufen, sonst wird daraus bg-ink-50 statt bg-paper-sunken.
set -euo pipefail

for f in "$@"; do
  [ -f "$f" ] || { echo "nicht gefunden: $f" >&2; exit 1; }
  perl -pi -e '
    s/\bbg-gray-50\b/bg-paper-sunken/g;
    s/\bbg-white\b(?![\/\w-])/bg-paper-raised/g;
    s/-blue-(\d{2,3})\b/-brand-$1/g;
    s/-gray-(\d{2,3})\b/-ink-$1/g;
  ' "$f"
  echo "migriert: $f"
done
