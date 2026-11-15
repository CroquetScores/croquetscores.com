import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../../../support/world.js";
import {
  eventually,
  settled,
  tabPanel,
} from "../../../../../../../../../support/tournamentPage.js";

// The add players dialog (add-players.feature), open over a competition's
// Players tab. What opens a question, confirms it and declines it is shared
// with the tab's own questions (competition-players-tab.steps.ts); these are
// what this dialog adds.

const dialogOf = (world: SpecWorld): Locator =>
  world.browserPage.locator("dialog[open]");

const addSeveral = (world: SpecWorld): Locator =>
  tabPanel(world).locator('button[data-action="addSeveral"]');

// Whatever the button is called in the reader's language, by what it does.
When(
  "the way to add several players is pressed",
  async function (this: SpecWorld) {
    await settled(this);
    await addSeveral(this).click();
  },
);

Then(
  "the way to add several players is offered",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(await addSeveral(this).count(), 1);
    });
  },
);

Then(
  "the way to add several players is not offered",
  async function (this: SpecWorld) {
    await settled(this);
    await eventually(this, async () => {
      assert.equal(await addSeveral(this).count(), 0);
    });
  },
);

Then("the add players dialog is open", async function (this: SpecWorld) {
  await dialogOf(this).waitFor();
  assert.equal(await dialogOf(this).locator(".add-players-offered").count(), 1);
});

Then("the add players dialog is closed", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await dialogOf(this).count(), 0);
  });
});

Then(
  "the add players dialog is titled {string}",
  async function (this: SpecWorld, title: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      (await dialogOf(this).locator(".dialog-title").innerText()).trim(),
      title,
    );
  },
);

Then(
  "the add players dialog's first button is {string}",
  async function (this: SpecWorld, words: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      (
        await dialogOf(this)
          .locator(".dialog-buttons button")
          .first()
          .innerText()
      ).trim(),
      words,
    );
  },
);

const offered = async (world: SpecWorld): Promise<string[]> =>
  (
    await dialogOf(world).locator(".add-players-offered label").allInnerTexts()
  ).map((name) => name.trim());

Then(
  "the add players dialog offers {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    assert.ok((await offered(this)).includes(name));
  },
);

Then(
  "the add players dialog does not offer {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    assert.ok(!(await offered(this)).includes(name));
  },
);

Then(
  "the first player the add players dialog offers is {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    assert.equal((await offered(this))[0], name);
  },
);

const boxOf = (world: SpecWorld, name: string): Locator =>
  dialogOf(world)
    .locator(".add-players-offered label")
    .filter({ hasText: new RegExp(`^\\s*${name}\\s*$`) })
    .locator("input");

Given(
  "{string} is ticked in the add players dialog",
  async function (this: SpecWorld, name: string) {
    await boxOf(this, name).check();
  },
);

Given(
  "every player is ticked in the add players dialog",
  async function (this: SpecWorld) {
    await dialogOf(this).locator('input[data-select="all"]').check();
  },
);

Then(
  "{string} is still ticked in the add players dialog",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    assert.ok(await boxOf(this, name).isChecked(), `${name} is not ticked.`);
  },
);

// The first button, which does what the dialog is for, whatever it is called.
// Waited for until the site has answered, since the competition is read
// straight after and the answer is what says it has been entered.
const pressedAndAnswered = async (world: SpecWorld): Promise<void> => {
  const answered = world.browserPage.waitForResponse(
    (response) =>
      response.url().endsWith("/players/many") &&
      response.request().method() === "POST",
  );
  await dialogOf(world).locator(".dialog-buttons button").first().click();
  await answered;
  await settled(world);
};

When("Add Selected is pressed", async function (this: SpecWorld) {
  await pressedAndAnswered(this);
});

When("Add the Rest is pressed", async function (this: SpecWorld) {
  await pressedAndAnswered(this);
});

// Nothing is sent, so there is no answer to wait for.
When(
  "Add Selected is pressed with nobody ticked",
  async function (this: SpecWorld) {
    await dialogOf(this).locator(".dialog-buttons button").first().click();
    await settled(this);
  },
);

// The second dialog, which replaces the first.
Then(
  "the question of the players who cannot be added is open",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal(
        await dialogOf(this).locator(".add-players-not-entered").count(),
        1,
      );
    });
  },
);

const notEntered = (world: SpecWorld): Locator =>
  dialogOf(world).locator(".add-players-not-entered li");

Then(
  "the question does not name {string}",
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    const said = (await notEntered(this).allInnerTexts()).join(" ");
    assert.ok(!said.includes(name), `It says ${JSON.stringify(said)}.`);
  },
);

// By the code it carries rather than the words, which are the reader's
// language's to choose.
Then(
  "the question says {string} was refused with {string}",
  async function (this: SpecWorld, name: string, code: string) {
    await dialogOf(this).waitFor();
    const row = notEntered(this).filter({ hasText: name });
    assert.equal(await row.getAttribute("data-refused"), code);
  },
);

Then(
  "the add players dialog says above its list that it was refused with {string}",
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      const refused =
        (await dialogOf(this)
          .locator(".dialog-problems")
          .getAttribute("data-refused", { timeout: 500 })) ?? "";
      assert.ok(
        refused.split(" ").includes(code),
        `It says it was refused with ${refused || "nothing"}.`,
      );
    });
  },
);
