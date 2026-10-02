import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { english } from "../../../../../../../../../src/web/languages/english.js";
import type { TournamentPlayer } from "../../../../../../../../../src/domain/aggregates/tournaments/TournamentPlayer.js";
import {
  load,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import {
  eventually,
  tabPanel,
} from "../../../../../../../support/tournamentPage.js";

// The player dialog (player.feature), open over a tournament's page. What
// finds a field, presses a button and reads a modal dialog is shared with the
// admin's other forms and dialogs; these are what the player dialog adds.

const open = "dialog[open]";

const dialogOf = (world: SpecWorld): Locator => world.browserPage.locator(open);

// Opened ------------------------------------------------------------------------

Then(
  /^the (?:player|score|competition|team player|team|test) dialog is open$/,
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
  },
);

// A <dialog> shown by showModal() is modal: the browser says so to a screen
// reader, and makes everything outside it unreachable.
Then(
  /^the (?:player|score|competition|team player|team|test) dialog is announced as a modal dialog$/,
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    assert.equal(
      await dialogOf(this).evaluate(
        (element: { matches(selector: string): boolean }) =>
          element.matches(":modal"),
      ),
      true,
    );
  },
);

Then(
  /^the (?:player|score|competition|team player|team|test) dialog is named "([^"]*)"$/,
  async function (this: SpecWorld, name: string) {
    await dialogOf(this).waitFor();
    const labelledBy = await dialogOf(this).getAttribute("aria-labelledby");
    assert.ok(labelledBy !== null, "The dialog is named by nothing.");
    assert.equal(
      (await this.browserPage.locator(`#${labelledBy}`).innerText()).trim(),
      name,
    );
  },
);

Then(
  /^the (?:player|score|competition|team player|team|test) dialog asks for "([^"]*)"$/,
  async function (this: SpecWorld, label: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      await dialogOf(this).getByLabel(label, { exact: true }).count(),
      1,
    );
  },
);

// The page beneath is inert while the dialog is open, so the name is pressed
// where it lies whether or not anything there will take it, and not waited on
// to become pressable, which it never will.
When(
  "the site's name in the header is pressed",
  async function (this: SpecWorld) {
    await this.browserPage
      .locator("header .site-name")
      .click({ force: true, timeout: 2000 })
      .catch(() => undefined);
  },
);

When("Escape is pressed", async function (this: SpecWorld) {
  await this.browserPage.keyboard.press("Escape");
});

// Pressed until the focus is back where it started, and never more than the
// dialog has things to press twice over: a focus that leaves the dialog would
// otherwise go round the whole page first.
const goRound = async (world: SpecWorld, key: string): Promise<void> => {
  await dialogOf(world).waitFor();
  const inDialog = (): Promise<boolean> =>
    world.browserPage.evaluate<boolean>(
      `document.querySelector(${JSON.stringify(open)})?.contains(document.activeElement) ?? false`,
    );
  const startedAt = await world.browserPage.evaluate<string>(
    "document.activeElement?.outerHTML ?? ''",
  );
  world.focusNeverLeft = await inDialog();
  for (let pressed = 0; pressed < 20; pressed += 1) {
    await world.browserPage.keyboard.press(key);
    if (!(await inDialog())) world.focusNeverLeft = false;
    const now = await world.browserPage.evaluate<string>(
      "document.activeElement?.outerHTML ?? ''",
    );
    if (now === startedAt) return;
  }
};

When(
  "Tab is pressed until the focus comes round again",
  async function (this: SpecWorld) {
    await goRound(this, "Tab");
  },
);

When(
  "Shift and Tab are pressed until the focus comes round again",
  async function (this: SpecWorld) {
    await goRound(this, "Shift+Tab");
  },
);

Then(
  /^the focus never left the (?:player|score|competition|team player|team|test) dialog$/,
  function (this: SpecWorld) {
    assert.equal(this.focusNeverLeft, true, "The focus left the dialog.");
  },
);

// Its flag -------------------------------------------------------------------------

const flagList = (world: SpecWorld): Locator =>
  dialogOf(world).locator("#field-flag");

// The flags are asked for once the dialog is open, so they are waited on:
// every flag there is, which takes a moment to arrive.
const flagsOffered = async (world: SpecWorld): Promise<string[]> => {
  await flagList(world)
    .locator("option")
    .nth(1)
    .waitFor({ state: "attached", timeout: 10_000 });
  return (await flagList(world).locator("option").allInnerTexts()).map(
    (words) => words.trim(),
  );
};

When(
  "the flag {string} is chosen",
  async function (this: SpecWorld, flag: string) {
    await flagsOffered(this);
    await flagList(this).selectOption({ label: flag });
  },
);

When("none is chosen for the flag", async function (this: SpecWorld) {
  await flagsOffered(this);
  await flagList(this).selectOption({ value: "" });
});

Then("no flag is chosen", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await flagList(this).inputValue(), "");
  });
});

Then(
  "the flag chosen is {string}",
  async function (this: SpecWorld, flag: string) {
    await flagsOffered(this);
    await eventually(this, async () => {
      assert.equal(
        (await flagList(this).locator("option:checked").innerText()).trim(),
        flag,
      );
    });
  },
);

Then("the first flag offered is none", async function (this: SpecWorld) {
  await flagsOffered(this);
  assert.equal(
    await flagList(this).locator("option").first().getAttribute("value"),
    "",
  );
});

Then(
  "the flag {string} is offered",
  async function (this: SpecWorld, flag: string) {
    assert.ok(
      (await flagsOffered(this)).includes(flag),
      `${flag} is not offered.`,
    );
  },
);

Then(
  "the flag {string} is offered before the flag {string}",
  async function (this: SpecWorld, one: string, other: string) {
    const flags = await flagsOffered(this);
    assert.ok(flags.includes(one), `${one} is not offered.`);
    assert.ok(flags.includes(other), `${other} is not offered.`);
    assert.ok(flags.indexOf(one) < flags.indexOf(other));
  },
);

// What it says -----------------------------------------------------------------------

const status = (world: SpecWorld): Locator =>
  dialogOf(world).locator('[role="status"]');

Then(
  /^the (?:player|team player|team|test) dialog says "([^"]*)" was added$/,
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      assert.ok(
        (await status(this).innerText()).includes(name),
        `The dialog says ${await status(this).innerText()}.`,
      );
    });
  },
);

Then(
  /^the (?:player dialog says nobody|team dialog says no team|test dialog says no test) was added$/,
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal((await status(this).innerText()).trim(), "");
    });
  },
);

// A status is read out when what it says changes, without the reader being
// taken to it.
Then(
  /^what the (?:player dialog says about who|team dialog says about which team|test dialog says about which test) was added is announced$/,
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await status(this).innerText()).trim() !== "");
    });
  },
);

Then(
  /^the (?:player|score|competition|team player|team|test) dialog says what it refused$/,
  async function (this: SpecWorld) {
    await dialogOf(this)
      .locator(".field-message, .dialog-problems")
      .first()
      .waitFor();
  },
);

// Sent by its first button, found by what it is rather than by its words,
// which are in whatever language the page is in, and waited on until it is
// answered, so that the next step reads what the dialog made of the answer
// rather than racing a server slowed by every other scenario running.
When(
  /^the (?:player|score|competition|team player|team|test) dialog is sent as it is$/,
  async function (this: SpecWorld) {
    const answered = this.browserPage.waitForResponse(
      (response) =>
        ["POST", "PUT"].includes(response.request().method()) &&
        new URL(response.url()).pathname.startsWith("/api/v1/tournaments/"),
    );
    await dialogOf(this).locator('button[type="submit"]').click();
    await answered;
  },
);

When(
  /^the way to add a (?:player|team|test) is pressed$/,
  async function (this: SpecWorld) {
    await tabPanel(this).locator("section > p button").first().click();
  },
);

When(
  "{string} is typed into the player's name",
  async function (this: SpecWorld, words: string) {
    await dialogOf(this).locator("#field-name").fill(words);
  },
);

Then(
  /^every word in the (?:player|team player|team) dialog is in the test locale$/,
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    const stray = await unmarkedWithin(this, open);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// The teams are offered by their names, which are what the manager typed,
// and nobody's language.
Then(
  "every word in the test dialog but the teams' names is in the test locale",
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    const stray = await unmarkedWithin(this, open, ["select option"]);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// The player's name is filled into what the dialog says, and read inside its
// marks with it.
Then(
  "every word in the player dialog but the player's name is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await status(this).innerText()).trim() !== "");
    });
    const stray = await unmarkedWithin(this, open);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// Laid out ----------------------------------------------------------------------

Then(
  /^the (?:player|score|competition|team player|team|test) dialog is no wider than the window$/,
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    const box = await dialogOf(this).boundingBox();
    const width = this.browserPage.viewportSize()?.width ?? 0;
    assert.ok(box !== null, "The dialog is not laid out.");
    assert.ok(
      box.x >= 0 && box.x + box.width <= width,
      `The dialog runs from ${String(box.x)} to ${String(box.x + box.width)} in a window ${String(width)} wide.`,
    );
  },
);

Then(
  "{string} is above {string}",
  async function (this: SpecWorld, one: string, other: string) {
    await dialogOf(this).waitFor();
    // A field by its label, or otherwise a button by its words.
    const boxOf = async (words: string) => {
      const field = dialogOf(this).getByLabel(words, { exact: true });
      return (await field.count()) > 0
        ? field.boundingBox()
        : dialogOf(this)
            .locator(".dialog-buttons button")
            .filter({ hasText: new RegExp(`^${words}$`) })
            .boundingBox();
    };
    const [first, second] = [await boxOf(one), await boxOf(other)];
    assert.ok(first !== null && second !== null, "One is not laid out.");
    assert.ok(first.y + first.height <= second.y, `${one} is not above.`);
  },
);

Then(
  "the name of the player {string} has the focus",
  async function (this: SpecWorld, name: string) {
    await eventually(this, async () => {
      const focused = await this.browserPage.evaluate<string>(
        "document.activeElement?.textContent ?? ''",
      );
      assert.equal(focused.trim(), name);
    });
  },
);

// What was kept ------------------------------------------------------------------

const playersOf = async (
  world: SpecWorld,
  tournament: string,
): Promise<readonly TournamentPlayer[]> =>
  (await load(world, tournamentNamed(world, tournament))).players;

const playerCalled = async (
  world: SpecWorld,
  tournament: string,
  name: string,
): Promise<TournamentPlayer> => {
  let found: TournamentPlayer | undefined;
  await eventually(world, async () => {
    found = (await playersOf(world, tournament)).find(
      (player) => player.name.toString() === name,
    );
    assert.ok(found !== undefined, `${tournament} has no player ${name}.`);
  });
  assert.ok(found !== undefined);
  return found;
};

Then(
  "{string} has the player {string}",
  async function (this: SpecWorld, tournament: string, name: string) {
    await playerCalled(this, tournament, name);
  },
);

Then(
  "{string} does not have the player {string}",
  async function (this: SpecWorld, tournament: string, name: string) {
    await eventually(this, async () => {
      const names = (await playersOf(this, tournament)).map((player) =>
        player.name.toString(),
      );
      assert.ok(!names.includes(name), `${tournament} has ${name}.`);
    });
  },
);

// Once nothing more can be sent: the dialog closed, or the page settled.
Then(
  "{string} has no players",
  async function (this: SpecWorld, tournament: string) {
    await eventually(this, async () => {
      assert.equal((await playersOf(this, tournament)).length, 0);
    });
  },
);

Then(
  "the player {string} of {string} represents {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    representing: string,
  ) {
    await eventually(this, async () => {
      assert.equal(
        (await playerCalled(this, tournament, name)).representing,
        representing,
      );
    });
  },
);

Then(
  "the player {string} of {string} represents nothing",
  async function (this: SpecWorld, name: string, tournament: string) {
    assert.equal(
      (await playerCalled(this, tournament, name)).representing,
      undefined,
    );
  },
);

Then(
  "the player {string} of {string} flies the flag {string}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    flag: string,
  ) {
    await eventually(this, async () => {
      assert.equal(
        String((await playerCalled(this, tournament, name)).flag),
        flag,
      );
    });
  },
);

Then(
  "the player {string} of {string} flies no flag",
  async function (this: SpecWorld, name: string, tournament: string) {
    await eventually(this, async () => {
      assert.equal(
        (await playerCalled(this, tournament, name)).flag,
        undefined,
      );
    });
  },
);

// The dialog about byes ---------------------------------------------------------

// Over the player dialog, which stays open beneath it, so found by what it
// says rather than by being the dialog open.
const byesDialog = "dialog[open]:has(.dialog-byes)";

const byesDialogOf = (world: SpecWorld): Locator =>
  world.browserPage.locator(byesDialog);

Then("the dialog about byes is open", async function (this: SpecWorld) {
  await byesDialogOf(this).waitFor();
});

Then("the dialog about byes is not open", async function (this: SpecWorld) {
  await byesDialogOf(this).waitFor({ state: "detached" });
});

Then(
  "the dialog about byes is announced as a modal dialog",
  async function (this: SpecWorld) {
    await byesDialogOf(this).waitFor();
    assert.equal(
      await byesDialogOf(this).evaluate(
        (element: { matches(selector: string): boolean }) =>
          element.matches(":modal"),
      ),
      true,
    );
  },
);

Then(
  "the dialog about byes says the words for {string}",
  async function (this: SpecWorld, key: string) {
    const words = english.words[key];
    assert.ok(words !== undefined, `English has no words for ${key}.`);
    await byesDialogOf(this).waitFor();
    const said = await byesDialogOf(this).innerText();
    assert.ok(said.includes(words), `The dialog says ${said}.`);
  },
);

Then(
  "the dialog about byes offers {string} alone",
  async function (this: SpecWorld, name: string) {
    await byesDialogOf(this).waitFor();
    const buttons = (
      await byesDialogOf(this).locator("button").allInnerTexts()
    ).map((words) => words.trim());
    assert.deepEqual(buttons, [name]);
  },
);

Then(
  "every word in the dialog about byes is in the test locale",
  async function (this: SpecWorld) {
    await byesDialogOf(this).waitFor();
    const stray = await unmarkedWithin(this, byesDialog);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);
