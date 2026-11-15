// What lets a scenario that knows the site only by its address set up what it
// cannot reach through a page: the time the site believes it is, for a start.
// A scenario in specs/web starts the site as a process of its own, and the
// site has no page for moving its own clock.
//
// It is the one way of changing a running site that is not a reader's, so it
// is guarded twice, and each guard is enough alone. The routes exist only for
// a site that was given a token, and the site refuses to start with a token
// unless its database is one the specs made (`isScratchDatabase` in the
// configuration), which no
// real database is named like. And every call must carry the token, or is
// answered as a page that is not there would be, so that nobody who is not
// holding it learns the routes exist.
import { timingSafeEqual } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";

import type { Clock } from "./common/requestedAt.js";
import { machineClock } from "./common/requestedAt.js";

/** The header a call to the test control carries its token in. */
export const testControlHeader = "x-test-control";

/** The time the site believes it is, which a call can set. */
export class SettableClock {
  // The distance from the machine's clock, so that the time goes on moving
  // after it has been set, as a clock does, rather than standing still.
  #offsetMilliseconds = 0;

  readonly now: Clock = () =>
    new Date(machineClock().getTime() + this.#offsetMilliseconds);

  /** Sets the time to `moment`, from which it goes on. */
  set(moment: Date): void {
    this.#offsetMilliseconds = moment.getTime() - machineClock().getTime();
  }

  /** Puts the time back to the machine's. */
  reset(): void {
    this.#offsetMilliseconds = 0;
  }
}

export const sameToken = (given: unknown, expected: string): boolean => {
  if (typeof given !== "string") return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

// What a scenario leaves behind and the next must not find: everything the
// site keeps, but for the record of which migrations were run, without which
// the next start would run them again, and the help's search index, which is a
// copy of files and is not made again for each scenario.
const keptAcrossScenarios = [
  "schema_migrations",
  "help_search_pages",
  "help_search_state",
];

const forgetEverything = async (pool: Pool): Promise<void> => {
  const { rows } = await pool.query<{ tablename: string }>(
    `select tablename from pg_tables where schemaname = 'public'`,
  );
  const forgotten = rows
    .map((row) => row.tablename)
    .filter((name) => !keptAcrossScenarios.includes(name));
  if (forgotten.length === 0) return;
  // One statement, so that no table waits on another's foreign key.
  await pool.query(
    `truncate ${forgotten.map((name) => `"${name}"`).join(", ")} restart identity cascade`,
  );
};

/** Mounts the test control on `server`, answering only to `token`. */
export const registerTestControl = (
  server: FastifyInstance,
  token: string,
  clock: SettableClock,
  pool: Pool,
  // What else a scenario may have changed, put back with the rest.
  onReset: () => void = () => undefined,
): void => {
  // Inside its own prefix, so that the guard is one hook and not a check
  // remembered in each route.
  void server.register(
    (scope, _options, done) => {
      scope.addHook("onRequest", async (request, reply) => {
        if (!sameToken(request.headers[testControlHeader], token)) {
          return reply.callNotFound();
        }
        return undefined;
      });

      scope.get("/clock", () => ({ now: clock.now().toISOString() }));

      scope.post("/clock", async (request, reply) => {
        const body = request.body as { now?: unknown } | null;
        if (body === null || typeof body.now !== "string") {
          return reply.code(400).send({ code: "TestControl.NowMissing" });
        }
        const moment = new Date(body.now);
        if (Number.isNaN(moment.getTime())) {
          return reply.code(400).send({ code: "TestControl.NowNotAMoment" });
        }
        clock.set(moment);
        return reply.code(204).send();
      });

      scope.post("/reset", async (_request, reply) => {
        await forgetEverything(pool);
        clock.reset();
        onReset();
        return reply.code(204).send();
      });

      scope.delete("/clock", async (_request, reply) => {
        clock.reset();
        return reply.code(204).send();
      });

      done();
    },
    { prefix: "/__test" },
  );
};
