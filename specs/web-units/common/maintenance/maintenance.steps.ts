import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { LightMyRequestResponse } from "fastify";

import type { DatabaseAccess } from "../../../../src/application/common/DatabaseAccess.js";
import type { SpecWorld } from "../../../support/world.js";
import { applicationFor } from "../../support/browser.js";
import { builtFor, mount, senderOf } from "../../support/application.js";
import { clockFor } from "../../support/clock.js";
import { englishForScenarios } from "../../support/languages.js";
import {
  accessInHand,
  momentIn,
} from "../../../infrastructure/maintenance/databaseAccessInHand.js";

// The site while its database access is turned off for maintenance
// (`maintenance.feature`). The switch is the application's own, written as
// the script writes it, and the clock is the scenario's.

const pagePath = "/example-database";

const words = (key: string, fill: Record<string, string> = {}): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return Object.entries(fill).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    said,
  );
};

const answered = (world: SpecWorld): LightMyRequestResponse => {
  const response = builtFor(world).response;
  assert.ok(response !== undefined, "Nothing has been asked for.");
  return response;
};

// How many times the database was asked for a connection since access was
// turned off: the pool says so, and a request that does not use the database
// does not ask it.
const askings = new WeakMap<SpecWorld, { count: number }>();

const watching = (world: SpecWorld): { count: number } => {
  let found = askings.get(world);
  if (found === undefined) {
    found = { count: 0 };
    askings.set(world, found);
    const counting = found;
    builtFor(world).application.pool.on("acquire", () => {
      counting.count += 1;
    });
  }
  return found;
};

// Turning it off and on ----------------------------------------------------------

// Said as a Given and as a When alike, and of whichever switch the scenario
// has: the application's own where it built the application, and the file's
// where it did not, which is what the switch's own features are written of.
const inTheApplication = (world: SpecWorld): boolean => {
  try {
    builtFor(world);
    return true;
  } catch {
    return false;
  }
};

const attempt = async (
  world: SpecWorld,
  work: () => Promise<void>,
): Promise<void> => {
  world.failure = undefined;
  try {
    await work();
  } catch (failure) {
    world.failure = failure;
  }
};

// The switch of the application the scenario built, whether it is reached
// in process or through a browser, or nothing where the scenario built no
// application and the switch is the file's own.
const applicationsSwitch = (
  world: SpecWorld,
): { readonly access: DatabaseAccess; readonly now: Date } | undefined => {
  if (inTheApplication(world)) {
    watching(world);
    return {
      access: builtFor(world).application.databaseAccess,
      now: clockFor(world).now,
    };
  }
  try {
    return {
      access: applicationFor(world).databaseAccess,
      now: clockFor(world).now,
    };
  } catch {
    return undefined;
  }
};

const turnedOff = async (
  world: SpecWorld,
  minutes: string,
  words: string | undefined,
): Promise<void> => {
  const held = applicationsSwitch(world);
  if (held !== undefined) {
    await held.access.turnOff(Number(minutes), held.now, words);
    return;
  }
  await attempt(world, () =>
    accessInHand(world).writer.turnOff(Number(minutes), momentIn(world), words),
  );
};

Given(
  /^database access is turned off for (-?[\d.]+) minutes$/,
  async function (this: SpecWorld, minutes: string) {
    await turnedOff(this, minutes, undefined);
  },
);

Given(
  /^database access is turned off for (-?[\d.]+) minutes with the words "([^"]*)"$/,
  async function (this: SpecWorld, minutes: string, words: string) {
    await turnedOff(this, minutes, words);
  },
);

Given(
  /^database access is turned off for (\d+) minutes with (\d+) characters of words$/,
  async function (this: SpecWorld, minutes: string, count: string) {
    await turnedOff(this, minutes, "w".repeat(Number(count)));
  },
);

Given(
  /^the expected return is moved to (-?[\d.]+) minutes from now$/,
  async function (this: SpecWorld, minutes: string) {
    const held = applicationsSwitch(this);
    if (held !== undefined) {
      await held.access.moveReturn(Number(minutes), held.now);
      return;
    }
    await attempt(this, () =>
      accessInHand(this).writer.moveReturn(Number(minutes), momentIn(this)),
    );
  },
);

Given(
  /^the expected return is moved to (-?[\d.]+) minutes from now with the words "([^"]*)"$/,
  async function (this: SpecWorld, minutes: string, words: string) {
    const held = applicationsSwitch(this);
    if (held !== undefined) {
      await held.access.moveReturn(Number(minutes), held.now, words);
      return;
    }
    await attempt(this, () =>
      accessInHand(this).writer.moveReturn(
        Number(minutes),
        momentIn(this),
        words,
      ),
    );
  },
);

Given("database access is turned on", async function (this: SpecWorld) {
  const held = applicationsSwitch(this);
  if (held !== undefined) {
    await held.access.turnOn();
    return;
  }
  await attempt(this, () => accessInHand(this).writer.turnOn());
});

// A page that has nothing to do with the database, which is the same page a
// reader is given while it is off.
Given(
  "an example page that does not use the database",
  function (this: SpecWorld) {
    mount(this, (application) => {
      application.server.get(pagePath, (_request, reply) =>
        reply.type("text/html; charset=utf-8").send("<p>The example page.</p>"),
      );
    });
    builtFor(this).route = { method: "GET", url: pagePath };
  },
);

// What the page says ---------------------------------------------------------------

Then(
  "the page says the site is down for maintenance",
  function (this: SpecWorld) {
    assert.ok(
      answered(this).body.includes(words("errors.maintenance")),
      "The page does not say the site is down for maintenance.",
    );
  },
);

Then(
  "the page does not say the site is down for maintenance",
  function (this: SpecWorld) {
    assert.ok(
      !answered(this).body.includes(words("errors.maintenance")),
      "The page says the site is down for maintenance.",
    );
  },
);

Then(
  "the page tells the reader {string}",
  function (this: SpecWorld, said: string) {
    assert.ok(
      answered(this).body.includes(said),
      `The page does not tell the reader "${said}".`,
    );
  },
);

Then(
  "the page does not hold the markup {string}",
  function (this: SpecWorld, markup: string) {
    assert.ok(
      !answered(this).body.includes(markup),
      `The page contains "${markup}".`,
    );
  },
);

Then(
  "the page says the site is expected back in {int} minutes",
  function (this: SpecWorld, minutes: number) {
    assert.ok(
      answered(this).body.includes(
        words("errors.maintenanceMinutes", { minutes: String(minutes) }),
      ),
      `The page does not say ${String(minutes)} minutes.`,
    );
  },
);

Then(
  "the page says the site is expected back in {int} minute",
  function (this: SpecWorld, minutes: number) {
    assert.equal(minutes, 1);
    assert.ok(
      answered(this).body.includes(words("errors.maintenanceMinute")),
      "The page does not say 1 minute.",
    );
  },
);

Then(
  "the page says it is taking longer than expected",
  function (this: SpecWorld) {
    assert.ok(
      answered(this).body.includes(words("errors.maintenanceLonger")),
      "The page does not say it is taking longer.",
    );
  },
);

Then(
  "the page does not say how many minutes are expected",
  function (this: SpecWorld) {
    const body = answered(this).body;
    assert.ok(
      !body.includes(words("errors.maintenanceMinute")) &&
        !/expected back in \d+ minutes/.test(body),
      "The page says how many minutes are expected.",
    );
  },
);

Then("the page has the site's header and footer", function (this: SpecWorld) {
  const body = answered(this).body;
  assert.match(body, /class="site-bar"/);
  assert.match(body, /class="site-footer"/);
});

// What a program is told -------------------------------------------------------------

Then(
  "the answer says to wait {int} seconds before asking again",
  function (this: SpecWorld, seconds: number) {
    assert.equal(
      String(answered(this).headers["retry-after"]),
      String(seconds),
    );
  },
);

Then(
  "the answer says {int} minutes are expected",
  function (this: SpecWorld, minutes: number) {
    const answer: { minutes?: unknown } = answered(this).json();
    assert.equal(answer.minutes, minutes);
  },
);

Then(
  "the answer says the words are {string}",
  function (this: SpecWorld, said: string) {
    const answer: { words?: unknown } = answered(this).json();
    assert.equal(answer.words, said);
  },
);

// What the database was not asked --------------------------------------------------

Then("the database was asked nothing", function (this: SpecWorld) {
  assert.equal(watching(this).count, 0);
});

Then("no request is recorded as handled", async function (this: SpecWorld) {
  const { rows } = await this.database.query<{ count: string }>(
    "select count(*) from handled_requests",
  );
  assert.equal(Number(rows[0]?.count), 0);
});

Then("no email is sent to the administrator", function (this: SpecWorld) {
  assert.equal(senderOf(this).sent.length, 0);
});

// The site's own files ---------------------------------------------------------------

When("the site's stylesheet is asked for", async function (this: SpecWorld) {
  const { application } = builtFor(this);
  // Found as a reader's browser would find it: in the page's own markup.
  const page = await application.server.inject({ method: "GET", url: "/" });
  const href = /href="(\/assets\/[^"]+\.css)"/.exec(page.body)?.[1];
  assert.ok(href !== undefined, "The page names no stylesheet.");
  builtFor(this).response = await application.server.inject({
    method: "GET",
    url: href,
  });
});

Then("the stylesheet is served", function (this: SpecWorld) {
  const response = answered(this);
  assert.equal(response.statusCode, 200);
  assert.match(String(response.headers["content-type"]), /text\/css/);
});

When("the site's health check is asked for", async function (this: SpecWorld) {
  builtFor(this).response = await builtFor(this).application.server.inject({
    method: "GET",
    url: "/api/site/health",
  });
});

Then("the health check says the site is well", function (this: SpecWorld) {
  const response = answered(this);
  assert.equal(response.statusCode, 200, response.body);
  const said: { status?: unknown } = response.json();
  assert.equal(said.status, "ok");
});
