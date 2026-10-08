#!/usr/bin/env bash
set -euo pipefail

# Prints the repository's discussions as a JSON array of { number, body }.
# first:100 covers the registry comfortably; paginate if it ever exceeds 100.
REPO="$1"
gh api graphql -F owner="${REPO%/*}" -F name="${REPO#*/}" -f query='
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      discussions(first: 100) {
        nodes { number body }
      }
    }
  }' --jq '.data.repository.discussions.nodes'
