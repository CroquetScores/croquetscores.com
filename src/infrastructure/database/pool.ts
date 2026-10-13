import pg from "pg";

/**
 * How long a request waits for a connection before it is told the database
 * cannot be reached. Ten seconds is long enough for a database to take a
 * connection on a busy day and short enough that nobody is left looking at a
 * page that will not come; whatever runs for long on purpose, an import or a
 * rebuild, can pass its own.
 */
export const defaultConnectionTimeoutMilliseconds = 10_000;

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
  const pool = new pg.Pool({ connectionString, connectionTimeoutMillis });
  pool.on("error", onIdleError);
  return pool;
};
