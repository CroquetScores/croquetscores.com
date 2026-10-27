// The page where an administrator imports the world ranking players
// (importWorldRankingPlayers.feature), in a real browser. A line of the log
// is read by what it says it is, as the page marks it, rather than by its
// words, which are in whatever language the page is in.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";
import { unmarkedWithin } from "../../../support/marks.js";

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

// Retried for three seconds, which leaves a step time to fail with what it
// found rather than with Cucumber's word that it took too long.
const eventually = async (check: () => Promise<void>): Promise<void> => {
  const until = Date.now() + 3000;
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

const lines = (world: SpecWorld): Locator =>
  world.browserPage.locator("ol.import-log > .import-log-line");

const buttonCalled = (world: SpecWorld, words: string): Locator =>
  world.browserPage.locator("main button").filter({ hasText: exactly(words) });

// What a line says it is, as the page marks it, for a step to compare with
// what the scenario expects of it.
const lineAt = async (
  world: SpecWorld,
  place: string,
): Promise<Record<string, string | null>> => {
  const all = lines(world);
  const count = await all.count();
  const index = place === "last" ? count - 1 : PLACES.indexOf(place);
  assert.ok(index >= 0 && index < count, `The log has ${String(count)} lines.`);
  const line = all.nth(index);
  const said: Record<string, string | null> = {};
  for (const mark of ["kind", "sport", "players", "refused"]) {
    said[mark] = await line.getAttribute(`data-${mark}`);
  }
  return said;
};

const PLACES = ["first", "second", "third", "fourth", "fifth", "sixth"];
const PLACE = "(first|second|third|fourth|fifth|sixth|last)";
const SPORT = "(association croquet|golf croquet)";

const sportOf = (name: string): string =>
  name === "association croquet" ? "ac" : "gc";

const expecting = (
  world: SpecWorld,
  place: string,
  expected: Record<string, string | null>,
): Promise<void> =>
  eventually(async () => {
    assert.deepEqual(await lineAt(world, place), {
      kind: null,
      sport: null,
      players: null,
      refused: null,
      ...expected,
    });
  });

// The next import asked for, answered as a failure of the site's is: a server
// error, and a page rather than a code.
Given(
  "the import is answered with a server error",
  async function (this: SpecWorld) {
    await this.browserPage.route(
      (url) => url.pathname === "/api/site/world-ranking-players/import",
      async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "text/html",
          body: "Something went wrong.",
        });
      },
      { times: 1 },
    );
  },
);

Then(
  "the page's heading is {string}",
  async function (this: SpecWorld, heading: string) {
    await eventually(async () => {
      assert.equal(
        (await this.browserPage.locator("main h1").innerText()).trim(),
        heading,
      );
    });
  },
);

Then("{string} is offered", async function (this: SpecWorld, words: string) {
  await eventually(async () => {
    assert.equal(await buttonCalled(this, words).count(), 1);
  });
});

Then(
  "{string} cannot be pressed",
  async function (this: SpecWorld, words: string) {
    await eventually(async () => {
      assert.equal(await buttonCalled(this, words).isDisabled(), true);
    });
  },
);

Then(
  "{string} can be pressed",
  async function (this: SpecWorld, words: string) {
    await eventually(async () => {
      assert.equal(await buttonCalled(this, words).isEnabled(), true);
    });
  },
);

Then("the import's log is empty", async function (this: SpecWorld) {
  // Attached rather than visible, since a list with nothing in it takes up no
  // room on the page.
  await this.browserPage
    .locator("ol.import-log")
    .waitFor({ state: "attached" });
  assert.equal(await lines(this).count(), 0);
});

// Once Import can be pressed again with the last line saying so, which is
// when the import is over and nothing more will be said of it.
const finished = async function (this: SpecWorld): Promise<void> {
  await this.browserPage
    .locator('main [aria-busy="false"] .import-log-line:last-child')
    .and(this.browserPage.locator('[data-kind="finished"]'))
    .waitFor();
};

// One definition serves Given and When alike, since Cucumber does not tell
// them apart.
When("the import's log says it has finished", finished);

Then(
  "the import's log has {int} lines",
  async function (this: SpecWorld, count: number) {
    await eventually(async () => {
      assert.equal(await lines(this).count(), count);
    });
  },
);

Then(
  new RegExp(
    `^the import's log's ${PLACE} line says the ${SPORT} list is being read$`,
  ),
  async function (this: SpecWorld, place: string, sport: string) {
    await expecting(this, place, { kind: "reading", sport: sportOf(sport) });
  },
);

Then(
  new RegExp(
    `^the import's log's ${PLACE} line says (\\d+) ${SPORT} players? (?:was|were) (read|kept)$`,
  ),
  async function (
    this: SpecWorld,
    place: string,
    players: number,
    sport: string,
    kind: string,
  ) {
    // A number in the scenario, and text on the page.
    await expecting(this, place, {
      kind,
      sport: sportOf(sport),
      players: String(players),
    });
  },
);

Then(
  new RegExp(
    `^the import's log's ${PLACE} line says the ${SPORT} list was refused with "([^"]*)"$`,
  ),
  async function (this: SpecWorld, place: string, sport: string, code: string) {
    await expecting(this, place, {
      kind: "refused",
      sport: sportOf(sport),
      refused: code,
    });
  },
);

// A list that could not be read is the line that says its players were left
// as they were: the words are the reader's language's, so it is told by what
// the line says it is.
Then(
  new RegExp(
    `^the import's log's ${PLACE} line says the ${SPORT} players were left as they were$`,
  ),
  async function (this: SpecWorld, place: string, sport: string) {
    await eventually(async () => {
      const said = await lineAt(this, place);
      assert.equal(said.kind, "refused");
      assert.equal(said.sport, sportOf(sport));
    });
  },
);

Then(
  new RegExp(`^the import's log's ${PLACE} line says it has finished$`),
  async function (this: SpecWorld, place: string) {
    await expecting(this, place, { kind: "finished" });
  },
);

Then(
  new RegExp(
    `^the import's log's ${PLACE} line says the import was refused with "([^"]*)"$`,
  ),
  async function (this: SpecWorld, place: string, code: string) {
    await expecting(this, place, { kind: "failed", refused: code });
  },
);

// By its place rather than its words, which are in whatever language the page
// is in.
When("the way to import is pressed", async function (this: SpecWorld) {
  await this.browserPage.locator("main h1 ~ p > button").click();
});

// A number is written into the words around it, which are marked as a whole,
// and a code is not shown at all, only what the reader's language says of it.
Then(
  "every word in the import's log but its numbers and codes is in the test locale",
  async function (this: SpecWorld) {
    const stray = await unmarkedWithin(this, "ol.import-log");
    assert.deepEqual(stray, [], "Words in the log came from elsewhere.");
  },
);
