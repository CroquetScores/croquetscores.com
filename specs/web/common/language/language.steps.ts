import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../support/world.js";
import { closes, opens } from "../../support/languages.js";

// What the browser says its reader reads, on every request from here on. The
// browser's own is replaced rather than added to, so the scenario says all of
// it.
Given(
  "a browser that asks for {string}",
  async function (this: SpecWorld, asked: string) {
    await this.browserPage.setExtraHTTPHeaders({ "accept-language": asked });
  },
);

Given("a browser that asks for no language", async function (this: SpecWorld) {
  await this.browserPage.setExtraHTTPHeaders({ "accept-language": "" });
});

// What the page says it is in, which is what a screen reader and a browser
// offering to translate go by.
Then("the page is in {string}", async function (this: SpecWorld, tag: string) {
  assert.equal(
    await this.browserPage.evaluate<string>("document.documentElement.lang"),
    tag,
  );
});

const list = "form.language select";

// Picked from the list, and made with the button beside it, as a reader does.
When(
  "the language {string} is chosen",
  async function (this: SpecWorld, tag: string) {
    const page = this.browserPage;
    await page.selectOption(list, tag);
    await page.click("form.language button[type=submit]");
    await page.waitForLoadState();
  },
);

Then(
  "the language {string} is offered as {string}",
  async function (this: SpecWorld, tag: string, name: string) {
    const offered = this.browserPage.locator(
      `${list} option[value=${JSON.stringify(tag)}]`,
    );
    assert.equal(await offered.count(), 1, `${tag} is not offered.`);
    assert.equal((await offered.textContent())?.trim(), name);
    assert.equal(
      await offered.getAttribute("lang"),
      tag,
      `${tag} is not said to be in ${tag}.`,
    );
  },
);

// What the list shows before anyone touches it.
Then(
  "the language {string} is the one in force",
  async function (this: SpecWorld, tag: string) {
    assert.equal(await this.browserPage.inputValue(list), tag);
  },
);

Then("the register page is shown", function (this: SpecWorld) {
  assert.equal(new URL(this.browserPage.url()).pathname, "/accounts/register");
});

// Every piece of text a reader sees within `selector`, each of which must be
// marked at both ends: one that is not came from somewhere other than a
// catalogue. What the reader typed is in the fields rather than in the text,
// and is not looked at.
const unmarkedWithin = async (
  world: SpecWorld,
  selector: string,
): Promise<string[]> => {
  const found = await world.browserPage.evaluate<string[] | null>(`(() => {
    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) return null;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent.trim();
      if (text !== "") texts.push(text);
    }
    return texts;
  })()`);
  assert.ok(
    found !== null,
    `There is nothing on the page matching ${selector}.`,
  );
  assert.ok(found.length > 0, `There are no words in ${selector}.`);
  return found.filter(
    (text) => !(text.startsWith(opens) && text.endsWith(closes)),
  );
};

Then(
  "every word in the dialog is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "section.dialog");
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

Then(
  "every word in the page's content is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "main");
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);
