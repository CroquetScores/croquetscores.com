// A competition's games recorded and changed through the API
// (competitionGames.feature), asked as the website's page or an app asks: a
// plain request, signed in by a session, a key or neither, as the scenario
// chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../../site/advantage/apiScene.js";
import { answered, sceneOf, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

const partOf = (id: string): string => id.slice(id.indexOf("/") + 1);

// The tournament and the competition, each by the part of its id after its
// kind.
export const competitionAt = (
  world: WebWorld,
  competition: string,
  tournament: string,
  api: string,
): string => {
  const id = world.competitions.get(within(tournament, competition));
  assert.ok(id !== undefined, `No competition called ${competition}.`);
  return `${api}/tournaments/${bare(world, tournament)}/competitions/${partOf(id)}`;
};

const playerOf = (
  world: WebWorld,
  player: string,
  competition: string,
  tournament: string,
): string => {
  const id = world.entered.get(within(within(tournament, competition), player));
  assert.ok(id !== undefined, `${player} was not entered in ${competition}.`);
  return partOf(id);
};

const bodyOf = (
  world: WebWorld,
  winner: string,
  loser: string,
  winnerScore: string,
  loserScore: string,
  competition: string,
  tournament: string,
): Record<string, string> => ({
  winner: playerOf(world, winner, competition, tournament),
  loser: playerOf(world, loser, competition, tournament),
  winnerScore,
  loserScore,
});

const recorded =
  /^the game of "([^"]*)" beating "([^"]*)" (\S+) to (\S+) is recorded in "([^"]*)" of "([^"]*)"$/;

When(
  recorded,
  async function (
    this: WebWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
    tournament: string,
  ) {
    const answer = await told(
      this,
      "POST",
      `${competitionAt(this, competition, tournament, "/api/v0")}/games`,
      bodyOf(
        this,
        winner,
        loser,
        winnerScore,
        loserScore,
        competition,
        tournament,
      ),
    );
    // Known by who beat whom, as the games a scenario says are already there
    // are, so that what asks about it can name it.
    if (answer.status === 201) {
      this.games.set(
        within(within(tournament, competition), `${winner}>${loser}`),
        String(answer.body["id"]),
      );
    }
  },
);

When(
  /^the game of "([^"]*)" beating "([^"]*)" (\S+) to (\S+) is recorded in "([^"]*)" of "([^"]*)" at the address it was at$/,
  async function (
    this: WebWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
    tournament: string,
  ) {
    await told(
      this,
      "POST",
      `${competitionAt(this, competition, tournament, "/api/site")}/games`,
      bodyOf(
        this,
        winner,
        loser,
        winnerScore,
        loserScore,
        competition,
        tournament,
      ),
    );
  },
);

When(
  "a game with no winner is recorded in {string} of {string}",
  async function (this: WebWorld, competition: string, tournament: string) {
    await told(
      this,
      "POST",
      `${competitionAt(this, competition, tournament, "/api/v0")}/games`,
      {
        loser: playerOf(this, "Bob Bowler", competition, tournament),
        winnerScore: "26",
        loserScore: "10",
      },
    );
  },
);

// The game by the part of its id after "game/", as a scenario knows it by who
// beat whom.
export const gameAt = (
  world: WebWorld,
  winner: string,
  loser: string,
  competition: string,
  tournament: string,
  api: string,
): string => {
  const id = world.games.get(
    within(within(tournament, competition), `${winner}>${loser}`),
  );
  assert.ok(id !== undefined, `No game of ${winner} beating ${loser}.`);
  return `${competitionAt(world, competition, tournament, api)}/games/${partOf(id)}`;
};

const corrected =
  '^the game of "([^"]*)" beating "([^"]*)" in "([^"]*)" of "([^"]*)" is corrected to (\\S+) to (\\S+)';

When(
  new RegExp(`${corrected}$`),
  async function (
    this: WebWorld,
    winner: string,
    loser: string,
    competition: string,
    tournament: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await told(
      this,
      "POST",
      `${gameAt(this, winner, loser, competition, tournament, "/api/v0")}/correct`,
      { winnerScore, loserScore },
    );
  },
);

When(
  new RegExp(`${corrected} at the address it was at$`),
  async function (
    this: WebWorld,
    winner: string,
    loser: string,
    competition: string,
    tournament: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await told(
      this,
      "POST",
      `${gameAt(this, winner, loser, competition, tournament, "/api/site")}/correct`,
      { winnerScore, loserScore },
    );
  },
);

// What the website's own page lists of a competition's games, which is how a
// manager sees them.
When(
  "the games of {string} in {string} are listed to the caller",
  async function (this: WebWorld, competition: string, tournament: string) {
    const { session } = sceneOf(this);
    const answer = await fetch(
      `${this.baseUrl!}${competitionAt(this, competition, tournament, "/api/site")}/games`,
      { headers: { cookie: `session=${session!}` } },
    );
    assert.equal(answer.status, 200, "The site would not list the games.");
    sceneOf(this).answer = {
      status: answer.status,
      headers: answer.headers,
      body: (await answer.json()) as Record<string, unknown>,
    };
  },
);

export const gamesListed = (world: WebWorld): Record<string, unknown>[] =>
  answered(world).body["games"] as Record<string, unknown>[];

Then("the API says the id of the game", function (this: WebWorld) {
  assert.match(String(answered(this).body["id"]), /^game\//);
});

Then("the site lists one game", function (this: WebWorld) {
  assert.equal(gamesListed(this).length, 1);
});

Then(
  "the site lists the game as {int} to {int}",
  function (this: WebWorld, winnerScore: number, loserScore: number) {
    const [game] = gamesListed(this);
    assert.equal(game?.["winnerScore"], String(winnerScore));
    assert.equal(game?.["loserScore"], String(loserScore));
  },
);
