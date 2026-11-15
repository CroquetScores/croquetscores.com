import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import { fileNameOf, givenTo, isAFile, linesRead, request } from "./theFile.js";

// The file asked for, and the lines of it a scenario reads. Which kind of file
// it is says how its lines are had (rankingsTextFile.steps.ts,
// rankingsWorkbook.steps.ts); the words for a line are the same for both.

// What is asked for ------------------------------------------------------------------

When(
  "the address {string} is requested",
  async function (this: WebWorld, path: string) {
    await request(this, path);
  },
);

// The tournament the scenario made last, by where it is now found, since a
// name too long to say twice is not worth typing in the address.
When(
  "the address of that tournament's rankings is requested",
  async function (this: WebWorld) {
    const last = this.lastTournament;
    assert.ok(last !== undefined, "No tournament was made.");
    const address = this.tournaments.get(last)?.address;
    await request(this, `/${address}/rankings`);
  },
);

// Whether a file is given -------------------------------------------------------------

Then("a file is given", function (this: WebWorld) {
  const given = givenTo(this);
  assert.ok(isAFile(given), `Status ${String(given.status)}, not a file.`);
});

Then("no file is given", function (this: WebWorld) {
  assert.equal(isAFile(givenTo(this)), false);
});

Then("the file given is a text file", function (this: WebWorld) {
  assert.match(givenTo(this).headers.get("content-type") ?? "", /^text\/plain/);
});

Then("the file given is a spreadsheet", function (this: WebWorld) {
  assert.match(
    givenTo(this).headers.get("content-type") ?? "",
    /spreadsheetml\.sheet$/,
  );
});

Then(
  "the file given is called {string}",
  function (this: WebWorld, name: string) {
    assert.equal(fileNameOf(givenTo(this)), name);
  },
);

Then("the address given is {string}", function (this: WebWorld, path: string) {
  assert.equal(givenTo(this).path, path);
});

// What the page that says why holds ---------------------------------------------------

Then(
  "the page names the tournament {string}",
  async function (this: WebWorld, name: string) {
    const shown = await this.browserPage.locator("main").innerText();
    assert.ok(shown.includes(name), `The page says ${JSON.stringify(shown)}.`);
  },
);

// The tournament's own name in the bar above, which leads to its page.
When(
  "the link {string} is pressed",
  async function (this: WebWorld, name: string) {
    await this.browserPage
      .getByRole("link", { name, exact: true })
      .first()
      .click();
    await this.browserPage.waitForLoadState();
  },
);

// A tournament put back --------------------------------------------------------------

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
  "seventeenth",
  "eighteenth",
];

const ORDINAL = `(${ordinals.join("|")})`;

const lineAt = (world: WebWorld, which: string): string => {
  const at = ordinals.indexOf(which);
  assert.ok(at >= 0, `There is no ${which} line.`);
  const line = linesRead(world)[at];
  assert.ok(line !== undefined, `The file has no ${which} line.`);
  return line.text;
};

Then(
  new RegExp(`^the ${ORDINAL} line is "(.*)"$`),
  function (this: WebWorld, which: string, text: string) {
    assert.equal(lineAt(this, which).trimEnd(), text);
  },
);

Then(
  new RegExp(`^the ${ORDINAL} line is blank$`),
  function (this: WebWorld, which: string) {
    assert.equal(lineAt(this, which), "");
  },
);

Then(
  new RegExp(`^the ${ORDINAL} line is in bold$`),
  function (this: WebWorld, which: string) {
    const line = linesRead(this)[ordinals.indexOf(which)];
    assert.ok(line?.bold === true, `The ${which} line is not in bold.`);
  },
);

Then(
  new RegExp(`^the ${ORDINAL} line starts "(.*)"$`),
  function (this: WebWorld, which: string, start: string) {
    assert.ok(
      lineAt(this, which).startsWith(start),
      `The ${which} line is ${JSON.stringify(lineAt(this, which))}.`,
    );
  },
);

Then(
  new RegExp(`^the ${ORDINAL} line ends "(.*)"$`),
  function (this: WebWorld, which: string, end: string) {
    assert.ok(
      lineAt(this, which).endsWith(end),
      `The ${which} line is ${JSON.stringify(lineAt(this, which))}.`,
    );
  },
);
