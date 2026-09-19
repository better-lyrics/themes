import { test } from "node:test";
import assert from "node:assert/strict";

import { extensionVersionCompare, themeVersionCompare, computeBuilds } from "./builds.mjs";

test("extensionVersionCompare: equal versions return 0", () => {
  assert.equal(extensionVersionCompare("1.0.0", "1.0.0"), 0);
});

test("extensionVersionCompare: numeric (not lexicographic) part compare", () => {
  assert.equal(extensionVersionCompare("1.10.0", "1.9.0") > 0, true);
  assert.equal(extensionVersionCompare("1.9.0", "1.10.0") < 0, true);
});

test("extensionVersionCompare: differing part counts, missing parts treated as 0", () => {
  assert.equal(extensionVersionCompare("2.2.0", "2.2.0.0"), 0);
  assert.equal(extensionVersionCompare("2.2", "2.2.0.0"), 0);
  assert.equal(extensionVersionCompare("2.3.2", "2.2.0.0") > 0, true);
  assert.equal(extensionVersionCompare("2.2.0.0", "2.3.2") < 0, true);
});

test("extensionVersionCompare: a canary sorts below the stable it leads up to", () => {
  assert.equal(extensionVersionCompare("2.4.0.1", "2.4.0") < 0, true);
  assert.equal(extensionVersionCompare("2.4.0.8", "2.4.0") < 0, true);
  assert.equal(extensionVersionCompare("2.4.0", "2.4.0.10") > 0, true);
});

test("extensionVersionCompare: a trailing .0 means stable, not canary zero", () => {
  assert.equal(extensionVersionCompare("2.4.0.0", "2.4.0"), 0);
  assert.equal(extensionVersionCompare("2.4.0.0", "2.4.0.1") > 0, true);
});

test("extensionVersionCompare: canaries order among themselves by ordinal", () => {
  assert.equal(extensionVersionCompare("2.4.0.2", "2.4.0.1") > 0, true);
  assert.equal(extensionVersionCompare("2.4.0.9", "2.4.0.10") < 0, true);
  assert.equal(extensionVersionCompare("2.4.0.3", "2.4.0.3"), 0);
});

test("extensionVersionCompare: the release triple outranks the canary ordinal", () => {
  assert.equal(extensionVersionCompare("2.4.0.1", "2.3.3") > 0, true);
  assert.equal(extensionVersionCompare("2.0.5.6", "2.4.0") < 0, true);
  assert.equal(extensionVersionCompare("2.4.1.1", "2.4.0") > 0, true);
});

test("extensionVersionCompare: a prerelease suffix is stripped before comparing", () => {
  assert.equal(extensionVersionCompare("2.0.5.6-canary", "2.0.5.6"), 0);
  assert.equal(extensionVersionCompare("2.0.5.6-canary", "2.0.5") < 0, true);
});

test("themeVersionCompare: every part is positional, no canary rule", () => {
  assert.equal(themeVersionCompare("1.0.0.1", "1.0.0") > 0, true);
  assert.equal(themeVersionCompare("1.0.0", "1.0.0.1") < 0, true);
  assert.equal(themeVersionCompare("1.0.0.0.5", "1.0.0") > 0, true);
});

test("themeVersionCompare: equal and zero-padded versions match", () => {
  assert.equal(themeVersionCompare("1.0.0", "1.0.0"), 0);
  assert.equal(themeVersionCompare("1.0.0.0", "1.0.0"), 0);
  assert.equal(themeVersionCompare("1.2", "1.2.0.0"), 0);
});

test("themeVersionCompare: numeric (not lexicographic) part compare", () => {
  assert.equal(themeVersionCompare("1.10.0", "1.9.0") > 0, true);
  assert.equal(themeVersionCompare("1.0.0.10", "1.0.0.9") > 0, true);
});

test("themeVersionCompare: a prerelease suffix is stripped, non-numeric parts are 0", () => {
  assert.equal(themeVersionCompare("1.0.0-beta", "1.0.0"), 0);
  assert.equal(themeVersionCompare("1.x.0", "1.0.0"), 0);
});

test("computeBuilds: a 4-part theme version stays above its 3-part predecessor", () => {
  const existing = [
    { version: "1.0.0", minVersion: "2.0.0.0", path: "themes/minimal", integrity: "sha256-old" },
  ];
  const newBuild = { version: "1.0.0.1", minVersion: "2.4.0.0", integrity: "sha256-new" };
  const result = computeBuilds(existing, newBuild, "minimal");

  assert.deepEqual(result.builds, [
    { version: "1.0.0.1", minVersion: "2.4.0.0", path: "themes/minimal", integrity: "sha256-new" },
    { version: "1.0.0", minVersion: "2.0.0.0", path: "themes/minimal/v/1.0.0", integrity: "sha256-old" },
  ]);
  assert.deepEqual(result.deletions, []);
});

test("computeBuilds: first build for a brand-new theme (no prior builds)", () => {
  const newBuild = { version: "1.0.0", minVersion: "2.2.0.0", integrity: "sha256-aaa" };
  const result = computeBuilds([], newBuild, "minimal");

  assert.deepEqual(result.builds, [
    { version: "1.0.0", minVersion: "2.2.0.0", path: "themes/minimal", integrity: "sha256-aaa" },
  ]);
  assert.equal(result.snapshot, null);
  assert.deepEqual(result.deletions, []);
});

test("computeBuilds: minVersion raised -> snapshot the outgoing latest", () => {
  const existing = [
    { version: "1.7.6", minVersion: "2.2.0.0", path: "themes/minimal", integrity: "sha256-old" },
  ];
  const newBuild = { version: "2.0.0", minVersion: "2.5.0.0", integrity: "sha256-new" };
  const result = computeBuilds(existing, newBuild, "minimal");

  // snapshot reported with its preserved path and carried-over integrity
  assert.deepEqual(result.snapshot, {
    version: "1.7.6",
    minVersion: "2.2.0.0",
    path: "themes/minimal/v/1.7.6",
    integrity: "sha256-old",
  });

  // builds sorted version DESC: new latest at themes/minimal, snapshot under v/
  assert.deepEqual(result.builds, [
    { version: "2.0.0", minVersion: "2.5.0.0", path: "themes/minimal", integrity: "sha256-new" },
    { version: "1.7.6", minVersion: "2.2.0.0", path: "themes/minimal/v/1.7.6", integrity: "sha256-old" },
  ]);

  assert.deepEqual(result.deletions, []);
});

test("computeBuilds: minVersion unchanged -> no snapshot, only the new build remains", () => {
  const existing = [
    { version: "1.7.6", minVersion: "2.2.0.0", path: "themes/minimal", integrity: "sha256-old" },
  ];
  const newBuild = { version: "1.8.0", minVersion: "2.2.0.0", integrity: "sha256-new" };
  const result = computeBuilds(existing, newBuild, "minimal");

  assert.equal(result.snapshot, null);
  assert.deepEqual(result.builds, [
    { version: "1.8.0", minVersion: "2.2.0.0", path: "themes/minimal", integrity: "sha256-new" },
  ]);
  assert.deepEqual(result.deletions, []);
});

test("computeBuilds: minVersion lowered -> new build dominates, no snapshot", () => {
  const existing = [
    { version: "1.7.6", minVersion: "2.5.0.0", path: "themes/minimal", integrity: "sha256-old" },
  ];
  const newBuild = { version: "2.0.0", minVersion: "2.2.0.0", integrity: "sha256-new" };
  const result = computeBuilds(existing, newBuild, "minimal");

  assert.equal(result.snapshot, null);
  assert.deepEqual(result.builds, [
    { version: "2.0.0", minVersion: "2.2.0.0", path: "themes/minimal", integrity: "sha256-new" },
  ]);
  assert.deepEqual(result.deletions, []);
});

test("computeBuilds: staircase prune removes a now-unreachable snapshot dir", () => {
  // Prior staircase: latest 2.0.0 (min 2.5.0.0) plus snapshot 1.7.6 (min 2.2.0.0).
  const existing = [
    { version: "2.0.0", minVersion: "2.5.0.0", path: "themes/minimal", integrity: "sha256-v2" },
    { version: "1.7.6", minVersion: "2.2.0.0", path: "themes/minimal/v/1.7.6", integrity: "sha256-v1" },
  ];
  // New build keeps min at 2.2.0.0, so it dominates BOTH prior builds.
  const newBuild = { version: "2.1.0", minVersion: "2.2.0.0", integrity: "sha256-v3" };
  const result = computeBuilds(existing, newBuild, "minimal");

  // Outgoing latest 2.0.0 had min 2.5.0.0 which is NOT < newBuild.min, so no snapshot of it.
  assert.equal(result.snapshot, null);

  // Only the new build survives the staircase.
  assert.deepEqual(result.builds, [
    { version: "2.1.0", minVersion: "2.2.0.0", path: "themes/minimal", integrity: "sha256-v3" },
  ]);

  // The old snapshot dir 1.7.6 is now unreachable and must be deleted.
  assert.deepEqual(result.deletions, ["themes/minimal/v/1.7.6"]);
});

test("computeBuilds: snapshot added while older snapshot stays reachable (multi-step staircase)", () => {
  // Prior: latest 2.0.0 (min 2.2.0.0). Older client floor still needs it.
  const existing = [
    { version: "2.0.0", minVersion: "2.2.0.0", path: "themes/minimal", integrity: "sha256-v2" },
  ];
  // New build raises the floor: min 2.5.0.0. Outgoing 2.0.0 has lower min -> snapshot it.
  const newBuild = { version: "3.0.0", minVersion: "2.5.0.0", integrity: "sha256-v3" };
  const result = computeBuilds(existing, newBuild, "minimal");

  assert.deepEqual(result.snapshot, {
    version: "2.0.0",
    minVersion: "2.2.0.0",
    path: "themes/minimal/v/2.0.0",
    integrity: "sha256-v2",
  });

  assert.deepEqual(result.builds, [
    { version: "3.0.0", minVersion: "2.5.0.0", path: "themes/minimal", integrity: "sha256-v3" },
    { version: "2.0.0", minVersion: "2.2.0.0", path: "themes/minimal/v/2.0.0", integrity: "sha256-v2" },
  ]);
  assert.deepEqual(result.deletions, []);
});

test("computeBuilds: builds[] always sorted by version DESC", () => {
  const existing = [
    { version: "2.0.0", minVersion: "2.5.0.0", path: "themes/minimal", integrity: "sha256-v2" },
    { version: "1.0.0", minVersion: "2.2.0.0", path: "themes/minimal/v/1.0.0", integrity: "sha256-v1" },
  ];
  // New build floor between the two: min 2.4.0.0. Snapshot outgoing 2.0.0 (min 2.5.0.0 > 2.4 -> dominated, no snapshot).
  const newBuild = { version: "2.5.0", minVersion: "2.4.0.0", integrity: "sha256-v3" };
  const result = computeBuilds(existing, newBuild, "minimal");

  const versions = result.builds.map((b) => b.version);
  const sorted = [...versions].sort((a, b) => extensionVersionCompare(b, a));
  assert.deepEqual(versions, sorted);
});
