import pg from "pg";

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
): pg.Pool => {
  // Left to itself the pool waits for a connection for as long as it takes,
  // which for a database that drops what it is sent is as long as the
  // operating system takes to give up. A request that is still waiting is no
  // use to the reader, who would rather be told the site cannot answer, and
  // every one of them holds a connection slot until it does.
  const pool = new pg.Pool({
    connectionString,
    connectionTimeoutMillis: 10_000,
  });
  pool.on("error", onIdleError);
  return pool;
};
