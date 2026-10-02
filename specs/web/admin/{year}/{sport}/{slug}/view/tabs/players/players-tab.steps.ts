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

// A competition's Players tab lists its players as the tournament's does, as
// those playing and the withdrawn rather than those in use and the archived,
// so these steps read either.
type List = "in-use" | "archived";

const rows = (world: SpecWorld, list?: List): Locator =>
  tabPanel(world).locator(
    list === undefined
      ? "ul[data-listed] > .listed-item"
      : list === "in-use"
        ? 'ul[data-listed="in-use"] > .listed-item, ul[data-listed="playing"] > .listed-item'
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

// By the name it is read out by, which for Up and Down is not what is shown:
// they are drawn as arrows. A button or a link, whichever it is: a team's View
// is a link.
const optionOf = (world: SpecWorld, name: string, option: string): Locator => {
  const options = rowOf(world, name).locator(".listed-options");
  return options
    .getByRole("button", { name: option, exact: true })
    .or(options.getByRole("link", { name: option, exact: true }));
};

// A team's list is drawn as a player's is, its rows, options and archived
// alike, so each step that reads a player's row reads a team's too.
const WHO = "(?:player|team)";
const QUOTED = '"([^"]*)"';
const said = (pattern: string): RegExp =>
  new RegExp(`^${pattern.replaceAll("WHO", WHO).replaceAll("Q", QUOTED)}$`);

When(
  /^the players of "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, name: string) {
    await openTab(this, name, "players");
  },
);

// A name that can be pressed is a button where it opens a dialog, as a
// player's does, and a link where it leads to a page, as a team's does.
const pressableName = (world: SpecWorld, name: string): Locator =>
  rowOf(world, name).locator(":is(button, a).listed-name");

When(
  said("the name of the WHO Q is pressed"),
  async function (this: SpecWorld, name: string) {
    const button = pressableName(this, name);
    await eventually(this, async () => {
      assert.equal(await button.count(), 1);
    });
    await button.click();
  },
);

When(
  said("Q is pressed on the WHO Q"),
  async function (this: SpecWorld, option: string, name: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
    await optionOf(this, name, option).click();
  },
);

// Whatever the button is called in the reader's language, by what it does.
When(
  "the way to archive the player {string} is pressed",
  async function (this: SpecWorld, name: string) {
    const archive = rowOf(this, name).locator(
      '.listed-options button[data-action="archive"]',
    );
    await archive.waitFor();
    await archive.click();
  },
);

Then(
  said("the WHO Q is listed"),
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
  said("the first WHO listed is Q"),
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
  said("the WHO Q is listed after Q"),
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
  said("the WHO Q is listed among the archived"),
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok((await namesIn(this, "archived")).includes(name));
    });
  },
);

Then(
  said("the WHO Q is not listed among the archived"),
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
  said("the WHO Q offers Q"),
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
  },
);

// By the names they are read out by, as optionOf finds them, since Up and
// Down are drawn as arrows and say nothing as text.
Then(
  said("Q on the WHO Q comes before Q"),
  async function (
    this: SpecWorld,
    option: string,
    name: string,
    after: string,
  ) {
    await eventually(this, async () => {
      // Buttons and links alike, a team's View being a link, and none of the
      // room kept where an option is not offered.
      const buttons = await rowOf(this, name)
        .locator(".listed-options > :is(button, a)")
        .all();
      const offered = await Promise.all(
        buttons.map(
          async (button) =>
            (await button.getAttribute("aria-label")) ??
            (await button.innerText()).trim(),
        ),
      );
      const first = offered.indexOf(option);
      const second = offered.indexOf(after);
      assert.ok(
        first !== -1 && second !== -1 && first < second,
        `The player ${name} offers ${JSON.stringify(offered)}.`,
      );
    });
  },
);

// By the name it is read out by, as optionOf finds an option, and none of the
// room kept where one is not offered.
Then(
  said("the first thing the WHO Q offers is Q"),
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      const first = rowOf(this, name)
        .locator(".listed-options > :is(button, a)")
        .first();
      const offered =
        (await first.getAttribute("aria-label")) ??
        (await first.innerText()).trim();
      assert.equal(offered, option);
    });
  },
);

Then(
  said("the WHO Q does not offer Q"),
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

// Drawn in brackets beside the name, where a player's would say what they
// represent.
Then(
  "the team {string} is shown known for short as {string}",
  async function (this: SpecWorld, name: string, shortName: string) {
    await eventually(this, async () => {
      assert.equal(await representingOf(this, name), shortName);
    });
  },
);

const flagOf = (world: SpecWorld, name: string): Locator =>
  rowOf(world, name).locator("img.listed-flag");

Then(
  said("the WHO Q is shown flying the flag Q"),
  async function (this: SpecWorld, name: string, flag: string) {
    await eventually(this, async () => {
      assert.equal(await flagOf(this, name).getAttribute("data-flag"), flag);
    });
  },
);

Then(
  said("the WHO Q is shown flying no flag"),
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await flagOf(this, name).count(), 0);
    });
  },
);

Then(
  said("the flag of the WHO Q is named Q"),
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
  said("the WHO Q is struck through"),
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

// Where a link a row offers goes: a team's View, to its page.
Then(
  "{string} on the team {string} leads to {string}",
  async function (this: SpecWorld, option: string, name: string, path: string) {
    await eventually(this, async () => {
      assert.equal(
        await optionOf(this, name, option).getAttribute("href"),
        path,
      );
    });
  },
);

Then(
  "the name of the team {string} leads to {string}",
  async function (this: SpecWorld, name: string, path: string) {
    await eventually(this, async () => {
      assert.equal(
        await rowOf(this, name).locator("a.listed-name").getAttribute("href"),
        path,
      );
    });
  },
);

// Where the reader is put back once a dialog opened from a row closes: a
// team's Edit, or a competition's player's Carry Forward.
Then(
  said("Q on the WHO Q has the focus"),
  async function (this: SpecWorld, option: string, name: string) {
    await eventually(this, async () => {
      assert.equal(
        await optionOf(this, name, option).evaluate(
          (element) =>
            element ===
            (globalThis as unknown as { document: { activeElement: unknown } })
              .document.activeElement,
          undefined,
          { timeout: 500 },
        ),
        true,
        `${option} on ${name} does not have the focus.`,
      );
    });
  },
);

// In words beside the name, for a reader who is not looking, since a line
// through a name is not read out.
Then(
  said("the WHO Q is announced as archived"),
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
  said("the name of the WHO Q cannot be pressed"),
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await pressableName(this, name).count(), 0);
    });
  },
);

Then(
  /^the archived (?:players|teams) are headed "([^"]*)"$/,
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
  /^no heading for the archived (?:players|teams) is shown$/,
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

// The tab's own list, or a team's page's, which is its players.
Then(
  /^the (?:tab|page) says there are no (?:players|teams)$/,
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(await rows(this).count(), 0);
      assert.equal(await tabPanel(this).locator(".listed-none").count(), 1);
    });
  },
);

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

// Above whichever the tab lists: its players, its teams, its competitions or
// its tests.
Then(
  /^"([^"]*)" is above the (?:players|teams|competitions|tests)$/,
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
  said("Q on the WHO Q is at least (\\d+) pixels tall"),
  async function (
    this: SpecWorld,
    option: string,
    name: string,
    pixels: string,
  ) {
    await eventually(this, async () => {
      await tallEnough(optionOf(this, name, option), Number(pixels));
    });
  },
);

// A player's name and what they represent are what the manager typed, and
// nobody's language. A flag's name is a word of the reader's, and is looked at
// by its own step.
Then(
  /^every word in the tab but the (?:players|teams)' own is in the test locale$/,
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "#tab-panel section", [
        ".listed-name",
        ".listed-about",
        // A competition's drop-down of players to add, by name.
        'select.listed-choice option:not([value=""])',
      ]);
      assert.deepEqual(stray, [], "Words in the tab came from elsewhere.");
    });
  },
);

// The dialog open over the page, by its title.
Then(
  /^the (?:player|score|competition|team|team player|test|carry forward) dialog is titled "([^"]*)"$/,
  async function (this: SpecWorld, title: string) {
    const dialog = this.browserPage.locator("dialog[open]");
    await dialog.waitFor();
    assert.equal(
      (await dialog.locator(".dialog-title").innerText()).trim(),
      title,
    );
  },
);

// A row by its place in the list, since a knockout's byes are all called Bye.
const PLACES = ["first", "second", "third", "fourth"];
const PLACE = "(first|second|third|fourth)";

const rowAt = (world: SpecWorld, place: string): Locator =>
  rows(world).nth(PLACES.indexOf(place));

const optionAt = (world: SpecWorld, place: string, option: string): Locator =>
  rowAt(world, place)
    .locator(".listed-options")
    .getByRole("button", { name: option, exact: true });

// The first has a step of its own, which reads only those in use.
Then(
  /^the (second|third|fourth) player listed is "([^"]*)"$/,
  async function (this: SpecWorld, place: string, name: string) {
    await eventually(this, async () => {
      assert.equal(
        (await namesIn(this))[PLACES.indexOf(place)],
        name,
        `The players are ${JSON.stringify(await namesIn(this))}.`,
      );
    });
  },
);

Then(
  new RegExp(`^the ${PLACE} player listed offers "([^"]*)"$`),
  async function (this: SpecWorld, place: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await optionAt(this, place, option).count(), 1);
    });
  },
);

Then(
  new RegExp(`^the ${PLACE} player listed does not offer "([^"]*)"$`),
  async function (this: SpecWorld, place: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await rowAt(this, place).count(), 1);
      assert.equal(await optionAt(this, place, option).count(), 0);
    });
  },
);

When(
  new RegExp(`^"([^"]*)" is pressed on the ${PLACE} player listed$`),
  async function (this: SpecWorld, option: string, place: string) {
    await eventually(this, async () => {
      assert.equal(await optionAt(this, place, option).count(), 1);
    });
    await optionAt(this, place, option).click();
  },
);

Then(
  "the first player listed is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const [first] = await namesIn(this);
      assert.ok(
        first !== undefined && isMarked(first),
        `The first player is ${String(first)}.`,
      );
    });
  },
);
