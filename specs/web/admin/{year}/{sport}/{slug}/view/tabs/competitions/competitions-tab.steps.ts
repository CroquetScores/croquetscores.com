import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import {
  eventually,
  openTab,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// The words exactly, rather than any row whose name holds them: "Block A" is
// in "Block AB".
const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const inList = (world: SpecWorld, list: "in-use" | "archived"): Locator =>
  tabPanel(world).locator(`ul[data-listed="${list}"] > .listed-item`);

const rowOf = (world: SpecWorld, name: string): Locator =>
  tabPanel(world)
    .locator("ul[data-listed] > .listed-item")
    .filter({
      has: world.browserPage.locator(".listed-name", {
        hasText: exactly(name),
      }),
    });

const namesIn = async (
  world: SpecWorld,
  list: "in-use" | "archived",
): Promise<string[]> =>
  (await inList(world, list).locator(".listed-name").allInnerTexts()).map(
    (name) => name.trim(),
  );

const allNames = async (world: SpecWorld): Promise<string[]> => [
  ...(await namesIn(world, "in-use")),
  ...(await namesIn(world, "archived")),
];

// A button or a link, whichever it is, by its words exactly.
const optionOf = (world: SpecWorld, name: string, option: string): Locator =>
  rowOf(world, name)
    .locator(".listed-options")
    .locator("button, a")
    .filter({ hasText: exactly(option) });

const openCompetitions = async function (
  this: SpecWorld,
  name: string,
): Promise<void> {
  await openTab(this, name, "competitions");
};

When("the competitions of {string} are open", openCompetitions);
When("the competitions of {string} are opened", openCompetitions);

When(
  "{string} is pressed on the competition {string}",
  async function (this: SpecWorld, option: string, name: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
    await optionOf(this, name, option).click();
  },
);

Then(
  "the competition {string} is listed",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(
        (await allNames(this)).includes(name),
        `The competitions are ${JSON.stringify(await allNames(this))}.`,
      );
    });
  },
);

Then(
  "the first competition listed is {string}",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal((await namesIn(this, "in-use"))[0], name);
    });
  },
);

Then(
  "the competition {string} is listed after {string}",
  async function (this: SpecWorld, later: string, earlier: string) {
    await eventually(this, async () => {
      const names = await allNames(this);
      assert.ok(
        names.indexOf(earlier) !== -1 &&
          names.indexOf(later) > names.indexOf(earlier),
        `The competitions are ${JSON.stringify(names)}.`,
      );
    });
  },
);

Then(
  "the competition {string} is listed among the archived",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok((await namesIn(this, "archived")).includes(name));
    });
  },
);

Then(
  "the competition {string} is not listed among the archived",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(!(await namesIn(this, "archived")).includes(name));
    });
  },
);

Then(
  "the competition {string} is not listed among those in use",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(!(await namesIn(this, "in-use")).includes(name));
    });
  },
);

Then(
  "the competition {string} is said to be a {string}",
  async function (this: SpecWorld, name: string, kind: string) {
    await eventually(this, async () => {
      assert.equal(
        (await rowOf(this, name).locator(".listed-about").innerText()).trim(),
        kind,
      );
    });
  },
);

Then(
  "the competition {string} offers {string}",
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
  },
);

Then(
  "the competition {string} does not offer {string}",
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await optionOf(this, name, option).count(), 0);
    });
  },
);

Then(
  "the archived competitions are headed {string}",
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
  "no heading for the archived competitions is shown",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal((await inList(this, "in-use").count()) > 0, true);
      assert.equal(
        await tabPanel(this).locator(".listed-archived-heading").count(),
        0,
      );
    });
  },
);

Then(
  "the tab says there are no competitions",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(await tabPanel(this).locator(".listed-none").count(), 1);
    });
  },
);

const leadsTo = async (link: Locator, path: string): Promise<void> => {
  assert.equal(await link.getAttribute("href"), path);
};

Then(
  "the name of the competition {string} leads to {string}",
  async function (this: SpecWorld, name: string, path: string) {
    await eventually(this, async () => {
      await leadsTo(rowOf(this, name).locator(".listed-name"), path);
    });
  },
);

Then(
  "{string} on the competition {string} leads to {string}",
  async function (this: SpecWorld, option: string, name: string, path: string) {
    await eventually(this, async () => {
      await leadsTo(optionOf(this, name, option), path);
    });
  },
);

const tallEnough = async (thing: Locator, pixels: number): Promise<void> => {
  const box = await thing.boundingBox();
  assert.ok(box !== null, "It is not laid out.");
  assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
};

Then(
  "the name of the competition {string} is at least {int} pixels tall",
  async function (this: SpecWorld, name: string, pixels: number) {
    await eventually(this, async () => {
      await tallEnough(rowOf(this, name).locator(".listed-name"), pixels);
    });
  },
);

Then(
  "{string} on the competition {string} is at least {int} pixels tall",
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

// A competition's name is what its manager called it, and nobody's language.
Then(
  "every word in the tab but the competitions' names is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "#tab-panel section", [
        ".listed-name",
      ]);
      assert.deepEqual(stray, [], "Words in the tab came from elsewhere.");
    });
  },
);
