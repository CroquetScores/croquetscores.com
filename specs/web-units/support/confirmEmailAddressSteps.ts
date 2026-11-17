// The reader's side of confirming: an account and a link put there the way
// registering puts them there, the link followed in a real browser, and what
// the page says read back off it.
//
// The account is made by sending the application's own registration rather than
// by writing rows, because the link is the point of these scenarios and only
// registering makes one. What it queues is read out of the queue, as a reader
// reads it out of their mail.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Application } from "../../../src/web/server.js";
import type { SpecWorld } from "../../support/world.js";
import { applicationFor } from "./browser.js";
import { englishForScenarios, unmarked } from "./languages.js";

const dialog = "section.dialog";

// Read inside a transaction, because that is the only way anything below the
// web layer is read: a request gets one, and a step asking the same questions
// asks them the same way.
const asARequest = <TResult>(
  application: Application,
  work: () => Promise<TResult>,
): Promise<TResult> => application.unitOfWork.inTransaction(work);

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const contentOf = async (world: SpecWorld): Promise<string> =>
  unmarked((await world.browserPage.locator("main").textContent()) ?? "");

const toldThat = async (world: SpecWorld, key: string): Promise<void> => {
  const said = words(key);
  const content = await contentOf(world);
  assert.ok(content.includes(said), `The page does not say: ${said}`);
};

// The link as it reached the reader's inbox, pointed at the application this
// scenario is talking to: the site's own address is the one the emails are made
// with, and it is not where this scenario's application is listening.
const asFollowedHere = (world: SpecWorld, link: string): string => {
  const followed = new URL(link);
  return `${world.baseUrl!}${followed.pathname}${followed.search}`;
};

const linkInHand = (world: SpecWorld): string => {
  assert.ok(world.linkInHand !== undefined, "The scenario has no link.");
  return world.linkInHand;
};

const follow = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.goto(asFollowedHere(world, linkInHand(world)));
};

// What registering left behind ---------------------------------------------------

Given(
  "a link to confirm the email address has been sent to {string}",
  async function (this: SpecWorld, address: string) {
    const application = applicationFor(this);
    const queued = await asARequest(application, () =>
      application.emailQueue.emails(),
    );
    const waiting = queued.filter(
      (email) => !email.givenUp && email.to === address,
    );
    const only = waiting[waiting.length - 1];
    assert.ok(only !== undefined, `Nothing is queued for ${address}.`);
    assert.ok(only.link !== undefined, "The email carries no link.");
    this.linkInHand = only.link;
    // Named for the scenario's later steps, so that one reading "the new link"
    // knows whose mail to read.
    this.addressInHand = address;
  },
);

// Following it ---------------------------------------------------------------------

// Given and When alike: a scenario that follows the link on its way to
// something else says so with Given, and Cucumber holds one definition for
// both.
When("the link is followed", async function (this: SpecWorld) {
  await follow(this);
});

// Filling it in --------------------------------------------------------------------

const type = (world: SpecWorld, field: string, given: string) =>
  world.browserPage.fill(`${dialog} input[name="${field}"]`, given);

Given("the name typed as {string}", function (this: SpecWorld, name: string) {
  return type(this, "name", name);
});

Given(
  "the password typed as {string}",
  function (this: SpecWorld, password: string) {
    return type(this, "password", password);
  },
);

Given(
  "the confirm password typed as {string}",
  function (this: SpecWorld, password: string) {
    return type(this, "passwordConfirmation", password);
  },
);

// What the reader is told -------------------------------------------------------------

Then(
  "the reader is told their email address is confirmed",
  function (this: SpecWorld) {
    return toldThat(this, "confirmEmailAddress.confirmed.explanation");
  },
);
