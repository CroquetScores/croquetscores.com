import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ExampleCommand, ExampleQuery } from "../../support/examples.js";
import type { SpecWorld } from "../../support/world.js";
import { builtFor } from "../support/application.js";

// The pool is made empty and opens a connection only when one is asked for, so
// one it has never opened is one nothing took.
Then("no connection was taken for it", function (this: SpecWorld) {
  const { pool } = builtFor(this).application;
  assert.equal(
    pool.totalCount,
    0,
    `The request took ${pool.totalCount} connection(s) before it was refused.`,
  );
});

// The example routes reach the mediator the way any route does, through the
// server they were added to, rather than being handed the application's; and
// a command they send says when the request arrived, as any route's does.
Given(
  "an example route that sends the example command",
  function (this: SpecWorld) {
    const scenario = builtFor(this);
    scenario.application.server.post("/example", (request) =>
      request.server.mediator.send(new ExampleCommand(request.requestedAt)),
    );
    scenario.route = { method: "POST", url: "/example" };
  },
);

Given(
  "an example route that asks the example query",
  function (this: SpecWorld) {
    const scenario = builtFor(this);
    scenario.application.server.get("/example", (request) =>
      request.server.mediator.query(new ExampleQuery()),
    );
    scenario.route = { method: "GET", url: "/example" };
  },
);

When("the example route is requested", async function (this: SpecWorld) {
  const scenario = builtFor(this);
  assert.ok(scenario.route !== undefined, "There is no example route.");
  scenario.response = await scenario.application.server.inject(scenario.route);
});

Then("the route answers {string}", function (this: SpecWorld, answer: string) {
  const response = builtFor(this).response;
  assert.ok(response !== undefined, "The example route was not requested.");
  assert.equal(
    response.statusCode,
    200,
    `The route answered ${response.statusCode}: ${response.body}`,
  );
  assert.equal(response.body, answer);
});
