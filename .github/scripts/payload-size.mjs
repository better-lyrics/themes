import { execFileSync } from "node:child_process";
import { appendFileSync, statSync } from "node:fs";

// GitHub's createCommitOnBranch (used by ghcommit-action) rejects request
// payloads over 45MB; gate below that with headroom so we never ride the edge.
export const LIMIT = 40 * 1024 * 1024;

export function base64Bytes(raw) {
  return Math.ceil(raw / 3) * 4;
}

export function totalBase64Bytes(files) {
  return files.reduce((sum, f) => sum + base64Bytes(f.bytes), 0);
}

export function isOversized(files, limit = LIMIT) {
  return totalBase64Bytes(files) > limit;
}

function stagedFiles(pathspec) {
  const args = ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"];
  if (pathspec.length) args.push("--", ...pathspec);
  return execFileSync("git", args)
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map((path) => ({ path, bytes: sizeOf(path) }));
}

function sizeOf(path) {
  try {
    return statSync(path).size;
  } catch {
    return 0;
  }
}

function main(argv) {
  const bytes = totalBase64Bytes(stagedFiles(argv));
  const line = `oversized=${bytes > LIMIT}\nbytes=${bytes}\n`;
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, line);
  process.stdout.write(line);
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  main(process.argv.slice(2));
}
