// Reading what the import said of one document (ImportErrorKept.feature),
// through the mediator "the application's import errors" stands up.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  ImportErrorKept,
  type ImportErrorOfDocument,
} from "../../../../../src/application/operations/import-errors/ImportErrorKept.js";
import type { SpecWorld } from "../../../../support/world.js";
import { accountAt, keepingWhatCameOf } from "../../accounts/roleRequests.js";

When(
  "the reader signed in to the account for {string} reads the import error of {string}",
  async function (this: SpecWorld, reader: string, documentId: string) {
    const asking = await accountAt(this, reader);
    const { mediator } = this;
    assert.ok(mediator !== undefined, "The import errors are not stood up.");
    await keepingWhatCameOf(this, () =>
      mediator.query(new ImportErrorKept(asking.id.value, documentId)),
    );
  },
);

const answered = (world: SpecWorld): ImportErrorOfDocument => {
  assert.equal(world.failure, undefined, "Reading was refused.");
  return world.answer as ImportErrorOfDocument;
};

const PLACE = "(first|second)";
const placed = (which: string): number => (which === "first" ? 0 : 1);

Then(
  "the document id answered is {string}",
  function (this: SpecWorld, documentId: string) {
    assert.equal(answered(this).documentId, documentId);
  },
);

Then(
  new RegExp(`^the ${PLACE} message answered has the first line "([^"]*)"$`),
  function (this: SpecWorld, which: string, line: string) {
    const message = answered(this).messages[placed(which)];
    assert.equal(message?.split("\n")[0], line);
  },
);

Then(
  new RegExp(`^the ${PLACE} message answered has the second line "([^"]*)"$`),
  function (this: SpecWorld, which: string, line: string) {
    const message = answered(this).messages[placed(which)];
    assert.equal(message?.split("\n")[1], line);
  },
);

Then("{int} message is answered", function (this: SpecWorld, count: number) {
  assert.equal(answered(this).messages.length, count);
});

Then(
  "reading the import error is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal((this.failure as { code?: string } | undefined)?.code, code);
  },
);

const tournamentAnswered = (world: SpecWorld) => {
  const { tournament } = answered(world);
  assert.ok(tournament !== undefined, "No tournament was answered.");
  return tournament;
};

Then(
  "the import error's tournament is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(tournamentAnswered(this).name, name);
  },
);

Then(
  "the import error's tournament is at {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(tournamentAnswered(this).address, address);
  },
);

Then(
  "the import error's tournament was on {string}",
  function (this: SpecWorld, website: string) {
    assert.equal(tournamentAnswered(this).website, website);
  },
);

Then(
  "the import error's competition is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(tournamentAnswered(this).competitionName, name);
  },
);

Then("the import error is of no competition", function (this: SpecWorld) {
  assert.equal(tournamentAnswered(this).competitionName, undefined);
});

Then("the import error is of no tournament", function (this: SpecWorld) {
  assert.equal(answered(this).tournament, undefined);
});

Then(
  /^the import error's document is at "([^"]*)" on the (new|old) site$/,
  function (this: SpecWorld, path: string, which: string) {
    const tournament = tournamentAnswered(this);
    assert.equal(
      which === "new" ? tournament.newSitePath : tournament.oldSitePath,
      path,
    );
  },
);

Then(
  "the import error is said for a person as {string}",
  function (this: SpecWorld, summary: string) {
    assert.deepEqual(answered(this).summaries, [summary]);
  },
);

Then(
  "the import error is said for a person as nothing",
  function (this: SpecWorld) {
    assert.deepEqual(answered(this).summaries, []);
  },
);
