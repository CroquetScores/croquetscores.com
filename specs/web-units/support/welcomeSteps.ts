import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../support/world.js";
import { englishForScenarios } from "./languages.js";

// Said by more than one page: where registering ends, and wherever a link
// has just been asked for. Each says it in its own words, and what the
// scenario is asking is that the reader was told to go and look.
Then(
  "the reader is told to check their email",
  async function (this: SpecWorld) {
    const said = [
      englishForScenarios.words["welcome.checkEmail"],
      englishForScenarios.words["newConfirmationLink.sent.explanation"],
      englishForScenarios.words["forgotPassword.sent.explanation"],
      englishForScenarios.words["forgetAccount.sent.explanation"],
      englishForScenarios.words["changeEmailAddress.sent.explanation"],
      englishForScenarios.words["setPassword.sent.explanation"],
    ];
    const content =
      (await this.browserPage.locator("main").textContent()) ?? "";
    assert.ok(
      said.some((each) => each !== undefined && content.includes(each)),
      "The page does not say to check email.",
    );
  },
);
