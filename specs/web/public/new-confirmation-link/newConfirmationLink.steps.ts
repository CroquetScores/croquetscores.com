// A reader whose link has expired, asking for another, in a real browser.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { alterLinkToName } from "../../../infrastructure/support/links.js";
import { applicationFor } from "../../support/browser.js";
import { clockFor } from "../../support/clock.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";
import { accountIdFor } from "../sign-in/signIn.steps.js";

const newConfirmationLink = "/account/new-confirmation-link";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const linkInHand = (world: SpecWorld): string => {
  assert.ok(world.linkInHand !== undefined, "The scenario has no link.");
  return world.linkInHand;
};

// The page as the reader reaches it: the link they hold, on this scenario's
// application rather than on the address the emails are written with.
const openFor = async (world: SpecWorld, link: string): Promise<void> => {
  const followed = new URL(link);
  await world.browserPage.goto(
    `${world.baseUrl!}${newConfirmationLink}${followed.search}`,
  );
};

// Opening it -----------------------------------------------------------------------

When(
  "the new confirmation link page is opened for the link",
  async function (this: SpecWorld) {
    await openFor(this, linkInHand(this));
  },
);

// The scenarios' browser has scripting switched off unless a step asks for it
// back; the scenario says so because what it is about is that the page works
// without it.
When(
  "the new confirmation link page is opened for the link with scripting off",
  async function (this: SpecWorld) {
    await openFor(this, linkInHand(this));
  },
);

When(
  "the new confirmation link page is opened",
  async function (this: SpecWorld) {
    await this.browserPage.goto(`${this.baseUrl!}${newConfirmationLink}`);
  },
);

// From the page the expired link opened, as a reader gets here.
When(
  "the link to the new confirmation link page is followed",
  async function (this: SpecWorld) {
    await this.browserPage
      .locator(`main a[href^="${newConfirmationLink}"]`)
      .click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the new confirmation link page is shown",
  async function (this: SpecWorld) {
    assert.equal(new URL(this.browserPage.url()).pathname, newConfirmationLink);
    const heading = unmarked(
      (await this.browserPage.locator("main h1").textContent()) ?? "",
    );
    assert.equal(heading, words("newConfirmationLink.title"));
  },
);

// Asking --------------------------------------------------------------------------

When("a new link is asked for", async function (this: SpecWorld) {
  const button = this.browserPage.locator('form.asking button[type="submit"]');
  if ((await button.count()) > 0) {
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
When("the new link is followed", async function (this: SpecWorld) {
  const link = await newestLinkTo(this, this.addressInHand ?? "");
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
  async function (this: SpecWorld, address: string) {
    this.linkInHand = alterLinkToName(
      linkInHand(this),
      await accountIdFor(this, address),
    );
  },
);

// What has been sent ------------------------------------------------------------------

const emailsFor = async (
  world: SpecWorld,
  address: string,
): Promise<readonly { kind: string; link: string | undefined }[]> => {
  const application = applicationFor(world);
  const queued = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
  return queued.filter((email) => !email.givenUp && email.to === address);
};

const newestLinkTo = async (
  world: SpecWorld,
  address: string,
): Promise<string> => {
  const emails = await emailsFor(world, address);
  const last = emails[emails.length - 1];
  assert.ok(
    last?.link !== undefined,
    `Nothing carrying a link is for ${address}.`,
  );
  return last.link;
};

// The same form posted again, to the same address it was drawn with, which is
// what a second press of the button does.
When("the button is pressed again", async function (this: SpecWorld) {
  await this.browserPage.goBack();
  await this.browserPage.click('form.asking button[type="submit"]');
  await this.browserPage.waitForLoadState();
});

Then(
  "one new link has been emailed to {string}",
  async function (this: SpecWorld, address: string) {
    const sent = (await emailsFor(this, address)).filter(
      (email) => email.kind === "Email.ConfirmAddressAgain",
    );
    assert.equal(sent.length, 1, `${sent.length} new links were sent.`);
  },
);

Then(
  "a new link is emailed to {string}",
  async function (this: SpecWorld, address: string) {
    const emails = await emailsFor(this, address);
    const last = emails[emails.length - 1];
    assert.ok(last !== undefined, `Nothing is queued for ${address}.`);
    assert.equal(last.kind, "Email.ConfirmAddressAgain");
  },
);

// Nothing the page could have sent: the link registering emailed is still
// queued, and is not what any of these scenarios is asking about.
Then(
  "nothing more is sent to {string}",
  async function (this: SpecWorld, address: string) {
    const sent = (await emailsFor(this, address)).filter(
      (email) => email.kind === "Email.ConfirmAddressAgain",
    );
    assert.deepEqual(sent, [], `A new link was sent to ${address}.`);
  },
);

// What the site has written to an account already, which the limit counts
// with whatever is asked for now.
Given(
  "{string} has been emailed {int} times in the last hour",
  async function (this: SpecWorld, address: string, times: number) {
    const account = await accountIdFor(this, address);
    // A few minutes ago, so that they are inside the hour whatever moment the
    // scenario is at.
    const at = new Date(clockFor(this).now.getTime() - 5 * 60 * 1000);
    for (let each = 0; each < times; each++) {
      await this.database.query(
        `insert into emails_written (written_to, kind, written_at)
         values ($1, $2, $3)`,
        [`account:${account}`, "Email.ConfirmAddressAgain", at],
      );
    }
  },
);

// What the page shows -------------------------------------------------------------------

Then(
  "the page does not contain {string}",
  async function (this: SpecWorld, words_: string) {
    const content = (await this.browserPage.content()) ?? "";
    assert.ok(!content.includes(words_), `The page holds ${words_}.`);
  },
);

Then(
  "the page's address does not contain {string}",
  function (this: SpecWorld, words_: string) {
    assert.ok(
      !decodeURIComponent(this.browserPage.url()).includes(words_),
      `The address holds ${words_}.`,
    );
  },
);

Given("the email address is confirmed", async function (this: SpecWorld) {
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
