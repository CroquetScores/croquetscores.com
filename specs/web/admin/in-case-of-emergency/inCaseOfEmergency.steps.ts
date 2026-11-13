// The page for asking to take over the site (inCaseOfEmergency.feature), in a
// real browser. The words are read with the test locale's marks taken off,
// since what is asked is what the page says and not which phrases it came from.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import {
  anApplicationWithEmergencyContacts,
  applicationFor,
} from "../../support/browser.js";
import { unmarked } from "../../support/languages.js";

// The pages this feature names, by what a reader would call them.
const addresses: Readonly<Record<string, string>> = {
  "in case of emergency": "/admin/in-case-of-emergency",
};

const addressOf = (page: string): string => {
  const found = addresses[page];
  assert.ok(found !== undefined, `There is no page called "${page}".`);
  return found;
};

const dialogOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("dialog[open]");

const answerOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("#field-message");

const sendButtonOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("main form .button-submit");

// Who the scenario says holds the site's passwords, kept so that what was
// queued can be asked of each. A setting of the site, read when it is built, so
// it is said before the site is served.
const contacts = new WeakMap<SpecWorld, readonly string[]>();

// One step for the application's scenarios and for this one: said to an
// application the scenario stood up it tells that, and otherwise the site the
// browser is served is made with them.
Given(
  "the emergency contacts are at {string} and {string}",
  async function (this: SpecWorld, first: string, second: string) {
    contacts.set(this, [first, second]);
    if (this.registering !== undefined) {
      this.registering.emergencyContactsAre([first, second]);
      return;
    }
    this.baseUrl = await anApplicationWithEmergencyContacts(this, [
      first,
      second,
    ]);
  },
);

const openPage = async (world: SpecWorld, page: string): Promise<void> => {
  await world.browserPage.goto(`${world.baseUrl!}${addressOf(page)}`);
};

Given(
  "the page {string} is open",
  async function (this: SpecWorld, page: string) {
    await openPage(this, page);
    await answerOf(this).waitFor();
  },
);

When(
  "the page {string} is opened",
  async function (this: SpecWorld, page: string) {
    await openPage(this, page);
  },
);

Then(
  "the question {string} is on the page",
  async function (this: SpecWorld, question: string) {
    const label = this.browserPage.locator(".field label").first();
    await label.waitFor();
    assert.equal(unmarked((await label.innerText()).trim()), question);
  },
);

Then(
  "the button {string} is on the page",
  async function (this: SpecWorld, name: string) {
    await sendButtonOf(this).waitFor();
    assert.equal(unmarked((await sendButtonOf(this).innerText()).trim()), name);
  },
);

Then("the question is no longer on the page", async function (this: SpecWorld) {
  await this.browserPage.locator("[data-sent]").waitFor();
  assert.equal(await this.browserPage.locator(".field label").count(), 0);
});

Then(
  "the button to send is no longer on the page",
  async function (this: SpecWorld) {
    await this.browserPage.locator("[data-sent]").waitFor();
    assert.equal(await sendButtonOf(this).count(), 0);
  },
);

Given(
  "the answer {string} is typed",
  async function (this: SpecWorld, answer: string) {
    await answerOf(this).fill(answer);
  },
);

// Pressing Send opens the dialog before anything is sent, so the step waits
// for it: what follows asks about the dialog or about what was not sent.
const pressSend = async function (
  this: SpecWorld,
  name: string,
): Promise<void> {
  assert.equal(unmarked((await sendButtonOf(this).innerText()).trim()), name);
  await sendButtonOf(this).click();
  await dialogOf(this).waitFor();
};

When("the button {string} is pressed", pressSend);

Then("a dialog asks whether to send", async function (this: SpecWorld) {
  await dialogOf(this).waitFor();
  assert.equal(
    await dialogOf(this).locator(".dialog-buttons .button-submit").count(),
    1,
    "The dialog has no button to send with.",
  );
});

// Cancel is the dialog's one button that is not its submit button.
When("the dialog is cancelled", async function (this: SpecWorld) {
  await dialogOf(this)
    .locator(".dialog-buttons button:not(.button-submit)")
    .click();
  await dialogOf(this).waitFor({ state: "detached" });
});

// Closed once what it asked has been answered, whichever way: the page shows a
// refusal where what was typed is, so the dialog is not left over it.
const confirm = async function (this: SpecWorld): Promise<void> {
  await dialogOf(this).locator(".dialog-buttons .button-submit").click();
  await dialogOf(this).waitFor({ state: "detached" });
};

When("the dialog is confirmed", confirm);

Then(
  "the answer typed is {string}",
  async function (this: SpecWorld, answer: string) {
    assert.equal(await answerOf(this).inputValue(), answer);
  },
);

Then("the page says the message was sent", async function (this: SpecWorld) {
  await this.browserPage.locator("[data-sent]").waitFor();
});

Then(
  "the answer is refused with {string}",
  async function (this: SpecWorld, code: string) {
    const refusal = this.browserPage.locator(".field-message");
    await refusal.waitFor();
    const refusedWith = (await refusal.getAttribute("data-refused")) ?? "";
    assert.ok(
      refusedWith.split(" ").includes(code),
      `The answer is refused with "${refusedWith}".`,
    );
  },
);

// The words a refusal is said in, read and not only its code: the admin is sent
// words only for the codes it is told of (adminPage.ts), and one it is not told
// of is said as "Something went wrong on the site.", which has the right code.
const refusalReads = async (
  world: SpecWorld,
  where: string,
  words: string,
): Promise<void> => {
  const refusal = world.browserPage.locator(where);
  await refusal.waitFor();
  assert.equal(unmarked((await refusal.innerText()).trim()), words);
};

Then(
  "the refusal of the answer reads {string}",
  async function (this: SpecWorld, words: string) {
    await refusalReads(this, ".field-message", words);
  },
);

Then(
  "the refusal of the page reads {string}",
  async function (this: SpecWorld, words: string) {
    await refusalReads(this, "[data-refused].page-refused", words);
  },
);

// What is waiting to be sent, as the application the scenario stood up has it
// or as the site the browser was served has it: one step for both, since
// "nothing was sent" is said the same of each.
const waiting = async (
  world: SpecWorld,
): Promise<readonly { kind: string; to: string }[]> => {
  if (world.registering !== undefined) return world.registering.queued();
  const application = applicationFor(world);
  const emails = await application.unitOfWork.inTransaction(() =>
    application.emailQueue.emails(),
  );
  // Only what the page sends: the confirmation the account the scenario made
  // was queued with, as it was made, is not what is being asked about.
  return emails
    .filter(
      (email) => !email.givenUp && email.kind.startsWith("Email.Emergency"),
    )
    .map((email) => ({ kind: email.kind, to: email.to ?? "" }));
};

Then("no email is queued", async function (this: SpecWorld) {
  assert.deepEqual(await waiting(this), [], "Something is queued.");
});

Then(
  "the email {string} is queued for each emergency contact",
  async function (this: SpecWorld, kind: string) {
    const named = contacts.get(this);
    assert.ok(named !== undefined, "No emergency contacts were named.");
    const queued = await waiting(this);
    for (const contact of named) {
      assert.equal(
        queued.filter((email) => email.kind === kind && email.to === contact)
          .length,
        1,
        `${kind} is not queued for ${contact}.`,
      );
    }
  },
);
