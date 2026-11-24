import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../support/world.js";
import { isStruckThrough } from "../../support/struckThrough.js";

// The page is drawn by the server, with no scripting, so what is read is there
// once the page has loaded: nothing here waits for it to be drawn again.
//
// Said here for a knockout's grid and its summary alike, which draw a round
// and a match the same way, the one side by side and the other one beneath
// another. Pressing a name and scrolling across are said with a block's
// (block.steps.ts, blockSummary.steps.ts), as are the views offered.

const places = ["first", "second", "third", "fourth"];

const placeOf = (which: string): number => {
  const at = places.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} place.`);
  return at;
};

// The grid's rounds or the summary's, whichever `view` names.
const roundsIn = (world: WebWorld, view: string): Locator =>
  world.browserPage.locator(
    view === "grid"
      ? "main .knockout .knockout-round"
      : "main .knockout-summary .knockout-summary-round",
  );

const roundAt = (world: WebWorld, round: string, view: string): Locator =>
  roundsIn(world, view).nth(placeOf(round));

const matchAt = (
  world: WebWorld,
  match: string,
  round: string,
  view: string,
): Locator =>
  roundAt(world, round, view).locator(".knockout-match").nth(placeOf(match));

const sideAt = (
  world: WebWorld,
  side: string,
  match: string,
  round: string,
  view: string,
): Locator =>
  matchAt(world, match, round, view)
    .locator("tr.knockout-side")
    .nth(placeOf(side));

const scoreAt = (
  world: WebWorld,
  score: string,
  side: string,
  match: string,
  round: string,
  view: string,
): Locator =>
  sideAt(world, side, match, round, view)
    .locator("td.knockout-score")
    .nth(placeOf(score));

// What is said, as a reader reads it, one space between each word.
const said = async (found: Locator): Promise<string> =>
  ((await found.textContent()) ?? "").replace(/\s+/g, " ").trim();

const boxOf = async (found: Locator) => {
  const box = await found.boundingBox();
  assert.ok(box !== null, "It is not shown.");
  return box;
};

const SIDE =
  "the (first|second) side of the (first|second) match of the (first|second|third|fourth) round in the (grid|summary)";

// Its rounds ------------------------------------------------------------------------

Then(
  /^the (first|second|third|fourth) round in the (grid|summary) is headed "(.*)"$/,
  async function (this: WebWorld, round: string, view: string, name: string) {
    assert.equal(
      await said(roundAt(this, round, view).locator(".knockout-round-name")),
      name,
    );
  },
);

Then(
  /^(\d+) rounds? (?:is|are) listed in the summary$/,
  async function (this: WebWorld, count: string) {
    assert.equal(await roundsIn(this, "summary").count(), Number(count));
  },
);

Then(
  "the second round in the summary is beneath the first",
  async function (this: WebWorld) {
    const first = await boxOf(roundAt(this, "first", "summary"));
    const second = await boxOf(roundAt(this, "second", "summary"));
    assert.ok(
      second.y >= first.y + first.height,
      `It starts ${String(second.y)} pixels down.`,
    );
  },
);

// What each round's matches are the best of ----------------------------------

const bestOfAt = (
  world: WebWorld,
  round: string,
  view: string = "grid",
): Locator => roundAt(world, round, view).locator(".knockout-best-of");

// Where a cell's words begin, which is its edge less nothing for the padding
// before them, so that two are compared by what a reader sees begin together
// rather than by the boxes they happen to be drawn in.
const wordsBeginAt = async (found: Locator): Promise<number> =>
  // The specs are not compiled to know the page's own types, as with
  // struckThrough.ts.
  found.evaluate((element: unknown) => {
    const style = (
      globalThis as unknown as {
        getComputedStyle(element: unknown): {
          direction: string;
          paddingLeft: string;
          paddingRight: string;
          borderLeftWidth: string;
          borderRightWidth: string;
        };
      }
    ).getComputedStyle(element);
    const { left, right } = (
      element as { getBoundingClientRect(): { left: number; right: number } }
    ).getBoundingClientRect();
    // Where words begin is the right edge in a language written right to left.
    return style.direction === "rtl"
      ? right -
          parseFloat(style.paddingRight) -
          parseFloat(style.borderRightWidth)
      : left +
          parseFloat(style.paddingLeft) +
          parseFloat(style.borderLeftWidth);
  });

Then(
  /^the best of (?:above|in) the (first|second|third|fourth) round in the (grid|summary) is "(.*)"$/,
  async function (this: WebWorld, round: string, view: string, words: string) {
    assert.equal(await said(bestOfAt(this, round, view)), words);
  },
);

Then(
  /^the best of (?:above|in) the (first|second|third|fourth) round in the (grid|summary) is above its first match$/,
  async function (this: WebWorld, round: string, view: string) {
    const label = await boxOf(bestOfAt(this, round, view));
    const match = await boxOf(matchAt(this, "first", round, view));
    assert.ok(
      label.y + label.height <= match.y + 1,
      `It ends ${String(label.y + label.height)} pixels down and the match starts ${String(match.y)}.`,
    );
  },
);

// Within a pixel, since a collapsed table's border is shared between its cells
// and a half pixel of it falls to either side.
Then(
  /^the best of (?:above|in) the (first|second|third|fourth) round in the (grid|summary) is aligned with the names beneath it$/,
  async function (this: WebWorld, round: string, view: string) {
    const label = await wordsBeginAt(bestOfAt(this, round, view));
    const name = await wordsBeginAt(
      sideAt(this, "first", "first", round, view).locator(".knockout-name"),
    );
    assert.ok(
      Math.abs(label - name) <= 1,
      `Its words begin ${String(label)} pixels across and the names ${String(name)}.`,
    );
  },
);

Then(
  /^the best of in the (first|second|third|fourth) round in the summary is beneath the round's name$/,
  async function (this: WebWorld, round: string) {
    const heading = await boxOf(
      roundAt(this, round, "summary").locator(".knockout-round-name"),
    );
    const label = await boxOf(bestOfAt(this, round, "summary"));
    assert.ok(
      label.y >= heading.y + heading.height - 1,
      `It starts ${String(label.y)} pixels down and the name ends ${String(heading.y + heading.height)}.`,
    );
  },
);

Then(
  /^the best of above the (first|second|third|fourth) round in the grid is level with the best of above the first round$/,
  async function (this: WebWorld, round: string) {
    const first = await boxOf(bestOfAt(this, "first"));
    const found = await boxOf(bestOfAt(this, round));
    assert.equal(found.y, first.y);
  },
);

// Its sides ------------------------------------------------------------------------

Then(
  new RegExp(`^${SIDE} is "(.*)"$`),
  async function (
    this: WebWorld,
    side: string,
    match: string,
    round: string,
    view: string,
    name: string,
  ) {
    assert.equal(
      await said(
        sideAt(this, side, match, round, view).locator(".player-name"),
      ),
      name,
    );
  },
);

Then(
  new RegExp(`^${SIDE} is a bye$`),
  async function (
    this: WebWorld,
    side: string,
    match: string,
    round: string,
    view: string,
  ) {
    assert.equal(
      await sideAt(this, side, match, round, view)
        .locator(".knockout-bye")
        .count(),
      1,
    );
  },
);

Then(
  new RegExp(`^${SIDE} is not yet known$`),
  async function (
    this: WebWorld,
    side: string,
    match: string,
    round: string,
    view: string,
  ) {
    const found = sideAt(this, side, match, round, view);
    assert.match(
      (await found.getAttribute("class")) ?? "",
      /\bknockout-side-unknown\b/,
    );
    assert.equal(await said(found.locator(".knockout-name")), "");
  },
);

Then(
  new RegExp(`^${SIDE} says they represent "(.*)"$`),
  async function (
    this: WebWorld,
    side: string,
    match: string,
    round: string,
    view: string,
    representing: string,
  ) {
    assert.equal(
      await said(
        sideAt(this, side, match, round, view).locator(".player-representing"),
      ),
      `(${representing})`,
    );
  },
);

Then(
  new RegExp(`^${SIDE} says they have withdrawn$`),
  async function (
    this: WebWorld,
    side: string,
    match: string,
    round: string,
    view: string,
  ) {
    assert.equal(
      await sideAt(this, side, match, round, view)
        .locator(".knockout-withdrawn")
        .count(),
      1,
    );
  },
);

Then(
  new RegExp(`^${SIDE} (does not have|has) its name struck through$`),
  async function (
    this: WebWorld,
    side: string,
    match: string,
    round: string,
    view: string,
    has: string,
  ) {
    assert.equal(
      await isStruckThrough(
        sideAt(this, side, match, round, view).locator(".player-name"),
      ),
      has === "has",
    );
  },
);

Then(
  new RegExp(`^${SIDE} is beneath its first$`),
  async function (
    this: WebWorld,
    side: string,
    match: string,
    round: string,
    view: string,
  ) {
    const first = await boxOf(sideAt(this, "first", match, round, view));
    const found = await boxOf(sideAt(this, side, match, round, view));
    assert.ok(
      found.y >= first.y + first.height - 1,
      `It starts ${String(found.y)} pixels down.`,
    );
  },
);

Then(
  new RegExp(`^${SIDE} has room for (\\d+) scores?$`),
  async function (
    this: WebWorld,
    side: string,
    match: string,
    round: string,
    view: string,
    count: string,
  ) {
    assert.equal(
      await sideAt(this, side, match, round, view)
        .locator("td.knockout-score")
        .count(),
      Number(count),
    );
  },
);

// Its scores -----------------------------------------------------------------------

const SCORE = `the (first|second|third) score of ${SIDE}`;

Then(
  new RegExp(`^${SCORE} is "(.*)"$`),
  async function (
    this: WebWorld,
    score: string,
    side: string,
    match: string,
    round: string,
    view: string,
    points: string,
  ) {
    assert.equal(
      await said(
        scoreAt(this, score, side, match, round, view).locator(
          ".knockout-points",
        ),
      ),
      points,
    );
  },
);

Then(
  new RegExp(`^${SCORE} is (not )?struck through$`),
  async function (
    this: WebWorld,
    score: string,
    side: string,
    match: string,
    round: string,
    view: string,
    not: string | null,
  ) {
    assert.equal(
      await isStruckThrough(scoreAt(this, score, side, match, round, view)),
      not === null,
    );
  },
);

Then(
  new RegExp(`^${SCORE} is (not )?said to be withdrawn$`),
  async function (
    this: WebWorld,
    score: string,
    side: string,
    match: string,
    round: string,
    view: string,
    not: string | null,
  ) {
    const aloud = await said(
      scoreAt(this, score, side, match, round, view).locator(
        ".visually-hidden",
      ),
    );
    assert.equal(/\bwithdrawn\b/.test(aloud), not === null, aloud);
  },
);

Then(
  new RegExp(`^${SCORE} is empty$`),
  async function (
    this: WebWorld,
    score: string,
    side: string,
    match: string,
    round: string,
    view: string,
  ) {
    assert.equal(
      await said(scoreAt(this, score, side, match, round, view)),
      "",
    );
  },
);

// Marked by more than colour: by a word said aloud, which is the result's, and
// by a weight, which the other result has not.
Then(
  new RegExp(`^${SCORE} is marked as (won|lost)$`),
  async function (
    this: WebWorld,
    score: string,
    side: string,
    match: string,
    round: string,
    view: string,
    result: string,
  ) {
    const found = scoreAt(this, score, side, match, round, view);
    assert.equal(await found.locator(`.knockout-${result}`).count(), 1);
    assert.notEqual(
      await said(found.locator(".visually-hidden")),
      "",
      "Nothing is said aloud of the result.",
    );
  },
);

// Where the matches stand ------------------------------------------------------

Then(
  "the first match of the second round in the grid is to the right of the first match of the first round",
  async function (this: WebWorld) {
    const before = await boxOf(matchAt(this, "first", "first", "grid"));
    const after = await boxOf(matchAt(this, "first", "second", "grid"));
    assert.ok(
      after.x >= before.x + before.width,
      `It starts ${String(after.x)} pixels across.`,
    );
  },
);

Then(
  "the first match of the second round in the grid is between the first and second matches of the first round",
  async function (this: WebWorld) {
    const above = await boxOf(matchAt(this, "first", "first", "grid"));
    const below = await boxOf(matchAt(this, "second", "first", "grid"));
    const between = await boxOf(matchAt(this, "first", "second", "grid"));
    const middle = between.y + between.height / 2;
    assert.ok(
      middle > above.y + above.height / 2 &&
        middle < below.y + below.height / 2,
      `Its middle is ${String(middle)} pixels down.`,
    );
  },
);

// The arrow across the grid ---------------------------------------------------

// The arrow on to the right, or the one back to the left, halfway down the
// grid ("across"), or above it or below it.
const arrow = (world: WebWorld, back: string | null, where: string): Locator =>
  world.browserPage.locator(
    where === "across"
      ? `main .knockout-frame > .knockout-${back === null ? "onward" : "back"}`
      : `main .knockout-${where} .knockout-edge-${back === null ? "onward" : "back"}`,
  );

// Asked again until it holds or a second has gone, since the browser scrolls
// and redraws in its own time after a press, and whether the arrow shows
// follows how far the grid is scrolled.
const eventually = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 1000;
  for (;;) {
    try {
      await check();
      return;
    } catch (failure) {
      if (Date.now() > until) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};

Then(
  /^an arrow (back )?(across|above|below) the grid is shown$/,
  async function (this: WebWorld, back: string | null, where: string) {
    await eventually(async () => {
      assert.equal(
        await arrow(this, back, where).isVisible(),
        true,
        "No arrow is shown.",
      );
    });
  },
);

Then(
  /^no arrow (back )?(across|above|below) the grid is shown$/,
  async function (this: WebWorld, back: string | null, where: string) {
    await eventually(async () => {
      assert.equal(
        await arrow(this, back, where).isVisible(),
        false,
        "An arrow is shown.",
      );
    });
  },
);

When(
  /^the arrow (back )?(across|above|below) the grid is pressed$/,
  async function (this: WebWorld, back: string | null, where: string) {
    // Once it shows, since the arrow back shows only once the grid has
    // scrolled from its start, which the press before it begins.
    await eventually(async () => {
      assert.equal(await arrow(this, back, where).isVisible(), true);
    });
    await arrow(this, back, where).click();
  },
);

// Wholly within the grid's scrolled view, give or take a pixel.
const inView = async (world: WebWorld, selector: string): Promise<void> => {
  await eventually(async () => {
    const grid = await boxOf(
      world.browserPage.locator("main .knockout-scroll"),
    );
    const round = await boxOf(world.browserPage.locator(selector));
    assert.ok(
      round.x >= grid.x - 1 && round.x + round.width <= grid.x + grid.width + 1,
      `The round runs from ${String(round.x)} to ${String(round.x + round.width)} pixels across.`,
    );
  });
};

Then("the final is in view within the grid", async function (this: WebWorld) {
  await inView(this, "main #knockout-final");
});

Then(
  "the first round is in view within the grid",
  async function (this: WebWorld) {
    await inView(this, "main #knockout-first");
  },
);

Then(
  "the arrow above the grid is above the first round",
  async function (this: WebWorld) {
    const above = await boxOf(arrow(this, null, "above"));
    const round = await boxOf(this.browserPage.locator("main #knockout-first"));
    assert.ok(
      above.y + above.height <= round.y + 1,
      `It ends ${String(above.y + above.height)} pixels down.`,
    );
  },
);

Then(
  /^no room is kept (above|below) the grid$/,
  async function (this: WebWorld, edge: string) {
    assert.equal(
      await this.browserPage.locator(`main .knockout-${edge}`).isVisible(),
      false,
      `Room is kept ${edge} the grid.`,
    );
  },
);

Then(
  "the arrow below the grid is below the first round",
  async function (this: WebWorld) {
    const below = await boxOf(arrow(this, null, "below"));
    const round = await boxOf(this.browserPage.locator("main #knockout-first"));
    assert.ok(
      below.y >= round.y + round.height - 1,
      `It starts ${String(below.y)} pixels down.`,
    );
  },
);

// Where an arrow's link leads: the round it names, or something within it,
// since following a link to part of the page brings that part into view.
Then(
  /^the arrow (back )?(across|above|below) the grid leads to the (first round|final)$/,
  async function (
    this: WebWorld,
    back: string | null,
    where: string,
    round: string,
  ) {
    const href = await arrow(this, back, where).getAttribute("href");
    assert.ok(href?.startsWith("#") === true, `It leads to ${String(href)}.`);
    const rounds = this.browserPage.locator("main .knockout .knockout-round");
    const named = round === "final" ? rounds.last() : rounds.first();
    const target = this.browserPage.locator(href);
    assert.equal(await target.count(), 1, `Nothing is ${href}.`);
    assert.equal(
      (await named.and(target).count()) + (await named.locator(href).count()),
      1,
      `${href} is not the ${round}.`,
    );
  },
);

// A word is broken where a line wraps within it, which a range over the word
// then has two tops for where an unbroken one has one (blockSummary.steps.ts
// does the same for a block's). The page is asked as a whole expression, since
// a function given as text is not called.
Then(
  "no word of any name in the knockout summary is broken",
  async function (this: WebWorld) {
    const broken = await this.browserPage.evaluate(`(() => {
      const split = [];
      for (const name of document.querySelectorAll("main .knockout-summary .player-name")) {
        const texts = document.createTreeWalker(name, NodeFilter.SHOW_TEXT);
        for (let at = texts.nextNode(); at !== null; at = texts.nextNode()) {
          for (const word of (at.textContent ?? "").matchAll(/\\S+/gu)) {
            const range = document.createRange();
            range.setStart(at, word.index);
            range.setEnd(at, word.index + word[0].length);
            const tops = new Set(
              [...range.getClientRects()].map((box) => Math.round(box.top)),
            );
            if (tops.size > 1) split.push(word[0]);
          }
        }
      }
      return split;
    })()`);
    assert.deepEqual(broken, []);
  },
);

for (const [said, scrolls] of [
  ["scrolls", true],
  ["does not scroll", false],
] as const) {
  Then(
    `the knockout summary ${said} sideways`,
    async function (this: WebWorld) {
      // Whether it scrolls, or nothing where there is no region to scroll,
      // so that a summary that has lost it is not taken for one that fits.
      const found = await this.browserPage.evaluate(
        `(() => {
          const found = document.querySelector("main .knockout-summary-scroll");
          return found === null ? undefined : found.scrollWidth > found.clientWidth;
        })()`,
      );
      assert.notEqual(found, undefined, "The summary has no region to scroll.");
      assert.equal(found, scrolls);
    },
  );
}
