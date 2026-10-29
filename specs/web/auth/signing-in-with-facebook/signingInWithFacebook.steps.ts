// The sign in page's offer to sign in with Facebook. How an offer is measured
// and pressed is shared with the register page's (support/googleOffer.ts);
// what is here is which offer is meant.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  facebookCallback,
  lineIsBeneathTheOffer,
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
} from "../../support/googleOffer.js";
import type { SpecWorld } from "../../../support/world.js";

// Known by where it goes and which page it says sent the reader, whatever it
// carries after that about where they go back to.
const offer = 'a[href^="/auth/facebook?from=sign-in"]';
const googlesOffer = 'a[href^="/auth/google?from=sign-in"]';

Then(
  "the page offers signing in with Facebook",
  async function (this: SpecWorld) {
    assert.equal(await offerCount(this, offer), 1);
  },
);

Then(
  "the page does not offer signing in with Facebook",
  async function (this: SpecWorld) {
    // Any way to Facebook at all, so that an offer that lost its page would
    // still be found.
    assert.equal(await offerCount(this, 'a[href^="/auth/facebook"]'), 0);
  },
);

Then(
  "the offer to sign in with Facebook is a button",
  async function (this: SpecWorld) {
    await offerIsAButton(this, offer);
  },
);

Then(
  "the offer to sign in with Facebook looks like a button other than the submit button",
  async function (this: SpecWorld) {
    await offerLooksLikeAButton(this, offer);
  },
);

Then(
  "the offer to sign in with Facebook carries Facebook's icon",
  async function (this: SpecWorld) {
    await offerCarriesFacebooksIcon(this, offer);
  },
);

Then(
  "the offer to sign in with Facebook is in the dialog",
  async function (this: SpecWorld) {
    await offerIsInTheDialog(this, offer);
  },
);

Then(
  "the offer to sign in with Facebook is beneath the dialog's title bar",
  async function (this: SpecWorld) {
    await offerIsBeneathTheTitleBar(this, offer);
  },
);

Then(
  "the offer to sign in with Facebook is above the email address field",
  async function (this: SpecWorld) {
    await offerIsAboveTheEmailAddressField(this, offer);
  },
);

Then(
  "the offer to sign in with Facebook is as wide as the email address field",
  async function (this: SpecWorld) {
    await offerIsAsWideAsTheEmailAddressField(this, offer);
  },
);

Then(
  "the offer to sign in with Facebook is beneath the offer to sign in with Google",
  async function (this: SpecWorld) {
    await offerIsBeneathTheOffer(this, offer, googlesOffer);
  },
);

Then(
  "the offer to sign in with Facebook is as wide as the offer to sign in with Google",
  async function (this: SpecWorld) {
    await offerIsAsWideAsTheOffer(this, offer, googlesOffer);
  },
);

Then(
  "the message for {string} is above the offer to sign in with Facebook",
  async function (this: SpecWorld, code: string) {
    await messageIsAboveTheOffer(this, code, offer);
  },
);

Then(
  "the line saying {string} is beneath the offer to sign in with Facebook",
  async function (this: SpecWorld, said: string) {
    await lineIsBeneathTheOffer(this, said, offer);
  },
);

const signInWithFacebook = async function (this: SpecWorld): Promise<void> {
  await pressTheOffer(this, offer, facebookCallback);
};

When("the reader signs in with Facebook", signInWithFacebook);
Given("the reader has signed in with Facebook", signInWithFacebook);

// Straight to the way to Facebook, as a link on another site would send the
// reader, so that nothing the sign in page does stands between what the link
// asks to go back to and the way to Facebook that is asked to take it.
When(
  "the reader follows a link from elsewhere to sign in with Facebook, to go back to {string}",
  async function (this: SpecWorld, goBack: string) {
    await this.browserPage.goto(
      `${this.baseUrl!}/auth/facebook?from=sign-in&return=${encodeURIComponent(goBack)}`,
    );
    // As when the offer is pressed: what the page landed on asks for itself
    // renews the session cookie, and must be done before the scenario goes on.
    await this.browserPage.waitForLoadState("networkidle");
  },
);
