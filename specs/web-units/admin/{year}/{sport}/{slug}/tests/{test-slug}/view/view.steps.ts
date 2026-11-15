import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import {
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import { testNamed } from "../../../../../../../../domain/aggregates/tournaments/tournament/aTeamTournament.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import { eventually } from "../../../../../../../support/tournamentPage.js";

// A test's page, opened at its address beneath its tournament's. Its scores
// are listed as a competition's Scores tab lists them, so the steps that read
// them are that tab's (scores-tab.steps.ts), and those of the dialog it opens
// the score dialog's (score-modal-dialog.steps.ts).
//
// The page is taken as open once it has drawn its heading: the test's name,
// or what it says in its place where the reader cannot see it.

Given(
  /^the page of the test "([^"]*)" in "([^"]*)" is open(?:ed)?$/,
  async function (this: SpecWorld, test: string, name: string) {
    const tournament = await load(this, tournamentNamed(this, name));
    const { reference } = testNamed(tournament, test);
    await this.browserPage.goto(
      `${this.baseUrl!}/admin/${tournament.address.toString()}/tests/${reference.slug.toString()}`,
    );
    // Where the reader is sent to sign in first there is no heading of the
    // admin's to wait for, and the sign in page is what the scenario looks at.
    if (!new URL(this.browserPage.url()).pathname.startsWith("/admin/")) {
      return;
    }
    await this.browserPage.locator("main h1").first().waitFor();
  },
);

// What is said beneath the heading -----------------------------------------------

const about = (world: SpecWorld): Locator =>
  world.browserPage.locator("main .page-about");

Then(
  /^the page says the test is expected to have (\d+) match(?:es)?$/,
  async function (this: SpecWorld, matches: number) {
    await eventually(this, async () => {
      assert.equal(
        await about(this)
          .locator(".test-matches")
          .getAttribute("data-matches", { timeout: 500 }),
        String(matches),
      );
    });
  },
);

Then(
  "the page says each match is the best of {int}",
  async function (this: SpecWorld, games: number) {
    await eventually(this, async () => {
      assert.equal(
        await about(this)
          .locator(".test-best-of")
          .getAttribute("data-best-of", { timeout: 500 }),
        String(games),
      );
    });
  },
);

// The scores, set out by team ---------------------------------------------------

const scoreTable = (world: SpecWorld): Locator =>
  world.browserPage.locator("#page-list table");

Then(
  "the scores are headed {string}, {string} and {string}",
  async function (
    this: SpecWorld,
    first: string,
    between: string,
    second: string,
  ) {
    await eventually(this, async () => {
      const headed = (
        await scoreTable(this).first().locator("thead th").allInnerTexts()
      ).map((each) => each.trim());
      assert.deepEqual(headed.slice(0, 3), [first, between, second]);
    });
  },
);

// What a row says, cell by cell, before what it offers.
Then(
  /^the (first score listed|first archived score) reads "([^"]*)", "([^"]*)" and "([^"]*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    first: string,
    scores: string,
    second: string,
  ) {
    await eventually(this, async () => {
      const row = this.browserPage
        .locator(
          `#page-list [data-listed="${which === "first score listed" ? "in-use" : "archived"}"] > .listed-item`,
        )
        .first();
      const cells = (await row.locator("td").allInnerTexts()).map((each) =>
        each.trim(),
      );
      assert.deepEqual(cells.slice(0, 3), [first, scores, second]);
    });
  },
);

// On one line: the text of each cell laid out in one line box.
Then(
  "no part of the first score listed wraps",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const lines = await this.browserPage.evaluate<number[]>(`(() => {
        const row = document.querySelector('#page-list [data-listed="in-use"] > .listed-item');
        if (!row) return [];
        return [...row.querySelectorAll("td")].slice(0, 3).map((cell) => {
          const range = document.createRange();
          range.selectNodeContents(cell);
          return new Set([...range.getClientRects()].map((box) => Math.round(box.top))).size;
        });
      })()`);
      assert.deepEqual(
        lines,
        [1, 1, 1],
        `The parts take ${JSON.stringify(lines)} lines.`,
      );
    });
  },
);

// Each of the first three cells of the first score listed is no wider than
// its text and the room around it, which a column stretched to fill the
// table's width would be.
Then(
  "the players and the scores of the first score listed are no wider than what is in them",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const spare = await this.browserPage.evaluate<number[]>(`(() => {
        const row = document.querySelector('#page-list [data-listed="in-use"] > .listed-item');
        if (!row) return [];
        return [...row.querySelectorAll("td")].slice(0, 3).map((cell) => {
          const range = document.createRange();
          range.selectNodeContents(cell);
          const style = getComputedStyle(cell);
          const room = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
          return Math.round(cell.getBoundingClientRect().width - range.getBoundingClientRect().width - room);
        });
      })()`);
      assert.equal(spare.length, 3, "The first score is not laid out.");
      assert.ok(
        spare.every((each) => each <= 1),
        `The cells have ${JSON.stringify(spare)} pixels to spare.`,
      );
    });
  },
);

// The right edge of what a score offers, against the right edge of the room
// the page gives its scores.
Then(
  "what the first score listed offers ends at the right edge of the page",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const offered = await scoreTable(this)
        .first()
        .locator('[data-listed="in-use"] > .listed-item')
        .first()
        .locator(".listed-options button")
        .last()
        .boundingBox();
      const room = await this.browserPage.locator("#page-list").boundingBox();
      assert.ok(offered && room, "It is not laid out.");
      const gap = room.x + room.width - (offered.x + offered.width);
      assert.ok(
        gap >= 0 && gap <= 16,
        `What it offers ends ${String(Math.round(gap))} pixels short of the right edge.`,
      );
    });
  },
);

// Laid out as a table is: each cell of a row starting and ending where the
// heading above it does, to the pixel, as the columns of one table do.
Then(
  "each part of the first score listed lines up under its heading",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const table = scoreTable(this).first();
      const headings = await table.locator("thead tr > *").all();
      const cells = await table
        .locator('[data-listed="in-use"] > .listed-item')
        .first()
        .locator("td")
        .all();
      assert.equal(cells.length, headings.length, "The columns differ.");
      for (const [place, heading] of headings.entries()) {
        const above = await heading.boundingBox();
        const below = await cells[place]?.boundingBox();
        assert.ok(above && below, "A column is not laid out.");
        assert.ok(
          Math.abs(above.x - below.x) < 1 &&
            Math.abs(above.width - below.width) < 1,
          `Column ${String(place + 1)} runs from ${String(above.x)} for ${String(above.width)} above and from ${String(below.x)} for ${String(below.width)} below.`,
        );
      }
    });
  },
);

// The teams' names and short names and the players' are what the manager
// typed: none is anybody's language.
Then(
  "every word in the admin's content but the test's, the teams' and the players' own is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "main", [
        "main h1",
        "th.test-team",
        ".score-player",
      ]);
      assert.deepEqual(stray, [], "Words in the admin came from elsewhere.");
    });
  },
);
