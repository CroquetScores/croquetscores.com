// The steps the Managers and Scorers tabs share (managers-tab.feature,
// scorers-tab.feature), which are one tab for two parts a reader can have in a
// tournament. Each is said of the part it is about, "the scorer" or "the
// manager", and read from that tab's list.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { tournamentNamed } from "../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../support/world.js";
import { assertDrawnAsTrashCan } from "./icons.js";
import { unmarkedWithin } from "./marks.js";
import { eventually, openTab, tabPanel } from "./tournamentPage.js";

type Part = "managers" | "scorers";

// "scorer" and "scorers" alike name the part.
const partOf = (said: string): Part =>
  said.startsWith("manager") ? "managers" : "scorers";

const exactly = (words: string): RegExp =>
  new RegExp(`^${words.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`);

const rows = (world: SpecWorld, part: Part): Locator =>
  tabPanel(world).locator(`ul[data-listed="${part}"] > .listed-item`);

const rowOf = (world: SpecWorld, part: Part, name: string): Locator =>
  rows(world, part).filter({
    has: world.browserPage.locator(".listed-name", { hasText: exactly(name) }),
  });

const namesOf = async (world: SpecWorld, part: Part): Promise<string[]> =>
  (await rows(world, part).locator(".listed-name").allInnerTexts()).map(
    (name) => name.trim(),
  );

// By the name it is read out by, which for Remove is not what is shown: it is
// drawn as a trash can.
export const optionOf = (row: Locator, option: string): Locator =>
  row
    .locator(".listed-options")
    .getByRole("button", { name: option, exact: true });

When(
  /^the (scorers|managers) of "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, part: Part, name: string) {
    await openTab(this, name, part);
  },
);

Then(
  /^the (scorer|manager) "([^"]*)" is listed$/,
  async function (this: SpecWorld, part: string, name: string) {
    await eventually(this, async () => {
      assert.ok(
        (await namesOf(this, partOf(part))).includes(name),
        `The list is ${JSON.stringify(await namesOf(this, partOf(part)))}.`,
      );
    });
  },
);

Then(
  /^the (scorer|manager) "([^"]*)" is listed once$/,
  async function (this: SpecWorld, part: string, name: string) {
    await eventually(this, async () => {
      assert.equal(
        (await namesOf(this, partOf(part))).filter((each) => each === name)
          .length,
        1,
      );
    });
  },
);

Then(
  /^the (scorer|manager) "([^"]*)" is not listed$/,
  async function (this: SpecWorld, part: string, name: string) {
    await eventually(this, async () => {
      assert.ok(
        !(await namesOf(this, partOf(part))).includes(name),
        `The list is ${JSON.stringify(await namesOf(this, partOf(part)))}.`,
      );
    });
  },
);

Then(
  /^the first (scorer|manager) listed is "([^"]*)"$/,
  async function (this: SpecWorld, part: string, name: string) {
    await eventually(this, async () => {
      assert.equal((await namesOf(this, partOf(part)))[0], name);
    });
  },
);

Then(
  /^(\d+) (?:scorers?|managers?) (?:is|are) listed$/,
  async function (this: SpecWorld, count: string) {
    await eventually(this, async () => {
      assert.equal(
        await tabPanel(this).locator("ul[data-listed] > .listed-item").count(),
        Number(count),
      );
    });
  },
);

Then(
  /^Remove for the (scorer|manager) "([^"]*)" is a trash can$/,
  async function (this: SpecWorld, part: string, name: string) {
    await eventually(this, async () => {
      const remove = rowOf(this, partOf(part), name).locator(
        '.listed-options button[data-action="remove"]',
      );
      await assertDrawnAsTrashCan(remove);
    });
  },
);

Then(
  /^the (scorer|manager) "([^"]*)" offers "([^"]*)"$/,
  async function (this: SpecWorld, part: string, name: string, option: string) {
    await eventually(this, async () => {
      assert.equal(
        await optionOf(rowOf(this, partOf(part), name), option).count(),
        1,
      );
    });
  },
);

Then(
  /^the (scorer|manager) "([^"]*)" does not offer "([^"]*)"$/,
  async function (this: SpecWorld, part: string, name: string, option: string) {
    await eventually(this, async () => {
      const row = rowOf(this, partOf(part), name);
      assert.equal(await row.count(), 1);
      assert.equal(await optionOf(row, option).count(), 0);
    });
  },
);

When(
  /^"([^"]*)" is pressed on the (scorer|manager) "([^"]*)"$/,
  async function (this: SpecWorld, option: string, part: string, name: string) {
    const button = optionOf(rowOf(this, partOf(part), name), option);
    await eventually(this, async () => {
      assert.equal(await button.count(), 1);
    });
    await button.click();
  },
);

// By its place rather than its words, which are in whatever language the page
// is in.
const places = ["first", "second"];

When(
  /^(?:"Remove" is pressed on|the way to remove) the (first|second) (scorer|manager)(?: is pressed)?$/,
  async function (this: SpecWorld, place: string, part: string) {
    const row = rows(this, partOf(part)).nth(places.indexOf(place));
    await eventually(this, async () => {
      assert.equal(await row.locator(".listed-options button").count(), 1);
    });
    await row.locator(".listed-options button").click();
  },
);

Then(
  /^the tab says there are no (scorers|managers)$/,
  async function (this: SpecWorld, part: Part) {
    await eventually(this, async () => {
      assert.equal(await rows(this, part).count(), 0);
      assert.equal(await tabPanel(this).locator(".listed-none").count(), 1);
    });
  },
);

Then(
  /^the tab does not say there are no (scorers|managers)$/,
  async function (this: SpecWorld, part: Part) {
    await eventually(this, async () => {
      assert.ok((await rows(this, part).count()) > 0);
      assert.equal(await tabPanel(this).locator(".listed-none").count(), 0);
    });
  },
);

Then(
  /^"([^"]*)" is above the (scorers|managers)$/,
  async function (this: SpecWorld, label: string, part: Part) {
    await eventually(this, async () => {
      const field = await tabPanel(this)
        .locator("form.tab-form")
        .getByLabel(label, { exact: true })
        .boundingBox();
      const list = await tabPanel(this)
        .locator(`ul[data-listed="${part}"]`)
        .boundingBox();
      assert.ok(field !== null && list !== null, "One is not laid out.");
      assert.ok(field.y + field.height <= list.y, "The field is not above.");
    });
  },
);

const tallEnough = async (thing: Locator, pixels: number): Promise<void> => {
  const box = await thing.boundingBox();
  assert.ok(box !== null, "It is not laid out.");
  assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
};

Then(
  "the button {string} is at least {int} pixels tall",
  async function (this: SpecWorld, words: string, pixels: number) {
    await eventually(this, async () => {
      await tallEnough(
        tabPanel(this)
          .locator("button")
          .filter({ hasText: exactly(words) }),
        pixels,
      );
    });
  },
);

Then(
  /^"([^"]*)" on the (scorer|manager) "([^"]*)" is at least (\d+) pixels tall$/,
  async function (
    this: SpecWorld,
    option: string,
    part: string,
    name: string,
    pixels: string,
  ) {
    await eventually(this, async () => {
      await tallEnough(
        optionOf(rowOf(this, partOf(part), name), option),
        Number(pixels),
      );
    });
  },
);

// The tab's own field, found by its name rather than its label, which is in
// whatever language the page is in.
const addressField = (world: SpecWorld): Locator =>
  tabPanel(world).locator('form.tab-form input[name="emailAddress"]');

When(
  "{string} is typed into the tab's email address",
  async function (this: SpecWorld, words: string) {
    await addressField(this).fill(words);
  },
);

When("the tab's email address is sent", async function (this: SpecWorld) {
  await tabPanel(this).locator('form.tab-form button[type="submit"]').click();
});

Then(
  "something is said beneath the tab's email address",
  async function (this: SpecWorld) {
    await tabPanel(this).locator("form.tab-form .field-message").waitFor();
  },
);

// The tournament's list answered as an error of the site's is, with no code of
// its own. Once only, as the list is asked for once when the tab is opened.
Given(
  /^the (scorers|managers) of "([^"]*)" are answered with a server error$/,
  async function (this: SpecWorld, part: Part, name: string) {
    const tournament = tournamentNamed(this, name).value;
    const at = `/api/site/tournaments/${tournament.slice(tournament.indexOf("/") + 1)}/${part}`;
    await this.browserPage.route(
      (url) => url.pathname === at,
      async (route) => {
        if (route.request().method() !== "GET") return route.fallback();
        await route.fulfill({
          status: 500,
          contentType: "text/html",
          body: "Something went wrong.",
        });
      },
      { times: 1 },
    );
  },
);

Then(
  "the tab says it was refused with {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      assert.equal(
        await tabPanel(this)
          .locator(".people-refused")
          .getAttribute("data-refused", { timeout: 500 }),
        code,
      );
    });
  },
);

Then("the tab says nothing was refused", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await tabPanel(this).locator(".people-refused").count(), 0);
  });
});

// Somebody's name is theirs, and nobody's language. What the reader typed is
// in the field, and not among the tab's words.
Then(
  /^every word in the tab but the (?:scorers|managers)' names is in the test locale$/,
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "#tab-panel section", [
        ".listed-name",
      ]);
      assert.deepEqual(stray, [], "Words in the tab came from elsewhere.");
    });
  },
);
