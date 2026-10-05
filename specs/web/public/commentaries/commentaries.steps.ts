import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";
import { unmarked } from "../../support/languages.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

// The words exactly, rather than anything whose words hold them.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const commentaries = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .commentaries > .commentary-listed");

const commentaryTitled = (world: SpecWorld, title: string): Locator =>
  commentaries(world).filter({
    has: world.browserPage.locator(".commentary-listed-title", {
      hasText: exactly(title),
    }),
  });

const textOf = async (found: Locator): Promise<string> =>
  unmarked((await found.textContent()) ?? "").trim();

Then(
  "the commentaries page says there are no commentaries",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator("main .commentaries-none").count(),
      1,
    );
  },
);

Then(
  "the commentaries page does not say there are no commentaries",
  async function (this: SpecWorld) {
    assert.equal(
      await this.browserPage.locator("main .commentaries-none").count(),
      0,
    );
  },
);

Then(
  "{string} is among the commentaries",
  async function (this: SpecWorld, title: string) {
    assert.equal(await commentaryTitled(this, title).count(), 1);
  },
);

Then(
  /^the (first|second|third) commentary is "(.*)"$/,
  async function (this: SpecWorld, which: string, title: string) {
    assert.equal(
      await textOf(
        commentaries(this)
          .nth(["first", "second", "third"].indexOf(which))
          .locator(".commentary-listed-title"),
      ),
      title,
    );
  },
);

Then(
  "the commentary {string} is listed as written by {string}",
  async function (this: SpecWorld, title: string, writer: string) {
    assert.equal(
      await textOf(
        commentaryTitled(this, title).locator(".commentary-listed-writer"),
      ),
      writer,
    );
  },
);

Then(
  "the commentary {string} leads to {string}",
  async function (this: SpecWorld, title: string, path: string) {
    assert.equal(
      await commentaryTitled(this, title)
        .locator(".commentary-listed-title")
        .getAttribute("href"),
      path,
    );
  },
);

// A link in the page's content by its words, wherever it is.
Then(
  "{string} leads to {string}",
  async function (this: SpecWorld, words: string, path: string) {
    const link = this.browserPage
      .locator("main")
      .getByRole("link", { name: words, exact: true });
    assert.equal(await link.count(), 1, `There is no link ${words}.`);
    assert.equal(await link.getAttribute("href"), path);
  },
);
