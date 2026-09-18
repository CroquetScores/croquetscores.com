// What the command side and the query side share: the unit of work a scenario
// puts together, what came of using it, a place to keep notes, and the steps
// both features are written in.
//
// Here rather than in specs/support/ because all of it reaches into
// src/infrastructure/, and specs/support/ is loaded by every spec in the
// repository and so may not.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";
import { Client, type Pool, type PoolClient } from "pg";

import {
  UnitOfWork,
  UnitOfWorkRefused,
} from "../../../src/infrastructure/database/UnitOfWork.js";
import {
  ExampleCommand,
  ExampleQuery,
  mediatorOf,
} from "../../support/examples.js";
import type { SpecWorld } from "../../support/world.js";

export interface Watched {
  readonly unitOfWork: UnitOfWork;

  // The connection each request, and each thing a request asked, found itself
  // running on. Comparing connections is how a scenario says two things ran
  // inside the same transaction, or that they did not.
  commandConnection?: PoolClient;
  readonly commandConnections: PoolClient[];
  readonly queryConnections: PoolClient[];
  readerConnection?: PoolClient;
  projectionConnection?: PoolClient;

  // What the example command's handler does when it is called, in the order
  // the scenario asked for it, and the note it wrote.
  commandDoes?: (() => Promise<void>)[];
  noteTheCommandWrote?: string;

  // What was found by whoever looked for notes, and when.
  handlerFoundTheNote?: boolean;
  whatTheQueryFound?: string[];
  secondRead?: string[];
  betweenReads?: () => Promise<void>;

  askingFailure?: unknown;
}

const watched = new WeakMap<SpecWorld, Watched>();

/**
 * The scenario's unit of work, made over its database the first time anything
 * asks. One scenario has one, whichever step names it first: a store and a
 * mediator that each made their own would be serving two different requests,
 * and nothing the store appended would be part of the command that asked it to.
 */
export const unitOfWorkOf = (world: SpecWorld): UnitOfWork => {
  const existing = watched.get(world);
  if (existing !== undefined) return existing.unitOfWork;
  return useUnitOfWork(world, new UnitOfWork(world.database));
};

/**
 * Makes `unitOfWork` the scenario's, for a scenario about something that was
 * put together with one of its own — the application, say — so that the
 * handlers the steps register ask the connection of the unit of work the
 * requests are actually running in.
 */
export const useUnitOfWork = (
  world: SpecWorld,
  unitOfWork: UnitOfWork,
): UnitOfWork => {
  assert.ok(
    !watched.has(world),
    "This scenario already has a unit of work, so another cannot be its.",
  );
  watched.set(world, {
    unitOfWork,
    commandConnections: [],
    queryConnections: [],
  });
  return unitOfWork;
};

export const state = (world: SpecWorld): Watched => {
  const found = watched.get(world);
  assert.ok(
    found !== undefined,
    "This scenario has no unit of work. It starts with a mediator whose commands, or whose queries, run in a transaction, or with an event store.",
  );
  return found;
};

export const readNotes = async (
  connection: PoolClient | Pool | Client,
): Promise<string[]> => {
  const { rows } = await connection.query<{ note: string }>(
    "select note from notes order by note",
  );
  return rows.map((row) => row.note);
};

export const writeNote = async (
  connection: PoolClient | Pool,
  note: string,
): Promise<void> => {
  await connection.query("insert into notes (note) values ($1)", [note]);
};

/**
 * Runs `look` on a connection of its own, outside the scenario's pool.
 *
 * Whatever says what is true once a request has finished asks this way rather
 * than through the pool, because the pool hands back the connection most
 * recently given to it — which is the one whose state is being judged. A
 * connection given back mid-transaction, asked through the pool, reads its own
 * uncommitted writes as though they stood, and reads as busy rather than as the
 * idle-in-transaction it is being caught at. Asked from outside, it is seen as
 * everybody else would see it.
 */
export const fromOutside = async <T>(
  world: SpecWorld,
  look: (outside: Client) => Promise<T>,
): Promise<T> => {
  const outside = new Client({
    connectionString: world.database.options.connectionString,
  });
  await outside.connect();
  try {
    return await look(outside);
  } finally {
    await outside.end();
  }
};

/**
 * What the example command's handler does, made on first mention and added to
 * by each step that says something more about it.
 */
export const commandDoes = (world: SpecWorld): (() => Promise<void>)[] => {
  const scenario = state(world);
  const existing = scenario.commandDoes;
  if (existing !== undefined) return existing;

  const does: (() => Promise<void>)[] = [];
  scenario.commandDoes = does;
  mediatorOf(world).handleCommand({
    handles: ExampleCommand,
    handle: async (): Promise<string> => {
      world.handled.push("example command");
      scenario.commandConnection = scenario.unitOfWork.connection();
      for (const step of does) await step();
      return "recorded";
    },
  });
  return does;
};

// What the example command's handler can be told to do next. Each is written
// once, and called from every step that says it in whatever words suit where
// the step sits in its scenario.

/** Writes `note` on the connection the command is running on. */
export const writesTheNote = (world: SpecWorld, note: string): void => {
  const scenario = state(world);
  scenario.noteTheCommandWrote = note;
  commandDoes(world).push(() =>
    writeNote(scenario.unitOfWork.connection(), note),
  );
};

/** Asks the example query, from inside the command. */
export const asksTheExampleQuery = (world: SpecWorld): void => {
  commandDoes(world).push(async () => {
    await mediatorOf(world).query(new ExampleQuery());
  });
};

/**
 * Fails, with the same failure however it comes to, so that "sending it fails
 * with the handler's own failure" can recognise it coming out.
 */
export const fails = (world: SpecWorld): void => {
  commandDoes(world).push(() => {
    world.plantedFailure = new Error("the example command's handler failed");
    return Promise.reject(world.plantedFailure);
  });
};

/**
 * Somewhere two requests wait for each other, so that they are underway at
 * the same time rather than politely taking turns.
 */
export const meetingOfTwo = (): (() => Promise<void>) => {
  let arrived = 0;
  let bothHere = (): void => {};
  const both = new Promise<void>((resolve) => {
    bothHere = resolve;
  });
  return () => {
    arrived += 1;
    if (arrived === 2) bothHere();
    return both;
  };
};

// Notes ------------------------------------------------------------------

Given("a place to keep notes", async function (this: SpecWorld) {
  await this.database.query("create table notes (note text not null)");
});

Given(
  "a handler registered for the example command that writes the note {string}",
  function (this: SpecWorld, note: string) {
    writesTheNote(this, note);
  },
);

// "There" means committed, and so there for anybody who looks.
Then(
  "the note {string} is there",
  async function (this: SpecWorld, note: string) {
    const notes = await fromOutside(this, readNotes);
    assert.ok(notes.includes(note), `The notes are ${inspect(notes)}.`);
  },
);

Then("no notes are there", async function (this: SpecWorld) {
  assert.deepEqual(await fromOutside(this, readNotes), []);
});

// The connection ---------------------------------------------------------

When("the connection is asked for", function (this: SpecWorld) {
  const scenario = state(this);
  try {
    scenario.unitOfWork.connection();
    scenario.askingFailure = undefined;
  } catch (failure) {
    scenario.askingFailure = failure;
  }
});

Then(
  "asking is refused with {string}",
  function (this: SpecWorld, code: string) {
    const failure = state(this).askingFailure;
    assert.ok(
      failure instanceof UnitOfWorkRefused,
      `Expected a refusal, and got ${failure === undefined ? "a connection" : inspect(failure)}.`,
    );
    assert.equal(failure.code, code);
  },
);

Then("every connection has been given back", function (this: SpecWorld) {
  const pool = this.database;
  assert.equal(pool.waitingCount, 0, "Something is still waiting for one.");
  assert.equal(
    pool.totalCount - pool.idleCount,
    0,
    `${pool.totalCount - pool.idleCount} connection(s) never came back.`,
  );
});

Then(
  "no connection is left in a transaction",
  async function (this: SpecWorld) {
    const left = await fromOutside(this, async (outside) => {
      const { rows } = await outside.query<{ left: number }>(
        `select count(*)::int as "left"
           from pg_stat_activity
          where datname = current_database()
            and pid <> pg_backend_pid()
            and state in ('idle in transaction', 'idle in transaction (aborted)')`,
      );
      return rows[0]?.left;
    });
    assert.equal(left, 0, "A connection went back mid-transaction.");
  },
);
