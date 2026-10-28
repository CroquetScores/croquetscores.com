import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AccountId } from "../../../../../src/domain/aggregates/accounts/AccountId.js";
import { TournamentPlayerId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import { Rounds } from "../../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { BestOf } from "../../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { CompetitionId } from "../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../support/world.js";
import { positionOf } from "../ordinals.js";
import {
  ask,
  byOf,
  competitionNamed,
  createdAs,
  createdAt,
  drawOfPlaces,
  happened,
  now,
  playerNamed,
  rebuild,
  scenarioOf,
  takenOf,
  tournamentOf,
  updateOf,
} from "./aTournament.js";

// The steps more than one of a tournament's features uses: the stream it is
// rebuilt from, rebuilding it, updating it, and what it, its players and its
// competitions are. Each method's own steps are beside its feature, in the
// folder named for it.

// The stream --------------------------------------------------------------

Given(
  "a stream where a tournament was created as {string}",
  function (this: SpecWorld, name: string) {
    createdAs(this, { name });
  },
);

Given(
  "a stream where a tournament was created at {string}",
  function (this: SpecWorld, address: string) {
    createdAt(this, address);
  },
);

Given(
  "a stream where a tournament was created on the website {string}",
  function (this: SpecWorld, website: string) {
    createdAs(this, { website });
  },
);

Given("it was archived", function (this: SpecWorld) {
  happened(this, (tournament) => tournament.archive(byOf(this), now(this)));
});

Given("it was restored", function (this: SpecWorld) {
  happened(this, (tournament) => tournament.restore(byOf(this), now(this)));
});

Given(
  "the player {string} was added to it",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.addPlayer(
        TournamentPlayerId.create(),
        {
          name,
          representing: scenarioOf(this).player.representing,
          handicap: scenarioOf(this).player.handicap,
          worldRankingName: scenarioOf(this).player.worldRankingName,
        },
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the player {string} was archived",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.archivePlayer(
        playerNamed(tournament, name).id,
        false,
        byOf(this),
        now(this),
      ),
    );
  },
);

// A competition a scenario adds without saying how is the best of 1.
Given(
  "the block {string} was added to it",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.addBlock(
        CompetitionId.create(),
        CompetitionName.from(name),
        BestOf.from(1),
        Rounds.from(1),
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the knockout {string} was added to it",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.addKnockout(
        CompetitionId.create(),
        CompetitionName.from(name),
        drawOfPlaces(4),
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the Swiss {string} was added to it",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.addSwiss(
        CompetitionId.create(),
        CompetitionName.from(name),
        BestOf.from(1),
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the competition {string} was archived",
  function (this: SpecWorld, name: string) {
    happened(this, (tournament) =>
      tournament.archiveCompetition(
        competitionNamed(tournament, name).reference.id,
        byOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "the account {string} was made a manager of it",
  function (this: SpecWorld, account: string) {
    happened(this, (tournament) =>
      tournament.addManager(AccountId.from(account), byOf(this), now(this)),
    );
  },
);

Given(
  "the account {string} was taken off its managers",
  function (this: SpecWorld, account: string) {
    happened(this, (tournament) =>
      tournament.removeManager(AccountId.from(account), byOf(this), now(this)),
    );
  },
);

Given(
  "the account {string} was made a scorer of it",
  function (this: SpecWorld, account: string) {
    happened(this, (tournament) =>
      tournament.addScorer(AccountId.from(account), byOf(this), now(this)),
    );
  },
);

Given(
  "the account {string} was taken off its scorers",
  function (this: SpecWorld, account: string) {
    happened(this, (tournament) =>
      tournament.removeScorer(AccountId.from(account), byOf(this), now(this)),
    );
  },
);

Given(
  "the address {string} is taken",
  function (this: SpecWorld, address: string) {
    scenarioOf(this).taken.add(address);
  },
);

// Rebuilding ----------------------------------------------------------------

// A Given in some scenarios and the When in others, and the same step in both.
When("the tournament is rebuilt from the stream", function (this: SpecWorld) {
  rebuild(this);
});

// Updating ------------------------------------------------------------------

Given("the update calls it {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).updating.name = name;
});

When("the tournament is updated", function (this: SpecWorld) {
  const changed = scenarioOf(this).updating;
  ask(this, (tournament) =>
    tournament.update(
      updateOf(this, tournament, changed),
      takenOf(this),
      byOf(this),
      now(this),
    ),
  );
});

Given(
  "the update calls the competition {string}",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).competitionUpdate.name = name;
  },
);

Given(
  "the update makes the competition the best of {int}",
  function (this: SpecWorld, games: number) {
    scenarioOf(this).competitionUpdate.bestOf = games;
  },
);

Given(
  "the update makes the competition played in {int} rounds",
  function (this: SpecWorld, rounds: number) {
    scenarioOf(this).competitionUpdate.rounds = rounds;
  },
);

Given(
  "its {word} round is to be the best of {int}",
  function (this: SpecWorld, ordinal: string, games: number) {
    scenarioOf(this).drawRounds[positionOf(ordinal)] = games;
  },
);

// What the tournament is -----------------------------------------------------

Then(
  "the tournament is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(tournamentOf(this).name.toString(), name);
  },
);

Then(
  "the tournament is on the website {string}",
  function (this: SpecWorld, host: string) {
    assert.equal(tournamentOf(this).website.host, host);
  },
);

Then(
  "the tournament finishes at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(tournamentOf(this).finishes.toISOString(), moment);
  },
);

Then(
  "the tournament is played in the format {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(tournamentOf(this).format.name, name);
  },
);

Then(
  "the tournament is played in the region {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(tournamentOf(this).region?.code, code);
  },
);

Then(
  "the tournament's subtitle is {string}",
  function (this: SpecWorld, subtitle: string) {
    assert.equal(tournamentOf(this).subtitle?.markdown, subtitle);
  },
);

Then("the tournament is archived", function (this: SpecWorld) {
  assert.equal(tournamentOf(this).archived, true);
});

Then("the tournament is not archived", function (this: SpecWorld) {
  assert.equal(tournamentOf(this).archived, false);
});

Then(
  "the tournament is found at {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(tournamentOf(this).address.toString(), address);
  },
);

Then(
  "the tournament has been found at {string}",
  function (this: SpecWorld, address: string) {
    const addresses = tournamentOf(this).addresses.map(String);
    assert.ok(
      addresses.includes(address),
      `It has been found at ${addresses.join(", ")}.`,
    );
  },
);

Then(
  "the tournament has been found at {int} address(es)",
  function (this: SpecWorld, count: number) {
    assert.equal(tournamentOf(this).addresses.length, count);
  },
);

// What its players are -------------------------------------------------------

Then(
  "the tournament has the player {string}",
  function (this: SpecWorld, name: string) {
    playerNamed(tournamentOf(this), name);
  },
);

Then(
  "the tournament's {word} player is {string}",
  function (this: SpecWorld, ordinal: string, name: string) {
    const player = tournamentOf(this).players[positionOf(ordinal)];
    assert.equal(player?.name.toString(), name);
  },
);

Then(
  "the tournament's player {string} represents {string}",
  function (this: SpecWorld, name: string, representing: string) {
    assert.equal(
      playerNamed(tournamentOf(this), name).representing,
      representing,
    );
  },
);

Then(
  "the tournament's player {string} has the world ranking name {string}",
  function (this: SpecWorld, name: string, worldRankingName: string) {
    assert.equal(
      String(playerNamed(tournamentOf(this), name).worldRankingName),
      worldRankingName,
    );
  },
);

Then(
  "the tournament's player {string} has no world ranking name",
  function (this: SpecWorld, name: string) {
    assert.equal(
      playerNamed(tournamentOf(this), name).worldRankingName,
      undefined,
    );
  },
);

Then(
  "the tournament's player {string} flies the flag {string}",
  function (this: SpecWorld, name: string, flag: string) {
    assert.equal(String(playerNamed(tournamentOf(this), name).flag), flag);
  },
);

Then(
  "the tournament's player {string} has the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(String(playerNamed(tournamentOf(this), name).slug), slug);
  },
);

Then(
  "the tournament's player {string} is archived",
  function (this: SpecWorld, name: string) {
    assert.equal(playerNamed(tournamentOf(this), name).archived, true);
  },
);

Then(
  "the tournament's player {string} is not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(playerNamed(tournamentOf(this), name).archived, false);
  },
);

// What its competitions are --------------------------------------------------

Then(
  "the tournament has the competition {string}",
  function (this: SpecWorld, name: string) {
    competitionNamed(tournamentOf(this), name);
  },
);

Then(
  "the tournament's {word} competition is {string}",
  function (this: SpecWorld, ordinal: string, name: string) {
    const competition = tournamentOf(this).competitions[positionOf(ordinal)];
    assert.equal(competition?.reference.name.toString(), name);
  },
);

// A feature names each kind as a reader would, and the tournament by its own
// word for it.
const KINDS: Readonly<Record<string, string>> = {
  block: "block",
  knockout: "knockout",
  Swiss: "swiss",
  test: "test",
};

Then(
  "the tournament's competition {string} is a {word}",
  function (this: SpecWorld, name: string, kind: string) {
    assert.ok(KINDS[kind] !== undefined, `There is no kind ${kind}.`);
    assert.equal(
      competitionNamed(tournamentOf(this), name).shape.kind,
      KINDS[kind],
    );
  },
);

Then(
  "the tournament's competition {string} is the best of {int}",
  function (this: SpecWorld, name: string, games: number) {
    const { shape } = competitionNamed(tournamentOf(this), name);
    assert.ok(
      shape.kind !== "knockout",
      "A knockout is the best of each round.",
    );
    assert.equal(shape.bestOf.games, games);
  },
);

Then(
  "the tournament's competition {string} is played in {int} round(s)",
  function (this: SpecWorld, name: string, rounds: number) {
    const { shape } = competitionNamed(tournamentOf(this), name);
    assert.ok(shape.kind === "block", `${name} is a ${shape.kind}.`);
    assert.equal(shape.rounds.count, rounds);
  },
);

Then(
  "the tournament's competition {string} has a draw of {int} places",
  function (this: SpecWorld, name: string, places: number) {
    const { shape } = competitionNamed(tournamentOf(this), name);
    assert.ok(shape.kind === "knockout", `${name} is a ${shape.kind}.`);
    assert.equal(shape.draw.places, places);
  },
);

Then(
  "the tournament's competition {string} has its {word} round the best of {int}",
  function (this: SpecWorld, name: string, ordinal: string, games: number) {
    const { shape } = competitionNamed(tournamentOf(this), name);
    assert.ok(shape.kind === "knockout", `${name} is a ${shape.kind}.`);
    assert.equal(shape.draw.rounds[positionOf(ordinal)]?.games, games);
  },
);

Then(
  "the tournament's competition {string} has the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).reference.slug.toString(),
      slug,
    );
  },
);

Then(
  "the tournament's competition {string} has the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).reference.order,
      order,
    );
  },
);

Then(
  "the tournament's competition {string} is archived",
  function (this: SpecWorld, name: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).reference.archived,
      true,
    );
  },
);

Then(
  "the tournament's competition {string} is not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(
      competitionNamed(tournamentOf(this), name).reference.archived,
      false,
    );
  },
);

// Who manages and scores it ---------------------------------------------------

Then(
  "the account {string} manages the tournament",
  function (this: SpecWorld, account: string) {
    assert.equal(tournamentOf(this).manages(AccountId.from(account)), true);
  },
);

Then(
  "the account {string} does not manage the tournament",
  function (this: SpecWorld, account: string) {
    assert.equal(tournamentOf(this).manages(AccountId.from(account)), false);
  },
);

Then(
  "the account {string} scores the tournament",
  function (this: SpecWorld, account: string) {
    assert.equal(tournamentOf(this).scores(AccountId.from(account)), true);
  },
);

Then(
  "the account {string} does not score the tournament",
  function (this: SpecWorld, account: string) {
    assert.equal(tournamentOf(this).scores(AccountId.from(account)), false);
  },
);
