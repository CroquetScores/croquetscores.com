// The pages that ask a service outside the site, with that service taken down
// and brought back by the scenario.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import {
  administratorForScenarios,
  applicationFor,
  serviceIsDown,
} from "../../support/browser.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const registrationsSuspended = "/account/registrations-suspended";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

// Taking services down and bringing them back ------------------------------------

Given("reCAPTCHA cannot be reached", function (this: SpecWorld) {
  serviceIsDown(this, "reCAPTCHA", true);
});

Given("reCAPTCHA can be reached again", function (this: SpecWorld) {
  serviceIsDown(this, "reCAPTCHA", false);
});

Given("Have I Been Pwned cannot be reached", function (this: SpecWorld) {
  serviceIsDown(this, "Have I Been Pwned", true);
});

Given("Have I Been Pwned can be reached again", function (this: SpecWorld) {
  serviceIsDown(this, "Have I Been Pwned", false);
});

// The page -------------------------------------------------------------------------

When(
  "the registrations suspended page is opened",
  async function (this: SpecWorld) {
    await this.browserPage.goto(`${this.baseUrl!}${registrationsSuspended}`);
  },
);

Then(
  "the registrations suspended page is shown",
  async function (this: SpecWorld) {
    assert.equal(
      new URL(this.browserPage.url()).pathname,
      registrationsSuspended,
    );
    const heading = unmarked(
      (await this.browserPage.locator("main h1").textContent()) ?? "",
    );
    assert.equal(heading, words("registrationsSuspended.title"));
  },
);

Then(
  "the reader is told registering is suspended",
  async function (this: SpecWorld) {
    const content = unmarked(
      (await this.browserPage.locator("main").textContent()) ?? "",
    );
    assert.ok(
      content.includes(words("registrationsSuspended.explanation")),
      "The page does not say registering is suspended.",
    );
  },
);

// What was and was not changed ------------------------------------------------------

// Signed in with it, as a reader would find out whether their old password
// still works: nothing else says so without asking the hash.
Then(
  "the reader can sign in as {string} with the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    const page = this.browserPage;
    await page.goto(`${this.baseUrl!}/account/sign-in`);
    await page.fill('section.dialog input[name="emailAddress"]', address);
    await page.fill('section.dialog input[name="password"]', password);
    await page.click('section.dialog button[type="submit"]');
    await page.waitForLoadState();
    assert.ok(
      (await page
        .locator('details.account-menu form[action="/account/sign-out"]')
        .count()) > 0,
      `${address} could not sign in with that password.`,
    );
  },
);

Then(
  "the administrator is emailed that {string} cannot be reached",
  async function (this: SpecWorld, service: string) {
    const application = applicationFor(this);
    const queued = await application.unitOfWork.inTransaction(() =>
      application.emailQueue.emails(),
    );
    const told = queued.filter(
      (email) =>
        email.to === administratorForScenarios &&
        email.kind === "Email.RegistrationsSuspended" &&
        email.fill?.["service"] === service,
    );
    assert.equal(
      told.length,
      1,
      `The administrator was told ${told.length} times.`,
    );
  },
);
