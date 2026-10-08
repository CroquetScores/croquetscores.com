// Importing the world ranking player names once the old sites are over
// (ImportWorldRankingPlayerNames.feature), from the fake stood up by "a fake
// of the world rankings" (specs/infrastructure/support/worldRankings.ts), into
// the tables the site keeps them in.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { WorldRankingLists } from "../../../src/application/services/WorldRankingLists.js";
import { PostgresWorldRankingPlayers } from "../../../src/infrastructure/database/PostgresWorldRankingPlayers.js";
import {
  ImportWorldRankingPlayerNames,
  type ListNotRead,
} from "../../../src/import-ravendb/ImportWorldRankingPlayerNames.js";
import { unitOfWorkOf } from "../../infrastructure/support/transactions.js";
import {
  SPORT,
  sportCalled,
} from "../../infrastructure/support/worldRankings.js";
import type { SpecWorld } from "../../support/world.js";

interface Importing {
  readonly importer: ImportWorldRankingPlayerNames;
  notRead?: readonly ListNotRead[];
}

const importings = new WeakMap<SpecWorld, Importing>();

const importingOf = (world: SpecWorld): Importing => {
  const found = importings.get(world);
  assert.ok(
    found !== undefined,
    "No world ranking player names are to be imported.",
  );
  return found;
};

const notReadOf = (world: SpecWorld): readonly ListNotRead[] => {
  const { notRead } = importingOf(world);
  assert.ok(notRead !== undefined, "Nothing has been imported.");
  return notRead;
};

// Asking whatever the scenario has stood up when it is read, since a step
// after this one may have the fake hold a list back, as it does on the site.
Given(
  "the world ranking player names are to be imported",
  function (this: SpecWorld) {
    const lists: WorldRankingLists = {
      playersOf: (sport) => {
        const standing = this.worldRankingLists;
        assert.ok(
          standing !== undefined,
          "There is no fake of the world rankings.",
        );
        return standing.playersOf(sport);
      },
    };
    const unitOfWork = unitOfWorkOf(this);
    importings.set(this, {
      importer: new ImportWorldRankingPlayerNames({
        lists,
        players: new PostgresWorldRankingPlayers(unitOfWork),
        transactions: unitOfWork,
      }),
    });
  },
);

When(
  "the world ranking player names are imported",
  async function (this: SpecWorld) {
    const importing = importingOf(this);
    importing.notRead = await importing.importer.import();
  },
);

Then("no list is named as not read", function (this: SpecWorld) {
  assert.deepEqual(notReadOf(this), []);
});

Then(
  new RegExp(`^the ${SPORT} list is named as not read$`),
  function (this: SpecWorld, sport: string) {
    const notRead = notReadOf(this);
    assert.ok(
      notRead.some((each) => each.sport === sportCalled(sport)),
      `Named ${inspect(notRead)}.`,
    );
  },
);

Then(
  new RegExp(`^the ${SPORT} list is not named as not read$`),
  function (this: SpecWorld, sport: string) {
    const notRead = notReadOf(this);
    assert.ok(
      !notRead.some((each) => each.sport === sportCalled(sport)),
      `Named ${inspect(notRead)}.`,
    );
  },
);

Then(
  new RegExp(`^the ${SPORT} list is named with "([^"]*)"$`),
  function (this: SpecWorld, sport: string, code: string) {
    const notRead = notReadOf(this);
    assert.ok(
      notRead.some(
        (each) => each.sport === sportCalled(sport) && each.code === code,
      ),
      `Named ${inspect(notRead)}.`,
    );
  },
);
