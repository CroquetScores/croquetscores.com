// What stands behind "an aggregate repository of example things": a repository
// over the Postgres event store, on the scenario's database and its one unit of
// work, told how to read back the example thing's events. The repository's own
// feature is written for any store, and this is the one the application keeps
// its events in.
//
// Here rather than in specs/support/ because it names the Postgres store, and
// specs/support/ is loaded by every spec in the repository and so may not.
import { Given } from "@cucumber/cucumber";

import { AggregateRepository } from "../../../src/application/common/AggregateRepository.js";
import { PostgresEventStore } from "../../../src/infrastructure/event-store/PostgresEventStore.js";
import {
  ExampleThing,
  exampleThingRegistry,
} from "../../support/exampleThing.js";
import type { SpecWorld } from "../../support/world.js";
import { unitOfWorkOf } from "./transactions.js";

Given("an aggregate repository of example things", function (this: SpecWorld) {
  const unitOfWork = unitOfWorkOf(this);
  // The store refuses to do anything where no request is being served, so
  // every call the steps make is made as one would be.
  this.asARequest = (work) => unitOfWork.inTransaction(work);
  this.eventStore = new PostgresEventStore(unitOfWork, exampleThingRegistry());
  this.repository = new AggregateRepository(this.eventStore, (id, events) =>
    ExampleThing.rebuiltFrom(id, events),
  );
});
