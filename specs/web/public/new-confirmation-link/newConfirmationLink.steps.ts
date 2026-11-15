// A reader whose link has expired, asking for another, in a real browser.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import {
  detailsOfAccount,
  emailsFor,
  latestLinkTo,
  sayEmailsWereWritten,
} from "../../support/control.js";
import { unmarked } from "../../support/languages.js";
import { alterLinkToName } from "../../support/links.js";
import { wordsFor } from "../../support/words.js";

const newConfirmationLink = "/account/new-confirmation-link";

// Where each scenario's button sent the form, by the scenario.
const drawnWith = new WeakMap<WebWorld, string>();

const words = wordsFor;

const linkInHand = (world: WebWorld): string => {
  assert.ok(world.linkInHand !== undefined, "The scenario has no link.");
  return world.linkInHand;
};

// The page as the reader reaches it: the link they hold, on this scenario's
// application rather than on the address the emails are written with.
const openFor = async (world: WebWorld, link: string): Promise<void> => {
  const followed = new URL(link);
  await world.browserPage.goto(
    `${world.baseUrl!}${newConfirmationLink}${followed.search}`,
  );
};

// Opening it -----------------------------------------------------------------------

When(
  "the new confirmation link page is opened for the link",
  async function (this: WebWorld) {
    await openFor(this, linkInHand(this));
  },
);

// The scenarios' browser has scripting switched off unless a step asks for it
// back; the scenario says so because what it is about is that the page works
// without it.
When(
  "the new confirmation link page is opened for the link with scripting off",
  async function (this: WebWorld) {
    await openFor(this, linkInHand(this));
  },
);

When(
  "the new confirmation link page is opened",
  async function (this: WebWorld) {
    await this.browserPage.goto(`${this.baseUrl!}${newConfirmationLink}`);
  },
);

// From the page the expired link opened, as a reader gets here.
When(
  "the link to the new confirmation link page is followed",
  async function (this: WebWorld) {
    await this.browserPage
      .locator(`main a[href^="${newConfirmationLink}"]`)
      .click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the new confirmation link page is shown",
  async function (this: WebWorld) {
    assert.equal(new URL(this.browserPage.url()).pathname, newConfirmationLink);
    const heading = unmarked(
      (await this.browserPage.locator("main h1").textContent()) ?? "",
    );
    assert.equal(heading, words("newConfirmationLink.title"));
  },
);

// Asking --------------------------------------------------------------------------

When("a new link is asked for", async function (this: WebWorld) {
  const button = this.browserPage.locator('form.asking button[type="submit"]');
  if ((await button.count()) > 0) {
    // What the button was drawn with, which a second press sends again.
    drawnWith.set(
      this,
      (await this.browserPage.getAttribute("form.asking", "action")) ?? "",
    );
    await button.click();
    await this.browserPage.waitForLoadState();
    return;
  }

  // No button on the page, because the link is worth nothing. Asked anyway,
  // the way somebody who wrote the request themselves would: what the scenario
  // is about is that nothing is sent for it.
  const url = this.browserPage.url();
  await this.browserPage.request.post(url, {
    headers: { origin: new URL(url).origin },
  });
});

// The one that has just been sent, which is the newest queued for the address.
When("the new link is followed", async function (this: WebWorld) {
  const link = await latestLinkTo(this.addressInHand ?? "");
  const followed = new URL(link);
  this.linkInHand = link;
  await this.browserPage.goto(
    `${this.baseUrl!}${followed.pathname}${followed.search}`,
  );
});

// A link somebody has changed to name another account, its signature left
// alone: what the page must not act on.
Given(
  "the link has been altered to name the account for {string}",
  async function (this: WebWorld, address: string) {
    this.linkInHand = alterLinkToName(
      linkInHand(this),
      (await detailsOfAccount(address)).id,
    );
  },
);

// What has been sent ------------------------------------------------------------------

const sentTo = async (address: string) =>
  (await emailsFor(address)).filter((email) => !email.givenUp);

// The same form posted again, to the same address it was drawn with, which is
// what a second press of the button does. Sent from the scenario and not pressed,
// because a browser sent back to the page draws it again with an id of its own,
// and what is asked is what the site does with the one it was first given.
When("the button is pressed again", async function (this: WebWorld) {
  const action = drawnWith.get(this);
  assert.ok(action !== undefined, "The button was never pressed.");
  const answer = await this.browserPage.request.post(
    `${this.baseUrl!}${action}`,
    {
      headers: { "sec-fetch-site": "same-origin" },
      maxRedirects: 0,
    },
  );
  assert.ok(answer.status() < 500, `It was answered ${answer.status()}.`);
});

Then(
  "one new link has been emailed to {string}",
  async function (this: WebWorld, address: string) {
    const sent = (await sentTo(address)).filter(
      (email) => email.kind === "Email.ConfirmAddressAgain",
    );
    assert.equal(sent.length, 1, `${sent.length} new links were sent.`);
  },
);

Then(
  "a new link is emailed to {string}",
  async function (this: WebWorld, address: string) {
    const emails = await sentTo(address);
    const last = emails[emails.length - 1];
    assert.ok(last !== undefined, `Nothing is queued for ${address}.`);
    assert.equal(last.kind, "Email.ConfirmAddressAgain");
  },
);

// Nothing a page could have sent: the link registering emailed is still
// queued, and is not what any of these scenarios is asking about.
Then(
  "nothing more is sent to {string}",
  async function (this: WebWorld, address: string) {
    const sent = (await sentTo(address)).filter(
      (email) => email.kind !== "Email.ConfirmAddress",
    );
    assert.deepEqual(sent, [], `More was sent to ${address}.`);
  },
);

// What the site has written to an account already, which the limit counts
// with whatever is asked for now.
Given(
  "{string} has been emailed {int} times in the last hour",
  async function (this: WebWorld, address: string, times: number) {
    // A few minutes ago, so that they are inside the hour whatever moment the
    // scenario is at.
    await sayEmailsWereWritten(address, "Email.ConfirmAddressAgain", times, 5);
  },
);

// What the page shows -------------------------------------------------------------------

Given("the email address is confirmed", async function (this: WebWorld) {
  await this.browserPage.fill(
    'section.dialog input[name="name"]',
    "Sam Someone",
  );
  await this.browserPage.fill(
    'section.dialog input[name="password"]',
    "correct horse battery staple",
  );
  await this.browserPage.fill(
    'section.dialog input[name="passwordConfirmation"]',
    "correct horse battery staple",
  );
  await this.browserPage.click('section.dialog button[type="submit"]');
  await this.browserPage.waitForLoadState();
});
