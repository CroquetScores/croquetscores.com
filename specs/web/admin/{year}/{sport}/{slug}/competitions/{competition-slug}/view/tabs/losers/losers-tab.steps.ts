import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  load,
  tournamentNamed,
} from "../../../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../../../support/world.js";
import { eventually } from "../../../../../../../../../support/tournamentPage.js";

// A knockout's Losers tab and the dialog that adds a losers knockout from it.
// What a dialog is called and its buttons are the modal dialog's steps
// (modalDialog.ts); these are what the tab and this dialog have of their own.

const tab = (world: SpecWorld) => world.browserPage.locator(".losers-tab");
const dialog = (world: SpecWorld) => world.browserPage.locator("dialog[open]");

Then(
  "the losers tab offers {string}",
  async function (this: SpecWorld, button: string) {
    await tab(this)
      .getByRole("button", { name: button, exact: true })
      .waitFor();
  },
);

Then(
  "the losers tab does not offer {string}",
  async function (this: SpecWorld, button: string) {
    await tab(this).waitFor();
    await eventually(this, async () => {
      assert.equal(
        await tab(this)
          .getByRole("button", { name: button, exact: true })
          .count(),
        0,
      );
    });
  },
);

// Given and When alike: Cucumber does not tell them apart.
Given(
  "{string} is pressed in the losers tab",
  async function (this: SpecWorld, button: string) {
    await tab(this).getByRole("button", { name: button, exact: true }).click();
  },
);

When(
  "{string} is chosen as the losers dialog's round",
  async function (this: SpecWorld, round: string) {
    await dialog(this).locator("select").selectOption({ label: round });
  },
);

const roundsOffered = async (world: SpecWorld): Promise<string[]> =>
  (await dialog(world).locator("select option").allTextContents()).map(
    (words) => words.trim(),
  );

Then(
  "the losers dialog offers the round {string}",
  async function (this: SpecWorld, round: string) {
    await eventually(this, async () => {
      const offered = await roundsOffered(this);
      assert.ok(offered.includes(round), `Offered: ${JSON.stringify(offered)}`);
    });
  },
);

Then(
  "the losers dialog does not offer the round {string}",
  async function (this: SpecWorld, round: string) {
    await dialog(this).locator("select").waitFor();
    const offered = await roundsOffered(this);
    assert.ok(!offered.includes(round), `Offered: ${JSON.stringify(offered)}`);
  },
);

Then(
  "the losers knockout {string} is listed",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      const listed = await tab(this)
        .locator('[data-listed="losers"] .listed-name')
        .allTextContents();
      assert.ok(listed.includes(name), `Listed: ${JSON.stringify(listed)}`);
    });
  },
);

Then(
  "the losers tab says there are no losers knockouts",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(
        (await tab(this).locator(".listed-none").allTextContents()).join(" "),
        "No losers knockouts.",
      );
    });
  },
);

Then(
  "the losers tab says there is no round whose losers could play on",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok(
        (await tab(this).locator(".listed-none").allTextContents()).includes(
          "This knockout has no round whose losers could play on.",
        ),
      );
    });
  },
);

const playersTab = (world: SpecWorld) =>
  world.browserPage.locator(".competition-players-tab");
const READ_ONLY =
  "This knockout's players are the losers of another knockout, put here as each match is decided.";

Then(
  "the players tab says the players are the losers of another knockout",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok(
        (await playersTab(this).locator("p").allTextContents()).includes(
          READ_ONLY,
        ),
      );
    });
  },
);

Then(
  "the players tab does not say the players are the losers of another knockout",
  async function (this: SpecWorld) {
    await playersTab(this).waitFor();
    await eventually(this, async () => {
      assert.ok(
        !(await playersTab(this).locator("p").allTextContents()).includes(
          READ_ONLY,
        ),
      );
    });
  },
);

Then(
  "the players tab offers no way to change the players",
  async function (this: SpecWorld) {
    await playersTab(this).locator("p").first().waitFor();
    assert.equal(await playersTab(this).locator("select").count(), 0);
    assert.equal(
      await playersTab(this).locator(".listed-options button").count(),
      0,
    );
  },
);

// Read from the tournament as the application has it, which the page was
// served from, rather than from anything the scenario holds.
Then(
  "the losers knockout {string} has a draw of {int} places",
  async function (this: SpecWorld, name: string, places: number) {
    await eventually(this, async () => {
      const tournament = await load(this, tournamentNamed(this, "Spring Open"));
      const found = tournament.competitions.find(
        ({ reference }) => reference.name.toString() === name,
      );
      assert.ok(found?.shape.kind === "knockout", `${name} is not a knockout.`);
      assert.equal(found.shape.draw.places, places);
    });
  },
);

// The refusal arrives after the press, so it is waited for.
Then(
  "the losers dialog says {string}",
  async function (this: SpecWorld, words: string) {
    await eventually(this, async () => {
      const said = await dialog(this).locator(".dialog-content").innerText();
      assert.ok(
        said.includes(words),
        `The dialog says ${JSON.stringify(said)}.`,
      );
    });
  },
);
