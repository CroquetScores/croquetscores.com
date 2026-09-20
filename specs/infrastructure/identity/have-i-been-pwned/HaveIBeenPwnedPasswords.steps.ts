import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { lastPasswordChecked } from "../../../application/services/breached-passwords/BreachedPasswords.steps.js";
import {
  aFakeOfHaveIBeenPwned,
  fakeOf,
  scenariosWaitMilliseconds,
} from "../../support/breachedPasswords.js";
import type { SpecWorld } from "../../../support/world.js";
import { sha1Of } from "./FakeHaveIBeenPwned.js";

Given("a fake of Have I Been Pwned", async function (this: SpecWorld) {
  await aFakeOfHaveIBeenPwned(this);
});

// The rest of the hash with its first character changed: a hash that the
// service would answer with alongside the password's own, and that is not it.
Given(
  "a breached hash sharing the first {int} characters of the SHA-1 of {string} is known",
  function (this: SpecWorld, shared: number, password: string) {
    const hash = sha1Of(password);
    const rest = hash.slice(shared);
    const otherRest = (rest[0] === "0" ? "1" : "0") + rest.slice(1);
    fakeOf(this).knows(hash.slice(0, shared) + otherRest);
  },
);

// Late by several times the wait rather than just over it, so that the
// scenario does not turn on how promptly a timer fires on a busy machine.
Given(
  "the fake answers only after the check has stopped waiting",
  function (this: SpecWorld) {
    fakeOf(this).answersLateBy(scenariosWaitMilliseconds * 4);
  },
);

Given("the fake answers with a failure", function (this: SpecWorld) {
  fakeOf(this).answersWithAFailure();
});

Given(
  "the fake answers with a page rather than a list",
  function (this: SpecWorld) {
    fakeOf(this).answersWithAPage();
  },
);

Given("the fake answers with nothing", function (this: SpecWorld) {
  fakeOf(this).answersWithNothing();
});

// Everything every request said, in one piece of text. A check that never
// asked the fake anything has sent nothing, which is not the same as having
// sent nothing it should not, so that is a failure rather than a pass.
const everythingSent = (world: SpecWorld): string => {
  const { sent } = fakeOf(world);
  assert.ok(sent.length > 0, "The fake was not asked anything.");
  return sent.join("\n");
};

Then(
  "the fake was asked about the first {int} characters of its SHA-1",
  function (this: SpecWorld, count: number) {
    const hash = sha1Of(lastPasswordChecked(this));
    assert.deepEqual(fakeOf(this).askedAbout, [hash.slice(0, count)]);
  },
);

Then(
  "nothing the fake was sent contains {string}",
  function (this: SpecWorld, text: string) {
    assert.ok(
      !everythingSent(this).includes(text),
      `The fake was sent ${JSON.stringify(text)}.`,
    );
  },
);

// Hashes are compared without regard to case, since a hash spelled in lower
// case is the same hash given away.
Then(
  "nothing the fake was sent contains the whole of its SHA-1",
  function (this: SpecWorld) {
    const hash = sha1Of(lastPasswordChecked(this)).toLowerCase();
    assert.ok(
      !everythingSent(this).toLowerCase().includes(hash),
      "The fake was sent the whole hash.",
    );
  },
);
