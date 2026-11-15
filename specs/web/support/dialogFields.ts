// What a dialog's fields hold and say, and pressing it to send, as a reader does:
// a field is found by the label a reader sees, spelled as the dialog spells it,
// as assistive technology finds one, and what is said beneath it is what it is
// announced with.
import { When, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { closes, opens } from "./languages.js";
import type { WebWorld } from "./world.js";

When("the dialog is submitted", async function (this: WebWorld) {
  await this.browserPage.click('.dialog-buttons button[type="submit"]');
  await this.browserPage.waitForLoadState();
});

When("Escape is pressed", async function (this: WebWorld) {
  await this.browserPage.keyboard.press("Escape");
});

// The input whose label reads as `field` does, with the test locale's marks taken
// off and the case ignored, as a reader would find it.
const inputByLabel = (field: string): string => `(() => {
  const unmark = (text) => text.split(${JSON.stringify(opens)}).join("").split(${JSON.stringify(closes)}).join("");
  const wanted = ${JSON.stringify(field.toLowerCase())};
  return [...document.querySelectorAll("section.dialog input:not([type=hidden])")].find(
    (candidate) => unmark(candidate.labels?.[0]?.textContent ?? "").trim().toLowerCase() === wanted,
  );
})()`;

Then(
  /^the (.+) field holds "([^"]*)"$/,
  async function (this: WebWorld, field: string, text: string) {
    const value = await this.browserPage.evaluate<string | null>(`(() => {
      const input = ${inputByLabel(field)};
      return input ? input.value : null;
    })()`);
    assert.ok(value !== null, `The dialog has no ${field} field.`);
    assert.equal(value, text);
  },
);

// The words announced with the field and shown beneath it, a line for each.
const messagesBeneath = (
  world: WebWorld,
  field: string,
): Promise<string[] | null> =>
  world.browserPage.evaluate<string[] | null>(`(() => {
    const input = ${inputByLabel(field)};
    const id = input?.getAttribute("aria-describedby");
    const message = id ? document.getElementById(id) : null;
    if (!message) return null;
    const spans = [...message.querySelectorAll("span")];
    return (spans.length > 0 ? spans : [message]).map((line) => line.textContent.trim());
  })()`);

Then(
  /^the (.+) field says "([^"]*)"$/,
  async function (this: WebWorld, field: string, words: string) {
    const lines = await messagesBeneath(this, field);
    assert.ok(lines !== null, `The ${field} field says nothing.`);
    assert.ok(
      lines.includes(words),
      `The ${field} field says ${JSON.stringify(lines)}.`,
    );
  },
);
