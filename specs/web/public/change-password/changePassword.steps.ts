// The change password page, in a real browser. Every password is typed as a
// reader types it, and the dialog submitted by its button.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import {
  openAndKeepTheAnswer,
  postAndKeepTheAnswer,
} from "../../support/answers.js";
import { checkPasswordOf, emailsFor } from "../../support/control.js";
import { unmarked } from "../../support/languages.js";
import { wordsFor } from "../../support/words.js";

const changePassword = "/account/change-password";
const dialog = "section.dialog";

const words = wordsFor;

const open = async (world: WebWorld): Promise<void> => {
  await openAndKeepTheAnswer(world, changePassword);
};

Given("the change password page is open", async function (this: WebWorld) {
  await open(this);
});

When("the change password page is opened", async function (this: WebWorld) {
  await open(this);
});

// Whatever it is posted, since what is posted is not what is being asked
// about: only whether there is a page there to take it.
When("the change password page is posted to", async function (this: WebWorld) {
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
  async function (this: WebWorld) {
    await open(this);
  },
);

Then("the change password page is shown", async function (this: WebWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, changePassword);
  const title = unmarked(
    (await this.browserPage.locator(".dialog-title").textContent()) ?? "",
  );
  assert.equal(title, words("changePassword.title"));
});

// Asked for by a field of the kind that hides what is typed, found by its
// label, which is what a reader and a screen reader know it by.
const asksFor = async (world: WebWorld, label: string): Promise<void> => {
  const input = world.browserPage
    .locator(dialog)
    .getByLabel(words(label), { exact: true });
  assert.equal(await input.count(), 1, `The dialog does not ask for ${label}.`);
  assert.equal(await input.getAttribute("type"), "password");
};

Then(
  "the dialog asks for the current password",
  async function (this: WebWorld) {
    await asksFor(this, "changePassword.currentPassword");
  },
);

Then("the dialog asks for a new password", async function (this: WebWorld) {
  await asksFor(this, "changePassword.password");
});

Then(
  "the dialog asks for the new password again",
  async function (this: WebWorld) {
    await asksFor(this, "changePassword.passwordConfirmation");
  },
);

const type = async (
  world: WebWorld,
  field: string,
  typed: string,
): Promise<void> => {
  await world.browserPage.fill(`${dialog} input[name="${field}"]`, typed);
};

Given(
  "the current password {string} is typed",
  async function (this: WebWorld, typed: string) {
    await type(this, "currentPassword", typed);
  },
);

Given(
  "the new password {string} is typed",
  async function (this: WebWorld, typed: string) {
    await type(this, "password", typed);
  },
);

Given(
  "the new password is typed again as {string}",
  async function (this: WebWorld, typed: string) {
    await type(this, "passwordConfirmation", typed);
  },
);

Then("every password field is empty", async function (this: WebWorld) {
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
  _world: WebWorld,
  address: string,
  password: string,
): Promise<boolean> => (await checkPasswordOf(address, password)).matches;

Then(
  "the account for the email address {string} has the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    assert.ok(
      await matches(this, address, password),
      "That is not its password.",
    );
  },
);

Then(
  "the account for the email address {string} does not have the password {string}",
  async function (this: WebWorld, address: string, password: string) {
    assert.ok(
      !(await matches(this, address, password)),
      "That is still its password.",
    );
  },
);

Then(
  "{string} is sent an email saying their password was changed",
  async function (this: WebWorld, address: string) {
    const sent = (await emailsFor(address)).filter(
      (email) => !email.givenUp && email.kind === "Email.PasswordChanged",
    );
    assert.equal(sent.length, 1, "No email says the password was changed.");
  },
);
