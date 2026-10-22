#!/usr/bin/env bash
# Netlify's ignore command (netlify.toml): exit 0 skips the build, exit 1 runs it.
#
# Branch deploys are switched on for all branches so that Keystatic content
# branches (content-*, see keystatic.config.ts) get a preview at
# https://<branch>--thegildastudios.netlify.app. Every other branch already
# gets a Deploy Preview from its pull request, so its branch deploy is skipped
# to avoid paying for the same build twice. Production and Deploy Previews
# always build.
if [[ "$CONTEXT" == "branch-deploy" && "$BRANCH" != content-* ]]; then
  echo "Skipping the branch deploy of $BRANCH: only content-* branches get one."
  exit 0
fi
exit 1
