import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { ReadOnlyTransactionBehaviour } from "../../../../src/infrastructure/database/ReadOnlyTransactionBehaviour.js";
import { TransactionBehaviour } from "../../../../src/infrastructure/database/TransactionBehaviour.js";
import { UnitOfWork } from "../../../../src/infrastructure/database/UnitOfWork.js";
import {
  attempt,
  exampleHandler,
  ExampleQuery,
  mediatorOf,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  asksTheExampleQuery,
  fails,
  meetingOfTwo,
  readNotes,
  state,
  watch,
  writeNote,
  writesTheNote,
} from "../../support/transactions.js";

// Putting the mediator together -----------------------------------------

Given(
  "a mediator whose queries run in a read-only transaction",
  function (this: SpecWorld) {
    const unitOfWork = new UnitOfWork(this.database);
    const scenario = watch(this, unitOfWork);
    mediatorOf(this).addQueryBehaviour(
      new ReadOnlyTransactionBehaviour(unitOfWork),
    );

    // Every example query handler records the connection it was given, so that
    // the shared handler serves a scenario about connections without being
    // written for one.
    this.whatTheExampleHandlerAlsoDoes.push(() => {
      scenario.queryConnections.push(unitOfWork.connection());
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
    const meet = meetingOfTwo();

    mediatorOf(this).handleQuery(ExampleQuery, {
      handle: async (): Promise<string> => {
        // Reaching here is having one: the behaviour opened it on the way in.
        await meet();

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
  "a handler registered for the example command that asks the example query",
  function (this: SpecWorld) {
    asksTheExampleQuery(this);
  },
);

Given(
  "the command's handler asks the example query once it has written the note",
  function (this: SpecWorld) {
    asksTheExampleQuery(this);
  },
);

Given(
  "the command's handler writes the note {string} once the query has answered",
  function (this: SpecWorld, note: string) {
    writesTheNote(this, note);
  },
);

Given(
  "the command's handler fails once the query has answered",
  function (this: SpecWorld) {
    fails(this);
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
