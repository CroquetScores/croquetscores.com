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
