// Sanitize the retry counter carried in a theme-update repository_dispatch.
//
// The counter originates in the dispatch payload (client_payload.retry) and is
// echoed back, incremented, on each self-redispatch when a vendor commit loses
// a CAS race. The workflow feeds it to a numeric bound and an increment, so a
// malformed value (non-numeric, negative, fractional, empty, absurdly long)
// must never reach the shell: it would break the comparison or, unquoted,
// inject a command. Anything that is not a short run of ASCII digits becomes 0.
export function parseRetry(raw) {
  // The counter caps at 5, so six digits is room to spare; bounding the length
  // also keeps Number() from producing scientific notation the shell can't read.
  return /^\d{1,6}$/.test(String(raw ?? "")) ? Number(raw) : 0;
}

// CLI: print the sanitized counter (read from $RETRY_RAW) for the workflow to
// capture. Kept to a single write so the parse stays unit-testable on its own.
const isDirectRun = import.meta.url === `file://${process.argv[1]}`;
if (isDirectRun) {
  process.stdout.write(String(parseRetry(process.env.RETRY_RAW)));
}
