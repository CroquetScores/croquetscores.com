// The application as the server builds it, for scenarios about what the web
// layer puts together, and what they need of it: a clock the scenario sets, the
// example route, and what the route answered.
//
// Here rather than in specs/support/ because it builds the whole application,
// infrastructure and all, and specs/support/ is loaded by every spec in the
// repository and so may not.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { LightMyRequestResponse } from "fastify";

import {
  loadConfig,
  loadEnvFile,
} from "../../../src/infrastructure/config/Config.js";
import { buildApplication, type Application } from "../../../src/web/server.js";
import { useUnitOfWork } from "../../infrastructure/support/transactions.js";
import { askedAt } from "../../support/examples.js";
import type { SpecWorld } from "../../support/world.js";

export interface Built {
  readonly application: Application;
  /** What the server's clock reads. The scenario moves it; nothing else does. */
  now: Date;
  route?: { method: "GET" | "POST"; url: string };
  response?: LightMyRequestResponse;
}

const built = new WeakMap<SpecWorld, Built>();

export const builtFor = (world: SpecWorld): Built => {
  const found = built.get(world);
  assert.ok(
    found !== undefined,
    "This scenario has not built the application.",
  );
  return found;
};

// Over the scenario's own database, with a clock the scenario sets, reading a
// fixed moment until it does. The steps every pipeline feature is written in
// keep the mediator, the validation behaviour and the unit of work on the
// scenario, and here they are handed the application's: so "the example
// command is sent" goes through what the composition root put together, and
// nothing a step assembled for itself.
Given("the application is built", async function (this: SpecWorld) {
  // A step that came first would have made the scenario a mediator of its own
  // and registered with that, and handing over the application's here would
  // quietly leave what it registered behind.
  assert.ok(
    this.mediator === undefined && this.validation === undefined,
    "This scenario already has a mediator. The application is built before anything is registered.",
  );

  const databaseUrl = this.database.options.connectionString;
  assert.ok(databaseUrl !== undefined, "The scenario's database has no URL.");

  loadEnvFile();
  // Filled in straight after, because the clock reads it and it has to exist
  // before the application does.
  const scenario = { now: askedAt.toDate() } as Built;
  const application = await buildApplication(
    { ...loadConfig(), databaseUrl },
    { logger: false, clock: () => new Date(scenario.now.getTime()) },
  );
  Object.assign(scenario, { application });
  built.set(this, scenario);

  // Closed with the scenario's database, before it is dropped, rather than by
  // a hook of its own that might run either side of the drop. The server and
  // the pool each on their own, so that the server failing to close does not
  // leave the pool open, holding the run up until its idle connections time out.
  this.closeBeforeDropping.push(
    () => {
      built.delete(this);
      return application.server.close();
    },
    () => application.pool.end(),
  );

  this.mediator = application.mediator;
  this.validation = application.validation;
  useUnitOfWork(this, application.unitOfWork);
});
