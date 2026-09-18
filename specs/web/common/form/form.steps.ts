import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { exampleFormPath } from "../../support/exampleForm.js";
import { closes, englishForScenarios, opens } from "../../support/languages.js";

// The status of the last page the browser arrived at, which a browser shows
// and a reader does not see, so it is watched for rather than read off the page.
const arrivedWith = new WeakMap<SpecWorld, { status: number | undefined }>();

const openExampleForm = async function (this: SpecWorld): Promise<void> {
  const page = this.browserPage;
  const arrived: { status: number | undefined } = { status: undefined };
  arrivedWith.set(this, arrived);
  page.on("response", (response) => {
    if (
      response.request().isNavigationRequest() &&
      response.frame() === page.mainFrame()
    ) {
      arrived.status = response.status();
    }
  });
  await page.goto(`${this.baseUrl!}${exampleFormPath}`);
};

Given("the example form is open", openExampleForm);
When("the example form is opened", openExampleForm);

// The words English has for a rule, found by the rule's code. These scenarios
// run in English; the ones about every word being in the reader's language are
// with the language feature.
const wordsFor = (code: string): string => {
  const said = englishForScenarios.words[code];
  assert.ok(said !== undefined, `English has no words for ${code}.`);
  return said;
};

// Shown again, on the page it was sent from, and refused: answered as the
// caller's mistake rather than as the page it asked for.
Then("the form is shown again as refused", async function (this: SpecWorld) {
  const page = this.browserPage;
  assert.equal(new URL(page.url()).pathname, exampleFormPath);
  assert.equal(
    await page.locator("section.dialog").count(),
    1,
    "There is no dialog on the page.",
  );
  assert.equal(
    arrivedWith.get(this)?.status,
    422,
    "The form was not answered as refused.",
  );
});

// Beneath the field, found by what the field announces, so that a message
// drawn beneath it and not tied to it does not count. A field that broke more
// than one rule says each, on a line of its own.
Then(
  /^the (.+) field says the message for "([^"]*)"$/,
  async function (this: SpecWorld, field: string, code: string) {
    const lines = await this.browserPage.evaluate<string[] | null>(`(() => {
      const unmark = (text) => text.split(${JSON.stringify(opens)}).join("").split(${JSON.stringify(closes)}).join("");
      const wanted = ${JSON.stringify(field.toLowerCase())};
      const input = [...document.querySelectorAll("section.dialog input")].find(
        (candidate) => unmark(candidate.labels?.[0]?.textContent ?? "").trim().toLowerCase() === wanted,
      );
      const id = input?.getAttribute("aria-describedby");
      const message = id ? document.getElementById(id) : null;
      if (!message) return null;
      const spans = [...message.querySelectorAll("span")];
      return (spans.length > 0 ? spans : [message]).map((line) => line.textContent.trim());
    })()`);
    assert.ok(lines !== null, `The ${field} field says nothing.`);
    assert.ok(
      lines.includes(wordsFor(code)),
      `The ${field} field says ${JSON.stringify(lines)}.`,
    );
  },
);

// Above the fields: said in what is above them, and ending before the first
// of them begins.
Then(
  /^the message for "([^"]*)" is above the fields$/,
  async function (this: SpecWorld, code: string) {
    const above = await this.browserPage.evaluate<{
      said: string[];
      bottom: number;
      firstField: number;
    } | null>(`(() => {
      const problems = document.querySelector("section.dialog #dialog-problems");
      const first = document.querySelector("section.dialog .field");
      if (!problems || !first) return null;
      return {
        said: [...problems.querySelectorAll("p")].map((p) => p.textContent.trim()),
        bottom: problems.getBoundingClientRect().bottom,
        firstField: first.getBoundingClientRect().top,
      };
    })()`);
    assert.ok(above !== null, "Nothing is said above the fields.");
    assert.ok(
      above.said.includes(wordsFor(code)),
      `Above the fields says ${JSON.stringify(above.said)}.`,
    );
    assert.ok(
      above.bottom <= above.firstField + 0.5,
      "What is said is not above the fields.",
    );
  },
);

Then(
  "the reader is taken to the message above the fields",
  async function (this: SpecWorld) {
    const focused = await this.browserPage.evaluate<string | null>(
      "document.activeElement && document.activeElement.id",
    );
    assert.equal(
      focused,
      "dialog-problems",
      `The reader was taken to ${focused || "nothing"}.`,
    );
  },
);
