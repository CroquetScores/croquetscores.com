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
  // Archiving gives a competition a number after its name, so that the name can
  // be used again; the one that was archived is the one it was called before.
  world.competitions.get(
    within(tournament, competition.replace(/ \(\d+\)$/, "")),
  ) ??
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
        player: {
          name: player,
          ...(this.ofTheNextPlayer["worldRankingName"] === undefined
            ? {}
            : { worldRankingName: this.ofTheNextPlayer["worldRankingName"] }),
        },
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
      ...(this.ofTheNextBlock["rules"] === undefined
        ? {}
        : { rules: this.ofTheNextBlock["rules"] }),
    };
    const id = await made("add the test", "/tournaments/tests", {
      manager,
      tournament: found.id,
      test: request,
    });
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

// A knockout of a number of places, each round the best of 1 unless the scenario
// says otherwise, for four places where it says nothing.
const roundsAt = ["first", "second", "third", "fourth"];

const sayRound = (world: WebWorld, which: string, games: number): void => {
  const said = [...((world.ofTheNextKnockout["rounds"] as number[]) ?? [])];
  said[roundsAt.indexOf(which)] = games;
  world.ofTheNextKnockout = { ...world.ofTheNextKnockout, rounds: said };
};

Given(
  "the knockout is to have a draw of {int} places",
  function (this: WebWorld, places: number) {
    this.ofTheNextKnockout = { ...this.ofTheNextKnockout, places };
  },
);

Given(
  /^(?:the knockout's|its) (first|second|third|fourth) round is to be the best of (\d+)$/,
  function (this: WebWorld, which: string, games: string) {
    sayRound(this, which, Number(games));
  },
);

Given(
  "{string} has added the knockout {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    knockout: string,
    tournament: string,
  ) {
    const places =
      (this.ofTheNextKnockout["places"] as number | undefined) ?? 4;
    const said =
      (this.ofTheNextKnockout["rounds"] as number[] | undefined) ?? [];
    const id = await made("add the knockout", "/tournaments/knockouts", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      name: knockout,
      places,
      rounds: Array.from(
        { length: Math.log2(places) },
        (_, at) => said[at] ?? 1,
      ),
      ...(this.ofTheNextBlock["rules"] === undefined
        ? {}
        : { rules: this.ofTheNextBlock["rules"] }),
    });
    this.ofTheNextKnockout = {};
    this.competitions.set(within(tournament, knockout), id!);
  },
);

// The id every bye is known by, which is no player's.
const bye = "tournament-player/00000000-0000-0000-0000-000000000000";

Given(
  "{string} has entered a bye in {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    competition: string,
    tournament: string,
  ) {
    await made("enter the bye", "/competitions/players", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      competition: competitionId(this, tournament, competition),
      player: bye,
    });
  },
);

Given(
  "{string} has added the Swiss {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    swiss: string,
    tournament: string,
  ) {
    const id = await made("add the Swiss", "/tournaments/swisses", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      name: swiss,
      ...(this.ofTheNextBlock["rules"] === undefined
        ? {}
        : { rules: this.ofTheNextBlock["rules"] }),
    });
    this.competitions.set(within(tournament, swiss), id!);
  },
);

Given(
  "the tournament is to be for the sport {string}",
  function (this: WebWorld, sport: string) {
    this.ofTheNext = { ...this.ofTheNext, sport };
  },
);

Given(
  "{string} has given the team {string} of {string} the short name {string}",
  async function (
    this: WebWorld,
    manager: string,
    team: string,
    tournament: string,
    shortName: string,
  ) {
    const found = teamOf(this, tournament, team);
    await made("change the team", "/tournaments/teams/update", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      team: found.id,
      details: { name: team, shortName },
    });
    found.shortName = shortName;
  },
);

Given(
  "{string} has given the test {string} of {string} matches each the best of {int}",
  async function (
    this: WebWorld,
    manager: string,
    test: string,
    tournament: string,
    bestOf: number,
  ) {
    const found = this.tests.get(within(tournament, test));
    if (found === undefined) throw new Error(`There is no test ${test}.`);
    const request = { ...found.request, bestOf };
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
  "{string} has changed the world ranking name of the player {string} in {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    tournament: string,
    name: string,
  ) {
    await made("change the name", "/tournaments/players/world-ranking-name", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      player: held(
        this.players,
        within(tournament, player),
        `player called ${player} in ${tournament}`,
      ),
      name,
    });
  },
);

// What the next manager note says, until the scenario says something else.
Given(
  "the manager note is to say {string}",
  function (this: WebWorld, description: string) {
    this.noteSays = description;
  },
);

Given(
  "{string} has added the manager note {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    title: string,
    tournament: string,
  ) {
    const id = await made("add the note", "/tournaments/notes", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      title,
      description: this.noteSays,
    });
    this.notes.set(within(tournament, title), id!);
  },
);

const noteIn = (world: WebWorld, tournament: string, title: string): string =>
  held(
    world.notes,
    within(tournament, title),
    `note called ${title} in ${tournament}`,
  );

Given(
  "{string} has edited the manager note {string} of {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    title: string,
    tournament: string,
    to: string,
  ) {
    await made("edit the note", "/tournaments/notes/edit", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      note: noteIn(this, tournament, title),
      title: to,
      description: this.noteSays,
    });
    this.notes.set(within(tournament, to), noteIn(this, tournament, title));
  },
);

Given(
  "{string} has deleted the manager note {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    title: string,
    tournament: string,
  ) {
    await made("delete the note", "/tournaments/notes/delete", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      note: noteIn(this, tournament, title),
    });
  },
);

// The commentaries and comments a scenario says are there, known by their
// titles and their words.
Given(
  "{string} has started the commentary {string} on {string}",
  async function (
    this: WebWorld,
    account: string,
    title: string,
    tournament: string,
  ) {
    const id = await made("start the commentary", "/tournaments/commentaries", {
      manager: account,
      tournament: tournamentOf(this, tournament).id,
      title,
    });
    this.commentaries.set(within(tournament, title), id!);
  },
);

const commentaryIn = (
  world: WebWorld,
  tournament: string,
  title: string,
): string =>
  held(
    world.commentaries,
    within(tournament, title),
    `commentary called ${title} in ${tournament}`,
  );

// A scenario cannot write a line break inside a step's quotes, so it writes
// "\\n", which is sent as the line break it stands for.
const lines = (text: string): string => text.replaceAll("\\n", "\n");

Given(
  "{string} has added the comment {string} to {string} of {string}",
  async function (
    this: WebWorld,
    account: string,
    text: string,
    title: string,
    tournament: string,
  ) {
    const id = await made("add the comment", "/commentaries/comments", {
      manager: account,
      tournament: tournamentOf(this, tournament).id,
      commentary: commentaryIn(this, tournament, title),
      text: lines(text),
    });
    this.comments.set(within(within(tournament, title), text), id!);
  },
);

const commentIn = (
  world: WebWorld,
  tournament: string,
  title: string,
  text: string,
): string =>
  held(
    world.comments,
    within(within(tournament, title), text),
    `comment ${text} in ${title} of ${tournament}`,
  );

Given(
  "{string} has edited the comment {string} in {string} of {string} to {string}",
  async function (
    this: WebWorld,
    account: string,
    text: string,
    title: string,
    tournament: string,
    to: string,
  ) {
    await made("edit the comment", "/commentaries/comments/edit", {
      manager: account,
      tournament: tournamentOf(this, tournament).id,
      commentary: commentaryIn(this, tournament, title),
      comment: commentIn(this, tournament, title, text),
      text: lines(to),
    });
    this.comments.set(
      within(within(tournament, title), to),
      commentIn(this, tournament, title, text),
    );
  },
);

Given(
  "{string} has deleted the comment {string} in {string} of {string}",
  async function (
    this: WebWorld,
    account: string,
    text: string,
    title: string,
    tournament: string,
  ) {
    await made("delete the comment", "/commentaries/comments/delete", {
      manager: account,
      tournament: tournamentOf(this, tournament).id,
      commentary: commentaryIn(this, tournament, title),
      comment: commentIn(this, tournament, title, text),
    });
  },
);

Given(
  "{string} has restored the competition {string} in {string}",
  async function (
    this: WebWorld,
    manager: string,
    competition: string,
    tournament: string,
  ) {
    await made("restore the competition", "/tournaments/competitions/restore", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      competition: competitionId(this, tournament, competition),
    });
  },
);

Given(
  /^(\d+) players are called "([^"]*)" followed by a number in "([^"]*)"$/,
  async function (this: WebWorld, count: string, name: string, of: string) {
    const found = tournamentOf(this, of);
    for (let number = 1; number <= Number(count); number += 1) {
      const called = `${name} ${String(number)}`;
      const id = await made("add the player", "/tournaments/players", {
        manager: "organiser@example.com",
        tournament: found.id,
        player: { name: called },
      });
      this.players.set(within(of, called), id!);
    }
  },
);

Given(
  "nothing is said of how the competition is played and counted",
  function (this: WebWorld) {
    delete this.ofTheNextBlock["rules"];
  },
);

Given(
  "the competition is to be played under handicap",
  function (this: WebWorld) {
    rulesOf(this, { handicap: true });
  },
);

Given(
  "{string} has changed the world ranking name of {string} in {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    tournament: string,
    name: string,
  ) {
    await made("change the name", "/tournaments/players/world-ranking-name", {
      manager,
      tournament: tournamentOf(this, tournament).id,
      player: held(
        this.players,
        within(tournament, player),
        `player called ${player} in ${tournament}`,
      ),
      name,
    });
  },
);

Given(
  "the block is to be played in {int} rounds",
  function (this: WebWorld, rounds: number) {
    this.ofTheNextBlock = { ...this.ofTheNextBlock, rounds };
  },
);

Given(
  /^the competition is said (not )?to count towards the world rankings$/,
  function (this: WebWorld, not: string | undefined) {
    rulesOf(this, { worldRankings: not === undefined });
  },
);

Given(
  "the test is to start on {string}",
  function (this: WebWorld, starts: string) {
    this.ofTheNextTest = { ...this.ofTheNextTest, starts };
  },
);

Given(
  "the test is to finish on {string}",
  function (this: WebWorld, finishes: string) {
    this.ofTheNextTest = { ...this.ofTheNextTest, finishes };
  },
);

Given(
  "the test is to be expected to have {int} matches",
  function (this: WebWorld, expectedMatches: number) {
    this.ofTheNextTest = { ...this.ofTheNextTest, expectedMatches };
  },
);

Given(
  "each match of the test is to be the best of {int}",
  function (this: WebWorld, bestOf: number) {
    this.ofTheNextTest = { ...this.ofTheNextTest, bestOf };
  },
);
