import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  scenarioOf,
} from "../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../support/world.js";
import { colourOf, dangerOn, wordsFor } from "../../support/newMarks.js";
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

Then("no commentaries are listed", async function (this: SpecWorld) {
  assert.equal(await commentaries(this).count(), 0);
});

// The headings beneath the page's own, in the order they come.
Then(
  "the content's headings are {string}, {string} and {string}, in that order",
  async function (
    this: SpecWorld,
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

// A paragraph of the content that says exactly this.
const paragraphSaying = (world: SpecWorld, words: string): Locator =>
  world.browserPage.locator("main p", { hasText: exactly(words) });

Then("the page says {string}", async function (this: SpecWorld, words: string) {
  assert.equal(
    await paragraphSaying(this, words).count(),
    1,
    `Nothing in the content says ${words}.`,
  );
});

Then(
  "the page says {string} in bold",
  async function (this: SpecWorld, words: string) {
    assert.equal(
      await this.browserPage
        .locator("main strong", { hasText: exactly(words) })
        .count(),
      1,
      `Nothing in the content says ${words} in bold.`,
    );
  },
);

const linkCalled = (world: SpecWorld, words: string): Locator =>
  world.browserPage
    .locator("main")
    .getByRole("link", { name: words, exact: true });

Then(
  "{string} is drawn as a button",
  async function (this: SpecWorld, words: string) {
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
  async function (this: SpecWorld, words: string) {
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
  async function (this: SpecWorld, words: string, heading: string) {
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

// Read by opening its page, which is what reading it is, in this browser.
// Found by its title among the scenario's tournaments, which the scenario
// names it by.
Given(
  "the reader has read the commentary {string}",
  async function (this: SpecWorld, title: string) {
    for (const id of scenarioOf(this).byName.values()) {
      const tournament = await load(this, id);
      const commentary = tournament.commentaries.find(
        (each) => each.title.toString() === title,
      );
      if (commentary === undefined) continue;
      await this.browserPage.goto(
        `${this.baseUrl!}/${tournament.address.toString()}/commentaries/${commentary.slug.toString()}`,
      );
      return;
    }
    assert.fail(`No tournament has the commentary ${title}.`);
  },
);

Then(
  /^the commentary "(.*)" is (not )?marked as new$/,
  async function (this: SpecWorld, title: string, not: string | null) {
    const marks = await commentaryTitled(this, title)
      .locator(".new-mark")
      .count();
    assert.equal(marks, not === null ? 1 : 0);
  },
);

Then(
  "the commentary {string} is marked in red",
  async function (this: SpecWorld, title: string) {
    const mark = commentaryTitled(this, title).locator(".new-mark");
    assert.equal(await colourOf(mark), await dangerOn(this));
  },
);

Then(
  "the mark on the commentary {string} is said as the words for {string}",
  async function (this: SpecWorld, title: string, key: string) {
    const said = await commentaryTitled(this, title)
      .locator(".new-mark .visually-hidden")
      .textContent();
    assert.equal(said, wordsFor(key));
  },
);
