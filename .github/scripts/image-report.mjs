import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export const SINGLE_CAP = 4 * 1024 * 1024;
export const TOTAL_CAP = 20 * 1024 * 1024;

const REFERENCE_FILES = [
  "style.rics",
  "style.css",
  "shader.json",
  "settings.json",
  "metadata.json",
  "DESCRIPTION.md",
];

function mb(bytes) {
  return (bytes / 1024 / 1024).toFixed(1);
}

export function buildReport(images, referenceText, { singleCap = SINGLE_CAP, totalCap = TOTAL_CAP } = {}) {
  const total = images.reduce((sum, i) => sum + i.bytes, 0);
  const large = images.filter((i) => i.bytes > singleCap);
  if (large.length === 0 && total <= totalCap) return "";

  const haystack = referenceText.toLowerCase();
  const unused = images.filter((i) => !haystack.includes(i.name.toLowerCase()));

  const lines = [
    "**A note on your theme's images (this does not block publishing):**",
    "",
    "Some images are large. Big images make your theme slower to load for listeners and add weight to the registry each time a version is snapshotted:",
    ...large.map((i) => `- \`${i.name}\`: ${mb(i.bytes)} MB`),
    `- total: about ${Math.round(total / 1024 / 1024)} MB across ${images.length} images`,
  ];

  if (unused.length > 0) {
    lines.push(
      "",
      "Some images also do not appear to be referenced in your `style.rics`, `shader.json`, `settings.json`, `metadata.json`, or `DESCRIPTION.md`, so they may be unused:",
      ...unused.map((i) => `- \`${i.name}\``),
    );
  }

  lines.push(
    "",
    "To shrink them, compress in the browser with Squoosh (https://squoosh.app, export as WebP around 80% quality) or TinyPNG (https://tinypng.com), or remove any you are not using. Push the change and it re-publishes on your next version bump.",
  );

  return lines.join("\n") + "\n";
}

function readImages(themeDir) {
  const dir = path.join(themeDir, "images");
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile())
    .map((e) => ({ name: e.name, bytes: statSync(path.join(dir, e.name)).size }));
}

function readReferenceText(themeDir) {
  let readmes = [];
  try {
    readmes = readdirSync(themeDir).filter((n) => /^readme/i.test(n));
  } catch {
    readmes = [];
  }
  return [...REFERENCE_FILES, ...readmes]
    .map((n) => {
      try {
        return readFileSync(path.join(themeDir, n), "utf8");
      } catch {
        return "";
      }
    })
    .join("\n");
}

function main(argv) {
  const themeDir = argv[0];
  if (!themeDir) {
    process.stderr.write("usage: node image-report.mjs <theme-dir>\n");
    process.exit(1);
  }
  const report = buildReport(readImages(themeDir), readReferenceText(themeDir));
  if (report) process.stdout.write(report);
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  main(process.argv.slice(2));
}
