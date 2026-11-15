// The change password page, in a real browser. Every password is typed as a
// reader types it, and the dialog submitted by its button.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  openAndKeepTheAnswer,
  postAndKeepTheAnswer,
} from "../../support/answered.js";
import { applicationFor } from "../../support/browser.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const changePassword = "/account/change-password";
const dialog = "section.dialog";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const open = async (world: SpecWorld): Promise<void> => {
  await openAndKeepTheAnswer(world, changePassword);
};

Given("the change password page is open", async function (this: SpecWorld) {
  await open(this);
});

When("the change password page is opened", async function (this: SpecWorld) {
  await open(this);
});

// Whatever it is posted, since what is posted is not what is being asked
// about: only whether there is a page there to take it.
When("the change password page is posted to", async function (this: SpecWorld) {
  await postAndKeepTheAnswer(this, changePassword, {
    currentPassword: "correct horse battery staple",
    password: "staple battery horse correct",
    passwordConfirmation: "staple battery horse correct",
  });
});

// Scripting is off unless a step asks for it back, so this is the same
// opening, said all the same because it is what the scenario is about.
When(
  "the change password page is opened with scripting off",
  async function (this: SpecWorld) {
    await open(this);
  },
);

Then("the change password page is shown", async function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, changePassword);
  const title = unmarked(
    (await this.browserPage.locator(".dialog-title").textContent()) ?? "",
  );
  assert.equal(title, words("changePassword.title"));
});

// Asked for by a field of the kind that hides what is typed, found by its
// label, which is what a reader and a screen reader know it by.
const asksFor = async (world: SpecWorld, label: string): Promise<void> => {
  const input = world.browserPage
    .locator(dialog)
    .getByLabel(words(label), { exact: true });
  assert.equal(await input.count(), 1, `The dialog does not ask for ${label}.`);
  assert.equal(await input.getAttribute("type"), "password");
};

Then(
  "the dialog asks for the current password",
  async function (this: SpecWorld) {
    await asksFor(this, "changePassword.currentPassword");
  },
);

Then("the dialog asks for a new password", async function (this: SpecWorld) {
  await asksFor(this, "changePassword.password");
});

Then(
  "the dialog asks for the new password again",
  async function (this: SpecWorld) {
    await asksFor(this, "changePassword.passwordConfirmation");
  },
);

const type = async (
  world: SpecWorld,
  field: string,
  typed: string,
): Promise<void> => {
  await world.browserPage.fill(`${dialog} input[name="${field}"]`, typed);
};

Given(
  "the current password {string} is typed",
  async function (this: SpecWorld, typed: string) {
    await type(this, "currentPassword", typed);
  },
);

Given(
  "the new password {string} is typed",
  async function (this: SpecWorld, typed: string) {
    await type(this, "password", typed);
  },
);

Given(
  "the new password is typed again as {string}",
  async function (this: SpecWorld, typed: string) {
    await type(this, "passwordConfirmation", typed);
  },
);

Then("every password field is empty", async function (this: SpecWorld) {
  const fields = await this.browserPage
    .locator(`${dialog} input[type="password"]`)
    .all();
  assert.ok(fields.length > 0, "The dialog has no password field.");
  for (const field of fields) {
    assert.equal(await field.inputValue(), "", "A password was put back.");
  }
});

// Checked against the hash the account keeps, as signing in would check it,
// without signing in: a scenario held by the sign in limit could not.
const matches = async (
  world: SpecWorld,
  address: string,
  password: string,
): Promise<boolean> => {
  const application = applicationFor(world);
  const account = await application.unitOfWork.inTransaction(async () => {
    const id = await application.accountsByEmailAddress.find(
      EmailAddress.from(address),
    );
    assert.ok(id !== undefined, `There is no account for ${address}.`);
    return application.accounts.load(id);
  });
  assert.ok(account !== undefined, `Nothing is kept for ${address}.`);
  const checked = await application.passwords.check(
    password,
    account.passwordHash,
  );
  return checked.matches;
};

Then(
  "the account for the email address {string} has the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    assert.ok(
      await matches(this, address, password),
      "That is not its password.",
    );
  },
);

Then(
  "the account for the email address {string} does not have the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    assert.ok(
      !(await matches(this, address, password)),
      "That is still its password.",
    );
  },
);

Then(
  "{string} is sent an email saying their password was changed",
  async function (this: SpecWorld, address: string) {
    const application = applicationFor(this);
    const queued = await application.unitOfWork.inTransaction(() =>
      application.emailQueue.emails(),
    );
    const sent = queued.filter(
      (email) =>
        !email.givenUp &&
        email.to === address &&
        email.kind === "Email.PasswordChanged",
    );
    assert.equal(sent.length, 1, "No email says the password was changed.");
  },
);
