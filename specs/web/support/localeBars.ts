// Every word of the bars a page is drawn with, read for the marks the test
// locale puts on them: the header, the footer, the section bar and the rest are
// the site's own, so one reader of them is one answer for every page.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { unmarked } from "./languages.js";
import { announcedAs, isMarked, unmarkedWithin } from "./marks.js";
import type { WebWorld } from "./world.js";

// The site's name is not a word of the reader's language, so it is left out of
// what is read for marks, and neither is the source of the script that opens
// the search, which is text in the page and no word a reader sees; the account
// menu inside the header has its own scenarios (accountMenu.feature).
Then(
  "every word in the header is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "header.site-bar", [
      ".site-name",
      ".site-tournament",
      "script",
    ]);
    assert.deepEqual(stray, [], "Words in the header came from elsewhere.");
  },
);

// Each language in the list is named in its own language, which is the point of
// the list, so those names are left out with the site's. So is the version,
// which is a number and in no language.
Then(
  "every word in the footer is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "footer.site-footer", [
      "#language-choice option",
      ".site-version",
    ]);
    assert.deepEqual(stray, [], "Words in the footer came from elsewhere.");
  },
);

Then(
  "every word in the try website's banner is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, ".try-banner");
    assert.deepEqual(stray, [], "Words in the banner came from elsewhere.");
  },
);

Then(
  "every word in the theme choice is in the test locale",
  async function (this: WebWorld) {
    const stray = await unmarkedWithin(this, "footer form.theme");
    assert.deepEqual(
      stray,
      [],
      "Words in the theme choice came from elsewhere.",
    );
  },
);

Then(
  "the section bar is named in the test locale",
  async function (this: WebWorld) {
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

// The link most pages carry back to the home page, which names the site as the
// plea does, and takes the name the same way.
Then(
  /^the plea names the site "([^"]*)"$/,
  async function (this: WebWorld, siteName: string) {
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
