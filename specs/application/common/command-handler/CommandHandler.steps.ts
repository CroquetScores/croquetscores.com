import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Command } from "../../../../src/application/common/Command.js";
import type { RequestType } from "../../../../src/application/common/Mediator.js";
import {
  askedAt,
  attempt,
  ExampleCommand,
  exampleCommandHandler,
  exampleHandler,
  ExampleQuery,
  mediatorOf,
  NotARequest,
  OtherCommand,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

// Making a handler -------------------------------------------------------

Given("a handler that handles the example command", function (this: SpecWorld) {
  this.unregisteredHandler = {
    side: "command",
    handler: exampleCommandHandler(
      ExampleCommand,
      exampleHandler(this, "example command", "handled"),
    ),
  };
});

Given(
  "a handler that handles the example command and answers {string}",
  function (this: SpecWorld, answer: string) {
    this.unregisteredHandler = {
      side: "command",
      handler: exampleCommandHandler(
        ExampleCommand,
        exampleHandler(this, "example command", answer),
      ),
    };
  },
);

// The cast is the mistake: a handler written for a query, dressed up as a
// command's, which the compiler would refuse and a cast talks it out of.
Given(
  "a handler that handles the example query rather than a command",
  function (this: SpecWorld) {
    this.unregisteredHandler = {
      side: "command",
      handler: exampleCommandHandler(
        ExampleQuery as unknown as RequestType<Command<string>>,
        exampleHandler(this, "example query", "found"),
      ),
    };
  },
);

// The same mistake with something that is no request at all, which is what a
// door that only turned away the other side's requests would let through.
Given(
  "a handler for commands that handles something that is not a request",
  function (this: SpecWorld) {
    this.unregisteredHandler = {
      side: "command",
      handler: exampleCommandHandler(
        NotARequest as unknown as RequestType<Command<string>>,
        exampleHandler(this, "not a request", "never answered"),
      ),
    };
  },
);

// Registering it, and handing it things ----------------------------------

// Whichever side the handler was made for is the side it is registered on:
// what is being asked is whether that side will have it.
When("the handler is registered", function (this: SpecWorld) {
  const made = this.unregisteredHandler;
  assert.ok(made !== undefined, "No handler has been made.");
  try {
    if (made.side === "command") mediatorOf(this).handleCommand(made.handler);
    else mediatorOf(this).handleQuery(made.handler);
  } catch (failure) {
    this.failure = failure;
  }
});

When("the other command is sent", async function (this: SpecWorld) {
  await attempt(this, () => mediatorOf(this).send(new OtherCommand(askedAt)));
});
