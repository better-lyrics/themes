// Resolves each theme's GitHub Discussion number into its per-theme
// "themes/<id>/discussion.json" ({ "discussion": <n> }).
//
// Theme discussions are auto-created with the title "[Theme] <title>", but a
// theme's title can drift after its discussion exists, so titles are not a
// reliable key. We instead match a discussion to a theme by the source repo
// embedded in the discussion body (the "**Repository**: [owner/repo]" line the
// creation template writes), which is stable. A theme with no matching
// discussion has no discussion.json. The registry's aggregate lockfile is
// rebuilt from these per-theme files by a separate regen workflow; this script
// never touches it.

import { readdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

// Pull a theme's source repo ("owner/repo") out of a discussion body, from the
// labeled Repository line the creation template writes. Returns null when that
// line is absent. We deliberately do NOT fall back to any github.com link in the
// body: a body can mention another theme's repo (e.g. an "inspired by" link), so
// a loose match could tie a theme to the wrong discussion. No label, no match.
export function repoFromBody(body) {
  const labeled = String(body ?? "").match(/\*\*Repository\*\*:\s*\[([\w.-]+\/[\w.-]+)\]/i);
  return labeled ? labeled[1] : null;
}

// Build a Map of lowercased repo -> discussion number from a list of
// { number, body } discussions. The first discussion seen for a repo wins;
// bodies without a labeled repo are ignored.
export function discussionNumberByRepo(discussions) {
  const numberByRepo = new Map();
  for (const discussion of discussions ?? []) {
    const repo = repoFromBody(discussion.body);
    if (!repo) continue;
    const key = repo.toLowerCase();
    if (!numberByRepo.has(key)) numberByRepo.set(key, discussion.number);
  }
  return numberByRepo;
}

// Given a list of themes ([{ id, repo }, ...]) and a list of { number, body }
// discussions, return [{ id, discussion: <number|null> }, ...]. discussion is
// the number whose body repo matches the theme's repo (case-insensitive), or
// null when nothing matches (the theme should not have a discussion.json).
export function resolveDiscussions(themes, discussions) {
  const numberByRepo = discussionNumberByRepo(discussions);
  return (themes ?? []).map((theme) => {
    const number = numberByRepo.get(String(theme.repo).toLowerCase());
    return { id: theme.id, discussion: typeof number === "number" ? number : null };
  });
}

// Read every themes/<id>/build.json under themesDir and return
// [{ dir, id, repo }], where dir is the scanned directory name (dirent.name).
// Mirrors the directory scan in assemble-index.mjs: a directory without a
// build.json is not a theme and is skipped. We carry dir so writes provably
// target the same directory the build.json was read from, rather than
// re-deriving the directory from build.id (which would couple correctness to a
// dirname === build.id invariant).
export function readThemes(themesDir) {
  const dirents = readdirSync(themesDir, { withFileTypes: true });
  const themes = [];
  for (const dirent of dirents) {
    if (!dirent.isDirectory()) continue;
    const buildPath = join(themesDir, dirent.name, "build.json");
    if (!existsSync(buildPath)) continue;
    let build;
    try {
      build = JSON.parse(readFileSync(buildPath, "utf8"));
    } catch (err) {
      throw new Error(`invalid JSON in ${buildPath}: ${err.message}`);
    }
    themes.push({ dir: dirent.name, id: build.id, repo: build.repo });
  }
  return themes;
}

// Apply the resolved discussions to disk: scan themesDir for themes, match each
// against discussions by repo, then write or delete each
// themes/<dir>/discussion.json so it matches the resolved discussion. Writes
// happen into the SAME directory the theme was scanned from (theme.dir), not a
// directory re-derived from build.id. A theme whose discussion resolves to null
// has its discussion.json removed (if any); discussion: 0 is a real value and is
// written. Returns { written, deleted } counts; an unchanged file is left
// byte-identical and not counted. Never touches the aggregate lockfile.
export function applyResolvedDiscussions(themesDir, discussions) {
  const themes = readThemes(themesDir);
  const resolved = resolveDiscussions(themes, discussions);

  // themes and resolved are parallel arrays (resolveDiscussions maps 1:1 in
  // order), so theme.dir at index i is the directory resolved[i] came from. This
  // pairing is exact even if two themes share a build.id, which an id->dir map
  // would silently collapse.
  let written = 0;
  let deleted = 0;
  for (let i = 0; i < resolved.length; i++) {
    const { dir } = themes[i];
    const { discussion } = resolved[i];
    const path = join(themesDir, dir, "discussion.json");
    if (discussion != null) {
      const next = `${JSON.stringify({ discussion }, null, 2)}\n`;
      const current = existsSync(path) ? readFileSync(path, "utf8") : null;
      if (current !== next) {
        writeFileSync(path, next);
        written++;
      }
    } else if (existsSync(path)) {
      rmSync(path);
      deleted++;
    }
  }

  return { written, deleted };
}

// CLI entrypoint for the workflow. Usage:
//
//   node resolve-discussions.mjs '<discussionsJson>'
//
// discussionsJson is a JSON array of { number, body }. Scans themes/*/build.json
// for the theme list, then writes or deletes each themes/<dir>/discussion.json to
// match the resolved discussion. Never touches the aggregate lockfile.
function main(argv) {
  const discussions = JSON.parse((argv[0] ?? "[]").trim() || "[]");
  const { written, deleted } = applyResolvedDiscussions("themes", discussions);
  process.stderr.write(`resolve-discussions: wrote ${written}, deleted ${deleted}\n`);
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  main(process.argv.slice(2));
}
