import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  load,
  scenarioOf,
} from "../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../support/world.js";
import { english } from "../../../../src/web/languages/english.js";
import { changeTournament } from "../../support/tournaments.js";
import { fileNameOf, givenTo, isAFile, linesRead, request } from "./theFile.js";

// The file asked for, and the lines of it a scenario reads. Which kind of file
// it is says how its lines are had (rankingsTextFile.steps.ts,
// rankingsWorkbook.steps.ts); the words for a line are the same for both.

// What is asked for ------------------------------------------------------------------

When(
  "the address {string} is requested",
  async function (this: SpecWorld, path: string) {
    await request(this, path);
  },
);

// The tournament the scenario made last, by where it is now found, since a
// name too long to say twice is not worth typing in the address.
When(
  "the address of that tournament's rankings is requested",
  async function (this: SpecWorld) {
    const { looking } = scenarioOf(this);
    assert.ok(looking !== undefined, "No tournament was made.");
    const tournament = await load(this, looking);
    await request(this, `/${tournament.address.toString()}/rankings`);
  },
);

// Whether a file is given -------------------------------------------------------------

Then("a file is given", function (this: SpecWorld) {
  const given = givenTo(this);
  assert.ok(isAFile(given), `Status ${String(given.status)}, not a file.`);
});

Then("no file is given", function (this: SpecWorld) {
  assert.equal(isAFile(givenTo(this)), false);
});

Then("the file given is a text file", function (this: SpecWorld) {
  assert.match(givenTo(this).headers.get("content-type") ?? "", /^text\/plain/);
});

Then("the file given is a spreadsheet", function (this: SpecWorld) {
  assert.match(
    givenTo(this).headers.get("content-type") ?? "",
    /spreadsheetml\.sheet$/,
  );
});

Then(
  "the file given is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(fileNameOf(givenTo(this)), name);
  },
);

Then("the address given is {string}", function (this: SpecWorld, path: string) {
  assert.equal(givenTo(this).path, path);
});

// What the page that says why holds ---------------------------------------------------

Then(
  "the page names the tournament {string}",
  async function (this: SpecWorld, name: string) {
    const shown = await this.browserPage.locator("main").innerText();
    assert.ok(shown.includes(name), `The page says ${JSON.stringify(shown)}.`);
  },
);

// The tournament's own name in the bar above, which leads to its page.
When(
  "the link {string} is pressed",
  async function (this: SpecWorld, name: string) {
    await this.browserPage
      .getByRole("link", { name, exact: true })
      .first()
      .click();
    await this.browserPage.waitForLoadState();
  },
);

Then(
  "the page does not say the words for {string}",
  async function (this: SpecWorld, key: string) {
    const said = english.words[key];
    assert.ok(said !== undefined, `English has no words for ${key}.`);
    const shown = await this.browserPage.locator("main").innerText();
    assert.ok(!shown.includes(said), `The page says ${JSON.stringify(shown)}.`);
  },
);

// A tournament put back --------------------------------------------------------------

Given(
  "the tournament {string} counts towards the world rankings",
  async function (this: SpecWorld, name: string) {
    // Said as the manager would say it, so that a tournament that cannot count
    // is refused here as it is anywhere.
    await changeTournament(this, name, { worldRankings: true });
  },
);

// Lines --------------------------------------------------------------------------------

const ordinals = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelfth",
  "thirteenth",
  "fourteenth",
  "fifteenth",
  "sixteenth",
];

const ORDINAL = `(${ordinals.join("|")})`;

const lineAt = (world: SpecWorld, which: string): string => {
  const at = ordinals.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} line.`);
  const line = linesRead(world)[at];
  assert.ok(line !== undefined, `The file has no ${which} line.`);
  return line.text;
};

Then(
  new RegExp(`^the ${ORDINAL} line is "(.*)"$`),
  function (this: SpecWorld, which: string, text: string) {
    assert.equal(lineAt(this, which).trimEnd(), text);
  },
);

Then(
  new RegExp(`^the ${ORDINAL} line is blank$`),
  function (this: SpecWorld, which: string) {
    assert.equal(lineAt(this, which), "");
  },
);

Then(
  new RegExp(`^the ${ORDINAL} line is in bold$`),
  function (this: SpecWorld, which: string) {
    const line = linesRead(this)[ordinals.indexOf(which)];
    assert.ok(line?.bold === true, `The ${which} line is not in bold.`);
  },
);

Then(
  new RegExp(`^the ${ORDINAL} line starts "(.*)"$`),
  function (this: SpecWorld, which: string, start: string) {
    assert.ok(
      lineAt(this, which).startsWith(start),
      `The ${which} line is ${JSON.stringify(lineAt(this, which))}.`,
    );
  },
);

Then(
  new RegExp(`^the ${ORDINAL} line ends "(.*)"$`),
  function (this: SpecWorld, which: string, end: string) {
    assert.ok(
      lineAt(this, which).endsWith(end),
      `The ${which} line is ${JSON.stringify(lineAt(this, which))}.`,
    );
  },
);
