import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  loadConfig,
  type Config,
} from "../../../src/infrastructure/config/Config.js";
import type { SpecWorld } from "../../support/world.js";

// What a scenario has set, and what starting made of it. Kept here rather than
// on the world, which may name nothing from infrastructure.
interface Starting {
  settings: Record<string, string>;
  config?: Config;
  refusal?: unknown;
}

const startings = new WeakMap<SpecWorld, Starting>();

// Everything the loader insists on before it will answer at all, none of it
// reached: nothing here opens a database, serves a page or sends an email.
const startingOf = (world: SpecWorld): Starting => {
  let starting = startings.get(world);
  if (starting === undefined) {
    starting = {
      settings: {
        DATABASE_URL: "postgres://nobody@localhost:5432/nothing",
        SESSION_COOKIE_SECRET: "not a secret",
        TOKEN_SIGNING_KEY: "not a key",
        ACCOUNT_ENCRYPTION_KEY: "not a key",
        ACCOUNT_EMAIL_ADDRESS_HASH_KEY: "not a key",
        ADMINISTRATOR_EMAIL_FROM_NAME: "Nobody",
      },
    };
    startings.set(world, starting);
  }
  return starting;
};

Given("a mail server is set", function (this: SpecWorld) {
  Object.assign(startingOf(this).settings, {
    SMTP_HOST: "smtp.example.com",
    SMTP_PORT: "587",
    SMTP_USER_NAME: "nobody",
    SMTP_PASSWORD: "not a password",
  });
});

Given("there is no mail server", function (this: SpecWorld) {
  const { settings } = startingOf(this);
  for (const key of [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER_NAME",
    "SMTP_PASSWORD",
  ])
    delete settings[key];
});

Given(
  "the administrator's email address is {string}",
  function (this: SpecWorld, address: string) {
    startingOf(this).settings["ADMINISTRATOR_EMAIL_ADDRESS"] = address;
  },
);

Given("there is no administrator's email address", function (this: SpecWorld) {
  delete startingOf(this).settings["ADMINISTRATOR_EMAIL_ADDRESS"];
});

When("the settings are loaded", function (this: SpecWorld) {
  const starting = startingOf(this);
  try {
    starting.config = loadConfig(starting.settings);
    starting.refusal = undefined;
  } catch (refusal) {
    starting.refusal = refusal;
  }
});

Then("they are accepted", function (this: SpecWorld) {
  assert.equal(startingOf(this).refusal, undefined);
});

Then("they are refused", function (this: SpecWorld) {
  assert.ok(startingOf(this).refusal !== undefined, "The site started.");
});

Then(
  "the refusal names the setting {string}",
  function (this: SpecWorld, setting: string) {
    const { refusal } = startingOf(this);
    assert.ok(refusal instanceof Error, "The site started.");
    assert.ok(refusal.message.includes(setting), refusal.message);
  },
);
