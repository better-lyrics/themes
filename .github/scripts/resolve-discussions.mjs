// Backfills each theme's GitHub Discussion number into index.lock.json.
//
// Theme discussions are auto-created with the title "[Theme] <title>", but a
// theme's title can drift after its discussion exists, so titles are not a
// reliable key. We instead match a discussion to a theme by the source repo
// embedded in the discussion body (the "**Repository**: [owner/repo]" line the
// creation template writes), which is stable. Themes without a discussion are
// left without the field.

import { readFileSync, writeFileSync } from "node:fs";

// Pull a theme's source repo ("owner/repo") out of a discussion body, from the
// labeled Repository line the creation template writes. Returns null when that
// line is absent. We deliberately do NOT fall back to any github.com link in the
// body: a body can mention another theme's repo (e.g. an "inspired by" link), so
// a loose match could tie a theme to the wrong discussion. No label, no match.
export function repoFromBody(body) {
  const labeled = String(body ?? "").match(/\*\*Repository\*\*:\s*\[([\w.-]+\/[\w.-]+)\]/i);
  return labeled ? labeled[1] : null;
}

// Given the parsed lockfile and a list of { number, body } discussions, return
// { lockfile, changed }. Each theme gains a `discussion` number when a
// discussion's body repo matches the theme's repo (case-insensitive). Existing
// fields are preserved; an already-correct number is left untouched.
export function resolveDiscussions(lockfile, discussions) {
  const numberByRepo = new Map();
  for (const discussion of discussions ?? []) {
    const repo = repoFromBody(discussion.body);
    if (!repo) continue;
    const key = repo.toLowerCase();
    if (!numberByRepo.has(key)) numberByRepo.set(key, discussion.number);
  }

  let changed = 0;
  const themes = lockfile.themes.map((theme) => {
    const number = numberByRepo.get(String(theme.repo).toLowerCase());
    if (typeof number === "number" && theme.discussion !== number) {
      changed++;
      return { ...theme, discussion: number };
    }
    return theme;
  });

  return { lockfile: { ...lockfile, themes }, changed };
}

// CLI entrypoint for the workflow. Usage:
//
//   node resolve-discussions.mjs '<discussionsJson>'
//
// discussionsJson is a JSON array of { number, body }. Reads and rewrites
// ./index.lock.json in place; the workflow re-formats it with `jq -S` after.
function main(argv) {
  const discussions = JSON.parse((argv[0] ?? "[]").trim() || "[]");
  const path = "index.lock.json";
  const lockfile = JSON.parse(readFileSync(path, "utf8"));
  const { lockfile: updated, changed } = resolveDiscussions(lockfile, discussions);
  writeFileSync(path, `${JSON.stringify(updated, null, 2)}\n`);
  process.stderr.write(`resolve-discussions: updated ${changed} theme(s)\n`);
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  main(process.argv.slice(2));
}
