import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type {
  CompetitionInTournament,
  CompetitionShape,
} from "../../../../../../../../../src/domain/aggregates/tournaments/Tournament.js";
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

// The competition dialog (competition.feature), open over a tournament's
// Competitions tab. What it shares with the player dialog, being a modal
// dialog of the same kind, is said once for both in player.steps.ts; these are
// what it adds: the kind, the places and rounds, and what was kept.

const open = "dialog[open]";

const dialogOf = (world: SpecWorld): Locator => world.browserPage.locator(open);

// A field by the words it is labelled with, as the reader finds it.
const fieldOf = (world: SpecWorld, label: string): Locator =>
  dialogOf(world).getByLabel(label, { exact: true });

Then(
  "the competition dialog does not ask for {string}",
  async function (this: SpecWorld, label: string) {
    await dialogOf(this).waitFor();
    await eventually(this, async () => {
      assert.equal(await fieldOf(this, label).count(), 0);
    });
  },
);

// Its kind ---------------------------------------------------------------------

Given(
  "the kind {string} is chosen",
  async function (this: SpecWorld, kind: string) {
    await fieldOf(this, kind).check();
  },
);

When(
  "the kind of competition is chosen to be a knockout",
  async function (this: SpecWorld) {
    await dialogOf(this).locator("#field-kind-knockout").check();
  },
);

Then(
  "the kind {string} is offered",
  async function (this: SpecWorld, kind: string) {
    await dialogOf(this).waitFor();
    assert.equal(
      await fieldOf(this, kind).getAttribute("type"),
      "radio",
      `${kind} is not offered as a kind.`,
    );
  },
);

Then(
  "the kind chosen is {string}",
  async function (this: SpecWorld, kind: string) {
    await eventually(this, async () => {
      assert.equal(await fieldOf(this, kind).isChecked(), true);
    });
  },
);

// Pressed by its words as much as by its button, so the whole of what can be
// pressed is measured: the label the button is in.
Then(
  "the kind {string} is at least {int} pixels tall",
  async function (this: SpecWorld, kind: string, pixels: number) {
    await dialogOf(this).waitFor();
    // The label the kind's button is in.
    const box = await fieldOf(this, kind).locator("xpath=..").boundingBox();
    assert.ok(box !== null, "It is not laid out.");
    assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
  },
);

// Its places ----------------------------------------------------------------------

const placesOf = (world: SpecWorld): Locator => fieldOf(world, "Places");

const placesOffered = async (world: SpecWorld): Promise<string[]> =>
  (await placesOf(world).locator("option").allInnerTexts()).map((each) =>
    each.trim(),
  );

Given(
  "{int} places are chosen",
  async function (this: SpecWorld, places: number) {
    await placesOf(this).selectOption({ label: String(places) });
  },
);

Then(
  "{int} places are offered",
  async function (this: SpecWorld, places: number) {
    assert.ok(
      (await placesOffered(this)).includes(String(places)),
      `${places} places are not offered.`,
    );
  },
);

Then(
  "{int} numbers of places are offered",
  async function (this: SpecWorld, count: number) {
    assert.equal((await placesOffered(this)).length, count);
  },
);

Then(
  "the places chosen are {int}",
  async function (this: SpecWorld, places: number) {
    await eventually(this, async () => {
      assert.equal(await placesOf(this).inputValue(), String(places));
    });
  },
);

// Its rounds ----------------------------------------------------------------------

// The group the rounds are asked for in, found as a screen reader finds it: a
// group, by the words it is named with.
const roundsUnder = (world: SpecWorld, heading: string): Locator =>
  dialogOf(world).getByRole("group", { name: heading, exact: true });

Then(
  "the rounds are asked for under {string}",
  async function (this: SpecWorld, heading: string) {
    await eventually(this, async () => {
      assert.equal(
        await roundsUnder(this, heading).getByRole("textbox").count(),
        3,
        `The rounds are not asked for under ${heading}.`,
      );
    });
  },
);

// The round in that place among the rounds, in the order a reader meets them,
// is the field named `name`: one element found both ways.
Then(
  "round {int} is asked for as {string}",
  async function (this: SpecWorld, round: number, name: string) {
    await eventually(this, async () => {
      const inPlace = dialogOf(this)
        .locator(".field-best-ofs input")
        .nth(round - 1);
      assert.equal(
        await inPlace.evaluate(
          (element, named) => element === named,
          await fieldOf(this, name).elementHandle({ timeout: 500 }),
        ),
        true,
        `Round ${String(round)} is not asked for as ${name}.`,
      );
    });
  },
);

// What it says -----------------------------------------------------------------------

const status = (world: SpecWorld): Locator =>
  dialogOf(world).locator('[role="status"]');

Given(
  "a name of {int} characters is typed as the {string}",
  async function (this: SpecWorld, count: number, label: string) {
    await fieldOf(this, label).fill("a".repeat(count));
  },
);

Then(
  "the competition dialog says {string} was added",
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
  "the competition dialog says nothing was added",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.equal((await status(this).innerText()).trim(), "");
    });
  },
);

// A status is read out when what it says changes, without the reader being
// taken to it.
Then(
  "what the competition dialog says about what was added is announced",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await status(this).innerText()).trim() !== "");
    });
  },
);

When(
  "the way to add a competition is pressed",
  async function (this: SpecWorld) {
    await tabPanel(this).locator("section > p button").first().click();
  },
);

When(
  "{string} is typed into the competition's name",
  async function (this: SpecWorld, words: string) {
    await dialogOf(this).locator("#field-name").fill(words);
  },
);

Then(
  "every word in the competition dialog is in the test locale",
  async function (this: SpecWorld) {
    await dialogOf(this).waitFor();
    const stray = await unmarkedWithin(this, open);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// The competition's name is filled into what the dialog says, and read inside
// its marks with it.
Then(
  "every word in the competition dialog but the competition's name is in the test locale",
  async function (this: SpecWorld) {
    await eventually(this, async () => {
      assert.ok((await status(this).innerText()).trim() !== "");
    });
    const stray = await unmarkedWithin(this, open);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// What is said above the fields, about no one of them, by its code.
Then(
  "the competition dialog says {string} above the fields",
  async function (this: SpecWorld, code: string) {
    await eventually(this, async () => {
      const refused =
        (await dialogOf(this)
          .locator(".dialog-problems")
          .getAttribute("data-refused", { timeout: 500 })) ?? "";
      assert.ok(
        refused.split(" ").includes(code),
        `Above the fields says ${refused || "nothing"}.`,
      );
    });
  },
);

// What was kept ------------------------------------------------------------------

const competitionsOf = async (
  world: SpecWorld,
  tournament: string,
): Promise<readonly CompetitionInTournament[]> =>
  (await load(world, tournamentNamed(world, tournament))).competitions;

const shapeOf = async (
  world: SpecWorld,
  tournament: string,
  name: string,
): Promise<CompetitionShape> => {
  let found: CompetitionInTournament | undefined;
  await eventually(world, async () => {
    found = (await competitionsOf(world, tournament)).find(
      ({ reference }) => reference.name.toString() === name,
    );
    assert.ok(found !== undefined, `${tournament} has no competition ${name}.`);
  });
  assert.ok(found !== undefined);
  return found.shape;
};

// A knockout's draw, where the competition is one.
const drawOf = async (world: SpecWorld, tournament: string, name: string) => {
  const shape = await shapeOf(world, tournament, name);
  assert.equal(shape.kind, "knockout", `${name} is a ${shape.kind}.`);
  return shape.draw;
};

Then(
  "{string} has the competition {string}",
  async function (this: SpecWorld, tournament: string, name: string) {
    await shapeOf(this, tournament, name);
  },
);

// Once nothing more can be sent: the dialog closed, or the page settled.
Then(
  "{string} has no competitions",
  async function (this: SpecWorld, tournament: string) {
    await eventually(this, async () => {
      assert.equal((await competitionsOf(this, tournament)).length, 0);
    });
  },
);

Then(
  /^the competition "([^"]*)" of "([^"]*)" is a (block|knockout|Swiss)$/,
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    kind: string,
  ) {
    assert.equal(
      (await shapeOf(this, tournament, name)).kind,
      kind.toLowerCase(),
    );
  },
);

Then(
  "each match of the competition {string} of {string} is the best of {int}",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    games: number,
  ) {
    const shape = await shapeOf(this, tournament, name);
    assert.notEqual(shape.kind, "knockout", `${name} is a knockout.`);
    if (shape.kind !== "knockout") assert.equal(shape.bestOf.games, games);
  },
);

Then(
  "the knockout {string} of {string} has {int} places",
  async function (
    this: SpecWorld,
    name: string,
    tournament: string,
    places: number,
  ) {
    assert.equal((await drawOf(this, tournament, name)).places, places);
  },
);

Then(
  /^the (first|second) round of the knockout "([^"]*)" of "([^"]*)" is the best of (\d+)$/,
  async function (
    this: SpecWorld,
    round: string,
    name: string,
    tournament: string,
    games: number,
  ) {
    const rounds = (await drawOf(this, tournament, name)).rounds;
    assert.equal(
      rounds[round === "first" ? 0 : 1]?.games,
      Number(games),
      `The rounds are the best of ${rounds.map((each) => String(each.games)).join(", ")}.`,
    );
  },
);
