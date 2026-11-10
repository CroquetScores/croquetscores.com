import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import Fastify from "fastify";

import { loadConfig } from "../../../../src/infrastructure/config/Config.js";
import { registerSearchEngines } from "../../../../src/web/common/searchEngines.js";
import type { SpecWorld } from "../../../support/world.js";

// The setting a scenario is about, among everything the config loader insists
// on before it will answer at all. None of the rest is reached.
const settingsWith = (searchEngines: string): NodeJS.ProcessEnv => ({
  DATABASE_URL: "postgres://nobody@localhost:5432/nothing",
  SESSION_COOKIE_SECRET: "not a secret",
  TOKEN_SIGNING_KEY: "not a key",
  ACCOUNT_ENCRYPTION_KEY: "not a key",
  ACCOUNT_EMAIL_ADDRESS_HASH_KEY: "not a key",
  ADMINISTRATOR_EMAIL_ADDRESS: "nobody@example.com",
  ADMINISTRATOR_EMAIL_FROM_NAME: "Nobody",
  SEARCH_ENGINES_WELCOME: searchEngines,
});

// A server with the one thing under test and a page to ask for, rather than
// the whole application: what decides the answer is the setting, and an
// application with a database would give the same answer slower.
// Whether a scenario's server believes the proxy in front of it, and which
// address that proxy says the reader asked for.
const proxied = new WeakMap<SpecWorld, { trusted: boolean }>();

const asked = async (
  world: SpecWorld,
  url: string,
  address: string,
  forwardedFor?: string,
): Promise<void> => {
  const config = loadConfig(settingsWith(world.searchEnginesSetting ?? ""));
  const server = Fastify({
    logger: false,
    trustProxy: proxied.get(world)?.trusted ?? false,
  });
  registerSearchEngines(server, config.searchEnginesWelcome);
  server.get("/a-page", () => "a page");
  server.get("/a-page-by-cookie", (_request, reply) =>
    reply.header("vary", "Cookie").send("a page"),
  );

  try {
    const answer = await server.inject({
      method: "GET",
      url,
      headers: {
        host: address,
        ...(forwardedFor === undefined
          ? {}
          : { "x-forwarded-host": forwardedFor }),
      },
    });
    world.answeredWith = { headers: answer.headers, body: answer.body };
  } finally {
    await server.close();
  }
};

const answer = (world: SpecWorld) => {
  assert.ok(world.answeredWith !== undefined, "Nothing has been asked for.");
  return world.answeredWith;
};

// Lines rather than a substring, so that "/" is not found inside "/admin".
const disallowed = (world: SpecWorld): string[] =>
  answer(world)
    .body.split("\n")
    .filter((line) => line.startsWith("Disallow: "))
    .map((line) => line.slice("Disallow: ".length));

const asVary = (header: unknown): string[] => {
  if (typeof header === "string") {
    return header.split(",").map((each) => each.trim().toLowerCase());
  }
  if (
    Array.isArray(header) &&
    header.every((each): each is string => typeof each === "string")
  ) {
    return header
      .flatMap((each) => each.split(","))
      .map((each) => each.trim().toLowerCase());
  }
  return [];
};

Given(
  "the site is told nothing about search engines",
  function (this: SpecWorld) {
    this.searchEnginesSetting = "";
  },
);

Given(
  "the site is told search engines are welcome",
  function (this: SpecWorld) {
    this.searchEnginesSetting = "true";
  },
);

Given(
  "the site is told search engines are not welcome",
  function (this: SpecWorld) {
    this.searchEnginesSetting = "false";
  },
);

Given(
  "the site is told search engines are {string}",
  function (this: SpecWorld, setting: string) {
    this.searchEnginesSetting = setting;
  },
);

// Where nothing says which website, it is the one the setting is about.
const theWebsite = "croquetscores.com";

When("the robots file is asked for", async function (this: SpecWorld) {
  await asked(this, "/robots.txt", theWebsite);
});

When(
  "the robots file is asked for at {string}",
  async function (this: SpecWorld, address: string) {
    await asked(this, "/robots.txt", address);
  },
);

Given("the site is behind a proxy it trusts", function (this: SpecWorld) {
  proxied.set(this, { trusted: true });
});

When(
  "a page is asked for at {string} by way of the proxy for {string}",
  async function (this: SpecWorld, address: string, forwarded: string) {
    await asked(this, "/a-page", address, forwarded);
  },
);

When("a page is asked for", async function (this: SpecWorld) {
  await asked(this, "/a-page", theWebsite);
});

When(
  "a page of the website at {string} is asked for",
  async function (this: SpecWorld, address: string) {
    await asked(this, "/a-page", address);
  },
);

When(
  "a page that varies by {string} is asked for",
  async function (this: SpecWorld, by: string) {
    void by;
    await asked(this, "/a-page-by-cookie", theWebsite);
  },
);

Then("the answer varies by {string}", function (this: SpecWorld, by: string) {
  const varies = asVary(answer(this).headers["vary"]);
  assert.ok(varies.includes(by.toLowerCase()), `It does not vary by ${by}.`);
});

Then("it disallows {string}", function (this: SpecWorld, path: string) {
  assert.ok(disallowed(this).includes(path), `${path} is not disallowed.`);
});

Then("it does not disallow {string}", function (this: SpecWorld, path: string) {
  assert.ok(!disallowed(this).includes(path), `${path} is disallowed.`);
});

Then("it is checked again before it is used", function (this: SpecWorld) {
  assert.match(String(answer(this).headers["cache-control"]), /no-cache/);
});

Then("it asks not to be indexed", function (this: SpecWorld) {
  assert.match(String(answer(this).headers["x-robots-tag"]), /noindex/);
});

Then("it does not ask not to be indexed", function (this: SpecWorld) {
  assert.equal(answer(this).headers["x-robots-tag"], undefined);
});

When("the site is started", function (this: SpecWorld) {
  try {
    loadConfig(settingsWith(this.searchEnginesSetting ?? ""));
    this.startingFailed = undefined;
  } catch (refusal) {
    this.startingFailed = refusal;
  }
});

Then("it is up", function (this: SpecWorld) {
  assert.equal(this.startingFailed, undefined);
});

Then("the setting is refused", function (this: SpecWorld) {
  assert.ok(this.startingFailed !== undefined, "The site started.");
});

Then("the refusal names the setting", function (this: SpecWorld) {
  assert.ok(this.startingFailed instanceof Error, "The site started.");
  assert.match(this.startingFailed.message, /SEARCH_ENGINES_WELCOME/);
});
