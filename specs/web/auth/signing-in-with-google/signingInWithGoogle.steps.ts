// The sign in page's offer to sign in with Google. How an offer is measured and
// pressed is shared with the register page's (support/googleOffer.ts); what is
// here is which offer is meant.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  lineIsBeneathTheOffer,
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
} from "../../support/googleOffer.js";
import type { SpecWorld } from "../../../support/world.js";

// Known by where it goes and which page it says sent the reader, whatever it
// carries after that about where they go back to.
const offer = 'a[href^="/auth/google?from=sign-in"]';

Then(
  "the page offers signing in with Google",
  async function (this: SpecWorld) {
    assert.equal(await offerCount(this, offer), 1);
  },
);

Then(
  "the page does not offer signing in with Google",
  async function (this: SpecWorld) {
    // Any way to Google at all, so that an offer that lost its page would
    // still be found.
    assert.equal(await offerCount(this, 'a[href^="/auth/google"]'), 0);
  },
);

Then(
  "the offer to sign in with Google is a button",
  async function (this: SpecWorld) {
    await offerIsAButton(this, offer);
  },
);

Then(
  "the offer to sign in with Google looks like a button other than the submit button",
  async function (this: SpecWorld) {
    await offerLooksLikeAButton(this, offer);
  },
);

Then(
  "the offer to sign in with Google carries Google's icon",
  async function (this: SpecWorld) {
    await offerCarriesGooglesIcon(this, offer);
  },
);

Then(
  "the offer to sign in with Google is in the dialog",
  async function (this: SpecWorld) {
    await offerIsInTheDialog(this, offer);
  },
);

Then(
  "the offer to sign in with Google is beneath the dialog's title bar",
  async function (this: SpecWorld) {
    await offerIsBeneathTheTitleBar(this, offer);
  },
);

Then(
  "the offer to sign in with Google is above the email address field",
  async function (this: SpecWorld) {
    await offerIsAboveTheEmailAddressField(this, offer);
  },
);

Then(
  "the offer to sign in with Google is as wide as the email address field",
  async function (this: SpecWorld) {
    await offerIsAsWideAsTheEmailAddressField(this, offer);
  },
);

Then(
  "the message for {string} is above the offer to sign in with Google",
  async function (this: SpecWorld, code: string) {
    await messageIsAboveTheOffer(this, code, offer);
  },
);

Then(
  "the line saying {string} is beneath the offer to sign in with Google",
  async function (this: SpecWorld, said: string) {
    await lineIsBeneathTheOffer(this, said, offer);
  },
);

const signInWithGoogle = async function (this: SpecWorld): Promise<void> {
  await pressTheOffer(this, offer);
};

When("the reader signs in with Google", signInWithGoogle);
Given("the reader has signed in with Google", signInWithGoogle);
