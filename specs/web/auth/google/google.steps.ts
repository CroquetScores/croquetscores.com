import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { anApplicationWithoutGoogle } from "../../support/browser.js";
import { standInGoogleFor } from "../../../infrastructure/support/google.js";
import type { SpecWorld } from "../../../support/world.js";

const offer = 'a[href="/auth/google"]';
const callback = "/auth/google/callback";

// Every way back from Google the reader's browser was sent along, so that a
// scenario can follow one again.
const waysBack = new WeakMap<SpecWorld, string[]>();

Given(
  "a site that has not been given Google's credentials",
  async function (this: SpecWorld) {
    this.baseUrl = await anApplicationWithoutGoogle(this);
  },
);

Then(
  "the page offers registering with Google",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator(offer).count(), 1);
  },
);

Then(
  "the page does not offer registering with Google",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator(offer).count(), 0);
  },
);

// Pressed as a reader presses it, and followed wherever it leads: to the
// stand-in, back here, and on to wherever the site sends the reader then.
const registerWithGoogle = async function (this: SpecWorld): Promise<void> {
  const followed: string[] = [];
  waysBack.set(this, followed);
  this.browserPage.on("request", (request) => {
    if (new URL(request.url()).pathname === callback) {
      followed.push(request.url());
    }
  });
  // The page loaded at the end of the redirects, which is the only one of them
  // a browser commits: waiting for an address instead would be satisfied by
  // the register page before anything had happened, and the scenario would go
  // on while the way back was still arriving.
  const arrived = this.browserPage.waitForEvent("load");
  await this.browserPage.click(offer);
  await arrived;
  // And what the page it landed on asks for itself, which the admin does as it
  // starts. Each of those requests carries the session cookie and brings it
  // back renewed, so one still on its way when a scenario then signs the
  // reader out would sign them back in again when it arrived.
  await this.browserPage.waitForLoadState("networkidle");
};

// The scenario's own stand-in, which its application was pointed at when the
// scenario began.
Given(
  "Google will take a code more than once",
  async function (this: SpecWorld) {
    const google = await standInGoogleFor(this);
    google.misbehaving = { ...google.misbehaving, takesCodesAgain: true };
  },
);

When("the reader registers with Google", registerWithGoogle);
Given("the reader has registered with Google", registerWithGoogle);

When(
  "the reader follows the same way back from Google again",
  async function (this: SpecWorld) {
    const followed = waysBack.get(this)?.at(-1);
    assert.ok(followed !== undefined, "No way back from Google was followed.");
    await this.browserPage.goto(followed);
  },
);

// A code Google would take, for the reader the scenario has Google say, sent
// back here by a browser this site never sent to Google: what a page
// elsewhere would send a reader's browser along.
When(
  "the reader arrives back from Google without having been sent there",
  async function (this: SpecWorld) {
    const code = (await standInGoogleFor(this)).aCodeNobodyWasSentFor();
    await this.browserPage.goto(
      `${this.baseUrl!}${callback}?code=${encodeURIComponent(code)}&state=made-up-elsewhere`,
    );
  },
);
