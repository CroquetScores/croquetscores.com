// A reader signed in having their account forgotten, in a real browser: asking
// from the page, following the link that arrives, and pressing the button it
// shows.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import {
  askToForget,
  detailsOfAccount,
  emailsFor,
  sessionsOfId,
} from "../../support/control.js";
import { unmarked } from "../../support/languages.js";
import { wordsFor } from "../../support/words.js";

const forgetAccount = "/account/forget-account";
const dialog = "section.dialog";

const words = wordsFor;

const contentOf = async (world: WebWorld): Promise<string> =>
  unmarked((await world.browserPage.locator("main").textContent()) ?? "");

const queuedFor = async (address: string) =>
  (await emailsFor(address)).filter((email) => !email.givenUp);

// Opening it ------------------------------------------------------------------------

const open = async (world: WebWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${forgetAccount}`);
};

Given("the forget account page is open", async function (this: WebWorld) {
  await open(this);
});

When("the forget account page is opened", async function (this: WebWorld) {
  await open(this);
});

Then("the forget account page is shown", async function (this: WebWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, forgetAccount);
  const heading = unmarked(
    (await this.browserPage.locator("main h1").textContent()) ?? "",
  );
  assert.equal(heading, words("forgetAccount.title"));
});

// Asking and confirming -------------------------------------------------------------

const press = async (world: WebWorld): Promise<void> => {
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When("forgetting the account is asked for", async function (this: WebWorld) {
  await press(this);
});

When("forgetting is confirmed", async function (this: WebWorld) {
  await press(this);
});

// Asked for the way the page asks, for the account the scenario names, and
// taken out of the email the way a reader takes it out of their mail. Nobody
// need be signed in to this browser for it: what the scenario is about is who
// follows the link.
Given(
  "a link to confirm forgetting has been sent to {string}",
  async function (this: WebWorld, address: string) {
    await askToForget(address);
    const sent = (await queuedFor(address)).filter(
      (email) => email.kind === "Email.ConfirmForgetting",
    );
    const last = sent[sent.length - 1];
    assert.ok(
      last?.link !== undefined,
      "No link to confirm forgetting was sent.",
    );
    this.linkInHand = last.link;
    this.addressInHand = address;
    // Held by its id, because once forgotten it is no longer found by its
    // address.
    this.accountHeld = (await detailsOfAccount(address)).id;
  },
);

// A link made for confirming an address, followed as though it were one for
// forgetting: what a reader would do by editing the address.
When(
  "the link to confirm the email address is followed as a link to confirm forgetting",
  async function (this: WebWorld) {
    assert.ok(this.linkInHand !== undefined, "The scenario has no link.");
    const followed = new URL(this.linkInHand);
    await this.browserPage.goto(
      `${this.baseUrl!}${forgetAccount}${followed.search}`,
    );
  },
);

// What happened ---------------------------------------------------------------------

Then(
  "a link to confirm forgetting is emailed to {string}",
  async function (this: WebWorld, address: string) {
    const sent = (await queuedFor(address)).filter(
      (email) => email.kind === "Email.ConfirmForgetting",
    );
    assert.equal(sent.length, 1, `No link to confirm forgetting was sent.`);
  },
);

Then(
  "the reader is told what forgetting the account means",
  async function (this: WebWorld) {
    assert.ok(
      (await contentOf(this)).includes(
        words("forgetAccount.confirm.explanation"),
      ),
      "The page does not say what forgetting means.",
    );
  },
);

Then(
  "the reader is told the last administrator cannot be forgotten",
  async function (this: WebWorld) {
    assert.ok(
      (await contentOf(this)).includes(
        words("forgetAccount.lastAdministrator.explanation"),
      ),
      "The page does not say the last administrator cannot be forgotten.",
    );
  },
);

Then(
  "the reader is told their account has been forgotten",
  async function (this: WebWorld) {
    assert.ok(
      (await contentOf(this)).includes(
        words("forgetAccount.forgotten.explanation"),
      ),
      "The page does not say the account has been forgotten.",
    );
  },
);

Then(
  "the account the link was sent for has {int} session(s)",
  async function (this: WebWorld, count: number) {
    assert.ok(this.accountHeld !== undefined, "The scenario holds no account.");
    assert.equal(await sessionsOfId(this.accountHeld), count);
  },
);
