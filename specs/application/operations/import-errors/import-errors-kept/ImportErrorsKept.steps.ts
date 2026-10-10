// Listing the errors the import kept (ImportErrorsKept.feature), through the
// mediator "the application's import errors" stands up. What was answered, or
// what asking was refused with, is kept as everything the mediator answers is.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ImportErrorsKept } from "../../../../../src/application/operations/import-errors/ImportErrorsKept.js";
import type { KeptImportError } from "../../../../../src/application/services/KeptImportErrors.js";
import type { SpecWorld } from "../../../../support/world.js";
import { accountAt, keepingWhatCameOf } from "../../accounts/roleRequests.js";

When(
  "the reader signed in to the account for {string} lists the import errors",
  async function (this: SpecWorld, reader: string) {
    const asking = await accountAt(this, reader);
    const { mediator } = this;
    assert.ok(mediator !== undefined, "The import errors are not stood up.");
    await keepingWhatCameOf(this, () =>
      mediator.query(new ImportErrorsKept(asking.id.value)),
    );
  },
);

const rowsAnswered = (world: SpecWorld): readonly KeptImportError[] => {
  assert.equal(world.failure, undefined, "Listing was refused.");
  return world.answer as readonly KeptImportError[];
};

Then(
  "the first row answered is for the document {string}",
  function (this: SpecWorld, documentId: string) {
    assert.equal(rowsAnswered(this)[0]?.documentId, documentId);
  },
);

Then(
  "the first row answered has the first line {string}",
  function (this: SpecWorld, line: string) {
    assert.equal(rowsAnswered(this)[0]?.firstLine, line);
  },
);

Then("{int} rows are answered", function (this: SpecWorld, count: number) {
  assert.equal(rowsAnswered(this).length, count);
});

Then(
  "listing the import errors is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal((this.failure as { code?: string } | undefined)?.code, code);
  },
);

Then(
  "the first row answered is said for a person as {string}",
  function (this: SpecWorld, summary: string) {
    assert.equal(rowsAnswered(this)[0]?.summary, summary);
  },
);

Then(
  "the first row answered is said for a person as nothing",
  function (this: SpecWorld) {
    assert.equal(rowsAnswered(this)[0]?.summary, undefined);
  },
);
