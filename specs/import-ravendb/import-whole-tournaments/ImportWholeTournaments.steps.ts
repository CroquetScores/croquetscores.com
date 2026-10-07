import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { CompetitionMoved } from "../../../src/domain/aggregates/tournaments/events/CompetitionMoved.js";
import { accountsOf } from "../../infrastructure/support/accounts.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";
import {
  type WrittenCompetition,
  importTournamentCalled,
  importingOf,
  tournamentKeptFor,
  writtenSites,
} from "../importingTournaments.js";

const tournamentWrittenLast = (world: SpecWorld) => {
  const { tournament } = importingOf(world);
  assert.ok(tournament !== undefined, "No tournament has been written.");
  return tournament.document;
};

Given(
  "the tournament lists {string}",
  function (this: SpecWorld, competition: string) {
    tournamentWrittenLast(this).Competitions.push({ Id: competition });
  },
);

Given("the tournament lists nothing", function (this: SpecWorld) {
  tournamentWrittenLast(this).Competitions.length = 0;
});

// Named by its document, since a scenario here writes more than one.
Given(
  /^the (?:block|knockout|Swiss|team match) "(.*)" is called "(.*)"$/,
  function (this: SpecWorld, id: string, name: string) {
    const found = writtenSites(this)
      .map((site) => site.find(id))
      .find((document) => document !== undefined);
    assert.ok(found !== undefined, `No document ${id} has been written.`);
    (found as WrittenCompetition).Name = name;
  },
);

When(
  "the tournament {string} on {string} is imported",
  async function (this: SpecWorld, id: string, website: string) {
    await importTournamentCalled(this, id, website);
  },
);

Then(
  "{string} on {string} is kept as a competition of the tournament kept for {string} on {string}",
  async function (
    this: SpecWorld,
    competition: string,
    website: string,
    id: string,
    tournamentWebsite: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, tournamentWebsite);
    const found = await importDatabaseOf(this).findCompetitionOf(
      website,
      competition,
    );
    assert.ok(
      found !== undefined,
      `${competition} is not kept as any competition.`,
    );
    assert.equal(found.tournamentId, tournament.id.value);
    assert.ok(
      tournament.competitions.some(
        ({ reference }) => reference.id.value === found.competitionId,
      ),
      "The tournament does not have it.",
    );
  },
);

// The competitions in use, in the order the tournament lists them.
const competitionNames = async (
  world: SpecWorld,
  id: string,
  website: string,
): Promise<string[]> =>
  (await tournamentKeptFor(world, id, website)).competitions
    .filter(({ reference }) => !reference.archived)
    .map(({ reference }) => reference.name.toString());

Then(
  /^the (first|last) competition of the tournament kept for "(.*)" on "(.*)" is "(.*)"$/,
  async function (
    this: SpecWorld,
    which: string,
    id: string,
    website: string,
    name: string,
  ) {
    const names = await competitionNames(this, id, website);
    assert.equal(
      which === "first" ? names[0] : names.at(-1),
      name,
      names.join(", "),
    );
  },
);

Then(
  "no competition of the tournament kept for {string} on {string} was moved",
  async function (this: SpecWorld, id: string, website: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    const events = await this.asARequest(() =>
      accountsOf(this).store.getEvents(tournament.id),
    );
    assert.equal(
      events.filter((event) => event instanceof CompetitionMoved).length,
      0,
    );
  },
);
