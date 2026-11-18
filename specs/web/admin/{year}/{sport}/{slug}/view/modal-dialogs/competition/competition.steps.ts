import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { Locator } from "playwright";

import type { WebWorld } from "../../../../../../../support/world.js";
import {
  keptOf,
  type KeptCompetition,
} from "../../../../../../../support/kept.js";
import { unmarkedWithin } from "../../../../../../../support/marks.js";
import {
  eventually,
  tabPanel,
  retried,
} from "../../../../../../../support/tournamentPage.js";

// The competition dialog (competition.feature), open over a tournament's
// Competitions tab. What it shares with the player dialog, being a modal
// dialog of the same kind, is said once for both in player.steps.ts; these are
// what it adds: the kind, the places and rounds, and what was kept.

const open = "dialog[open]";

const dialogOf = (world: WebWorld): Locator => world.browserPage.locator(open);

// A field by the words it is labelled with, as the reader finds it.
const fieldOf = (world: WebWorld, label: string): Locator =>
  dialogOf(world).getByLabel(label, { exact: true });

Then(
  /^the (?:competition|player|team player|test|score) dialog does not ask for "([^"]*)"$/,
  async function (this: WebWorld, label: string) {
    await dialogOf(this).waitFor();
    await eventually(this, async () => {
      assert.equal(await fieldOf(this, label).count(), 0);
    });
  },
);

// Which field comes after which, by the words each is labelled with, in the
// order the reader comes to them.
Then(
  /^the field after "([^"]*)" in the (?:player|team player|competition|test) dialog is "([^"]*)"$/,
  async function (this: WebWorld, before: string, label: string) {
    await dialogOf(this).waitFor();
    await eventually(this, async () => {
      // A box to tick is a field too, and is read in the order it is met
      // among the others.
      const labels = (
        await dialogOf(this)
          .locator(".field-label, .field-tick")
          .allTextContents()
      ).map((text) => text.trim());
      assert.equal(
        labels[labels.indexOf(before) + 1],
        label,
        `The fields are ${JSON.stringify(labels)}.`,
      );
    });
  },
);

// Its kind ---------------------------------------------------------------------

Given(
  "the kind {string} is chosen",
  async function (this: WebWorld, kind: string) {
    await fieldOf(this, kind).check();
  },
);

When(
  "the kind of competition is chosen to be a knockout",
  async function (this: WebWorld) {
    await dialogOf(this).locator("#field-kind-knockout").check();
  },
);

Then(
  "the kind {string} is offered",
  async function (this: WebWorld, kind: string) {
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
  async function (this: WebWorld, kind: string) {
    await eventually(this, async () => {
      assert.equal(await fieldOf(this, kind).isChecked(), true);
    });
  },
);

// Pressed by its words as much as by its button, so the whole of what can be
// pressed is measured: the label the button is in.
Then(
  "the kind {string} is at least {int} pixels tall",
  async function (this: WebWorld, kind: string, pixels: number) {
    await dialogOf(this).waitFor();
    // The label the kind's button is in.
    const box = await fieldOf(this, kind).locator("xpath=..").boundingBox();
    assert.ok(box !== null, "It is not laid out.");
    assert.ok(box.height >= pixels, `It is ${String(box.height)} pixels tall.`);
  },
);

// Its tie break ------------------------------------------------------------------

const tieBreakOf = (world: WebWorld): Locator => fieldOf(world, "Tie Breaks");

Given(
  "the tie break {string} is chosen",
  async function (this: WebWorld, tieBreak: string) {
    await tieBreakOf(this).selectOption({ label: tieBreak });
  },
);

Then(
  "the tie break {string} is offered",
  async function (this: WebWorld, tieBreak: string) {
    await dialogOf(this).waitFor();
    const offered = (
      await tieBreakOf(this).locator("option").allInnerTexts()
    ).map((each) => each.trim());
    assert.ok(offered.includes(tieBreak), `${tieBreak} is not offered.`);
  },
);

// Found by its place and not by its words, which are in another language where
// a scenario is about the words.
When("the box for Advantage is ticked", async function (this: WebWorld) {
  await dialogOf(this).locator("#field-advantage").check();
});

Then(
  "the tie break {string} is not offered",
  async function (this: WebWorld, tieBreak: string) {
    await dialogOf(this).waitFor();
    const offered = (
      await tieBreakOf(this).locator("option").allInnerTexts()
    ).map((each) => each.trim());
    assert.ok(!offered.includes(tieBreak), `${tieBreak} is offered.`);
  },
);

Then(
  "the tie break chosen is {string}",
  async function (this: WebWorld, tieBreak: string) {
    await eventually(this, async () => {
      assert.equal(
        (
          await tieBreakOf(this).evaluate(
            (select) =>
              (
                select as unknown as {
                  selectedOptions: { textContent: string }[];
                }
              ).selectedOptions[0]?.textContent ?? "",
          )
        ).trim(),
        tieBreak,
      );
    });
  },
);

// Its places ----------------------------------------------------------------------

const placesOf = (world: WebWorld): Locator => fieldOf(world, "Places");

const placesOffered = async (world: WebWorld): Promise<string[]> =>
  (await placesOf(world).locator("option").allInnerTexts()).map((each) =>
    each.trim(),
  );

Given(
  "{int} places are chosen",
  async function (this: WebWorld, places: number) {
    await placesOf(this).selectOption({ label: String(places) });
  },
);

Then(
  "{int} places are offered",
  async function (this: WebWorld, places: number) {
    assert.ok(
      (await placesOffered(this)).includes(String(places)),
      `${places} places are not offered.`,
    );
  },
);

Then(
  "{int} numbers of places are offered",
  async function (this: WebWorld, count: number) {
    assert.equal((await placesOffered(this)).length, count);
  },
);

Then(
  "the places chosen are {int}",
  async function (this: WebWorld, places: number) {
    await eventually(this, async () => {
      assert.equal(await placesOf(this).inputValue(), String(places));
    });
  },
);

// Its rounds ----------------------------------------------------------------------

// The group the rounds are asked for in, found as a screen reader finds it: a
// group, by the words it is named with.
const roundsUnder = (world: WebWorld, heading: string): Locator =>
  dialogOf(world).getByRole("group", { name: heading, exact: true });

Then(
  "the rounds are asked for under {string}",
  async function (this: WebWorld, heading: string) {
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
  async function (this: WebWorld, round: number, name: string) {
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

const status = (world: WebWorld): Locator =>
  dialogOf(world).locator('[role="status"]');

Given(
  "a name of {int} characters is typed as the {string}",
  async function (this: WebWorld, count: number, label: string) {
    await fieldOf(this, label).fill("a".repeat(count));
  },
);

Then(
  "the competition dialog says {string} was added",
  async function (this: WebWorld, name: string) {
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
  async function (this: WebWorld) {
    await eventually(this, async () => {
      assert.equal((await status(this).innerText()).trim(), "");
    });
  },
);

// A status is read out when what it says changes, without the reader being
// taken to it.
Then(
  "what the competition dialog says about what was added is announced",
  async function (this: WebWorld) {
    await eventually(this, async () => {
      assert.ok((await status(this).innerText()).trim() !== "");
    });
  },
);

When(
  "the way to add a competition is pressed",
  async function (this: WebWorld) {
    await tabPanel(this).locator("section > p button").first().click();
  },
);

When(
  "{string} is typed into the competition's name",
  async function (this: WebWorld, words: string) {
    await dialogOf(this).locator("#field-name").fill(words);
  },
);

Then(
  "every word in the competition dialog is in the test locale",
  async function (this: WebWorld) {
    await dialogOf(this).waitFor();
    const stray = await unmarkedWithin(this, open);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// The competition's name is filled into what the dialog says, and read inside
// its marks with it.
Then(
  "every word in the competition dialog but the competition's name is in the test locale",
  async function (this: WebWorld) {
    await eventually(this, async () => {
      assert.ok((await status(this).innerText()).trim() !== "");
    });
    const stray = await unmarkedWithin(this, open);
    assert.deepEqual(stray, [], "Words in the dialog came from elsewhere.");
  },
);

// What is said above the fields, about no one of them, by its code. The score
// dialog says it the same way, so the one step reads either.
Then(
  /^the (?:competition|score) dialog says "([^"]*)" above the fields$/,
  async function (this: WebWorld, code: string) {
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
  world: WebWorld,
  tournament: string,
): Promise<readonly KeptCompetition[]> =>
  (await keptOf(world, tournament)).competitions;

const rulesOf = async (
  world: WebWorld,
  tournament: string,
  name: string,
): Promise<KeptCompetition["rules"]> => {
  let found: KeptCompetition | undefined;
  await eventually(world, async () => {
    found = (await competitionsOf(world, tournament)).find(
      (each) => each.name === name,
    );
    assert.ok(found !== undefined, `${tournament} has no competition ${name}.`);
  });
  assert.ok(found !== undefined);
  return found.rules;
};

Then(
  /^the competition "([^"]*)" of "([^"]*)" (is|is not) played under handicap$/,
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    is: string,
  ) {
    await retried(async () => {
      assert.equal(
        (await rulesOf(this, tournament, name)).handicap,
        is === "is",
      );
    });
  },
);

Then(
  /^the competition "([^"]*)" of "([^"]*)" (allows|does not allow) drawn results$/,
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    allows: string,
  ) {
    await retried(async () => {
      assert.equal(
        (await rulesOf(this, tournament, name)).drawsAllowed,
        allows === "allows",
      );
    });
  },
);

Then(
  /^the competition "([^"]*)" of "([^"]*)" (counts|does not count) towards the world rankings$/,
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    counts: string,
  ) {
    await retried(async () => {
      assert.equal(
        (await rulesOf(this, tournament, name)).worldRankings,
        counts === "counts",
      );
    });
  },
);

const shapeOf = async (
  world: WebWorld,
  tournament: string,
  name: string,
): Promise<KeptCompetition> => {
  let found: KeptCompetition | undefined;
  await eventually(world, async () => {
    found = (await competitionsOf(world, tournament)).find(
      (each) => each.name === name,
    );
    assert.ok(found !== undefined, `${tournament} has no competition ${name}.`);
  });
  assert.ok(found !== undefined);
  return found;
};

// A knockout's draw, where the competition is one.
const drawOf = async (world: WebWorld, tournament: string, name: string) => {
  const shape = await shapeOf(world, tournament, name);
  assert.equal(shape.kind, "knockout", `${name} is a ${shape.kind}.`);
  return {
    places: shape.places,
    rounds: (shape.drawRounds ?? []).map((games) => ({ games })),
  };
};

Then(
  "{string} has the competition {string}",
  async function (this: WebWorld, tournament: string, name: string) {
    await retried(async () => {
      await shapeOf(this, tournament, name);
    });
  },
);

// Once nothing more can be sent: the dialog closed, or the page settled.
Then(
  "{string} has no competitions",
  async function (this: WebWorld, tournament: string) {
    await eventually(this, async () => {
      assert.equal((await competitionsOf(this, tournament)).length, 0);
    });
  },
);

Then(
  /^the competition "([^"]*)" of "([^"]*)" is a (block|knockout|Swiss)$/,
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    kind: string,
  ) {
    await retried(async () => {
      assert.equal(
        (await shapeOf(this, tournament, name)).kind,
        kind.toLowerCase(),
      );
    });
  },
);

Then(
  "each match of the competition {string} of {string} is the best of {int}",
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    games: number,
  ) {
    await retried(async () => {
      const shape = await shapeOf(this, tournament, name);
      assert.notEqual(shape.kind, "knockout", `${name} is a knockout.`);
      if (shape.kind !== "knockout") assert.equal(shape.bestOf, games);
    });
  },
);

Then(
  "the competition {string} of {string} is played in {int} round(s)",
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    rounds: number,
  ) {
    await retried(async () => {
      const shape = await shapeOf(this, tournament, name);
      assert.equal(shape.kind, "block", `${name} is a ${shape.kind}.`);
      if (shape.kind === "block") assert.equal(shape.rounds, rounds);
    });
  },
);

Then(
  "the competition {string} of {string} goes by the tie break {string}",
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    code: string,
  ) {
    await retried(async () => {
      const shape = await shapeOf(this, tournament, name);
      assert.equal(shape.kind, "block", `${name} is a ${shape.kind}.`);
      if (shape.kind === "block") assert.equal(shape.tieBreak, code);
    });
  },
);

Then(
  "the knockout {string} of {string} has {int} places",
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    places: number,
  ) {
    await retried(async () => {
      assert.equal((await drawOf(this, tournament, name)).places, places);
    });
  },
);

Then(
  /^the (first|second) round of the knockout "([^"]*)" of "([^"]*)" is the best of (\d+)$/,
  async function (
    this: WebWorld,
    round: string,
    name: string,
    tournament: string,
    games: number,
  ) {
    await retried(async () => {
      const rounds = (await drawOf(this, tournament, name)).rounds;
      assert.equal(
        rounds[round === "first" ? 0 : 1]?.games,
        Number(games),
        `The rounds are the best of ${rounds.map((each) => String(each.games)).join(", ")}.`,
      );
    });
  },
);

Then(
  /^the competition "([^"]*)" of "([^"]*)" has a maximum of (\d+) hoops$/,
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    hoops: string,
  ) {
    await retried(async () => {
      assert.equal(
        (await rulesOf(this, tournament, name)).maximumHoops,
        Number(hoops),
      );
    });
  },
);

Then(
  /^the competition "([^"]*)" of "([^"]*)" has no maximum number of hoops$/,
  async function (this: WebWorld, name: string, tournament: string) {
    await retried(async () => {
      assert.equal((await rulesOf(this, tournament, name)).maximumHoops, null);
    });
  },
);

// The dialog that adds a losers knockout, open over this one, which is the
// last of the open dialogs.
const overOf = (world: WebWorld): Locator =>
  world.browserPage.locator(open).last();

Then(
  "the competition dialog offers {string}",
  async function (this: WebWorld, button: string) {
    await dialogOf(this).waitFor();
    await dialogOf(this)
      .getByRole("button", { name: button, exact: true })
      .waitFor();
  },
);

Then(
  "the competition dialog does not offer {string}",
  async function (this: WebWorld, button: string) {
    await dialogOf(this).waitFor();
    await eventually(this, async () => {
      assert.equal(
        await dialogOf(this)
          .getByRole("button", { name: button, exact: true })
          .count(),
        0,
      );
    });
  },
);

// Given and When alike: Cucumber does not tell them apart.
Given(
  "{string} is pressed in the competition dialog",
  async function (this: WebWorld, button: string) {
    await dialogOf(this)
      .getByRole("button", { name: button, exact: true })
      .click();
  },
);

Then(
  "the dialog open over the competition dialog is titled {string}",
  async function (this: WebWorld, title: string) {
    await eventually(this, async () => {
      assert.equal(await this.browserPage.locator(open).count(), 2);
      assert.equal(
        (await overOf(this).locator(".dialog-title").innerText()).trim(),
        title,
      );
    });
  },
);

Given(
  "{string} is typed in the losers dialog",
  async function (this: WebWorld, name: string) {
    await overOf(this).locator("input[type=text]").fill(name);
  },
);

When(
  "{string} is pressed in the losers dialog",
  async function (this: WebWorld, button: string) {
    await overOf(this)
      .locator(".dialog-buttons button")
      .filter({ hasText: new RegExp(`^${button}$`) })
      .click();
    // Add closes it once the knockout is kept, so what follows is not read
    // before then.
    await this.browserPage.locator(open).nth(1).waitFor({ state: "detached" });
  },
);

Then(
  "the competition dialog is the only dialog open",
  async function (this: WebWorld) {
    await eventually(this, async () => {
      assert.equal(await this.browserPage.locator(open).count(), 1);
      assert.equal(
        (await dialogOf(this).locator(".dialog-title").innerText()).trim(),
        "Edit Competition",
      );
    });
  },
);

Then(
  "the knockout {string} of {string} takes the losers of the first round of {string}",
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    from: string,
  ) {
    await eventually(this, async () => {
      const all = await competitionsOf(this, tournament);
      const found = all.find((each) => each.name === name);
      const source = all.find((each) => each.name === from);
      assert.ok(
        found?.kind === "knockout" && source !== undefined,
        `The competitions are ${JSON.stringify(all.map((each) => each.name))}.`,
      );
      assert.equal(found.losersOf?.competitionId, source.id);
      assert.equal(found.losersOf.round, 0);
    });
  },
);

// The losers knockouts asked for while adding a knockout, listed in the dialog.
const askedOf = (world: WebWorld): Locator =>
  dialogOf(world).locator('[data-listed="losers-asked"] .listed-item');

Then(
  /^the competition dialog (lists|does not list) the losers knockout "([^"]*)"(?: for "([^"]*)")?$/,
  async function (
    this: WebWorld,
    lists: string,
    name: string,
    round: string | undefined,
  ) {
    await dialogOf(this).waitFor();
    await eventually(this, async () => {
      const rows = (await askedOf(this).allInnerTexts()).map((each) =>
        each.replace(/\s+/g, " ").trim(),
      );
      const found = rows.some(
        (row) => row.startsWith(name) && row.includes(round ?? ""),
      );
      assert.equal(found, lists === "lists", `Listed: ${JSON.stringify(rows)}`);
    });
  },
);

When(
  "{string} is chosen as the round of the losers knockout asked for",
  async function (this: WebWorld, round: string) {
    await overOf(this).locator("select").selectOption({ label: round });
  },
);

When(
  "{string} is pressed on the losers knockout {string}",
  async function (this: WebWorld, button: string, name: string) {
    await askedOf(this)
      .filter({ hasText: name })
      .getByRole("button", { name: button, exact: true })
      .click();
  },
);

Then(
  "the tournament {string} has only the competition {string}",
  async function (this: WebWorld, tournament: string, name: string) {
    await eventually(this, async () => {
      assert.deepEqual(
        (await competitionsOf(this, tournament)).map((each) => each.name),
        [name],
      );
    });
  },
);

Then("the places cannot be chosen", async function (this: WebWorld) {
  await dialogOf(this).waitFor();
  await eventually(this, async () => {
    assert.equal(await placesOf(this).isDisabled(), true);
  });
});

Then("the places can be chosen", async function (this: WebWorld) {
  await dialogOf(this).waitFor();
  await eventually(this, async () => {
    assert.equal(await placesOf(this).isEnabled(), true);
  });
});
