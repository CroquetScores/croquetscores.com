import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { RefuseLeftOvers } from "../../../src/import-ravendb/RefuseLeftOvers.js";
import { runImporter } from "../../../src/import-ravendb/runImporter.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";
import { importingOf, writtenSites } from "../importingTournaments.js";

// Every collection whose documents name a tournament, on every old site the
// scenario wrote, as the import reads them once every tournament is read.
When(
  "the documents no tournament took are looked for",
  async function (this: SpecWorld) {
    const { importers } = importingOf(this);
    const database = importDatabaseOf(this);
    const collections = [
      importers.players,
      importers.blocks,
      importers.knockouts,
      importers.swisses,
      importers.teamMatches,
      importers.commentaries,
    ].map(({ collection }) => collection);
    for (const site of writtenSites(this)) {
      for (const collection of collections) {
        await runImporter(
          site,
          database,
          new RefuseLeftOvers(collection, database),
          () => undefined,
        );
      }
    }
  },
);

Then(
  /^(\d+) errors? (?:is|are) kept for "(.*)"$/,
  async function (this: SpecWorld, count: string, documentId: string) {
    const kept = await importDatabaseOf(this).errorsFor(documentId);
    assert.equal(kept.length, Number(count), kept.join("; "));
  },
);
