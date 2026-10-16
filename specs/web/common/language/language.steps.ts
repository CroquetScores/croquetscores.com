import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { english } from "../../../../src/web/languages/english.js";
import { javaScriptRequiredPath } from "../../../../src/web/public/javaScriptRequired.js";
import { registrationsSuspendedPath } from "../../../../src/web/public/registrationsSuspended.js";
import { welcomePath } from "../../../../src/web/public/welcome.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  exampleFailedPath,
  exampleRefusedPath,
} from "../../support/exampleFailures.js";
import { unmarked } from "../../support/languages.js";
import { announcedAs, isMarked, unmarkedWithin } from "../../support/marks.js";

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

Then(
  "every word in the dialog is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "section.dialog");
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// The account's name and address are the account's own, not words of the
// reader's language, so they are left out of what is read for marks.
Then(
  "every word on the profile page but the account's own is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "main", [".profile-own"]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);

// The account's address is filled into the words that say where a link will
// go, so it is read inside their marks with them, as any word filled in is;
// the step says it is left out, since that is what the scenario is about.
Then(
  "every word in the dialog but the account's own is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "section.dialog");
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// The name is in the field, where it is a value rather than words on the page,
// so reading the dialog's words for marks leaves it out already; the step says
// so, since what the scenario is about is that it is left out.
Then(
  "every word in the dialog but the account's name is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "section.dialog", ["input"]);
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

// Three of the four pages whose link back to the home page is looked at here:
// the page that is not there is the fourth, and is asked for by a step of its
// own. Each of these three is reached by asking for it and nothing else, so the
// name in that link can be looked at without a database. The four left come at
// the end of something written down and wait on one (TODO.md).
//
// Asked for by the address the page itself is served at, rather than by one
// written out again here. A page that is not there carries the same link back,
// so a step that spelled an address out would go on passing against the page
// that is not there the day the page it means is served somewhere else.

When(
  "the page shown after registering is opened",
  async function (this: SpecWorld) {
    await this.browserPage.goto(`${this.baseUrl!}${welcomePath}`);
  },
);

When(
  "the page asking for scripting is opened",
  async function (this: SpecWorld) {
    await this.browserPage.goto(`${this.baseUrl!}${javaScriptRequiredPath}`);
  },
);

When(
  "the page saying registering is suspended is opened",
  async function (this: SpecWorld) {
    await this.browserPage.goto(
      `${this.baseUrl!}${registrationsSuspendedPath}`,
    );
  },
);

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

// The site's name is not a word of the reader's language, so it is left out of
// what is read for marks; the account menu inside the header has its own
// scenarios (accountMenu.feature).
Then(
  "every word in the header is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "header.site-bar", [
      ".site-name",
      ".site-tournament",
    ]);
    assert.deepEqual(stray, [], "Words in the header came from elsewhere.");
  },
);

Then(
  "every word in the navigation is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "header .menu-links", []);
    assert.deepEqual(stray, [], "Words in the navigation came from elsewhere.");
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

// Here with the other bars' rather than beside layout.feature, whose rule it
// belongs to, because reading every word of a part of the page for marks is
// this file's, and one reader of them is one answer.
Then(
  "every word in the try website's banner is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, ".try-banner");
    assert.deepEqual(stray, [], "Words in the banner came from elsewhere.");
  },
);

Then(
  "the offer to register with Google is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, ".dialog-alternative");
    assert.deepEqual(stray, [], "Words in the offer came from elsewhere.");
  },
);

Then(
  "the offer to sign in with Google is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, ".dialog-alternative");
    assert.deepEqual(stray, [], "Words in the offer came from elsewhere.");
  },
);

Then(
  "every word in the theme choice is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "footer form.theme");
    assert.deepEqual(
      stray,
      [],
      "Words in the theme choice came from elsewhere.",
    );
  },
);

Then(
  "the way to skip to the content is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, ".skip-link");
    assert.deepEqual(stray, [], "The way to the content came from elsewhere.");
  },
);

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
    // Waited for, since the admin draws its bars once it knows what is in
    // them, and a public page's is there from the start.
    await this.browserPage.locator("nav.site-sections").first().waitFor();
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

// The link most pages carry back to the home page, which names the site as the
// plea does, and takes the name the same way.
Then(
  /^the way back to the home page names the site "([^"]*)"$/,
  async function (this: SpecWorld, siteName: string) {
    const back = unmarked(
      await this.browserPage.locator('main a[href="/"]').first().innerText(),
    );
    assert.ok(
      back.includes(siteName),
      `The way back says ${JSON.stringify(back)}.`,
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
