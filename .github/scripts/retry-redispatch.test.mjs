import { test } from "node:test";
import assert from "node:assert/strict";

import { parseRetry } from "./retry-redispatch.mjs";

test("parseRetry: plain integer strings pass through", () => {
  assert.equal(parseRetry("0"), 0);
  assert.equal(parseRetry("3"), 3);
  assert.equal(parseRetry("5"), 5);
});

test("parseRetry: numeric input is accepted", () => {
  assert.equal(parseRetry(0), 0);
  assert.equal(parseRetry(4), 4);
});

test("parseRetry: empty / missing -> 0", () => {
  assert.equal(parseRetry(""), 0);
  assert.equal(parseRetry(undefined), 0);
  assert.equal(parseRetry(null), 0);
});

test("parseRetry: non-numeric -> 0 (keeps the numeric comparison from crashing)", () => {
  assert.equal(parseRetry("abc"), 0);
  assert.equal(parseRetry("5abc"), 0);
});

test("parseRetry: injection-shaped values -> 0", () => {
  // The whole point of the guard: a value carrying shell would otherwise be
  // interpolated into the redispatch step. It must collapse to a safe 0.
  assert.equal(parseRetry("0 curl evil"), 0);
  assert.equal(parseRetry("$(rm -rf /)"), 0);
  assert.equal(parseRetry("1; echo pwned"), 0);
});

test("parseRetry: negative / fractional / whitespace -> 0", () => {
  assert.equal(parseRetry("-2"), 0);
  assert.equal(parseRetry("3.5"), 0);
  assert.equal(parseRetry(" 5 "), 0);
});

test("parseRetry: hex / exponent notation is rejected (digits only)", () => {
  assert.equal(parseRetry("0x10"), 0);
  assert.equal(parseRetry("1e3"), 0);
});

test("parseRetry: absurdly long input -> 0, never scientific notation", () => {
  const result = parseRetry("9".repeat(40));
  assert.equal(result, 0);
  assert.ok(!String(result).includes("e"), "must stay a plain integer");
});

test("parseRetry: result is always a non-negative integer", () => {
  for (const raw of ["", "0", "5", "abc", "-1", "3.5", "0x10", "99999999"]) {
    const n = parseRetry(raw);
    assert.ok(Number.isInteger(n) && n >= 0, `parseRetry(${JSON.stringify(raw)}) = ${n}`);
  }
});

test("parseRetry: leading zeros normalize to their integer value", () => {
  assert.equal(parseRetry("00"), 0);
  assert.equal(parseRetry("03"), 3);
});
