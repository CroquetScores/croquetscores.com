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
  const pool = new pg.Pool({ connectionString });
  pool.on("error", onIdleError);
  return pool;
};
