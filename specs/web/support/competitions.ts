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
  held(
    world.competitions,
    within(tournament, competition),
    `competition called ${competition} in ${tournament}`,
  );

const enteredId = (
  world: WebWorld,
  tournament: string,
  competition: string,
  player: string,
): string =>
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
