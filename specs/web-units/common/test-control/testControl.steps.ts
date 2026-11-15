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
