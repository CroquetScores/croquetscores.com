import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { Behaviour } from "../../../../src/application/common/Behaviour.js";
import { TransactionBehaviour } from "../../../../src/infrastructure/database/TransactionBehaviour.js";
import {
  UnitOfWork,
  UnitOfWorkRefused,
} from "../../../../src/infrastructure/database/UnitOfWork.js";
import {
  askedAt,
  attempt,
  ExampleCommand,
  mediatorOf,
  OtherCommand,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  commandDoes,
  fails,
  meetingOfTwo,
  readNotes,
  state,
  watch,
  writeNote,
} from "../../support/transactions.js";

const sendingTheOtherCommand =
  (world: SpecWorld) => async (): Promise<void> => {
    await mediatorOf(world).send(new OtherCommand(askedAt));
  };

// Putting the mediator together -----------------------------------------

Given(
  "a mediator whose commands run in a transaction",
  function (this: SpecWorld) {
    const unitOfWork = new UnitOfWork(this.database);
    watch(this, unitOfWork);
    mediatorOf(this).addCommandBehaviour(new TransactionBehaviour(unitOfWork));
  },
);

// What the handler does --------------------------------------------------

Given("the handler fails after writing the note", function (this: SpecWorld) {
  fails(this);
});

Given(
  "the handler fails once the projection has run",
  function (this: SpecWorld) {
    fails(this);
  },
);

Given(
  "the handler looks for the note on another connection before it answers",
  function (this: SpecWorld) {
    const scenario = state(this);
    // The command has a connection of the pool's checked out, so this gets
    // another: somebody else looking, while the command is still running.
    const pool = this.database;
    commandDoes(this).push(async () => {
      const note = scenario.noteTheCommandWrote;
      assert.ok(note !== undefined, "The handler wrote no note to look for.");
      scenario.handlerFoundTheNote = (await readNotes(pool)).includes(note);
    });
  },
);

// The handler runs it, and it asks for the connection rather than being
// handed the handler's — which is what a projection written anywhere else in
// the application will do, and so what is being held to account here.
Given(
  "an example projection that writes the note {string}",
  function (this: SpecWorld, note: string) {
    const scenario = state(this);
    commandDoes(this).push(async () => {
      const connection = scenario.unitOfWork.connection();
      scenario.projectionConnection = connection;
      await writeNote(connection, note);
    });
  },
);

Given(
  "a handler registered for the example command that sends the other command",
  function (this: SpecWorld) {
    commandDoes(this).push(sendingTheOtherCommand(this));
  },
);

Given(
  "the handler sends the other command once it has written the note",
  function (this: SpecWorld) {
    commandDoes(this).push(sendingTheOtherCommand(this));
  },
);

Given(
  "a handler registered for the example command that waits until both commands have a connection",
  function (this: SpecWorld) {
    const scenario = state(this);
    const meet = meetingOfTwo();

    mediatorOf(this).handleCommand(ExampleCommand, {
      handle: async (): Promise<string> => {
        // Reaching here is having one: the behaviour opened it on the way in.
        await meet();

        // Asked for only once both are underway, for the reason the query
        // side gives: a connection kept in a field would by now have been
        // overwritten by whichever command started second.
        scenario.commandConnections.push(scenario.unitOfWork.connection());
        return "recorded";
      },
    });
  },
);

// Making the end of the transaction fail --------------------------------

// A constraint held back until the end: unique, but checked at commit rather
// than as each row is written. Two rows breaking it are written inside the
// transaction once the handler has answered, so the handler answers and the
// commit is what fails. An ordinary constraint would not do, because the write
// would fail where it was made and the commit would never be reached.
//
// Written by a behaviour inside the transaction's, rather than by the handler,
// so that it fails the commit whichever handler the scenario registered.
Given("the commit will fail", async function (this: SpecWorld) {
  const scenario = state(this);
  await this.database.query(
    `create table held_back (
       id int,
       constraint held_back_once unique (id) deferrable initially deferred
     )`,
  );

  const breaksItsConstraint: Behaviour = {
    invoke: async <T>(_request: unknown, next: () => Promise<T>) => {
      const answer = await next();
      await scenario.unitOfWork
        .connection()
        .query("insert into held_back (id) values (1), (1)");
      return answer;
    },
  };
  mediatorOf(this).addCommandBehaviour(breaksItsConstraint);
});

// The connection is taken away once the handler has failed and before the
// transaction behaviour can roll back on it, so the rollback has nothing to run
// on. It waits until the connection has actually gone: a rollback sent while
// the backend was still on its way out could succeed, and the scenario would
// then pass without a rollback ever having failed.
Given("the rollback will fail", function (this: SpecWorld) {
  const scenario = state(this);
  const pool = this.database;

  const takesTheConnectionAway: Behaviour = {
    invoke: async <T>(_request: unknown, next: () => Promise<T>) => {
      try {
        return await next();
      } catch (failure) {
        const connection = scenario.unitOfWork.connection();
        const { rows } = await connection.query<{ pid: number }>(
          "select pg_backend_pid() as pid",
        );
        const pid = rows[0]?.pid;
        assert.ok(
          pid !== undefined,
          "The connection would not say who it was.",
        );

        const gone = new Promise<void>((resolve) => {
          connection.once("end", () => resolve());
        });
        await pool.query("select pg_terminate_backend($1)", [pid]);
        await gone;
        throw failure;
      }
    },
  };
  mediatorOf(this).addCommandBehaviour(takesTheConnectionAway);
});

// Handing requests in ----------------------------------------------------

When(
  "two example commands are sent at the same time",
  async function (this: SpecWorld) {
    const mediator = mediatorOf(this);
    await attempt(this, () =>
      Promise.all([
        mediator.send(new ExampleCommand(askedAt)),
        mediator.send(new ExampleCommand(askedAt)),
      ]),
    );
  },
);

// What came of it --------------------------------------------------------

Then("the handler did not find the note", function (this: SpecWorld) {
  const found = state(this).handlerFoundTheNote;
  assert.ok(found !== undefined, "The handler never looked.");
  assert.equal(
    found,
    false,
    "Another connection saw the note before the command had committed.",
  );
});

Then(
  "the handler and the projection ran on the same connection",
  function (this: SpecWorld) {
    const scenario = state(this);
    assert.ok(
      scenario.commandConnection !== undefined,
      "The handler never ran.",
    );
    assert.ok(
      scenario.projectionConnection !== undefined,
      "The projection never ran.",
    );
    assert.equal(
      scenario.projectionConnection,
      scenario.commandConnection,
      "The projection was on a connection of its own.",
    );
  },
);

Then(
  "the two commands ran on different connections",
  function (this: SpecWorld) {
    const [first, second] = state(this).commandConnections;
    assert.ok(
      first !== undefined && second !== undefined,
      "Both commands did not run.",
    );
    assert.notEqual(first, second, "Both commands were on one connection.");
  },
);

// 23505 is unique_violation, on the constraint the commit was set up to fail
// on. Only the commit checks that constraint, so a failure naming it is the
// commit's own. The answer is looked at too: a sender told both that it
// failed and what the handler said would not know which to believe.
Then(
  "sending it fails with the commit's own failure",
  function (this: SpecWorld) {
    assert.equal(
      this.answer,
      undefined,
      `The sender was answered ${inspect(this.answer)}.`,
    );
    const failure = this.failure as
      { code?: unknown; constraint?: unknown } | undefined;
    assert.ok(
      failure !== undefined,
      "Sending it answered rather than failing.",
    );
    assert.equal(failure.code, "23505", `It failed with ${inspect(failure)}.`);
    assert.equal(failure.constraint, "held_back_once");
  },
);

Then(
  "sending it is refused with {string}",
  function (this: SpecWorld, code: string) {
    const failure = this.failure;
    assert.ok(
      failure instanceof UnitOfWorkRefused,
      `Expected a refusal, and got ${failure === undefined ? "an answer" : inspect(failure)}.`,
    );
    assert.equal(failure.code, code);
  },
);
