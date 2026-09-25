import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { ConfigError } from "../../../src/infrastructure/config/Config.js";
import {
  loadImportConfig,
  type ImportConfig,
} from "../../../src/import-ravendb/loadImportConfig.js";
import type { SpecWorld } from "../../support/world.js";

// The settings a scenario gives, and nothing from the environment it runs in,
// so that a setting on the machine running the specs cannot make one pass.
interface Reading {
  readonly settings: Record<string, string>;
  read?: ImportConfig;
  refused?: unknown;
}

const readings = new WeakMap<SpecWorld, Reading>();

const readingOf = (world: SpecWorld): Reading => {
  const found = readings.get(world) ?? { settings: {} };
  readings.set(world, found);
  return found;
};

const readOf = (world: SpecWorld): ImportConfig => {
  const { read, refused } = readingOf(world);
  assert.equal(refused, undefined, "Reading the settings was refused.");
  assert.ok(read !== undefined, "The settings have not been read.");
  return read;
};

Given(
  "the setting {string} is {string}",
  function (this: SpecWorld, key: string, value: string) {
    readingOf(this).settings[key] = value;
  },
);

When("the import's settings are read", function (this: SpecWorld) {
  const reading = readingOf(this);
  try {
    reading.read = loadImportConfig({ ...reading.settings });
  } catch (failure) {
    reading.refused = failure;
  }
});

Then(
  "the import writes into {string}",
  function (this: SpecWorld, url: string) {
    assert.equal(readOf(this).databaseUrl, url);
  },
);

Then(
  "reading them is refused, naming {string}",
  function (this: SpecWorld, key: string) {
    const { refused } = readingOf(this);
    assert.ok(refused instanceof ConfigError, "Reading them was not refused.");
    assert.ok(
      refused.message.includes(key),
      `The refusal does not name ${key}: ${refused.message}`,
    );
  },
);

Then(
  "the old sites' salt is {string}",
  function (this: SpecWorld, salt: string) {
    assert.equal(readOf(this).oldSitePasswordSalt, salt);
  },
);

const accountKeys: Record<
  string,
  "accountEncryptionKey" | "accountEmailAddressHashKey"
> = {
  ACCOUNT_ENCRYPTION_KEY: "accountEncryptionKey",
  ACCOUNT_EMAIL_ADDRESS_HASH_KEY: "accountEmailAddressHashKey",
};

Then(
  "the key read from {string} is {string}",
  function (this: SpecWorld, setting: string, key: string) {
    const field = accountKeys[setting];
    assert.ok(field !== undefined, `${setting} is not an account key.`);
    assert.equal(readOf(this)[field], key);
  },
);

Then("RavenDB is at {string}", function (this: SpecWorld, url: string) {
  assert.equal(readOf(this).ravenDbUrl, url);
});

Then(
  "the RavenDB databases read are {string}",
  function (this: SpecWorld, databases: string) {
    assert.equal(readOf(this).ravenDbDatabases.join(", "), databases);
  },
);
