import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { CompetitionMoved } from "../../../src/domain/aggregates/tournaments/events/CompetitionMoved.js";
import { accountsOf } from "../../infrastructure/support/accounts.js";
import type { SpecWorld } from "../../support/world.js";
import { ManagerNoteId } from "../../../src/domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import { importDatabaseOf } from "../importing.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import {
  type WrittenCompetition,
  competitionKeptFor,
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

// A block of a tournament of its own ---------------------------------------------

Then(
  "the competition kept for {string} on {string} is in a tournament called {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    const { tournament } = await competitionKeptFor(this, id, website);
    assert.equal(tournament.name.toString(), name);
  },
);

Then(
  "the competition kept for {string} on {string} is in a tournament not played by teams",
  async function (this: SpecWorld, id: string, website: string) {
    const { tournament } = await competitionKeptFor(this, id, website);
    assert.equal(tournament.format.isTeamFormat, false);
  },
);

Then(
  "the competition kept for {string} on {string} is in a tournament that starts and finishes as the tournament kept for {string} on {string}",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    oldId: string,
    oldWebsite: string,
  ) {
    const { tournament } = await competitionKeptFor(this, id, website);
    const old = await tournamentKeptFor(this, oldId, oldWebsite);
    assert.equal(
      tournament.starts.toDate().getTime(),
      old.starts.toDate().getTime(),
    );
    assert.equal(
      tournament.finishes.toDate().getTime(),
      old.finishes.toDate().getTime(),
    );
  },
);

Then(
  "no competition of the tournament kept for {string} on {string} is called {string}",
  async function (this: SpecWorld, id: string, website: string, name: string) {
    assert.ok(!(await competitionNames(this, id, website)).includes(name));
  },
);

Then(
  "the competitions kept for {string} and {string} on {string} are in the same tournament",
  async function (
    this: SpecWorld,
    one: string,
    other: string,
    website: string,
  ) {
    const first = await competitionKeptFor(this, one, website);
    const second = await competitionKeptFor(this, other, website);
    assert.equal(first.tournament.id.value, second.tournament.id.value);
  },
);

// The notes it wrote -------------------------------------------------------------

Then(
  "the tournament kept for {string} on {string} is managed by the account for {string}",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    address: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    const found = await this.asARequest(() =>
      accountsOf(this).readModel.find(EmailAddress.from(address)),
    );
    assert.ok(found !== undefined, `No account is reached at ${address}.`);
    assert.ok(tournament.manages(found), `${address} is not a manager.`);
  },
);

const noteCalled = async (
  world: SpecWorld,
  id: string,
  website: string,
  title: string,
) => {
  const tournament = await tournamentKeptFor(world, id, website);
  const { managerNotes, managerNotesByTournament } = importingOf(world);
  const headings = await world.asARequest(() =>
    managerNotesByTournament.of(tournament.id),
  );
  const heading = headings.find((each) => each.title === title);
  return { heading, managerNotes };
};

Then(
  "the tournament kept for {string} on {string} has a note called {string}",
  async function (this: SpecWorld, id: string, website: string, title: string) {
    const { heading } = await noteCalled(this, id, website, title);
    assert.ok(heading !== undefined, `It has no note called ${title}.`);
  },
);

Then(
  "the tournament kept for {string} on {string} has no note",
  async function (this: SpecWorld, id: string, website: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    const { managerNotesByTournament } = importingOf(this);
    const headings = await this.asARequest(() =>
      managerNotesByTournament.of(tournament.id),
    );
    assert.deepEqual(headings, []);
  },
);

Then(
  "the note called {string} of the tournament kept for {string} on {string} says {string}",
  async function (
    this: SpecWorld,
    title: string,
    id: string,
    website: string,
    says: string,
  ) {
    const { heading, managerNotes } = await noteCalled(
      this,
      id,
      website,
      title,
    );
    assert.ok(heading !== undefined, `It has no note called ${title}.`);
    const note = await this.asARequest(() =>
      managerNotes.load(ManagerNoteId.from(heading.id)),
    );
    const description = note?.description?.toString() ?? "";
    assert.ok(
      description.includes(says),
      `The note does not say ${says}: ${description}`,
    );
  },
);
