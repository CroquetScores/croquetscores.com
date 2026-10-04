import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../support/world.js";

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
const roundsIn = (world: SpecWorld, view: string): Locator =>
  world.browserPage.locator(
    view === "grid"
      ? "main .knockout .knockout-round"
      : "main .knockout-summary .knockout-summary-round",
  );

const roundAt = (world: SpecWorld, round: string, view: string): Locator =>
  roundsIn(world, view).nth(placeOf(round));

const matchAt = (
  world: SpecWorld,
  match: string,
  round: string,
  view: string,
): Locator =>
  roundAt(world, round, view).locator(".knockout-match").nth(placeOf(match));

const sideAt = (
  world: SpecWorld,
  side: string,
  match: string,
  round: string,
  view: string,
): Locator =>
  matchAt(world, match, round, view)
    .locator("tr.knockout-side")
    .nth(placeOf(side));

const scoreAt = (
  world: SpecWorld,
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
  async function (this: SpecWorld, round: string, view: string, name: string) {
    assert.equal(
      await said(roundAt(this, round, view).locator(".knockout-round-name")),
      name,
    );
  },
);

Then(
  /^(\d+) rounds? (?:is|are) listed in the summary$/,
  async function (this: SpecWorld, count: string) {
    assert.equal(await roundsIn(this, "summary").count(), Number(count));
  },
);

Then(
  "the second round in the summary is beneath the first",
  async function (this: SpecWorld) {
    const first = await boxOf(roundAt(this, "first", "summary"));
    const second = await boxOf(roundAt(this, "second", "summary"));
    assert.ok(
      second.y >= first.y + first.height,
      `It starts ${String(second.y)} pixels down.`,
    );
  },
);

// Its sides ------------------------------------------------------------------------

Then(
  new RegExp(`^${SIDE} is "(.*)"$`),
  async function (
    this: SpecWorld,
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
    this: SpecWorld,
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
    this: SpecWorld,
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
    this: SpecWorld,
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
    this: SpecWorld,
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
  new RegExp(`^${SIDE} is beneath its first$`),
  async function (
    this: SpecWorld,
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
    this: SpecWorld,
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
    this: SpecWorld,
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
  new RegExp(`^${SCORE} is empty$`),
  async function (
    this: SpecWorld,
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
    this: SpecWorld,
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
  async function (this: SpecWorld) {
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
  async function (this: SpecWorld) {
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

// The arrow on to the right, or the one back to the left.
const arrow = (world: SpecWorld, back: string | null): Locator =>
  world.browserPage.locator(
    back === null ? "main .knockout-onward" : "main .knockout-back",
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
  /^an arrow (back )?across the grid is shown$/,
  async function (this: SpecWorld, back: string | null) {
    await eventually(async () => {
      assert.equal(
        await arrow(this, back).isVisible(),
        true,
        "No arrow is shown.",
      );
    });
  },
);

Then(
  /^no arrow (back )?across the grid is shown$/,
  async function (this: SpecWorld, back: string | null) {
    await eventually(async () => {
      assert.equal(
        await arrow(this, back).isVisible(),
        false,
        "An arrow is shown.",
      );
    });
  },
);

When(
  /^the arrow (back )?across the grid is pressed$/,
  async function (this: SpecWorld, back: string | null) {
    // Once it shows, since the arrow back shows only once the grid has
    // scrolled from its start, which the press before it begins.
    await eventually(async () => {
      assert.equal(await arrow(this, back).isVisible(), true);
    });
    await arrow(this, back).click();
  },
);

// Wholly within the grid's scrolled view, give or take a pixel.
const inView = async (world: SpecWorld, selector: string): Promise<void> => {
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

Then("the final is in view within the grid", async function (this: SpecWorld) {
  await inView(this, "main #knockout-final");
});

Then(
  "the first round is in view within the grid",
  async function (this: SpecWorld) {
    await inView(this, "main #knockout-first");
  },
);
