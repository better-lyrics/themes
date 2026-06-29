// Pure helpers for the theme-submission workflow (submit-theme.yml). The
// workflow shells out to the CLI at the bottom; the exported functions stay
// side-effect free so they can be unit tested on their own.

import { readFileSync } from "node:fs";

// normalizeRepo(raw) -> "owner/name". Accepts a bare owner/name or a pasted
// github.com URL (with or without scheme/www), dropping a trailing .git,
// trailing slashes and any whitespace. Repo names never contain spaces, so
// stripping all whitespace also absorbs a stray leading/trailing paste.
export function normalizeRepo(raw) {
  return String(raw ?? "")
    .replace(/\s+/g, "")
    .replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, "")
    .replace(/\.git$/i, "")
    .replace(/\/+$/, "");
}

// isValidRepo(repo) -> true when repo is a single owner/name with safe chars.
export function isValidRepo(repo) {
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(String(repo ?? ""));
}

// idTaken(id, ids) -> true when id exactly equals one of the existing ids. The
// compare is a literal string equality, never a regex: a submitted id like
// ".*" must match only itself, not every registered id.
export function idTaken(id, ids) {
  return (ids ?? []).includes(String(id ?? ""));
}

// CLI for the workflow. Two subcommands:
//   normalize  -> prints normalized repo from $RAW_REPO; exits 0 if it is a
//                 valid owner/name, else 1 (the workflow rejects on nonzero).
//   id-taken <id> -> reads candidate ids (one per line) on stdin; exits 0 if
//                 <id> is already taken, else 1.
const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  const cmd = process.argv[2];
  if (cmd === "normalize") {
    const repo = normalizeRepo(process.env.RAW_REPO);
    process.stdout.write(repo);
    process.exit(isValidRepo(repo) ? 0 : 1);
  } else if (cmd === "id-taken") {
    const id = process.argv[3] ?? "";
    const ids = readFileSync(0, "utf8")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    process.exit(idTaken(id, ids) ? 0 : 1);
  } else {
    process.stderr.write(`submission.mjs: unknown command ${JSON.stringify(cmd)}\n`);
    process.exit(2);
  }
}
