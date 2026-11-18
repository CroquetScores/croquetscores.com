import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { call, makeAccount, sessionFor } from "../../../support/control.js";
import { keptOf, type KeptCompetition } from "../../../support/kept.js";
import { siteTold } from "../../../support/site.js";
import { createTournament } from "../../../support/tournaments.js";
import type { WebWorld } from "../../../support/world.js";

// What these scenarios send the API, as the admin's dialogs send it, and what it
// answers: plain requests with the session the manager holds and the website
// they are said to be for, since which website a request is for is the host it
// was addressed to (advantageGolfCroquet.feature). No browser is needed.

const manager = "manager@example.com";

interface Answered {
  readonly status: number;
  readonly body: unknown;
}

// What the scenario has made and what the last request was answered with, kept
// here rather than on the world, which every scenario in specs/web shares.
interface Scene {
  /** The tournaments made, by name, as the API names them: the part of the id after "tournament/". */
  readonly tournaments: Map<string, string>;
  /** The competitions made, by tournament and name: the whole id. */
  readonly competitions: Map<string, string>;
  /** The teams made, by tournament and name: the whole id. */
  readonly teams: Map<string, string>;
  /** The tournament a step means when it says "the tournament". */
  usual: string;
  answered: Answered | undefined;
}

const scenes = new WeakMap<WebWorld, Scene>();

const sceneOf = (world: WebWorld): Scene => {
  let scene = scenes.get(world);
  if (scene === undefined) {
    scene = {
      tournaments: new Map(),
      competitions: new Map(),
      teams: new Map(),
      usual: "",
      answered: undefined,
    };
    scenes.set(world, scene);
  }
  return scene;
};

const within = (tournament: string, name: string): string =>
  `${tournament}\u0000${name}`;

const bare = (id: string, kind: string): string => {
  assert.ok(id.startsWith(`${kind}/`), `${id} is not a ${kind} id.`);
  return id.slice(kind.length + 1);
};

const tournamentIdOf = (world: WebWorld, name: string): string => {
  const found = world.tournaments.get(name);
  assert.ok(found !== undefined, `No tournament called ${name} was made.`);
  return found.id;
};

// What the control is told, and what it answers with the id of.
const made = async (
  what: string,
  path: string,
  body: object,
): Promise<string> => {
  const answer = await call("POST", path, body);
  if (answer.status !== 201) {
    throw new Error(
      `The site would not ${what}: ${String(answer.status)} ${await answer.text()}`,
    );
  }
  return ((await answer.json()) as { id: string }).id;
};

// The API, asked as the manager, for the website `host`. The site trusts the
// proxy in front of it for the host a reader typed, which is how a request
// says which website it is for, and says it comes from its own pages, as the
// admin's requests do.
const asked = async (
  world: WebWorld,
  host: string,
  method: "GET" | "POST" | "PUT",
  path: string,
  body?: object,
): Promise<void> => {
  const session = world.apiSession;
  const answer = await fetch(`${world.baseUrl!}/api/site${path}`, {
    method,
    headers: {
      "x-forwarded-host": host,
      "sec-fetch-site": "same-origin",
      ...(session === undefined ? {} : { cookie: `session=${session}` }),
      ...(body === undefined ? {} : { "content-type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const text = await answer.text();
  sceneOf(world).answered = {
    status: answer.status,
    body: text === "" ? undefined : (JSON.parse(text) as unknown),
  };
};

const answeredOf = (world: WebWorld): Answered => {
  const { answered } = sceneOf(world);
  assert.ok(answered !== undefined, "Nothing has been asked of the API.");
  return answered;
};

// The tournament a scenario made, as the manager of it, signed in.
Given(
  "a manager of a golf croquet tournament {string}, signed in",
  async function (this: WebWorld, name: string) {
    await makeAccount({ emailAddress: manager, name: "Ollie Organiser" });
    this.apiSession = await sessionFor(manager);
    await createTournament(this, manager, name, undefined, { sport: "gc" });
    sceneOf(this).usual = name;
    sceneOf(this).tournaments.set(
      name,
      bare(tournamentIdOf(this, name), "tournament"),
    );
  },
);

Given(
  "a golf croquet teams tournament {string} with the teams {string} and {string}, managed by the signed-in reader",
  async function (this: WebWorld, name: string, first: string, second: string) {
    await createTournament(this, manager, name, undefined, {
      sport: "gc",
      format: "Teams",
    });
    const scene = sceneOf(this);
    scene.tournaments.set(name, bare(tournamentIdOf(this, name), "tournament"));
    for (const team of [first, second]) {
      const id = await made("add the team", "/tournaments/teams", {
        manager,
        tournament: tournamentIdOf(this, name),
        team: { name: team, shortName: team.slice(0, 3).toUpperCase() },
      });
      scene.teams.set(within(name, team), id);
    }
  },
);

// The site is told what a deployment is told, and the scenario talks to it from
// then on. Told nothing is the site as it was started, which is told nothing.
Given(
  "the site is told Advantage Golf Croquet is offered",
  async function (this: WebWorld) {
    this.baseUrl = (await siteTold({ ADVANTAGE_GOLF_CROQUET: "true" })).baseUrl;
  },
);

Given(
  "the site is told nothing about Advantage Golf Croquet",
  function (this: WebWorld) {
    assert.ok(this.baseUrl !== undefined, "The scenario has no site.");
  },
);

Given(
  "the site is no longer told Advantage Golf Croquet is offered",
  async function (this: WebWorld) {
    this.baseUrl = (
      await siteTold({ ADVANTAGE_GOLF_CROQUET: "false" })
    ).baseUrl;
  },
);

// Competitions already there, added by the control as the manager, with the
// rules the scenario says.
const addedBlock = async (
  world: WebWorld,
  name: string,
  rules?: object,
): Promise<void> => {
  const scene = sceneOf(world);
  const id = await made("add the block", "/tournaments/blocks", {
    manager,
    tournament: tournamentIdOf(world, scene.usual),
    name,
    ...(rules === undefined ? {} : { rules }),
  });
  scene.competitions.set(within(scene.usual, name), id);
};

Given(
  "the block {string} has been added to the tournament",
  async function (this: WebWorld, name: string) {
    await addedBlock(this, name);
  },
);

Given(
  "the block {string} has been added to the tournament as Advantage",
  async function (this: WebWorld, name: string) {
    await addedBlock(this, name, { advantage: true });
  },
);

// A score is kept in the block between two players entered in it, and what it
// was is of no matter: only that the block has one.
Given(
  "the block {string} has a game kept",
  async function (this: WebWorld, name: string) {
    const scene = sceneOf(this);
    const tournament = tournamentIdOf(this, scene.usual);
    const block = scene.competitions.get(within(scene.usual, name));
    assert.ok(block !== undefined, `The tournament has no block ${name}.`);
    const entered: string[] = [];
    for (const player of ["Sam Someone", "Alex Another"]) {
      const playerId = await made("add the player", "/tournaments/players", {
        manager,
        tournament,
        player: { name: player },
      });
      entered.push(
        await made("enter the player", "/competitions/players", {
          manager,
          tournament,
          competition: block,
          player: playerId,
        }),
      );
    }
    await made("add the game", "/competitions/games", {
      manager,
      tournament,
      competition: block,
      winner: entered[0],
      winnerScore: "7",
      loser: entered[1],
      loserScore: "3",
    });
  },
);

Given(
  "the test between {string} and {string} has been added to {string}",
  async function (
    this: WebWorld,
    first: string,
    second: string,
    tournament: string,
  ) {
    const scene = sceneOf(this);
    const one = scene.teams.get(within(tournament, first));
    const other = scene.teams.get(within(tournament, second));
    assert.ok(one !== undefined && other !== undefined, "Teams not made.");
    const day = String(
      this.tournaments.get(tournament)?.request["starts"],
    ).slice(0, 10);
    const id = await made("add the test", "/tournaments/tests", {
      manager,
      tournament: tournamentIdOf(this, tournament),
      test: {
        firstTeam: one,
        secondTeam: other,
        starts: day,
        finishes: day,
        expectedMatches: 1,
        bestOf: 1,
      },
    });
    const shortName = (name: string): string => name.slice(0, 3).toUpperCase();
    scene.competitions.set(
      within(tournament, `${shortName(first)} v ${shortName(second)}`),
      id,
    );
  },
);

// What a request says of Advantage: yes, no, or nothing at all.
const saying = (said: string | undefined): object => {
  if (said === "it is Advantage") return { advantage: true };
  if (said === "it is not Advantage") return { advantage: false };
  return {};
};

// A competition added by a request, as the competition dialog sends it.
When(
  /^a request as "([^"]*)" adds the (block|knockout|Swiss) "([^"]*)" saying (it is Advantage|it is not Advantage|nothing of Advantage)$/,
  async function (
    this: WebWorld,
    host: string,
    kind: string,
    name: string,
    said: string,
  ) {
    const scene = sceneOf(this);
    const shape =
      kind === "knockout"
        ? { kind: "knockout", places: 4, rounds: [1, 1] }
        : kind === "Swiss"
          ? { kind: "swiss", bestOf: 1 }
          : { kind: "block", bestOf: 1, rounds: 1 };
    await asked(
      this,
      host,
      "POST",
      `/tournaments/${scene.tournaments.get(scene.usual)!}/competitions`,
      { name, ...shape, ...saying(said) },
    );
  },
);

// A competition changed by a request: its kind is said, as the dialog says it,
// and its name is what it was unless the request calls it something else.
When(
  /^a request as "([^"]*)" changes the block "([^"]*)" saying (it is Advantage|it is not Advantage)(?: and calling it "([^"]*)")?$/,
  async function (
    this: WebWorld,
    host: string,
    name: string,
    said: string,
    calling: string | undefined,
  ) {
    const scene = sceneOf(this);
    const block = scene.competitions.get(within(scene.usual, name));
    assert.ok(block !== undefined, `The tournament has no block ${name}.`);
    await asked(
      this,
      host,
      "PUT",
      `/tournaments/${scene.tournaments.get(scene.usual)!}/competitions/${bare(block, "competition")}`,
      {
        kind: "block",
        name: calling ?? name,
        bestOf: 1,
        rounds: 1,
        ...saying(said),
      },
    );
  },
);

const testBody = (
  world: WebWorld,
  tournament: string,
  first: string,
  second: string,
  said: string,
): object => {
  const scene = sceneOf(world);
  const day = String(
    world.tournaments.get(tournament)?.request["starts"],
  ).slice(0, 10);
  return {
    firstTeam: bare(scene.teams.get(within(tournament, first))!, "team"),
    secondTeam: bare(scene.teams.get(within(tournament, second))!, "team"),
    starts: day,
    finishes: day,
    expectedMatches: 1,
    bestOf: 1,
    group: "",
    ...saying(said),
  };
};

When(
  /^a request as "([^"]*)" adds the test between "([^"]*)" and "([^"]*)" saying (it is Advantage)$/,
  async function (
    this: WebWorld,
    host: string,
    first: string,
    second: string,
    said: string,
  ) {
    const tournament = [...sceneOf(this).tournaments.keys()].at(-1)!;
    await asked(
      this,
      host,
      "POST",
      `/tournaments/${sceneOf(this).tournaments.get(tournament)!}/tests`,
      testBody(this, tournament, first, second, said),
    );
  },
);

When(
  /^a request as "([^"]*)" changes the test "([^"]*)" saying (it is Advantage)$/,
  async function (this: WebWorld, host: string, name: string, said: string) {
    const scene = sceneOf(this);
    const tournament = [...scene.tournaments.keys()].at(-1)!;
    const [first, second] = name.split(" v ");
    // The test is between the teams whose short names are in its name.
    const teamCalled = (short: string): string =>
      [...scene.teams.keys()]
        .filter((key) => key.startsWith(`${tournament}\u0000`))
        .map((key) => key.slice(tournament.length + 1))
        .find((team) => team.slice(0, 3).toUpperCase() === short)!;
    const test = scene.competitions.get(within(tournament, name));
    assert.ok(test !== undefined, `The tournament has no test ${name}.`);
    await asked(
      this,
      host,
      "PUT",
      `/tournaments/${scene.tournaments.get(tournament)!}/tests/${bare(test, "competition")}`,
      testBody(this, tournament, teamCalled(first!), teamCalled(second!), said),
    );
  },
);

When(
  /^a request as "([^"]*)" asks whether Advantage is offered$/,
  async function (this: WebWorld, host: string) {
    await asked(this, host, "GET", "/advantage-golf-croquet");
  },
);

When(
  /^a request as "([^"]*)" lists the tournament's competitions$/,
  async function (this: WebWorld, host: string) {
    const scene = sceneOf(this);
    await asked(
      this,
      host,
      "GET",
      `/tournaments/${scene.tournaments.get(scene.usual)!}/competitions`,
    );
  },
);

Then("the request is answered as done", function (this: WebWorld) {
  const { status, body } = answeredOf(this);
  assert.ok(
    status === 201 || status === 204,
    `The request was answered ${String(status)}: ${JSON.stringify(body)}`,
  );
});

Then(
  "the request is refused with {string}",
  function (this: WebWorld, code: string) {
    const { status, body } = answeredOf(this);
    assert.equal(status, 422, JSON.stringify(body));
    assert.equal((body as { error?: string }).error, code);
  },
);

Then(
  /^the answer is that it is (offered|not offered)$/,
  function (this: WebWorld, which: string) {
    const { status, body } = answeredOf(this);
    assert.equal(status, 200, JSON.stringify(body));
    assert.equal((body as { offered: boolean }).offered, which === "offered");
  },
);

// What the tournament holds, from the site and not from the answer to a
// request, since a refused request is meant to have kept nothing.
const competitionNamed = async (
  world: WebWorld,
  tournament: string,
  name: string,
): Promise<KeptCompetition | undefined> =>
  (await keptOf(world, tournament)).competitions.find(
    (each) => each.name === name,
  );

Then(
  /^the tournament has the competition "([^"]*)"$/,
  async function (this: WebWorld, name: string) {
    assert.ok(
      (await competitionNamed(this, sceneOf(this).usual, name)) !== undefined,
    );
  },
);

Then(
  /^the tournament has no competition "([^"]*)"$/,
  async function (this: WebWorld, name: string) {
    assert.equal(
      await competitionNamed(this, sceneOf(this).usual, name),
      undefined,
    );
  },
);

Then(
  /^the tournament "([^"]*)" has no competition "([^"]*)"$/,
  async function (this: WebWorld, tournament: string, name: string) {
    assert.equal(await competitionNamed(this, tournament, name), undefined);
  },
);

Then(
  /^the tournament's competition "([^"]*)" is (not )?Advantage$/,
  async function (this: WebWorld, name: string, not: string | null) {
    const found = await competitionNamed(this, sceneOf(this).usual, name);
    assert.ok(
      found !== undefined,
      `The tournament has no competition ${name}.`,
    );
    assert.equal(found.rules.advantage, not === null);
  },
);

Then(
  /^the competition "([^"]*)" of "([^"]*)" is (not )?Advantage$/,
  async function (
    this: WebWorld,
    name: string,
    tournament: string,
    not: string | null,
  ) {
    const found = await competitionNamed(this, tournament, name);
    assert.ok(found !== undefined, `${tournament} has no competition ${name}.`);
    assert.equal(found.rules.advantage, not === null);
  },
);

Then(
  /^the list says the competition "([^"]*)" is (not )?Advantage$/,
  function (this: WebWorld, name: string, not: string | null) {
    const { status, body } = answeredOf(this);
    assert.equal(status, 200, JSON.stringify(body));
    const listed = (
      body as { competitions: { name: string; advantage: boolean }[] }
    ).competitions.find((each) => each.name === name);
    assert.ok(listed !== undefined, `The list has no competition ${name}.`);
    assert.equal(listed.advantage, not === null);
  },
);
