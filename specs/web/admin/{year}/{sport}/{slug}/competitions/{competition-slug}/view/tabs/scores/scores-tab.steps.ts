import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../../../support/world.js";
import { scenarioOf as domainScenarioOf } from "../../../../../../../../../../domain/aggregates/tournaments/tournament/aTournament.js";
import { unmarkedWithin } from "../../../../../../../../../support/marks.js";
import {
  eventually,
  settled,
  tabPanel,
} from "../../../../../../../../../support/tournamentPage.js";
import { openCompetitionTab } from "../players/competition-players-tab.steps.js";

// A competition's Scores tab (scores-tab.feature). A score is found by its
// winner and its loser, and by its scores as well where the two played more
// than once, as the tab shows them.

When(
  /^the scores of "([^"]*)" in "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, competition: string, name: string) {
    await openCompetitionTab(this, competition, name, "scores");
  },
);

type List = "in-use" | "archived";

const rows = (world: SpecWorld, list?: List): Locator =>
  tabPanel(world).locator(
    list === undefined
      ? "ul[data-listed] > .listed-item"
      : `ul[data-listed="${list}"] > .listed-item`,
  );

const partOf = async (row: Locator, part: string): Promise<string> =>
  (await row.locator(`.score-${part}`).innerText()).trim();

// What a row says, as "Sam Someone 26 Alex Another 17".
const said = async (row: Locator): Promise<string> =>
  [
    await partOf(row, "winner"),
    await partOf(row, "winner-score"),
    await partOf(row, "loser"),
    await partOf(row, "loser-score"),
  ].join(" ");

const saidIn = async (world: SpecWorld, list?: List): Promise<string[]> => {
  const all = rows(world, list);
  const count = await all.count();
  const found: string[] = [];
  for (let each = 0; each < count; each += 1) {
    found.push(await said(all.nth(each)));
  }
  return found;
};

// Whether what a row says is the score of `winner` beating `loser`, and 26 to
// 17 where the scenario says the scores.
const isScore = (
  row: string,
  winner: string,
  loser: string,
  scores?: string,
): boolean => {
  const [winnerScore, loserScore] = scores?.split(" to ") ?? [];
  return scores === undefined
    ? row.startsWith(`${winner} `) && row.includes(` ${loser} `)
    : row === `${winner} ${winnerScore ?? ""} ${loser} ${loserScore ?? ""}`;
};

const rowOf = async (
  world: SpecWorld,
  winner: string,
  loser: string,
  scores?: string,
): Promise<Locator> => {
  const all = await saidIn(world);
  const place = all.findIndex((row) => isScore(row, winner, loser, scores));
  assert.ok(place !== -1, `The scores are ${JSON.stringify(all)}.`);
  return rows(world).nth(place);
};

const placeIn = async (
  world: SpecWorld,
  winner: string,
  loser: string,
  list?: List,
): Promise<number> =>
  (await saidIn(world, list)).findIndex((row) => isScore(row, winner, loser));

const SCORE = String.raw`the score of "([^"]*)" beating "([^"]*)"(?: (\S+ to \S+))?`;

Then(
  new RegExp(`^${SCORE} is listed$`),
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    scores: string | null,
  ) {
    await eventually(this, async () => {
      await rowOf(this, winner, loser, scores ?? undefined);
    });
  },
);

for (const [said, list, expected] of [
  ["listed among the archived", "archived", true],
  ["not listed among the archived", "archived", false],
  ["not listed among those in use", "in-use", false],
] as const) {
  Then(
    new RegExp(`^the score of "([^"]*)" beating "([^"]*)" is ${said}$`),
    async function (this: SpecWorld, winner: string, loser: string) {
      await eventually(this, async () => {
        assert.equal(
          (await placeIn(this, winner, loser, list)) !== -1,
          expected,
          `The ${list} scores are ${JSON.stringify(await saidIn(this, list))}.`,
        );
      });
    },
  );
}

for (const [words, earlier] of [
  ["after", false],
  ["before", true],
] as const) {
  Then(
    new RegExp(
      `^the score of "([^"]*)" beating "([^"]*)" is listed ${words} the score of "([^"]*)" beating "([^"]*)"$`,
    ),
    async function (
      this: SpecWorld,
      winner: string,
      loser: string,
      otherWinner: string,
      otherLoser: string,
    ) {
      await eventually(this, async () => {
        const one = await placeIn(this, winner, loser);
        const other = await placeIn(this, otherWinner, otherLoser);
        assert.ok(one !== -1 && other !== -1, "One is not listed.");
        assert.equal(one < other, earlier);
      });
    },
  );
}

Then(
  /^the (first|last) score listed is of "([^"]*)" beating "([^"]*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    winner: string,
    loser: string,
  ) {
    await eventually(this, async () => {
      const all = await saidIn(this, "in-use");
      const row = which === "first" ? all[0] : all.at(-1);
      assert.ok(
        row !== undefined && isScore(row, winner, loser),
        `The scores are ${JSON.stringify(all)}.`,
      );
    });
  },
);

const PARTS: Readonly<Record<string, string>> = {
  winner: "winner",
  "winner's score": "winner-score",
  loser: "loser",
  "loser's score": "loser-score",
};

Then(
  /^the first (score listed|archived score) shows "([^"]*)" as its (winner|winner's score|loser|loser's score)$/,
  async function (this: SpecWorld, which: string, shown: string, part: string) {
    await eventually(this, async () => {
      const row = rows(
        this,
        which === "score listed" ? "in-use" : "archived",
      ).first();
      assert.equal(await partOf(row, PARTS[part] ?? part), shown);
    });
  },
);

Then(
  "in the first score listed {string} is shown before {string}",
  async function (this: SpecWorld, one: string, other: string) {
    await eventually(this, async () => {
      const row = (await saidIn(this, "in-use"))[0] ?? "";
      assert.ok(
        row.includes(one) &&
          row.includes(other) &&
          row.indexOf(one) < row.indexOf(other),
        `It says ${row}.`,
      );
    });
  },
);

const optionOf = async (
  world: SpecWorld,
  option: string,
  winner: string,
  loser: string,
  scores?: string,
): Promise<Locator> =>
  (await rowOf(world, winner, loser, scores))
    .locator(".listed-options button")
    .filter({
      hasText: new RegExp(`^${option.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`),
    });

Then(
  new RegExp(`^${SCORE} (offers|does not offer) "([^"]*)"$`),
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    scores: string | null,
    offers: string,
    option: string,
  ) {
    await eventually(this, async () => {
      assert.equal(
        await (
          await optionOf(this, option, winner, loser, scores ?? undefined)
        ).count(),
        offers === "offers" ? 1 : 0,
      );
    });
  },
);

When(
  new RegExp(`^"([^"]*)" is pressed on ${SCORE}$`),
  async function (
    this: SpecWorld,
    option: string,
    winner: string,
    loser: string,
    scores: string | null,
  ) {
    await settled(this);
    await (
      await optionOf(this, option, winner, loser, scores ?? undefined)
    ).click();
    await settled(this);
  },
);

Then(
  /^the score of "([^"]*)" beating "([^"]*)" is (not )?struck through$/,
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    not: string | null,
  ) {
    await eventually(this, async () => {
      const line = await (
        await rowOf(this, winner, loser)
      )
        .locator(".listed-score")
        .evaluate(
          (element: unknown) =>
            (
              globalThis as unknown as {
                getComputedStyle(element: unknown): {
                  textDecorationLine: string;
                };
              }
            ).getComputedStyle(element).textDecorationLine,
        );
      assert.equal(line.includes("line-through"), not === null);
    });
  },
);

Then(
  "the score of {string} beating {string} is announced as archived",
  async function (this: SpecWorld, winner: string, loser: string) {
    await eventually(this, async () => {
      assert.equal(
        await (
          await rowOf(this, winner, loser)
        )
          .locator(".visually-hidden")
          .count(),
        1,
      );
    });
  },
);

const heading = (world: SpecWorld): Locator =>
  tabPanel(world).locator(".listed-archived-heading");

Then(
  "the archived scores are headed {string}",
  async function (this: SpecWorld, words: string) {
    await eventually(this, async () => {
      assert.equal((await heading(this).innerText()).trim(), words);
    });
  },
);

Then(
  "no heading for the archived scores is shown",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await rows(this).count()) > 0);
      assert.equal(await heading(this).count(), 0);
    });
  },
);

Then("the tab says there are no scores", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await rows(this).count(), 0);
    assert.equal(await tabPanel(this).locator(".listed-none").count(), 1);
  });
});

Then(
  "{string} is above the scores",
  async function (this: SpecWorld, option: string) {
    await eventually(this, async () => {
      const offer = await tabPanel(this)
        .locator("section > p button")
        .filter({ hasText: option })
        .boundingBox();
      const list = await tabPanel(this)
        .locator("ul[data-listed]")
        .first()
        .boundingBox();
      assert.ok(offer !== null && list !== null, "One is not laid out.");
      assert.ok(offer.y + offer.height <= list.y, `${option} is not above.`);
    });
  },
);

Then(
  new RegExp(`^"([^"]*)" on ${SCORE} is at least (\\d+) pixels tall$`),
  async function (
    this: SpecWorld,
    option: string,
    winner: string,
    loser: string,
    scores: string | null,
    pixels: string,
  ) {
    await eventually(this, async () => {
      const box = await (
        await optionOf(this, option, winner, loser, scores ?? undefined)
      ).boundingBox();
      assert.ok(box !== null, "It is not laid out.");
      assert.ok(box.height >= Number(pixels), `It is ${String(box.height)}.`);
    });
  },
);

// A player's name is what the manager typed, and nobody's language, and a
// score is a number and whatever the scorer wrote after it.
Then(
  "every word in the tab but the players' names is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "#tab-panel section", [
        ".listed-score",
      ]);
      assert.deepEqual(stray, [], "Words in the tab came from elsewhere.");
    });
  },
);

When("the way to add a score is pressed", async function (this: SpecWorld) {
  await settled(this);
  await tabPanel(this).locator("section > p button").first().click();
});

// What a knockout added before the scenario is to be ---------------------------

Given(
  /^the knockout's (first|second) round is to be the best of (\d+)$/,
  function (this: SpecWorld, round: string, games: string) {
    domainScenarioOf(this).drawRounds[round === "first" ? 0 : 1] =
      Number(games);
  },
);
