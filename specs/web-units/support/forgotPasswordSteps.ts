// A reader who has forgotten their password, in a real browser: asking for a
// way back in, following the link that arrives, and choosing a new password.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";

import { ResetPassword } from "../../../src/application/operations/accounts/ResetPassword.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../support/world.js";
import { applicationFor } from "./browser.js";
import { clockFor } from "./clock.js";
import { englishForScenarios, unmarked } from "./languages.js";

const forgotPassword = "/account/forgot-password";
const dialog = "section.dialog";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const nowIn = (world: SpecWorld): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(clockFor(world).now.getTime()));

// Opening it ------------------------------------------------------------------------

const open = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${forgotPassword}`);
};

Given("the forgot password page is open", async function (this: SpecWorld) {
  await open(this);
});

// Asking ----------------------------------------------------------------------------

const ask = async (world: SpecWorld, address: string): Promise<void> => {
  if (new URL(world.browserPage.url()).pathname !== forgotPassword) {
    await open(world);
  }
  await world.browserPage.fill(`${dialog} input[name="emailAddress"]`, address);
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When(
  "the reader asks for a way back in for {string}",
  async function (this: SpecWorld, address: string) {
    asked.set(this, address);
    await ask(this, address);
  },
);

const asked = new WeakMap<SpecWorld, string>();

// A link, asked for the way the page asks and taken out of the email the way a
// reader takes it out of their mail.
Given(
  "a link to set a new password has been sent to {string}",
  async function (this: SpecWorld, address: string) {
    const application = applicationFor(this);
    await application.mediator.send(
      new ResetPassword(
        randomUUID(),
        address,
        "en",
        "croquetscores.com",
        nowIn(this),
      ),
    );
    const queued = await application.unitOfWork.inTransaction(() =>
      application.emailQueue.emails(),
    );
    const sent = queued.filter(
      (email) => email.to === address && email.kind === "Email.SetNewPassword",
    );
    const last = sent[sent.length - 1];
    assert.ok(last?.link !== undefined, "No link to set a password was sent.");
    this.linkInHand = last.link;
    this.addressInHand = address;
  },
);

// Setting it ------------------------------------------------------------------------

const typeInto = (world: SpecWorld, field: string, typed: string) =>
  world.browserPage.fill(`${dialog} input[name="${field}"]`, typed);

const send = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

const setThePassword = async (
  world: SpecWorld,
  password: string,
): Promise<void> => {
  await typeInto(world, "password", password);
  await typeInto(world, "passwordConfirmation", password);
  await send(world);
};

// The password set, so that what it was kept as can be asked about.
const set = new WeakMap<SpecWorld, string>();

When(
  "the new password {string} is set",
  async function (this: SpecWorld, password: string) {
    await setThePassword(this, password);
    set.set(this, password);
  },
);

// What happened ---------------------------------------------------------------------

Then(
  "the reader is told their password has been changed",
  async function (this: SpecWorld) {
    const content = unmarked(
      (await this.browserPage.locator("main").textContent()) ?? "",
    );
    assert.ok(
      content.includes(words("setNewPassword.changed.explanation")),
      "The page does not say the password has been changed.",
    );
  },
);
