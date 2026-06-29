import { test } from "node:test";
import assert from "node:assert/strict";

import { splitEntry } from "./migrate-shard.mjs";

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
