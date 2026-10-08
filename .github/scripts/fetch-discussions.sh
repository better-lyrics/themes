#!/usr/bin/env bash
set -euo pipefail

# Prints every discussion in the repository as a JSON array of { number, body }.
REPO="$1"
gh api graphql --paginate --slurp -F owner="${REPO%/*}" -F name="${REPO#*/}" -f query='
  query($owner: String!, $name: String!, $endCursor: String) {
    repository(owner: $owner, name: $name) {
      discussions(first: 100, after: $endCursor) {
        nodes { number body }
        pageInfo { hasNextPage endCursor }
      }
    }
  }' | jq '[.[].data.repository.discussions.nodes[]]'
