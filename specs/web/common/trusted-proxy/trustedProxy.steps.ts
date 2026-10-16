import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import Fastify from "fastify";

import { loadConfig } from "../../../../src/infrastructure/config/Config.js";
import {
  ipAddressOf,
  sendersBelieved,
} from "../../../../src/web/common/trustedProxy.js";
import type { SpecWorld } from "../../../support/world.js";

// The setting a scenario is about, among everything the config loader insists
// on before it will answer at all. None of the rest is reached: nothing here
// opens a database, serves a page or sends an email.
const settingsWith = (trustedProxy: string): NodeJS.ProcessEnv => ({
  DATABASE_URL: "postgres://nobody@localhost:5432/nothing",
  SESSION_COOKIE_SECRET: "not a secret",
  TOKEN_SIGNING_KEY: "not a key",
  ACCOUNT_ENCRYPTION_KEY: "not a key",
  ACCOUNT_EMAIL_ADDRESS_HASH_KEY: "not a key",
  EMAIL_FROM_ADDRESS: "nobody@example.com",
  ADMINISTRATOR_EMAIL_FROM_NAME: "Nobody",
  TRUSTED_PROXY: trustedProxy,
});

// A server built the way the application builds one, and asked what address
// the request it was given counts as. Built here rather than by standing the
// whole application up, because what decides the answer is the one option
// below and Fastify's reading of the forwarding header: an application with
// its routes, its assets and its database would be the same answer, slower.
const countedFrom = async (world: SpecWorld): Promise<string> => {
  const request = world.requestCameIn;
  assert.ok(request !== undefined, "No request has been described.");

  const config = loadConfig(settingsWith(world.trustedProxySetting ?? ""));
  const server = Fastify({
    logger: false,
    trustProxy: sendersBelieved(config.trustedProxies),
  });
  server.get("/asked", (asked) => ({ ipAddress: ipAddressOf(asked) }));

  try {
    const answered = await server.inject({
      method: "GET",
      url: "/asked",
      // What the connection came in on, which is all a request has to say for
      // itself where nothing was forwarded.
      remoteAddress: request.connection,
      // One header, reader first, as each proxy in turn appends the address it
      // was reached from.
      headers:
        request.forwarded.length === 0
          ? {}
          : { "x-forwarded-for": request.forwarded.join(", ") },
    });
    return (JSON.parse(answered.body) as { ipAddress: string }).ipAddress;
  } finally {
    await server.close();
  }
};

Given(
  "the site is told nothing forwards requests to it",
  function (this: SpecWorld) {
    this.trustedProxySetting = "";
  },
);

Given(
  "the site is told requests are forwarded by {string}",
  function (this: SpecWorld, proxies: string) {
    this.trustedProxySetting = proxies;
  },
);

Given(
  "a request that came in from {string}",
  function (this: SpecWorld, connection: string) {
    this.requestCameIn = { connection, forwarded: [] };
  },
);

Given(
  "it says it was forwarded from {string}",
  function (this: SpecWorld, ipAddress: string) {
    assert.ok(this.requestCameIn !== undefined, "No request has come in.");
    this.requestCameIn.forwarded.push(ipAddress);
  },
);

// Each hop after the reader's own address, in the order the proxies that wrote
// them come: the one nearest this site is written last.
Given(
  "it says that was forwarded on by {string}",
  function (this: SpecWorld, ipAddress: string) {
    assert.ok(this.requestCameIn !== undefined, "No request has come in.");
    this.requestCameIn.forwarded.push(ipAddress);
  },
);

Then(
  "it is counted as coming from {string}",
  async function (this: SpecWorld, ipAddress: string) {
    assert.equal(await countedFrom(this), ipAddress);
  },
);

// Reading the settings is the first thing a start does and the only part of it
// this setting reaches: a site whose settings are unusable never gets as far as
// building anything.
When("the site starts", function (this: SpecWorld) {
  try {
    loadConfig(settingsWith(this.trustedProxySetting ?? ""));
    this.startingFailed = undefined;
  } catch (refusal) {
    this.startingFailed = refusal;
  }
});

Then("it starts", function (this: SpecWorld) {
  assert.equal(this.startingFailed, undefined);
});

Then("it refuses to start", function (this: SpecWorld) {
  assert.ok(this.startingFailed !== undefined, "The site started.");
});

Then("what it says names the setting", function (this: SpecWorld) {
  assert.ok(this.startingFailed instanceof Error, "The site started.");
  assert.match(this.startingFailed.message, /TRUSTED_PROXY/);
});
