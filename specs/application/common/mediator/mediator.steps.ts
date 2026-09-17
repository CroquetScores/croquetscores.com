import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { Behaviour } from "../../../../src/application/common/Behaviour.js";
import type { Command } from "../../../../src/application/common/Command.js";
import {
  Mediator,
  RequestRefused,
} from "../../../../src/application/common/Mediator.js";
import type { Query } from "../../../../src/application/common/Query.js";
import type { SpecWorld } from "../../../support/world.js";

// Requests that exist only to exercise the mediator. They mean nothing, which
// is the point: what is being specified is how any request is handed on.
class ExampleCommand implements Command<string> {
  declare readonly _result?: string;
  constructor(readonly requestedAt: Date) {}
}

class OtherCommand implements Command<string> {
  declare readonly _result?: string;
  constructor(readonly requestedAt: Date) {}
}

class ExampleQuery implements Query<string> {
  declare readonly _result?: string;
}

// A fixed moment. Nothing here reads a clock, any more than the application
// does.
const askedAt = new Date("2026-09-17T09:00:00Z");

const mediatorOf = (world: SpecWorld): Mediator =>
  (world.mediator ??= new Mediator());

// A handler that records that it was called, and answers or fails as told.
const handler = (
  world: SpecWorld,
  name: string,
  answer: string,
  fails = false,
) => ({
  handle: (): Promise<string> => {
    world.handled.push(name);
    world.happened.push("the handler");
    if (fails) {
      world.plantedFailure = new Error(`${name} failed`);
      return Promise.reject(world.plantedFailure);
    }
    return Promise.resolve(answer);
  },
});

// A behaviour that records passing a request in, the answer back out, and a
// failure back out.
const behaviour = (world: SpecWorld, name: string): Behaviour => ({
  invoke: async (_request, next) => {
    world.happened.push(`${name}, going in`);
    try {
      const answer = await next();
      world.happened.push(`${name}, coming out`);
      return answer;
    } catch (failure) {
      world.happened.push(`${name}, saw the failure`);
      throw failure;
    }
  },
});

// What came of handing a request in: the answer, or whatever it was refused or
// failed with.
const attempt = async (
  world: SpecWorld,
  handing: () => Promise<unknown>,
): Promise<void> => {
  try {
    world.answer = await handing();
  } catch (failure) {
    world.failure = failure;
  }
};

const refusal = (world: SpecWorld): RequestRefused => {
  assert.ok(
    world.failure instanceof RequestRefused,
    `Expected a refusal, and got ${world.failure === undefined ? "an answer" : inspect(world.failure)}.`,
  );
  return world.failure;
};

// Registering ------------------------------------------------------------

Given(
  "a handler registered for the example command",
  function (this: SpecWorld) {
    mediatorOf(this).handleCommand(
      ExampleCommand,
      handler(this, "example command", "handled"),
    );
  },
);

Given(
  "a handler registered for the example command that answers {string}",
  function (this: SpecWorld, answer: string) {
    mediatorOf(this).handleCommand(
      ExampleCommand,
      handler(this, "example command", answer),
    );
  },
);

Given(
  "a handler registered for the example command that fails",
  function (this: SpecWorld) {
    mediatorOf(this).handleCommand(
      ExampleCommand,
      handler(this, "example command", "never answered", true),
    );
  },
);

Given("a handler registered for the other command", function (this: SpecWorld) {
  mediatorOf(this).handleCommand(
    OtherCommand,
    handler(this, "other command", "handled"),
  );
});

Given("a handler registered for the example query", function (this: SpecWorld) {
  mediatorOf(this).handleQuery(
    ExampleQuery,
    handler(this, "example query", "found"),
  );
});

Given(
  "a handler registered for the example query that answers {string}",
  function (this: SpecWorld, answer: string) {
    mediatorOf(this).handleQuery(
      ExampleQuery,
      handler(this, "example query", answer),
    );
  },
);

Given(
  "no handler registered for the example command",
  function (this: SpecWorld) {
    mediatorOf(this);
  },
);

Given(
  "no handler registered for the example query",
  function (this: SpecWorld) {
    mediatorOf(this);
  },
);

When(
  "another handler is registered for the example command",
  function (this: SpecWorld) {
    try {
      mediatorOf(this).handleCommand(
        ExampleCommand,
        handler(this, "second handler", "handled"),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

When(
  "another handler is registered for the example query",
  function (this: SpecWorld) {
    try {
      mediatorOf(this).handleQuery(
        ExampleQuery,
        handler(this, "second handler", "found"),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Given(
  "a command behaviour called {string}",
  function (this: SpecWorld, name: string) {
    mediatorOf(this).addCommandBehaviour(behaviour(this, name));
  },
);

Given(
  "a query behaviour called {string}",
  function (this: SpecWorld, name: string) {
    mediatorOf(this).addQueryBehaviour(behaviour(this, name));
  },
);

Given(
  "a command behaviour that answers {string} without going further",
  function (this: SpecWorld, answer: string) {
    mediatorOf(this).addCommandBehaviour({
      invoke: <T>() => Promise.resolve(answer as T),
    });
  },
);

// Handing requests in ----------------------------------------------------

When("the example command is sent", async function (this: SpecWorld) {
  await attempt(this, () => mediatorOf(this).send(new ExampleCommand(askedAt)));
});

When("the example query is asked", async function (this: SpecWorld) {
  await attempt(this, () => mediatorOf(this).query(new ExampleQuery()));
});

When(
  "the example query is sent as though it were a command",
  async function (this: SpecWorld) {
    const query = new ExampleQuery() as unknown as Command<string>;
    await attempt(this, () => mediatorOf(this).send(query));
  },
);

When(
  "the example command is asked as though it were a query",
  async function (this: SpecWorld) {
    await attempt(this, () =>
      mediatorOf(this).query(new ExampleCommand(askedAt)),
    );
  },
);

When(
  "the example command is sent without saying when it was asked for",
  async function (this: SpecWorld) {
    const command = new ExampleCommand(undefined as unknown as Date);
    await attempt(this, () => mediatorOf(this).send(command));
  },
);

// What came of it --------------------------------------------------------

Then(
  "the example command's handler has handled it",
  function (this: SpecWorld) {
    assert.deepEqual(this.handled, ["example command"]);
  },
);

Then("the answer is {string}", function (this: SpecWorld, answer: string) {
  assert.equal(
    this.failure,
    undefined,
    `Expected an answer, and it failed: ${inspect(this.failure)}`,
  );
  assert.equal(this.answer, answer);
});

Then(
  "the other command's handler has not been called",
  function (this: SpecWorld) {
    assert.ok(!this.handled.includes("other command"));
  },
);

Then(
  "the example command's handler has not been called",
  function (this: SpecWorld) {
    assert.ok(!this.handled.includes("example command"));
  },
);

Then(
  "the example query's handler has not been called",
  function (this: SpecWorld) {
    assert.ok(!this.handled.includes("example query"));
  },
);

Then(
  "registering it is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(refusal(this).code, code);
  },
);

Then("it is refused with {string}", function (this: SpecWorld, code: string) {
  assert.equal(refusal(this).code, code);
});

Then(
  "sending it fails with the handler's own failure",
  function (this: SpecWorld) {
    assert.ok(
      this.plantedFailure !== undefined,
      "The handler was not made to fail.",
    );
    assert.equal(
      this.failure,
      this.plantedFailure,
      "The failure was not the handler's own.",
    );
  },
);

Then(
  "the first thing to happen is {string}",
  function (this: SpecWorld, what: string) {
    assert.equal(this.happened[0], what);
    this.happenedChecked = 1;
  },
);

Then(
  "the next thing to happen is {string}",
  function (this: SpecWorld, what: string) {
    assert.equal(this.happened[this.happenedChecked], what);
    this.happenedChecked += 1;
  },
);

Then("nothing else happens", function (this: SpecWorld) {
  assert.deepEqual(this.happened.slice(this.happenedChecked), []);
});

Then(
  "{string} saw the failure on its way out",
  function (this: SpecWorld, name: string) {
    assert.ok(
      this.happened.includes(`${name}, saw the failure`),
      `${name} did not see the failure.`,
    );
  },
);

Then(
  "nothing called {string} happens",
  function (this: SpecWorld, name: string) {
    assert.deepEqual(
      this.happened.filter((what) => what.startsWith(`${name},`)),
      [],
    );
  },
);
