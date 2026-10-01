import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../../../../../../support/world.js";
import { unmarkedWithin } from "../../../../../../../../support/marks.js";
import { eventually } from "../../../../../../../../support/tournamentPage.js";

// The score dialog (score-modal-dialog.feature), open over a competition's
// Scores tab. What finds a field by its label, types into it, and reads what
// was refused beside it is shared with the admin's other forms and dialogs;
// what reads a modal dialog is shared with the player dialog. These are what
// the score dialog adds: choosing the winner and the loser, and where the
// parts of a result sit.

const open = "dialog[open]";

const dialogOf = (world: SpecWorld): Locator => world.browserPage.locator(open);

const fieldOf = (world: SpecWorld, label: string): Locator =>
  dialogOf(world).getByLabel(label, { exact: true });

// The players offered, without the choice of nobody each begins on, once
// they have arrived, which takes a moment after the dialog opens.
const offered = async (world: SpecWorld, label: string): Promise<string[]> => {
  await fieldOf(world, label)
    .locator('option:not([value=""])')
    .first()
    .waitFor({ state: "attached", timeout: 10_000 });
  return (await fieldOf(world, label).locator("option").allInnerTexts())
    .map((name) => name.trim())
    .filter((name) => name !== "");
};

// Given and When alike: Cucumber does not tell them apart.
Given(
  "{string} is chosen as the {string}",
  async function (this: SpecWorld, name: string, label: string) {
    await eventually(this, async () => {
      assert.ok((await offered(this, label)).includes(name));
    });
    await fieldOf(this, label).selectOption({ label: name });
  },
);

// Whether a game corrected lets its players be chosen again, which is
// whether their drop-downs can be used.
for (const [said, can] of [
  ["can", true],
  ["cannot", false],
] as const) {
  Then(
    `{string} ${said} be changed`,
    async function (this: SpecWorld, label: string) {
      await eventually(this, async () => {
        assert.equal(await fieldOf(this, label).isEnabled(), can);
      });
    },
  );
}

Then(
  "the {string} chosen is {string}",
  async function (this: SpecWorld, label: string, name: string) {
    await eventually(this, async () => {
      assert.equal(
        (
          await fieldOf(this, label).locator("option:checked").innerText()
        ).trim(),
        name,
      );
    });
  },
);

Given("{string} is emptied", async function (this: SpecWorld, label: string) {
  const field = fieldOf(this, label);
  if (
    (await field.evaluate(
      (element: { tagName: string }) => element.tagName,
    )) === "SELECT"
  ) {
    await field.selectOption("");
  } else {
    await field.fill("");
  }
});

// By the fields' own ids, where the reader's language names them otherwise.
Given(
  /^"([^"]*)" is chosen as the (winner|loser) in the score dialog$/,
  async function (this: SpecWorld, name: string, part: string) {
    const field = dialogOf(this).locator(`#field-${part}`);
    await eventually(this, async () => {
      assert.ok(
        (await field.locator("option").allInnerTexts()).some(
          (each) => each.trim() === name,
        ),
      );
    });
    await field.selectOption({ label: name });
  },
);

Given(
  /^"([^"]*)" is typed as the (winner|loser)'s score in the score dialog$/,
  async function (this: SpecWorld, words: string, part: string) {
    await dialogOf(this).locator(`#field-${part}Score`).fill(words);
  },
);

Then(
  "{string} is offered as the {string}",
  async function (this: SpecWorld, name: string, label: string) {
    await eventually(this, async () => {
      assert.ok((await offered(this, label)).includes(name));
    });
  },
);

Then(
  "{string} is not offered as the {string}",
  async function (this: SpecWorld, name: string, label: string) {
    await eventually(this, async () => {
      const all = await offered(this, label);
      assert.ok(all.length > 0, "Nobody is offered yet.");
      assert.ok(!all.includes(name));
    });
  },
);

Then(
  "{string} is offered before {string} as the {string}",
  async function (this: SpecWorld, one: string, other: string, label: string) {
    await eventually(this, async () => {
      const all = await offered(this, label);
      assert.ok(
        all.includes(one) &&
          all.includes(other) &&
          all.indexOf(one) < all.indexOf(other),
        `They are offered as ${JSON.stringify(all)}.`,
      );
    });
  },
);

Then(
  "the first choice offered as the {string} is nobody",
  async function (this: SpecWorld, label: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      await fieldOf(this, label)
        .locator("option")
        .first()
        .getAttribute("value"),
      "",
    );
  },
);

// Asked once the players have arrived, since until then the drop-down has no
// choice of nobody for want of having anything at all.
Then(
  "nobody is not offered as the {string}",
  async function (this: SpecWorld, label: string) {
    await eventually(this, async () => {
      assert.ok(
        (await offered(this, label)).length > 0,
        "No player has arrived yet.",
      );
    });
    assert.equal(
      await fieldOf(this, label).locator('option[value=""]').count(),
      0,
    );
  },
);

const boxOf = async (thing: Locator) => {
  const box = await thing.boundingBox();
  assert.ok(box !== null, "It is not laid out.");
  return box;
};

Then(
  // The score dialog's "beat" between the players, or the test dialog's "v"
  // between the teams.
  /^the (?:score|test) dialog says "([^"]*)" between "([^"]*)" and "([^"]*)"$/,
  async function (
    this: SpecWorld,
    words: string,
    above: string,
    below: string,
  ) {
    await dialogOf(this).waitFor();
    const between = dialogOf(this).locator(".score-beat, .test-versus");
    assert.equal((await between.innerText()).trim(), words);
    const [top, middle, bottom] = [
      await boxOf(fieldOf(this, above)),
      await boxOf(between),
      await boxOf(fieldOf(this, below)),
    ];
    assert.ok(
      top.y + top.height <= middle.y,
      `${words} is not below ${above}.`,
    );
    assert.ok(
      middle.y + middle.height <= bottom.y,
      `${words} is not above ${below}.`,
    );
  },
);

// Side by side: on the one row, one beginning below where the other ends
// nowhere.
Then(
  "{string} is beside {string}",
  async function (this: SpecWorld, one: string, other: string) {
    await dialogOf(this).waitFor();
    const [first, second] = [
      await boxOf(fieldOf(this, one)),
      await boxOf(fieldOf(this, other)),
    ];
    assert.ok(
      first.y < second.y + second.height && second.y < first.y + first.height,
      `${one} is not beside ${other}.`,
    );
  },
);

Then(
  "{string} does not bring up a keypad of numbers",
  async function (this: SpecWorld, label: string) {
    await dialogOf(this).waitFor();
    const field = fieldOf(this, label);
    assert.ok(
      !["numeric", "decimal"].includes(
        (await field.getAttribute("inputmode")) ?? "",
      ),
    );
    assert.notEqual(await field.getAttribute("type"), "number");
  },
);

const status = (world: SpecWorld): Locator =>
  dialogOf(world).locator('[role="status"]');

Then(
  "the score dialog says the game {string} won against {string} was added",
  async function (this: SpecWorld, winner: string, loser: string) {
    await eventually(this, async () => {
      const said = await status(this).innerText();
      assert.ok(
        said.includes(winner) &&
          said.includes(loser) &&
          said.indexOf(winner) < said.indexOf(loser),
        `The dialog says ${said}.`,
      );
    });
  },
);

Then(
  "the score dialog says no game was added",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal((await status(this).innerText()).trim(), "");
    });
  },
);

// A status is read out when what it says changes, without the reader being
// taken to it.
Then(
  "what the score dialog says about the game added is announced",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await status(this).innerText()).trim() !== "");
    });
  },
);

// The players' names are what the manager typed, and nobody's language; they
// are offered in the dialog's choices, and filled into what it says once a
// game is added, inside its marks.
When(
  "every word in the score dialog but the players' names is in the test locale",
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, open, ["select option"]);
      assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
    });
  },
);
