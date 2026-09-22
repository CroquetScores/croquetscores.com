import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";

// An event that says nothing beyond what every event says. It exists only to
// exercise that.
class ExampleEvent extends DomainEvent {
  constructor(createdBy: AccountId, occurredAt: ReadOnlyDate) {
    super(createdBy, occurredAt);
  }
}

const accountOf = (world: SpecWorld): AccountId => {
  assert.ok(world.account !== undefined, "No account has been given.");
  return world.account;
};

const momentOf = (world: SpecWorld): Date => {
  assert.ok(world.moment !== undefined, "No moment has been given.");
  return world.moment;
};

const eventOf = (world: SpecWorld): DomainEvent => {
  assert.ok(world.event !== undefined, "No event has been created.");
  return world.event;
};

const create = (world: SpecWorld): void => {
  world.event = new ExampleEvent(
    accountOf(world),
    ReadOnlyDate.from(momentOf(world)),
  );
};

// Trying to change what an event says. The compiler refuses both, which is
// why the event is cast away from its type first: what is being checked is
// that the running code refuses too. A refusal is a thrown TypeError, and a
// quiet failure to change anything is as good, so either is let past and the
// Then step looks at what the event says. Only a TypeError is let past, and
// the replacement is made before the attempt: a scenario whose replacement
// cannot be made should fail here, not pass because nothing was tried.
const tryToChange = (change: () => void): void => {
  try {
    change();
  } catch (failure) {
    if (!(failure instanceof TypeError)) throw failure;
  }
};

Given("the account {string}", function (this: SpecWorld, written: string) {
  this.account = AccountId.from(written);
});

When("the example event is created", function (this: SpecWorld) {
  create(this);
});

Given("the example event", function (this: SpecWorld) {
  create(this);
});

When("it is written down as data", function (this: SpecWorld) {
  this.writtenEvent = JSON.parse(JSON.stringify(eventOf(this))) as Record<
    string,
    unknown
  >;
});

const writtenOf = (world: SpecWorld): Record<string, unknown> => {
  assert.ok(
    world.writtenEvent !== undefined,
    "The event has not been written down.",
  );
  return world.writtenEvent;
};

When(
  "its cause is changed to {string}",
  function (this: SpecWorld, written: string) {
    const event = eventOf(this) as { createdBy: AccountId };
    const replacement = AccountId.from(written);
    tryToChange(() => {
      event.createdBy = replacement;
    });
  },
);

When(
  "its moment is changed to {string}",
  function (this: SpecWorld, moment: string) {
    const event = eventOf(this) as { occurredAt: ReadOnlyDate };
    const replacement = ReadOnlyDate.from(new Date(moment));
    tryToChange(() => {
      event.occurredAt = replacement;
    });
  },
);

Then(
  "what was written says it was caused by {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(writtenOf(this)["createdBy"], written);
  },
);

Then(
  "what was written says it happened at {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(writtenOf(this)["occurredAt"], written);
  },
);

Then(
  "it was( still) caused by {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(eventOf(this).createdBy.toString(), written);
  },
);

Then(
  "it( still) happened at {string}",
  function (this: SpecWorld, written: string) {
    assert.equal(eventOf(this).occurredAt.toISOString(), written);
  },
);
