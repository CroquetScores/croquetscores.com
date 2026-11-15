// The competitions, players and games a scenario says are already there, added
// by the site's own control as the manager who made the tournament, and known
// by the names the scenario gave them. What the site hands back is an id for
// each, which is all that is kept; the rest is what the pages say.
import { Given } from "@cucumber/cucumber";

import { call } from "./control.js";
import type { WebWorld } from "./world.js";

const refused = async (what: string, answer: Response): Promise<never> => {
  throw new Error(
    `The site would not ${what}: ${String(answer.status)} ${await answer.text()}`,
  );
};

// What the site is told, and what it answers with the id of.
const made = async (
  what: string,
  path: string,
  body: object,
): Promise<string | undefined> => {
  const answer = await call("POST", path, body);
  if (answer.status !== 201 && answer.status !== 200) {
    await refused(what, answer);
  }
  return answer.status === 201
    ? ((await answer.json()) as { id: string }).id
    : undefined;
};

const tournamentOf = (world: WebWorld, name: string) => {
  const found = world.tournaments.get(name);
  if (found === undefined) {
    throw new Error(`No tournament called ${name} was created.`);
  }
  return found;
};

const held = (map: Map<string, string>, key: string, what: string): string => {
  const found = map.get(key);
  if (found === undefined) throw new Error(`There is no ${what}.`);
  return found;
};

// A thing of a tournament is known by its name and the tournament's.
const within = (tournament: string, name: string): string =>
  `${tournament}\u0000${name}`;

const competitionId = (
  world: WebWorld,
  tournament: string,
  competition: string,
): string =>
  world.competitions.get(within(tournament, competition)) ??
  world.tests.get(within(tournament, competition))?.id ??
  held(
    world.competitions,
    within(tournament, competition),
    `competition called ${competition} in ${tournament}`,
  );

// A game names its players as the competition knows them: those entered in a
// block, and the team players of a test, which has nobody entered.
const enteredId = (
  world: WebWorld,
  tournament: string,
  competition: string,
  player: string,
): string =>
  (world.tests.has(within(tournament, competition))
    ? world.teamPlayers.get(within(tournament, player))
    : undefined) ??
  held(
    world.entered,
    within(within(tournament, competition), player),
    `${player} in ${competition} of ${tournament}`,
  );

Given(
  "{string} has added the block {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    block: string,
    tournament: string,
  ) {
    const id = await made("add the block", "/tournaments/blocks", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      name: block,
      ...this.ofTheNextBlock,
    });
    this.competitions.set(within(tournament, block), id!);
  },
);

Given(
  "the block is to be the best of {int}",
  function (this: WebWorld, bestOf: number) {
    this.ofTheNextBlock = { ...this.ofTheNextBlock, bestOf };
  },
);

Given(
  "the block is to go by the tie break {string}",
  function (this: WebWorld, tieBreak: string) {
    this.ofTheNextBlock = { ...this.ofTheNextBlock, tieBreak };
  },
);

Given(
  "{string} has added the player {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    tournament: string,
  ) {
    const id = await made("add the player", "/tournaments/players", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      player: { name: player, ...this.ofTheNextPlayer },
    });
    this.players.set(within(tournament, player), id!);
  },
);

Given(
  "{string} has entered the player {string} in {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    competition: string,
    tournament: string,
  ) {
    const id = await made("enter the player", "/competitions/players", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      competition: competitionId(this, tournament, competition),
      player: held(
        this.players,
        within(tournament, player),
        `player called ${player} in ${tournament}`,
      ),
    });
    this.entered.set(within(within(tournament, competition), player), id!);
  },
);

// A game played before the scenario's own steps, entered as the tournament's
// manager, who created it.
Given(
  /^"([^"]*)" has beaten "([^"]*)" (\S+) to (\S+) in "([^"]*)" of "([^"]*)"$/,
  async function (
    this: WebWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
    tournament: string,
  ) {
    const found = tournamentOf(this, tournament);
    const id = await made("add the game", "/competitions/games", {
      manager: found.manager,
      tournament: found.id,
      competition: competitionId(this, tournament, competition),
      winner: enteredId(this, tournament, competition, winner),
      winnerScore,
      loser: enteredId(this, tournament, competition, loser),
      loserScore,
    });
    this.games.set(
      within(within(tournament, competition), `${winner}>${loser}`),
      id!,
    );
  },
);

Given(
  "{string} has withdrawn the player {string} from {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    competition: string,
    tournament: string,
  ) {
    await made("withdraw the player", "/competitions/players/withdraw", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      competition: competitionId(this, tournament, competition),
      player: enteredId(this, tournament, competition, player),
    });
  },
);

Given(
  "{string} has withdrawn the score of {string} beating {string} in {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    winner: string,
    loser: string,
    competition: string,
    tournament: string,
  ) {
    await made("withdraw the score", "/competitions/games/withdraw", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      competition: competitionId(this, tournament, competition),
      game: held(
        this.games,
        within(within(tournament, competition), `${winner}>${loser}`),
        `game of ${winner} beating ${loser}`,
      ),
    });
  },
);

// What the scenario says of the next block's rules, said as the dialog says them.
const rulesOf = (world: WebWorld, said: Record<string, unknown>): void => {
  const before = (world.ofTheNextBlock["rules"] ?? {}) as Record<
    string,
    unknown
  >;
  world.ofTheNextBlock = {
    ...world.ofTheNextBlock,
    rules: { ...before, ...said },
  };
};

Given(
  "the competition is said to have a maximum of {int} hoops",
  function (this: WebWorld, maximumHoops: number) {
    rulesOf(this, { maximumHoops });
  },
);

Given(
  "the competition is said to have no maximum number of hoops",
  function (this: WebWorld) {
    rulesOf(this, { maximumHoops: null });
  },
);

Given("the competition is to allow drawn results", function (this: WebWorld) {
  rulesOf(this, { drawsAllowed: true });
});

Given(
  /^"([^"]*)" has moved the player "([^"]*)" in "([^"]*)" of "([^"]*)" (up|down)$/,
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    competition: string,
    tournament: string,
    direction: string,
  ) {
    await made("move the player", "/competitions/players/move", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      competition: competitionId(this, tournament, competition),
      player: enteredId(this, tournament, competition, player),
      direction,
    });
  },
);

Given(
  "{string} has archived the score of {string} beating {string} in {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    winner: string,
    loser: string,
    competition: string,
    tournament: string,
  ) {
    await made("archive the score", "/competitions/games/archive", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      competition: competitionId(this, tournament, competition),
      game: held(
        this.games,
        within(within(tournament, competition), `${winner}>${loser}`),
        `game of ${winner} beating ${loser}`,
      ),
    });
  },
);

Given(
  "{string} has archived the competition {string} in {string}",
  async function (
    this: WebWorld,
    manager: string,
    competition: string,
    tournament: string,
  ) {
    await made("archive the competition", "/tournaments/competitions/archive", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      competition: competitionId(this, tournament, competition),
    });
  },
);

// As many players as a scenario needs to fill a competition, when who they are
// is beside the point: each added to the tournament and entered, as its manager,
// called "Grid Player A", "Grid Player B" and so on.
Given(
  "{int} players have been entered in {string} of {string}",
  { timeout: 60_000 },
  async function (
    this: WebWorld,
    count: number,
    competition: string,
    tournament: string,
  ) {
    const found = tournamentOf(this, tournament);
    for (let at = 0; at < count; at++) {
      const name = `Grid Player ${String.fromCharCode(65 + at)}`;
      const player = await made("add the player", "/tournaments/players", {
        manager: found.manager,
        tournament: found.id,
        player: { name },
      });
      this.players.set(within(tournament, name), player!);
      const entered = await made("enter the player", "/competitions/players", {
        manager: found.manager,
        tournament: found.id,
        competition: competitionId(this, tournament, competition),
        player,
      });
      this.entered.set(within(within(tournament, competition), name), entered!);
    }
  },
);

Given(
  "the player is to represent {string}",
  function (this: WebWorld, representing: string) {
    this.ofTheNextPlayer = { ...this.ofTheNextPlayer, representing };
  },
);

Given(
  "the player is to fly the flag {string}",
  function (this: WebWorld, flag: string) {
    this.ofTheNextPlayer = { ...this.ofTheNextPlayer, flag };
  },
);

// The format the next tournament is played in, which is the standard one unless
// the scenario says otherwise.
Given(
  "the tournament is to be played in the format {string}",
  function (this: WebWorld, format: string) {
    this.ofTheNext = { ...this.ofTheNext, format };
  },
);

Given(
  "the team is to be known for short as {string}",
  function (this: WebWorld, shortName: string) {
    this.ofTheNextTeam = { ...this.ofTheNextTeam, shortName };
  },
);

Given(
  "the team is to fly the flag {string}",
  function (this: WebWorld, flag: string) {
    this.ofTheNextTeam = { ...this.ofTheNextTeam, flag };
  },
);

// A team called for short by the first three letters of its name, until the
// scenario says otherwise.
Given(
  "{string} has added the team {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    team: string,
    tournament: string,
  ) {
    const shortName =
      (this.ofTheNextTeam["shortName"] as string | undefined) ??
      team.slice(0, 3).toUpperCase();
    const id = await made("add the team", "/tournaments/teams", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      team: { ...this.ofTheNextTeam, name: team, shortName },
    });
    this.ofTheNextTeam = {};
    this.teams.set(within(tournament, team), { id: id!, shortName });
  },
);

const teamOf = (world: WebWorld, tournament: string, team: string) => {
  const found = world.teams.get(within(tournament, team));
  if (found === undefined) {
    throw new Error(`There is no team called ${team} in ${tournament}.`);
  }
  return found;
};

Given(
  "{string} has added the player {string} to the team {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    team: string,
    tournament: string,
  ) {
    const id = await made(
      "add the player to the team",
      "/tournaments/teams/players",
      {
        manager,
        tournament: tournamentOf(this, tournament).id,
        team: teamOf(this, tournament, team).id,
        player: { name: player },
      },
    );
    this.teamPlayers.set(within(tournament, player), id!);
  },
);

Given(
  "{string} has archived the team {string} in {string}",
  async function (
    this: WebWorld,
    manager: string,
    team: string,
    tournament: string,
  ) {
    await made("archive the team", "/tournaments/teams/archive", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      team: teamOf(this, tournament, team).id,
    });
  },
);

Given(
  "the test is to be in the group {string}",
  function (this: WebWorld, group: string) {
    this.ofTheNextTest = { ...this.ofTheNextTest, group };
  },
);

// A test between two teams, called by their short names, as "AUS v ENG": a
// match each, the best of 1, on the day the tournament starts.
Given(
  "{string} has added the test between {string} and {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    first: string,
    second: string,
    tournament: string,
  ) {
    const found = tournamentOf(this, tournament);
    const day = String(found.request["starts"]).slice(0, 10);
    const one = teamOf(this, tournament, first);
    const other = teamOf(this, tournament, second);
    const request = {
      firstTeam: one.id,
      secondTeam: other.id,
      starts: day,
      finishes: day,
      expectedMatches: 1,
      bestOf: 1,
      ...this.ofTheNextTest,
    };
    const id = await made("add the test", "/tournaments/tests", {
      manager,
      tournament: found.id,
      test: request,
    });
    this.ofTheNextTest = {};
    this.tests.set(
      within(tournament, `${one.shortName} v ${other.shortName}`),
      {
        id: id!,
        request,
      },
    );
  },
);

Given(
  "{string} has given the test {string} of {string} {int} expected matches",
  async function (
    this: WebWorld,
    manager: string,
    test: string,
    tournament: string,
    expectedMatches: number,
  ) {
    const found = this.tests.get(within(tournament, test));
    if (found === undefined) throw new Error(`There is no test ${test}.`);
    const request = { ...found.request, expectedMatches };
    await made("change the test", "/tournaments/tests/update", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      id: found.id,
      test: request,
    });
    found.request = request;
  },
);

Given(
  "the player is to have the handicap {string}",
  function (this: WebWorld, handicap: string) {
    this.ofTheNextPlayer = { ...this.ofTheNextPlayer, handicap };
  },
);

Given(
  "{string} has archived the player {string} in {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    tournament: string,
  ) {
    await made("archive the player", "/tournaments/players/archive", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      player: held(
        this.players,
        within(tournament, player),
        `player called ${player} in ${tournament}`,
      ),
    });
  },
);
