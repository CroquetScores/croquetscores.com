// What stands behind "a record of handled requests": the Postgres one, on the
// scenario's own database, with its claims made the way a request being served
// makes them.
//
// Here rather than beside the feature because the feature is the
// application's, and an application spec may name nothing from infrastructure.
import { Given } from "@cucumber/cucumber";

import { PostgresHandledRequests } from "../../../src/infrastructure/database/PostgresHandledRequests.js";
import type { SpecWorld } from "../../support/world.js";
import { unitOfWorkOf } from "./transactions.js";

export const aRecordOfHandledRequests = (world: SpecWorld): void => {
  const unitOfWork = unitOfWorkOf(world);
  world.handledRequestsRecord = new PostgresHandledRequests(unitOfWork);
  // Claims are made as a request being served makes them, which is what puts
  // each in a transaction of its own: two at once have to be two, or the
  // second would only be waiting for the first rather than racing it.
  world.asARequest = (work) => unitOfWork.inTransaction(work);
};

Given("a record of handled requests", function (this: SpecWorld) {
  aRecordOfHandledRequests(this);
});
