import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { englishForScenarios, unmarked } from "../../support/languages.js";

const welcome = "/account/welcome";

When("the welcome page is opened", async function (this: SpecWorld) {
  await this.browserPage.goto(`${this.baseUrl!}${welcome}`);
});

// Shown to a reader with no scripting — the scenarios' browser has none — and
// nobody signed in, since nobody can be yet. Judged by what the page says and
// not by the status of a response this step did not ask for, since the reader
// may have arrived by registering rather than by opening it: a page that could
// not be found, or was refused, is at the same address with another heading.
Then("the welcome page is shown", async function (this: SpecWorld) {
  const title = englishForScenarios.words["welcome.title"];
  assert.ok(title !== undefined);
  assert.equal(new URL(this.browserPage.url()).pathname, welcome);
  const heading =
    (await this.browserPage.locator("main h1").textContent()) ?? "";
  assert.equal(unmarked(heading), title, "The welcome page was not shown.");
});

// Said by more than one page: where registering ends, and where a new link
// has just been asked for. Each says it in its own words, and what the
// scenario is asking is that the reader was told to go and look.
Then(
  "the reader is told to check their email",
  async function (this: SpecWorld) {
    const said = [
      englishForScenarios.words["welcome.checkEmail"],
      englishForScenarios.words["newConfirmationLink.sent.explanation"],
    ];
    const content =
      (await this.browserPage.locator("main").textContent()) ?? "";
    assert.ok(
      said.some((each) => each !== undefined && content.includes(each)),
      "The page does not say to check email.",
    );
  },
);
