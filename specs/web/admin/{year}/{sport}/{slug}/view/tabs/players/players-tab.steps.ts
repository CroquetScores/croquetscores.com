import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../support/world.js";
import {
  isMarked,
  unmarkedWithin,
} from "../../../../../../../support/marks.js";
import {
  eventually,
  openTab,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// The words exactly, rather than any row whose name holds them: "Sam" is in
// "Sam Someone".
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

type List = "in-use" | "archived";

const rows = (world: SpecWorld, list?: List): Locator =>
  tabPanel(world).locator(
    list === undefined
      ? "ul[data-listed] > .listed-item"
      : `ul[data-listed="${list}"] > .listed-item`,
  );

const rowOf = (world: SpecWorld, name: string): Locator =>
  rows(world).filter({
    has: world.browserPage.locator(".listed-name", { hasText: exactly(name) }),
  });

const namesIn = async (world: SpecWorld, list?: List): Promise<string[]> =>
  (await rows(world, list).locator(".listed-name").allInnerTexts()).map(
    (name) => name.trim(),
  );

const optionOf = (world: SpecWorld, name: string, option: string): Locator =>
  rowOf(world, name)
    .locator(".listed-options button")
    .filter({ hasText: exactly(option) });

When(
  /^the players of "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, name: string) {
    await openTab(this, name, "players");
  },
);

When(
  "the name of the player {string} is pressed",
  async function (this: SpecWorld, name: string) {
    const button = rowOf(this, name).locator("button.listed-name");
    await eventually(this, async () => {
      assert.equal(await button.count(), 1);
    });
    await button.click();
  },
);

When(
  "{string} is pressed on the player {string}",
  async function (this: SpecWorld, option: string, name: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
    await optionOf(this, name, option).click();
  },
);

Then(
  "the player {string} is listed",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(
        (await namesIn(this)).includes(name),
        `The players are ${JSON.stringify(await namesIn(this))}.`,
      );
    });
  },
);

Then(
  "the first player listed is {string}",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(
        (await namesIn(this, "in-use"))[0],
        name,
        `The players are ${JSON.stringify(await namesIn(this))}.`,
      );
    });
  },
);

const assertOrder = async (
  world: SpecWorld,
  earlier: string,
  later: string,
): Promise<void> => {
  const names = await namesIn(world);
  assert.ok(
    names.indexOf(earlier) !== -1 &&
      names.indexOf(later) > names.indexOf(earlier),
    `The players are ${JSON.stringify(names)}.`,
  );
};

Then(
  "the player {string} is listed after {string}",
  async function (this: SpecWorld, later: string, earlier: string) {
    await eventually(this, async () => {
      await assertOrder(this, earlier, later);
    });
  },
);

Then(
  "the player {string} is listed before {string}",
  async function (this: SpecWorld, earlier: string, later: string) {
    await eventually(this, async () => {
      await assertOrder(this, earlier, later);
    });
  },
);

Then(
  "the player {string} is listed among the archived",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok((await namesIn(this, "archived")).includes(name));
    });
  },
);

Then(
  "the player {string} is not listed among the archived",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(!(await namesIn(this, "archived")).includes(name));
    });
  },
);

Then(
  "the player {string} is not listed among those in use",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(!(await namesIn(this, "in-use")).includes(name));
    });
  },
);

Then(
  "the player {string} offers {string}",
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
  },
);

Then(
  "the player {string} does not offer {string}",
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await optionOf(this, name, option).count(), 0);
    });
  },
);

const representingOf = async (
  world: SpecWorld,
  name: string,
): Promise<string> =>
  (await rowOf(world, name).locator(".listed-about").innerText()).trim();

Then(
  "the player {string} is shown representing {string}",
  async function (this: SpecWorld, name: string, representing: string) {
    await eventually(this, async () => {
      assert.equal(await representingOf(this, name), representing);
    });
  },
);

Then(
  "the player {string} is shown representing nothing",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await representingOf(this, name), "");
    });
  },
);

const flagOf = (world: SpecWorld, name: string): Locator =>
  rowOf(world, name).locator("img.listed-flag");

Then(
  "the player {string} is shown flying the flag {string}",
  async function (this: SpecWorld, name: string, flag: string) {
    await eventually(this, async () => {
      assert.equal(await flagOf(this, name).getAttribute("data-flag"), flag);
    });
  },
);

Then(
  "the player {string} is shown flying no flag",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await flagOf(this, name).count(), 0);
    });
  },
);

Then(
  "the flag of the player {string} is named {string}",
  async function (this: SpecWorld, name: string, called: string) {
    await eventually(this, async () => {
      assert.equal(await flagOf(this, name).getAttribute("alt"), called);
    });
  },
);

Then(
  "the flag of the player {string} is named in the test locale",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      const called = (await flagOf(this, name).getAttribute("alt")) ?? "";
      assert.ok(isMarked(called), `The flag is named ${called}.`);
    });
  },
);

const struckThrough = async (
  world: SpecWorld,
  name: string,
): Promise<boolean> =>
  (
    await rowOf(world, name)
      .locator(".listed-name")
      .evaluate(
        (element) =>
          (
            globalThis as unknown as {
              getComputedStyle(of: unknown): { textDecorationLine: string };
            }
          ).getComputedStyle(element).textDecorationLine,
      )
  ).includes("line-through");

Then(
  "the player {string} is struck through",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await struckThrough(this, name), true);
    });
  },
);

Then(
  "the player {string} is not struck through",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await struckThrough(this, name), false);
    });
  },
);

// In words beside the name, for a reader who is not looking, since a line
// through a name is not read out.
Then(
  "the player {string} is announced as archived",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(
        await rowOf(this, name).locator(".visually-hidden").count(),
        1,
      );
    });
  },
);

Then(
  "the name of the player {string} cannot be pressed",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(
        await rowOf(this, name).locator("button.listed-name").count(),
        0,
      );
    });
  },
);

Then(
  "the archived players are headed {string}",
  async function (this: SpecWorld, heading: string) {
    await eventually(this, async () => {
      assert.equal(
        (
          await tabPanel(this).locator(".listed-archived-heading").innerText()
        ).trim(),
        heading,
      );
    });
  },
);

Then(
  "no heading for the archived players is shown",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await rows(this).count()) > 0);
      assert.equal(
        await tabPanel(this).locator(".listed-archived-heading").count(),
        0,
      );
    });
  },
);

Then("the tab says there are no players", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await rows(this).count(), 0);
    assert.equal(await tabPanel(this).locator(".listed-none").count(), 1);
  });
});

Then(
  "the tab does not say there are no players",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await rows(this).count()) > 0);
      assert.equal(await tabPanel(this).locator(".listed-none").count(), 0);
    });
  },
);

// What the tab offers above its list, rather than what any one player offers.
const tabOffers = (world: SpecWorld, option: string): Locator =>
  tabPanel(world)
    .locator("section > p button")
    .filter({ hasText: exactly(option) });

Then(
  "the tab offers {string}",
  async function (this: SpecWorld, option: string) {
    await eventually(this, async () => {
      assert.equal(await tabOffers(this, option).count(), 1);
    });
  },
);

Then(
  "{string} is above the players",
  async function (this: SpecWorld, option: string) {
    await eventually(this, async () => {
      const offer = await tabOffers(this, option).boundingBox();
      const list = await tabPanel(this)
        .locator("ul[data-listed]")
        .first()
        .boundingBox();
      assert.ok(offer !== null && list !== null, "One is not laid out.");
      assert.ok(offer.y + offer.height <= list.y, `${option} is not above.`);
    });
  },
);

const tallEnough = async (thing: Locator, pixels: number): Promise<void> => {
  const box = await thing.boundingBox();
  assert.ok(box !== null, "It is not laid out.");
  assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
};

Then(
  "the name of the player {string} is at least {int} pixels tall",
  async function (this: SpecWorld, name: string, pixels: number) {
    await eventually(this, async () => {
      await tallEnough(rowOf(this, name).locator(".listed-name"), pixels);
    });
  },
);

Then(
  "{string} on the player {string} is at least {int} pixels tall",
  async function (
    this: SpecWorld,
    option: string,
    name: string,
    pixels: number,
  ) {
    await eventually(this, async () => {
      await tallEnough(optionOf(this, name, option), pixels);
    });
  },
);

// A player's name and what they represent are what the manager typed, and
// nobody's language. A flag's name is a word of the reader's, and is looked at
// by its own step.
Then(
  "every word in the tab but the players' own is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "#tab-panel section", [
        ".listed-name",
        ".listed-about",
      ]);
      assert.deepEqual(stray, [], "Words in the tab came from elsewhere.");
    });
  },
);

// The dialog open over the page, by its title.
Then(
  "the player dialog is titled {string}",
  async function (this: SpecWorld, title: string) {
    const dialog = this.browserPage.locator("dialog[open]");
    await dialog.waitFor();
    assert.equal(
      (await dialog.locator(".dialog-title").innerText()).trim(),
      title,
    );
  },
);
