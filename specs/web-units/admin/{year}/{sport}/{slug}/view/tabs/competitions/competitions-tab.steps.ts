import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import {
  eventually,
  openTab,
  settled,
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

// A button or a link, whichever it is, by the name it is read out by exactly,
// which for Up and Down is not what is shown: they are drawn as arrows.
const optionOf = (world: SpecWorld, name: string, option: string): Locator => {
  const options = rowOf(world, name).locator(".listed-options");
  return options
    .getByRole("button", { name: option, exact: true })
    .or(options.getByRole("link", { name: option, exact: true }));
};

// A tournament played by teams lists its tests as a Standard one lists its
// competitions, a test being one of its competitions, so each step that reads
// a competition's row reads a test's too.
const WHAT = "(?:competition|test)";
const QUOTED = '"([^"]*)"';
const said = (pattern: string): RegExp =>
  new RegExp(`^${pattern.replaceAll("WHAT", WHAT).replaceAll("Q", QUOTED)}$`);

const openCompetitions = async function (
  this: SpecWorld,
  name: string,
): Promise<void> {
  await openTab(this, name, "competitions");
};

When("the competitions of {string} are open", openCompetitions);
When("the competitions of {string} are opened", openCompetitions);

When(
  said("Q is pressed on the WHAT Q"),
  async function (this: SpecWorld, option: string, name: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
    await optionOf(this, name, option).click();
  },
);

Then(
  said("the WHAT Q is listed"),
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
  said("the first WHAT listed is Q"),
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.equal((await namesIn(this, "in-use"))[0], name);
    });
  },
);

Then(
  said("the WHAT Q is listed after Q"),
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

// Neither among those in use nor among the archived.
Then(
  said("the WHAT Q is not listed"),
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(
        !(await allNames(this)).includes(name),
        `The competitions are ${JSON.stringify(await allNames(this))}.`,
      );
    });
  },
);

Then(
  said("the WHAT Q is listed among the archived"),
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok((await namesIn(this, "archived")).includes(name));
    });
  },
);

Then(
  said("the WHAT Q is not listed among the archived"),
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
  said("the WHAT Q offers Q"),
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await optionOf(this, name, option).count(), 1);
    });
  },
);

Then(
  said("the WHAT Q does not offer Q"),
  async function (this: SpecWorld, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(await rowOf(this, name).count(), 1);
      assert.equal(await optionOf(this, name, option).count(), 0);
    });
  },
);

// Struck through so that one archived is not taken for one in use.
Then(
  said("the WHAT Q is struck through"),
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      const line = await rowOf(this, name)
        .locator(".listed-name")
        .evaluate(
          (element) =>
            (
              globalThis as unknown as {
                getComputedStyle(of: unknown): { textDecorationLine: string };
              }
            ).getComputedStyle(element).textDecorationLine,
        );
      assert.ok(line.includes("line-through"), `It is drawn ${line}.`);
    });
  },
);

Then(
  said("the archived WHATs are headed Q"),
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
  /^the tab says there are no (?:competitions|tests|notes)$/,
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(await tabPanel(this).locator(".listed-none").count(), 1);
    });
  },
);

Then(
  "the tab does not say there are no competitions",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await allNames(this)).length > 0);
      assert.equal(await tabPanel(this).locator(".listed-none").count(), 0);
    });
  },
);

const leadsTo = async (link: Locator, path: string): Promise<void> => {
  assert.equal(await link.getAttribute("href"), path);
};

// In the order the row offers them, read by the name each is given: its words
// or, where it is drawn as a picture, its label.
Then(
  said("Q on the WHAT Q comes before Q"),
  async function (
    this: SpecWorld,
    option: string,
    name: string,
    after: string,
  ) {
    await eventually(this, async () => {
      const shown: string[] = [];
      for (const each of await rowOf(this, name)
        .locator(".listed-options > *")
        .all()) {
        shown.push(
          (await each.getAttribute("aria-label")) ??
            ((await each.textContent()) ?? "").trim(),
        );
      }
      const first = shown.indexOf(option);
      const second = shown.indexOf(after);
      assert.ok(
        first !== -1 && second !== -1 && first < second,
        `The competition ${name} offers ${JSON.stringify(shown)}.`,
      );
    });
  },
);

Then(
  said("Q on the WHAT Q has the focus"),
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

Then(
  said("the name of the WHAT Q leads to Q"),
  async function (this: SpecWorld, name: string, path: string) {
    await eventually(this, async () => {
      await leadsTo(rowOf(this, name).locator(".listed-name"), path);
    });
  },
);

When(
  "the name of the competition {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await settled(this);
    await rowOf(this, name).locator(".listed-name").click();
  },
);

Then(
  said("Q on the WHAT Q leads to Q"),
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
  said("Q on the WHAT Q is at least (\\d+) pixels tall"),
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

Then(
  "the competitions tab says it was refused with {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      assert.equal(
        await tabPanel(this)
          .locator(".dialog-problems")
          .getAttribute("data-refused", { timeout: 500 }),
        code,
      );
    });
  },
);
