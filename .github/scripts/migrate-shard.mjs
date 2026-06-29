// One-time, idempotent migration that shards the aggregate index.lock.json into
// per-theme source-of-truth files.
//
// The registry is moving from a single index.lock.json to per-theme files: each
// theme owns "themes/<id>/build.json" (its lock entry minus the discussion id)
// and optionally "themes/<id>/discussion.json" ({ "discussion": <n> }). This is
// the BACKFILL that seeds those files from the current aggregate. The reverse
// (assembling index.lock.json from the per-theme files) lives in
// assemble-index.mjs; running this migration then assembling must reproduce the
// current index.lock.json content-identically.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Split one index.lock.json theme entry into { build, discussion }.
//
//   - build: a shallow copy of entry with the "discussion" key removed. All
//     other keys (repo, id, version, commit, integrity, locked, builds, ...)
//     are carried over unchanged.
//   - discussion: entry.discussion when present (using "!= null" so that the
//     valid id 0 is kept), else null.
//
// entry is never mutated. This is the exact inverse of the per-entry mapping in
// assemble-index.mjs (which appends discussion back only when it is != null).
export function splitEntry(entry) {
  const { discussion: rawDiscussion, ...build } = entry;
  const discussion = rawDiscussion != null ? rawDiscussion : null;
  return { build, discussion };
}

// Serialize the build object with a fixed key order so per-theme files are
// byte-stable regardless of which writer produced them (this migration or the
// vendoring workflow's jq). Keys are emitted in the order the vendoring
// workflow uses: repo, id, version, commit, integrity, locked, builds. Any
// extra keys not in that list are appended afterward (insertion order) so no
// data is silently dropped.
const BUILD_KEY_ORDER = ["repo", "id", "version", "commit", "integrity", "locked", "builds"];

function orderBuild(build) {
  const ordered = {};
  for (const key of BUILD_KEY_ORDER) {
    if (key in build) ordered[key] = build[key];
  }
  for (const key of Object.keys(build)) {
    if (!(key in ordered)) ordered[key] = build[key];
  }
  return ordered;
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

// CLI entrypoint. Reads index.lock.json at the repo root and, for each theme,
// writes themes/<id>/build.json (the entry minus discussion, fixed key order)
// and, when the entry has a discussion (!= null), themes/<id>/discussion.json.
//
// Idempotent: re-running over the same index.lock.json writes byte-identical
// files. A theme that has no discussion writes no discussion.json; a stale
// discussion.json left from a prior run is intentionally NOT removed here. The
// migration's job is to seed source-of-truth from the aggregate, and the
// aggregate is the union of all known discussions, so in practice nothing is
// stale on the first run. Cleanup of orphaned discussion.json is out of scope
// for this one-time backfill (assemble-index.mjs ignores a discussion.json with
// no sibling build.json anyway).
function main() {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const indexPath = join(repoRoot, "index.lock.json");
  const themesDir = join(repoRoot, "themes");

  const index = JSON.parse(readFileSync(indexPath, "utf8"));
  const themes = Array.isArray(index.themes) ? index.themes : [];

  for (const entry of themes) {
    const { build, discussion } = splitEntry(entry);

    const dir = join(themesDir, build.id);
    mkdirSync(dir, { recursive: true });

    writeJson(join(dir, "build.json"), orderBuild(build));

    if (discussion != null) {
      writeJson(join(dir, "discussion.json"), { discussion });
    }
  }
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  main();
}
