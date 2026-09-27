import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";
import { unmarkedWithin } from "../../../support/marks.js";
import { keptCalled } from "../../../support/tournaments.js";

// The admin draws the form itself, after asking the API what the website
// offers, so a step reads it once it is drawn, and asks again for a while
// before taking what it reads as failing: a field that appears when a country
// is chosen appears a moment after the choice.

const newTournament = "/admin/tournaments/new";

// The form, or what the page says in its place where the reader cannot use
// it (edit.feature): either is the page drawn.
const drawn = async (world: SpecWorld): Promise<void> => {
  await world.browserPage
    .locator("form.dialog-form, main .page-refused")
    .first()
    .waitFor();
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
      assert.ok(
        (await offeredIn(this, "Region")).includes(region),
        `${region} is not offered.`,
      );
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
  "the country chosen is {string}",
  async function (this: SpecWorld, country: string) {
    await eventually(this, async () => {
      assert.equal(await chosenIn(this, "Country"), country);
    });
  },
);

Then(
  "the region chosen is {string}",
  async function (this: SpecWorld, region: string) {
    await eventually(this, async () => {
      assert.equal(await chosenIn(this, "Region"), region);
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

Then(
  "the tournament {string} is kept in the format {string}",
  async function (this: SpecWorld, name: string, format: string) {
    assert.equal((await keptCalled(this, name)).format.name, format);
  },
);

Then(
  "the tournament {string} is kept as not national",
  async function (this: SpecWorld, name: string) {
    assert.equal((await keptCalled(this, name)).national, false);
  },
);

Then(
  "the tournament {string} is kept as not international",
  async function (this: SpecWorld, name: string) {
    assert.equal((await keptCalled(this, name)).international, false);
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
      const [first, second] = [
        await boxOf(this, one),
        await boxOf(this, other),
      ];
      assert.ok(
        first.x < second.x,
        `${one} starts ${String(Math.round(first.x))} pixels across and ${other} ${String(Math.round(second.x))}.`,
      );
    });
  },
);

// The form in the reader's language --------------------------------------------

// What was typed is in the fields rather than among the form's words, and is
// not read for marks. Asked again for a while, as the rest of the form is,
// since the lists fill a moment after the form is drawn.
Then(
  "every word in the form is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      const stray = await unmarkedWithin(this, "section.dialog");
      assert.deepEqual(stray, [], "Words in the form came from elsewhere.");
    });
  },
);

// Sent by its one button, found by what it is rather than by its words, which
// are in whatever language the page is in.
When("the form is sent as it is", async function (this: SpecWorld) {
  await drawn(this);
  await this.browserPage
    .locator('form.dialog-form button[type="submit"]')
    .click();
});

// Something said beside a field, which is where the form says what it refused.
Then("the form says what it refused", async function (this: SpecWorld) {
  await this.browserPage
    .locator("form.dialog-form .field-message")
    .first()
    .waitFor();
});

// By the list's own id rather than by its label, which is in the language the
// page is in, and a scenario about order may be read in any of them.
Then(
  "the country {string} is offered before the country {string}",
  async function (this: SpecWorld, one: string, other: string) {
    await eventually(this, async () => {
      const countries = await this.browserPage
        .locator("#field-country option")
        .allTextContents();
      const [first, second] = [
        countries.indexOf(one),
        countries.indexOf(other),
      ];
      assert.ok(first !== -1, `${one} is not offered.`);
      assert.ok(second !== -1, `${other} is not offered.`);
      assert.ok(
        first < second,
        `${one} is offered ${String(first + 1)}th and ${other} ${String(second + 1)}th.`,
      );
    });
  },
);
