#!/usr/bin/env bash
# Merges main into one Keystatic content branch, so its pull request never
# goes stale (.github/workflows/content-sync.yml).
#
# Keystatic saves every photo at a fixed path, such as
# src/assets/content/case-studies/<entry>/hero/src.jpg. When two branches
# replace the same photo, Git can't merge the two versions and GitHub can't
# resolve a photo conflict in the browser. This script keeps the content
# branch's photo, because that is the one its preview shows and its pull
# request publishes. Any other conflict is left for a person: the merge is
# undone and the branch stays as it was.
#
# Usage: scripts/sync-content-branch.sh <branch> [base]
# Runs in a clean checkout with both branches fetched from origin. Prints
# key=value lines for the workflow: status=up-to-date|merged|conflict,
# photos=<paths kept from the branch>, files=<paths left in conflict>.
set -euo pipefail

BRANCH="$1"
BASE="${2:-main}"
PHOTOS='src/assets/content/'

if git merge-base --is-ancestor "origin/$BASE" "origin/$BRANCH"; then
  echo "status=up-to-date"
  exit 0
fi

git checkout -q -B "$BRANCH" "origin/$BRANCH"
if git merge -q --no-edit -m "Merge $BASE into $BRANCH" "origin/$BASE" > /dev/null; then
  echo "status=merged"
  echo "photos="
  exit 0
fi

mapfile -t conflicted < <(git diff --name-only --diff-filter=U)
kept=()
left=()
for file in "${conflicted[@]}"; do
  if [[ "$file" == "$PHOTOS"* ]]; then
    # Keep the branch's photo. If the branch deleted it, keep it deleted.
    if git checkout -q --ours -- "$file" 2> /dev/null; then
      git add -- "$file"
    else
      git rm -q -- "$file"
    fi
    kept+=("$file")
  else
    left+=("$file")
  fi
done

if ((${#left[@]})); then
  git merge --abort
  echo "status=conflict"
  echo "files=${left[*]}"
  exit 0
fi

git commit -q --no-edit
echo "status=merged"
echo "photos=${kept[*]}"
