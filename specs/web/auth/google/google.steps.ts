import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  addressingOf,
  anApplicationWithoutGoogle,
} from "../../support/browser.js";
import {
  boxOf,
  callback,
  lineIsBeneathTheOffer,
  lineSaying,
  linesSaying,
  messageIsAboveTheOffer,
  offerCarriesGooglesIcon,
  offerCount,
  offerIsAboveTheEmailAddressField,
  offerIsAButton,
  offerIsAsWideAsTheEmailAddressField,
  offerIsBeneathTheTitleBar,
  offerIsInTheDialog,
  offerLooksLikeAButton,
  pressTheOffer,
  waysBackFollowed,
} from "../../support/googleOffer.js";
import { standInGoogleFor } from "../../../infrastructure/support/google.js";
import type { SpecWorld } from "../../../support/world.js";

const offer = 'a[href="/auth/google"]';

const dialog = "section.dialog";
const emailAddressField = `${dialog} label.field-box[for="field-emailAddress"]`;

Given(
  "a site that has not been given Google's credentials",
  async function (this: SpecWorld) {
    this.baseUrl = await anApplicationWithoutGoogle(this);
  },
);

Then(
  "the page offers registering with Google",
  async function (this: SpecWorld) {
    assert.equal(await offerCount(this, offer), 1);
  },
);

Then(
  "the page does not offer registering with Google",
  async function (this: SpecWorld) {
    assert.equal(await offerCount(this, offer), 0);
  },
);

Then(
  "the offer to register with Google is a button",
  async function (this: SpecWorld) {
    await offerIsAButton(this, offer);
  },
);

Then(
  "the offer to register with Google looks like a button other than the submit button",
  async function (this: SpecWorld) {
    await offerLooksLikeAButton(this, offer);
  },
);

Then(
  "the offer to register with Google carries Google's icon",
  async function (this: SpecWorld) {
    await offerCarriesGooglesIcon(this, offer);
  },
);

Then(
  "the offer to register with Google is in the dialog",
  async function (this: SpecWorld) {
    await offerIsInTheDialog(this, offer);
  },
);

Then(
  "the offer to register with Google is beneath the dialog's title bar",
  async function (this: SpecWorld) {
    await offerIsBeneathTheTitleBar(this, offer);
  },
);

Then(
  "the offer to register with Google is above the email address field",
  async function (this: SpecWorld) {
    await offerIsAboveTheEmailAddressField(this, offer);
  },
);

Then(
  "the offer to register with Google is as wide as the email address field",
  async function (this: SpecWorld) {
    await offerIsAsWideAsTheEmailAddressField(this, offer);
  },
);

Then(
  "the message for {string} is above the offer to register with Google",
  async function (this: SpecWorld, code: string) {
    await messageIsAboveTheOffer(this, code, offer);
  },
);

Then(
  "the line saying {string} is beneath the offer to register with Google",
  async function (this: SpecWorld, said: string) {
    await lineIsBeneathTheOffer(this, said, offer);
  },
);

// Said of whichever offer the page makes, since what the line is measured
// against is the field and the dialog, and not the offer.

Then(
  "the line saying {string} is above the email address field",
  async function (this: SpecWorld, said: string) {
    const line = await lineSaying(this, said);
    const field = await boxOf(this, emailAddressField);
    assert.ok(
      line.y + line.height <= field.y + 0.5,
      `${said} does not end above the email address field.`,
    );
  },
);

Then(
  "the line saying {string} is centred in the dialog",
  async function (this: SpecWorld, said: string) {
    const line = await lineSaying(this, said);
    const shape = await boxOf(this, dialog);
    const left = line.x - shape.x;
    const right = shape.x + shape.width - (line.x + line.width);
    assert.ok(
      Math.abs(left - right) <= 1,
      `${said} has ${Math.round(left)} pixels to its left and ${Math.round(right)} to its right.`,
    );
  },
);

Then(
  "the dialog has no line saying {string}",
  async function (this: SpecWorld, said: string) {
    assert.deepEqual(await linesSaying(this, said), []);
  },
);

// The scenario's own stand-in, which its application was pointed at when the
// scenario began.
Given(
  "Google will take a code more than once",
  async function (this: SpecWorld) {
    const google = await standInGoogleFor(this);
    google.misbehaving = { ...google.misbehaving, takesCodesAgain: true };
  },
);

// Pressed as a reader who means to register presses it, having agreed to the
// terms of use first (google.feature).
const registerWithGoogle = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.check('section.dialog input[name="termsOfUse"]');
  await pressTheOffer(this, offer);
};

When("the reader registers with Google", registerWithGoogle);
Given("the reader has registered with Google", registerWithGoogle);

When(
  "the reader registers with Google without agreeing to the terms of use",
  async function (this: SpecWorld) {
    await pressTheOffer(this, offer);
  },
);

When(
  "the reader follows the same way back from Google again",
  async function (this: SpecWorld) {
    const followed = waysBackFollowed(this).at(-1);
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

// Where the site sent the reader to ask Google, kept to be read: the address it
// told Google to send them back to is in it. Followed no further than the site's
// own answer, because the address it names is not one the scenarios' browser
// can reach. Followed as the register page sends a reader along it once they
// have ticked the box agreeing to the terms of use, since one who has not is
// sent back rather than to Google.
const sentTo = new WeakMap<SpecWorld, URL>();

When("the way to Google is followed", async function (this: SpecWorld) {
  const answer = await this.browserPage.request.get(
    `${this.baseUrl!}/auth/google?termsOfUse=on`,
    { headers: addressingOf(this), maxRedirects: 0, failOnStatusCode: false },
  );
  const location = answer.headers()["location"];
  assert.ok(location !== undefined, `The site answered ${answer.status()}.`);
  sentTo.set(this, new URL(location));
});

Then(
  "Google is told to send the reader back to {string}",
  function (this: SpecWorld, address: string) {
    const url = sentTo.get(this);
    assert.ok(url !== undefined, "The reader was not sent to Google.");
    assert.equal(url.searchParams.get("redirect_uri"), address);
  },
);
