import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { Country } from "../../../src/domain/aggregates/tournaments/value-objects/Country.js";
import type { WorldRankingEvents } from "../../../src/import-ravendb/WorldRankingEvents.js";
import type { SpecWorld } from "../../support/world.js";
import {
  excelSerialOf,
  givenOf,
  eventsGivenTo,
  heldEvents,
} from "./rankedEvents.js";

const asked = new WeakMap<SpecWorld, Country | undefined>();
const held = new WeakMap<SpecWorld, WorldRankingEvents>();
const refusals = new WeakMap<SpecWorld, unknown>();

Given(
  "an Association Croquet event {string} played on {string} in {string}",
  function (this: SpecWorld, name: string, written: string, country: string) {
    givenOf(this).acEvents.push({ name, written, country });
  },
);

Given(
  "a Golf Croquet event {string} starting on {string} in {string}",
  function (this: SpecWorld, name: string, day: string, letters: string) {
    givenOf(this).gcEvents.push({ name, serial: excelSerialOf(day), letters });
  },
);

Given(
  "a Golf Croquet event {string} starting on the day numbered {int} in {string}",
  function (this: SpecWorld, name: string, serial: number, letters: string) {
    givenOf(this).gcEvents.push({ name, serial, letters });
  },
);

Given(
  "an Association Croquet list with the row {string}",
  function (this: SpecWorld, row: string) {
    const given = givenOf(this);
    given.acRows = [...(given.acRows ?? []), row];
    given.acEvents.push({ name: "", written: "", country: "New Zealand" });
  },
);

When(
  "the Association Croquet event is asked for, played from {string} to {string} and called {string}",
  function (this: SpecWorld, starts: string, finishes: string, name: string) {
    asked.set(
      this,
      eventsGivenTo(this).countryOf("ac", starts, finishes, name),
    );
  },
);

When(
  "the Golf Croquet event is asked for, starting on {string} and called {string}",
  function (this: SpecWorld, starts: string, name: string) {
    asked.set(this, eventsGivenTo(this).countryOf("gc", starts, starts, name));
  },
);

Then("the country found is {string}", function (this: SpecWorld, code: string) {
  assert.equal(asked.get(this)?.code, code);
});

Then("no country is found", function (this: SpecWorld) {
  assert.equal(asked.get(this), undefined);
});

When("the lists the import holds are read", async function (this: SpecWorld) {
  held.set(this, await heldEvents());
});

const heldBy = (world: SpecWorld): WorldRankingEvents => {
  const found = held.get(world);
  assert.ok(found !== undefined, "The lists were not read.");
  return found;
};

Then(
  "there are {int} Association Croquet events",
  function (this: SpecWorld, count: number) {
    assert.equal(heldBy(this).count("ac"), count);
  },
);

Then(
  "there are {int} Golf Croquet events",
  function (this: SpecWorld, count: number) {
    assert.equal(heldBy(this).count("gc"), count);
  },
);

Then(
  "the first Association Croquet event is {string} in {string}",
  function (this: SpecWorld, name: string, code: string) {
    const first = heldBy(this).first("ac");
    assert.equal(first.name, name);
    assert.equal(first.country?.code, code);
  },
);

Then(
  "the first Golf Croquet event is {string} in {string}",
  function (this: SpecWorld, name: string, code: string) {
    const first = heldBy(this).first("gc");
    assert.equal(first.name, name);
    assert.equal(first.country?.code, code);
  },
);

When("the list is read", function (this: SpecWorld) {
  try {
    eventsGivenTo(this);
    refusals.set(this, undefined);
  } catch (failure) {
    refusals.set(this, failure);
  }
});

Then(
  "the list is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(
      (refusals.get(this) as { code?: string } | undefined)?.code,
      code,
    );
  },
);
