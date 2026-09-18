import { Given, When } from "@cucumber/cucumber";

import type { RequestType } from "../../../../src/application/common/Mediator.js";
import type { Query } from "../../../../src/application/common/Query.js";
import {
  attempt,
  ExampleCommand,
  exampleHandler,
  ExampleQuery,
  exampleQueryHandler,
  mediatorOf,
  NotARequest,
  OtherQuery,
} from "../../../support/examples.js";
import type { SpecWorld } from "../../../support/world.js";

// Making a handler -------------------------------------------------------

Given("a handler that handles the example query", function (this: SpecWorld) {
  this.unregisteredHandler = {
    side: "query",
    handler: exampleQueryHandler(
      ExampleQuery,
      exampleHandler(this, "example query", "found"),
    ),
  };
});

Given(
  "a handler that handles the example query and answers {string}",
  function (this: SpecWorld, answer: string) {
    this.unregisteredHandler = {
      side: "query",
      handler: exampleQueryHandler(
        ExampleQuery,
        exampleHandler(this, "example query", answer),
      ),
    };
  },
);

// The cast is the mistake: a handler written for a command, dressed up as a
// query's, which the compiler would refuse and a cast talks it out of.
Given(
  "a handler that handles the example command rather than a query",
  function (this: SpecWorld) {
    this.unregisteredHandler = {
      side: "query",
      handler: exampleQueryHandler(
        ExampleCommand as unknown as RequestType<Query<string>>,
        exampleHandler(this, "example command", "handled"),
      ),
    };
  },
);

// The same mistake with something that is no request at all, which is what a
// door that only turned away the other side's requests would let through.
Given(
  "a handler for queries that handles something that is not a request",
  function (this: SpecWorld) {
    this.unregisteredHandler = {
      side: "query",
      handler: exampleQueryHandler(
        NotARequest as unknown as RequestType<Query<string>>,
        exampleHandler(this, "not a request", "never answered"),
      ),
    };
  },
);

// Asking -----------------------------------------------------------------

When("the other query is asked", async function (this: SpecWorld) {
  await attempt(this, () => mediatorOf(this).query(new OtherQuery()));
});
