import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../support/world.js";
import {
  keepTextFile,
  linesRead,
  request,
  textGiven,
} from "../rankings/theFile.js";

// Read as a text file is, by its lines. The words for a line are shared with
// the spreadsheet's (rankings.steps.ts); what is here is reading it, and what
// only a text file has.

When(
  "the text file at {string} is read",
  async function (this: WebWorld, path: string) {
    await request(this, path);
    keepTextFile(this, textGiven(this));
  },
);

When(
  "the text file of that tournament's rankings is read",
  async function (this: WebWorld) {
    const last = this.lastTournament;
    assert.ok(last !== undefined, "No tournament was made.");
    const address = this.tournaments.get(last)?.address;
    await request(this, `/${address}/rankings`);
    keepTextFile(this, textGiven(this));
  },
);

Then("the file is empty", function (this: WebWorld) {
  assert.equal(textGiven(this), "");
});

Then("the file has no line {string}", function (this: WebWorld, text: string) {
  assert.ok(
    !linesRead(this).some((line) => line.text.trimEnd() === text),
    `The file has the line ${JSON.stringify(text)}.`,
  );
});
