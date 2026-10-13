import { DatabaseUnreachable } from "../../application/common/DatabaseUnreachable.js";

// What the network says when nothing is there to talk to, or when what was
// there has gone: refused, not found, timed out, reset, no route.
const networkCodes = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ECONNABORTED",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EAI_AGAIN",
  "EPIPE",
]);

// What Postgres says when it is there and will not take the connection, or
// ended the one it had: shutting down or restarting (57P01, 57P02), not
// accepting connections yet or at all (57P03), and out of connections
// (53300). The whole of class 08 is a connection failing.
const sqlStates = new Set(["57P01", "57P02", "57P03", "53300"]);

// What Postgres says, under a code too general to be taken for this on its
// own: 55000 is any object not being in the state a statement needs, and
// this is what it says for a database that has been closed to connections,
// which is not 57P03 whatever its name would suggest. Found by taking one
// away (databaseUnavailable.feature), not read from the documentation.
const postgresSayings = [
  /is not currently accepting connections/i,
  /the database system is (starting up|shutting down|in recovery mode)/i,
];

// What the client says when it has lost the connection without Postgres having
// said why, or gave up waiting for one. These have no code of their own.
const sayings = [
  /^Connection terminated/i,
  /timeout exceeded when trying to connect/i,
  /Client has encountered a connection error/i,
  /Connection ended unexpectedly/i,
];

const reasonCodeOf = (failure: unknown): string | undefined => {
  const code = (failure as { code?: unknown } | null)?.code;
  return typeof code === "string" ? code : undefined;
};

/**
 * Whether `failure` is the database being out of reach, as opposed to the
 * database being there and refusing what it was asked.
 *
 * The second is a mistake in what the site asked, and calling it unreachable
 * would tell a reader to try again later about something trying again will not
 * mend. So this names what is unreachable rather than treating every driver
 * failure as it.
 */
export const isUnreachable = (failure: unknown): boolean => {
  if (failure instanceof DatabaseUnreachable) return true;
  if (typeof failure !== "object" || failure === null) return false;

  const code = reasonCodeOf(failure);
  if (code !== undefined) {
    if (networkCodes.has(code) || sqlStates.has(code)) return true;
    if (code.startsWith("08")) return true;
  }

  // Connecting to a name that has several addresses fails with one failure
  // for each of them, gathered under one that has no code of its own.
  const gathered = (failure as { errors?: unknown }).errors;
  if (Array.isArray(gathered) && gathered.length > 0) {
    return gathered.some(isUnreachable);
  }

  const message = (failure as { message?: unknown }).message;
  if (typeof message !== "string") return false;
  if (sayings.some((saying) => saying.test(message))) return true;
  return (
    code !== undefined && postgresSayings.some((saying) => saying.test(message))
  );
};

/**
 * What `failure` is to the caller: the database being out of reach where it
 * is, and itself where it is not.
 */
export const becauseOf = (failure: unknown): unknown =>
  failure instanceof DatabaseUnreachable || !isUnreachable(failure)
    ? failure
    : new DatabaseUnreachable(failure);
