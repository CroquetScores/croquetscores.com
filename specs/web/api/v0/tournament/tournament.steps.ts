// The public API's answer for one tournament (tournament.feature), asked as an
// app asks: plain requests, with the key as a bearer token when it has one.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { sessionFor } from "../../../support/control.js";
import type { WebWorld } from "../../../support/world.js";
import { tournamentIdOf, within } from "../../site/advantage/apiScene.js";
import {
  answered,
  asked,
  bearer,
  keyMade,
  rememberKeyShownBy,
  sceneOf,
} from "../apiOfApps.js";

// Where the API tells of a tournament, which is also where it is asked for.
const hrefOfTournament = (world: WebWorld, name: string): string =>
  `/api/v0/tournaments/${tournamentIdOf(world, name).replace(/^tournament\//, "")}`;

const read = async (
  world: WebWorld,
  path: string,
  headers: Record<string, string>,
): Promise<void> => {
  await asked(world, path, headers);
};

When(
  "the tournament {string} is read with that key",
  async function (this: WebWorld, name: string) {
    sceneOf(this).earlier = undefined;
    await read(this, hrefOfTournament(this, name), bearer(keyMade(this)));
  },
);

When(
  "the tournament {string} is read with no key",
  async function (this: WebWorld, name: string) {
    await read(this, hrefOfTournament(this, name), {});
  },
);

When(
  "the tournament {string} is read with the key {string}",
  async function (this: WebWorld, name: string, key: string) {
    await read(this, hrefOfTournament(this, name), bearer(key));
  },
);

When(
  "a tournament there is not is read with that key",
  async function (this: WebWorld) {
    await read(
      this,
      "/api/v0/tournaments/not-a-tournament",
      bearer(keyMade(this)),
    );
  },
);

When(
  "the tournament {string} is read again with that key and the mark it gave",
  async function (this: WebWorld, name: string) {
    const scene = sceneOf(this);
    const earlier = scene.earlier ?? answered(this);
    scene.earlier = earlier;
    const mark = earlier.headers.get("etag");
    assert.ok(mark !== null, "The API gave no mark.");
    await read(this, hrefOfTournament(this, name), {
      ...bearer(keyMade(this)),
      "if-none-match": mark,
    });
  },
);

When(
  "the tournament {string} is read again with that key and the date it gave",
  async function (this: WebWorld, name: string) {
    const date = answered(this).headers.get("last-modified");
    assert.ok(date !== null, "The API gave no date.");
    await read(this, hrefOfTournament(this, name), {
      ...bearer(keyMade(this)),
      "if-modified-since": date,
    });
  },
);

// A key made for one tournament, as its owner makes one: by the year, the
// sport and the name of the tournament it is for.
Given(
  "{string} has made a key limited to the tournament {string}",
  async function (this: WebWorld, address: string, name: string) {
    const kept = this.tournaments.get(name);
    assert.ok(kept !== undefined, `No tournament called ${name} was made.`);
    const session = await sessionFor(address);
    const answer = await fetch(`${this.baseUrl!}/account/api-keys/new`, {
      method: "POST",
      headers: {
        cookie: `session=${session}`,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        label: "An app",
        limit: "one",
        year: String(kept.address).slice(0, 4),
        sport: String(kept.request["sport"]),
        tournamentName: name,
      }),
    });
    assert.equal(answer.status, 200, "The site would not make the key.");
    rememberKeyShownBy(this, await answer.text());
  },
);

interface Said {
  readonly [field: string]: unknown;
}

const tournamentRead = (world: WebWorld): Said => answered(world).body;

const listed = (world: WebWorld, field: string): readonly Said[] => {
  const found = tournamentRead(world)[field];
  assert.ok(
    Array.isArray(found),
    `The API listed no ${field}: ${JSON.stringify(tournamentRead(world))}`,
  );
  return found as Said[];
};

const namedIn = (world: WebWorld, field: string, name: string): Said => {
  const found = listed(world, field).find((each) => each["name"] === name);
  assert.ok(found !== undefined, `${name} was not listed.`);
  return found;
};

Then("the tournament read says its id", function (this: WebWorld) {
  assert.equal(
    tournamentRead(this)["id"],
    tournamentIdOf(this, this.lastTournament!),
  );
});

const saysOfTheTournament = (field: string, said: string): void => {
  Then(
    `the tournament read says ${said} {string}`,
    function (this: WebWorld, value: string) {
      assert.equal(tournamentRead(this)[field], value);
    },
  );
};

saysOfTheTournament("name", "its name is");
saysOfTheTournament("starts", "it starts on");
saysOfTheTournament("finishes", "it finishes on");
saysOfTheTournament("country", "its country is");
saysOfTheTournament("region", "its region is");
saysOfTheTournament("sport", "its sport is");
saysOfTheTournament("changedAt", "it last changed at");

Then("the tournament read says where it is found", function (this: WebWorld) {
  const kept = this.tournaments.get(this.lastTournament!);
  assert.ok(kept !== undefined, "No tournament was made.");
  assert.equal(tournamentRead(this)["uri"], `/${kept.address}`);
});

Then(
  "the tournament read lists the competition {string} with its id",
  function (this: WebWorld, name: string) {
    const id = this.competitions.get(within(this.lastTournament!, name));
    assert.ok(id !== undefined, `No competition called ${name} was made.`);
    assert.equal(namedIn(this, "competitions", name)["id"], id);
  },
);

Then(
  "the competition {string} says its kind is {string}",
  function (this: WebWorld, name: string, kind: string) {
    assert.equal(namedIn(this, "competitions", name)["kind"], kind);
  },
);

Then(
  "the competition {string} says its uri is {string}",
  function (this: WebWorld, name: string, uri: string) {
    assert.equal(namedIn(this, "competitions", name)["uri"], uri);
  },
);

Then(
  "the competition {string} says its href is its own address in the API",
  function (this: WebWorld, name: string) {
    const id = this.competitions.get(within(this.lastTournament!, name));
    assert.ok(id !== undefined, `No competition called ${name} was made.`);
    assert.equal(
      namedIn(this, "competitions", name)["href"],
      `${hrefOfTournament(this, this.lastTournament!)}/competitions/${id.replace(/^competition\//, "")}`,
    );
  },
);

Then(
  "the tournament read says its href is its own address in the API",
  function (this: WebWorld) {
    assert.equal(
      tournamentRead(this)["href"],
      hrefOfTournament(this, this.lastTournament!),
    );
  },
);

Then(
  "the tournament read lists one competition whose uri is under {string}",
  function (this: WebWorld, start: string) {
    const competitions = listed(this, "competitions");
    assert.equal(competitions.length, 1);
    assert.ok(String(competitions[0]!["uri"]).startsWith(start));
  },
);

Then(
  "the competition {string} says it last changed at {string}",
  function (this: WebWorld, name: string, moment: string) {
    assert.equal(namedIn(this, "competitions", name)["changedAt"], moment);
  },
);

Then(
  "the tournament read lists one competition of the kind {string}",
  function (this: WebWorld, kind: string) {
    const competitions = listed(this, "competitions");
    assert.equal(competitions.length, 1);
    assert.equal(competitions[0]!["kind"], kind);
  },
);

Then(
  "the competition {string} says a mark of itself",
  function (this: WebWorld, name: string) {
    assert.match(
      String(namedIn(this, "competitions", name)["etag"]),
      /^"[^"]+"$/,
    );
  },
);

Then(
  "the player {string} says a mark of themselves",
  function (this: WebWorld, name: string) {
    assert.match(String(namedIn(this, "players", name)["etag"]), /^"[^"]+"$/);
  },
);

Then("the tournament read lists no competitions", function (this: WebWorld) {
  assert.deepEqual(listed(this, "competitions"), []);
});

Then(
  "the tournament read lists the player {string} with their id",
  function (this: WebWorld, name: string) {
    const id = this.players.get(within(this.lastTournament!, name));
    assert.ok(id !== undefined, `No player called ${name} was added.`);
    assert.equal(namedIn(this, "players", name)["id"], id);
  },
);

Then("the tournament read lists no players", function (this: WebWorld) {
  assert.deepEqual(listed(this, "players"), []);
});

Then(
  "the player {string} says their world ranking name is {string}",
  function (this: WebWorld, name: string, said: string) {
    assert.equal(namedIn(this, "players", name)["worldRankingName"], said);
  },
);

Then(
  "the player {string} says their handicap is {string}",
  function (this: WebWorld, name: string, said: string) {
    assert.equal(namedIn(this, "players", name)["handicap"], said);
  },
);

Then(
  "the player {string} says they have no handicap",
  function (this: WebWorld, name: string) {
    assert.equal(namedIn(this, "players", name)["handicap"], null);
  },
);

Then(
  "the player {string} says they represent {string}",
  function (this: WebWorld, name: string, said: string) {
    assert.equal(namedIn(this, "players", name)["representing"], said);
  },
);

Then(
  "the tournament read lists the team {string} with the player {string}",
  function (this: WebWorld, team: string, player: string) {
    const found = namedIn(this, "teams", team);
    const players = found["players"];
    assert.ok(Array.isArray(players), "The team listed no players.");
    assert.ok(
      (players as Said[]).some((each) => each["name"] === player),
      `${player} was not in ${team}.`,
    );
  },
);
