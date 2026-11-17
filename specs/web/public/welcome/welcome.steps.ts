import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { unmarked } from "../../support/languages.js";
import type { WebWorld } from "../../support/world.js";

const welcome = "/account/welcome";

When("the welcome page is opened", async function (this: WebWorld) {
  await this.browserPage.goto(`${this.baseUrl!}${welcome}`);
});

// Shown to a reader with no scripting — the scenarios' browser has none — and
// nobody signed in, since nobody can be yet. Judged by what the page says and
// not by the status of a response this step did not ask for, since the reader
// may have arrived by registering rather than by opening it: a page that could
// not be found, or was refused, is at the same address with another heading.
Then("the welcome page is shown", async function (this: WebWorld) {
  const title = "Check your email";
  assert.equal(new URL(this.browserPage.url()).pathname, welcome);
  const heading =
    (await this.browserPage.locator("main h1").textContent()) ?? "";
  assert.equal(unmarked(heading), title, "The welcome page was not shown.");
});

// Said by more than one page: where registering ends, and wherever a link
// has just been asked for. Each says it in its own words, and what the
// scenario is asking is that the reader was told to go and look.
const toldToCheck = [
  "An email is on its way to the address you gave. Follow the link in it to carry on.",
  "A new link is on its way. Follow it to confirm your email address. If nothing arrives in a few minutes, look in your junk or spam folder.",
  "If that address has an account, a link to set a new password is on its way. Follow it within the hour. If nothing arrives in a few minutes, look in your junk or spam folder.",
  "We have emailed a link to your account's address. It works for 15 minutes, and only while you are signed in to this account.",
  "We have emailed you a link to set a password. It works for an hour.",
  "A link to confirm the move has been sent to the new email address. Follow it, signed in, to move your account there.",
];

Then(
  "the reader is told to check their email",
  async function (this: WebWorld) {
    const content =
      (await this.browserPage.locator("main").textContent()) ?? "";
    assert.ok(
      toldToCheck.some((each) => unmarked(content).includes(each)),
      "The page does not say to check email.",
    );
  },
);
