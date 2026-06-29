#!/usr/bin/env bash
# Posts the submission status comment, or edits the existing one in place so
# retries do not stack duplicate comments. Reads the body from stdin and uses
# GH_TOKEN, GH_REPO and ISSUE from the environment.
set -euo pipefail

MARKER='<!-- bl-submit -->'
BODY="$MARKER"$'\n'"$(cat)"

CID=$(gh api "repos/$GH_REPO/issues/$ISSUE/comments" \
  --jq "[.[] | select(.body | startswith(\"$MARKER\"))][0].id // empty")

if [ -n "$CID" ]; then
  gh api --method PATCH "repos/$GH_REPO/issues/comments/$CID" -f body="$BODY" >/dev/null
else
  printf '%s' "$BODY" | gh issue comment "$ISSUE" --body-file -
fi
