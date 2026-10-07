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
import { aFakeOfHaveIBeenPwned } from "../../infrastructure/support/breachedPasswords.js";
import { useUnitOfWork } from "../../infrastructure/support/transactions.js";
import { exampleRegistry } from "../../support/exampleEvents.js";
import type { SpecWorld } from "../../support/world.js";
import { clockFor } from "./clock.js";

export interface Built {
  readonly application: Application;
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
  const clock = clockFor(this);
  // Asking whether a password has been breached goes to a fake of Have I Been
  // Pwned, stood up here rather than left to the scenario: the application
  // would otherwise be built asking the real service, and a scenario that sent
  // a command carrying a password would reach across the internet from a test
  // run. Standing it up for every scenario costs a port and nothing else, and
  // means what the application was asked can be read in any of them.
  await aFakeOfHaveIBeenPwned(this);
  const breachedPasswords = this.breachedPasswords;
  assert.ok(
    breachedPasswords !== undefined,
    "The fake of Have I Been Pwned left no check behind it.",
  );
  const application = await buildApplication(
    { ...loadConfig(), databaseUrl },
    {
      logger: false,
      clock: () => new Date(clock.now.getTime()),
      breachedPasswords,
      // Never the rankings' own site: whatever fake the scenario stands up,
      // asked for when a list is read, and none where it stands none up.
      worldRankingLists: {
        playersOf: (sport) => {
          const lists = this.worldRankingLists;
          assert.ok(
            lists !== undefined,
            "There is no fake of the world rankings.",
          );
          return lists.playersOf(sport);
        },
      },
      // The example events, and the scenario's own list of projections, so
      // that a projection named after this step is still given what the
      // application's store appends.
      events: exampleRegistry(),
      projections: this.projections,
    },
  );
  built.set(this, { application });

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
  // The steps the event store's features are written in append through the
  // scenario's store, as a request would; here, the application's.
  this.eventStore = application.eventStore;
  this.asARequest = (work) => application.unitOfWork.inTransaction(work);
});
