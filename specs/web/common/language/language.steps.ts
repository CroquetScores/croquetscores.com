import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { english } from "../../../../src/web/languages/english.js";
import type { SpecWorld } from "../../../support/world.js";
import { anApplicationCalled } from "../../support/browser.js";
import {
  exampleFailedPath,
  exampleRefusedPath,
} from "../../support/exampleFailures.js";
import { closes, opens, unmarked } from "../../support/languages.js";

// What the browser says its reader reads, on every request from here on. The
// browser's own is replaced rather than added to, so the scenario says all of
// it.
Given(
  "a browser that asks for {string}",
  async function (this: SpecWorld, asked: string) {
    this.acceptLanguage = asked;
    await this.browserPage.setExtraHTTPHeaders({ "accept-language": asked });
  },
);

Given("a browser that asks for no language", async function (this: SpecWorld) {
  this.acceptLanguage = "";
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

// Every piece of text a reader sees within `selector`, each of which must be
// marked at both ends: one that is not came from somewhere other than a
// catalogue. What the reader typed is in the fields rather than in the text,
// and is not looked at.
//
// Anything matching `names` is left out, because a name is not a word of
// anybody's language and so is in no catalogue to be marked: the site's own
// name, and each language in the list, which is named in its own language.
const unmarkedWithin = async (
  world: SpecWorld,
  selector: string,
  names: readonly string[] = [],
): Promise<string[]> => {
  const found = await world.browserPage.evaluate<string[] | null>(`(() => {
    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) return null;
    const named = [...root.querySelectorAll(${JSON.stringify(names.join(", ") || "nothing-at-all")})];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const texts = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (named.some((one) => one.contains(node))) continue;
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

When(
  "a page whose request breaks a rule is opened",
  async function (this: SpecWorld) {
    await this.browserPage.goto(`${this.baseUrl!}${exampleRefusedPath}`);
  },
);

When("a page that fails is opened", async function (this: SpecWorld) {
  await this.browserPage.goto(`${this.baseUrl!}${exampleFailedPath}`);
});

// Which of the pages the reader is on, by the words it is headed with. Read
// with the test locale's marks taken off, and compared against English, so
// that the step says the same thing whatever language the page is in: what it
// is here to tell apart is the pages, and whether the words came from a
// catalogue is the step above.
Then(
  "the page says the words for {string}",
  async function (this: SpecWorld, key: string) {
    const said = english.words[key];
    assert.ok(said !== undefined, `English has no words for ${key}.`);

    const shown = unmarked(await this.browserPage.locator("main").innerText());
    assert.ok(shown.includes(said), `The page says ${JSON.stringify(shown)}.`);
  },
);

// A site of this scenario's own, called something else, so that what it calls
// itself in its bars can be seen to come from what it is called rather than
// from anything written into the shell.
Given(
  "a site called {string}",
  async function (this: SpecWorld, siteName: string) {
    this.baseUrl = await anApplicationCalled(this, siteName);
  },
);

// The site's name is not a word of the reader's language, so it is left out of
// what is read for marks; the account menu inside the header has its own
// scenarios (accountMenu.feature).
Then(
  "every word in the header is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "header.site-bar", [".site-name"]);
    assert.deepEqual(stray, [], "Words in the header came from elsewhere.");
  },
);

// Each language in the list is named in its own language, which is the point of
// the list, so those names are left out with the site's.
Then(
  "every word in the footer is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "footer.site-footer", [
      "#language-choice option",
    ]);
    assert.deepEqual(stray, [], "Words in the footer came from elsewhere.");
  },
);

Then(
  "the way to skip to the content is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, ".skip-link");
    assert.deepEqual(stray, [], "The way to the content came from elsewhere.");
  },
);

// What a reader who cannot see the bar hears it announced as, which is an
// attribute rather than anything on the page.
const announcedAs = async (
  world: SpecWorld,
  selector: string,
): Promise<string | null> =>
  world.browserPage.evaluate<string | null>(
    `(() => {
      const found = document.querySelector(${JSON.stringify(selector)});
      return found ? found.getAttribute("aria-label") : null;
    })()`,
  );

const isMarked = (text: string): boolean =>
  text.startsWith(opens) && text.endsWith(closes);

Then(
  "the navigation is named in the test locale",
  async function (this: SpecWorld) {
    const named = await announcedAs(this, "nav.menu-links");
    assert.ok(named !== null, "The navigation is not named.");
    assert.ok(
      isMarked(named),
      `The navigation is named ${JSON.stringify(named)}.`,
    );
  },
);

Then(
  "the section bar is named in the test locale",
  async function (this: SpecWorld) {
    const named = await announcedAs(this, "nav.site-sections");
    assert.ok(named !== null, "The section bar is not named.");
    assert.ok(
      isMarked(named),
      `The section bar is named ${JSON.stringify(named)}.`,
    );
  },
);

// The name itself, which is no catalogue's and so is read as it stands.
Then(
  /^the header names the site "([^"]*)"$/,
  async function (this: SpecWorld, siteName: string) {
    assert.equal(
      (await this.browserPage.locator("header .site-name").innerText()).trim(),
      siteName,
    );
  },
);

Then(
  /^the plea names the site "([^"]*)"$/,
  async function (this: SpecWorld, siteName: string) {
    const plea = unmarked(
      await this.browserPage
        .locator("footer .site-footer-bar p")
        .first()
        .innerText(),
    );
    assert.ok(
      plea.includes(siteName),
      `The plea says ${JSON.stringify(plea)}.`,
    );
  },
);
