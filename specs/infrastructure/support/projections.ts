// What stands behind "an event store with projections": the Postgres event
// store, on the scenario's database and its one unit of work, with the
// scenario's projections in front of it. The projecting store's own feature is
// written for any store, and this is the one the application keeps its events
// in. And what needs the connection a request is running on: a projection that
// writes, and a request that fails after it has appended.
//
// Here rather than in specs/support/ because it names the Postgres store and
// the unit of work, and specs/support/ is loaded by every spec in the
// repository and so may not.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ProjectingEventStore } from "../../../src/application/common/ProjectingEventStore.js";
import { PostgresEventStore } from "../../../src/infrastructure/event-store/PostgresEventStore.js";
import { exampleRegistry } from "../../support/exampleEvents.js";
import type { SpecWorld } from "../../support/world.js";
import { unitOfWorkOf, writeNote } from "./transactions.js";

Given("an event store with projections", function (this: SpecWorld) {
  const unitOfWork = unitOfWorkOf(this);
  // The store refuses to do anything where no request is being served, so
  // every call the steps make is made as one would be.
  this.asARequest = (work) => unitOfWork.inTransaction(work);
  // The scenario's own list, so that a projection named after this step is
  // still one the store gives what it appends.
  this.eventStore = new ProjectingEventStore(
    new PostgresEventStore(unitOfWork, exampleRegistry()),
    this.projections,
  );
});

// It asks for the connection rather than being handed one, as every real
// projection will: so what it writes is in the transaction the append is in.
Given(
  "a projection that writes the note {string}",
  function (this: SpecWorld, note: string) {
    const unitOfWork = unitOfWorkOf(this);
    this.projections.push({
      project: () => writeNote(unitOfWork.connection(), note),
    });
  },
);

// The next request fails once its work is done: after the events have been
// appended and projected, and before anything is committed. Once, so that
// looking afterwards at what was kept is not refused the same way.
Given(
  "whatever appends the events fails once they are appended",
  function (this: SpecWorld) {
    const asARequest = this.asARequest;
    let failed = false;
    this.asARequest = (work) =>
      asARequest(async () => {
        const done = await work();
        if (failed) return done;
        failed = true;
        throw new Error("What appended the events failed afterwards.");
      });
  },
);

// How the scenario's read model is made again from every event kept, which
// each read model's own steps say as they stand it up, so that rebuilding is
// said in the same words whichever read model it is.
const rebuilds = new WeakMap<SpecWorld, () => Promise<void>>();

/** Says how the read model this scenario stood up is rebuilt. */
export const rebuildsWith = (
  world: SpecWorld,
  rebuild: () => Promise<void>,
): void => {
  rebuilds.set(world, rebuild);
};

// A failure is kept for the scenario rather than thrown, so that a scenario can
// say it did not fail — which every one of them does, since a rebuild that
// fails is rolled back and leaves the table as it was.
When(
  "the read model is rebuilt from the events",
  async function (this: SpecWorld) {
    const rebuild = rebuilds.get(this);
    assert.ok(
      rebuild !== undefined,
      "This scenario has no read model to rebuild.",
    );
    try {
      await rebuild();
    } catch (failure) {
      this.failure = failure;
    }
  },
);

Then("it is rebuilt without failing", function (this: SpecWorld) {
  assert.equal(this.failure, undefined, `It failed: ${String(this.failure)}`);
});
