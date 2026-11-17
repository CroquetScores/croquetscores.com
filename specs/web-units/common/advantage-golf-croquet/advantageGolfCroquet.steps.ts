import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { Website } from "../../../../src/domain/common/Website.js";
import {
  ConfigError,
  loadConfig,
  type Config,
} from "../../../../src/infrastructure/config/Config.js";
import { advantageGolfCroquetIsOffered } from "../../../../src/web/common/advantageGolfCroquet.js";
import type { SpecWorld } from "../../../support/world.js";

// What a scenario is about: the setting as it is written, and what loading it
// and asking of a website gave. Kept here rather than on the world, which has
// no business knowing what the setting is.
interface Scenario {
  setting: string;
  config: Config | undefined;
  refusal: unknown;
  offered: boolean | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      setting: "",
      config: undefined,
      refusal: undefined,
      offered: undefined,
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

// The setting among everything the config loader insists on before it will
// answer at all. None of the rest is reached.
const loaded = (world: SpecWorld): void => {
  const scenario = scenarioOf(world);
  try {
    scenario.config = loadConfig({
      DATABASE_URL: "postgres://nobody@localhost:5432/nothing",
      SESSION_COOKIE_SECRET: "not a secret",
      TOKEN_SIGNING_KEY: "not a key",
      ACCOUNT_ENCRYPTION_KEY: "not a key",
      ACCOUNT_EMAIL_ADDRESS_HASH_KEY: "not a key",
      ADMINISTRATOR_EMAIL_ADDRESS: "nobody@example.com",
      ADMINISTRATOR_EMAIL_FROM_NAME: "Nobody",
      ADVANTAGE_GOLF_CROQUET: scenario.setting,
    });
    scenario.refusal = undefined;
  } catch (refusal) {
    scenario.config = undefined;
    scenario.refusal = refusal;
  }
};

Given(
  "the site is told nothing about Advantage Golf Croquet",
  function (this: SpecWorld) {
    scenarioOf(this).setting = "";
  },
);

Given(
  "the site is told Advantage Golf Croquet is offered",
  function (this: SpecWorld) {
    scenarioOf(this).setting = "true";
  },
);

Given(
  "the site is told Advantage Golf Croquet is not offered",
  function (this: SpecWorld) {
    scenarioOf(this).setting = "false";
  },
);

Given(
  "the site is told Advantage Golf Croquet is {string}",
  function (this: SpecWorld, setting: string) {
    scenarioOf(this).setting = setting;
  },
);

When(
  "Advantage Golf Croquet is asked of {string}",
  function (this: SpecWorld, host: string) {
    loaded(this);
    const { config } = scenarioOf(this);
    assert.ok(config !== undefined, "The settings were not accepted.");
    scenarioOf(this).offered = advantageGolfCroquetIsOffered(
      // Development is reached by its host and port, as a browser writes them.
      Website.addressedTo(host),
      config.advantageGolfCroquet,
    );
  },
);

Then(
  /^it is (offered|not offered)$/,
  function (this: SpecWorld, which: string) {
    assert.equal(scenarioOf(this).offered, which === "offered");
  },
);

Then(
  "the site cannot start for {string}",
  function (this: SpecWorld, key: string) {
    loaded(this);
    const { refusal } = scenarioOf(this);
    assert.ok(refusal instanceof ConfigError, "The settings were accepted.");
    assert.ok(
      refusal.message.includes(key),
      `The refusal does not name ${key}: ${refusal.message}`,
    );
  },
);
