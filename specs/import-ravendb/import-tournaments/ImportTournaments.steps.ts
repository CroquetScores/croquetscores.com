import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { Account } from "../../../src/domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../src/domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { Tournament } from "../../../src/domain/aggregates/tournaments/Tournament.js";
import { accountsOf } from "../../infrastructure/support/accounts.js";
import type { SpecWorld } from "../../support/world.js";
import { importDatabaseOf } from "../importing.js";
import {
  aTournament,
  startWriting,
  tournamentKeptFor,
  tournamentWritten,
} from "../importingTournaments.js";

// The tournament being written ---------------------------------------------------

Given(
  "a tournament {string} on {string}",
  function (this: SpecWorld, id: string, website: string) {
    startWriting(this, {
      kind: "tournament",
      website,
      id,
      document: aTournament(website, id),
    });
  },
);

Given(
  "the tournament was created by {string}",
  function (this: SpecWorld, user: string) {
    tournamentWritten(this).CreatedBy = { Id: user };
  },
);

Given(
  "the tournament is managed by {string}",
  function (this: SpecWorld, user: string) {
    tournamentWritten(this).Managers.push({ Id: user });
  },
);

Given(
  "the tournament is scored by {string}",
  function (this: SpecWorld, user: string) {
    tournamentWritten(this).Scorers.push({ Id: user });
  },
);

Given(
  "the tournament was called {string}",
  function (this: SpecWorld, name: string) {
    tournamentWritten(this).Name = name;
  },
);

Given(
  "the tournament started on {string}",
  function (this: SpecWorld, day: string) {
    tournamentWritten(this).Start = day;
  },
);

Given(
  "the tournament finished on {string}",
  function (this: SpecWorld, day: string) {
    tournamentWritten(this).Finish = day;
  },
);

Given(
  "the tournament is in the sport {string}",
  function (this: SpecWorld, sport: string) {
    tournamentWritten(this).SportType = sport;
  },
);

Given(
  "the tournament is of the type {string}",
  function (this: SpecWorld, type: string) {
    tournamentWritten(this).TournamentType = type;
  },
);

Given(
  "the tournament's slug is {string}",
  function (this: SpecWorld, slug: string) {
    tournamentWritten(this).Slug = slug;
  },
);

Given(
  "the tournament's time zone is {string}",
  function (this: SpecWorld, timeZone: string) {
    tournamentWritten(this).TimeZoneId = timeZone;
  },
);

Given("the tournament has no time zone", function (this: SpecWorld) {
  tournamentWritten(this).TimeZoneId = null;
});

Given(
  "the tournament's notes were {string}",
  function (this: SpecWorld, notes: string) {
    tournamentWritten(this).Notes = notes;
  },
);

Given("the tournament had no notes", function (this: SpecWorld) {
  tournamentWritten(this).Notes = null;
});

Given(
  /^the tournament (drew|did not draw) level tests$/,
  function (this: SpecWorld, drew: string) {
    tournamentWritten(this).DrawnMatchesAreNotDecidedByNetHoops =
      drew === "drew";
  },
);

Given("the tournament was archived", function (this: SpecWorld) {
  tournamentWritten(this).IsArchived = true;
});

// What it became -----------------------------------------------------------------

Then(
  "{string} on {string} is kept as a tournament",
  async function (this: SpecWorld, id: string, website: string) {
    await tournamentKeptFor(this, id, website);
  },
);

Then(
  "{string} on {string} is kept as left behind",
  async function (this: SpecWorld, id: string, website: string) {
    assert.equal(await importDatabaseOf(this).isLeftBehind(website, id), true);
  },
);

// Each a fact about the tournament, read from it by `reading` and written as
// the feature writes it.
const factOf = (
  pattern: string,
  reading: (tournament: Tournament) => unknown,
): void => {
  Then(
    pattern,
    async function (
      this: SpecWorld,
      id: string,
      website: string,
      said: string,
    ) {
      assert.equal(reading(await tournamentKeptFor(this, id, website)), said);
    },
  );
};

factOf(
  "the tournament kept for {string} on {string} is on {string}",
  (t) => t.website.host,
);
factOf("the tournament kept for {string} on {string} is called {string}", (t) =>
  t.name.toString(),
);
factOf(
  "the tournament kept for {string} on {string} is played in {string}",
  (t) => t.sport.name,
);
factOf(
  "the tournament kept for {string} on {string} is in the format {string}",
  (t) => t.format.name,
);
factOf(
  "the tournament kept for {string} on {string} is found at {string}",
  (t) => t.address.toString(),
);
factOf(
  "the tournament kept for {string} on {string} is in the country {string}",
  (t) => t.country.code,
);
factOf(
  "the tournament kept for {string} on {string} has the notes {string}",
  (t) => t.notes?.markdown,
);

// Moments compared as moments, since a moment can be written more than one way.
const momentOf = (
  pattern: string,
  reading: (tournament: Tournament) => Date,
): void => {
  Then(
    pattern,
    async function (
      this: SpecWorld,
      id: string,
      website: string,
      said: string,
    ) {
      const read = reading(await tournamentKeptFor(this, id, website));
      assert.equal(read.toISOString(), new Date(said).toISOString());
    },
  );
};

momentOf(
  "the tournament kept for {string} on {string} starts at {string}",
  (t) => t.starts.toDate(),
);
momentOf(
  "the tournament kept for {string} on {string} finishes at {string}",
  (t) => t.finishes.toDate(),
);

Then(
  "the tournament kept for {string} on {string} was created at {string}",
  async function (this: SpecWorld, id: string, website: string, said: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    const [created] = await this.asARequest(() =>
      accountsOf(this).store.getEvents(tournament.id),
    );
    assert.ok(created !== undefined, "The tournament has no events.");
    assert.equal(
      created.occurredAt.toISOString(),
      new Date(said).toISOString(),
    );
  },
);

// Each a yes or no about the tournament, read from it by `reading`.
const yesOrNo = (
  pattern: string,
  reading: (tournament: Tournament) => unknown,
  expected: unknown,
): void => {
  Then(pattern, async function (this: SpecWorld, id: string, website: string) {
    assert.equal(reading(await tournamentKeptFor(this, id, website)), expected);
  });
};

yesOrNo(
  "the tournament kept for {string} on {string} is not archived",
  (t) => t.archived,
  false,
);
yesOrNo(
  "the tournament kept for {string} on {string} is in no region",
  (t) => t.region,
  undefined,
);
yesOrNo(
  "the tournament kept for {string} on {string} has no notes",
  (t) => t.notes,
  undefined,
);
yesOrNo(
  "the tournament kept for {string} on {string} does not allow drawn games",
  (t) => t.drawsAllowed,
  false,
);
yesOrNo(
  "the tournament kept for {string} on {string} is not played under handicap",
  (t) => t.handicap,
  false,
);
yesOrNo(
  "the tournament kept for {string} on {string} does not count towards the world rankings",
  (t) => t.worldRankings,
  false,
);
yesOrNo(
  "the tournament kept for {string} on {string} is not a national event",
  (t) => t.national,
  false,
);
yesOrNo(
  "the tournament kept for {string} on {string} is not an international event",
  (t) => t.international,
  false,
);
yesOrNo(
  "the tournament kept for {string} on {string} draws a level test",
  (t) => t.levelTestsDrawn,
  true,
);
yesOrNo(
  "the tournament kept for {string} on {string} decides a level test on net games and hoops",
  (t) => t.levelTestsDrawn,
  false,
);

// Who runs it --------------------------------------------------------------------

const accountAt = async (
  world: SpecWorld,
  address: string,
): Promise<AccountId> => {
  const found = await world.asARequest(() =>
    accountsOf(world).readModel.find(EmailAddress.from(address)),
  );
  assert.ok(found !== undefined, `No account is reached at ${address}.`);
  return found;
};

Then(
  "the tournament kept for {string} on {string} is managed by {string}",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    address: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(tournament.manages(await accountAt(this, address)), true);
  },
);

Then(
  "the tournament kept for {string} on {string} is scored by {string}",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    address: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(tournament.scores(await accountAt(this, address)), true);
  },
);

Then(
  "the tournament kept for {string} on {string} is not scored by {string}",
  async function (
    this: SpecWorld,
    id: string,
    website: string,
    address: string,
  ) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(tournament.scores(await accountAt(this, address)), false);
  },
);

Then(
  /^the tournament kept for "(.*)" on "(.*)" has (\d+) managers?$/,
  async function (this: SpecWorld, id: string, website: string, count: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(tournament.managers.length, Number(count));
  },
);

Then(
  /^the tournament kept for "(.*)" on "(.*)" has (\d+) scorers?$/,
  async function (this: SpecWorld, id: string, website: string, count: string) {
    const tournament = await tournamentKeptFor(this, id, website);
    assert.equal(tournament.scorers.length, Number(count));
  },
);

// Whoever created a tournament is its first manager.
const creatorOf = async (
  world: SpecWorld,
  id: string,
  website: string,
): Promise<AccountId> => {
  const [creator] = (await tournamentKeptFor(world, id, website)).managers;
  assert.ok(creator !== undefined, "The tournament has no manager.");
  return creator;
};

Then(
  "the tournament kept for {string} on {string} was created by a forgotten account",
  async function (this: SpecWorld, id: string, website: string) {
    const creator = await creatorOf(this, id, website);
    const events = await this.asARequest(() =>
      accountsOf(this).store.getEvents(creator),
    );
    assert.equal(Account.rebuiltFrom(creator, events).forgotten, true);
  },
);

Then(
  "{string} and {string} on {string} were created by the same account",
  async function (
    this: SpecWorld,
    one: string,
    other: string,
    website: string,
  ) {
    const first = await creatorOf(this, one, website);
    const second = await creatorOf(this, other, website);
    assert.equal(first.value, second.value);
  },
);

Then(
  "{string} on {string} is kept as a forgotten account",
  async function (this: SpecWorld, user: string, website: string) {
    const kept = await importDatabaseOf(this).findForgottenAccountOf(
      website,
      user,
    );
    assert.ok(
      kept !== undefined,
      `${user} is not kept as a forgotten account.`,
    );
    const id = AccountId.from(kept);
    const events = await this.asARequest(() =>
      accountsOf(this).store.getEvents(id),
    );
    assert.equal(Account.rebuiltFrom(id, events).forgotten, true);
  },
);
