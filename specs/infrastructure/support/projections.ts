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
import { Given } from "@cucumber/cucumber";

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
