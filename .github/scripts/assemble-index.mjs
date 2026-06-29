// Reconstitute the aggregate index.lock.json from per-theme files.
//
// The registry is sharded: each theme owns "themes/<id>/build.json" (its lock
// entry minus the discussion id) and optionally "themes/<id>/discussion.json"
// ({ "discussion": <n> }). This module rebuilds the single index.lock.json
// the registry serves: { version, updated, themes[] } where each theme is its
// build.json entry with the discussion id folded back in.

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Build { version: 1, updated, themes } from per-theme entries.
//
// entries is an array of { build, discussion }: build is a theme's lock entry
// object, discussion is a number or null/undefined. Each output theme is a
// shallow copy of build with a discussion property appended ONLY when the
// entry's discussion is not null/undefined (0 is a valid discussion id and is
// kept). themes is sorted by id ascending with a stable sort. Input build
// objects are never mutated.
export function assembleIndex(entries, updatedAt) {
  const themes = entries
    .map((entry) => {
      const theme = { ...entry.build };
      if (entry.discussion != null) {
        theme.discussion = entry.discussion;
      }
      return theme;
    })
    .sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });

  return { version: 1, updated: updatedAt, themes };
}

// Current UTC time as "YYYY-MM-DDTHH:MM:SSZ" (second precision), matching the
// existing "locked"/"updated" field style. toISOString() yields millisecond
// precision (".sssZ"); trim it back to whole seconds.
function nowSeconds() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

// Read whatever themes/*/build.json exist, fold in any sibling discussion.json,
// and return the entries[] for assembleIndex. A theme exists only if it has a
// build.json; a discussion.json without a sibling build.json is ignored (with a
// warning to stderr).
export function collectEntries(themesDir) {
  const dirents = readdirSync(themesDir, { withFileTypes: true });
  const entries = [];

  for (const dirent of dirents) {
    if (!dirent.isDirectory()) continue;

    const dir = join(themesDir, dirent.name);
    const buildPath = join(dir, "build.json");
    const discussionPath = join(dir, "discussion.json");

    let buildRaw;
    try {
      buildRaw = readFileSync(buildPath, "utf8");
    } catch {
      // No build.json: not a theme. A stray discussion.json is meaningless on
      // its own, so warn and skip the directory entirely.
      try {
        readFileSync(discussionPath, "utf8");
        process.stderr.write(
          `warning: ${discussionPath} has no sibling build.json; ignoring\n`,
        );
      } catch {
        // Neither file present; an unrelated directory, nothing to report.
      }
      continue;
    }

    let build;
    try {
      build = JSON.parse(buildRaw);
    } catch (err) {
      throw new Error(`invalid JSON in ${buildPath}: ${err.message}`);
    }

    let discussion = null;
    let discussionRaw;
    try {
      discussionRaw = readFileSync(discussionPath, "utf8");
    } catch (err) {
      // Only a missing discussion.json means "no discussion". Any other read
      // error (permissions, etc.) is a real problem and must surface.
      if (err.code !== "ENOENT") throw err;
    }
    if (discussionRaw !== undefined) {
      try {
        discussion = JSON.parse(discussionRaw).discussion;
      } catch (err) {
        throw new Error(`invalid JSON in ${discussionPath}: ${err.message}`);
      }
    }

    entries.push({ build, discussion });
  }

  return entries;
}

// CLI entrypoint. Scans themes/*/ under the repo root, assembles the index, and
// writes index.lock.json at the repo root with 2-space indentation and a
// trailing newline.
function main() {
  const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
  const themesDir = join(repoRoot, "themes");

  const entries = collectEntries(themesDir);
  const index = assembleIndex(entries, nowSeconds());

  const outPath = join(repoRoot, "index.lock.json");
  writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`);
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  main();
}
