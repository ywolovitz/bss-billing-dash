#!/usr/bin/env bash
# Deploy data.json from Downloads to GitHub Pages.
# Usage: ./deploy-data.sh [path-to-data.json]
# Default source: /Users/yoniwolovitz/Downloads/data.json

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE="${1:-/Users/yoniwolovitz/Downloads/data.json}"
TARGET="$REPO_DIR/data.json"

if [[ ! -f "$SOURCE" ]]; then
  echo "Error: file not found: $SOURCE" >&2
  exit 1
fi

if ! python3 -m json.tool "$SOURCE" > /dev/null 2>&1; then
  echo "Error: $SOURCE is not valid JSON" >&2
  exit 1
fi

cp "$SOURCE" "$TARGET"
echo "Copied → $TARGET"

cd "$REPO_DIR"

if [[ -z "$(git status --porcelain data.json)" ]]; then
  echo "No changes in data.json — nothing to deploy."
  exit 0
fi

git add data.json
git commit -m "$(cat <<EOF
Update billing run data.json.

Publish latest statuses, times and quantities to the dashboard.
EOF
)"
git push origin main

echo ""
echo "Deployed. Dashboard will update shortly at:"
echo "  https://ywolovitz.github.io/bss-billing-dash/"
