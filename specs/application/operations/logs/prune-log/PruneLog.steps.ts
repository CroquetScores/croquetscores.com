// Pruning the server's log (PruneLog.feature), through the mediator "the
// application's server log" stands up. How many entries were removed, or what
// asking was refused with, is kept as everything the mediator answers is.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { PruneLog } from "../../../../../src/application/operations/logs/PruneLog.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountAt,
  keepingWhatCameOf,
  momentOf,
} from "../../accounts/roleRequests.js";

When(
  "the reader signed in to the account for {string} prunes the log",
  async function (this: SpecWorld, reader: string) {
    const asking = await accountAt(this, reader);
    const { mediator } = this;
    assert.ok(mediator !== undefined, "The server log is not stood up.");
    await keepingWhatCameOf(this, () =>
      mediator.send(new PruneLog(asking.id.value, momentOf(this))),
    );
  },
);

Then(
  /^(\d+) entr(?:y|ies) (?:is|are) answered as removed$/,
  function (this: SpecWorld, count: string) {
    assert.equal(this.failure, undefined, "Pruning was refused.");
    assert.equal(this.answer, Number(count));
  },
);

Then(
  "pruning the log is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.equal((this.failure as { code?: string } | undefined)?.code, code);
  },
);
