import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import {
  keepSpreadsheet,
  request,
  rowsRead,
  sheetNameRead,
} from "../rankings/theFile.js";

// Read as a spreadsheet is, by its rows and the columns of each. The words
// for a line are shared with the text file's (rankings.steps.ts); what is here
// is reading it, and what only a spreadsheet has: the columns of a game.

When(
  "the spreadsheet at {string} is read",
  async function (this: WebWorld, path: string) {
    await request(this, path);
    keepSpreadsheet(this);
  },
);

When(
  "the spreadsheet of that tournament's rankings is read",
  async function (this: WebWorld) {
    const last = this.lastTournament;
    assert.ok(last !== undefined, "No tournament was made.");
    const address = this.tournaments.get(last)?.address;
    await request(this, `/${address}/rankings`);
    keepSpreadsheet(this);
  },
);

const places = ["first", "second", "third"];

// A game is a row whose fourth column says "beat".
const gameRow = (world: WebWorld, which: string) => {
  const games = rowsRead(world).filter(
    (cells) => cells.get("D")?.text === "beat",
  );
  const game = games[places.indexOf(which)];
  assert.ok(game !== undefined, `The spreadsheet has no ${which} game.`);
  return game;
};

const columns: readonly (readonly [string, string])[] = [
  ["number", "A"],
  ["winner's family name", "B"],
  ["winner's first name", "C"],
  ["loser's family name", "E"],
  ["loser's first name", "F"],
  ["winner's score", "G"],
  ["loser's score", "H"],
];

for (const [words, column] of columns) {
  Then(
    new RegExp(
      `^the ${words}(?: in)? (?:the )?(first|second|third) game is "(.*)"$`,
    ),
    function (this: WebWorld, which: string, expected: string) {
      assert.equal(gameRow(this, which).get(column)?.text, expected);
    },
  );
}

Then(
  /^the day of the (first|second|third) game is "(.*)"$/,
  function (this: WebWorld, which: string, expected: string) {
    assert.equal(gameRow(this, which).get("I")?.text, expected);
  },
);

Then(
  /^the day of the (first|second|third) game is a date$/,
  function (this: WebWorld, which: string) {
    assert.equal(gameRow(this, which).get("I")?.date, true);
  },
);

// A game has no day where it was read from the address with "rankings".
Then(
  /^the (first|second|third) game has no day$/,
  function (this: WebWorld, which: string) {
    assert.equal(gameRow(this, which).get("I"), undefined);
  },
);

Then(
  /^the number of the (first|second|third) game is "(.*)"$/,
  function (this: WebWorld, which: string, expected: string) {
    assert.equal(gameRow(this, which).get("A")?.text, expected);
  },
);

Then(
  /^the (first|second|third) game says "(.*)"$/,
  function (this: WebWorld, which: string, expected: string) {
    assert.equal(gameRow(this, which).get("D")?.text, expected);
  },
);

// The line a heading or the third line is followed by, said by what it is.
Then(
  /^the (\w+) line is the first game$/,
  function (this: WebWorld, which: string) {
    const ordinals = [
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
      "seventh",
    ];
    const row = rowsRead(this)[ordinals.indexOf(which)];
    assert.ok(row !== undefined, `The spreadsheet has no ${which} line.`);
    assert.equal(row.get("D")?.text, "beat");
    assert.equal(row.get("A")?.text, "1");
  },
);

Then("the sheet is called {string}", function (this: WebWorld, name: string) {
  assert.equal(sheetNameRead(this), name);
});

Then(
  "the sheet is called by {int} characters",
  function (this: WebWorld, length: number) {
    assert.equal(sheetNameRead(this)?.length, length);
  },
);
