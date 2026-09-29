import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { english } from "../../../../../../../../../../../src/web/languages/english.js";
import {
  load,
  tournamentNamed,
} from "../../../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../../../support/world.js";
import {
  isMarked,
  unmarkedWithin,
} from "../../../../../../../../../support/marks.js";
import { unmarked } from "../../../../../../../../../support/languages.js";
import {
  eventually,
  settled,
  tabPanel,
} from "../../../../../../../../../support/tournamentPage.js";

// A competition's Players tab. Its list is drawn as the tournament's Players
// tab's is, so the steps that read a player's row are that tab's
// (players-tab.steps.ts); these are what this tab has of its own: the
// drop-down of players to add, those playing and the withdrawn, and asking
// before removing or withdrawing.

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

/** The page of the competition `competition` of `name`, on its Players tab. */
export const openCompetitionTab = async (
  world: SpecWorld,
  competition: string,
  name: string,
  tab: "players" | "scores",
): Promise<void> => {
  const tournament = await load(world, tournamentNamed(world, name));
  const found = tournament.competitions.find(
    ({ reference }) => reference.name.toString() === competition,
  );
  assert.ok(found !== undefined, `${name} has no competition ${competition}.`);
  await world.browserPage.goto(
    `${world.baseUrl!}/admin/${tournament.address.toString()}/competitions/${found.reference.slug.toString()}`,
  );
  await world.browserPage.locator(`#tab-${tab}`).click();
  await settled(world);
};

When(
  /^the players of "([^"]*)" in "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, competition: string, name: string) {
    await openCompetitionTab(this, competition, name, "players");
  },
);

const namesIn = async (
  world: SpecWorld,
  list: "playing" | "withdrawn",
): Promise<string[]> =>
  (
    await tabPanel(world)
      .locator(`ul[data-listed="${list}"] > .listed-item .listed-name`)
      .allInnerTexts()
  ).map((name) => name.trim());

for (const [said, list] of [
  ["those playing", "playing"],
  ["the withdrawn", "withdrawn"],
] as const) {
  Then(
    `the player {string} is listed among ${said}`,
    async function (this: SpecWorld, name: string) {
      await eventually(this, async () => {
        assert.ok(
          (await namesIn(this, list)).includes(name),
          `${said} are ${JSON.stringify(await namesIn(this, list))}.`,
        );
      });
    },
  );

  Then(
    `the player {string} is not listed among ${said}`,
    async function (this: SpecWorld, name: string) {
      await eventually(this, async () => {
        assert.ok(!(await namesIn(this, list)).includes(name));
      });
    },
  );
}

Then(
  "the player {string} is not listed",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(
        ![
          ...(await namesIn(this, "playing")),
          ...(await namesIn(this, "withdrawn")),
        ].includes(name),
      );
    });
  },
);

const heading = (world: SpecWorld): Locator =>
  tabPanel(world).locator(".listed-archived-heading");

Then(
  "the withdrawn players are headed {string}",
  async function (this: SpecWorld, words: string) {
    await eventually(this, async () => {
      assert.equal((await heading(this).innerText()).trim(), words);
    });
  },
);

Then(
  "no heading for the withdrawn players is shown",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await namesIn(this, "playing")).length > 0);
      assert.equal(await heading(this).count(), 0);
    });
  },
);

Then(
  "the tab does not offer {string}",
  async function (this: SpecWorld, option: string) {
    await eventually(this, async () => {
      assert.equal(
        await tabPanel(this)
          .locator("section > p button")
          .filter({ hasText: exactly(option) })
          .count(),
        0,
      );
    });
  },
);

Then(
  "the tab says every player is in the competition",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(await tabPanel(this).locator(".listed-all").count(), 1);
    });
  },
);

// The drop-down of players to add ----------------------------------------------

const dropDown = (world: SpecWorld): Locator =>
  tabPanel(world).locator("select.listed-choice");

// The players it offers, without the choice of nobody it begins on.
const offered = async (world: SpecWorld): Promise<string[]> =>
  (await dropDown(world).locator('option:not([value=""])').allInnerTexts()).map(
    (name) => name.trim(),
  );

Given(
  "{string} is chosen to add",
  async function (this: SpecWorld, name: string) {
    await settled(this);
    await dropDown(this).selectOption({ label: name });
  },
);

When("nobody is chosen to add", async function (this: SpecWorld) {
  await settled(this);
  await dropDown(this).selectOption({ value: "" });
});

// What is said beneath the drop-down, by the codes it carries rather than the
// words, which are the reader's language's to choose.
const saidBeneath = (world: SpecWorld): Locator =>
  tabPanel(world).locator("#competition-players-refused");

Then(
  "the drop-down of players to add is refused with {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      const refused =
        (await saidBeneath(this).getAttribute("data-refused", {
          timeout: 500,
        })) ?? "";
      assert.ok(
        refused.split(" ").includes(code),
        `The drop-down is refused with ${refused || "nothing"}.`,
      );
    });
  },
);

// Its own words, in English, rather than the tab's words for any refusal,
// which a refusal whose words the admin was not sent would be said in.
Then(
  "the drop-down of players to add says the words for {string}",
  async function (this: SpecWorld, code: string) {
    const words = english.words[code];
    assert.ok(words !== undefined, `English has no words for ${code}.`);
    await eventually(this, async () => {
      assert.equal(
        unmarked(await saidBeneath(this).innerText({ timeout: 500 })).trim(),
        words,
      );
    });
  },
);

Then(
  "what is refused is read out with the drop-down of players to add",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const described = await dropDown(this).getAttribute("aria-describedby", {
        timeout: 500,
      });
      assert.equal(described, "competition-players-refused");
      assert.equal(await saidBeneath(this).count(), 1);
    });
  },
);

Then(
  "nothing is said beneath the drop-down of players to add",
  async function (this: SpecWorld) {
    await settled(this);
    await eventually(this, async () => {
      assert.equal(await saidBeneath(this).count(), 0);
      assert.equal(await dropDown(this).getAttribute("aria-describedby"), null);
    });
  },
);

Then(
  "the player {string} is offered to add",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok((await offered(this)).includes(name));
    });
  },
);

Then(
  "the player {string} is not offered to add",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(!(await offered(this)).includes(name));
    });
  },
);

Then(
  "the first player offered to add is {string}",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal((await offered(this))[0], name);
    });
  },
);

Then(
  "the first player offered to add is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const [first] = await offered(this);
      assert.ok(
        first !== undefined && isMarked(first),
        `The first offered is ${String(first)}.`,
      );
    });
  },
);

Then(
  "the drop-down of players to add is at least {int} pixels tall",
  async function (this: SpecWorld, pixels: number) {
    await eventually(this, async () => {
      const box = await dropDown(this).boundingBox();
      assert.ok(box !== null, "It is not laid out.");
      assert.ok(box.height >= pixels, `It is ${String(box.height)} tall.`);
    });
  },
);

// Asking before removing or withdrawing -----------------------------------------

// Whatever the button is called in the reader's language.
When(
  /^the way to (remove|withdraw) the player "([^"]*)" is pressed$/,
  async function (this: SpecWorld, action: string, name: string) {
    await settled(this);
    await tabPanel(this)
      .locator("ul[data-listed] > .listed-item")
      .filter({
        has: this.browserPage.locator(".listed-name", {
          hasText: exactly(name),
        }),
      })
      .locator(`button[data-action="${action}"]`)
      .click();
  },
);

const question = (world: SpecWorld): Locator =>
  world.browserPage.locator("dialog[open]");

Then("a modal dialog asks to confirm", async function (this: SpecWorld) {
  await question(this).waitFor();
});

Then(
  "the question names {string}",
  async function (this: SpecWorld, name: string) {
    await question(this).waitFor();
    const said = await question(this).locator(".dialog-content").innerText();
    assert.ok(said.includes(name), `It says ${JSON.stringify(said)}.`);
  },
);

// Confirmed by the button that does what it asks about, which comes first, and
// declined by Cancel, which comes last.
Given("the question is confirmed", async function (this: SpecWorld) {
  await question(this).waitFor();
  await question(this).locator(".dialog-buttons button").first().click();
  await settled(this);
});

When("the question is declined", async function (this: SpecWorld) {
  await question(this).waitFor();
  await question(this).locator(".dialog-buttons button").last().click();
  await settled(this);
});

// The player's name is filled into the question's words, inside their marks.
Then(
  "every word in the question but the player's name is in the test locale",
  async function (this: SpecWorld) {
    await question(this).waitFor();
    assert.deepEqual(await unmarkedWithin(this, "dialog[open]"), []);
  },
);
