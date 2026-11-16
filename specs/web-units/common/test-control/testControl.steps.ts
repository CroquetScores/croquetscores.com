import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { LightMyRequestResponse } from "fastify";

import {
  loadConfig,
  loadEnvFile,
} from "../../../../src/infrastructure/config/Config.js";
import {
  buildApplication,
  type Application,
} from "../../../../src/web/server.js";
import type { SpecWorld } from "../../../support/world.js";

// What each scenario has asked for, and what came of it.
interface Control {
  token: string | undefined;
  databaseUrl: string | undefined;
  application: Application | undefined;
  response: LightMyRequestResponse | undefined;
  refusal: unknown;
}

const controls = new WeakMap<SpecWorld, Control>();

const controlOf = (world: SpecWorld): Control => {
  let found = controls.get(world);
  if (found === undefined) {
    found = {
      token: undefined,
      databaseUrl: undefined,
      application: undefined,
      response: undefined,
      refusal: undefined,
    };
    controls.set(world, found);
  }
  return found;
};

const start = async (world: SpecWorld): Promise<void> => {
  const control = controlOf(world);
  const scratch = world.database.options.connectionString;
  assert.ok(scratch !== undefined, "The scenario's database has no URL.");
  loadEnvFile();
  const config = loadConfig({
    ...process.env,
    DATABASE_URL: control.databaseUrl ?? scratch,
    TEST_CONTROL_TOKEN: control.token ?? "",
  });
  const application = await buildApplication(config, {
    logger: false,
    sendsTheEmailQueue: false,
  });
  control.application = application;
  world.closeBeforeDropping.push(
    () => application.server.close(),
    () => application.pool.end(),
  );
};

const asked = async (
  world: SpecWorld,
  method: "GET" | "POST" | "DELETE",
  token: string | undefined,
  payload?: object,
): Promise<void> => {
  const control = controlOf(world);
  assert.ok(control.application !== undefined, "The site was not started.");
  control.response = await control.application.server.inject({
    method,
    url: "/__test/clock",
    headers: token === undefined ? {} : { "x-test-control": token },
    ...(payload === undefined ? {} : { payload }),
  });
};

const responseOf = (world: SpecWorld): LightMyRequestResponse => {
  const found = controlOf(world).response;
  assert.ok(found !== undefined, "Nothing was asked of the site.");
  return found;
};

Given("a site given no token", async function (this: SpecWorld) {
  await start(this);
});

Given(
  "a site given the token {string}",
  async function (this: SpecWorld, token: string) {
    controlOf(this).token = token;
    await start(this);
  },
);

Given("a token {string}", function (this: SpecWorld, token: string) {
  controlOf(this).token = token;
});

Given("a database called {string}", function (this: SpecWorld, name: string) {
  controlOf(this).databaseUrl = `postgres://nobody@localhost:5432/${name}`;
});

When(
  "the site is started over that database",
  async function (this: SpecWorld) {
    try {
      await start(this);
    } catch (failure) {
      controlOf(this).refusal = failure;
    }
  },
);

// A site given no token is still asked with one, to show that it is the site
// having none that answers, and not the token being wrong.
When(
  "the clock is asked for with the token {string}",
  async function (this: SpecWorld, token: string) {
    await asked(this, "GET", token);
  },
);

When("the clock is asked for with no token", async function (this: SpecWorld) {
  await asked(this, "GET", undefined);
});

When(
  "the clock is set to {string}",
  async function (this: SpecWorld, moment: string) {
    await asked(this, "POST", controlOf(this).token, { now: moment });
  },
);

Given("the site has kept a failed sign in", async function (this: SpecWorld) {
  const { application } = controlOf(this);
  assert.ok(application !== undefined, "The site was not started.");
  await application.pool.query(
    "insert into failed_sign_ins (email_address, ip_address, failed_at) values ('a@example.com', '127.0.0.1', now())",
  );
});

Given(
  "the site has made the help searchable",
  async function (this: SpecWorld) {
    const { application } = controlOf(this);
    assert.ok(application !== undefined, "The site was not started.");
    await application.pool.query(
      "insert into help_search_state (fingerprint, page_count) values ('made by the scenario', 1) on conflict do nothing",
    );
  },
);

When(
  "the site is told to forget what it kept",
  async function (this: SpecWorld) {
    const control = controlOf(this);
    assert.ok(control.application !== undefined, "The site was not started.");
    control.response = await control.application.server.inject({
      method: "POST",
      url: "/__test/reset",
      headers: { "x-test-control": control.token ?? "" },
    });
    assert.equal(control.response.statusCode, 204);
  },
);

Then("the site has kept no failed sign in", async function (this: SpecWorld) {
  const { application } = controlOf(this);
  assert.ok(application !== undefined, "The site was not started.");
  const { rows } = await application.pool.query<{ kept: string }>(
    "select count(*) as kept from failed_sign_ins",
  );
  assert.equal(rows[0]?.kept, "0");
});

Then("the help is still searchable", async function (this: SpecWorld) {
  const { application } = controlOf(this);
  assert.ok(application !== undefined, "The site was not started.");
  const { rows } = await application.pool.query<{ kept: string }>(
    "select count(*) as kept from help_search_state",
  );
  assert.equal(rows[0]?.kept, "1");
});

When(
  "the home page is asked for in {string}",
  async function (this: SpecWorld, language: string) {
    const control = controlOf(this);
    assert.ok(control.application !== undefined, "The site was not started.");
    control.response = await control.application.server.inject({
      method: "GET",
      url: "/",
      headers: { "accept-language": language },
    });
    assert.equal(control.response.statusCode, 200);
  },
);

Then("the page is in the test locale", function (this: SpecWorld) {
  assert.match(responseOf(this).body, /<html[^>]*lang="en-XA"/);
});

Then("the page is not in the test locale", function (this: SpecWorld) {
  assert.doesNotMatch(responseOf(this).body, /lang="en-XA"/);
});

// What the control was asked to make and the session it handed back, kept
// for the profile page to be asked with.
const sessions = new WeakMap<SpecWorld, string>();

const controlled = async (
  world: SpecWorld,
  url: string,
  payload: object,
): Promise<void> => {
  const control = controlOf(world);
  assert.ok(control.application !== undefined, "The site was not started.");
  control.response = await control.application.server.inject({
    method: "POST",
    url,
    headers: { "x-test-control": control.token ?? "" },
    payload,
  });
};

Given(
  "an account for {string} made through the control",
  async function (this: SpecWorld, emailAddress: string) {
    await controlled(this, "/__test/accounts", { emailAddress });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
  },
);

Given(
  "an unconfirmed account for {string} made through the control",
  async function (this: SpecWorld, emailAddress: string) {
    await controlled(this, "/__test/accounts", {
      emailAddress,
      confirmed: false,
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
  },
);

When(
  "a session for {string} is asked for",
  async function (this: SpecWorld, emailAddress: string) {
    await controlled(this, "/__test/sessions", { emailAddress });
    if (responseOf(this).statusCode === 201) {
      sessions.set(
        this,
        (JSON.parse(responseOf(this).body) as { session: string }).session,
      );
    }
  },
);

const profilePage = async (
  world: SpecWorld,
  session: string | undefined,
): Promise<void> => {
  const control = controlOf(world);
  assert.ok(control.application !== undefined, "The site was not started.");
  control.response = await control.application.server.inject({
    method: "GET",
    url: "/account/profile",
    headers: session === undefined ? {} : { cookie: `session=${session}` },
  });
};

When(
  "the profile page is asked for with that session",
  async function (this: SpecWorld) {
    await profilePage(this, sessions.get(this));
  },
);

When(
  "the profile page is asked for with no session",
  async function (this: SpecWorld) {
    await profilePage(this, undefined);
  },
);

Then("the site sends the reader elsewhere", function (this: SpecWorld) {
  assert.ok(
    [302, 303, 307, 308].includes(responseOf(this).statusCode),
    `The site answered ${responseOf(this).statusCode}.`,
  );
});

When("the clock is put back", async function (this: SpecWorld) {
  await asked(this, "DELETE", controlOf(this).token);
});

Then("the site answers that there is no such page", function (this: SpecWorld) {
  assert.equal(responseOf(this).statusCode, 404);
});

Then("the site answers that it is fine", function (this: SpecWorld) {
  assert.equal(responseOf(this).statusCode, 200);
});

Then("the site answers that the request was wrong", function (this: SpecWorld) {
  assert.equal(responseOf(this).statusCode, 400);
});

Then("the site refuses to start", function (this: SpecWorld) {
  assert.ok(controlOf(this).refusal !== undefined, "The site started.");
});

Then("the refusal names the token", function (this: SpecWorld) {
  assert.match(String(controlOf(this).refusal), /TEST_CONTROL_TOKEN/);
});

const within = (world: SpecWorld, moment: Date, seconds: number): void => {
  const told = new Date(
    (JSON.parse(responseOf(world).body) as { now: string }).now,
  );
  assert.ok(
    Math.abs(told.getTime() - moment.getTime()) <= seconds * 1000,
    `The clock reads ${told.toISOString()}, not within ${seconds} seconds of ${moment.toISOString()}.`,
  );
};

Then(
  "the clock reads a time within {int} seconds of {string}",
  function (this: SpecWorld, seconds: number, moment: string) {
    within(this, new Date(moment), seconds);
  },
);

Then(
  "the clock reads a time within {int} seconds of now",
  function (this: SpecWorld, seconds: number) {
    within(this, new Date(), seconds);
  },
);

// The tournament the control made, kept to be asked for and archived.
const made = new WeakMap<SpecWorld, { id: string; address: string }>();

When(
  "{string} is made the manager of a tournament called {string} through the control",
  async function (this: SpecWorld, manager: string, name: string) {
    await controlled(this, "/__test/tournaments", {
      manager,
      tournament: {
        name,
        starts: "2026-10-03T00:00:00Z",
        finishes: "2026-10-05T00:00:00Z",
        format: "Standard",
        sport: "ac",
        country: "au",
        region: "vic",
      },
    });
    if (responseOf(this).statusCode === 201) {
      made.set(
        this,
        JSON.parse(responseOf(this).body) as { id: string; address: string },
      );
    }
  },
);

When(
  "the tournament is archived through the control",
  async function (this: SpecWorld) {
    const tournament = made.get(this);
    assert.ok(tournament !== undefined, "No tournament was made.");
    await controlled(this, "/__test/tournaments/archive", {
      manager: "manager@example.com",
      id: tournament.id,
    });
  },
);

Then("the site answers that it was made", function (this: SpecWorld) {
  assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
});

Then(
  "the tournament is found at the address it gave",
  async function (this: SpecWorld) {
    const tournament = made.get(this);
    assert.ok(tournament !== undefined, "No tournament was made.");
    const control = controlOf(this);
    assert.ok(control.application !== undefined, "The site was not started.");
    const page = await control.application.server.inject({
      method: "GET",
      url: `/${tournament.address}`,
    });
    assert.equal(page.statusCode, 200);
  },
);

// What the control made of a block and its players, kept to be played in.
interface Played {
  block?: string;
  game?: string;
  players: Map<string, { tournament: string; entered: string }>;
}
const playing = new WeakMap<SpecWorld, Played>();
const playedIn = (world: SpecWorld): Played => {
  let found = playing.get(world);
  if (found === undefined) {
    found = { players: new Map() };
    playing.set(world, found);
  }
  return found;
};

const idOfAnswer = (world: SpecWorld): string =>
  (JSON.parse(responseOf(world).body) as { id: string }).id;

When(
  "the block {string} is added to the tournament through the control",
  async function (this: SpecWorld, name: string) {
    await controlled(this, "/__test/tournaments/blocks", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id ?? "no-tournament",
      name,
    });
    if (responseOf(this).statusCode === 201) {
      playedIn(this).block = idOfAnswer(this);
    }
  },
);

When(
  "the players {string} and {string} are added and entered in the block through the control",
  async function (this: SpecWorld, first: string, second: string) {
    const played = playedIn(this);
    for (const name of [first, second]) {
      await controlled(this, "/__test/tournaments/players", {
        manager: "manager@example.com",
        tournament: made.get(this)?.id,
        player: { name },
      });
      assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
      const tournamentPlayer = idOfAnswer(this);
      await controlled(this, "/__test/competitions/players", {
        manager: "manager@example.com",
        tournament: made.get(this)?.id,
        competition: played.block,
        player: tournamentPlayer,
      });
      assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
      played.players.set(name, {
        tournament: tournamentPlayer,
        entered: idOfAnswer(this),
      });
    }
  },
);

When(
  "Ann is made to have beaten Bea {int} to {int} in the block through the control",
  async function (this: SpecWorld, winnerScore: number, loserScore: number) {
    const played = playedIn(this);
    await controlled(this, "/__test/competitions/games", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: played.block,
      winner: played.players.get("Ann")?.entered,
      winnerScore: String(winnerScore),
      loser: played.players.get("Bea")?.entered,
      loserScore: String(loserScore),
    });
    if (responseOf(this).statusCode === 201) played.game = idOfAnswer(this);
  },
);

When(
  "a game between two players who are not in the block is added through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/competitions/games", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
      winner: "11111111-1111-4111-8111-111111111111",
      winnerScore: "26",
      loser: "22222222-2222-4222-8222-222222222222",
      loserScore: "20",
    });
  },
);

When(
  "the score is withdrawn through the control",
  async function (this: SpecWorld) {
    const game = idOfAnswer(this);
    await controlled(this, "/__test/competitions/games/withdraw", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
      game,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "Bea is withdrawn from the block through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/competitions/players/withdraw", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
      player: playedIn(this).players.get("Bea")?.entered,
    });
  },
);

Given(
  "the block {string} with draws allowed is added to the tournament through the control",
  async function (this: SpecWorld, name: string) {
    await controlled(this, "/__test/tournaments/blocks", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      name,
      rules: { drawsAllowed: true },
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
    playedIn(this).block = idOfAnswer(this);
  },
);

When(
  "Bea is moved up in the block through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/competitions/players/move", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
      player: playedIn(this).players.get("Bea")?.entered,
      direction: "up",
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "the score is archived through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/competitions/games/archive", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
      game: playedIn(this).game,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "the block is archived through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/tournaments/competitions/archive", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
    });
  },
);

// The teams the control made, and the test they play.
const teams = new WeakMap<
  SpecWorld,
  { names: Map<string, string>; test?: string }
>();
const teamsOf = (world: SpecWorld) => {
  let found = teams.get(world);
  if (found === undefined) {
    found = { names: new Map() };
    teams.set(world, found);
  }
  return found;
};

When(
  "the teams {string} and {string} are added through the control",
  async function (this: SpecWorld, first: string, second: string) {
    for (const name of [first, second]) {
      await controlled(this, "/__test/tournaments/teams", {
        manager: "manager@example.com",
        tournament: made.get(this)?.id,
        team: { name, shortName: name.slice(0, 3).toUpperCase() },
      });
      assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
      teamsOf(this).names.set(name, idOfAnswer(this));
    }
  },
);

When(
  "a player is added to the team {string} through the control",
  async function (this: SpecWorld, team: string) {
    await controlled(this, "/__test/tournaments/teams/players", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      team: teamsOf(this).names.get(team),
      player: { name: "Kim Keeper" },
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
  },
);

When(
  "a test between the two teams is added and given {int} expected matches through the control",
  async function (this: SpecWorld, expectedMatches: number) {
    const [first, second] = [...teamsOf(this).names.values()];
    const request = {
      firstTeam: first,
      secondTeam: second,
      starts: "2026-10-03",
      finishes: "2026-10-03",
      expectedMatches: 1,
      bestOf: 1,
    };
    await controlled(this, "/__test/tournaments/tests", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      test: request,
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
    const test = idOfAnswer(this);
    await controlled(this, "/__test/tournaments/tests/update", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      id: test,
      test: { ...request, expectedMatches },
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "the team {string} is archived through the control",
  async function (this: SpecWorld, team: string) {
    await controlled(this, "/__test/tournaments/teams/archive", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      team: teamsOf(this).names.get(team),
    });
  },
);

Given(
  "{string} is made the manager of a tournament called {string} played by teams through the control",
  async function (this: SpecWorld, manager: string, name: string) {
    await controlled(this, "/__test/tournaments", {
      manager,
      tournament: {
        name,
        starts: "2026-10-03T00:00:00Z",
        finishes: "2026-10-05T00:00:00Z",
        format: "Teams",
        sport: "ac",
        country: "au",
        region: "vic",
      },
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
    made.set(
      this,
      JSON.parse(responseOf(this).body) as { id: string; address: string },
    );
  },
);

Given(
  "the players {string} and {string} are added through the control",
  async function (this: SpecWorld, first: string, second: string) {
    for (const name of [first, second]) {
      await controlled(this, "/__test/tournaments/players", {
        manager: "manager@example.com",
        tournament: made.get(this)?.id,
        player: { name },
      });
      assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
      playedIn(this).players.set(name, {
        tournament: idOfAnswer(this),
        entered: "",
      });
    }
  },
);

When(
  "{string} is archived through the control",
  async function (this: SpecWorld, name: string) {
    await controlled(this, "/__test/tournaments/players/archive", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      player: playedIn(this).players.get(name)?.tournament,
    });
  },
);

When(
  "a knockout of {int} places is added through the control",
  async function (this: SpecWorld, places: number) {
    await controlled(this, "/__test/tournaments/knockouts", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      name: "Knockout A",
      places,
      rounds: Array.from({ length: Math.log2(places) }, () => 1),
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
    playedIn(this).block = idOfAnswer(this);
  },
);

When(
  "a bye is entered in the knockout through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/competitions/players", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
      player: "tournament-player/00000000-0000-0000-0000-000000000000",
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
  },
);

When("a Swiss is added through the control", async function (this: SpecWorld) {
  await controlled(this, "/__test/tournaments/swisses", {
    manager: "manager@example.com",
    tournament: made.get(this)?.id,
    name: "Swiss A",
  });
});

When(
  "the team {string} is given the short name {string} through the control",
  async function (this: SpecWorld, team: string, shortName: string) {
    await controlled(this, "/__test/tournaments/teams/update", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      team: teamsOf(this).names.get(team),
      details: { name: team, shortName },
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

Given(
  "Ann is made to have beaten Bea {int} to {int} in the block at {string} through the control",
  async function (
    this: SpecWorld,
    winnerScore: number,
    loserScore: number,
    at: string,
  ) {
    const played = playedIn(this);
    await controlled(this, "/__test/competitions/games", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: played.block,
      winner: played.players.get("Ann")?.entered,
      winnerScore: String(winnerScore),
      loser: played.players.get("Bea")?.entered,
      loserScore: String(loserScore),
      at,
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
  },
);

When("the tournament's page is asked for", async function (this: SpecWorld) {
  const control = controlOf(this);
  assert.ok(control.application !== undefined, "The site was not started.");
  control.response = await control.application.server.inject({
    method: "GET",
    url: `/${made.get(this)?.address}`,
  });
});

Then(
  "the tournament's page says {string}",
  function (this: SpecWorld, words: string) {
    assert.ok(
      responseOf(this).body.includes(words),
      `The page does not say ${words}.`,
    );
  },
);

When(
  "the world ranking name of {string} is changed to {string} through the control",
  async function (this: SpecWorld, name: string, rankingName: string) {
    await controlled(this, "/__test/tournaments/players/world-ranking-name", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      player: playedIn(this).players.get(name)?.tournament,
      name: rankingName,
    });
  },
);

const noteOf = new WeakMap<SpecWorld, string>();

Given(
  "a note called {string} saying {string} is added through the control",
  async function (this: SpecWorld, title: string, description: string) {
    await controlled(this, "/__test/tournaments/notes", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      title,
      description,
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
    noteOf.set(this, idOfAnswer(this));
  },
);

When(
  "the note is edited to be called {string} saying {string} through the control",
  async function (this: SpecWorld, title: string, description: string) {
    await controlled(this, "/__test/tournaments/notes/edit", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      note: noteOf.get(this),
      title,
      description,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "the note is deleted through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/tournaments/notes/delete", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      note: noteOf.get(this),
    });
  },
);

const commentaryMade = new WeakMap<
  SpecWorld,
  { id: string; comment?: string }
>();

Given(
  "a commentary called {string} is started through the control",
  async function (this: SpecWorld, title: string) {
    await controlled(this, "/__test/tournaments/commentaries", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      title,
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
    commentaryMade.set(this, { id: idOfAnswer(this) });
  },
);

Given(
  "the comment {string} is added to it through the control",
  async function (this: SpecWorld, text: string) {
    const commentary = commentaryMade.get(this);
    assert.ok(commentary !== undefined, "No commentary was started.");
    await controlled(this, "/__test/commentaries/comments", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      commentary: commentary.id,
      text,
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
    commentary.comment = idOfAnswer(this);
  },
);

When(
  "the comment is edited to say {string} through the control",
  async function (this: SpecWorld, text: string) {
    const commentary = commentaryMade.get(this);
    await controlled(this, "/__test/commentaries/comments/edit", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      commentary: commentary?.id,
      comment: commentary?.comment,
      text,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "the comment is deleted through the control",
  async function (this: SpecWorld) {
    const commentary = commentaryMade.get(this);
    await controlled(this, "/__test/commentaries/comments/delete", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      commentary: commentary?.id,
      comment: commentary?.comment,
    });
  },
);

Given(
  "the account for {string} is forgotten through the control",
  async function (this: SpecWorld, emailAddress: string) {
    await controlled(this, "/__test/accounts/forget", { emailAddress });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "an account for {string} is made through the control",
  async function (this: SpecWorld, emailAddress: string) {
    await controlled(this, "/__test/accounts", { emailAddress });
  },
);

const asking = async (
  world: SpecWorld,
  method: "GET" | "POST",
  url: string,
  payload?: object,
): Promise<void> => {
  const control = controlOf(world);
  assert.ok(control.application !== undefined, "The site was not started.");
  control.response = await control.application.server.inject({
    method,
    url,
    headers: { "x-test-control": control.token ?? "" },
    ...(payload === undefined ? {} : { payload }),
  });
};

When(
  "the emails queued for {string} are asked for",
  async function (this: SpecWorld, address: string) {
    await asking(
      this,
      "GET",
      `/__test/emails?to=${encodeURIComponent(address)}`,
    );
  },
);

const told = (world: SpecWorld): { kind: string; link?: string }[] =>
  (
    JSON.parse(responseOf(world).body) as {
      emails: { kind: string; link?: string }[];
    }
  ).emails;

Then(
  "one email of the kind {string} with a link is told",
  function (this: SpecWorld, kind: string) {
    const emails = told(this);
    assert.equal(emails.length, 1);
    assert.equal(emails[0]?.kind, kind);
    assert.ok(emails[0]?.link !== undefined && emails[0].link !== "");
  },
);

Then("no email is told", function (this: SpecWorld) {
  assert.deepEqual(told(this), []);
});

When(
  "the tokens reCAPTCHA has judged are asked for",
  async function (this: SpecWorld) {
    await asking(this, "GET", "/__test/recaptcha/tokens");
  },
);

Then("no token is told", function (this: SpecWorld) {
  assert.deepEqual(
    (JSON.parse(responseOf(this).body) as { tokens: string[] }).tokens,
    [],
  );
});

When(
  "reCAPTCHA is told to judge {string}",
  async function (this: SpecWorld, judgement: string) {
    await asking(this, "POST", "/__test/recaptcha", { judgement });
  },
);

When(
  "the accounts for {string} are counted",
  async function (this: SpecWorld, address: string) {
    await asking(
      this,
      "GET",
      `/__test/accounts/count?emailAddress=${encodeURIComponent(address)}`,
    );
  },
);

const counted = (world: SpecWorld): number =>
  (JSON.parse(responseOf(world).body) as { count: number }).count;

Then("one account is counted", function (this: SpecWorld) {
  assert.equal(counted(this), 1);
});

Then("no account is counted", function (this: SpecWorld) {
  assert.equal(counted(this), 0);
});

Given(
  "an account for {string} called {string} made through the control",
  async function (this: SpecWorld, emailAddress: string, name: string) {
    await controlled(this, "/__test/accounts", { emailAddress, name });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
  },
);

When(
  "the name of the account for {string} is asked for",
  async function (this: SpecWorld, address: string) {
    await asking(
      this,
      "GET",
      `/__test/accounts/name?emailAddress=${encodeURIComponent(address)}`,
    );
  },
);

Then("the name told is {string}", function (this: SpecWorld, name: string) {
  assert.equal(
    (JSON.parse(responseOf(this).body) as { name: string | null }).name,
    name,
  );
});

Then("the account is told to be confirmed", function (this: SpecWorld) {
  assert.equal(
    (JSON.parse(responseOf(this).body) as { confirmed: boolean }).confirmed,
    true,
  );
});

Then("the account is told not to be confirmed", function (this: SpecWorld) {
  assert.equal(
    (JSON.parse(responseOf(this).body) as { confirmed: boolean }).confirmed,
    false,
  );
});

When(
  "{int} emails of the kind {string} are said to have been written to {string} {int} minutes ago",
  async function (
    this: SpecWorld,
    times: number,
    kind: string,
    address: string,
    minutes: number,
  ) {
    await asking(this, "POST", "/__test/emails/written", {
      emailAddress: address,
      kind,
      times,
      minutesAgo: minutes,
    });
  },
);

Then("an id is told", function (this: SpecWorld) {
  assert.ok(
    (JSON.parse(responseOf(this).body) as { id?: string }).id !== undefined,
  );
});

When(
  "{int} askings for a way back in from the address {string} are said to have been made {int} minutes ago",
  async function (
    this: SpecWorld,
    times: number,
    ipAddress: string,
    minutes: number,
  ) {
    await asking(this, "POST", "/__test/askings", {
      ipAddress,
      times,
      minutesAgo: minutes,
    });
  },
);

When(
  "a way back in is asked for {string} through the control",
  async function (this: SpecWorld, address: string) {
    await asking(this, "POST", "/__test/accounts/way-back", {
      emailAddress: address,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

Then(
  "an email of the kind {string} is among those told",
  function (this: SpecWorld, kind: string) {
    assert.ok(told(this).some((email) => email.kind === kind));
  },
);

When(
  "the password {string} is checked for {string}",
  async function (this: SpecWorld, password: string, address: string) {
    await asking(this, "POST", "/__test/accounts/password", {
      emailAddress: address,
      password,
    });
  },
);

const checked = (world: SpecWorld): { matches: boolean; remake: boolean } =>
  JSON.parse(responseOf(world).body) as { matches: boolean; remake: boolean };

Then(
  "the password is told to match and not to need making again",
  function (this: SpecWorld) {
    assert.deepEqual(checked(this), { matches: true, remake: false });
  },
);

Then("the password is told not to match", function (this: SpecWorld) {
  assert.equal(checked(this).matches, false);
});

Given(
  "an account for {string} brought over from the old site with the password {string}",
  async function (this: SpecWorld, emailAddress: string, password: string) {
    await controlled(this, "/__test/accounts", {
      emailAddress,
      password,
      fromTheOldSite: true,
    });
    assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
  },
);

Then(
  "the password is told to match and to need making again",
  function (this: SpecWorld) {
    assert.deepEqual(checked(this), { matches: true, remake: true });
  },
);

When(
  "the sessions of the account for {string} are counted",
  async function (this: SpecWorld, address: string) {
    await asking(
      this,
      "GET",
      `/__test/accounts/sessions?emailAddress=${encodeURIComponent(address)}`,
    );
  },
);

Then(
  /^(\d+) sessions? (?:is|are) counted$/,
  function (this: SpecWorld, count: string) {
    assert.equal(
      (JSON.parse(responseOf(this).body) as { count: number }).count,
      Number(count),
    );
  },
);

When(
  "forgetting is asked for {string} through the control",
  async function (this: SpecWorld, address: string) {
    await asking(this, "POST", "/__test/accounts/ask-to-forget", {
      emailAddress: address,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "the sessions of the account for {string} are counted by its id",
  async function (this: SpecWorld, address: string) {
    await asking(
      this,
      "GET",
      `/__test/accounts/name?emailAddress=${encodeURIComponent(address)}`,
    );
    const { id } = JSON.parse(responseOf(this).body) as { id: string };
    await asking(
      this,
      "GET",
      `/__test/accounts/sessions?accountId=${encodeURIComponent(id)}`,
    );
  },
);

When(
  "{int} failures to sign in as {string} are said to have happened {int} minutes ago",
  async function (
    this: SpecWorld,
    times: number,
    address: string,
    minutes: number,
  ) {
    await asking(this, "POST", "/__test/signins/failed", {
      emailAddress: address,
      times,
      minutesAgo: minutes,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "the failures to sign in as {string} are counted",
  async function (this: SpecWorld, address: string) {
    await asking(
      this,
      "GET",
      `/__test/signins/failed?emailAddress=${encodeURIComponent(address)}`,
    );
  },
);

Then(
  /^(\d+) failures? (?:is|are) counted$/,
  function (this: SpecWorld, count: string) {
    assert.equal(
      (JSON.parse(responseOf(this).body) as { count: number }).count,
      Number(count),
    );
  },
);

When(
  "the account the session belongs to is asked for",
  async function (this: SpecWorld) {
    await asking(
      this,
      "GET",
      `/__test/sessions/account?cookie=${encodeURIComponent(sessions.get(this) ?? "")}`,
    );
  },
);

When(
  "the account a made up session belongs to is asked for",
  async function (this: SpecWorld) {
    await asking(this, "GET", "/__test/sessions/account?cookie=made-up");
  },
);

Then(
  "the account told is the account for {string}",
  async function (this: SpecWorld, address: string) {
    const told = (
      JSON.parse(responseOf(this).body) as { accountId: string | null }
    ).accountId;
    await asking(
      this,
      "GET",
      `/__test/accounts/name?emailAddress=${encodeURIComponent(address)}`,
    );
    assert.equal(
      told,
      (JSON.parse(responseOf(this).body) as { id: string }).id,
    );
  },
);

Then("no account is told", function (this: SpecWorld) {
  assert.equal(
    (JSON.parse(responseOf(this).body) as { accountId: string | null })
      .accountId,
    null,
  );
});

When(
  "the role {string} is given to {string} through the control",
  async function (this: SpecWorld, role: string, address: string) {
    await asking(this, "POST", "/__test/accounts/role", {
      emailAddress: address,
      role,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "the role {string} is taken away from {string} through the control",
  async function (this: SpecWorld, role: string, address: string) {
    await asking(this, "POST", "/__test/accounts/role", {
      emailAddress: address,
      role,
      taken: true,
    });
  },
);

When(
  "{string} is taken down",
  async function (this: SpecWorld, service: string) {
    await asking(this, "POST", "/__test/services", { service, down: true });
  },
);

When(
  "{string} is brought back",
  async function (this: SpecWorld, service: string) {
    await asking(this, "POST", "/__test/services", { service, down: false });
  },
);

When(
  "the block is restored through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/tournaments/competitions/restore", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
    });
  },
);

When(
  "the sessions are asked whether any holds the session's cookie",
  async function (this: SpecWorld) {
    await asking(
      this,
      "GET",
      `/__test/sessions/holds?cookie=${encodeURIComponent(sessions.get(this) ?? "")}`,
    );
  },
);

Then("none is told to hold it", function (this: SpecWorld) {
  assert.equal(
    (JSON.parse(responseOf(this).body) as { holds: boolean }).holds,
    false,
  );
});

interface Held {
  archived: boolean;
  players: { id: string; name: string }[];
  competitions: { id: string; name: string; kind: string }[];
}

const held = (world: SpecWorld): Held =>
  JSON.parse(responseOf(world).body) as Held;

When(
  "what the tournament holds is asked for",
  async function (this: SpecWorld) {
    await asking(
      this,
      "GET",
      `/__test/tournaments/kept?id=${encodeURIComponent(made.get(this)?.id ?? "")}`,
    );
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

Then(
  "it is told to hold the block {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(
      held(this).competitions.some(
        (each) => each.name === name && each.kind === "block",
      ),
    );
  },
);

Then(
  "it is told to hold the player {string}",
  function (this: SpecWorld, name: string) {
    assert.ok(held(this).players.some((each) => each.name === name));
  },
);

Then("it is told not to be archived", function (this: SpecWorld) {
  assert.equal(held(this).archived, false);
});

When("the games of the block are asked for", async function (this: SpecWorld) {
  const block = held(this).competitions.find((each) => each.kind === "block");
  assert.ok(block !== undefined, "The tournament holds no block.");
  await asking(
    this,
    "GET",
    `/__test/competitions/kept?id=${encodeURIComponent(block.id)}`,
  );
  assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
});

Then(
  "it is told to hold a game won {int} to {int}",
  function (this: SpecWorld, winnerScore: number, loserScore: number) {
    const { games } = JSON.parse(responseOf(this).body) as {
      games: { winnerScore: number; loserScore: number }[];
    };
    assert.ok(
      games.some(
        (game) =>
          game.winnerScore === winnerScore && game.loserScore === loserScore,
      ),
      responseOf(this).body,
    );
  },
);

When(
  "the notes the tournament holds are asked for",
  async function (this: SpecWorld) {
    await asking(
      this,
      "GET",
      `/__test/tournaments/notes/kept?id=${encodeURIComponent(made.get(this)?.id ?? "")}`,
    );
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

Then(
  "it is told to hold the note {string} saying {string}",
  function (this: SpecWorld, title: string, description: string) {
    const notes = JSON.parse(responseOf(this).body) as {
      title: string;
      description?: string;
    }[];
    assert.ok(
      notes.some(
        (note) => note.title === title && note.description === description,
      ),
      responseOf(this).body,
    );
  },
);

const named = (world: SpecWorld, name: string): string | undefined =>
  playedIn(world).players.get(name)?.tournament;

When(
  "{string} is moved up in the tournament through the control",
  async function (this: SpecWorld, name: string) {
    await controlled(this, "/__test/tournaments/players/move", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      player: named(this, name),
      direction: "up",
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "{string} is renamed to {string} through the control",
  async function (this: SpecWorld, name: string, renamed: string) {
    await controlled(this, "/__test/tournaments/players/update", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      player: named(this, name),
      details: { name: renamed },
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
    const found = playedIn(this).players.get(name);
    if (found !== undefined) playedIn(this).players.set(renamed, found);
  },
);

When(
  "{string} and {string} are paired through the control",
  async function (this: SpecWorld, first: string, second: string) {
    await controlled(this, "/__test/tournaments/pairs", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      first: named(this, first),
      second: named(this, second),
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

const teamPlayers = new WeakMap<SpecWorld, Map<string, string>>();
const teamPlayerIds = (world: SpecWorld): Map<string, string> => {
  let found = teamPlayers.get(world);
  if (found === undefined) {
    found = new Map();
    teamPlayers.set(world, found);
  }
  return found;
};

When(
  "the players {string} and {string} are added to the team {string} through the control",
  async function (
    this: SpecWorld,
    first: string,
    second: string,
    team: string,
  ) {
    for (const name of [first, second]) {
      await controlled(this, "/__test/tournaments/teams/players", {
        manager: "manager@example.com",
        tournament: made.get(this)?.id,
        team: teamsOf(this).names.get(team),
        player: { name },
      });
      assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
      teamPlayerIds(this).set(name, idOfAnswer(this));
    }
  },
);

When(
  "the team {string} is moved up through the control",
  async function (this: SpecWorld, team: string) {
    await controlled(this, "/__test/tournaments/teams/move", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      team: teamsOf(this).names.get(team),
      direction: "up",
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

const toATeamPlayer = async (
  world: SpecWorld,
  path: string,
  team: string,
  player: string,
  more: object,
): Promise<void> => {
  await controlled(world, path, {
    manager: "manager@example.com",
    tournament: made.get(world)?.id,
    team: teamsOf(world).names.get(team),
    player: teamPlayerIds(world).get(player),
    ...more,
  });
  assert.equal(responseOf(world).statusCode, 200, responseOf(world).body);
};

When(
  "the player {string} of the team {string} is moved up through the control",
  async function (this: SpecWorld, player: string, team: string) {
    await toATeamPlayer(
      this,
      "/__test/tournaments/teams/players/move",
      team,
      player,
      { direction: "up" },
    );
  },
);

When(
  "the player {string} of the team {string} is renamed to {string} through the control",
  async function (
    this: SpecWorld,
    player: string,
    team: string,
    renamed: string,
  ) {
    await toATeamPlayer(
      this,
      "/__test/tournaments/teams/players/update",
      team,
      player,
      { details: { name: renamed } },
    );
  },
);

When(
  "the player {string} of the team {string} is archived through the control",
  async function (this: SpecWorld, player: string, team: string) {
    await toATeamPlayer(
      this,
      "/__test/tournaments/teams/players/archive",
      team,
      player,
      {},
    );
  },
);

const blocks = new WeakMap<SpecWorld, Map<string, string>>();

When(
  "the blocks {string} and {string} are added through the control",
  async function (this: SpecWorld, first: string, second: string) {
    const ids = new Map<string, string>();
    for (const name of [first, second]) {
      await controlled(this, "/__test/tournaments/blocks", {
        manager: "manager@example.com",
        tournament: made.get(this)?.id,
        name,
      });
      assert.equal(responseOf(this).statusCode, 201, responseOf(this).body);
      ids.set(name, idOfAnswer(this));
    }
    blocks.set(this, ids);
  },
);

When(
  "the block {string} is moved up through the control",
  async function (this: SpecWorld, name: string) {
    await controlled(this, "/__test/tournaments/competitions/move", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: blocks.get(this)?.get(name),
      direction: "up",
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

for (const role of ["manager", "scorer"] as const) {
  When(
    `{string} is made a ${role} of the tournament through the control`,
    async function (this: SpecWorld, address: string) {
      await controlled(this, `/__test/tournaments/${role}s`, {
        manager: "manager@example.com",
        tournament: made.get(this)?.id,
        emailAddress: address,
      });
      assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
    },
  );
}

When(
  "a losers knockout of the first round of the knockout is added through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/tournaments/losers-knockouts", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      name: "Losers A",
      from: playedIn(this).block,
      round: 0,
    });
  },
);

When(
  "Ann is given a carry forward of {int} match wins through the control",
  async function (this: SpecWorld, wins: number) {
    await controlled(this, "/__test/competitions/players/carry-forward", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
      player: playedIn(this).players.get("Ann")?.entered,
      counts: { matchWins: wins },
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

When(
  "Bea is removed from the block through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/competitions/players/remove", {
      manager: "manager@example.com",
      tournament: made.get(this)?.id,
      competition: playedIn(this).block,
      player: playedIn(this).players.get("Bea")?.entered,
    });
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

const competitionHeld = (
  world: SpecWorld,
): { players: { carryForward: Record<string, number> }[] } =>
  JSON.parse(responseOf(world).body) as {
    players: { carryForward: Record<string, number> }[];
  };

Then(
  /^it is told to hold (\d+) players?$/,
  function (this: SpecWorld, count: string) {
    assert.equal(competitionHeld(this).players.length, Number(count));
  },
);

Then(
  "it is told that a player carries forward {int} match wins",
  function (this: SpecWorld, wins: number) {
    assert.ok(
      competitionHeld(this).players.some(
        (player) => player.carryForward["matchWins"] === wins,
      ),
      responseOf(this).body,
    );
  },
);

When(
  "the golf croquet world ranking player {string} is given through the control",
  async function (this: SpecWorld, name: string) {
    await controlled(this, "/__test/world-ranking-players", {
      sport: "gc",
      name,
    });
  },
);

const builds = new WeakMap<SpecWorld, string[]>();

const askedForTheBuild = async (world: SpecWorld): Promise<void> => {
  await asking(world, "GET", "/__test/build");
  assert.equal(responseOf(world).statusCode, 200, responseOf(world).body);
  const named = (JSON.parse(responseOf(world).body) as { build: string }).build;
  builds.set(world, [...(builds.get(world) ?? []), named]);
};

When("the build the site names is asked for", async function (this: SpecWorld) {
  await askedForTheBuild(this);
});

When(
  "the build the site names is asked for again",
  async function (this: SpecWorld) {
    await askedForTheBuild(this);
  },
);

When(
  "the site is told it was deployed again through the control",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/build", {});
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

Then("the build named is not the one named before", function (this: SpecWorld) {
  const [before, now] = builds.get(this) ?? [];
  assert.ok(before !== undefined && now !== undefined);
  assert.notEqual(now, before);
});

When(
  "database access is switched through the control saying nothing",
  async function (this: SpecWorld) {
    await controlled(this, "/__test/database-access", {});
  },
);

Then(
  /^the control says database access is (on|off)$/,
  async function (this: SpecWorld, which: string) {
    await asking(this, "GET", "/__test/database-access");
    assert.equal(
      (JSON.parse(responseOf(this).body) as { off: boolean }).off,
      which === "off",
    );
  },
);

When(
  "an entry {string} at the severity {word} written at {string} is put in the log through the control",
  async function (
    this: SpecWorld,
    message: string,
    severity: string,
    writtenAt: string,
  ) {
    await controlled(this, "/__test/log-entries", {
      message,
      severity,
      writtenAt,
    });
  },
);

When(
  "the Golf Croquet world rankings list is said to name the country {string} through the control",
  async function (this: SpecWorld, country: string) {
    await controlled(this, "/__test/world-ranking-countries", {
      sport: "gc",
      country,
    });
  },
);

When(
  "the golf croquet world ranking players are asked for",
  async function (this: SpecWorld) {
    await asking(this, "GET", "/__test/world-ranking-players?sport=gc");
    assert.equal(responseOf(this).statusCode, 200, responseOf(this).body);
  },
);

Then(
  "the players told are {string}",
  function (this: SpecWorld, names: string) {
    assert.deepEqual(
      (JSON.parse(responseOf(this).body) as { names: string[] }).names,
      names.split(", "),
    );
  },
);

When(
  "the account for {string} is linked to the Google account {string} through the control",
  async function (this: SpecWorld, address: string, subject: string) {
    await asking(this, "POST", "/__test/accounts/google", {
      emailAddress: address,
      subject,
    });
  },
);
