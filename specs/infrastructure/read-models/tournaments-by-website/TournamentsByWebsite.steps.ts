import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { toldOf } from "../../../../src/application/operations/competitions/competitionOperations.js";
import type {
  TournamentOfWebsite,
  TournamentPlayed,
} from "../../../../src/application/operations/tournaments/tournamentsOfWebsite.js";
import type { AccountId } from "../../../../src/domain/aggregates/accounts/AccountId.js";
import {
  Competition,
  type Told,
} from "../../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import type { GamePlayerId } from "../../../../src/domain/aggregates/tournaments/competitions/Game.js";
import { GameId } from "../../../../src/domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { Score } from "../../../../src/domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import { TeamId } from "../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import { TournamentPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { Tournament } from "../../../../src/domain/aggregates/tournaments/Tournament.js";
import { Rounds } from "../../../../src/domain/aggregates/tournaments/value-objects/Rounds.js";
import { BestOf } from "../../../../src/domain/aggregates/tournaments/value-objects/BestOf.js";
import { CompetitionName } from "../../../../src/domain/aggregates/tournaments/value-objects/CompetitionName.js";
import { Countries } from "../../../../src/domain/aggregates/tournaments/value-objects/Countries.js";
import { ExpectedMatches } from "../../../../src/domain/aggregates/tournaments/value-objects/ExpectedMatches.js";
import { KnockoutDraw } from "../../../../src/domain/aggregates/tournaments/value-objects/KnockoutDraw.js";
import { Sport } from "../../../../src/domain/aggregates/tournaments/value-objects/Sport.js";
import { TournamentFilter } from "../../../../src/domain/aggregates/tournaments/value-objects/TournamentFilter.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { Website } from "../../../../src/domain/common/Website.js";
import { TournamentsByWebsite } from "../../../../src/infrastructure/read-models/TournamentsByWebsite.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  at,
  doneTo,
  foundCalled,
  scenarioOf,
  standUp,
  update,
  updated,
} from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";

// What a tournament is, what is done to it and what is found of it are said in
// the words every read model of tournaments shares
// (specs/infrastructure/support/tournamentReadModels.ts). What is here is where
// it is played, its competitions and their games, and what is asked of a
// website.

interface Scenario {
  // Each competition by its name and its tournament's, written "Block A of
  // Spring Open", and each game by its competition and when it was added.
  readonly competitions: Map<string, CompetitionId>;
  readonly games: Map<string, GameId>;
  // What a tournament is to be moved to when it is next updated, by its name.
  readonly moving: Map<string, { country?: string; region?: string }>;
  // How many players have been made, so that each is called something new.
  players: number;
  // What the read model last found, as it found it: the shared steps see only
  // what every read model of tournaments finds.
  found: readonly (TournamentPlayed | TournamentOfWebsite)[];
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const ownScenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      competitions: new Map(),
      games: new Map(),
      moving: new Map(),
      players: 0,
      found: [],
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

const readModelOf = (world: SpecWorld): TournamentsByWebsite => {
  const { readModel } = scenarioOf(world);
  assert.ok(readModel instanceof TournamentsByWebsite);
  return readModel;
};

const competitionNamed = (
  world: SpecWorld,
  competition: string,
  tournament: string,
): CompetitionId => {
  const id = ownScenarioOf(world).competitions.get(
    `${competition} of ${tournament}`,
  );
  assert.ok(id !== undefined, `${tournament} has no ${competition}.`);
  return id;
};

const gameKey = (competition: string, tournament: string, moment: string) =>
  `${competition} of ${tournament} at ${new Date(moment).toISOString()}`;

const gameAdded = (
  world: SpecWorld,
  competition: string,
  tournament: string,
  moment: string,
): GameId => {
  const id = ownScenarioOf(world).games.get(
    gameKey(competition, tournament, moment),
  );
  assert.ok(id !== undefined, `No game was added to ${competition} then.`);
  return id;
};

Given("the tournaments by website read model", function (this: SpecWorld) {
  standUp(this, new TournamentsByWebsite(unitOfWorkOf(this)), {
    country: "nz",
    region: "can",
  });
});

// Where a tournament is played -------------------------------------------------------

const movingOf = (world: SpecWorld, name: string) => {
  const { moving } = ownScenarioOf(world);
  const found = moving.get(name) ?? {};
  moving.set(name, found);
  return found;
};

Given(
  "{string} to be moved to the country {string}",
  function (this: SpecWorld, name: string, country: string) {
    movingOf(this, name).country = country;
  },
);

Given(
  "{string} to be moved to the region {string}",
  function (this: SpecWorld, name: string, region: string) {
    movingOf(this, name).region = region;
  },
);

Given("{string} is updated", async function (this: SpecWorld, name: string) {
  await updated(this, name, movingOf(this, name));
});

// Its competitions and their games -----------------------------------------------------

// A test is between the teams it is named for, which are added with it, in a
// tournament made to be played by teams first, since only one is. A knockout
// is of two places, so that the two players a game is between are drawn to
// meet.
const addCompetition = (
  tournament: Tournament,
  kind: string,
  name: string,
  id: CompetitionId,
  by: AccountId,
): void => {
  if (kind === "block") {
    tournament.addBlock(
      id,
      CompetitionName.from(name),
      BestOf.from(1),
      Rounds.from(1),
      by,
      at,
    );
  } else if (kind === "knockout") {
    tournament.addKnockout(
      id,
      CompetitionName.from(name),
      KnockoutDraw.from(2, [1]),
      by,
      at,
    );
  } else if (kind === "Swiss") {
    tournament.addSwiss(id, CompetitionName.from(name), BestOf.from(1), by, at);
  } else {
    if (!tournament.format.isTeamFormat) {
      update(tournament, { format: "Teams" }, by);
    }
    const [first, second] = name.split(" v ").map((shortName) => {
      const team = TeamId.create();
      tournament.addTeam(team, { name: shortName, shortName }, by, at);
      return team;
    });
    assert.ok(first !== undefined && second !== undefined);
    tournament.addTest(
      id,
      {
        firstTeam: first,
        secondTeam: second,
        starts: tournament.starts,
        finishes: tournament.finishes,
        expectedMatches: ExpectedMatches.from(10),
        bestOf: BestOf.from(1),
      },
      by,
      at,
    );
  }
};

Given(
  /^the (block|knockout|Swiss|test) "(.*)" is added to "(.*)"$/,
  async function (
    this: SpecWorld,
    kind: string,
    competition: string,
    tournament: string,
  ) {
    const id = CompetitionId.create();
    await doneTo(this, tournament, (found, by) => {
      addCompetition(found, kind, competition, id, by);
    });
    ownScenarioOf(this).competitions.set(`${competition} of ${tournament}`, id);
  },
);

// Done to the competition `competition` of `tournament` by whoever created the
// tournament. It is told of itself when it asks rather than once beforehand,
// since adding a game to a test adds the players of its teams first.
const doneToCompetition = async (
  world: SpecWorld,
  competition: string,
  tournament: string,
  doing: (
    found: Competition,
    told: () => Told,
    by: AccountId,
    tournamentOf: Tournament,
  ) => void,
): Promise<void> => {
  const id = competitionNamed(world, competition, tournament);
  const { competitions } = scenarioOf(world);
  await doneTo(world, tournament, async (found, by) => {
    const kept =
      (await competitions.load(id)) ?? Competition.rebuiltFrom(id, []);
    doing(kept, () => toldOf(found, id), by, found);
    await competitions.save(kept);
  });
};

// Between two players made for the game, so that no game is ever refused for
// a match already decided: in a test, a new player of each of its teams, and
// anywhere else, two new players entered in the competition.
const twoPlayers = (
  world: SpecWorld,
  competition: Competition,
  tournament: Tournament,
  id: CompetitionId,
  told: () => Told,
  by: AccountId,
): [GamePlayerId, GamePlayerId] => {
  const scenario = ownScenarioOf(world);
  const named = (): string => {
    scenario.players += 1;
    return `Player ${String(scenario.players)}`;
  };
  const shape = toldOf(tournament, id).shape;
  if (shape.kind === "test") {
    const players = [shape.firstTeam, shape.secondTeam].map((team) => {
      const player = TeamPlayerId.create();
      tournament.addTeamPlayer(team, player, { name: named() }, by, at);
      return player;
    });
    return [players[0]!, players[1]!];
  }
  const players = [named(), named()].map((name) => {
    const player = TournamentPlayerId.create();
    tournament.addPlayer(player, { name }, by, at);
    const order = tournament.players.find((each) => each.id.equals(player));
    assert.ok(order !== undefined);
    return competition.enterPlayer(player, order.order, told(), by, at);
  });
  return [players[0]!, players[1]!];
};

Given(
  "a game is added to {string} of {string} at {string}",
  async function (
    this: SpecWorld,
    competition: string,
    tournament: string,
    moment: string,
  ) {
    const game = GameId.create();
    const id = competitionNamed(this, competition, tournament);
    await doneToCompetition(
      this,
      competition,
      tournament,
      (found, told, by, tournamentOf) => {
        const [winner, loser] = twoPlayers(
          this,
          found,
          tournamentOf,
          id,
          told,
          by,
        );
        found.addGame(
          game,
          {
            winner,
            winnerScore: Score.read("26", tournamentOf.website),
            loser,
            loserScore: Score.read("17", tournamentOf.website),
          },
          told(),
          by,
          ReadOnlyDate.from(new Date(moment)),
        );
      },
    );
    ownScenarioOf(this).games.set(
      gameKey(competition, tournament, moment),
      game,
    );
  },
);

Given(
  "the game added to {string} of {string} at {string} is archived",
  async function (
    this: SpecWorld,
    competition: string,
    tournament: string,
    moment: string,
  ) {
    const game = gameAdded(this, competition, tournament, moment);
    await doneToCompetition(
      this,
      competition,
      tournament,
      (found, told, by) => {
        found.archiveGame(game, told(), by, at);
      },
    );
  },
);

Given(
  "the game added to {string} of {string} at {string} is restored at {string}",
  async function (
    this: SpecWorld,
    competition: string,
    tournament: string,
    moment: string,
    restored: string,
  ) {
    const game = gameAdded(this, competition, tournament, moment);
    await doneToCompetition(
      this,
      competition,
      tournament,
      (found, told, by) => {
        found.restoreGame(
          game,
          told(),
          by,
          ReadOnlyDate.from(new Date(restored)),
        );
      },
    );
  },
);

Given(
  "the game added to {string} of {string} at {string} is corrected at {string}",
  async function (
    this: SpecWorld,
    competition: string,
    tournament: string,
    moment: string,
    corrected: string,
  ) {
    const game = gameAdded(this, competition, tournament, moment);
    await doneToCompetition(
      this,
      competition,
      tournament,
      (found, told, by, tournamentOf) => {
        found.correctGame(
          game,
          Score.read("26", tournamentOf.website),
          Score.read("20", tournamentOf.website),
          told(),
          by,
          ReadOnlyDate.from(new Date(corrected)),
        );
      },
    );
  },
);

Given(
  "the competition {string} of {string} is archived",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = competitionNamed(this, competition, tournament);
    await doneTo(this, tournament, (found, by) => {
      found.archiveCompetition(id, by, at);
    });
  },
);

Given(
  "the competition {string} of {string} is restored",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = competitionNamed(this, competition, tournament);
    await doneTo(this, tournament, (found, by) => {
      found.restoreCompetition(id, by, at);
    });
  },
);

// Every event of the competition, from its first, as rebuilding would give
// them.
When(
  "the events of {string} of {string} are projected again",
  async function (this: SpecWorld, competition: string, tournament: string) {
    const id = competitionNamed(this, competition, tournament);
    const { readModel, store } = scenarioOf(this);
    await this.asARequest(async () =>
      readModel.project(id, 1, await store.getEvents(id)),
    );
  },
);

// Looking ------------------------------------------------------------------------------

// The filter the scenario chose, made as the application makes one.
const filterOf = (world: SpecWorld, website: Website): TournamentFilter => {
  const { country, region, sport } = world.filterChosen;
  return TournamentFilter.from(website, {
    country:
      country === undefined ? undefined : Countries.thereAre.find(country),
    region,
    sport,
  });
};

const looked = (
  world: SpecWorld,
  found: readonly (TournamentPlayed | TournamentOfWebsite)[],
): void => {
  ownScenarioOf(world).found = found;
  scenarioOf(world).found = found;
};

const lookForPlayed = async (
  world: SpecWorld,
  host: string,
  since: string,
): Promise<void> => {
  const website = Website.from(host);
  looked(
    world,
    await world.asARequest(() =>
      readModelOf(world).playedSince(
        website,
        ReadOnlyDate.from(new Date(since)),
        filterOf(world, website),
      ),
    ),
  );
};

When(
  "the tournaments played since {string} are looked for",
  async function (this: SpecWorld, since: string) {
    await lookForPlayed(this, "croquetscores.com", since);
  },
);

When(
  "the tournaments played on {string} since {string} are looked for",
  async function (this: SpecWorld, website: string, since: string) {
    await lookForPlayed(this, website, since);
  },
);

const lookForStarting = async (
  world: SpecWorld,
  host: string,
  first: string,
  last: string,
): Promise<void> => {
  const website = Website.from(host);
  looked(
    world,
    await world.asARequest(() =>
      readModelOf(world).startingBetween(
        website,
        first,
        last,
        filterOf(world, website),
      ),
    ),
  );
};

When(
  "the tournaments starting from {string} to {string} are looked for",
  async function (this: SpecWorld, first: string, last: string) {
    await lookForStarting(this, "croquetscores.com", first, last);
  },
);

When(
  "the tournaments starting on {string} from {string} to {string} are looked for",
  async function (
    this: SpecWorld,
    website: string,
    first: string,
    last: string,
  ) {
    await lookForStarting(this, website, first, last);
  },
);

When(
  "the tournaments of every website are looked for",
  async function (this: SpecWorld) {
    looked(this, await this.asARequest(() => readModelOf(this).withSports()));
  },
);

When(
  "the years of {string} are looked for",
  async function (this: SpecWorld, website: string) {
    scenarioOf(this).years = await this.asARequest(() =>
      readModelOf(this).yearsOf(Website.from(website)),
    );
  },
);

When(
  "the years of {string} for the sport {string} are looked for",
  async function (this: SpecWorld, website: string, sport: string) {
    scenarioOf(this).years = await this.asARequest(() =>
      readModelOf(this).yearsOf(Website.from(website), Sport.from(sport)),
    );
  },
);

// What was found -------------------------------------------------------------------------

Then(
  "{string} is held as last played at {string}",
  function (this: SpecWorld, name: string, moment: string) {
    const found = foundCalled(ownScenarioOf(this).found, name);
    assert.ok("lastPlayed" in found, `${name} was not looked for as played.`);
    assert.equal(
      found.lastPlayed.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "{string} is found for the sport {string}",
  function (this: SpecWorld, name: string, sport: string) {
    const found = foundCalled(ownScenarioOf(this).found, name);
    assert.ok("sport" in found, `${name} was not looked for with its sport.`);
    assert.equal(found.sport, sport);
  },
);
