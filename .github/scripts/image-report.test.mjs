import { test } from "node:test";
import assert from "node:assert/strict";

import { buildReport, codeSpan, SINGLE_CAP } from "./image-report.mjs";

test("clean theme: no warning", () => {
  const images = [{ name: "a.webp", bytes: 100000 }];
  assert.equal(buildReport(images, "url(a.webp)"), "");
});

test("single oversized image triggers and is listed with its size", () => {
  const images = [{ name: "big.webp", bytes: SINGLE_CAP + 1 }];
  const out = buildReport(images, "url(big.webp)");
  assert.match(out, /does not block publishing/);
  assert.match(out, /- `big\.webp`: 4\.0 MB/);
});

test("total over cap triggers even with no single oversized image", () => {
  const images = Array.from({ length: 7 }, (_, i) => ({
    name: `img${i}.webp`,
    bytes: 3 * 1024 * 1024,
  }));
  const refs = images.map((i) => `url(${i.name})`).join(" ");
  const out = buildReport(images, refs);
  assert.notEqual(out, "");
  assert.match(out, /total: about 21 MB across 7 images/);
});

test("unreferenced image flagged; referenced one not in the unused section", () => {
  const images = [
    { name: "big.webp", bytes: SINGLE_CAP + 1 },
    { name: "used.webp", bytes: SINGLE_CAP + 1 },
  ];
  const out = buildReport(images, "background: url(used.webp)");
  assert.match(out, /may be unused/);
  const unusedSection = out.split("may be unused")[1];
  assert.match(unusedSection, /- `big\.webp`/);
  assert.doesNotMatch(unusedSection, /used\.webp/);
});

test("oversized but all referenced: warning without unused section", () => {
  const images = [{ name: "big.webp", bytes: SINGLE_CAP + 1 }];
  const out = buildReport(images, "url(big.webp)");
  assert.doesNotMatch(out, /may be unused/);
});

test("regression: substring collision does not hide a genuinely unused image", () => {
  const images = [
    { name: "g.webp", bytes: SINGLE_CAP + 1 },
    { name: "bg.webp", bytes: SINGLE_CAP + 1 },
  ];
  const out = buildReport(images, "background: url(bg.webp)");
  const unusedSection = out.split("may be unused")[1];
  assert.match(unusedSection, /- `g\.webp`/);
  assert.doesNotMatch(unusedSection, /- `bg\.webp`/);
});

test("path-prefixed reference still counts as used", () => {
  const images = [{ name: "bg.webp", bytes: SINGLE_CAP + 1 }];
  const out = buildReport(images, "url(./images/bg.webp)");
  assert.doesNotMatch(out, /may be unused/);
});

test("regression: backtick in filename cannot break out of the code span", () => {
  const evil = "a`](http://evil).webp";
  assert.equal(codeSpan(evil), "``" + evil + "``");
});

test("codeSpan pads when content starts or ends with a backtick", () => {
  assert.equal(codeSpan("`x"), "`` `x ``");
});
