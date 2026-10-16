import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ReportUnreachableService } from "../../../../../src/application/operations/accounts/ReportUnreachableService.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { Registering } from "../../../../support/registering.js";
import type { SpecWorld } from "../../../../support/world.js";

const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

const report = (world: SpecWorld, service: string): Promise<void> =>
  registeringOf(world).report(
    new ReportUnreachableService(service, "croquetscores.com", momentOf(world)),
  );

Given(
  "the site's administrator is at {string}",
  function (this: SpecWorld, address: string) {
    registeringOf(this).tellsAdministrator(address);
  },
);

Given("the site has no administrator's address", function (this: SpecWorld) {
  registeringOf(this).tellsAdministrator(undefined);
});

Given(
  "{string} has been reported unreachable",
  async function (this: SpecWorld, service: string) {
    await report(this, service);
  },
);

When(
  "{string} is reported unreachable",
  async function (this: SpecWorld, service: string) {
    await report(this, service);
  },
);

Then(
  "the email queued for {string} names the service {string}",
  async function (this: SpecWorld, address: string, service: string) {
    const written = await registeringOf(this).writtenFor(address);
    assert.ok(written.includes(service), `The email does not name ${service}.`);
  },
);
