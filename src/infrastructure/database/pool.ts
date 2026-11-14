import pg from "pg";

/**
 * How long a request waits for a connection before it is told the database
 * cannot be reached. Ten seconds is long enough for a database to take a
 * connection on a busy day and short enough that nobody is left looking at a
 * page that will not come; whatever runs for long on purpose, an import or a
 * rebuild, can pass its own.
 */
export const defaultConnectionTimeoutMilliseconds = 10_000;

// A database named localhost is on the computer the site runs on, so
// 127.0.0.1 reaches the same one. It is said that way because localhost is
// looked up as ::1 before 127.0.0.1 where a computer lists them in that order,
// Windows with Docker Desktop among them, and nothing answers on ::1: node
// waits a quarter of a second before it tries the other address, on every new
// connection. That was about a fifth of the time the scenarios spent.
//
// Only localhost, and only by name: any other host was chosen by whoever set
// the site up. Not done for production alone because nothing here says which
// is which, and it is the same computer either way. The one way it could go
// wrong is a Postgres that listens on ::1 and not on IPv4, which its default
// of listening on localhost does not do.
//
// Nor where the connection is encrypted: it checks the name it connects to
// against the name its certificate was made out to, and a certificate made out
// to localhost does not match 127.0.0.1. The driver treats every sslmode but
// disable that way, the weaker ones included, so every one of them is left.
//
// An address that cannot be read is given back as it came, so that the failure
// is the database driver's, in its own words, and names the setting at fault.
const connectedTo = (address: string): string => {
  try {
    const url = new URL(address);
    if (url.hostname.toLowerCase() !== "localhost") return address;
    const mode = url.searchParams.get("sslmode");
    if (mode !== null && mode !== "disable") return address;
    if (["true", "1"].includes(url.searchParams.get("ssl") ?? "")) {
      return address;
    }
    url.hostname = "127.0.0.1";
    return url.toString();
  } catch {
    return address;
  }
};

/**
 * A pool whose idle clients cannot take the process down with them.
 *
 * node-postgres emits `error` on the pool when a client sitting idle fails, and
 * an EventEmitter with no listener for `error` throws. A backend can go at any
 * moment — a restart, a failover, an administrator dropping a database out from
 * under a connection — and none of it is the caller's to handle: the pool
 * discards that client and opens another when one is next wanted. What a caller
 * does want is to hear about it, which is what `onIdleError` is for.
 */
export const createPool = (
  connectionString: string,
  onIdleError: (error: Error) => void = () => {},
  connectionTimeoutMillis: number = defaultConnectionTimeoutMilliseconds,
): pg.Pool => {
  // Left to itself the pool waits for a connection for as long as it takes,
  // which for a database that drops what it is sent is as long as the
  // operating system takes to give up. A request that is still waiting is no
  // use to the reader, who would rather be told the site cannot answer, and
  // every one of them holds a connection slot until it does.
  const pool = new pg.Pool({
    connectionString: connectedTo(connectionString),
    connectionTimeoutMillis,
  });
  pool.on("error", onIdleError);
  return pool;
};
