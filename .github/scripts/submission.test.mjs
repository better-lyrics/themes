import { test } from "node:test";
import assert from "node:assert/strict";

import { normalizeRepo, isValidRepo, idTaken } from "./submission.mjs";

test("normalizeRepo: bare owner/name passes through", () => {
  assert.equal(normalizeRepo("owner/repo"), "owner/repo");
  assert.equal(normalizeRepo("my-org/my.theme_1"), "my-org/my.theme_1");
});

test("normalizeRepo: strips github.com URLs with or without scheme/www", () => {
  assert.equal(normalizeRepo("https://github.com/owner/repo"), "owner/repo");
  assert.equal(normalizeRepo("http://github.com/owner/repo"), "owner/repo");
  assert.equal(normalizeRepo("github.com/owner/repo"), "owner/repo");
  assert.equal(normalizeRepo("www.github.com/owner/repo"), "owner/repo");
  assert.equal(normalizeRepo("https://www.github.com/owner/repo"), "owner/repo");
});

test("normalizeRepo: drops .git suffix and trailing slashes", () => {
  assert.equal(normalizeRepo("https://github.com/owner/repo.git"), "owner/repo");
  assert.equal(normalizeRepo("owner/repo/"), "owner/repo");
  assert.equal(normalizeRepo("https://www.github.com/owner/repo/"), "owner/repo");
});

test("normalizeRepo: host match is case-insensitive, path case is kept", () => {
  assert.equal(normalizeRepo("HTTPS://GitHub.com/owner/repo"), "owner/repo");
  assert.equal(normalizeRepo("Owner/Repo"), "Owner/Repo");
});

test("normalizeRepo: removes surrounding and internal whitespace", () => {
  assert.equal(normalizeRepo("  owner/repo  "), "owner/repo");
  assert.equal(normalizeRepo(" https://github.com/owner/repo "), "owner/repo");
});

test("normalizeRepo: null/undefined -> empty string", () => {
  assert.equal(normalizeRepo(undefined), "");
  assert.equal(normalizeRepo(null), "");
  assert.equal(normalizeRepo(""), "");
});

test("isValidRepo: accepts owner/name shapes", () => {
  assert.equal(isValidRepo("owner/repo"), true);
  assert.equal(isValidRepo("my-org/my.theme_1"), true);
});

test("isValidRepo: rejects empty, missing or extra slashes", () => {
  assert.equal(isValidRepo(""), false);
  assert.equal(isValidRepo("noslash"), false);
  assert.equal(isValidRepo("a/b/c"), false);
  assert.equal(isValidRepo("github.com/owner/repo"), false);
});

test("isValidRepo: rejects whitespace and null", () => {
  assert.equal(isValidRepo("owner /repo"), false);
  assert.equal(isValidRepo(null), false);
  assert.equal(isValidRepo(undefined), false);
});

test("normalize + validate: a pasted scheme-less URL ends up valid", () => {
  assert.equal(isValidRepo(normalizeRepo("github.com/owner/repo")), true);
});

test("idTaken: exact match is taken, unrelated id is free", () => {
  const ids = ["spinning-record", "youtube-tv", "lofi-glass"];
  assert.equal(idTaken("spinning-record", ids), true);
  assert.equal(idTaken("brand-new", ids), false);
});

test("idTaken: regression - submitted id is never treated as a regex", () => {
  // The bug this guards: grep without -F (or a loose compare) let an id like
  // ".*" match every registered id and falsely report "already taken".
  const ids = ["spinning-record", "youtube-tv"];
  assert.equal(idTaken(".*", ids), false);
  assert.equal(idTaken("spin.*record", ids), false);
  assert.equal(idTaken("youtube-..", ids), false);
});

test("idTaken: a literal id containing regex chars still matches itself", () => {
  assert.equal(idTaken("a.b", ["a.b", "x-y"]), true);
  assert.equal(idTaken("aXb", ["a.b", "x-y"]), false);
});

test("idTaken: empty / null / empty list -> not taken", () => {
  assert.equal(idTaken("", ["a", "b"]), false);
  assert.equal(idTaken(null, ["a", "b"]), false);
  assert.equal(idTaken("a", []), false);
  assert.equal(idTaken("a", undefined), false);
});
