// What a commentary has kept, as a reader of its pages reads it: its comments
// on the commentary's page, and its writer, and the tournament's commentaries on
// their list. The commentary is found by pressing its title on that list.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "./world.js";

const escaped = (words: string): string =>
  words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// The link to a commentary on a list of them, which holds its title and its
// writer, so it is found by the title inside it.
export const commentaryLink = (world: WebWorld, title: string): Locator =>
  world.browserPage.locator("main .commentary-listed a").filter({
    has: world.browserPage.locator(".commentary-listed-title", {
      hasText: new RegExp(`^${escaped(title)}$`),
    }),
  });

const tournamentOf = (world: WebWorld, name: string) => {
  const found = world.tournaments.get(name);
  assert.ok(found !== undefined, `No tournament called ${name} was created.`);
  return found;
};

const opened = async (
  world: WebWorld,
  title: string,
  name: string,
): Promise<void> => {
  await world.browserPage.goto(
    `${world.baseUrl!}/${tournamentOf(world, name).address}/commentaries`,
  );
  const link = commentaryLink(world, title);
  assert.equal(await link.count(), 1, `No commentary is called ${title}.`);
  await Promise.all([world.browserPage.waitForNavigation(), link.click()]);
};

const texts = async (
  world: WebWorld,
  title: string,
  name: string,
): Promise<string[]> => {
  await opened(world, title, name);
  return (
    await world.browserPage
      .locator("main .comments .comment-text")
      .allInnerTexts()
  ).map((text) => text.trim());
};

// Counted as a reader counts a comment's characters, which is by the letters
// they see and not the bytes.
const charactersIn = (text: string): number => [...text].length;

Then(
  "the commentary {string} of {string} has the comment {string}",
  async function (this: WebWorld, title: string, name: string, text: string) {
    const kept = await texts(this, title, name);
    assert.ok(kept.includes(text), `It has ${JSON.stringify(kept)}.`);
  },
);

Then(
  "the commentary {string} of {string} has a comment of {int} characters",
  async function (this: WebWorld, title: string, name: string, length: number) {
    const kept = await texts(this, title, name);
    assert.ok(
      kept.some((text) => charactersIn(text) === length),
      `It has comments of ${JSON.stringify(kept.map(charactersIn))} characters.`,
    );
  },
);

// Kept once, and not twice, as a comment sent twice would be.
Then(
  "the commentary {string} of {string} has the comment {string} once",
  async function (this: WebWorld, title: string, name: string, text: string) {
    const kept = await texts(this, title, name);
    assert.equal(
      kept.filter((each) => each === text).length,
      1,
      `It has ${JSON.stringify(kept)}.`,
    );
  },
);

Then(
  "the commentary {string} of {string} does not have the comment {string}",
  async function (this: WebWorld, title: string, name: string, text: string) {
    const kept = await texts(this, title, name);
    assert.ok(!kept.includes(text), `It has ${JSON.stringify(kept)}.`);
  },
);

Then(
  "the commentary {string} of {string} has no comments",
  async function (this: WebWorld, title: string, name: string) {
    assert.deepEqual(await texts(this, title, name), []);
  },
);

Then(
  "the writer of the commentary {string} of {string} is the account for {string}",
  async function (
    this: WebWorld,
    title: string,
    name: string,
    address: string,
  ) {
    await opened(this, title, name);
    const writer = await this.browserPage
      .locator("main .commentary-writer")
      .innerText();
    assert.ok(
      writer.includes(this.accountNames.get(address) ?? "Sam Someone"),
      `The writer is ${writer}.`,
    );
  },
);

const titlesOf = async (world: WebWorld, name: string): Promise<string[]> => {
  await world.browserPage.goto(
    `${world.baseUrl!}/${tournamentOf(world, name).address}/commentaries`,
  );
  return (
    await world.browserPage
      .locator("main .commentary-listed-title")
      .allInnerTexts()
  ).map((title) => title.trim());
};

Then(
  "the tournament {string} has the commentary {string}",
  async function (this: WebWorld, name: string, title: string) {
    const titles = await titlesOf(this, name);
    assert.ok(titles.includes(title), `It has ${JSON.stringify(titles)}.`);
  },
);

Then(
  "the tournament {string} has no commentaries",
  async function (this: WebWorld, name: string) {
    assert.deepEqual(await titlesOf(this, name), []);
  },
);
