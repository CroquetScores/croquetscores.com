import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  addressingOf,
  anApplicationWithoutFacebook,
  anApplicationWithoutGoogleOrFacebook,
} from "../../support/browser.js";
import {
  boxOf,
  facebookCallback,
  lineIsBeneathTheOffer,
  lineSaying,
  messageIsAboveTheOffer,
  offerCarriesFacebooksIcon,
  offerCount,
  offerIsAboveTheEmailAddressField,
  offerIsAButton,
  offerIsAsWideAsTheEmailAddressField,
  offerIsAsWideAsTheOffer,
  offerIsBeneathTheOffer,
  offerIsBeneathTheTitleBar,
  offerIsInTheDialog,
  offerLooksLikeAButton,
  pressTheOffer,
  waysBackFollowed,
} from "../../support/googleOffer.js";
import { standInFacebookFor } from "../../../infrastructure/support/facebook.js";
import { englishForScenarios } from "../../support/languages.js";
import type { SpecWorld } from "../../../support/world.js";

const offer = 'a[href="/auth/facebook"]';
const googlesOffer = 'a[href="/auth/google"]';

// The one box beneath the offers, which agrees to the terms for registering
// with either (facebook.feature); not the form's own box.
const boxBeneathTheOffers =
  'section.dialog input[type="checkbox"][name="termsOfUseForOffers"]';
const formsBox = 'section.dialog input[type="checkbox"][name="termsOfUse"]';

Given(
  "a site that has not been given Facebook's credentials",
  async function (this: SpecWorld) {
    this.baseUrl = await anApplicationWithoutFacebook(this);
  },
);

Given(
  "a site that has been given neither Google's nor Facebook's credentials",
  async function (this: SpecWorld) {
    this.baseUrl = await anApplicationWithoutGoogleOrFacebook(this);
  },
);

Then(
  "the page offers registering with Facebook",
  async function (this: SpecWorld) {
    assert.equal(await offerCount(this, offer), 1);
  },
);

Then(
  "the page does not offer registering with Facebook",
  async function (this: SpecWorld) {
    assert.equal(await offerCount(this, offer), 0);
  },
);

Then(
  "the offer to register with Facebook is a button",
  async function (this: SpecWorld) {
    await offerIsAButton(this, offer);
  },
);

Then(
  "the offer to register with Facebook looks like a button other than the submit button",
  async function (this: SpecWorld) {
    await offerLooksLikeAButton(this, offer);
  },
);

Then(
  "the offer to register with Facebook carries Facebook's icon",
  async function (this: SpecWorld) {
    await offerCarriesFacebooksIcon(this, offer);
  },
);

Then(
  "the offer to register with Facebook is in the dialog",
  async function (this: SpecWorld) {
    await offerIsInTheDialog(this, offer);
  },
);

Then(
  "the offer to register with Facebook is beneath the dialog's title bar",
  async function (this: SpecWorld) {
    await offerIsBeneathTheTitleBar(this, offer);
  },
);

Then(
  "the offer to register with Facebook is above the email address field",
  async function (this: SpecWorld) {
    await offerIsAboveTheEmailAddressField(this, offer);
  },
);

Then(
  "the offer to register with Facebook is as wide as the email address field",
  async function (this: SpecWorld) {
    await offerIsAsWideAsTheEmailAddressField(this, offer);
  },
);

Then(
  "the offer to register with Facebook is beneath the offer to register with Google",
  async function (this: SpecWorld) {
    await offerIsBeneathTheOffer(this, offer, googlesOffer);
  },
);

Then(
  "the offer to register with Facebook is as wide as the offer to register with Google",
  async function (this: SpecWorld) {
    await offerIsAsWideAsTheOffer(this, offer, googlesOffer);
  },
);

Then(
  "the message for {string} is above the offer to register with Facebook",
  async function (this: SpecWorld, code: string) {
    await messageIsAboveTheOffer(this, code, offer);
  },
);

Then(
  "the line saying {string} is beneath the offer to register with Facebook",
  async function (this: SpecWorld, said: string) {
    await lineIsBeneathTheOffer(this, said, offer);
  },
);

Then(
  "the dialog asks the reader to agree to the terms of use beneath the offer to register with Facebook",
  async function (this: SpecWorld) {
    const found = await this.browserPage.evaluate<{
      label: string;
      below: boolean;
    } | null>(`(() => {
      const box = document.querySelector(${JSON.stringify(boxBeneathTheOffers)});
      const offer = document.querySelector(${JSON.stringify(offer)});
      const label = box?.labels?.[0];
      if (!box || !offer || !label) return null;
      return {
        label: label.textContent.trim(),
        below: box.getBoundingClientRect().top >= offer.getBoundingClientRect().bottom - 0.5,
      };
    })()`);
    assert.ok(found !== null, "The offers have no box beneath them.");
    assert.equal(found.label, englishForScenarios.words["termsOfUse.agree"]);
    assert.ok(found.below, "The box is not beneath the offer.");
  },
);

Then(
  "the box beneath the offers is beneath the offer to register with Facebook",
  async function (this: SpecWorld) {
    const offerBox = await boxOf(this, offer);
    const box = await boxOf(this, boxBeneathTheOffers);
    assert.ok(
      box.y >= offerBox.y + offerBox.height - 0.5,
      "The box is not beneath the offer.",
    );
  },
);

Then(
  "the box beneath the offers is above the line saying {string}",
  async function (this: SpecWorld, said: string) {
    const line = await lineSaying(this, said);
    const box = await boxOf(this, boxBeneathTheOffers);
    assert.ok(
      box.y + box.height <= line.y + 0.5,
      `The box does not end above ${said}.`,
    );
  },
);

Then(
  "the box beneath the offers links to the terms of use for those who write",
  async function (this: SpecWorld) {
    const href = await this.browserPage.evaluate<string | null>(`(() =>
      document
        .querySelector(${JSON.stringify(boxBeneathTheOffers)})
        ?.labels?.[0]?.querySelector("a")
        ?.getAttribute("href") ?? null)()`);
    assert.equal(href, "/admin/terms-of-use");
  },
);

Then(
  "the box beneath the offers says the message for {string}",
  async function (this: SpecWorld, code: string) {
    const said = await this.browserPage.evaluate<string | null>(`(() => {
      const box = document.querySelector(${JSON.stringify(boxBeneathTheOffers)});
      const id = box?.getAttribute("aria-describedby");
      const message = id ? document.getElementById(id) : null;
      return message ? message.textContent.trim() : null;
    })()`);
    assert.equal(said, englishForScenarios.words[code]);
  },
);

// The scenario's own stand-in, which its application was pointed at when the
// scenario began.
Given(
  "Facebook will take a code more than once",
  async function (this: SpecWorld) {
    const facebook = await standInFacebookFor(this);
    facebook.misbehaving = { ...facebook.misbehaving, takesCodesAgain: true };
  },
);

// Pressed as a reader who means to register presses it, having agreed to the
// terms of use first (facebook.feature).
const registerWithFacebook = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.check(boxBeneathTheOffers);
  await pressTheOffer(this, offer, facebookCallback);
};

When("the reader registers with Facebook", registerWithFacebook);
Given("the reader has registered with Facebook", registerWithFacebook);

When(
  "the reader registers with Facebook having agreed to the terms of use only beneath the email address field",
  async function (this: SpecWorld) {
    await this.browserPage.check(formsBox);
    await pressTheOffer(this, offer, facebookCallback);
  },
);

When(
  "the reader registers with Facebook without agreeing to the terms of use",
  async function (this: SpecWorld) {
    await pressTheOffer(this, offer, facebookCallback);
  },
);

When(
  "the reader follows the same way back from Facebook again",
  async function (this: SpecWorld) {
    const followed = waysBackFollowed(this).at(-1);
    assert.ok(
      followed !== undefined,
      "No way back from Facebook was followed.",
    );
    await this.browserPage.goto(followed);
  },
);

// A code Facebook would take, for the reader the scenario has Facebook say,
// sent back here by a browser this site never sent to Facebook: what a page
// elsewhere would send a reader's browser along.
When(
  "the reader arrives back from Facebook without having been sent there",
  async function (this: SpecWorld) {
    const redirectUri = `${this.baseUrl!}${facebookCallback}`;
    const code = (await standInFacebookFor(this)).aCodeNobodyWasSentFor(
      redirectUri,
    );
    await this.browserPage.goto(
      `${redirectUri}?code=${encodeURIComponent(code)}&state=made-up-elsewhere`,
    );
  },
);

// Where the site sent the reader to ask Facebook, kept to be read: the address
// it told Facebook to send them back to is in it. Followed no further than the
// site's own answer, because the address it names is not one the scenarios'
// browser can reach. Followed as the register page sends a reader along it
// once they have ticked the box agreeing to the terms of use, since one who
// has not is sent back rather than to Facebook.
const sentTo = new WeakMap<SpecWorld, URL>();

When("the way to Facebook is followed", async function (this: SpecWorld) {
  const answer = await this.browserPage.request.get(
    `${this.baseUrl!}/auth/facebook?termsOfUse=on`,
    { headers: addressingOf(this), maxRedirects: 0, failOnStatusCode: false },
  );
  const location = answer.headers()["location"];
  assert.ok(location !== undefined, `The site answered ${answer.status()}.`);
  sentTo.set(this, new URL(location));
});

Then(
  "Facebook is told to send the reader back to {string}",
  function (this: SpecWorld, address: string) {
    const url = sentTo.get(this);
    assert.ok(url !== undefined, "The reader was not sent to Facebook.");
    assert.equal(url.searchParams.get("redirect_uri"), address);
  },
);
