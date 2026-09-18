import { After, Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  loadConfig,
  loadEnvFile,
} from "../../../src/infrastructure/config/Config.js";
import { buildApplication, type Application } from "../../../src/web/server.js";
import type { LightMyRequestResponse } from "fastify";
import {
  askedAt,
  ExampleCommand,
  ExampleQuery,
} from "../../support/examples.js";
import type { SpecWorld } from "../../support/world.js";
import { useUnitOfWork } from "../../infrastructure/support/transactions.js";

interface Built {
  readonly application: Application;
  route?: { method: "GET" | "POST"; url: string };
  response?: LightMyRequestResponse;
}

const built = new WeakMap<SpecWorld, Built>();

const builtFor = (world: SpecWorld): Built => {
  const found = built.get(world);
  assert.ok(
    found !== undefined,
    "This scenario has not built the application.",
  );
  return found;
};

// The application as the server builds it, over the scenario's own database.
// The steps every pipeline feature is written in keep the mediator, the
// validation behaviour and the unit of work on the scenario, and here they are
// handed the application's: so "the example command is sent" goes through what
// the composition root put together, and nothing a step assembled for itself.
Given("the application is built", async function (this: SpecWorld) {
  const databaseUrl = this.database.options.connectionString;
  assert.ok(databaseUrl !== undefined, "The scenario's database has no URL.");

  loadEnvFile();
  const application = await buildApplication(
    { ...loadConfig(), databaseUrl },
    { logger: false },
  );
  built.set(this, { application });

  this.mediator = application.mediator;
  this.validation = application.validation;
  useUnitOfWork(this, application.unitOfWork);
});

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
// server they were added to, rather than being handed the application's.
Given(
  "an example route that sends the example command",
  function (this: SpecWorld) {
    const scenario = builtFor(this);
    scenario.application.server.post("/example", (request) =>
      request.server.mediator.send(new ExampleCommand(askedAt)),
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

// By the time this runs the scenario's database may already have been dropped
// from under the pool, so a connection failing on its way out says nothing
// about the scenario, whose verdict is not the teardown's to overturn.
After({ tags: "@postgres" }, async function (this: SpecWorld) {
  const scenario = built.get(this);
  if (scenario === undefined) return;
  built.delete(this);
  try {
    await scenario.application.server.close();
    await scenario.application.pool.end();
  } catch {
    // Nothing to say, and nothing that saying it would improve.
  }
});
