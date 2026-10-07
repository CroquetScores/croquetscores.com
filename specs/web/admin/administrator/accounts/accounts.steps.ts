// The accounts page (accounts.feature), in a real browser. Each step names the
// section it is about by its heading, since the two sections are laid out
// the same way and a field or a button alone could be either's.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";
import { unmarkedWithin } from "../../../support/marks.js";

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

// What a step asks of the page itself, which the specs are not compiled to
// know of.
interface InThePage {
  readonly document: { readonly activeElement: unknown };
  getComputedStyle(element: unknown): {
    readonly backgroundColor: string;
    readonly color: string;
  };
}

const sections = (world: SpecWorld): Locator =>
  world.browserPage.locator("section.role-section");

const sectionCalled = (world: SpecWorld, heading: string): Locator =>
  sections(world).filter({
    has: world.browserPage.locator(".role-heading", {
      hasText: exactly(heading),
    }),
  });

// Once both sections say their lists are the answer to what was last asked:
// until then each is busy, and what it shows is what it showed before. Then
// retried for three seconds, which leaves a step time to fail with what it
// found rather than with Cucumber's word that it took too long.
const eventually = async (
  world: SpecWorld,
  check: () => Promise<void>,
): Promise<void> => {
  await world.browserPage
    .locator('section.role-section[aria-busy="false"]')
    .nth(1)
    .waitFor();
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

const openTheAccounts = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}/admin/administrator/accounts`);
};

Given("the accounts page is open", openTheAccounts);
When("the accounts page is opened", openTheAccounts);

const headings = async (world: SpecWorld): Promise<string[]> =>
  (await sections(world).locator(".role-heading").allInnerTexts()).map(
    (heading) => heading.trim(),
  );

Then(
  "the section {string} is on the page",
  async function (this: SpecWorld, heading: string) {
    await eventually(this, async () => {
      assert.ok(
        (await headings(this)).includes(heading),
        `The sections are ${JSON.stringify(await headings(this))}.`,
      );
    });
  },
);

Then(
  "the first section on the page is {string}",
  async function (this: SpecWorld, heading: string) {
    await eventually(this, async () => {
      assert.equal((await headings(this))[0], heading);
    });
  },
);

// The colours the section bar is drawn in, read from the page's own
// stylesheet rather than written here, so that the step holds whichever
// theme the page is in.
Then(
  "the heading of {string} is on the section bar's colour",
  async function (this: SpecWorld, heading: string) {
    await eventually(this, async () => {
      const colours = (locator: Locator): Promise<string[]> =>
        locator.evaluate((element) => {
          const style = (globalThis as unknown as InThePage).getComputedStyle(
            element,
          );
          return [style.backgroundColor, style.color];
        });
      assert.deepEqual(
        await colours(sectionCalled(this, heading).locator(".role-heading")),
        await colours(this.browserPage.locator("nav.site-sections")),
      );
    });
  },
);

const rows = (world: SpecWorld, heading: string): Locator =>
  sectionCalled(world, heading).locator("ul.listed > .listed-item");

const namesIn = async (world: SpecWorld, heading: string): Promise<string[]> =>
  (await rows(world, heading).locator(".listed-name").allInnerTexts()).map(
    (name) => name.trim(),
  );

const rowOf = (world: SpecWorld, heading: string, name: string): Locator =>
  rows(world, heading).filter({
    has: world.browserPage.locator(".listed-name", { hasText: exactly(name) }),
  });

const optionOf = (row: Locator, option: string): Locator =>
  row.locator(".listed-options button").filter({ hasText: exactly(option) });

Then(
  "{string} is listed in {string}",
  async function (this: SpecWorld, name: string, heading: string) {
    await eventually(this, async () => {
      const names = await namesIn(this, heading);
      assert.ok(names.includes(name), `Listed ${JSON.stringify(names)}.`);
    });
  },
);

Then(
  "{string} is not listed in {string}",
  async function (this: SpecWorld, name: string, heading: string) {
    await eventually(this, async () => {
      const names = await namesIn(this, heading);
      assert.ok(!names.includes(name), `Listed ${JSON.stringify(names)}.`);
    });
  },
);

Then(
  "{string} is listed once in {string}",
  async function (this: SpecWorld, name: string, heading: string) {
    await eventually(this, async () => {
      const names = await namesIn(this, heading);
      assert.equal(names.filter((each) => each === name).length, 1);
    });
  },
);

Then(
  "the first listed in {string} is {string}",
  async function (this: SpecWorld, heading: string, name: string) {
    await eventually(this, async () => {
      assert.equal((await namesIn(this, heading))[0], name);
    });
  },
);

Then(
  "{string} in {string} offers {string}",
  async function (
    this: SpecWorld,
    name: string,
    heading: string,
    option: string,
  ) {
    await eventually(this, async () => {
      assert.equal(
        await optionOf(rowOf(this, heading, name), option).count(),
        1,
      );
    });
  },
);

When(
  "{string} is pressed on {string} in {string}",
  async function (
    this: SpecWorld,
    option: string,
    name: string,
    heading: string,
  ) {
    const button = optionOf(rowOf(this, heading, name), option);
    await eventually(this, async () => {
      assert.equal(await button.count(), 1);
    });
    await button.click();
  },
);

// By its place rather than its words, which are in whatever language the page
// is in.
When(
  "the way to remove the first world ranking officer is pressed",
  async function (this: SpecWorld) {
    const row = this.browserPage
      .locator(
        'section[data-role="world-ranking-officer"] ul.listed > .listed-item',
      )
      .first();
    await eventually(this, async () => {
      assert.equal(await row.locator(".listed-options button").count(), 1);
    });
    await row.locator(".listed-options button").click();
  },
);

const fieldIn = (world: SpecWorld, label: string, heading: string): Locator =>
  sectionCalled(world, heading).getByLabel(label, { exact: true });

Then(
  "{string} asks for {string}",
  async function (this: SpecWorld, heading: string, label: string) {
    await eventually(this, async () => {
      assert.equal(await fieldIn(this, label, heading).count(), 1);
    });
  },
);

When(
  "{string} is typed as the {string} in {string}",
  async function (
    this: SpecWorld,
    words: string,
    label: string,
    heading: string,
  ) {
    await eventually(this, async () => {
      assert.equal(await fieldIn(this, label, heading).count(), 1);
    });
    await fieldIn(this, label, heading).fill(words);
  },
);

When(
  "{string} is pressed in {string}",
  async function (this: SpecWorld, words: string, heading: string) {
    await sectionCalled(this, heading)
      .locator("form button")
      .filter({ hasText: exactly(words) })
      .click();
  },
);

Then(
  "{string} in {string} is empty",
  async function (this: SpecWorld, label: string, heading: string) {
    await eventually(this, async () => {
      assert.equal(await fieldIn(this, label, heading).inputValue(), "");
    });
  },
);

Then(
  "{string} in {string} says {string}",
  async function (
    this: SpecWorld,
    label: string,
    heading: string,
    words: string,
  ) {
    await eventually(this, async () => {
      assert.equal(await fieldIn(this, label, heading).inputValue(), words);
    });
  },
);

Then(
  "{string} in {string} has the focus",
  async function (this: SpecWorld, label: string, heading: string) {
    await eventually(this, async () => {
      assert.equal(
        await fieldIn(this, label, heading).evaluate(
          (element) =>
            element ===
            (globalThis as unknown as InThePage).document.activeElement,
        ),
        true,
      );
    });
  },
);

// Read by its code, which is the contract, from what is said beneath the
// field, which is tied to it so that it is read out with it.
Then(
  "{string} in {string} is refused with {string}",
  async function (
    this: SpecWorld,
    label: string,
    heading: string,
    code: string,
  ) {
    await eventually(this, async () => {
      const message = sectionCalled(this, heading).locator(".field-message");
      assert.equal(
        await message.count(),
        1,
        `Nothing is said beneath ${label}.`,
      );
      assert.equal(await message.getAttribute("data-refused"), code);
      const id = await message.getAttribute("id");
      const described = await fieldIn(this, label, heading).getAttribute(
        "aria-describedby",
      );
      assert.ok(
        id !== null && (described ?? "").split(" ").includes(id),
        `What is said is not tied to ${label}.`,
      );
    });
  },
);

// Said in the section rather than beneath its field, since it is about the
// section as a whole: read by its code, which is the contract.
Then(
  "the section {string} says it was refused with {string}",
  async function (this: SpecWorld, heading: string, code: string) {
    await eventually(this, async () => {
      assert.equal(
        await sectionCalled(this, heading)
          .locator(".role-refused")
          .getAttribute("data-refused", { timeout: 500 }),
        code,
      );
    });
  },
);

Then(
  "nothing is said beneath {string} in {string}",
  async function (this: SpecWorld, label: string, heading: string) {
    await eventually(this, async () => {
      assert.equal(
        await fieldIn(this, label, heading).getAttribute("aria-describedby"),
        null,
        `Something is said beneath ${label}.`,
      );
    });
  },
);

// An account's name is theirs, and nobody's language. Read once the lists
// have come, so that the words of an empty list are not all that is read.
Then(
  "every word in the admin's content but the accounts' names is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok(
        (await this.browserPage.locator("ul.listed > .listed-item").count()) >
          0,
        "Nobody is listed yet.",
      );
    });
    const stray = await unmarkedWithin(this, "main", [".listed-name"]);
    assert.deepEqual(stray, [], "Words on the page came from elsewhere.");
  },
);

const tallEnough = async (thing: Locator, pixels: number): Promise<void> => {
  const box = await thing.boundingBox();
  assert.ok(box !== null, "It is not laid out.");
  assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
};

Then(
  "{string} in {string} is at least {int} pixels tall",
  async function (
    this: SpecWorld,
    words: string,
    heading: string,
    pixels: number,
  ) {
    await eventually(this, async () => {
      await tallEnough(
        sectionCalled(this, heading)
          .locator("form button")
          .filter({ hasText: exactly(words) }),
        pixels,
      );
    });
  },
);

Then(
  "{string} on {string} in {string} is at least {int} pixels tall",
  async function (
    this: SpecWorld,
    option: string,
    name: string,
    heading: string,
    pixels: number,
  ) {
    await eventually(this, async () => {
      await tallEnough(optionOf(rowOf(this, heading, name), option), pixels);
    });
  },
);
