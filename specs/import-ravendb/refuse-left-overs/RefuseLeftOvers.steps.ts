import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { MissingTournaments } from "../../../src/import-ravendb/MissingTournaments.js";
import { RefuseLeftOvers } from "../../../src/import-ravendb/RefuseLeftOvers.js";
import { runImporter } from "../../../src/import-ravendb/runImporter.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";
import {
  importingOf,
  writtenSiteOf,
  writtenSites,
} from "../importingTournaments.js";

// As the import reads them, so that a tournament refused is kept as an error
// against it, as the import keeps one (runImporter.feature).
Given(
  "the tournaments of {string} are read as the import reads them",
  async function (this: SpecWorld, website: string) {
    await runImporter(
      writtenSiteOf(this, website),
      importDatabaseOf(this),
      importingOf(this).importers.whole(website),
      () => undefined,
    );
  },
);

// The documents found naming a missing tournament, by their ids, with the
// tournament each names.
const missings = new WeakMap<SpecWorld, Map<string, string>>();

const missingOf = (world: SpecWorld): Map<string, string> => {
  const found = missings.get(world) ?? new Map<string, string>();
  missings.set(world, found);
  return found;
};

// Every collection whose documents name a tournament, on every old site the
// scenario wrote, as the import reads them once every tournament is read.
When(
  "the documents no tournament took are looked for",
  async function (this: SpecWorld) {
    const { importers } = importingOf(this);
    const database = importDatabaseOf(this);
    const found = missingOf(this);
    const missing: MissingTournaments = {
      missing: (tournamentId, documentId) => {
        found.set(documentId, tournamentId);
        return Promise.resolve();
      },
    };
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
          new RefuseLeftOvers(collection, database, missing),
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

Then(
  "{string} is said to name the missing tournament {string}",
  function (this: SpecWorld, documentId: string, tournamentId: string) {
    assert.equal(missingOf(this).get(documentId), tournamentId);
  },
);

Then(
  "{string} is not said to name a missing tournament",
  function (this: SpecWorld, documentId: string) {
    assert.equal(missingOf(this).has(documentId), false);
  },
);
