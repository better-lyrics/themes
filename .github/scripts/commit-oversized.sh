#!/usr/bin/env bash
set -euo pipefail

# Commit and push staged changes with a plain git push, used only when the
# change set is too large for ghcommit-action's 45MB createCommitOnBranch cap.
# These commits are not GitHub-signed; attribute them to the app's bot user.

MESSAGE="${1:?commit message required}"
BRANCH="${2:?branch required}"
PATHSPEC="${3:-}"

NAME="${COMMITTER_NAME:?COMMITTER_NAME required}"
ID="$(gh api "/users/${NAME//\[bot\]/%5Bbot%5D}" --jq .id 2>/dev/null || true)"
if [ -n "$ID" ]; then
  EMAIL="${ID}+${NAME}@users.noreply.github.com"
else
  EMAIL="${NAME}@users.noreply.github.com"
fi

git config user.name "$NAME"
git config user.email "$EMAIL"

if [ -n "$PATHSPEC" ]; then
  git add -- "$PATHSPEC"
  git commit -m "$MESSAGE" -- "$PATHSPEC"
else
  git add -A
  git commit -m "$MESSAGE"
fi

for attempt in 1 2 3 4 5; do
  if git push origin "HEAD:$BRANCH"; then
    exit 0
  fi
  echo "push rejected (attempt $attempt); rebasing onto origin/$BRANCH"
  git fetch origin "$BRANCH"
  git rebase "origin/$BRANCH"
done

echo "push failed after retries" >&2
exit 1
