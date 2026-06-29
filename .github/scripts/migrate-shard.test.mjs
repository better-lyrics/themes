import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { splitEntry, orderBuild, writeThemeFiles } from "./migrate-shard.mjs";

test("splitEntry: strips discussion into the second field", () => {
  const entry = {
    repo: "ramansg/Minimal",
    id: "minimal",
    version: "1.7.7",
    commit: "f96778c0646e74c57230c2d4b27b1c6e43e7344b",
    integrity: "sha256-499b6363",
    locked: "2026-06-29T02:16:01Z",
    builds: [{ path: "themes/minimal", version: "1.7.7" }],
    discussion: 5,
  };

  const { build, discussion } = splitEntry(entry);

  assert.equal(discussion, 5);
  assert.equal("discussion" in build, false);
});

test("splitEntry: build retains all keys except discussion (incl builds)", () => {
  const entry = {
    repo: "ramansg/Minimal",
    id: "minimal",
    version: "1.7.7",
    commit: "abc",
    integrity: "sha256-x",
    locked: "2026-06-29T02:16:01Z",
    builds: [{ path: "themes/minimal", version: "1.7.7" }],
    discussion: 5,
  };

  const { build } = splitEntry(entry);

  assert.deepEqual(build, {
    repo: "ramansg/Minimal",
    id: "minimal",
    version: "1.7.7",
    commit: "abc",
    integrity: "sha256-x",
    locked: "2026-06-29T02:16:01Z",
    builds: [{ path: "themes/minimal", version: "1.7.7" }],
  });
});

test("splitEntry: entry without discussion -> discussion is null", () => {
  const entry = {
    repo: "better-lyrics/theme-spotlight",
    id: "spotlight",
    version: "1.0.0",
    commit: "5ba22d84",
    integrity: "sha256-00e6",
    locked: "2026-03-18T18:27:03Z",
  };

  const { build, discussion } = splitEntry(entry);

  assert.equal(discussion, null);
  assert.deepEqual(build, entry);
  // build is a copy, not the same reference
  assert.notEqual(build, entry);
});

test("splitEntry: does not mutate the input entry", () => {
  const entry = {
    repo: "ramansg/Minimal",
    id: "minimal",
    version: "1.7.7",
    commit: "abc",
    integrity: "sha256-x",
    locked: "2026-06-29T02:16:01Z",
    discussion: 5,
  };
  const snapshot = structuredClone(entry);

  splitEntry(entry);

  assert.deepEqual(entry, snapshot);
});

test("splitEntry: discussion 0 is treated as present (not null)", () => {
  const entry = {
    repo: "r/x",
    id: "zero-disc",
    version: "1.0.0",
    commit: "c",
    integrity: "i",
    locked: "l",
    discussion: 0,
  };

  const { build, discussion } = splitEntry(entry);

  assert.equal(discussion, 0);
  assert.equal("discussion" in build, false);
});

test("splitEntry: null discussion in entry normalizes to null", () => {
  const entry = {
    repo: "r/x",
    id: "null-disc",
    version: "1.0.0",
    commit: "c",
    integrity: "i",
    locked: "l",
    discussion: null,
  };

  const { build, discussion } = splitEntry(entry);

  assert.equal(discussion, null);
  assert.equal("discussion" in build, false);
});

test("splitEntry: deterministic for the same input (idempotent split)", () => {
  const entry = {
    repo: "r/x",
    id: "det",
    version: "1.0.0",
    commit: "c",
    integrity: "i",
    locked: "l",
    discussion: 12,
  };

  const a = splitEntry(entry);
  const b = splitEntry(entry);

  assert.deepEqual(a, b);
});

test("orderBuild: known keys come first in the fixed order", () => {
  // Pass keys deliberately out of order; orderBuild must reorder them.
  const build = {
    builds: [],
    locked: "t",
    integrity: "i",
    commit: "c",
    version: "1.0.0",
    id: "x",
    repo: "o/x",
  };

  assert.deepEqual(Object.keys(orderBuild(build)), [
    "repo",
    "id",
    "version",
    "commit",
    "integrity",
    "locked",
    "builds",
  ]);
});

test("orderBuild: unknown keys are appended (not dropped), known first", () => {
  const build = {
    extra: "keep-me",
    repo: "o/x",
    id: "x",
    another: 42,
  };

  const ordered = orderBuild(build);

  // Known keys (present) lead, in canonical order; unknowns follow.
  assert.deepEqual(Object.keys(ordered), ["repo", "id", "extra", "another"]);
  // No data is silently dropped.
  assert.equal(ordered.extra, "keep-me");
  assert.equal(ordered.another, 42);
});

// Build a temp themes/ dir, run cb(themesDir), and always clean it up.
function withThemesDir(cb) {
  const themesDir = mkdtempSync(join(tmpdir(), "migrate-shard-"));
  try {
    cb(themesDir);
  } finally {
    rmSync(themesDir, { recursive: true, force: true });
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

test("writeThemeFiles: without discussion writes build.json only, no discussion key", () => {
  withThemesDir((themesDir) => {
    const build = {
      repo: "o/x",
      id: "no-disc",
      version: "1.0.0",
      commit: "c",
      integrity: "i",
      locked: "t",
      builds: [],
    };

    writeThemeFiles(themesDir, build, null);

    const dir = join(themesDir, "no-disc");
    assert.deepEqual(readdirSync(dir), ["build.json"]);
    assert.equal(existsSync(join(dir, "discussion.json")), false);

    const written = readJson(join(dir, "build.json"));
    assert.ok(!("discussion" in written));
    assert.deepEqual(written, build);
  });
});

test("writeThemeFiles: build.json is written with the fixed key order", () => {
  withThemesDir((themesDir) => {
    const build = {
      builds: [],
      id: "ordered",
      repo: "o/x",
      version: "1.0.0",
      commit: "c",
      integrity: "i",
      locked: "t",
    };

    writeThemeFiles(themesDir, build, null);

    // Read the raw bytes: key order is part of the byte-stable contract.
    const raw = readFileSync(join(themesDir, "ordered", "build.json"), "utf8");
    assert.equal(Object.keys(JSON.parse(raw)).join(","), "repo,id,version,commit,integrity,locked,builds");
    assert.ok(raw.endsWith("}\n"), "build.json should end with a trailing newline");
  });
});

test("writeThemeFiles: with a discussion writes both files", () => {
  withThemesDir((themesDir) => {
    const build = { repo: "o/x", id: "with-disc", version: "1.0.0", commit: "c", integrity: "i", locked: "t", builds: [] };

    writeThemeFiles(themesDir, build, 7);

    const dir = join(themesDir, "with-disc");
    assert.deepEqual(readdirSync(dir).sort(), ["build.json", "discussion.json"]);
    assert.deepEqual(readJson(join(dir, "discussion.json")), { discussion: 7 });
    assert.ok(!("discussion" in readJson(join(dir, "build.json"))));
  });
});

test("writeThemeFiles: discussion 0 still writes discussion.json", () => {
  withThemesDir((themesDir) => {
    const build = { repo: "o/x", id: "zero-disc", version: "1.0.0", commit: "c", integrity: "i", locked: "t", builds: [] };

    writeThemeFiles(themesDir, build, 0);

    const dir = join(themesDir, "zero-disc");
    assert.equal(existsSync(join(dir, "discussion.json")), true);
    assert.deepEqual(readJson(join(dir, "discussion.json")), { discussion: 0 });
  });
});
