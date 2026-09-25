// The change email address page, and the page its link opens, in a real
// browser. The link is taken out of the email the queue holds, as a reader
// takes it out of their mail, and followed at the scenario's own site.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { applicationFor } from "../../support/browser.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const changeEmailAddress = "/account/change-email-address";
const dialog = "section.dialog";

const words = (key: string, fill: Record<string, string> = {}): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return Object.entries(fill).reduce(
    (text, [name, value]) => text.split(`{${name}}`).join(value),
    said,
  );
};

const open = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${changeEmailAddress}`);
};

Given(
  "the change email address page is open",
  async function (this: SpecWorld) {
    await open(this);
  },
);

When(
  "the change email address page is opened",
  async function (this: SpecWorld) {
    await open(this);
  },
);

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
When(
  "the change email address page is opened with scripting off",
  async function (this: SpecWorld) {
    await open(this);
  },
);

Then(
  "the change email address page is shown",
  async function (this: SpecWorld) {
    assert.equal(new URL(this.browserPage.url()).pathname, changeEmailAddress);
    const title = unmarked(
      (await this.browserPage.locator(".dialog-title").textContent()) ?? "",
    );
    assert.equal(title, words("changeEmailAddress.title"));
  },
);

Then(
  "the dialog asks for a new email address",
  async function (this: SpecWorld) {
    const input = this.browserPage
      .locator(dialog)
      .getByLabel(words("changeEmailAddress.emailAddress"), { exact: true });
    assert.equal(await input.count(), 1, "It does not ask for an address.");
    assert.equal(await input.getAttribute("type"), "email");
  },
);

Given(
  "the new email address {string} is typed",
  async function (this: SpecWorld, typed: string) {
    await this.browserPage.fill(`${dialog} input[name="emailAddress"]`, typed);
  },
);

// What was queued ---------------------------------------------------------------

const queuedFor = async (world: SpecWorld, address: string, kind: string) => {
  const application = applicationFor(world);
  const queued = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
  return queued.filter(
    (email) => !email.givenUp && email.to === address && email.kind === kind,
  );
};

Then(
  "a link to confirm the new email address is emailed to {string}",
  async function (this: SpecWorld, address: string) {
    const sent = await queuedFor(this, address, "Email.ConfirmNewEmailAddress");
    assert.equal(sent.length, 1, `No link to confirm was sent to ${address}.`);
  },
);

Then(
  "no link to confirm the new email address is emailed to {string}",
  async function (this: SpecWorld, address: string) {
    const sent = await queuedFor(this, address, "Email.ConfirmNewEmailAddress");
    assert.equal(sent.length, 0, `A link to confirm was sent to ${address}.`);
  },
);

Then(
  "{string} is sent an email saying it has an account already",
  async function (this: SpecWorld, address: string) {
    const sent = await queuedFor(this, address, "Email.AlreadyHasAnAccount");
    assert.equal(sent.length, 1, `${address} was not told.`);
  },
);

Then(
  "{string} is sent an email saying the account has moved to {string}",
  async function (this: SpecWorld, address: string, movedTo: string) {
    const sent = await queuedFor(this, address, "Email.EmailAddressChanged");
    assert.equal(sent.length, 1, `${address} was not told.`);
    assert.equal(sent[0]?.fill?.["emailAddress"], movedTo);
  },
);

// Asking, following and confirming -------------------------------------------------

const press = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

// Asked for the way a reader asks, on the page, signed in as the scenario has
// signed them in.
const askToMoveTo = async (
  world: SpecWorld,
  address: string,
): Promise<void> => {
  await open(world);
  await world.browserPage.fill(`${dialog} input[name="emailAddress"]`, address);
  await world.browserPage.fill(
    `${dialog} input[name="currentPassword"]`,
    "correct horse battery staple",
  );
  await press(world);
};

Given(
  "changing the email address to {string} has been asked for",
  async function (this: SpecWorld, address: string) {
    await askToMoveTo(this, address);
  },
);

const follow = async (world: SpecWorld, address: string): Promise<void> => {
  const sent = await queuedFor(world, address, "Email.ConfirmNewEmailAddress");
  const link = sent[sent.length - 1]?.link;
  assert.ok(link !== undefined, `No link to confirm was sent to ${address}.`);
  const followed = new URL(link);
  await world.browserPage.goto(
    `${world.baseUrl!}${followed.pathname}${followed.search}`,
  );
};

When(
  "the link emailed to {string} is followed",
  async function (this: SpecWorld, address: string) {
    await follow(this, address);
  },
);

Given(
  "the link emailed to {string} has been followed",
  async function (this: SpecWorld, address: string) {
    await follow(this, address);
  },
);

When("moving the account is confirmed", async function (this: SpecWorld) {
  await press(this);
});

// The whole of it, as a reader does it: asked, followed and confirmed.
const moveTo = async (world: SpecWorld, address: string): Promise<void> => {
  await askToMoveTo(world, address);
  await follow(world, address);
  await press(world);
};

Given(
  "the account has been moved to {string}",
  async function (this: SpecWorld, address: string) {
    await moveTo(this, address);
  },
);

When(
  "the account is moved to {string}",
  async function (this: SpecWorld, address: string) {
    await moveTo(this, address);
  },
);

// What the page says ---------------------------------------------------------------

const said = async (world: SpecWorld): Promise<string> =>
  unmarked((await world.browserPage.locator("main").textContent()) ?? "");

Then(
  "the page says the account will move to {string}",
  async function (this: SpecWorld, address: string) {
    assert.ok(
      (await said(this)).includes(
        words("changeEmailAddress.confirm.explanation", {
          emailAddress: address,
        }),
      ),
      `The page does not say the account will move to ${address}.`,
    );
  },
);

Then(
  "the page says the link no longer works",
  async function (this: SpecWorld) {
    assert.ok(
      (await said(this)).includes(
        words("changeEmailAddress.noLongerWorks.title"),
      ),
      "The page does not say the link no longer works.",
    );
  },
);
