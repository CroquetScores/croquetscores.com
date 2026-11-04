import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { readdir } from "node:fs/promises";

import {
  helpSearchRulesOf,
  type HelpSearchRules,
} from "../../../../src/web/common/helpSearchConfigurations.js";
import type { SpecWorld } from "../../../support/world.js";
import { folders, helpFolder, languageOf } from "./helpFolders.js";

const asked = new WeakMap<SpecWorld, string>();
const chosen = new WeakMap<SpecWorld, HelpSearchRules | undefined>();
const chosenForEach = new WeakMap<
  SpecWorld,
  ReadonlyMap<string, HelpSearchRules | undefined>
>();

Given("the help language {string}", function (this: SpecWorld, name: string) {
  asked.set(this, name);
});

When("the way to search it is chosen", async function (this: SpecWorld) {
  const name = asked.get(this);
  assert.ok(name !== undefined, "No language was asked for.");
  chosen.set(this, helpSearchRulesOf((await languageOf(name)).tag));
});

Then(
  "the help is searched by the rules of {string}",
  function (this: SpecWorld, rules: string) {
    assert.equal(chosen.get(this), rules);
  },
);

Then(
  "the help is searched by words as they are written",
  function (this: SpecWorld) {
    assert.equal(chosen.get(this), "simple");
  },
);

Given("the folders of the help", async function (this: SpecWorld) {
  const entries = await readdir(helpFolder, { withFileTypes: true });
  folders.set(
    this,
    entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name),
  );
});

When("the way to search each is chosen", async function (this: SpecWorld) {
  const chosenFor = new Map<string, HelpSearchRules | undefined>();
  for (const folder of folders.get(this) ?? []) {
    chosenFor.set(folder, helpSearchRulesOf((await languageOf(folder)).tag));
  }
  chosenForEach.set(this, chosenFor);
});

Then("every folder has a way to be searched", function (this: SpecWorld) {
  const each = chosenForEach.get(this);
  assert.ok(each !== undefined && each.size > 0, "No folder was looked at.");
  for (const [folder, rules] of each) {
    assert.ok(rules !== undefined, `${folder} has no way to be searched.`);
  }
});
