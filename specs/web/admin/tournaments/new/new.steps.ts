import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { SpecWorld } from "../../../../support/world.js";
import {
  checkSuggestions,
  controlOf,
  drawnArrowOf,
  keepsTheFocus,
  namesInView,
  pressSuggestion,
  saidInvalid,
  suggestedTo,
  whatOf,
} from "../../../support/suggestions.js";
import { unmarkedWithin } from "../../../support/marks.js";
import { ordinal } from "../../../support/ordinals.js";
import { keptCalled } from "../../../support/tournaments.js";

// The admin draws the form itself, after asking the API what the website
// offers, so a step reads it once it is drawn, and asks again for a while
// before taking what it reads as failing: a field that appears when a country
// is chosen appears a moment after the choice.

const newTournament = "/admin/tournaments/new";

// The admin's forms: the one a page is for, a tab's own, and one in a modal
// dialog, which is the only one that can be used while it is open.
// The public lists' filter among them, which says what was chosen in the
// same words a dialog's form does.
const forms =
  "dialog[open] form, body:not(:has(dialog[open])) :is(form.dialog-form, form.tab-form, form.tournament-filter)";

// The form, or what the page says in its place where the reader cannot use
// it (edit.feature), or a tournament's tab once it has what it lists, which is
// when its form is drawn where it has one, and which may have no form of its
// own once its dialog is closed: any is the page drawn.
const drawn = async (world: SpecWorld): Promise<void> => {
  await world.browserPage
    .locator(
      `${forms}, main .page-refused, :is(#tab-panel, #page-list) section[aria-busy="false"]`,
    )
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
  world.browserPage.locator(forms).getByLabel(label, { exact: true });

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
// The format is still a list to choose from; the country, the region and the
// sport are typed, and suggest the names that have what was typed.
const offeredAt = async (found: Locator): Promise<string[]> =>
  (
    (await found.evaluate(
      (element: { readonly options?: ArrayLike<{ readonly text: string }> }) =>
        element.options === undefined
          ? undefined
          : Array.from(element.options).map((option) => option.text),
    )) ?? (await suggestedTo(found))
  ).filter((words) => words !== "");

const offeredIn = (world: SpecWorld, label: string): Promise<string[]> =>
  offeredAt(field(world, label));

Then(
  /^the (first|second|third|fourth|fifth|sixth|seventh) (sport|format) offered is "([^"]*)"$/,
  async function (this: SpecWorld, which: string, list: string, words: string) {
    const label = list === "sport" ? "Sport" : "Format";
    await eventually(this, async () => {
      assert.equal((await offeredIn(this, label))[ordinal(which)], words);
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
  /^the (first|second|third|fourth|fifth|sixth|seventh) country in the form is "([^"]*)"$/,
  async function (this: SpecWorld, which: string, country: string) {
    await eventually(this, async () => {
      assert.equal((await offeredIn(this, "Country"))[ordinal(which)], country);
    });
  },
);

Then(
  /^the form (offers|does not offer) the (country|region|sport) "([^"]*)"$/,
  async function (this: SpecWorld, does: string, kind: string, name: string) {
    const label =
      kind === "country" ? "Country" : kind === "region" ? "Region" : "Sport";
    await eventually(this, async () => {
      assert.equal(
        (await offeredIn(this, label)).includes(name),
        does === "offers",
        `The form ${does} ${name}.`,
      );
    });
  },
);

// What is in the box, which is the name of the choice made once it has been.
// A function and not a string of one: Playwright 1.64 does not call a string,
// and leaves what it was to read undefined. It is typed by what it reads, since
// the specs are typed without the browser's own types.
const chosenIn = async (world: SpecWorld, label: string): Promise<string> =>
  field(world, label).evaluate(
    (element: {
      readonly selectedOptions?: ArrayLike<{ readonly text: string }>;
      readonly value: string;
    }) =>
      element.selectedOptions !== undefined
        ? (element.selectedOptions[0]?.text ?? "")
        : element.value,
  );

When(
  "the down arrow is pressed in the {string}",
  async function (this: SpecWorld, label: string) {
    await drawn(this);
    await field(this, label).press("ArrowDown");
  },
);

// How wide a field was, to say it is as wide when something is in it.
const noted = new WeakMap<SpecWorld, number>();

When(
  "the width of the {string} is noted",
  async function (this: SpecWorld, label: string) {
    await drawn(this);
    const box = await (await controlOf(field(this, label))).boundingBox();
    assert.ok(box !== null, "The field is not on the page.");
    noted.set(this, box.width);
  },
);

Then(
  "the {string} is as wide as was noted",
  async function (this: SpecWorld, label: string) {
    const before = noted.get(this);
    assert.ok(before !== undefined, "No width was noted.");
    await eventually(this, async () => {
      const box = await (await controlOf(field(this, label))).boundingBox();
      assert.ok(box !== null, "The field is not on the page.");
      assert.ok(
        Math.abs(box.width - before) <= 1,
        `The field is ${String(box.width)} wide, and was ${String(before)}.`,
      );
    });
  },
);

// The label lies on the line while the field is empty, and lifts onto the box's
// border once there is something in it, or it would be over what was typed.
Then(
  "the label of the {string} is above what is typed",
  async function (this: SpecWorld, label: string) {
    await eventually(this, async () => {
      const typed = await field(this, label).boundingBox();
      const named = await (
        await controlOf(field(this, label))
      )
        .locator(".field-label")
        .boundingBox();
      assert.ok(typed !== null && named !== null, "The field is not drawn.");
      assert.ok(
        named.y + named.height / 2 < typed.y,
        `The label is at ${String(named.y)} and what is typed at ${String(typed.y)}.`,
      );
    });
  },
);

When(
  "the tab key is pressed in the {string}",
  async function (this: SpecWorld, label: string) {
    await drawn(this);
    await field(this, label).press("Tab");
  },
);

When(
  "the escape key is pressed in the {string}",
  async function (this: SpecWorld, label: string) {
    await drawn(this);
    await field(this, label).press("Escape");
  },
);

Then(
  "{string} does not have the focus",
  async function (this: SpecWorld, label: string) {
    await keepsTheFocus(field(this, label), false);
  },
);

When(
  "the key {string} is pressed in the {string}",
  async function (this: SpecWorld, key: string, label: string) {
    await drawn(this);
    await field(this, label).press(key);
  },
);

Then(
  "the suggestions of the {string} show {int} name(s)",
  async function (this: SpecWorld, label: string, count: number) {
    await drawn(this);
    assert.equal(await namesInView(field(this, label)), count);
  },
);

Then(
  "{string} says nothing is wrong",
  async function (this: SpecWorld, label: string) {
    const until = Date.now() + 3000;
    while ((await field(this, label).evaluate(saidInvalid)) !== "") {
      assert.ok(Date.now() < until, `${label} still says what is wrong.`);
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  },
);

Then(
  "{string} says it needs {string}",
  async function (this: SpecWorld, label: string, words: string) {
    await eventually(this, async () => {
      assert.equal(await field(this, label).evaluate(saidInvalid), words);
    });
  },
);

When(
  "the arrow at the end of the {string} is pressed",
  async function (this: SpecWorld, label: string) {
    await drawn(this);
    await drawnArrowOf(field(this, label)).click();
  },
);

When(
  "{string} is pressed among the suggestions of the {string}",
  async function (this: SpecWorld, name: string, label: string) {
    await drawn(this);
    await pressSuggestion(field(this, label), name);
  },
);

Then(
  /^the suggestions of the "([^"]*)" (are shown|are not shown|start where the field starts|are as wide as the field|are in the same text size as the field)$/,
  async function (this: SpecWorld, label: string, what: string) {
    await drawn(this);
    await checkSuggestions(field(this, label), whatOf(what));
  },
);

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

Then("no region is chosen", async function (this: SpecWorld) {
  await eventually(this, async () => {
    assert.equal(await field(this, "Region").inputValue(), "");
  });
});

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
  const chosen = field(world, label);
  if (
    await chosen.evaluate(
      (element: { readonly options?: unknown }) =>
        element.options !== undefined,
    )
  ) {
    await chosen.selectOption({ label: choice });
  } else {
    await chosen.fill(choice);
  }
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

Given("none is chosen for the region", async function (this: SpecWorld) {
  await drawn(this);
  await field(this, "Region").fill("");
});

Given(
  "the sport {string} is chosen",
  async function (this: SpecWorld, sport: string) {
    await choose(this, "Sport", sport);
  },
);

Given(
  "the format {string} is chosen",
  async function (this: SpecWorld, format: string) {
    await choose(this, "Format", format);
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

Then(
  "the tab asks for {string}",
  async function (this: SpecWorld, label: string) {
    await eventually(this, async () => {
      assert.equal(await field(this, label).count(), 1);
    });
  },
);

Then("{string} has the focus", async function (this: SpecWorld, label: string) {
  await eventually(this, async () => {
    // A field by its label, and otherwise a button by its words, looked for
    // again each time this is retried, and asked with a short wait of its own,
    // so that one not drawn yet is retried rather than waited out.
    const found =
      (await field(this, label).count()) > 0
        ? field(this, label)
        : this.browserPage.getByRole("button", { name: label, exact: true });
    assert.equal(
      await found.evaluate(
        (element) =>
          element ===
          (globalThis as unknown as { document: { activeElement: unknown } })
            .document.activeElement,
        undefined,
        { timeout: 500 },
      ),
      true,
      `${label} does not have the focus.`,
    );
  });
});

Then(
  "{string} says {string}",
  async function (this: SpecWorld, label: string, words: string) {
    await eventually(this, async () => {
      assert.equal(await field(this, label).inputValue(), words);
    });
  },
);

// What was refused -------------------------------------------------------------

Then(
  "nothing is said beneath {string}",
  async function (this: SpecWorld, label: string) {
    await eventually(this, async () => {
      assert.equal(
        await field(this, label).getAttribute("aria-describedby"),
        null,
        `Something is said beneath ${label}.`,
      );
    });
  },
);

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
      // A field may be described by what it is for as well as by what is
      // wrong with it, and only what is wrong says what was refused.
      const refused = (
        await Promise.all(
          described
            .split(" ")
            .map((id) =>
              this.browserPage
                .locator(`#${id}`)
                .getAttribute("data-refused", { timeout: 500 }),
            ),
        )
      )
        .filter((codes) => codes !== null)
        .join(" ");
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
  "the tournament {string} is kept in no region",
  async function (this: SpecWorld, name: string) {
    assert.equal((await keptCalled(this, name)).region, undefined);
  },
);

Then(
  "the tournament {string} is kept drawing a level test",
  async function (this: SpecWorld, name: string) {
    assert.equal((await keptCalled(this, name)).levelTestsDrawn, true);
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
      const countries = await offeredAt(
        this.browserPage.locator("#field-country"),
      );
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
