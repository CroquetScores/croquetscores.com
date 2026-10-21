// A reader at the register page, in a real browser.
//
// The page is guarded by reCAPTCHA, so these scenarios run with scripting on
// and with a check of their own standing in for Google: the token the real
// script would fill in is typed into the form instead, and what the scenario's
// check makes of a reader is what the scenario said.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { APIResponse } from "playwright";

import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import {
  registerPath,
  tokenField,
} from "../../../../src/web/public/register.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  applicationFor,
  recaptchaJudges,
  recaptchaScriptDoesNotLoad,
  tokensJudgedFor,
  withScripting,
} from "../../support/browser.js";
import { englishForScenarios } from "../../support/languages.js";

const dialog = "section.dialog";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

// What the script would have filled in. Anything Google would stand behind
// will do: what the scenario's check looks at is whether there is a token at
// all, and what the scenario has said about its reader.
const aToken = "a token reCAPTCHA's script filled in";

// Filling the form in ----------------------------------------------------------------

const fillIn = async (world: SpecWorld, address: string): Promise<void> => {
  await world.browserPage.fill(`${dialog} input[name="emailAddress"]`, address);
  // Put there the way the script would put it, rather than typed: nobody can
  // type into a hidden field, and a browser will not let a scenario either.
  await world.browserPage.evaluate(
    `document.getElementsByName(${JSON.stringify(tokenField)})[0].value = ${JSON.stringify(aToken)}`,
  );
};

// Filled in as a reader who means to register fills it in, which is agreeing
// to the terms of use as well as giving an address (register.feature).
Given(
  "the register form is filled in for {string}",
  async function (this: SpecWorld, address: string) {
    await fillIn(this, address);
    await this.browserPage.check(`${dialog} input[name="termsOfUse"]`);
  },
);

Given(
  "the register form is filled in for {string} without agreeing to the terms of use",
  async function (this: SpecWorld, address: string) {
    await fillIn(this, address);
  },
);

// The form the page showed, sent twice as it stands, the way a browser sends it
// again when the first answer never arrived. Sent from the scenario rather
// than pressed, because a second press is held by the page's script while the
// first is on its way, and what this is about is the site.
When(
  "the form is sent twice for {string}",
  async function (this: SpecWorld, address: string) {
    const action = await this.browserPage
      .locator(`${dialog} form`)
      .getAttribute("action");
    assert.ok(action !== null, "The form says nowhere to send it.");
    const form: Record<string, string> = {
      emailAddress: address,
      [tokenField]: aToken,
      termsOfUse: "on",
    };
    for (let sent = 0; sent < 2; sent++) {
      const answer: APIResponse = await this.browserPage.request.post(
        `${this.baseUrl!}${action}`,
        {
          headers: { "sec-fetch-site": "same-origin" },
          form,
          maxRedirects: 0,
        },
      );
      assert.equal(answer.status(), 303, `It was answered ${answer.status()}.`);
    }
  },
);

// Typed and nothing more, leaving the token to whatever the page's script
// does with it.
Given(
  "the email address {string} is typed",
  async function (this: SpecWorld, address: string) {
    await this.browserPage.fill(
      `${dialog} input[name="emailAddress"]`,
      address,
    );
  },
);

Given("reCAPTCHA judges the reader not a person", function (this: SpecWorld) {
  recaptchaJudges(this, "not a person");
});

// A form sent with nothing in the token field, which is what a browser that
// never ran the script sends. The page is opened with scripting on all the
// same, because a browser without it is sent away before the form arrives —
// that is the other half of the same rule, and this is the half about a form
// that reaches the site unjudged. Given ten seconds rather than five, since
// it opens a page and sends a form, and has run past five on a busy machine.
When(
  "a registration for {string} arrives without reCAPTCHA's judgement",
  { timeout: 10_000 },
  async function (this: SpecWorld, address: string) {
    recaptchaScriptDoesNotLoad(this);
    await withScripting(this);
    await this.browserPage.goto(`${this.baseUrl!}${registerPath}`);
    await this.browserPage.fill(
      `${dialog} input[name="emailAddress"]`,
      address,
    );
    await this.browserPage.click(`${dialog} button[type="submit"]`);
    await this.browserPage.waitForLoadState();
  },
);

// What the page asks for ---------------------------------------------------------------

Then("the dialog does not ask for a name", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage
      .locator(dialog)
      .getByLabel(words("confirmEmailAddress.name"), { exact: true })
      .count(),
    0,
    "The dialog asks for a name.",
  );
});

Then(
  "the dialog does not ask for a password",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage
        .locator(dialog)
        .getByLabel(words("signIn.password"), { exact: true })
        .count(),
      0,
      "The dialog asks for a password.",
    );
  },
);

// Found by name rather than by what it says, because it says nothing: a hidden
// field has no label, and nobody reading the page knows it is there.
Then("the form carries reCAPTCHA's token", async function (this: SpecWorld) {
  assert.equal(
    await this.browserPage
      .locator(`${dialog} form input[type="hidden"][name="${tokenField}"]`)
      .count(),
    1,
    "The form carries no token.",
  );
});

Then(
  "reCAPTCHA judged a token asked for once the form was filled in",
  function (this: SpecWorld) {
    assert.deepEqual(tokensJudgedFor(this), [
      "a token asked for once the form was filled in",
    ]);
  },
);

// What the reader is told -----------------------------------------------------------------

// What was kept ------------------------------------------------------------------------------

const accountsFor = async (
  world: SpecWorld,
  address: string,
): Promise<number> => {
  const application = applicationFor(world);
  const found = await application.unitOfWork.inTransaction(() =>
    application.accountsByEmailAddress.find(EmailAddress.from(address)),
  );
  return found === undefined ? 0 : 1;
};

Then(
  "{string} has an account",
  async function (this: SpecWorld, address: string) {
    assert.equal(await accountsFor(this, address), 1);
  },
);

Then(
  "{string} has no account",
  async function (this: SpecWorld, address: string) {
    // An address that breaks its own rules never had an account and cannot be
    // looked for at all: what this asks is that nothing was recorded for what
    // was typed, and an address nothing could have recorded answers it.
    let counted: number;
    try {
      counted = await accountsFor(this, address);
    } catch {
      counted = 0;
    }
    assert.equal(counted, 0);
  },
);

Then(
  "{string} is sent one email",
  async function (this: SpecWorld, address: string) {
    const application = applicationFor(this);
    const queued = await application.unitOfWork.inTransaction(() =>
      application.emailQueue.emails(),
    );
    const sent = queued.filter(
      (email) => !email.givenUp && email.to === address,
    );
    assert.equal(sent.length, 1, `${sent.length} emails were sent.`);
  },
);

Then(
  "a link to confirm the email address is emailed to {string}",
  async function (this: SpecWorld, address: string) {
    const application = applicationFor(this);
    const queued = await application.unitOfWork.inTransaction(() =>
      application.emailQueue.emails(),
    );
    const waiting = queued.filter(
      (email) => !email.givenUp && email.to === address,
    );
    const last = waiting[waiting.length - 1];
    assert.ok(last !== undefined, `Nothing is queued for ${address}.`);
    assert.equal(last.kind, "Email.ConfirmAddress");
  },
);
