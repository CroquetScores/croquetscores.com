import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../../../src/domain/aggregates/tournaments/Tournament.js";
import { load } from "../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../support/world.js";

// The admin draws the form itself, after asking the API what the website
// offers, so a step reads it once it is drawn, and asks again for a while
// before taking what it reads as failing: a field that appears when a country
// is chosen appears a moment after the choice.

const newTournament = "/admin/tournaments/new";

const drawn = async (world: SpecWorld): Promise<void> => {
  await world.browserPage.locator("form.dialog-form").waitFor();
};

// Three seconds, which leaves the step time to fail with what it found rather
// than with Cucumber's word that it took too long.
const eventually = async (
  world: SpecWorld,
  check: () => Promise<void>,
): Promise<void> => {
  await drawn(world);
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

// A field by the words it is labelled with, which is how the reader and a
// screen reader find it.
const field = (world: SpecWorld, label: string): Locator =>
  world.browserPage
    .locator("form.dialog-form")
    .getByLabel(label, { exact: true });

const openNewTournament = async function (this: SpecWorld): Promise<void> {
  await this.browserPage.goto(`${this.baseUrl!}${newTournament}`);
};

Given("the new tournament page is open", openNewTournament);
When("the new tournament page is opened", openNewTournament);

// What the form asks ---------------------------------------------------------

Then(
  "the form asks for {string}",
  async function (this: SpecWorld, label: string) {
    await eventually(this, async () => {
      assert.equal(
        await field(this, label).count(),
        1,
        `Nothing asks for ${label}.`,
      );
      assert.ok(await field(this, label).isVisible(), `${label} is not shown.`);
    });
  },
);

Then(
  "the form does not ask for {string}",
  async function (this: SpecWorld, label: string) {
    await eventually(this, async () => {
      assert.equal(
        await field(this, label).count(),
        0,
        `The form asks for ${label}.`,
      );
    });
  },
);

Then(
  "the dialog is titled {string}",
  async function (this: SpecWorld, title: string) {
    await eventually(this, async () => {
      assert.equal(
        await this.browserPage.locator(".dialog-title").textContent(),
        title,
      );
    });
  },
);

const buttons = (world: SpecWorld): Locator =>
  world.browserPage.locator("form.dialog-form button");

Then(
  "the form's button is {string}",
  async function (this: SpecWorld, label: string) {
    await eventually(this, async () => {
      assert.equal(await buttons(this).first().textContent(), label);
    });
  },
);

Then(
  /^the form has (\d+) buttons?$/,
  async function (this: SpecWorld, count: string) {
    await eventually(this, async () => {
      assert.equal(await buttons(this).count(), Number(count));
    });
  },
);

// What a list offers, in the order it offers it, less the choice of nothing a
// list with nothing chosen begins with.
const offeredIn = async (world: SpecWorld, label: string): Promise<string[]> =>
  (await field(world, label).locator("option").allTextContents()).filter(
    (words) => words !== "",
  );

const ordinals = ["first", "second", "third", "fourth", "fifth"];

Then(
  /^the (first|second|third|fourth|fifth) (sport|format) offered is "([^"]*)"$/,
  async function (this: SpecWorld, which: string, list: string, words: string) {
    const label = list === "sport" ? "Sport" : "Format";
    await eventually(this, async () => {
      assert.equal(
        (await offeredIn(this, label))[ordinals.indexOf(which)],
        words,
      );
    });
  },
);

Then(
  /^(\d+) (sport|format)s? (?:is|are) offered$/,
  async function (this: SpecWorld, count: string, list: string) {
    const label = list === "sport" ? "Sport" : "Format";
    await eventually(this, async () => {
      assert.equal((await offeredIn(this, label)).length, Number(count));
    });
  },
);

Then(
  "the region {string} is offered",
  async function (this: SpecWorld, region: string) {
    await eventually(this, async () => {
      assert.ok((await offeredIn(this, "Region")).includes(region));
    });
  },
);

const chosenIn = async (world: SpecWorld, label: string): Promise<string> =>
  (await field(world, label).locator("option:checked").textContent()) ?? "";

Then(
  "the sport chosen is {string}",
  async function (this: SpecWorld, sport: string) {
    await eventually(this, async () => {
      assert.equal(await chosenIn(this, "Sport"), sport);
    });
  },
);

Then(
  "the format chosen is {string}",
  async function (this: SpecWorld, format: string) {
    await eventually(this, async () => {
      assert.equal(await chosenIn(this, "Format"), format);
    });
  },
);

Then("{string} is ticked", async function (this: SpecWorld, label: string) {
  await eventually(this, async () => {
    assert.equal(await field(this, label).isChecked(), true);
  });
});

Then("{string} is not ticked", async function (this: SpecWorld, label: string) {
  await eventually(this, async () => {
    assert.equal(await field(this, label).isChecked(), false);
  });
});

Then("{string} is empty", async function (this: SpecWorld, label: string) {
  await eventually(this, async () => {
    assert.equal(await field(this, label).inputValue(), "");
  });
});

Then(
  "{string} still says {string}",
  async function (this: SpecWorld, label: string, words: string) {
    await eventually(this, async () => {
      assert.equal(await field(this, label).inputValue(), words);
    });
  },
);

// What the reader does -------------------------------------------------------

const choose = async (
  world: SpecWorld,
  label: string,
  choice: string,
): Promise<void> => {
  await drawn(world);
  await field(world, label).selectOption({ label: choice });
};

Given(
  "the country {string} is chosen",
  async function (this: SpecWorld, country: string) {
    await choose(this, "Country", country);
  },
);

Given(
  "the region {string} is chosen",
  async function (this: SpecWorld, region: string) {
    await choose(this, "Region", region);
  },
);

Given(
  "the sport {string} is chosen",
  async function (this: SpecWorld, sport: string) {
    await choose(this, "Sport", sport);
  },
);

Given(
  "the reader ticks {string}",
  async function (this: SpecWorld, label: string) {
    await drawn(this);
    await field(this, label).check();
  },
);

Given(
  "the reader unticks {string}",
  async function (this: SpecWorld, label: string) {
    await drawn(this);
    await field(this, label).uncheck();
  },
);

Given(
  "{string} is typed as the {string}",
  async function (this: SpecWorld, words: string, label: string) {
    await drawn(this);
    await field(this, label).fill(words);
  },
);

Given(
  "{int} characters are typed as the {string}",
  async function (this: SpecWorld, count: number, label: string) {
    await drawn(this);
    await field(this, label).fill("a".repeat(count));
  },
);

// What was refused -------------------------------------------------------------

// Read from what the field is described by, which is what a screen reader
// reads out with it, so that a refusal said somewhere else on the page does
// not count as said beside the field.
Then(
  "{string} is refused with {string}",
  async function (this: SpecWorld, label: string, code: string) {
    await eventually(this, async () => {
      const described = await field(this, label).getAttribute(
        "aria-describedby",
      );
      assert.ok(described !== null, `Nothing is said beside ${label}.`);
      const refused =
        (await this.browserPage
          .locator(`#${described}`)
          .getAttribute("data-refused")) ?? "";
      assert.ok(
        refused.split(" ").includes(code),
        `${label} is refused with ${refused}.`,
      );
    });
  },
);

// What was kept ------------------------------------------------------------------

// Found by its name among those kept, since the scenario created it through
// the form and so never knew its id.
const kept = async (world: SpecWorld, name: string): Promise<Tournament> => {
  const { rows } = await world.database.query<{ tournament_id: string }>(
    `select tournament_id from tournaments_by_account_details where name = $1`,
    [name],
  );
  assert.equal(rows.length, 1, `${String(rows.length)} are called ${name}.`);
  return load(world, TournamentId.from(rows[0]!.tournament_id));
};

Then(
  "the tournament {string} is kept in the format {string}",
  async function (this: SpecWorld, name: string, format: string) {
    assert.equal((await kept(this, name)).format.name, format);
  },
);

Then(
  "the tournament {string} is kept as not national",
  async function (this: SpecWorld, name: string) {
    assert.equal((await kept(this, name)).national, false);
  },
);

Then(
  "the tournament {string} is kept as not international",
  async function (this: SpecWorld, name: string) {
    assert.equal((await kept(this, name)).international, false);
  },
);

// Where the fields are ----------------------------------------------------------

// Measured by the boxes the reader sees, which are the labels the fields are
// drawn in, rather than the controls inside them.
const boxOf = async (
  world: SpecWorld,
  label: string,
): Promise<{ x: number; y: number }> => {
  const box = await world.browserPage
    .locator("label.field-box")
    // Looked for inside the box, which is where a filter looks.
    .filter({ has: world.browserPage.getByLabel(label, { exact: true }) })
    .boundingBox();
  assert.ok(box !== null, `${label} is not on the page.`);
  return box;
};

Then(
  "{string} and {string} are on the same row",
  async function (this: SpecWorld, one: string, other: string) {
    await eventually(this, async () => {
      const [first, second] = [
        await boxOf(this, one),
        await boxOf(this, other),
      ];
      assert.equal(
        Math.round(first.y),
        Math.round(second.y),
        `${one} is ${String(Math.round(first.y))} pixels down and ${other} ${String(Math.round(second.y))}.`,
      );
    });
  },
);

Then(
  "{string} is to the left of {string}",
  async function (this: SpecWorld, one: string, other: string) {
    await eventually(this, async () => {
      assert.ok((await boxOf(this, one)).x < (await boxOf(this, other)).x);
    });
  },
);
