import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { Flags } from "../../../../src/domain/aggregates/tournaments/value-objects/Flags.js";
import type { SpecWorld } from "../../../support/world.js";
import { isStruckThrough } from "../../support/struckThrough.js";
import { unmarkedWithin } from "../../support/marks.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.

const places = ["first", "second", "third"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

const gameAt = (world: SpecWorld, which: string): Locator =>
  world.browserPage.locator("main .games > .game").nth(placeOf(which));

// The winner's line is the first of a game, and the loser's the second.
const lineOf = (world: SpecWorld, line: string, which: string): Locator =>
  gameAt(world, which).locator(
    line === "first" ? ".game-winner" : ".game-loser",
  );

const textOf = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").trim();

Given(
  "the page at {string} is open",
  async function (this: SpecWorld, path: string) {
    await this.browserPage.goto(`${this.baseUrl!}${path}`);
  },
);

When(
  /^the competition of the (first|second|third) game is pressed$/,
  async function (this: SpecWorld, which: string) {
    await gameAt(this, which).locator(".game-competition a").click();
    await this.browserPage.waitForLoadState();
  },
);

// What the page says -----------------------------------------------------------

Then("the page says there are no games", async function (this: SpecWorld) {
  assert.equal(await this.browserPage.locator("main .games-none").count(), 1);
});

Then(
  "the page's content has no main heading",
  async function (this: SpecWorld) {
    await this.browserPage.locator("main").waitFor();
    assert.equal(await this.browserPage.locator("main h1").count(), 0);
  },
);

Then(
  "the page does not say there are no games",
  async function (this: SpecWorld) {
    assert.equal(await this.browserPage.locator("main .games-none").count(), 0);
  },
);

Then(
  /^the (first|second|third) game is of "(.*)" beating "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    winner: string,
    loser: string,
  ) {
    assert.deepEqual(
      [
        await textOf(lineOf(this, "first", which).locator(".game-name")),
        await textOf(lineOf(this, "second", which).locator(".game-name")),
      ],
      [winner, loser],
    );
  },
);

Then(
  /^the (first|second|third) game is (not )?marked as withdrawn$/,
  async function (this: SpecWorld, which: string, not: string | null) {
    assert.equal(
      (await gameAt(this, which).getAttribute("data-withdrawn")) !== null,
      not === null,
    );
  },
);

Then(
  /^the (first|second|third) game is struck through$/,
  async function (this: SpecWorld, which: string) {
    for (const line of ["first", "second"]) {
      assert.ok(
        await isStruckThrough(lineOf(this, line, which)),
        `The ${line} line is not struck through.`,
      );
    }
  },
);

// A game's lines ------------------------------------------------------------------

Then(
  /^the (first|second) line of the (first|second|third) game names "(.*)"$/,
  async function (this: SpecWorld, line: string, which: string, name: string) {
    assert.equal(
      await textOf(lineOf(this, line, which).locator(".game-name")),
      name,
    );
  },
);

Then(
  /^the (first|second) line of the (first|second|third) game scores "(.*)"$/,
  async function (this: SpecWorld, line: string, which: string, score: string) {
    assert.equal(
      await textOf(lineOf(this, line, which).locator(".game-score")),
      score,
    );
  },
);

Then(
  /^the (first|second) line of the (first|second|third) game ends with "(.*)"$/,
  async function (this: SpecWorld, line: string, which: string, words: string) {
    assert.ok(
      (await textOf(lineOf(this, line, which))).endsWith(words),
      `It says ${await textOf(lineOf(this, line, which))}.`,
    );
  },
);

Then(
  /^the (first|second) line of the (first|second|third) game represents "(.*)"$/,
  async function (
    this: SpecWorld,
    line: string,
    which: string,
    representing: string,
  ) {
    assert.equal(
      await textOf(lineOf(this, line, which).locator(".game-representing")),
      representing,
    );
  },
);

Then(
  /^the (first|second) line of the (first|second|third) game represents nothing$/,
  async function (this: SpecWorld, line: string, which: string) {
    assert.equal(
      await lineOf(this, line, which).locator(".game-representing").count(),
      0,
    );
  },
);

const flagOn = (world: SpecWorld, line: string, which: string): Locator =>
  lineOf(world, line, which).locator(".game-flag");

// The picture the flag is, as the site serves it, under whatever name it is
// given to be kept by.
Then(
  /^the (first|second) line of the (first|second|third) game shows the flag of "(.*)"$/,
  async function (this: SpecWorld, line: string, which: string, code: string) {
    const flag = Flags.thereAre.find(code);
    assert.ok(flag !== undefined, `There is no flag ${code}.`);
    const shown = (await flagOn(this, line, which).getAttribute("src")) ?? "";
    const [kept] = flag.relativePath.split(".");
    assert.ok(
      shown.includes(`/images/${kept!}.`),
      `The flag shown is ${shown}.`,
    );
  },
);

Then(
  /^the (first|second) line of the (first|second|third) game shows no flag$/,
  async function (this: SpecWorld, line: string, which: string) {
    assert.equal(await flagOn(this, line, which).count(), 0);
  },
);

Then(
  /^the flag on the (first|second) line of the (first|second|third) game is named "(.*)"$/,
  async function (this: SpecWorld, line: string, which: string, name: string) {
    assert.equal(await flagOn(this, line, which).getAttribute("alt"), name);
  },
);

// What the browser has of its own that this asks of it, since the specs are
// typed without the browser's own types.
interface InThePage {
  getComputedStyle(element: unknown): { readonly color: string };
}

const colourOf = (found: Locator): Promise<string> =>
  found.evaluate(
    (element) =>
      (globalThis as unknown as InThePage).getComputedStyle(element).color,
  );

// Drawn in another colour than the name, which on the panel is lighter: the
// name is in the panel's ink, which is as dark as the page has.
Then(
  /^what the (first|second) line of the (first|second|third) game represents is lighter than its name$/,
  async function (this: SpecWorld, line: string, which: string) {
    const found = lineOf(this, line, which);
    assert.notEqual(
      await colourOf(found.locator(".game-representing")),
      await colourOf(found.locator(".game-name")),
    );
  },
);

// Beside a game ---------------------------------------------------------------------

Then(
  /^the (first|second) line of the (first|second|third) game is beside "(.*)"$/,
  async function (this: SpecWorld, line: string, which: string, words: string) {
    // Found by where it is laid out rather than by what it is, since what is
    // beside a line differs from one list of games to another: the
    // competition beside the winner on a tournament's page, how long ago on
    // a block's order of play.
    const top = (await lineOf(this, line, which).boundingBox())?.y;
    assert.ok(top !== undefined, `The ${line} line is not shown.`);
    const besides = await gameAt(this, which).locator(".game-beside").all();
    const tops = await Promise.all(
      besides.map(async (each) => (await each.boundingBox())?.y),
    );
    const at = tops.findIndex(
      (each) => each !== undefined && Math.abs(each - top) < 4,
    );
    assert.ok(at >= 0, `Nothing is beside the ${line} line.`);
    assert.equal(await textOf(besides[at]!), words);
  },
);

Then(
  /^the (first|second|third) game was added "(.*)" ago$/,
  async function (this: SpecWorld, which: string, ago: string) {
    assert.equal(await textOf(gameAt(this, which).locator(".game-ago")), ago);
  },
);

const boxOf = async (
  found: Locator,
): Promise<{ x: number; y: number; width: number; height: number }> => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not on the page.");
  return box;
};

Then(
  /^the competition of the (first|second|third) game is to the right of its winner$/,
  async function (this: SpecWorld, which: string) {
    const winner = await boxOf(
      lineOf(this, "first", which).locator(".game-score"),
    );
    const competition = await boxOf(
      gameAt(this, which).locator(".game-competition a"),
    );
    assert.ok(
      competition.x >= winner.x + winner.width &&
        competition.y < winner.y + winner.height,
      `It starts ${String(competition.x)} across and ${String(competition.y)} down.`,
    );
  },
);

Then(
  /^the competition of the (first|second|third) game is beneath its loser$/,
  async function (this: SpecWorld, which: string) {
    const loser = await boxOf(lineOf(this, "second", which));
    const competition = await boxOf(
      gameAt(this, which).locator(".game-competition"),
    );
    assert.ok(
      competition.y >= loser.y + loser.height,
      `It starts ${String(competition.y)} pixels down.`,
    );
  },
);

// A competition's page is headed by the tournament's name, a first-level
// heading said aloud and not seen, and the competition's name beneath it, the
// second.
Then(
  "the competition is headed {string}",
  async function (this: SpecWorld, name: string) {
    const heading = this.browserPage.locator("main h2").first();
    await heading.waitFor();
    assert.equal((await heading.innerText()).trim(), name);
  },
);

// Its words ----------------------------------------------------------------------------

// The tournament's own words are left out, on its page, its players' page, a
// player's and a block's alike: its name, its players' names, their initials
// and what they represent, its competitions' names and the scores, which are
// what whoever entered them typed, and the day a game was added, which is
// numbers and a month the browser names.
Then(
  "every word in the page's content but the tournament's own is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "main", [
      "main h1",
      // The competition's name, as the tournament's is, and the script that
      // shows the print button, which is not words.
      ".competition-heading h2",
      "main script",
      ".game-name",
      ".game-representing",
      ".game-score",
      ".game-competition",
      ".game-day",
      ".player-name",
      ".player-representing",
      ".player-game-opponent",
      ".player-competition",
      ".block-grid-initials",
      ".block-grid-points",
      ".swiss-result-opponent",
      ".team-summary-team",
      ".team-summary-corner",
      ".test-team",
      ".test-side",
      ".test-score",
      ".players-team-name",
      ".player-game-team",
      ".rankings-tournament",
    ]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);
