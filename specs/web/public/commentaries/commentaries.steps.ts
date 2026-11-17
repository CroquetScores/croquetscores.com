import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../support/world.js";
import { commentaryLink } from "../../support/commentaryPages.js";
import { colourOf, dangerOn } from "../../support/newMarks.js";
import { unmarked } from "../../support/languages.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

// The words exactly, rather than anything whose words hold them.
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const commentaries = (world: WebWorld): Locator =>
  world.browserPage.locator("main .commentaries > .commentary-listed");

const commentaryTitled = (world: WebWorld, title: string): Locator =>
  commentaries(world).filter({
    has: world.browserPage.locator(".commentary-listed-title", {
      hasText: exactly(title),
    }),
  });

const textOf = async (found: Locator): Promise<string> =>
  unmarked((await found.textContent()) ?? "").trim();

Then(
  "{string} is among the commentaries",
  async function (this: WebWorld, title: string) {
    assert.equal(await commentaryTitled(this, title).count(), 1);
  },
);

Then(
  /^the (first|second|third) commentary is "(.*)"$/,
  async function (this: WebWorld, which: string, title: string) {
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
  async function (this: WebWorld, title: string, writer: string) {
    assert.equal(
      await textOf(
        commentaryTitled(this, title).locator(".commentary-listed-writer"),
      ),
      writer,
    );
  },
);

Then("no commentaries are listed", async function (this: WebWorld) {
  assert.equal(await commentaries(this).count(), 0);
});

// The headings beneath the page's own, in the order they come.
Then(
  "the content's headings are {string}, {string} and {string}, in that order",
  async function (
    this: WebWorld,
    first: string,
    second: string,
    third: string,
  ) {
    const headings = (
      await this.browserPage.locator("main h2").allTextContents()
    ).map((each) => unmarked(each).trim());
    assert.deepEqual(headings, [first, second, third]);
  },
);

Then(
  "the page says {string} in bold",
  async function (this: WebWorld, words: string) {
    assert.equal(
      await this.browserPage
        .locator("main strong", { hasText: exactly(words) })
        .count(),
      1,
      `Nothing in the content says ${words} in bold.`,
    );
  },
);

const linkCalled = (world: WebWorld, words: string): Locator =>
  world.browserPage
    .locator("main")
    .getByRole("link", { name: words, exact: true });

Then(
  "{string} is drawn as a button",
  async function (this: WebWorld, words: string) {
    const classes = (
      (await linkCalled(this, words).getAttribute("class")) ?? ""
    ).split(/\s+/);
    assert.ok(
      classes.includes("button"),
      `It is drawn as ${classes.join(" ")}.`,
    );
  },
);

// Lower on the page, which is later in it: the page is one column.
const below = async (upper: Locator, lower: Locator): Promise<boolean> => {
  const top = await upper.boundingBox();
  const bottom = await lower.boundingBox();
  assert.ok(top !== null && bottom !== null, "One of them is not drawn.");
  return bottom.y >= top.y + top.height;
};

Then(
  "{string} comes after the list of commentaries",
  async function (this: WebWorld, words: string) {
    assert.ok(
      await below(
        this.browserPage.locator("main .commentaries"),
        linkCalled(this, words),
      ),
      `${words} is not beneath the list.`,
    );
  },
);

Then(
  "{string} comes before the heading {string}",
  async function (this: WebWorld, words: string, heading: string) {
    assert.ok(
      await below(
        linkCalled(this, words),
        this.browserPage
          .locator("main")
          .getByRole("heading", { name: heading, exact: true }),
      ),
      `${words} is not above ${heading}.`,
    );
  },
);

// What is new to the reader ------------------------------------------------------

// Read by opening its page, which is what reading it is, in this browser. Found by
// its title on the commentaries page of the tournament that has it.
Given(
  "the reader has read the commentary {string}",
  async function (this: WebWorld, title: string) {
    for (const { address } of this.tournaments.values()) {
      await this.browserPage.goto(`${this.baseUrl!}/${address}/commentaries`);
      const link = commentaryLink(this, title);
      if ((await link.count()) === 0) continue;
      await Promise.all([this.browserPage.waitForNavigation(), link.click()]);
      return;
    }
    assert.fail(`No tournament has the commentary ${title}.`);
  },
);

Then(
  /^the commentary "(.*)" is (not )?marked as new$/,
  async function (this: WebWorld, title: string, not: string | null) {
    const marks = await commentaryTitled(this, title)
      .locator(".new-mark")
      .count();
    assert.equal(marks, not === null ? 1 : 0);
  },
);

Then(
  "the commentary {string} is marked in red",
  async function (this: WebWorld, title: string) {
    const mark = commentaryTitled(this, title).locator(".new-mark");
    assert.equal(await colourOf(mark), await dangerOn(this));
  },
);

Then(
  "the mark on the commentary {string} is said as {string}",
  async function (this: WebWorld, title: string, words: string) {
    const said = await commentaryTitled(this, title)
      .locator(".new-mark .visually-hidden")
      .textContent();
    assert.equal(said, words);
  },
);
