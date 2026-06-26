// Pure logic for the multi-build theme registry.
//
// A theme keeps several vendored builds so older Better Lyrics extension
// versions keep a build that still runs for them. The latest build lives at
// the flat path "themes/<id>"; older preserved builds (snapshots) live at
// "themes/<id>/v/<version>". The set we keep is the "reachable staircase":
// for every build, no other build has BOTH a higher version AND a
// lower-or-equal minVersion.

// Numeric, part-by-part version compare. Differing part counts are allowed;
// missing parts count as 0 (so "2.2.0" equals "2.2.0.0"). Returns a negative
// number when a < b, 0 when equal, a positive number when a > b.
export function versionCompare(a, b) {
  const pa = String(a).split(".");
  const pb = String(b).split(".");
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = Number(pa[i] ?? 0);
    const nb = Number(pb[i] ?? 0);
    if (na !== nb) return na - nb;
  }
  return 0;
}

function latestPath(id) {
  return `themes/${id}`;
}

function snapshotPath(id, version) {
  return `themes/${id}/v/${version}`;
}

// Keep only the reachable staircase. Sort by version DESC, walk while tracking
// the lowest minVersion seen so far, and keep a build only when its minVersion
// is strictly below that running minimum. The highest-version build is always
// kept (nothing has been seen before it).
function staircase(builds) {
  const sorted = [...builds].sort((x, y) => versionCompare(y.version, x.version));
  const kept = [];
  let runningMin = null;
  for (const build of sorted) {
    if (runningMin === null || versionCompare(build.minVersion, runningMin) < 0) {
      kept.push(build);
      runningMin = build.minVersion;
    }
  }
  return kept;
}

// Given the prior reachable builds[] and the new build {version, minVersion,
// integrity}, return { builds, snapshot, deletions }.
//
//   - builds: the new reachable staircase, sorted version DESC. The new build
//     is the latest (path "themes/<id>"); preserved older builds keep their
//     "themes/<id>/v/<version>" path and their own carried-over integrity.
//   - snapshot: the outgoing latest build moved under v/ this run, or null.
//     Only happens when the outgoing latest's minVersion is strictly less than
//     the new build's minVersion (older clients still need it). Otherwise the
//     new build dominates the outgoing one and it is dropped.
//   - deletions: previously-kept snapshot dirs that fall off the staircase and
//     must be removed from disk.
export function computeBuilds(existingBuilds, newBuild, id) {
  const latest = {
    version: newBuild.version,
    minVersion: newBuild.minVersion,
    path: latestPath(id),
    integrity: newBuild.integrity,
  };

  // Split prior builds: the outgoing latest (flat path) vs existing snapshots.
  const flat = latestPath(id);
  const outgoingLatest = existingBuilds.find((b) => b.path === flat) ?? null;
  const existingSnapshots = existingBuilds.filter((b) => b.path !== flat);

  const candidates = [latest, ...existingSnapshots];

  let snapshot = null;
  if (outgoingLatest && versionCompare(outgoingLatest.minVersion, newBuild.minVersion) < 0) {
    snapshot = {
      version: outgoingLatest.version,
      minVersion: outgoingLatest.minVersion,
      path: snapshotPath(id, outgoingLatest.version),
      integrity: outgoingLatest.integrity,
    };
    candidates.push(snapshot);
  }

  const builds = staircase(candidates);

  // Any prior snapshot dir that did not survive the staircase is a deletion.
  const keptPaths = new Set(builds.map((b) => b.path));
  const deletions = existingSnapshots
    .filter((b) => !keptPaths.has(b.path))
    .map((b) => b.path);

  // The freshly created snapshot might itself be pruned; if so, do not report
  // it as a snapshot (it never lands on disk).
  if (snapshot && !keptPaths.has(snapshot.path)) {
    snapshot = null;
  }

  return { builds, snapshot, deletions };
}

// CLI entrypoint for the workflow. Usage:
//
//   node builds.mjs <id> <version> <minVersion> <integrity> '<existingBuildsJson>'
//
// existingBuildsJson is the prior reachable builds[] array (or "[]" / "" for a
// brand-new theme). Prints { builds, snapshot, deletions } as JSON to stdout so
// the workflow can parse it with jq.
function main(argv) {
  const [id, version, minVersion, integrity, existingJson] = argv;
  if (!id || !version || !minVersion || !integrity) {
    process.stderr.write(
      "usage: node builds.mjs <id> <version> <minVersion> <integrity> '<existingBuildsJson>'\n",
    );
    process.exit(1);
  }

  let existingBuilds = [];
  const trimmed = (existingJson ?? "").trim();
  if (trimmed) {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) existingBuilds = parsed;
  }

  const result = computeBuilds(existingBuilds, { version, minVersion, integrity }, id);
  process.stdout.write(JSON.stringify(result));
}

const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  main(process.argv.slice(2));
}
