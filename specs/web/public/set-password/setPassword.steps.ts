// The set password page, in a real browser: asking for a link to set a
// password on an account with no password, and following the link that
// arrives.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import {
  openAndKeepTheAnswer,
  postAndKeepTheAnswer,
} from "../../support/answered.js";
import { applicationFor } from "../../support/browser.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const setPassword = "/account/set-password";
const dialog = "section.dialog";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

// Opening it ------------------------------------------------------------------------

const open = async (world: SpecWorld): Promise<void> => {
  await openAndKeepTheAnswer(world, setPassword);
};

Given("the set password page is open", async function (this: SpecWorld) {
  await open(this);
});

When("the set password page is opened", async function (this: SpecWorld) {
  await open(this);
});

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
When(
  "the set password page is opened with scripting off",
  async function (this: SpecWorld) {
    await open(this);
  },
);

// Whatever it is posted, since what is posted is not what is being asked
// about: only whether there is a page there to take it.
When("the set password page is posted to", async function (this: SpecWorld) {
  await postAndKeepTheAnswer(this, setPassword, {});
});

Then("the set password page is shown", async function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, setPassword);
  const title = unmarked(
    (await this.browserPage.locator(`${dialog} .dialog-title`).textContent()) ??
      "",
  );
  assert.equal(title.trim(), words("setPassword.title"));
});

Then(
  "the page says a link will be sent to {string}",
  async function (this: SpecWorld, address: string) {
    const said = await this.browserPage
      .locator(`${dialog} .notice`)
      .textContent();
    assert.ok(
      (said ?? "").includes(address),
      `The page says ${JSON.stringify(said)}.`,
    );
  },
);

// Asking ----------------------------------------------------------------------------

const ask = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When(
  "the reader asks for a link to set a password",
  async function (this: SpecWorld) {
    await ask(this);
  },
);

Given(
  "the reader has asked for a link to set a password",
  async function (this: SpecWorld) {
    await ask(this);
  },
);

// Back to the form as the browser kept it, and pressed again: the form it
// sends is the one that was shown, and carries the request id it did.
When(
  "the reader goes back and asks for a link to set a password again",
  async function (this: SpecWorld) {
    await this.browserPage.goBack();
    await ask(this);
  },
);

// What was sent ---------------------------------------------------------------------

const setPasswordEmailsTo = async (world: SpecWorld, address: string) => {
  const application = applicationFor(world);
  const queued = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
  return queued.filter(
    (email) =>
      !email.givenUp &&
      email.to === address &&
      email.kind === "Email.SetPassword",
  );
};

Then(
  "{string} is sent a link to set a password",
  async function (this: SpecWorld, address: string) {
    const sent = await setPasswordEmailsTo(this, address);
    assert.ok(sent.length > 0, `No link to set a password went to ${address}.`);
  },
);

Then(
  "one link to set a password has been sent to {string}",
  async function (this: SpecWorld, address: string) {
    const sent = await setPasswordEmailsTo(this, address);
    assert.equal(sent.length, 1, `${sent.length} links were sent.`);
  },
);

// Followed at the scenario's own site, where the email's link names the
// site's address.
Given(
  "the link sent to {string} is followed",
  async function (this: SpecWorld, address: string) {
    const sent = await setPasswordEmailsTo(this, address);
    const last = sent[sent.length - 1];
    assert.ok(last?.link !== undefined, "No link to set a password was sent.");
    this.linkInHand = last.link;
    const followed = new URL(last.link);
    await this.browserPage.goto(
      `${this.baseUrl!}${followed.pathname}${followed.search}`,
    );
  },
);
