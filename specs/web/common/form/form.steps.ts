import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import {
  exampleFormPath,
  exampleFormWithNoticePath,
} from "../../support/exampleForm.js";
import { autofocusSettled } from "../../support/autofocus.js";
import { closes, englishForScenarios, opens } from "../../support/languages.js";

// The status of the last page the browser arrived at, which a browser shows
// and a reader does not see, so it is watched for rather than read off the page.
const arrivedWith = new WeakMap<SpecWorld, { status: number | undefined }>();

const openExampleForm = async (world: SpecWorld, at: string): Promise<void> => {
  const page = world.browserPage;
  const arrived: { status: number | undefined } = { status: undefined };
  arrivedWith.set(world, arrived);
  page.on("response", (response) => {
    if (
      response.request().isNavigationRequest() &&
      response.frame() === page.mainFrame()
    ) {
      arrived.status = response.status();
    }
  });
  await page.goto(`${world.baseUrl!}${at}`);
};

Given("the example form is open", async function (this: SpecWorld) {
  await openExampleForm(this, exampleFormPath);
});

When("the example form is opened", async function (this: SpecWorld) {
  await openExampleForm(this, exampleFormPath);
});

Given(
  "the example form is open with a notice",
  async function (this: SpecWorld) {
    await openExampleForm(this, exampleFormWithNoticePath);
  },
);

// A second input under the field's name, as a page that had been tampered
// with, or a form written with one name twice, would send. Hidden, so that the
// field the reader sees and types into is still the one its label names.
Given(
  /^the form sends the (.+) field twice$/,
  async function (this: SpecWorld, field: string) {
    const added = await this.browserPage.evaluate<boolean>(`(() => {
      const unmark = (text) => text.split(${JSON.stringify(opens)}).join("").split(${JSON.stringify(closes)}).join("");
      const wanted = ${JSON.stringify(field.toLowerCase())};
      const input = [...document.querySelectorAll("section.dialog input")].find(
        (candidate) => unmark(candidate.labels?.[0]?.textContent ?? "").trim().toLowerCase() === wanted,
      );
      if (!input || !input.form) return false;
      const again = document.createElement("input");
      again.type = "hidden";
      again.name = input.name;
      again.value = "again";
      input.form.append(again);
      return true;
    })()`);
    assert.ok(added, `The dialog has no ${field} field.`);
  },
);

// Sent as something other than a browser would send from the form: a JSON body
// with a number, a list, nothing and a yes-or-no under the fields' names. The
// page that comes back is put in front of the browser, so that the steps that
// read a form can read this one.
When(
  "a body that is not a form's is sent to the example form",
  async function (this: SpecWorld) {
    const response = await this.browserPage.request.post(
      `${this.baseUrl!}${exampleFormPath}`,
      { data: { start: 1, end: [2, 3], step: null, passphrase: true } },
    );
    arrivedWith.set(this, { status: response.status() });
    await this.browserPage.setContent(await response.text());
  },
);

Then(
  "the sender is answered with the form, refused",
  async function (this: SpecWorld) {
    assert.equal(
      arrivedWith.get(this)?.status,
      422,
      "The form was not answered as refused.",
    );
    assert.equal(
      await this.browserPage.locator("section.dialog").count(),
      1,
      "The sender was not answered with the form.",
    );
  },
);

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
const messagesBeneath = (
  world: SpecWorld,
  field: string,
): Promise<string[] | null> =>
  world.browserPage.evaluate<string[] | null>(`(() => {
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

Then(
  /^the (.+) field says the message for "([^"]*)"$/,
  async function (this: SpecWorld, field: string, code: string) {
    const lines = await messagesBeneath(this, field);
    assert.ok(lines !== null, `The ${field} field says nothing.`);
    assert.ok(
      lines.includes(wordsFor(code)),
      `The ${field} field says ${JSON.stringify(lines)}.`,
    );
  },
);

// How many it says, rather than which: two rules with no words are the same
// sentence, and a field saying it twice is what this is here to catch.
Then(
  /^the (.+) field says one message$/,
  async function (this: SpecWorld, field: string) {
    const lines = await messagesBeneath(this, field);
    assert.ok(lines !== null, `The ${field} field says nothing.`);
    assert.equal(
      lines.length,
      1,
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
    await autofocusSettled(this);
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
