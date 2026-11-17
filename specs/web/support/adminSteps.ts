// What a scenario says the admin's tournaments already hold, done through the
// site's own control as the manager who is said to have done it, and what it
// says they hold afterwards, read from what the site tells of them. Who and
// what is meant is found by the name the scenario gave: a tournament by its
// name, and everything in it by its name in the tournament, from what the site
// says the tournament holds, so that what was made through a page is found as
// well as what was made through the control.
import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { accountsFor, call, makeAccount } from "./control.js";
import {
  competitionHeld,
  type Kept,
  type KeptCompetition,
  keptOf,
  notesOf,
} from "./kept.js";
import { ordinal } from "./ordinals.js";
import { retried } from "./tournamentPage.js";
import { createTournament } from "./tournaments.js";
import type { WebWorld } from "./world.js";

const refused = async (what: string, answer: Response): Promise<never> => {
  throw new Error(
    `The site would not ${what}: ${String(answer.status)} ${await answer.text()}`,
  );
};

// What the site is told, and what it answers with the id of, if it does.
const told = async (
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

const tournamentFor = (world: WebWorld, name: string) => {
  const found = world.tournaments.get(name);
  assert.ok(found !== undefined, `No tournament called ${name} was created.`);
  return found;
};

const playerOf = (kept: Kept, tournament: string, name: string): string => {
  const found = kept.players.find((each) => each.name === name);
  assert.ok(found !== undefined, `${tournament} has no player ${name}.`);
  return found.id;
};

const competitionOf = (
  kept: Kept,
  tournament: string,
  name: string,
): KeptCompetition => {
  const found = kept.competitions.find((each) => each.name === name);
  assert.ok(found !== undefined, `${tournament} has no competition ${name}.`);
  return found;
};

const teamOf = (kept: Kept, tournament: string, name: string) => {
  const found = kept.teams.find((each) => each.name === name);
  assert.ok(found !== undefined, `${tournament} has no team ${name}.`);
  return found;
};

// A tournament's player as the competition holds them, which is another id.
const playerIn = async (
  world: WebWorld,
  tournament: string,
  competition: string,
  player: string,
): Promise<{ readonly id: string; readonly competition: string }> => {
  const kept = await keptOf(world, tournament);
  const held = await competitionHeld(
    competitionOf(kept, tournament, competition).id,
  );
  const wanted = playerOf(kept, tournament, player);
  const found = held.players.find((each) => each.tournamentPlayer === wanted);
  assert.ok(found !== undefined, `${competition} has no player ${player}.`);
  return {
    id: found.id,
    competition: competitionOf(kept, tournament, competition).id,
  };
};

// A tournament that is there --------------------------------------------------------

Given(
  "{string} has created the tournament {string} starting at {string} in the sport {string}",
  async function (
    this: WebWorld,
    manager: string,
    name: string,
    starts: string,
    sport: string,
  ) {
    await createTournament(this, manager, name, undefined, {
      starts,
      finishes: starts,
      sport,
    });
  },
);

for (const role of ["manager", "scorer"] as const) {
  Given(
    `{string} has made {string} a ${role} of {string}`,
    async function (
      this: WebWorld,
      manager: string,
      made: string,
      tournament: string,
    ) {
      await told(`make ${made} a ${role}`, `/tournaments/${role}s`, {
        manager,
        tournament: tournamentFor(this, tournament).id,
        emailAddress: made,
      });
    },
  );
}

// Its players -----------------------------------------------------------------------

Given(
  "{string} has renamed the player {string} in {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    tournament: string,
    renamed: string,
  ) {
    const kept = await keptOf(this, tournament);
    const found = kept.players.find((each) => each.name === player);
    assert.ok(found !== undefined, `${tournament} has no player ${player}.`);
    // Said again as they are but for the name, since an update says everything.
    await told("rename the player", "/tournaments/players/update", {
      manager,
      tournament: tournamentFor(this, tournament).id,
      player: found.id,
      details: {
        name: renamed,
        representing: found.representing,
        flag: found.flag,
      },
    });
  },
);

Given(
  /^"([^"]*)" has moved the player "([^"]*)" in "([^"]*)" (up|down)$/,
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    tournament: string,
    direction: string,
  ) {
    const kept = await keptOf(this, tournament);
    await told("move the player", "/tournaments/players/move", {
      manager,
      tournament: kept.id,
      player: playerOf(kept, tournament, player),
      direction,
    });
  },
);

Given(
  "{string} has paired the players {string} and {string} in {string}",
  async function (
    this: WebWorld,
    manager: string,
    first: string,
    second: string,
    tournament: string,
  ) {
    const kept = await keptOf(this, tournament);
    await told("pair the players", "/tournaments/pairs", {
      manager,
      tournament: kept.id,
      first: playerOf(kept, tournament, first),
      second: playerOf(kept, tournament, second),
    });
  },
);

// A player of the tournament who represents a club, whatever else they are
// called.
let represented = 0;
Given(
  "a player of {string} represents {string}",
  async function (this: WebWorld, tournament: string, representing: string) {
    represented += 1;
    // A tournament of somebody else's, which the scenario need say no more of.
    if (!this.tournaments.has(tournament)) {
      const organiser = "organiser@example.com";
      if ((await accountsFor(organiser)) === 0) {
        await makeAccount({ emailAddress: organiser });
      }
      await createTournament(this, organiser, tournament);
    }
    await told("add the player", "/tournaments/players", {
      manager: tournamentFor(this, tournament).manager,
      tournament: tournamentFor(this, tournament).id,
      player: { name: `Member ${String(represented)}`, representing },
    });
  },
);

Given(
  "the player is to have the world ranking name {string}",
  function (this: WebWorld, name: string) {
    this.ofTheNextPlayer = { ...this.ofTheNextPlayer, worldRankingName: name };
  },
);

// Its teams -------------------------------------------------------------------------

Given(
  "{string} has moved the team {string} in {string} up",
  async function (
    this: WebWorld,
    manager: string,
    team: string,
    tournament: string,
  ) {
    const kept = await keptOf(this, tournament);
    await told("move the team", "/tournaments/teams/move", {
      manager,
      tournament: kept.id,
      team: teamOf(kept, tournament, team).id,
      direction: "up",
    });
  },
);

const toTeamPlayer = async (
  world: WebWorld,
  path: string,
  manager: string,
  player: string,
  team: string,
  tournament: string,
  more: object,
): Promise<void> => {
  const kept = await keptOf(world, tournament);
  const found = teamOf(kept, tournament, team);
  const who = found.players.find((each) => each.name === player);
  assert.ok(who !== undefined, `${team} has no player ${player}.`);
  await told("change the team's player", path, {
    manager,
    tournament: kept.id,
    team: found.id,
    player: who.id,
    ...more,
  });
};

Given(
  "{string} has moved the player {string} of the team {string} of {string} up",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    team: string,
    tournament: string,
  ) {
    await toTeamPlayer(
      this,
      "/tournaments/teams/players/move",
      manager,
      player,
      team,
      tournament,
      { direction: "up" },
    );
  },
);

Given(
  "{string} has archived the player {string} of the team {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    team: string,
    tournament: string,
  ) {
    await toTeamPlayer(
      this,
      "/tournaments/teams/players/archive",
      manager,
      player,
      team,
      tournament,
      {},
    );
  },
);

Given(
  "{string} has renamed the player {string} of the team {string} of {string} to {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    team: string,
    tournament: string,
    renamed: string,
  ) {
    await toTeamPlayer(
      this,
      "/tournaments/teams/players/update",
      manager,
      player,
      team,
      tournament,
      { details: { name: renamed } },
    );
  },
);

// Its competitions ------------------------------------------------------------------

Given(
  "{string} has moved the competition {string} in {string} up",
  async function (
    this: WebWorld,
    manager: string,
    competition: string,
    tournament: string,
  ) {
    const kept = await keptOf(this, tournament);
    await told("move the competition", "/tournaments/competitions/move", {
      manager,
      tournament: kept.id,
      competition: competitionOf(kept, tournament, competition).id,
      direction: "up",
    });
  },
);

Given(
  "{string} has added the losers knockout {string} to {string} for the losers of the {word} round of {string}",
  async function (
    this: WebWorld,
    manager: string,
    name: string,
    tournament: string,
    round: string,
    from: string,
  ) {
    const kept = await keptOf(this, tournament);
    const id = await told(
      "add the losers knockout",
      "/tournaments/losers-knockouts",
      {
        manager,
        tournament: kept.id,
        name,
        from: competitionOf(kept, tournament, from).id,
        round: ordinal(round),
      },
    );
    this.competitions.set(`${tournament}\u0000${name}`, id!);
  },
);

Given(
  "{string} has removed the player {string} from {string} of {string}",
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    competition: string,
    tournament: string,
  ) {
    const found = await playerIn(this, tournament, competition, player);
    await told("remove the player", "/competitions/players/remove", {
      manager,
      tournament: tournamentFor(this, tournament).id,
      competition: found.competition,
      player: found.id,
    });
  },
);

// What a competition's players carry forward -----------------------------------------

const COUNTS: Readonly<Record<string, string>> = {
  "match wins": "matchWins",
  "match losses": "matchLosses",
  "game wins": "gameWins",
  "game losses": "gameLosses",
  "hoops for": "hoopsFor",
  "hoops against": "hoopsAgainst",
};
const COUNT = `(${Object.keys(COUNTS).join("|")})`;
const NUMBER = "(-?\\d+(?:\\.\\d+)?)";

Given(
  new RegExp(
    `^"([^"]*)" has given the player "([^"]*)" in "([^"]*)" of "([^"]*)" a carry forward of ${COUNT} of ${NUMBER}$`,
  ),
  async function (
    this: WebWorld,
    manager: string,
    player: string,
    competition: string,
    tournament: string,
    count: string,
    value: string,
  ) {
    const found = await playerIn(this, tournament, competition, player);
    await told(
      "change the carry forward",
      "/competitions/players/carry-forward",
      {
        manager,
        tournament: tournamentFor(this, tournament).id,
        competition: found.competition,
        player: found.id,
        counts: { [COUNTS[count] ?? ""]: Number(value) },
      },
    );
  },
);

const carriedBy = async (
  world: WebWorld,
  player: string,
  competition: string,
  tournament: string,
): Promise<Record<string, number>> => {
  const kept = await keptOf(world, tournament);
  const held = await competitionHeld(
    competitionOf(kept, tournament, competition).id,
  );
  const wanted = playerOf(kept, tournament, player);
  const found = held.players.find((each) => each.tournamentPlayer === wanted);
  assert.ok(found !== undefined, `${competition} has no player ${player}.`);
  return found.carryForward;
};

Then(
  new RegExp(
    `^the player "([^"]*)" in "([^"]*)" of "([^"]*)" carries forward ${COUNT} of ${NUMBER}$`,
  ),
  async function (
    this: WebWorld,
    player: string,
    competition: string,
    tournament: string,
    count: string,
    value: string,
  ) {
    await retried(async () => {
      assert.equal(
        (await carriedBy(this, player, competition, tournament))[
          COUNTS[count] ?? ""
        ],
        Number(value),
      );
    });
  },
);

Then(
  new RegExp(
    `^the player "([^"]*)" in "([^"]*)" of "([^"]*)" carries forward nothing in ${COUNT}$`,
  ),
  async function (
    this: WebWorld,
    player: string,
    competition: string,
    tournament: string,
    count: string,
  ) {
    await retried(async () => {
      assert.equal(
        (await carriedBy(this, player, competition, tournament))[
          COUNTS[count] ?? ""
        ],
        undefined,
      );
    });
  },
);

Then(
  "the player {string} in {string} of {string} carries nothing forward",
  async function (
    this: WebWorld,
    player: string,
    competition: string,
    tournament: string,
  ) {
    await retried(async () => {
      assert.deepEqual(
        await carriedBy(this, player, competition, tournament),
        {},
      );
    });
  },
);

// What a competition holds ----------------------------------------------------------

const namesIn = async (
  world: WebWorld,
  competition: string,
  tournament: string,
): Promise<string[]> => {
  const kept = await keptOf(world, tournament);
  const held = await competitionHeld(
    competitionOf(kept, tournament, competition).id,
  );
  return held.players.flatMap((each) =>
    each.bye
      ? ["a bye"]
      : kept.players
          .filter((player) => player.id === each.tournamentPlayer)
          .map((player) => player.name),
  );
};

Then(
  "the competition {string} of {string} has the player {string}",
  async function (
    this: WebWorld,
    competition: string,
    tournament: string,
    player: string,
  ) {
    await retried(async () => {
      assert.ok(
        (await namesIn(this, competition, tournament)).includes(player),
        `${competition} has no player ${player}.`,
      );
    });
  },
);

Then(
  "the competition {string} of {string} does not have the player {string}",
  async function (
    this: WebWorld,
    competition: string,
    tournament: string,
    player: string,
  ) {
    await retried(async () => {
      assert.ok(
        !(await namesIn(this, competition, tournament)).includes(player),
        `${competition} has the player ${player}.`,
      );
    });
  },
);

Then(
  /^the competition "([^"]*)" of "([^"]*)" has (\d+) byes?$/,
  async function (
    this: WebWorld,
    competition: string,
    tournament: string,
    count: string,
  ) {
    await retried(async () => {
      const kept = await keptOf(this, tournament);
      const held = await competitionHeld(
        competitionOf(kept, tournament, competition).id,
      );
      assert.equal(
        held.players.filter((each) => each.bye).length,
        Number(count),
      );
    });
  },
);

Then(
  /^the (first|second|third) player of "([^"]*)" of "([^"]*)" is a bye$/,
  async function (
    this: WebWorld,
    place: string,
    competition: string,
    tournament: string,
  ) {
    await retried(async () => {
      const kept = await keptOf(this, tournament);
      const held = await competitionHeld(
        competitionOf(kept, tournament, competition).id,
      );
      assert.equal(
        held.players[ordinal(place)]?.bye,
        true,
        `The ${place} player is not a bye.`,
      );
    });
  },
);

// The games of a competition, by the names of those who played them: a player
// entered in it, or in a test, which has nobody entered, a player of a team.
const gamesBetween = async (
  world: WebWorld,
  competition: string,
  tournament: string,
) => {
  const kept = await keptOf(world, tournament);
  const held = await competitionHeld(
    competitionOf(kept, tournament, competition).id,
  );
  const nameOf = (id: string): string | undefined =>
    kept.players.find(
      (player) =>
        player.id ===
        held.players.find((each) => each.id === id)?.tournamentPlayer,
    )?.name ??
    kept.teams
      .flatMap((team) => team.players)
      .find((player) => player.id === id)?.name;
  return held.games.map((game) => ({
    winner: nameOf(game.winner),
    loser: nameOf(game.loser),
    scores: `${game.winnerWritten} to ${game.loserWritten}`,
  }));
};

Then(
  "{string} of {string} has no scores",
  async function (this: WebWorld, competition: string, tournament: string) {
    await retried(async () => {
      assert.deepEqual(await gamesBetween(this, competition, tournament), []);
    });
  },
);

Then(
  /^"([^"]*)" of "([^"]*)" has the score of "([^"]*)" beating "([^"]*)" (\S+) to (\S+)$/,
  async function (
    this: WebWorld,
    competition: string,
    tournament: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await retried(async () => {
      const games = await gamesBetween(this, competition, tournament);
      assert.ok(
        games.some(
          (game) =>
            game.winner === winner &&
            game.loser === loser &&
            game.scores === `${winnerScore} to ${loserScore}`,
        ),
        `${competition} has ${JSON.stringify(games)}.`,
      );
    });
  },
);

Then(
  /^"([^"]*)" of "([^"]*)" does not have the score of "([^"]*)" beating "([^"]*)" (\S+) to (\S+)$/,
  async function (
    this: WebWorld,
    competition: string,
    tournament: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await retried(async () => {
      const games = await gamesBetween(this, competition, tournament);
      assert.ok(
        !games.some(
          (game) =>
            game.winner === winner &&
            game.loser === loser &&
            game.scores === `${winnerScore} to ${loserScore}`,
        ),
        `${competition} has ${JSON.stringify(games)}.`,
      );
    });
  },
);

// Its manager notes -----------------------------------------------------------------

const noteCalled = async (
  world: WebWorld,
  title: string,
  tournament: string,
) => {
  const note = (await notesOf(world, tournament)).find(
    (each) => each.title === title && !each.deleted,
  );
  assert.ok(note !== undefined, `${tournament} has no note ${title}.`);
  return note;
};

Then(
  "{string} has the manager note {string}",
  async function (this: WebWorld, tournament: string, title: string) {
    await retried(async () => {
      await noteCalled(this, title, tournament);
    });
  },
);

Then(
  "{string} has no manager notes",
  async function (this: WebWorld, tournament: string) {
    await retried(async () => {
      assert.deepEqual(
        (await notesOf(this, tournament)).filter((each) => !each.deleted),
        [],
      );
    });
  },
);

Then(
  "the manager note {string} of {string} says {string}",
  async function (
    this: WebWorld,
    title: string,
    tournament: string,
    said: string,
  ) {
    await retried(async () => {
      assert.equal(
        (await noteCalled(this, title, tournament)).description,
        said,
      );
    });
  },
);

Then(
  "the manager note {string} of {string} says nothing more",
  async function (this: WebWorld, title: string, tournament: string) {
    await retried(async () => {
      assert.equal(
        (await noteCalled(this, title, tournament)).description,
        undefined,
      );
    });
  },
);
