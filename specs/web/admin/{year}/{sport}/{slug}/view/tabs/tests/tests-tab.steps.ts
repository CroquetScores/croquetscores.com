import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { english } from "../../../../../../../../../src/web/languages/english.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import {
  eventually,
  openTab,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// A tournament's Tests tab (tests-tab.feature). Its rows are drawn as the
// Competitions tab's are, so the steps that read a row's name and options are
// that tab's (competitions-tab.steps.ts); these are what a test says of
// itself — its days, how it is played, its group — and what the tab says when
// it has no teams to add a test between. A test's page says the same of it,
// and is read by the same steps (view.steps.ts beneath the test).

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

When(
  /^the tests of "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, name: string) {
    await openTab(this, name, "tests");
  },
);

const rowOf = (world: SpecWorld, name: string): Locator =>
  tabPanel(world)
    .locator("ul[data-listed] > .listed-item")
    .filter({
      has: world.browserPage.locator(".listed-name", {
        hasText: exactly(name),
      }),
    });

/** The days a row says the test is played, as each <time> says it. */
export const daysOf = async (within: Locator): Promise<string[]> =>
  Promise.all(
    (await within.locator(".test-days time").all()).map(
      async (time) => (await time.getAttribute("datetime")) ?? "",
    ),
  );

Then(
  "the test {string} is shown played on {string}",
  async function (this: SpecWorld, name: string, day: string) {
    await eventually(this, async () => {
      assert.deepEqual(await daysOf(rowOf(this, name)), [day]);
    });
  },
);

for (const [said, place] of [
  ["starting", 0],
  ["finishing", -1],
] as const) {
  Then(
    `the test {string} is shown ${said} on {string}`,
    async function (this: SpecWorld, name: string, day: string) {
      await eventually(this, async () => {
        const days = await daysOf(rowOf(this, name));
        assert.equal(days.length, 2, `It shows ${JSON.stringify(days)}.`);
        assert.equal(days.at(place), day);
      });
    },
  );
}

// Each day as Spanish writes it, its month named by the browser in Spanish:
// the day of the month, and the month's short name.
Then(
  "the days of the test {string} are written as Spanish writes a day",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      const times = rowOf(this, name).locator(".test-days time");
      const day = (await times.first().getAttribute("datetime")) ?? "";
      const month = new Intl.DateTimeFormat("es", {
        month: "short",
        timeZone: "UTC",
      }).format(new Date(`${day}T00:00:00Z`));
      assert.equal(
        (await times.first().innerText()).trim(),
        `${day.slice(8, 10)} ${month}`,
      );
    });
  },
);

Then(
  "the test {string} is shown expected to have {int} matches",
  async function (this: SpecWorld, name: string, matches: number) {
    await eventually(this, async () => {
      assert.equal(
        await rowOf(this, name)
          .locator(".test-matches")
          .getAttribute("data-matches", { timeout: 500 }),
        String(matches),
      );
    });
  },
);

Then(
  "the test {string} is shown with each match the best of {int}",
  async function (this: SpecWorld, name: string, games: number) {
    await eventually(this, async () => {
      assert.equal(
        await rowOf(this, name)
          .locator(".test-best-of")
          .getAttribute("data-best-of", { timeout: 500 }),
        String(games),
      );
    });
  },
);

Then(
  "the test {string} is shown in the group {string}",
  async function (this: SpecWorld, name: string, group: string) {
    await eventually(this, async () => {
      assert.equal(
        (
          await rowOf(this, name)
            .locator(".test-group")
            .innerText({ timeout: 500 })
        ).trim(),
        group,
      );
    });
  },
);

Then(
  "the test {string} is shown in no group",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await rowOf(this, name).locator(".test-group").count(), 0);
    });
  },
);

// What the tab says where Add Test would be, by the English words it says.
Then(
  "the tab says the words for {string}",
  async function (this: SpecWorld, key: string) {
    const words = english.words[key];
    assert.ok(words !== undefined, `English has no words for ${key}.`);
    await eventually(this, async () => {
      const said = await tabPanel(this).locator("section").innerText();
      assert.ok(said.includes(words), `The tab says ${said}.`);
    });
  },
);

// By what it does rather than its words, which are the reader's language's.
When("the way to the teams is pressed", async function (this: SpecWorld) {
  const toTeams = tabPanel(this).locator('button[data-action="teams"]');
  await toTeams.waitFor();
  await toTeams.click();
});

// Above the list, by the refusal's code: the words beside it are only its
// words.
Then(
  /^the (?:tab is refused|page is refused above the list) with "([^"]*)"$/,
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      assert.equal(
        await tabPanel(this)
          .locator(".listed-refused")
          .getAttribute("data-refused", { timeout: 500 }),
        code,
      );
    });
  },
);

// A test's name is its teams' short names and its group what the manager
// typed, and a day's month is named by the browser, so none is anybody's
// language.
Then(
  /^every word in the tab but the tests' names(?: and groups)? is in the test locale$/,
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "#tab-panel section", [
        ".listed-name",
        ".test-group",
        "time",
      ]);
      assert.deepEqual(stray, [], "Words in the tab came from elsewhere.");
    });
  },
);
