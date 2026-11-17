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

import { detailsOfAccount, latestLinkTo } from "../../support/control.js";
import { alterLink } from "../../support/links.js";
import type { WebWorld } from "../../support/world.js";
import { unmarked } from "../../support/languages.js";
import { wordsFor } from "../../support/words.js";

const confirmEmailAddress = "/account/confirm-email-address";
const signIn = "/account/sign-in";
const newConfirmationLink = "/account/new-confirmation-link";

const dialog = "section.dialog";

const words = wordsFor;

const contentOf = async (world: WebWorld): Promise<string> =>
  unmarked((await world.browserPage.locator("main").textContent()) ?? "");

const toldThat = async (world: WebWorld, key: string): Promise<void> => {
  const said = words(key);
  const content = await contentOf(world);
  assert.ok(content.includes(said), `The page does not say: ${said}`);
};

// Found by where it leads rather than by the whole address, since a link may
// carry the reader's link on with it.
const linksTo = async (world: WebWorld, path: string): Promise<number> =>
  world.browserPage.locator(`main a[href^="${path}"]`).count();

// The link as it reached the reader's inbox, pointed at the application this
// scenario is talking to: the site's own address is the one the emails are made
// with, and it is not where this scenario's application is listening.
const asFollowedHere = (world: WebWorld, link: string): string => {
  const followed = new URL(link);
  return `${world.baseUrl!}${followed.pathname}${followed.search}`;
};

const linkInHand = (world: WebWorld): string => {
  assert.ok(world.linkInHand !== undefined, "The scenario has no link.");
  return world.linkInHand;
};

const follow = async (world: WebWorld): Promise<void> => {
  await world.browserPage.goto(asFollowedHere(world, linkInHand(world)));
};

// What registering left behind ---------------------------------------------------

Given(
  "a link to confirm the email address has been sent to {string}",
  async function (this: WebWorld, address: string) {
    this.linkInHand = await latestLinkTo(address);
    // Named for the scenario's later steps, so that one reading "the new link"
    // knows whose mail to read.
    this.addressInHand = address;
  },
);

Given("the link has been altered", function (this: WebWorld) {
  this.linkInHand = alterLink(linkInHand(this));
});

// Following it ---------------------------------------------------------------------

// Given and When alike: a scenario that follows the link on its way to
// something else says so with Given, and Cucumber holds one definition for
// both.
When("the link is followed", async function (this: WebWorld) {
  await follow(this);
});

// The scenarios' browser has scripting switched off unless a step asks for it
// back, so this is the same following. It is said in the scenario all the same,
// because what that scenario is about is that the page works without it.
When(
  "the link is followed with scripting off",
  async function (this: WebWorld) {
    await follow(this);
  },
);

// Filling it in --------------------------------------------------------------------

const type = (world: WebWorld, field: string, given: string) =>
  world.browserPage.fill(`${dialog} input[name="${field}"]`, given);

Given("the name typed as {string}", function (this: WebWorld, name: string) {
  return type(this, "name", name);
});

Given(
  "the password typed as {string}",
  function (this: WebWorld, password: string) {
    return type(this, "password", password);
  },
);

Given(
  "the confirm password typed as {string}",
  function (this: WebWorld, password: string) {
    return type(this, "passwordConfirmation", password);
  },
);

// What the page is ------------------------------------------------------------------

Then(
  "the confirm email address page is shown",
  async function (this: WebWorld) {
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

Then(
  "the dialog asks for the confirm password",
  async function (this: WebWorld) {
    const input = this.browserPage
      .locator(dialog)
      .getByLabel(words("confirmEmailAddress.confirmPassword"), {
        exact: true,
      });
    assert.equal(
      await input.count(),
      1,
      "The dialog does not ask for the confirm password.",
    );
    assert.equal(await input.getAttribute("type"), "password");
  },
);

Then("the page has no form to fill in", async function (this: WebWorld) {
  assert.equal(
    await this.browserPage.locator(`${dialog} form`).count(),
    0,
    "There is still a form on the page.",
  );
});

Then(
  "the name in the form is {string}",
  async function (this: WebWorld, name: string) {
    assert.equal(
      await this.browserPage.inputValue(`${dialog} input[name="name"]`),
      name,
    );
  },
);

// What the reader is told -------------------------------------------------------------

Then(
  "the reader is told their email address is confirmed",
  function (this: WebWorld) {
    return toldThat(this, "confirmEmailAddress.confirmed.explanation");
  },
);

Then("the reader is told the link has expired", function (this: WebWorld) {
  return toldThat(this, "confirmEmailAddress.expired.explanation");
});

// Every page a link opens can say it, each in its own words; what the scenario
// asks is that the reader was told.
Then(
  "the reader is told the link no longer works",
  async function (this: WebWorld) {
    const content = await contentOf(this);
    const said = [
      words("confirmEmailAddress.noLongerWorks.explanation"),
      words("newConfirmationLink.noLongerWorks.explanation"),
      words("setNewPassword.noLongerWorks.explanation"),
      words("setNewPassword.expired.explanation"),
      words("forgetAccount.noLongerWorks.explanation"),
    ];
    assert.ok(
      said.some((each) => content.includes(each)),
      "No page says the link no longer works.",
    );
  },
);

// Either page can say it: the one a link opens, and the one that trades an
// expired link for a new one. Both say it in their own words, and what the
// scenario is asking is that the reader was told.
Then(
  "the reader is told their email address is already confirmed",
  async function (this: WebWorld) {
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
  async function (this: WebWorld) {
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

Then("the page links to the sign in page", async function (this: WebWorld) {
  assert.ok((await linksTo(this, signIn)) > 0, "Nothing points to signing in.");
});

Then(
  "the page links to the new confirmation link page",
  async function (this: WebWorld) {
    assert.ok(
      (await linksTo(this, newConfirmationLink)) > 0,
      "Nothing offers a new link.",
    );
  },
);

Then(
  "the page does not link to the new confirmation link page",
  async function (this: WebWorld) {
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
  async function (this: WebWorld, address: string) {
    const account = await detailsOfAccount(address);
    assert.equal(account.confirmed, true, "It is not confirmed.");
  },
);

Then(
  "the email address {string} is not confirmed",
  async function (this: WebWorld, address: string) {
    const account = await detailsOfAccount(address);
    assert.equal(account.confirmed, false, "It is confirmed.");
  },
);

Then(
  "the account for the email address {string} is called {string}",
  async function (this: WebWorld, address: string, name: string) {
    assert.equal((await detailsOfAccount(address)).name, name);
  },
);
