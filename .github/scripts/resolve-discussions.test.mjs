import { test } from "node:test";
import assert from "node:assert/strict";

import { repoFromBody, resolveDiscussions } from "./resolve-discussions.mjs";

test("repoFromBody: labeled Repository line", () => {
  assert.equal(
    repoFromBody(
      "- **Repository**: [adaliea/blyrics-colorful-vocals](https://github.com/adaliea/blyrics-colorful-vocals)"
    ),
    "adaliea/blyrics-colorful-vocals"
  );
});

test("repoFromBody: a bare github link is NOT a match (label required)", () => {
  assert.equal(repoFromBody("see https://github.com/owner/repo/tree/main"), null);
});

test("repoFromBody: prefers the labeled repo over a foreign link in the body", () => {
  // Real case: discussion #20 links another theme's repo in its description,
  // then carries its own repo on the labeled line.
  const body =
    "Inspired by [modern](https://github.com/walm-git/modern-youtube-music-theme).\n" +
    "- **Repository**: [chengggit/youtube-music-dynamic-theme](https://github.com/chengggit/youtube-music-dynamic-theme)";
  assert.equal(repoFromBody(body), "chengggit/youtube-music-dynamic-theme");
});

test("repoFromBody: none present", () => {
  assert.equal(repoFromBody("no repository mentioned here"), null);
  assert.equal(repoFromBody(undefined), null);
});

const sampleLock = () => ({
  version: 1,
  updated: "2026-06-28T10:47:19Z",
  themes: [
    { repo: "adaliea/blyrics-colorful-vocals", id: "colorful-vocals", version: "1.0.0" },
    { repo: "ankit008-mishra/apple-music-v3", id: "apple-music-v3", version: "1.0.0" },
    { repo: "WolftheE/better-ytm", id: "wolfthee-theme-bytm", version: "1.0.0" },
  ],
});

test("matches by repo even when the discussion title drifted", () => {
  const discussions = [
    {
      number: 10,
      body: "## Colorful Vocals\n- **Repository**: [adaliea/blyrics-colorful-vocals](https://github.com/adaliea/blyrics-colorful-vocals)",
    },
    {
      // title is "Apple Music Refine" upstream but the repo line is stable
      number: 42,
      body: "## Apple Music Refine\n- **Repository**: [ankit008-mishra/apple-music-v3](https://github.com/ankit008-mishra/apple-music-v3)",
    },
  ];
  const { lockfile, changed } = resolveDiscussions(sampleLock(), discussions);
  assert.equal(changed, 2);
  assert.equal(lockfile.themes[0].discussion, 10);
  assert.equal(lockfile.themes[1].discussion, 42);
  // wolfthee has no discussion: stays without the field
  assert.equal(lockfile.themes[2].discussion, undefined);
});

test("repo match is case-insensitive", () => {
  const { lockfile, changed } = resolveDiscussions(sampleLock(), [
    { number: 99, body: "**Repository**: [ADALIEA/Blyrics-Colorful-Vocals](https://github.com/ADALIEA/Blyrics-Colorful-Vocals)" },
  ]);
  assert.equal(changed, 1);
  assert.equal(lockfile.themes[0].discussion, 99);
});

test("idempotent: no change when the number is already set", () => {
  const base = sampleLock();
  base.themes[0].discussion = 10;
  const { changed } = resolveDiscussions(base, [
    { number: 10, body: "**Repository**: [adaliea/blyrics-colorful-vocals]" },
  ]);
  assert.equal(changed, 0);
});

test("preserves existing fields", () => {
  const { lockfile } = resolveDiscussions(sampleLock(), [
    { number: 10, body: "**Repository**: [adaliea/blyrics-colorful-vocals]" },
  ]);
  assert.deepEqual(lockfile.themes[0], {
    repo: "adaliea/blyrics-colorful-vocals",
    id: "colorful-vocals",
    version: "1.0.0",
    discussion: 10,
  });
});

test("discussion for an unregistered repo is ignored", () => {
  const { changed } = resolveDiscussions(sampleLock(), [
    { number: 5, body: "**Repository**: [some/unrelated-repo]" },
  ]);
  assert.equal(changed, 0);
});

test("does not mutate the input lockfile", () => {
  const base = sampleLock();
  resolveDiscussions(base, [{ number: 10, body: "**Repository**: [adaliea/blyrics-colorful-vocals]" }]);
  assert.equal(base.themes[0].discussion, undefined);
});
