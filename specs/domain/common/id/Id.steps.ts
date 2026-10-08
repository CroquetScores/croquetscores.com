import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Id } from "../../../../src/domain/common/Id.js";
import type { SpecWorld } from "../../../support/world.js";

// A kind of id that exists only to exercise what every kind has in common.
class ExampleId extends Id {
  static create(): ExampleId {
    return new ExampleId(Id.mint("example"));
  }

  static from(written: string): ExampleId {
    return new ExampleId(Id.read("example", written));
  }
}

const PLAIN_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const kindOf = (world: SpecWorld) => {
  assert.ok(world.idKind !== undefined, "No kind of id has been given.");
  return world.idKind;
};

const lastIdOf = (world: SpecWorld): Id => {
  const last = world.ids.at(-1);
  assert.ok(
    last !== undefined,
    `No id has been minted or read: ${inspect(world.failure)}`,
  );
  return last;
};

const twoIdsOf = (world: SpecWorld): [Id, Id] => {
  const [first, second] = world.ids;
  assert.ok(
    first !== undefined && second !== undefined,
    `Expected two ids, and there are ${world.ids.length}.`,
  );
  return [first, second];
};

// Reading a writing may be refused, and the scenario says which it expects.
const tryToRead = (world: SpecWorld, written: string): void => {
  try {
    world.ids.push(kindOf(world).read(written));
  } catch (failure) {
    world.failure = failure;
  }
};

// The kind ---------------------------------------------------------------

Given("the example kind of id", function (this: SpecWorld) {
  this.idKind = {
    mint: () => ExampleId.create(),
    read: (written) => ExampleId.from(written),
  };
});

// Minting, writing and reading -------------------------------------------

Given("a new id", function (this: SpecWorld) {
  this.ids.push(kindOf(this).mint());
});

When("a new id is minted", function (this: SpecWorld) {
  this.ids.push(kindOf(this).mint());
});

When("another new id is minted", function (this: SpecWorld) {
  this.ids.push(kindOf(this).mint());
});

// Trying to change an id. The compiler refuses, which is why it is cast away
// from its type first: what is being checked is that the running code refuses
// too. A thrown TypeError is that refusal, and a quiet failure to change
// anything is as good; anything else is a fault in the step.
When("it is changed to {string}", function (this: SpecWorld, written: string) {
  const id = lastIdOf(this) as { value: string };
  try {
    id.value = written;
  } catch (failure) {
    if (!(failure instanceof TypeError)) throw failure;
  }
});

When("it is written down", function (this: SpecWorld) {
  this.writtenId = lastIdOf(this).toString();
});

When("an id is read from what was written", function (this: SpecWorld) {
  assert.ok(this.writtenId !== undefined, "Nothing has been written down.");
  tryToRead(this, this.writtenId);
});

When(
  "an id is read from {string}",
  function (this: SpecWorld, written: string) {
    tryToRead(this, written);
  },
);

// Nothing, arriving where a writing was expected: an empty column, or a part
// of a URL that was not there. The cast is the point — this is what reaches a
// boundary that was typed more hopefully than the world turned out to be.
When("an id is read from nothing at all", function (this: SpecWorld) {
  tryToRead(this, undefined as unknown as string);
});

When(
  "another id is read from {string}",
  function (this: SpecWorld, written: string) {
    tryToRead(this, written);
  },
);

// What came of it --------------------------------------------------------

Then("it begins with {string}", function (this: SpecWorld, start: string) {
  const { value } = lastIdOf(this);
  assert.ok(value.startsWith(start), `${value} does not begin with ${start}`);
});

Then(
  "the rest of it is a uuid written in lowercase with hyphens",
  function (this: SpecWorld) {
    const { value } = lastIdOf(this);
    const rest = value.slice(value.indexOf("/") + 1);
    assert.match(rest, PLAIN_UUID);
  },
);

Then("its uuid is {string}", function (this: SpecWorld, uuid: string) {
  assert.equal(lastIdOf(this).uuid, uuid);
});

// Taken from text, with no id made of it: the places that want it only have
// the text.
const taken = new WeakMap<SpecWorld, string>();

When(
  "the uuid is taken from the writing {string}",
  function (this: SpecWorld, written: string) {
    taken.set(this, Id.uuidOf(written));
  },
);

Then("the uuid taken is {string}", function (this: SpecWorld, uuid: string) {
  assert.equal(taken.get(this), uuid);
});

Then("the two ids differ", function (this: SpecWorld) {
  const [first, second] = twoIdsOf(this);
  assert.ok(
    !first.equals(second),
    `${first.value} says it is ${second.value}.`,
  );
});

Then("the two ids are the same", function (this: SpecWorld) {
  const [first, second] = twoIdsOf(this);
  assert.ok(
    first.equals(second),
    `${first.value} says it is not ${second.value}.`,
  );
});

Then(
  "what was written is {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(this.writtenId, written);
  },
);
