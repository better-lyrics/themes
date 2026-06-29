import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  repoFromBody,
  discussionNumberByRepo,
  resolveDiscussions,
  applyResolvedDiscussions,
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

// --- applyResolvedDiscussions (CLI side effects) ---

// Build a temp themes/ dir, run cb(themesDir), and always clean it up.
function withThemesDir(cb) {
  const themesDir = mkdtempSync(join(tmpdir(), "resolve-discussions-"));
  try {
    cb(themesDir);
  } finally {
    rmSync(themesDir, { recursive: true, force: true });
  }
}

// Write a themes/<dir>/build.json. Defaults the id to the dir name, matching
// the vendor invariant, but lets a test decouple them when needed.
function writeBuild(themesDir, dir, repo, id = dir) {
  const themeDir = join(themesDir, dir);
  mkdirSync(themeDir, { recursive: true });
  writeFileSync(join(themeDir, "build.json"), JSON.stringify({ id, repo, builds: [] }));
  return join(themeDir, "discussion.json");
}

test("applyResolvedDiscussions: writes discussion.json for a matching theme", () => {
  withThemesDir((themesDir) => {
    const discussionPath = writeBuild(themesDir, "alpha", "owner/alpha");
    const result = applyResolvedDiscussions(themesDir, [
      { number: 7, body: "**Repository**: [owner/alpha]" },
    ]);

    assert.deepEqual(result, { written: 1, deleted: 0 });
    assert.equal(readFileSync(discussionPath, "utf8"), '{\n  "discussion": 7\n}\n');
  });
});

test("applyResolvedDiscussions: discussion 0 is written, not skipped", () => {
  withThemesDir((themesDir) => {
    const discussionPath = writeBuild(themesDir, "alpha", "owner/alpha");
    const result = applyResolvedDiscussions(themesDir, [
      { number: 0, body: "**Repository**: [owner/alpha]" },
    ]);

    assert.deepEqual(result, { written: 1, deleted: 0 });
    assert.equal(readFileSync(discussionPath, "utf8"), '{\n  "discussion": 0\n}\n');
  });
});

test("applyResolvedDiscussions: no-op guard leaves the file byte-identical, zero writes on second run", () => {
  withThemesDir((themesDir) => {
    const discussionPath = writeBuild(themesDir, "alpha", "owner/alpha");
    const discussions = [{ number: 7, body: "**Repository**: [owner/alpha]" }];

    const first = applyResolvedDiscussions(themesDir, discussions);
    assert.deepEqual(first, { written: 1, deleted: 0 });
    const afterFirst = readFileSync(discussionPath);

    const second = applyResolvedDiscussions(themesDir, discussions);
    assert.deepEqual(second, { written: 0, deleted: 0 });
    const afterSecond = readFileSync(discussionPath);

    assert.ok(afterFirst.equals(afterSecond), "discussion.json must be byte-identical across runs");
  });
});

test("applyResolvedDiscussions: deletes discussion.json when no discussion matches", () => {
  withThemesDir((themesDir) => {
    const discussionPath = writeBuild(themesDir, "alpha", "owner/alpha");
    writeFileSync(discussionPath, '{\n  "discussion": 7\n}\n');

    // The theme's discussion disappeared upstream: empty discussion list.
    const result = applyResolvedDiscussions(themesDir, []);

    assert.deepEqual(result, { written: 0, deleted: 1 });
    assert.equal(existsSync(discussionPath), false);
  });
});

test("applyResolvedDiscussions: a directory without build.json is skipped", () => {
  withThemesDir((themesDir) => {
    // A stray directory with only a discussion.json and no build.json is not a
    // theme; it must be left untouched.
    const strayDir = join(themesDir, "not-a-theme");
    mkdirSync(strayDir, { recursive: true });
    const strayPath = join(strayDir, "discussion.json");
    writeFileSync(strayPath, '{\n  "discussion": 99\n}\n');

    const result = applyResolvedDiscussions(themesDir, [
      { number: 99, body: "**Repository**: [owner/whatever]" },
    ]);

    assert.deepEqual(result, { written: 0, deleted: 0 });
    assert.equal(readFileSync(strayPath, "utf8"), '{\n  "discussion": 99\n}\n');
  });
});

test("applyResolvedDiscussions: writes into the scanned dir even when it differs from build.id", () => {
  withThemesDir((themesDir) => {
    // Decouple the directory name from build.id: the write must target the
    // scanned directory ("scanned-dir"), not a directory named after the id.
    const discussionPath = writeBuild(themesDir, "scanned-dir", "owner/alpha", "drifted-id");

    const result = applyResolvedDiscussions(themesDir, [
      { number: 7, body: "**Repository**: [owner/alpha]" },
    ]);

    assert.deepEqual(result, { written: 1, deleted: 0 });
    assert.equal(readFileSync(discussionPath, "utf8"), '{\n  "discussion": 7\n}\n');
    assert.equal(existsSync(join(themesDir, "drifted-id", "discussion.json")), false);
  });
});

test("applyResolvedDiscussions: malformed build.json throws naming the file path", () => {
  withThemesDir((themesDir) => {
    const dir = join(themesDir, "broken");
    mkdirSync(dir, { recursive: true });
    const buildPath = join(dir, "build.json");
    writeFileSync(buildPath, "{ not valid json");

    assert.throws(
      () => applyResolvedDiscussions(themesDir, []),
      (err) =>
        err instanceof Error &&
        err.message.startsWith(`invalid JSON in ${buildPath}:`),
    );
  });
});
