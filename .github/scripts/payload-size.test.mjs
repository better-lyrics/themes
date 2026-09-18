import { test } from "node:test";
import assert from "node:assert/strict";

import { base64Bytes, totalBase64Bytes, isOversized, LIMIT } from "./payload-size.mjs";

test("base64Bytes: rounds up to 4-byte groups", () => {
  assert.equal(base64Bytes(0), 0);
  assert.equal(base64Bytes(1), 4);
  assert.equal(base64Bytes(3), 4);
  assert.equal(base64Bytes(6), 8);
});

test("totalBase64Bytes: sums per-file base64 sizes", () => {
  assert.equal(totalBase64Bytes([{ bytes: 3 }, { bytes: 3 }]), 8);
});

test("isOversized: false at the limit, true just past it", () => {
  const rawAtLimit = (LIMIT / 4) * 3;
  assert.equal(isOversized([{ bytes: rawAtLimit }]), false);
  assert.equal(isOversized([{ bytes: rawAtLimit + 3 }]), true);
});

test("isOversized: empty change set is never oversized", () => {
  assert.equal(isOversized([]), false);
});

test("isOversized: respects a custom limit", () => {
  assert.equal(isOversized([{ bytes: 3 }], 4), false);
  assert.equal(isOversized([{ bytes: 6 }], 4), true);
});
