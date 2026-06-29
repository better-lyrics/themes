import { test } from "node:test";
import assert from "node:assert/strict";

import { assembleIndex } from "./assemble-index.mjs";

test("assembleIndex: merges discussion, sorts themes by id, fixed header", () => {
  const entries = [
    { build: { repo: "o/b", id: "beta", version: "1.0.0", commit: "c", integrity: "i", locked: "t", builds: [] }, discussion: 5 },
    { build: { repo: "o/a", id: "alpha", version: "2.0.0", commit: "c", integrity: "i", locked: "t", builds: [] }, discussion: null },
  ];
  const out = assembleIndex(entries, "2026-06-29T00:00:00Z");
  assert.equal(out.version, 1);
  assert.equal(out.updated, "2026-06-29T00:00:00Z");
  assert.deepEqual(out.themes.map((t) => t.id), ["alpha", "beta"]);
  assert.equal(out.themes[1].discussion, 5);
  assert.ok(!("discussion" in out.themes[0]));
});

test("assembleIndex: empty entries -> empty themes, header intact", () => {
  const out = assembleIndex([], "2026-06-29T00:00:00Z");
  assert.equal(out.version, 1);
  assert.equal(out.updated, "2026-06-29T00:00:00Z");
  assert.deepEqual(out.themes, []);
});

test("assembleIndex: discussion omitted when null or undefined", () => {
  const entries = [
    { build: { id: "a", builds: [] }, discussion: null },
    { build: { id: "b", builds: [] }, discussion: undefined },
    { build: { id: "c", builds: [] } },
  ];
  const out = assembleIndex(entries, "t");
  for (const theme of out.themes) {
    assert.ok(!("discussion" in theme), `${theme.id} should not have a discussion key`);
  }
});

test("assembleIndex: discussion of 0 is a real value and kept", () => {
  const out = assembleIndex([{ build: { id: "a", builds: [] }, discussion: 0 }], "t");
  assert.equal(out.themes[0].discussion, 0);
});

test("assembleIndex: builds array preserved verbatim", () => {
  const builds = [
    { version: "1.0.11", minVersion: "2.0.5.6", path: "themes/sustain", integrity: "sha256-x" },
  ];
  const entries = [{ build: { id: "sustain", repo: "o/sustain", builds }, discussion: 7 }];
  const out = assembleIndex(entries, "t");
  assert.deepEqual(out.themes[0].builds, builds);
});

test("assembleIndex: does not mutate input build objects", () => {
  const build = { id: "x", repo: "o/x", builds: [] };
  const entries = [{ build, discussion: 9 }];
  const out = assembleIndex(entries, "t");

  // The original build object must not gain a discussion key.
  assert.ok(!("discussion" in build), "input build was mutated");
  // The output entry is a distinct object carrying the merged discussion.
  assert.equal(out.themes[0].discussion, 9);
  assert.notEqual(out.themes[0], build);
});

test("assembleIndex: input entries array is not mutated", () => {
  const entries = [
    { build: { id: "b", builds: [] }, discussion: 1 },
    { build: { id: "a", builds: [] }, discussion: 2 },
  ];
  const snapshotIds = entries.map((e) => e.build.id);
  assembleIndex(entries, "t");
  assert.deepEqual(entries.map((e) => e.build.id), snapshotIds);
});

test("assembleIndex: stable sort for equal ids preserves input order", () => {
  // Two entries with the same id keep their relative order after a stable sort.
  const entries = [
    { build: { id: "dup", repo: "first", builds: [] }, discussion: null },
    { build: { id: "dup", repo: "second", builds: [] }, discussion: null },
  ];
  const out = assembleIndex(entries, "t");
  assert.deepEqual(out.themes.map((t) => t.repo), ["first", "second"]);
});

test("assembleIndex: sorts a larger set by id ascending", () => {
  const ids = ["zeta", "alpha", "mid", "beta", "gamma"];
  const entries = ids.map((id) => ({ build: { id, builds: [] }, discussion: null }));
  const out = assembleIndex(entries, "t");
  assert.deepEqual(
    out.themes.map((t) => t.id),
    ["alpha", "beta", "gamma", "mid", "zeta"],
  );
});
