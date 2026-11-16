// A reader signed in having their account forgotten, in a real browser: asking
// from the page, following the link that arrives, and pressing the button it
// shows.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AskToForgetAccount } from "../../../src/application/operations/accounts/AskToForgetAccount.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../support/world.js";
import { applicationFor } from "./browser.js";
import { clockFor } from "./clock.js";
import { englishForScenarios, unmarked } from "./languages.js";
const dialog = "section.dialog";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

const nowIn = (world: SpecWorld): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(clockFor(world).now.getTime()));

const contentOf = async (world: SpecWorld): Promise<string> =>
  unmarked((await world.browserPage.locator("main").textContent()) ?? "");

const queuedFor = async (world: SpecWorld, address: string) => {
  const application = applicationFor(world);
  const queued = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
  return queued.filter((email) => !email.givenUp && email.to === address);
};

// Asking and confirming -------------------------------------------------------------

const press = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When("forgetting is confirmed", async function (this: SpecWorld) {
  await press(this);
});

// Asked for the way the page asks, for the account the scenario names, and
// taken out of the email the way a reader takes it out of their mail. Nobody
// need be signed in to this browser for it: what the scenario is about is who
// follows the link.
Given(
  "a link to confirm forgetting has been sent to {string}",
  async function (this: SpecWorld, address: string) {
    const application = applicationFor(this);
    const account = await application.unitOfWork.inTransaction(() =>
      application.accountsByEmailAddress.find(EmailAddress.from(address)),
    );
    assert.ok(account !== undefined, `There is no account for ${address}.`);
    await application.mediator.send(
      new AskToForgetAccount(
        account.value,
        "en",
        "croquetscores.com",
        nowIn(this),
      ),
    );
    const sent = (await queuedFor(this, address)).filter(
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
    this.accountHeld = account.value;
  },
);

Then(
  "the reader is told their account has been forgotten",
  async function (this: SpecWorld) {
    assert.ok(
      (await contentOf(this)).includes(
        words("forgetAccount.forgotten.explanation"),
      ),
      "The page does not say the account has been forgotten.",
    );
  },
);
