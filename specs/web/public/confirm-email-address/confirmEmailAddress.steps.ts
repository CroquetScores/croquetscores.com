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

import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { Application } from "../../../../src/web/server.js";
import { alterLink } from "../../../infrastructure/support/links.js";
import type { SpecWorld } from "../../../support/world.js";
import { applicationFor } from "../../support/browser.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const confirmEmailAddress = "/account/confirm-email-address";
const signIn = "/account/sign-in";
const newConfirmationLink = "/account/new-confirmation-link";

const dialog = "section.dialog";

// Read inside a transaction, because that is the only way anything below the
// web layer is read: a request gets one, and a step asking the same questions
// asks them the same way.
const asARequest = <TResult>(
  application: Application,
  work: () => Promise<TResult>,
): Promise<TResult> => application.unitOfWork.inTransaction(work);

const accountFor = async (world: SpecWorld, address: string) => {
  const application = applicationFor(world);
  return asARequest(application, async () => {
    const id = await application.accountsByEmailAddress.find(
      EmailAddress.from(address),
    );
    assert.ok(id !== undefined, `There is no account for ${address}.`);
    const account = await application.accounts.load(id);
    assert.ok(account !== undefined, `Nothing is kept for ${address}.`);
    return account;
  });
};

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

// Found by where it leads rather than by the whole address, since a link may
// carry the reader's link on with it.
const linksTo = async (world: SpecWorld, path: string): Promise<number> =>
  world.browserPage.locator(`main a[href^="${path}"]`).count();

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

Given("the link has been altered", function (this: SpecWorld) {
  this.linkInHand = alterLink(linkInHand(this));
});

// Following it ---------------------------------------------------------------------

// Given and When alike: a scenario that follows the link on its way to
// something else says so with Given, and Cucumber holds one definition for
// both.
When("the link is followed", async function (this: SpecWorld) {
  await follow(this);
});

// The scenarios' browser has scripting switched off unless a step asks for it
// back, so this is the same following. It is said in the scenario all the same,
// because what that scenario is about is that the page works without it.
When(
  "the link is followed with scripting off",
  async function (this: SpecWorld) {
    await follow(this);
  },
);

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
  "the password typed again as {string}",
  function (this: SpecWorld, password: string) {
    return type(this, "passwordConfirmation", password);
  },
);

// What the page is ------------------------------------------------------------------

Then(
  "the confirm email address page is shown",
  async function (this: SpecWorld) {
    assert.equal(
      new URL(this.browserPage.url()).pathname,
      confirmEmailAddress,
      "The reader is somewhere else.",
    );
    const heading = unmarked(
      (await this.browserPage.locator("main h1").textContent()) ?? "",
    );
    assert.equal(heading, words("confirmEmailAddress.title"));
  },
);

Then("the dialog asks for a name", async function (this: SpecWorld) {
  const input = this.browserPage
    .locator(dialog)
    .getByLabel(words("confirmEmailAddress.name"), { exact: true });
  assert.equal(await input.count(), 1, "The dialog has no field for a name.");
  assert.equal(await input.getAttribute("type"), "text");
});

Then(
  "the dialog asks for the password again",
  async function (this: SpecWorld) {
    const input = this.browserPage
      .locator(dialog)
      .getByLabel(words("confirmEmailAddress.passwordAgain"), { exact: true });
    assert.equal(
      await input.count(),
      1,
      "The dialog does not ask for the password again.",
    );
    assert.equal(await input.getAttribute("type"), "password");
  },
);

Then("the page has no form to fill in", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage.locator(`${dialog} form`).count(),
    0,
    "There is still a form on the page.",
  );
});

Then(
  "the name in the form is {string}",
  async function (this: SpecWorld, name: string) {
    assert.equal(
      await this.browserPage.inputValue(`${dialog} input[name="name"]`),
      name,
    );
  },
);

// What the reader is told -------------------------------------------------------------

Then(
  "the reader is told their email address is confirmed",
  function (this: SpecWorld) {
    return toldThat(this, "confirmEmailAddress.confirmed.explanation");
  },
);

Then("the reader is told the link has expired", function (this: SpecWorld) {
  return toldThat(this, "confirmEmailAddress.expired.explanation");
});

Then("the reader is told the link no longer works", function (this: SpecWorld) {
  return toldThat(this, "confirmEmailAddress.noLongerWorks.explanation");
});

// Either page can say it: the one a link opens, and the one that trades an
// expired link for a new one. Both say it in their own words, and what the
// scenario is asking is that the reader was told.
Then(
  "the reader is told their email address is already confirmed",
  async function (this: SpecWorld) {
    const content = await contentOf(this);
    const said = [
      words("confirmEmailAddress.alreadyConfirmed.explanation"),
      words("newConfirmationLink.alreadyConfirmed.explanation"),
    ];
    assert.ok(
      said.some((each) => content.includes(each)),
      "Neither page says the address is already confirmed.",
    );
  },
);

// Beneath the field it is about, found by what the field announces, so that a
// message drawn somewhere on the page and not tied to the field does not count.
Then(
  "the reader is told the password was typed differently the second time",
  async function (this: SpecWorld) {
    const described = await this.browserPage
      .locator(`${dialog} input[name="passwordConfirmation"]`)
      .getAttribute("aria-describedby");
    assert.ok(described !== null, "The field announces no message.");
    const message = unmarked(
      (await this.browserPage.locator(`#${described}`).textContent()) ?? "",
    );
    assert.equal(message.trim(), words("Password.ConfirmationDiffers"));
  },
);

// Where it points --------------------------------------------------------------------

Then("the page links to the sign in page", async function (this: SpecWorld) {
  assert.ok((await linksTo(this, signIn)) > 0, "Nothing points to signing in.");
});

Then(
  "the page links to the new confirmation link page",
  async function (this: SpecWorld) {
    assert.ok(
      (await linksTo(this, newConfirmationLink)) > 0,
      "Nothing offers a new link.",
    );
  },
);

Then(
  "the page does not link to the new confirmation link page",
  async function (this: SpecWorld) {
    assert.equal(
      await linksTo(this, newConfirmationLink),
      0,
      "The page offers a new link, and there is none to be had.",
    );
  },
);

// What was kept ------------------------------------------------------------------------

Then(
  "the email address {string} is confirmed",
  async function (this: SpecWorld, address: string) {
    const account = await accountFor(this, address);
    assert.equal(account.confirmed, true, "It is not confirmed.");
  },
);

Then(
  "the email address {string} is not confirmed",
  async function (this: SpecWorld, address: string) {
    const account = await accountFor(this, address);
    assert.equal(account.confirmed, false, "It is confirmed.");
  },
);

Then(
  "the account for the email address {string} is called {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = await accountFor(this, address);
    assert.equal(account.name?.toString(), name);
  },
);
