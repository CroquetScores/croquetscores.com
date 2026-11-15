// A reader signed in having their account forgotten, in a real browser: asking
// from the page, following the link that arrives, and pressing the button it
// shows.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AskToForgetAccount } from "../../../../src/application/operations/accounts/AskToForgetAccount.js";
import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../support/world.js";
import { applicationFor } from "../../support/browser.js";
import { clockFor } from "../../support/clock.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const forgetAccount = "/account/forget-account";
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

// Opening it ------------------------------------------------------------------------

const open = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${forgetAccount}`);
};

Given("the forget account page is open", async function (this: SpecWorld) {
  await open(this);
});

When("the forget account page is opened", async function (this: SpecWorld) {
  await open(this);
});

Then("the forget account page is shown", async function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, forgetAccount);
  const heading = unmarked(
    (await this.browserPage.locator("main h1").textContent()) ?? "",
  );
  assert.equal(heading, words("forgetAccount.title"));
});

// Asking and confirming -------------------------------------------------------------

const press = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.click(`${dialog} button[type="submit"]`);
  await world.browserPage.waitForLoadState();
};

When("forgetting the account is asked for", async function (this: SpecWorld) {
  await press(this);
});

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

// A link made for confirming an address, followed as though it were one for
// forgetting: what a reader would do by editing the address.
When(
  "the link to confirm the email address is followed as a link to confirm forgetting",
  async function (this: SpecWorld) {
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
  async function (this: SpecWorld, address: string) {
    const sent = (await queuedFor(this, address)).filter(
      (email) => email.kind === "Email.ConfirmForgetting",
    );
    assert.equal(sent.length, 1, `No link to confirm forgetting was sent.`);
  },
);

Then(
  "the reader is told what forgetting the account means",
  async function (this: SpecWorld) {
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
  async function (this: SpecWorld) {
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
  async function (this: SpecWorld) {
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
  async function (this: SpecWorld, count: number) {
    assert.ok(this.accountHeld !== undefined, "The scenario holds no account.");
    const { rows } = await this.database.query<{ sessions: string }>(
      `select count(*) as sessions from sessions where account_id = $1`,
      [this.accountHeld],
    );
    assert.equal(Number(rows[0]?.sessions ?? 0), count);
  },
);
