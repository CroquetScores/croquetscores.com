import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";
import { Client, type Pool, type PoolClient } from "pg";

import { ReadOnlyTransactionBehaviour } from "../../../../src/infrastructure/database/ReadOnlyTransactionBehaviour.js";
import { TransactionBehaviour } from "../../../../src/infrastructure/database/TransactionBehaviour.js";
import {
  UnitOfWork,
  UnitOfWorkRefused,
} from "../../../../src/infrastructure/database/UnitOfWork.js";
import {
  attempt,
  ExampleCommand,
  exampleHandler,
  ExampleQuery,
  mediatorOf,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

// What the scenario set up, and what came of it. Kept here rather than on the
// world because the world is loaded by every spec in the repository and so may
// not name anything from src/infrastructure/, which all of this is.
interface Watched {
  readonly unitOfWork: UnitOfWork;
  // The connection each request found itself running on, in the order the
  // requests asked for it. Comparing connections is how a scenario says two
  // things ran inside the same transaction, or that they did not.
  readonly queryConnections: PoolClient[];
  commandConnection?: PoolClient;
  readerConnection?: PoolClient;
  // What the example command's handler does when it is called, in the order the
  // scenario asked for it.
  commandDoes?: (() => Promise<void>)[];
  noteTheCommandWrote?: string;
  // The second of two reads by a query that reads twice, and whatever the
  // scenario arranged to happen in between them.
  secondRead?: string[];
  betweenReads?: () => Promise<void>;
  whatTheQueryFound?: string[];
  askingFailure?: unknown;
}

const watched = new WeakMap<SpecWorld, Watched>();

const state = (world: SpecWorld): Watched => {
  const found = watched.get(world);
  assert.ok(
    found !== undefined,
    "This scenario has no mediator whose queries run in a read-only transaction.",
  );
  return found;
};

const readNotes = async (connection: PoolClient | Pool): Promise<string[]> => {
  const { rows } = await connection.query<{ note: string }>(
    "select note from notes order by note",
  );
  return rows.map((row) => row.note);
};

const writeNote = async (
  connection: PoolClient | Pool,
  note: string,
): Promise<void> => {
  await connection.query("insert into notes (note) values ($1)", [note]);
};

// The example command's handler, made on first mention and added to by each
// step that says something more about what it does.
const commandDoes = (world: SpecWorld): (() => Promise<void>)[] => {
  const scenario = state(world);
  const existing = scenario.commandDoes;
  if (existing !== undefined) return existing;

  const does: (() => Promise<void>)[] = [];
  scenario.commandDoes = does;
  mediatorOf(world).handleCommand(ExampleCommand, {
    handle: async (): Promise<string> => {
      world.handled.push("example command");
      scenario.commandConnection = scenario.unitOfWork.connection();
      for (const step of does) await step();
      return "recorded";
    },
  });
  return does;
};

// Putting the mediator together -----------------------------------------

Given(
  "a mediator whose queries run in a read-only transaction",
  function (this: SpecWorld) {
    const unitOfWork = new UnitOfWork(this.database);
    watched.set(this, { unitOfWork, queryConnections: [] });
    mediatorOf(this).addQueryBehaviour(
      new ReadOnlyTransactionBehaviour(unitOfWork),
    );

    // Every example query handler records the connection it was given, so that
    // the shared handler serves a scenario about connections without being
    // written for one.
    this.whatTheExampleHandlerAlsoDoes.push(() => {
      state(this).queryConnections.push(unitOfWork.connection());
      return Promise.resolve();
    });
  },
);

Given(
  "the mediator's commands run in a transaction",
  function (this: SpecWorld) {
    mediatorOf(this).addCommandBehaviour(
      new TransactionBehaviour(state(this).unitOfWork),
    );
  },
);

Given("a place to keep notes", async function (this: SpecWorld) {
  await this.database.query("create table notes (note text not null)");
});

// What the handlers do ---------------------------------------------------

Given("an example reader the handler asks", function (this: SpecWorld) {
  const scenario = state(this);
  this.whatTheExampleHandlerAlsoDoes.push(async () => {
    const connection = scenario.unitOfWork.connection();
    scenario.readerConnection = connection;
    await connection.query("select 1");
  });
});

Given(
  "a handler registered for the example query that reads the notes twice",
  function (this: SpecWorld) {
    const scenario = state(this);
    mediatorOf(this).handleQuery(ExampleQuery, {
      handle: async (): Promise<string> => {
        const connection = scenario.unitOfWork.connection();
        scenario.queryConnections.push(connection);

        // The first read is what takes the snapshot — repeatable read does not
        // take one until a statement asks for it — so it is the thing the
        // second read is being held to, not a formality before it.
        await readNotes(connection);
        if (scenario.betweenReads !== undefined) await scenario.betweenReads();
        scenario.secondRead = await readNotes(connection);
        return "read";
      },
    });
  },
);

Given(
  "the note {string} is written on another connection between the two reads",
  function (this: SpecWorld, note: string) {
    const pool = this.database;
    // The query has a connection of the pool's checked out, so this gets
    // another: a write by somebody else, committed, while the query is running.
    state(this).betweenReads = () => writeNote(pool, note);
  },
);

Given(
  "a handler registered for the example query that writes the note {string}",
  function (this: SpecWorld, note: string) {
    const scenario = state(this);
    mediatorOf(this).handleQuery(ExampleQuery, {
      handle: async (): Promise<string> => {
        const connection = scenario.unitOfWork.connection();
        scenario.queryConnections.push(connection);
        await writeNote(connection, note);
        return "read";
      },
    });
  },
);

Given(
  "a handler registered for the example query that looks for the note",
  function (this: SpecWorld) {
    const scenario = state(this);
    mediatorOf(this).handleQuery(ExampleQuery, {
      handle: async (): Promise<string> => {
        const connection = scenario.unitOfWork.connection();
        scenario.queryConnections.push(connection);
        scenario.whatTheQueryFound = await readNotes(connection);
        return "found";
      },
    });
  },
);

Given(
  "a handler registered for the example query that fails",
  function (this: SpecWorld) {
    mediatorOf(this).handleQuery(
      ExampleQuery,
      exampleHandler(this, "example query", "never answered", true),
    );
  },
);

Given(
  "a handler registered for the example query that waits until both queries have a connection",
  function (this: SpecWorld) {
    const scenario = state(this);
    let arrived = 0;
    let bothHaveOne = (): void => {};
    const both = new Promise<void>((resolve) => {
      bothHaveOne = resolve;
    });

    mediatorOf(this).handleQuery(ExampleQuery, {
      handle: async (): Promise<string> => {
        // Reaching here is having one: the behaviour opened it on the way in.
        arrived += 1;
        if (arrived === 2) bothHaveOne();
        await both;

        // Asked for only once both are underway, which is the whole point. Were
        // the connection kept in a field rather than followed along with the
        // request, the second query to start would have overwritten the first's
        // by now and both would be handed the same one — and a query asking
        // before waiting would not notice, because at that moment the field
        // still held its own.
        scenario.queryConnections.push(scenario.unitOfWork.connection());
        return "found";
      },
    });
  },
);

Given(
  "a handler registered for the example command that writes the note {string}",
  function (this: SpecWorld, note: string) {
    const scenario = state(this);
    scenario.noteTheCommandWrote = note;
    commandDoes(this).push(() =>
      writeNote(scenario.unitOfWork.connection(), note),
    );
  },
);

Given(
  "a handler registered for the example command that asks the example query",
  function (this: SpecWorld) {
    commandDoes(this).push(async () => {
      await mediatorOf(this).query(new ExampleQuery());
    });
  },
);

Given(
  "the command's handler asks the example query once it has written the note",
  function (this: SpecWorld) {
    commandDoes(this).push(async () => {
      await mediatorOf(this).query(new ExampleQuery());
    });
  },
);

Given(
  "the command's handler writes the note {string} once the query has answered",
  function (this: SpecWorld, note: string) {
    const scenario = state(this);
    scenario.noteTheCommandWrote = note;
    commandDoes(this).push(() =>
      writeNote(scenario.unitOfWork.connection(), note),
    );
  },
);

Given(
  "the command's handler fails once the query has answered",
  function (this: SpecWorld) {
    commandDoes(this).push(() => {
      this.plantedFailure = new Error("the example command's handler failed");
      return Promise.reject(this.plantedFailure);
    });
  },
);

// Handing requests in ----------------------------------------------------

When(
  "two example queries are asked at the same time",
  async function (this: SpecWorld) {
    const mediator = mediatorOf(this);
    await attempt(this, () =>
      Promise.all([
        mediator.query(new ExampleQuery()),
        mediator.query(new ExampleQuery()),
      ]),
    );
  },
);

When("the connection is asked for", function (this: SpecWorld) {
  const scenario = state(this);
  try {
    scenario.unitOfWork.connection();
    scenario.askingFailure = undefined;
  } catch (failure) {
    scenario.askingFailure = failure;
  }
});

// What came of it --------------------------------------------------------

Then(
  "the handler and the reader ran on the same connection",
  function (this: SpecWorld) {
    const scenario = state(this);
    const handlers = scenario.queryConnections.at(-1);
    assert.ok(handlers !== undefined, "The query's handler never ran.");
    assert.ok(scenario.readerConnection !== undefined, "The reader never ran.");
    assert.equal(
      scenario.readerConnection,
      handlers,
      "The reader was on a connection of its own.",
    );
  },
);

Then(
  "the command and the query ran on the same connection",
  function (this: SpecWorld) {
    const scenario = state(this);
    const query = scenario.queryConnections.at(-1);
    assert.ok(
      scenario.commandConnection !== undefined,
      "The command's handler never ran.",
    );
    assert.ok(query !== undefined, "The query's handler never ran.");
    assert.equal(
      query,
      scenario.commandConnection,
      "The query took a connection of its own.",
    );
  },
);

Then(
  "the two queries ran on different connections",
  function (this: SpecWorld) {
    const [first, second] = state(this).queryConnections;
    assert.ok(
      first !== undefined && second !== undefined,
      "Both queries did not run.",
    );
    assert.notEqual(first, second, "Both queries were on one connection.");
  },
);

Then(
  "the query did not find the note {string}",
  function (this: SpecWorld, note: string) {
    const read = state(this).secondRead;
    assert.ok(read !== undefined, "The query did not read twice.");
    assert.ok(
      !read.includes(note),
      `The query's second read saw ${inspect(read)}.`,
    );
  },
);

Then("the query found the note", function (this: SpecWorld) {
  const scenario = state(this);
  const found = scenario.whatTheQueryFound;
  assert.ok(found !== undefined, "The query never looked.");
  assert.ok(
    scenario.noteTheCommandWrote !== undefined,
    "The command wrote no note for the query to find.",
  );
  assert.ok(
    found.includes(scenario.noteTheCommandWrote),
    `The query found ${inspect(found)}.`,
  );
});

Then(
  "the note {string} is there",
  async function (this: SpecWorld, note: string) {
    assert.ok((await readNotes(this.database)).includes(note));
  },
);

Then("no notes are there", async function (this: SpecWorld) {
  assert.deepEqual(await readNotes(this.database), []);
});

// 25006 is read_only_sql_transaction: Postgres refusing the write, which is
// the point. The code rather than the sentence, because the sentence is for
// whoever reads the log.
Then(
  "asking fails because the transaction is read-only",
  function (this: SpecWorld) {
    assert.ok(
      this.failure !== undefined,
      "Asking answered rather than failing.",
    );
    assert.equal(
      (this.failure as { code?: unknown }).code,
      "25006",
      `Asking failed with ${inspect(this.failure)}.`,
    );
  },
);

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

// Asked on a connection of its own rather than through the pool being checked.
// The pool would hand back one of the connections in question — quite possibly
// the very one — and a connection busy running this query reads as "active"
// rather than the "idle in transaction" it is being caught at, so the check
// would clear the culprit by asking it.
Then(
  "no connection is left in a transaction",
  async function (this: SpecWorld) {
    const outside = new Client({
      connectionString: this.database.options.connectionString,
    });
    await outside.connect();
    try {
      const { rows } = await outside.query<{ left: number }>(
        `select count(*)::int as "left"
           from pg_stat_activity
          where datname = current_database()
            and pid <> pg_backend_pid()
            and state in ('idle in transaction', 'idle in transaction (aborted)')`,
      );
      assert.equal(rows[0]?.left, 0, "A connection went back mid-transaction.");
    } finally {
      await outside.end();
    }
  },
);
