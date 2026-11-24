// The public API's answers about a competition: its standings and its games
// (standings.feature, games.feature), asked as an app asks: plain requests,
// with the key as a bearer token when it has one.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { tournamentIdOf, within } from "../../site/advantage/apiScene.js";
import { answered, asked, bearer, keyMade, sceneOf } from "../apiOfApps.js";

// Which competition the last step read, so that the steps after it can say
// what ids it has.
const reading = new WeakMap<
  WebWorld,
  { tournament: string; competition: string }
>();

const bare = (id: string): string => id.slice(id.indexOf("/") + 1);

const idOfCompetition = (
  world: WebWorld,
  tournament: string,
  competition: string,
): string => {
  const id =
    world.competitions.get(within(tournament, competition)) ??
    world.tests.get(within(tournament, competition))?.id;
  assert.ok(id !== undefined, `No competition called ${competition} was made.`);
  return id;
};

const pathOf = (
  world: WebWorld,
  what: string,
  tournament: string,
  competition: string,
  asCompetitionOf = tournament,
): string => {
  reading.set(world, { tournament, competition });
  return `/api/v1/tournaments/${bare(tournamentIdOf(world, asCompetitionOf))}/competitions/${bare(idOfCompetition(world, tournament, competition))}/${what}`;
};

const withThatKey = (world: WebWorld): Record<string, string> =>
  bearer(keyMade(world));

When(
  /^the (standings|games) of "([^"]*)" in "([^"]*)" are read with that key$/,
  async function (
    this: WebWorld,
    what: string,
    competition: string,
    tournament: string,
  ) {
    sceneOf(this).earlier = undefined;
    await asked(
      this,
      pathOf(this, what, tournament, competition),
      withThatKey(this),
    );
  },
);

When(
  /^the (standings|games) of "([^"]*)" in "([^"]*)" are read with no key$/,
  async function (
    this: WebWorld,
    what: string,
    competition: string,
    tournament: string,
  ) {
    await asked(this, pathOf(this, what, tournament, competition), {});
  },
);

When(
  /^the (standings|games) of "([^"]*)" in "([^"]*)" are read with the key "([^"]*)"$/,
  async function (
    this: WebWorld,
    what: string,
    competition: string,
    tournament: string,
    key: string,
  ) {
    await asked(this, pathOf(this, what, tournament, competition), bearer(key));
  },
);

When(
  /^the (standings|games) of "([^"]*)" in "([^"]*)" are read again with that key and the mark it gave$/,
  async function (
    this: WebWorld,
    what: string,
    competition: string,
    tournament: string,
  ) {
    const scene = sceneOf(this);
    const earlier = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await asked(this, pathOf(this, what, tournament, competition), {
      ...withThatKey(this),
      "if-none-match": mark,
    });
  },
);

When(
  /^the (standings|games) of a competition in a tournament there is not are read with that key$/,
  async function (this: WebWorld, what: string) {
    await asked(
      this,
      `/api/v1/tournaments/not-a-tournament/competitions/not-a-competition/${what}`,
      withThatKey(this),
    );
  },
);

When(
  /^the (standings|games) of a competition there is not in "([^"]*)" are read with that key$/,
  async function (this: WebWorld, what: string, tournament: string) {
    await asked(
      this,
      `/api/v1/tournaments/${bare(tournamentIdOf(this, tournament))}/competitions/not-a-competition/${what}`,
      withThatKey(this),
    );
  },
);

When(
  /^the (standings|games) of "([^"]*)" of "([^"]*)" are read as a competition of "([^"]*)"$/,
  async function (
    this: WebWorld,
    what: string,
    competition: string,
    tournament: string,
    other: string,
  ) {
    await asked(
      this,
      pathOf(this, what, tournament, competition, other),
      withThatKey(this),
    );
  },
);

interface Said {
  readonly [field: string]: unknown;
}

const head = (world: WebWorld): Said => {
  const found = answered(world).body["competition"];
  assert.ok(typeof found === "object" && found !== null, "No competition.");
  return found as Said;
};

const listed = (world: WebWorld, field: string): readonly Said[] => {
  const found = answered(world).body[field];
  assert.ok(Array.isArray(found), `The API listed no ${field}.`);
  return found as Said[];
};

const bothOf = (
  world: WebWorld,
): { tournament: string; competition: string } => {
  const found = reading.get(world);
  assert.ok(found !== undefined, "No competition was read.");
  return found;
};

// The competition itself ---------------------------------------------------------

const ownPath = (world: WebWorld, tournament: string, competition: string) =>
  pathOf(world, "x", tournament, competition).replace(/\/x$/, "");

When(
  "the competition {string} of {string} is read with that key",
  async function (this: WebWorld, competition: string, tournament: string) {
    sceneOf(this).earlier = undefined;
    await asked(
      this,
      ownPath(this, tournament, competition),
      withThatKey(this),
    );
  },
);

When(
  "the competition {string} of {string} is read with no key",
  async function (this: WebWorld, competition: string, tournament: string) {
    await asked(this, ownPath(this, tournament, competition), {});
  },
);

When(
  "the competition {string} of {string} is read with the key {string}",
  async function (
    this: WebWorld,
    competition: string,
    tournament: string,
    key: string,
  ) {
    await asked(this, ownPath(this, tournament, competition), bearer(key));
  },
);

When(
  "the competition {string} of {string} is read again with that key and the mark it gave",
  async function (this: WebWorld, competition: string, tournament: string) {
    const scene = sceneOf(this);
    const earlier = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await asked(this, ownPath(this, tournament, competition), {
      ...withThatKey(this),
      "if-none-match": mark,
    });
  },
);

When(
  "a competition in a tournament there is not is read with that key",
  async function (this: WebWorld) {
    await asked(
      this,
      "/api/v1/tournaments/not-a-tournament/competitions/not-a-competition",
      withThatKey(this),
    );
  },
);

When(
  "a competition there is not in {string} is read with that key",
  async function (this: WebWorld, tournament: string) {
    await asked(
      this,
      `/api/v1/tournaments/${bare(tournamentIdOf(this, tournament))}/competitions/not-a-competition`,
      withThatKey(this),
    );
  },
);

const competitionRead = (world: WebWorld): Record<string, unknown> =>
  answered(world).body;

Then("the competition read says its id", function (this: WebWorld) {
  const { tournament, competition } = bothOf(this);
  assert.equal(
    competitionRead(this)["id"],
    idOfCompetition(this, tournament, competition),
  );
});

Then(
  "the competition read says its name is {string}",
  function (this: WebWorld, name: string) {
    assert.equal(competitionRead(this)["name"], name);
  },
);

Then(
  "the competition read says its kind is {string}",
  function (this: WebWorld, kind: string) {
    assert.equal(competitionRead(this)["kind"], kind);
  },
);

Then(
  "the competition read says its uri is {string}",
  function (this: WebWorld, uri: string) {
    assert.equal(competitionRead(this)["uri"], uri);
  },
);

Then(
  "the competition read says its uri begins {string}",
  function (this: WebWorld, start: string) {
    assert.ok(String(competitionRead(this)["uri"]).startsWith(start));
  },
);

Then(
  "the competition read says it last changed at {string}",
  function (this: WebWorld, moment: string) {
    assert.equal(competitionRead(this)["changedAt"], moment);
  },
);

Then(
  "the competition read says its href is its own address in the API",
  function (this: WebWorld) {
    const { tournament, competition } = bothOf(this);
    assert.equal(
      competitionRead(this)["href"],
      ownPath(this, tournament, competition),
    );
  },
);

for (const part of ["games", "standings"] as const) {
  Then(
    `the competition read says its ${part} are at its own address in the API`,
    function (this: WebWorld) {
      const { tournament, competition } = bothOf(this);
      assert.equal(
        competitionRead(this)[part],
        `${ownPath(this, tournament, competition)}/${part}`,
      );
    },
  );
}

Then("the competition read says no standings", function (this: WebWorld) {
  assert.equal("standings" in competitionRead(this), false);
});

// What the answer begins with ---------------------------------------------------

const areOf = (what: string): void => {
  Then(
    new RegExp(`^the ${what} are of the competition "([^"]*)", an? (\\w+)$`),
    function (this: WebWorld, name: string, kind: string) {
      const { tournament } = bothOf(this);
      assert.equal(head(this)["name"], name);
      assert.equal(head(this)["kind"], kind);
      assert.equal(head(this)["id"], idOfCompetition(this, tournament, name));
    },
  );
  Then(
    new RegExp(
      `^the ${what} say where the API tells of the competition "([^"]*)"$`,
    ),
    function (this: WebWorld, name: string) {
      const { tournament } = bothOf(this);
      assert.equal(
        head(this)["href"],
        `/api/v1/tournaments/${bare(tournamentIdOf(this, tournament))}/competitions/${bare(idOfCompetition(this, tournament, name))}`,
      );
    },
  );
  Then(
    new RegExp(`^the ${what} say the competition last changed at "([^"]*)"$`),
    function (this: WebWorld, moment: string) {
      assert.equal(head(this)["changedAt"], moment);
    },
  );
};
areOf("standings");
areOf("games");

// Standings ---------------------------------------------------------------------

const standingOf = (world: WebWorld, name: string): Said => {
  const found = listed(world, "standings").find(
    (each) => each["name"] === name,
  );
  assert.ok(found !== undefined, `${name} is not in the standings.`);
  return found;
};

Then(
  /^the standings list "([^"]*)" and then "([^"]*)"$/,
  function (this: WebWorld, first: string, second: string) {
    assert.deepEqual(
      listed(this, "standings").map((each) => each["name"]),
      [first, second],
    );
  },
);

const standingSays = (said: string, field: string, after = ""): void => {
  Then(
    `the standing of {string} says ${said} {int}${after}`,
    function (this: WebWorld, name: string, value: number) {
      assert.equal(standingOf(this, name)[field], value);
    },
  );
};
standingSays("their place is", "position");
standingSays("they have played", "played");
standingSays("they have won", "won");
standingSays("they have lost", "lost");
standingSays("they have won", "gamesWon", " games");
standingSays("their net games are", "netGames");
standingSays("their net hoops are", "netHoops");

Then(
  "the standing of {string} says a mark of itself",
  function (this: WebWorld, name: string) {
    assert.match(String(standingOf(this, name)["etag"]), /^"[^"]+"$/);
  },
);

Then(
  "the standing of {string} says they have withdrawn",
  function (this: WebWorld, name: string) {
    assert.equal(standingOf(this, name)["withdrawn"], true);
  },
);

Then(
  "the standing of {string} says they have no place",
  function (this: WebWorld, name: string) {
    assert.equal(standingOf(this, name)["position"], null);
  },
);

Then(
  "the standing of {string} says the place is shared",
  function (this: WebWorld, name: string) {
    assert.equal(standingOf(this, name)["shared"], true);
  },
);

Then(
  "the standing of {string} says nothing of matches lost",
  function (this: WebWorld, name: string) {
    assert.equal(standingOf(this, name)["lost"], undefined);
  },
);

Then(
  "the standing of {string} says nothing of net games",
  function (this: WebWorld, name: string) {
    assert.equal(standingOf(this, name)["netGames"], undefined);
  },
);

Then(
  "the standing of {string} names them by the id the tournament keeps them by",
  function (this: WebWorld, name: string) {
    const { tournament } = bothOf(this);
    assert.equal(
      standingOf(this, name)["playerId"],
      this.players.get(within(tournament, name)),
    );
  },
);

// Games -------------------------------------------------------------------------

// A game and the players of it, whether it is listed or is in a match.
const everyGame = (world: WebWorld): readonly Said[] => {
  const body = answered(world).body;
  if (Array.isArray(body["games"])) return body["games"] as Said[];
  return listed(world, "matches").flatMap((match) => match["games"] as Said[]);
};

const nameOf = (side: unknown): unknown => (side as Said)["name"];

const gameOf = (world: WebWorld, winner: string, loser: string): Said => {
  const found = everyGame(world).find(
    (each) =>
      nameOf(each["winner"]) === winner && nameOf(each["loser"]) === loser,
  );
  assert.ok(found !== undefined, `No game of ${winner} beating ${loser}.`);
  return found;
};

Then(
  /^the games listed are "([^"]*)"(?: and "([^"]*)")?$/,
  function (this: WebWorld, first: string, second: string | null | undefined) {
    const said = (each: Said): string =>
      `${String(nameOf(each["winner"]))} beating ${String(nameOf(each["loser"]))}`;
    assert.deepEqual(
      listed(this, "games").map(said),
      second == null ? [first] : [first, second],
    );
  },
);

Then("no games are listed", function (this: WebWorld) {
  assert.deepEqual(listed(this, "games"), []);
});

Then(
  "the game of {string} beating {string} says its id",
  function (this: WebWorld, winner: string, loser: string) {
    const { tournament, competition } = bothOf(this);
    const id = this.games.get(
      within(within(tournament, competition), `${winner}>${loser}`),
    );
    assert.ok(id !== undefined, "No such game was added.");
    assert.equal(gameOf(this, winner, loser)["id"], id);
  },
);

Then(
  "the game of {string} beating {string} says the winner scored {string}",
  function (this: WebWorld, winner: string, loser: string, score: string) {
    assert.equal(
      (gameOf(this, winner, loser)["winner"] as Said)["score"],
      score,
    );
  },
);

Then(
  "the game of {string} beating {string} says the loser scored {string}",
  function (this: WebWorld, winner: string, loser: string, score: string) {
    assert.equal(
      (gameOf(this, winner, loser)["loser"] as Said)["score"],
      score,
    );
  },
);

const keptPlayerId = (world: WebWorld, name: string): string | undefined => {
  const { tournament } = bothOf(world);
  return (
    world.players.get(within(tournament, name)) ??
    world.teamPlayers.get(within(tournament, name))
  );
};

for (const side of ["winner", "loser"] as const) {
  Then(
    `the game of {string} beating {string} names the ${side} by the id the tournament keeps them by`,
    function (this: WebWorld, winner: string, loser: string) {
      const who = side === "winner" ? winner : loser;
      assert.equal(
        (gameOf(this, winner, loser)[side] as Said)["playerId"],
        keptPlayerId(this, who),
      );
    },
  );
}

Then(
  "the game of {string} beating {string} says a mark of itself",
  function (this: WebWorld, winner: string, loser: string) {
    assert.match(String(gameOf(this, winner, loser)["etag"]), /^"[^"]+"$/);
  },
);

const gameSays = (said: string, field: string, value: unknown): void => {
  Then(
    `the game of {string} beating {string} says it was ${said}`,
    function (this: WebWorld, winner: string, loser: string) {
      assert.equal(gameOf(this, winner, loser)[field], value);
    },
  );
};
gameSays("not drawn", "drawn", false);
gameSays("drawn", "drawn", true);
gameSays("withdrawn", "withdrawn", true);
gameSays("played in no round", "round", null);

Then(
  "the game of {string} beating {string} says it was played in round {int}",
  function (this: WebWorld, winner: string, loser: string, round: number) {
    assert.equal(gameOf(this, winner, loser)["round"], round);
  },
);

Then(
  "the game of {string} beating {string} says it last changed at {string}",
  function (this: WebWorld, winner: string, loser: string, moment: string) {
    assert.equal(gameOf(this, winner, loser)["changedAt"], moment);
  },
);

// A test's matches ---------------------------------------------------------------

const matchBetween = (world: WebWorld, one: string, other: string): Said => {
  const found = listed(world, "matches").find((match) => {
    const names = (match["players"] as Said[]).map((each) => each["name"]);
    return names[0] === one && names[1] === other;
  });
  assert.ok(found !== undefined, `No match between ${one} and ${other}.`);
  return found;
};

Then(
  "the match between {string} and {string} says a mark of itself",
  function (this: WebWorld, one: string, other: string) {
    assert.match(String(matchBetween(this, one, other)["etag"]), /^"[^"]+"$/);
  },
);

Then(
  "the answer lists a match between {string} and {string}",
  function (this: WebWorld, one: string, other: string) {
    matchBetween(this, one, other);
  },
);

Then(
  "the match between {string} and {string} has the game of {string} beating {string}",
  function (
    this: WebWorld,
    one: string,
    other: string,
    winner: string,
    loser: string,
  ) {
    const games = matchBetween(this, one, other)["games"] as Said[];
    assert.ok(
      games.some(
        (each) =>
          nameOf(each["winner"]) === winner && nameOf(each["loser"]) === loser,
      ),
    );
  },
);

Then(
  "the game of {string} beating {string} in the match says the winner scored {string}",
  function (this: WebWorld, winner: string, loser: string, score: string) {
    assert.equal(
      (gameOf(this, winner, loser)["winner"] as Said)["score"],
      score,
    );
  },
);
