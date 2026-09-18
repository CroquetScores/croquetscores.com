import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type ExampleThing,
  ExampleThingId,
  thingScenarioOf,
} from "../../../support/exampleThing.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";

// What stands behind "an aggregate repository of example things" is decided by
// the steps of whatever keeps the events (specs/infrastructure/support/), since
// this feature is written for any store and these steps may name none.

const repositoryOf = (world: SpecWorld) => {
  assert.ok(world.repository !== undefined, "There is no repository.");
  return world.repository;
};

const thingOf = (world: SpecWorld): ExampleThing => {
  const thing = thingScenarioOf(world).thing;
  assert.ok(thing !== undefined, "There is no example thing.");
  return thing;
};

const copyOf = (world: SpecWorld, which: string): ExampleThing => {
  const copy = thingScenarioOf(world).copies.get(which);
  assert.ok(copy !== undefined, `There is no ${which} copy.`);
  return copy;
};

// The example thing's id is the id of the first thing the scenario opened:
// every scenario here is about one thing, and loading it again is loading that.
const idOf = (world: SpecWorld): ExampleThingId => {
  const scenario = thingScenarioOf(world);
  scenario.id ??= thingOf(world).id;
  return scenario.id;
};

const saving = async (world: SpecWorld, thing: ExampleThing): Promise<void> => {
  const repository = repositoryOf(world);
  try {
    await world.asARequest(() => repository.save(thing));
  } catch (failure) {
    world.failure = failure;
  }
};

const loading = (world: SpecWorld, id: ExampleThingId) => {
  const repository = repositoryOf(world);
  return world.asARequest(() => repository.load(id));
};

// Saving -------------------------------------------------------------------

// The thing a scenario is about is never expected to be refused, so a refusal
// fails the step rather than being kept for later: only the copies' saves are
// ever refused, and those steps keep it to be asked about.
When("it is saved", async function (this: SpecWorld) {
  idOf(this);
  const repository = repositoryOf(this);
  const thing = thingOf(this);
  await this.asARequest(() => repository.save(thing));
});

When(
  /^the (first|second) copy is saved$/,
  async function (this: SpecWorld, which: string) {
    await saving(this, copyOf(this, which));
  },
);

// Loading ------------------------------------------------------------------

When("the example thing is loaded", async function (this: SpecWorld) {
  const loaded = await loading(this, idOf(this));
  assert.ok(loaded !== undefined, "The example thing was not found.");
  thingScenarioOf(this).thing = loaded;
});

When(
  /^the example thing is loaded as the (first|second) copy$/,
  async function (this: SpecWorld, which: string) {
    const loaded = await loading(this, idOf(this));
    assert.ok(loaded !== undefined, "The example thing was not found.");
    thingScenarioOf(this).copies.set(which, loaded);
  },
);

When(
  "an example thing nobody saved is loaded",
  async function (this: SpecWorld) {
    thingScenarioOf(this).thing = await loading(this, ExampleThingId.create());
  },
);

// What is done to a copy ---------------------------------------------------

When(
  /^the (first|second) copy is renamed "([^"]*)"$/,
  function (this: SpecWorld, which: string, name: string) {
    assert.ok(this.account !== undefined, "No account has been named.");
    assert.ok(this.moment !== undefined, "No moment has been named.");
    copyOf(this, which).rename(
      name,
      this.account,
      ReadOnlyDate.from(this.moment),
    );
  },
);

// What came of it ----------------------------------------------------------

Then("nothing is found", function (this: SpecWorld) {
  assert.equal(thingScenarioOf(this).thing, undefined, "Something was found.");
});

Then("it is known by the example thing's id", function (this: SpecWorld) {
  assert.ok(thingOf(this).id.equals(idOf(this)));
});

Then(
  "the example thing's stream holds {int} event(s)",
  async function (this: SpecWorld, count: number) {
    const store = this.eventStore;
    assert.ok(store !== undefined, "There is no event store.");
    const id = idOf(this);
    const events = await this.asARequest(() => store.getEvents(id));
    assert.equal(events.length, count);
  },
);

Then(
  "saving is refused with {string}",
  function (this: SpecWorld, code: string) {
    const said = (this.failure as { code?: unknown } | undefined)?.code;
    assert.equal(
      said,
      code,
      `Saving was not refused with ${code}: ${inspect(this.failure)}.`,
    );
  },
);

Then(
  /^the (first|second) copy has recorded (\d+) events?$/,
  function (this: SpecWorld, which: string, count: string) {
    assert.equal(copyOf(this, which).recorded.length, Number(count));
  },
);
