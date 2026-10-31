import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { BrokenRule } from "../../../../../src/domain/common/validation/Validator.js";
import type { SpecWorld } from "../../../../support/world.js";
import { accountFor, tournamentNamed } from "../aRequest.js";
import { addListedPlayers } from "../requests.js";

// What a scenario has written of the list so far: the fields named, and a row
// for each player. Every value is as it was written, since trimming it is the
// command's to do.
const written = new WeakMap<
  SpecWorld,
  { fields: string[]; rows: string[][] }
>();

const listOf = (world: SpecWorld): { fields: string[]; rows: string[][] } => {
  const found = written.get(world) ?? { fields: [], rows: [] };
  written.set(world, found);
  return found;
};

Given("the fields {string}", function (this: SpecWorld, fields: string) {
  listOf(this).fields = fields.split(",");
});

Given("the row {string}", function (this: SpecWorld, row: string) {
  listOf(this).rows.push(row.split(","));
});

Given("{int} players are written", function (this: SpecWorld, count: number) {
  for (let each = 1; each <= count; each += 1) {
    listOf(this).rows.push([`Player ${String(each)}`]);
  }
});

// Which part of the list the rule just named is about. The paths are the
// command's own and stay here, out of the feature, which says the row a
// player was written on, counting from 1.
const lastNamedRule = (world: SpecWorld): BrokenRule => {
  const rule = world.brokenRules?.[world.brokenRulesChecked - 1];
  assert.ok(rule !== undefined, "No rule broken has been named yet.");
  return rule;
};

Then("that rule is about the fields", function (this: SpecWorld) {
  assert.deepEqual(lastNamedRule(this).fields, ["fields"]);
});

Then(
  "that rule is about the player on row {int}",
  function (this: SpecWorld, row: number) {
    assert.deepEqual(lastNamedRule(this).fields, [`rows.${String(row - 1)}`]);
  },
);

When(
  "the reader signed in to the account for {string} adds the listed players to {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    const { fields, rows } = listOf(this);
    await addListedPlayers(
      this,
      account,
      tournamentNamed(this, name),
      fields,
      rows,
    );
  },
);

Then("the answer is {int} ids", function (this: SpecWorld, count: number) {
  assert.equal((this.answer as readonly unknown[]).length, count);
});
