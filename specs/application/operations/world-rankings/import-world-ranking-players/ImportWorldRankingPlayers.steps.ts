// Importing the players the world rankings know
// (ImportWorldRankingPlayers.feature), through the application's accounts
// and a fake of the rankings' site, both stood up by support of their own.
// What the import reports is kept in the order it reports it.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type ImportReport,
  ImportWorldRankingPlayers,
} from "../../../../../src/application/operations/world-rankings/ImportWorldRankingPlayers.js";
import { Refused } from "../../../../../src/domain/common/Refused.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountAt,
  keepingWhatCameOf,
  momentOf,
  registeringOf,
} from "../../accounts/roleRequests.js";

// The administrator every scenario's Background names, who imports where a
// scenario says only that the players have been imported.
const ADMINISTRATOR = "admin@example.com";

// Everything the last import reported, in order.
const reported = new WeakMap<SpecWorld, ImportReport[]>();

const importAs = async (world: SpecWorld, address: string): Promise<void> => {
  const reports: ImportReport[] = [];
  reported.set(world, reports);
  const asking = await accountAt(world, address);
  await keepingWhatCameOf(world, () =>
    registeringOf(world).importWorldRankingPlayers(
      new ImportWorldRankingPlayers(
        asking.id.value,
        (report) => reports.push(report),
        momentOf(world),
      ),
    ),
  );
};

When(
  "the reader signed in to the account for {string} imports the world ranking players",
  async function (this: SpecWorld, address: string) {
    await importAs(this, address);
  },
);

Given(
  "the world ranking players have been imported",
  async function (this: SpecWorld) {
    await importAs(this, ADMINISTRATOR);
    assert.equal(this.failure, undefined, "The import was refused.");
  },
);

Then(
  "the import is refused with {string}",
  function (this: SpecWorld, code: string) {
    assert.ok(
      this.failure instanceof Refused,
      `Expected a refusal, and got ${inspect(this.failure)}.`,
    );
    assert.equal(this.failure.code, code);
  },
);

Then("the import made no reports", function (this: SpecWorld) {
  assert.deepEqual(reported.get(this), []);
});

// A report by its place, as a scenario names it.
const PLACES = ["first", "second", "third", "fourth", "fifth", "sixth"];

const reportAt = (world: SpecWorld, place: string): ImportReport => {
  const reports = reported.get(world);
  assert.ok(reports !== undefined, "Nothing has been imported.");
  const report =
    place === "last" ? reports.at(-1) : reports[PLACES.indexOf(place)];
  assert.ok(
    report !== undefined,
    `There is no ${place} report among ${inspect(reports)}.`,
  );
  return report;
};

const sportOf = (name: string): string =>
  name === "association croquet" ? "ac" : "gc";

const PLACE = "(first|second|third|fourth|fifth|sixth|last)";
const SPORT = "(association croquet|golf croquet)";

Then(
  new RegExp(
    `^the import's ${PLACE} report is that the ${SPORT} list is being read$`,
  ),
  function (this: SpecWorld, place: string, sport: string) {
    assert.deepEqual(reportAt(this, place), {
      kind: "reading",
      sport: sportOf(sport),
    });
  },
);

Then(
  new RegExp(
    `^the import's ${PLACE} report is that (\\d+) ${SPORT} players? (?:was|were) (read|kept)$`,
  ),
  function (
    this: SpecWorld,
    place: string,
    players: number,
    sport: string,
    kind: string,
  ) {
    assert.deepEqual(reportAt(this, place), {
      kind,
      sport: sportOf(sport),
      players,
    });
  },
);

Then(
  new RegExp(
    `^the import's ${PLACE} report is that the ${SPORT} list was refused with "([^"]*)"$`,
  ),
  function (this: SpecWorld, place: string, sport: string, code: string) {
    assert.deepEqual(reportAt(this, place), {
      kind: "refused",
      sport: sportOf(sport),
      code,
    });
  },
);

Then(
  new RegExp(`^the import's ${PLACE} report is that it has finished$`),
  function (this: SpecWorld, place: string) {
    assert.deepEqual(reportAt(this, place), { kind: "finished" });
  },
);
