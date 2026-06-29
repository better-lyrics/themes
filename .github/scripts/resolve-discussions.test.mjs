import { test } from "node:test";
import assert from "node:assert/strict";

import {
  repoFromBody,
  discussionNumberByRepo,
  resolveDiscussions,
} from "./resolve-discussions.mjs";

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
  assert.equal(repoFromBody(null), null);
});

test("discussionNumberByRepo: maps lowercased repo to number", () => {
  const map = discussionNumberByRepo([
    { number: 10, body: "**Repository**: [adaliea/blyrics-colorful-vocals]" },
    { number: 42, body: "**Repository**: [ankit008-mishra/apple-music-v3]" },
  ]);
  assert.equal(map.get("adaliea/blyrics-colorful-vocals"), 10);
  assert.equal(map.get("ankit008-mishra/apple-music-v3"), 42);
  assert.equal(map.size, 2);
});

test("discussionNumberByRepo: first-wins on duplicate repos", () => {
  const map = discussionNumberByRepo([
    { number: 1, body: "**Repository**: [Owner/Repo]" },
    { number: 2, body: "**Repository**: [owner/repo]" },
  ]);
  assert.equal(map.get("owner/repo"), 1);
  assert.equal(map.size, 1);
});

test("discussionNumberByRepo: ignores bodies with no repo", () => {
  const map = discussionNumberByRepo([
    { number: 1, body: "nothing labeled here" },
    { number: 2, body: "**Repository**: [foo/bar]" },
  ]);
  assert.equal(map.get("foo/bar"), 2);
  assert.equal(map.size, 1);
});

test("discussionNumberByRepo: tolerates an empty/undefined list", () => {
  assert.equal(discussionNumberByRepo([]).size, 0);
  assert.equal(discussionNumberByRepo(undefined).size, 0);
});

const sampleThemes = () => [
  { id: "colorful-vocals", repo: "adaliea/blyrics-colorful-vocals" },
  { id: "apple-music-v3", repo: "ankit008-mishra/apple-music-v3" },
  { id: "wolfthee-theme-bytm", repo: "WolftheE/better-ytm" },
];

test("resolveDiscussions: matches by repo even when the discussion title drifted", () => {
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
  assert.deepEqual(resolveDiscussions(sampleThemes(), discussions), [
    { id: "colorful-vocals", discussion: 10 },
    { id: "apple-music-v3", discussion: 42 },
    // wolfthee has no discussion: null, meaning no discussion.json
    { id: "wolfthee-theme-bytm", discussion: null },
  ]);
});

test("resolveDiscussions: theme with a matching discussion -> { id, discussion: n }", () => {
  assert.deepEqual(
    resolveDiscussions([{ id: "minimal", repo: "owner/repo" }], [
      { number: 7, body: "**Repository**: [owner/repo]" },
    ]),
    [{ id: "minimal", discussion: 7 }]
  );
});

test("resolveDiscussions: theme with no match -> discussion: null", () => {
  assert.deepEqual(
    resolveDiscussions([{ id: "minimal", repo: "owner/repo" }], [
      { number: 7, body: "**Repository**: [other/repo]" },
    ]),
    [{ id: "minimal", discussion: null }]
  );
});

test("resolveDiscussions: repo match is case-insensitive", () => {
  assert.deepEqual(
    resolveDiscussions(
      [{ id: "colorful-vocals", repo: "adaliea/blyrics-colorful-vocals" }],
      [
        {
          number: 99,
          body: "**Repository**: [ADALIEA/Blyrics-Colorful-Vocals](https://github.com/ADALIEA/Blyrics-Colorful-Vocals)",
        },
      ]
    ),
    [{ id: "colorful-vocals", discussion: 99 }]
  );
});

test("resolveDiscussions: a theme whose discussion disappeared -> null (removal signal)", () => {
  const themes = [
    { id: "alpha", repo: "owner/alpha" },
    { id: "beta", repo: "owner/beta" },
  ];
  // beta's discussion was removed/transferred: only alpha's remains.
  const discussions = [{ number: 1, body: "**Repository**: [owner/alpha]" }];
  assert.deepEqual(resolveDiscussions(themes, discussions), [
    { id: "alpha", discussion: 1 },
    { id: "beta", discussion: null },
  ]);
});

test("resolveDiscussions: a discussion for an unregistered repo is ignored", () => {
  assert.deepEqual(
    resolveDiscussions([{ id: "minimal", repo: "owner/repo" }], [
      { number: 5, body: "**Repository**: [some/unrelated-repo]" },
    ]),
    [{ id: "minimal", discussion: null }]
  );
});

test("resolveDiscussions: empty themes -> empty result", () => {
  assert.deepEqual(resolveDiscussions([], []), []);
});
