// What the scenarios about giving, taking and listing roles share
// (AddRole.feature, RemoveRole.feature, AccountsWithRole.feature): the
// accounts they are asked of, a role as a feature names it, and keeping
// whatever came of asking.
import { strict as assert } from "node:assert";

import type { Account } from "../../../../src/domain/aggregates/accounts/Account.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { BrokenRule } from "../../../../src/domain/common/validation/Validator.js";
import type { Registering } from "../../../support/registering.js";
import type { SpecWorld } from "../../../support/world.js";

export const registeringOf = (world: SpecWorld): Registering => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering;
};

export const momentOf = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

/**
 * A role as a feature names it, "Administrator" or "AC World Ranking Officer",
 * written as a request carries it. Not checked against the roles there are,
 * since some scenarios name one there is not, to see it refused.
 */
export const roleWritten = (name: string): string =>
  name.toLowerCase().replaceAll(" ", "-");

/** The account for `address` as its stream reads now. */
export const accountAt = async (
  world: SpecWorld,
  address: string,
): Promise<Account> => {
  const account = await registeringOf(world).accountFor(address);
  assert.ok(account !== undefined, `There is no account for ${address}.`);
  return account;
};

/**
 * Asks `asking`, keeping its answer, or what it was refused with and the rules
 * it broke, rather than throwing: some scenarios are about how it is refused.
 */
export const keepingWhatCameOf = async (
  world: SpecWorld,
  asking: () => Promise<unknown>,
): Promise<void> => {
  world.answer = undefined;
  world.failure = undefined;
  world.brokenRules = undefined;
  world.brokenRulesChecked = 0;
  try {
    world.answer = await asking();
  } catch (failure) {
    world.failure = failure;
    const refused = failure as { broken?: unknown };
    world.brokenRules = Array.isArray(refused.broken)
      ? (refused.broken as BrokenRule[])
      : undefined;
  }
};

// Asked of the account as its stream reads now, since what matters is what it
// holds once everything recorded of it is read back.
export const holds = async (
  world: SpecWorld,
  address: string,
  role: string,
): Promise<boolean> => {
  const account = await accountAt(world, address);
  switch (roleWritten(role)) {
    case "administrator":
      return account.isAdministrator;
    case "ac-world-ranking-officer":
      return account.worldRankingSports.includes("ac");
    case "gc-world-ranking-officer":
      return account.worldRankingSports.includes("gc");
    default:
      throw new Error(`There is no role called ${role}.`);
  }
};
