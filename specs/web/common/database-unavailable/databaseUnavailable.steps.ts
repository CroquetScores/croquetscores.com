import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import type { LightMyRequestResponse } from "fastify";

import {
  ConfigError,
  loadConfig,
  loadEnvFile,
} from "../../../../src/infrastructure/config/Config.js";
import { EmailAddress } from "../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { Application } from "../../../../src/web/server.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  builtFor,
  logOf,
  mount,
  restart,
  senderOf,
  settingOf,
} from "../../support/application.js";
import { clockFor } from "../../support/clock.js";
import {
  giveTheDatabaseBack,
  takeTheDatabaseAway,
} from "../../support/databaseOutage.js";
import {
  englishForScenarios,
  opens,
  closes,
  unmarked,
} from "../../support/languages.js";

// Where the example routes are mounted. Under /api/ is answered as the API
// and anything else as a page, so which of the two a route is decides only
// where it is.
const pagePath = "/example-database";
const apiPath = "/api/example-database";

const intervalSetting = "DATABASE_UNREACHABLE_EMAIL_INTERVAL_MINUTES";

const words = (key: string): string => {
  const said = englishForScenarios.words[key];
  assert.ok(said !== undefined, `English has no words for ${key}.`);
  return said;
};

// What each scenario has said of the reader asking: the cookies its browser
// holds, and the languages it asks for. Kept here, as a request made with
// inject has no browser to hold them.
interface Asking {
  cookies: Record<string, string>;
  languages: string | undefined;
  /** Whether the example page is to take the database away after its first write. */
  goesAfterFirstWrite: boolean;
}

const askings = new WeakMap<SpecWorld, Asking>();

const askingOf = (world: SpecWorld): Asking => {
  let found = askings.get(world);
  if (found === undefined) {
    found = { cookies: {}, languages: undefined, goesAfterFirstWrite: false };
    askings.set(world, found);
  }
  return found;
};

const requestAs = (
  world: SpecWorld,
  request: { method: "GET" | "POST"; url: string; payload?: string },
): Promise<LightMyRequestResponse> => {
  const asking = askingOf(world);
  const cookie = Object.entries(asking.cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
  return builtFor(world).application.server.inject({
    ...request,
    headers: {
      ...(cookie === "" ? {} : { cookie }),
      ...(asking.languages === undefined
        ? {}
        : { "accept-language": asking.languages }),
      ...(request.method === "POST"
        ? { "content-type": "application/x-www-form-urlencoded" }
        : {}),
    },
  });
};

const answered = (world: SpecWorld): LightMyRequestResponse => {
  const response = builtFor(world).response;
  assert.ok(response !== undefined, "Nothing has been asked for.");
  return response;
};

// Taking the database away and giving it back -------------------------------

Given("the database cannot be reached", async function (this: SpecWorld) {
  await takeTheDatabaseAway(this);
});

Given("the database can be reached again", async function (this: SpecWorld) {
  await giveTheDatabaseBack(this);
});

// The example routes --------------------------------------------------------

const readFromTheDatabase = (application: Application): Promise<void> =>
  application.unitOfWork.inReadOnlyTransaction(async () => {
    await application.unitOfWork.connection().query("select 1");
  });

const examplePage = "<p>The example page.</p>";

Given(
  "an example page that reads from the database",
  function (this: SpecWorld) {
    mount(this, (application) => {
      application.server.get(pagePath, async (_request, reply) => {
        await readFromTheDatabase(application);
        return reply.type("text/html; charset=utf-8").send(examplePage);
      });
    });
    builtFor(this).route = { method: "GET", url: pagePath };
  },
);

Given(
  "an example API route that reads from the database",
  function (this: SpecWorld) {
    mount(this, (application) => {
      application.server.get(apiPath, async () => {
        await readFromTheDatabase(application);
        return { read: true };
      });
    });
    builtFor(this).route = { method: "GET", url: apiPath };
  },
);

Given(
  "an example page that asks the database for something that is not there",
  function (this: SpecWorld) {
    mount(this, (application) => {
      application.server.get(pagePath, async () => {
        await application.unitOfWork.inReadOnlyTransaction(async () => {
          await application.unitOfWork
            .connection()
            .query("select * from a_table_nobody_made");
        });
        return examplePage;
      });
    });
    builtFor(this).route = { method: "GET", url: pagePath };
  },
);

// A page that writes in two goes inside one transaction, and takes the
// database away between them where the scenario says so: the one way to have
// it go while a request is partway through.
Given(
  "an example page that writes twice to the database",
  async function (this: SpecWorld) {
    await this.database.query(
      "create table example_writes (written integer not null)",
    );
    const asking = askingOf(this);
    const takeAway = (): Promise<void> => takeTheDatabaseAway(this);
    mount(this, (application) => {
      application.server.get(pagePath, async (_request, reply) => {
        await application.unitOfWork.inTransaction(async () => {
          const connection = application.unitOfWork.connection();
          await connection.query("insert into example_writes values (1)");
          if (asking.goesAfterFirstWrite) await takeAway();
          await connection.query("insert into example_writes values (2)");
        });
        return reply.type("text/html; charset=utf-8").send(examplePage);
      });
    });
    builtFor(this).route = { method: "GET", url: pagePath };
  },
);

Given("the database goes after the first write", function (this: SpecWorld) {
  askingOf(this).goesAfterFirstWrite = true;
});

Given(
  "the reader's browser asks for {string}",
  function (this: SpecWorld, languages: string) {
    askingOf(this).languages = languages;
  },
);

async function ask(this: SpecWorld): Promise<void> {
  const built = builtFor(this);
  assert.ok(built.route !== undefined, "There is no example route.");
  built.response = await requestAs(this, built.route);
}

// One definition for the page and for the API route, and for Given and When
// alike: cucumber does not tell a step's keyword apart, and the scenario says
// which route it means by the one it mounted.
Given("the example page is asked for", ask);

Given("the example API route is asked for", ask);

// The API's own route for the status of database access, which is not an
// example: it is asked for as the example routes are, with the reader's cookie.
Given(
  "the route for the status of database access",
  function (this: SpecWorld) {
    builtFor(this).route = { method: "GET", url: "/api/site/database-access" };
  },
);

Given("the route for the status of database access is asked for", ask);

// What the page and the answer say --------------------------------------------

Then("the reader is told the site is unavailable", function (this: SpecWorld) {
  const response = answered(this);
  assert.equal(
    response.statusCode,
    503,
    `The route answered ${response.statusCode}: ${response.body}`,
  );
  assert.ok(
    response.body.includes(words("errors.unavailable")),
    "The page does not say the site is unavailable.",
  );
});

Then("the page says to try again later", function (this: SpecWorld) {
  assert.ok(
    answered(this).body.includes(words("errors.unavailableDetail")),
    "The page does not say to try again later.",
  );
});

Then("the page has the site's heading", function (this: SpecWorld) {
  assert.match(answered(this).body, /class="site-name"/);
});

Then("the page has a way back to the home page", function (this: SpecWorld) {
  assert.match(answered(this).body, /<a href="\/">/);
});

// Read from the markup rather than a browser's page, since this scenario has
// no browser: each piece of text in the page's content, between the tags
// around it, has to be a phrase the test locale marked.
Then(
  "every word on the page is in the test locale",
  function (this: SpecWorld) {
    const body = answered(this).body;
    const content = /<main[\s\S]*<\/main>/.exec(body)?.[0] ?? body;
    const pieces = content
      .replace(/<[^>]*>/g, "\n")
      .split("\n")
      .map((piece) => piece.trim())
      .filter((piece) => piece !== "");
    assert.ok(pieces.length > 0, "The page's content has no words in it.");
    for (const piece of pieces) {
      assert.ok(
        piece.startsWith(opens) && piece.endsWith(closes),
        `"${piece}" is not in the test locale.`,
      );
    }
  },
);

Then(
  "the route answers with the status of database access",
  function (this: SpecWorld) {
    const response = answered(this);
    assert.equal(
      response.statusCode,
      200,
      `The route answered ${response.statusCode}: ${response.body}`,
    );
    assert.equal(response.json<{ off?: unknown }>().off, true);
  },
);

Then(
  "the route answers that the site is unavailable",
  function (this: SpecWorld) {
    const response = answered(this);
    assert.equal(
      response.statusCode,
      503,
      `The route answered ${response.statusCode}: ${response.body}`,
    );
  },
);

Then("the answer says {string}", function (this: SpecWorld, code: string) {
  const answer: { error?: unknown } = answered(this).json();
  assert.equal(answer.error, code);
});

Then(
  "the answer says how long to wait before asking again",
  function (this: SpecWorld) {
    assert.match(String(answered(this).headers["retry-after"]), /^\d+$/);
  },
);

Then(
  "the answer does not name the database's address",
  function (this: SpecWorld) {
    loadEnvFile();
    const url = new URL(loadConfig().databaseUrl);
    const body = answered(this).body;
    assert.ok(
      !body.includes(url.hostname) && !body.includes(url.username),
      `The answer names where the database is: ${body}`,
    );
    assert.ok(
      !body.includes(builtFor(this).application.pool.options.database ?? "\0"),
      `The answer names the database: ${body}`,
    );
  },
);

Then("the example page is answered", function (this: SpecWorld) {
  const response = answered(this);
  assert.equal(response.statusCode, 200, response.body);
  assert.match(String(response.headers["content-type"]), /^text\/html/);
});

Then("the route answers", function (this: SpecWorld) {
  const response = answered(this);
  assert.equal(response.statusCode, 200, response.body);
});

Then("the page says the server failed", function (this: SpecWorld) {
  const response = answered(this);
  assert.equal(response.statusCode, 500, response.body);
  assert.ok(response.body.includes(words("errors.failed")));
});

Then(
  "the page does not say the site is unavailable",
  function (this: SpecWorld) {
    assert.ok(!answered(this).body.includes(words("errors.unavailable")));
  },
);

Then(
  "nothing the page wrote is there when the database is back",
  async function (this: SpecWorld) {
    await giveTheDatabaseBack(this);
    const { rows } = await this.database.query<{ count: string }>(
      "select count(*) from example_writes",
    );
    assert.equal(rows[0]?.count, "0", "The page left what it wrote.");
  },
);

// Who is asking ---------------------------------------------------------------

Given(
  "the reader is signed in as {string}",
  async function (this: SpecWorld, address: string) {
    const { application } = builtFor(this);
    const now = ReadOnlyDate.from(new Date(clockFor(this).now.getTime()));
    // A session started as the site starts one, and its cookie given to the
    // reader, rather than signing in through the page: signing in is not what
    // this is about, and it is the page's to say anything about.
    const id = await application.unitOfWork.inTransaction(async () => {
      const account = await application.accountsByEmailAddress.find(
        EmailAddress.from(address),
      );
      assert.ok(account !== undefined, `No account for ${address}.`);
      return application.sessions.start(account, now);
    });
    askingOf(this).cookies["session"] = id;
  },
);

Then(
  "the answer does not take the session cookie away",
  function (this: SpecWorld) {
    const touched = answered(this).cookies.find(
      (cookie) => cookie.name === "session",
    );
    assert.equal(
      touched,
      undefined,
      `The answer sets the session cookie: ${JSON.stringify(touched)}`,
    );
  },
);

// Asked of a page only a signed-in reader can open, since the page's own
// words do not say who is asking.
const profilePath = "/account/profile";

Then(
  "the reader is still signed in as {string}",
  async function (this: SpecWorld, address: string) {
    const response = await requestAs(this, {
      method: "GET",
      url: profilePath,
    });
    assert.equal(
      response.statusCode,
      200,
      `${address} is not signed in: ${response.body}`,
    );
  },
);

Then("the reader is not signed in", async function (this: SpecWorld) {
  const asking = askingOf(this);
  assert.equal(
    asking.cookies["session"],
    undefined,
    "The reader holds a session.",
  );
  const { rows } = await this.database.query<{ count: string }>(
    "select count(*) from sessions",
  );
  assert.equal(rows[0]?.count, "0", "A session was started.");
});

Then("the account menu does not offer the ways in", function (this: SpecWorld) {
  assert.doesNotMatch(answered(this).body, /href="\/account\/sign-in"/);
  assert.doesNotMatch(answered(this).body, /href="\/account\/register"/);
});

Then(
  "the account menu does not offer the account's own pages",
  function (this: SpecWorld) {
    assert.doesNotMatch(answered(this).body, /href="\/account\/profile"/);
    assert.doesNotMatch(answered(this).body, /action="\/account\/sign-out"/);
  },
);

When(
  "{string} signs in with the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    const response = await requestAs(this, {
      method: "POST",
      url: "/account/sign-in",
      payload: new URLSearchParams({
        emailAddress: address,
        password,
      }).toString(),
    });
    builtFor(this).response = response;
    // What the browser would do with what it was given.
    const session = response.cookies.find((each) => each.name === "session");
    if (session !== undefined)
      askingOf(this).cookies["session"] = session.value;
  },
);

// Telling the administrator ---------------------------------------------------

Given(
  "the site's administrator's email address is {string}",
  async function (this: SpecWorld, address: string) {
    settingOf(this)["ADMINISTRATOR_EMAIL_ADDRESS"] = address;
    await restart(this);
  },
);

Given("emails cannot be sent", function (this: SpecWorld) {
  senderOf(this).failing = true;
});

// After what is being sent has failed: a send still under way would otherwise
// find the sender mended, and the try the scenario is about would not have
// failed at all.
Given("emails can be sent again", async function (this: SpecWorld) {
  await afterTheAdministratorIsTold(this);
  senderOf(this).failing = false;
});

// Held for good: the scenario is about the reader being answered, and what is
// held never finishes, so nothing here waits for it.
Given("emails are held up", function (this: SpecWorld) {
  senderOf(this).holdsUntil = new Promise<void>(() => undefined);
});

Given(
  "an example page that fails reaching another service while it holds the database",
  function (this: SpecWorld) {
    mount(this, (application) => {
      application.server.get(pagePath, async () => {
        await application.unitOfWork.inReadOnlyTransaction(() => {
          // What a service that is not there says, as node says it, thrown
          // while the request holds its connection: not the database's.
          throw Object.assign(new Error("connect ETIMEDOUT 203.0.113.1:443"), {
            code: "ETIMEDOUT",
          });
        });
        return examplePage;
      });
    });
    builtFor(this).route = { method: "GET", url: pagePath };
  },
);

Given("the site is restarted", async function (this: SpecWorld) {
  await restart(this);
});

// The answer to a reader does not wait for the administrator to be told, so
// whatever looks at what was sent, or logged, waits for it here.
const afterTheAdministratorIsTold = (world: SpecWorld): Promise<void> =>
  builtFor(world).application.administratorTold();

const sentTo = (world: SpecWorld, address: string) =>
  senderOf(world).sent.filter((email) => email.to === address);

Then(
  "an email is sent to {string}",
  async function (this: SpecWorld, address: string) {
    await afterTheAdministratorIsTold(this);
    assert.ok(sentTo(this, address).length > 0, `${address} was sent nothing.`);
  },
);

Then(
  "{int} email is sent to {string}",
  async function (this: SpecWorld, count: number, address: string) {
    await afterTheAdministratorIsTold(this);
    assert.equal(sentTo(this, address).length, count);
  },
);

Then(
  "{int} emails are sent to {string}",
  async function (this: SpecWorld, count: number, address: string) {
    await afterTheAdministratorIsTold(this);
    assert.equal(sentTo(this, address).length, count);
  },
);

Then("no email is sent", async function (this: SpecWorld) {
  await afterTheAdministratorIsTold(this);
  assert.deepEqual(senderOf(this).sent, []);
});

Then(
  "the email sent to {string} says the database cannot be reached",
  async function (this: SpecWorld, address: string) {
    await afterTheAdministratorIsTold(this);
    const email = sentTo(this, address)[0];
    assert.ok(email !== undefined, `${address} was sent nothing.`);
    assert.match(unmarked(email.subject), /database/i);
  },
);

Then(
  "the email sent to {string} does not say the database cannot be reached",
  async function (this: SpecWorld, address: string) {
    await afterTheAdministratorIsTold(this);
    const email = sentTo(this, address)[0];
    assert.ok(email !== undefined, `${address} was sent nothing.`);
    assert.doesNotMatch(unmarked(email.subject), /database/i);
  },
);

Then(
  "the email sent to {string} names the moment {string}",
  async function (this: SpecWorld, address: string, moment: string) {
    await afterTheAdministratorIsTold(this);
    const email = sentTo(this, address)[0];
    assert.ok(email !== undefined, `${address} was sent nothing.`);
    assert.ok(email.body.includes(new Date(moment).toISOString()));
  },
);

Then("the log says {string}", async function (this: SpecWorld, code: string) {
  await afterTheAdministratorIsTold(this);
  assert.ok(
    logOf(this).some((line) => line.includes(code)),
    `The log does not say ${code}.`,
  );
});

// How long the site waits, and how it is set ---------------------------------

Given(
  "the database unreachable email interval is blank",
  async function (this: SpecWorld) {
    settingOf(this)[intervalSetting] = "";
    await restart(this);
  },
);

Given(
  "the database unreachable email interval is {int} minutes",
  async function (this: SpecWorld, minutes: number) {
    settingOf(this)[intervalSetting] = String(minutes);
    await restart(this);
  },
);

// Said and not acted on: a value that is not a whole number of minutes stops
// the site starting, so building the application with it is the very thing the
// scenario is about, and it is loaded by the step that says so.
Given(
  "the database unreachable email interval is {string}",
  function (this: SpecWorld, setting: string) {
    settingOf(this)[intervalSetting] = setting;
  },
);

const loadings = new WeakMap<SpecWorld, { refusal?: unknown }>();

When("the configuration is loaded", function (this: SpecWorld) {
  loadEnvFile();
  const loading: { refusal?: unknown } = {};
  try {
    loadConfig({ ...process.env, ...settingOf(this) });
  } catch (failure) {
    loading.refusal = failure;
  }
  loadings.set(this, loading);
});

Then("the configuration is refused", function (this: SpecWorld) {
  assert.ok(
    loadings.get(this)?.refusal instanceof ConfigError,
    "The configuration was not refused.",
  );
});

Then(
  "the configuration names the setting {string}",
  function (this: SpecWorld, name: string) {
    const refusal = loadings.get(this)?.refusal;
    assert.ok(refusal instanceof Error, "The configuration was not refused.");
    assert.ok(refusal.message.includes(name), refusal.message);
  },
);
