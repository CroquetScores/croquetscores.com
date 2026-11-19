// What the scenarios about API keys share (CreateApiKey.feature,
// RevokeApiKey.feature, IdentifyApiKey.feature, ChangeApiKeyLimits.feature):
// the keys a scenario made, the list it last read, and keeping whatever came
// of asking rather than throwing it, since some scenarios are about how it is
// refused.
import { strict as assert } from "node:assert";

import type { ApiKeyShown } from "../../../../src/application/operations/accounts/ApiKeysOfAccount.js";
import type { CreatedApiKey } from "../../../../src/application/operations/accounts/CreateApiKey.js";
import type { ApiKeyIdentified } from "../../../../src/application/operations/accounts/IdentifyApiKey.js";
import type { BrokenRule } from "../../../../src/domain/common/validation/Validator.js";
import type { SpecWorld } from "../../../support/world.js";

interface Scenario {
  /** Every key made, in order, with the address of the account it was made for. */
  readonly made: { readonly address: string; readonly key: CreatedApiKey }[];
  /** The list of keys last read. */
  listed: readonly ApiKeyShown[];
  /** Who the key last presented acts as, or nothing where it is known to nobody. */
  identified: ApiKeyIdentified | undefined;
  /** Whether a key has been presented, so that nothing is mistaken for an answer. */
  presented: boolean;
  /** The tournament the last key was limited to, where it was. */
  tournament: string | undefined;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

export const apiKeysOf = (world: SpecWorld): Scenario => {
  let found = scenarios.get(world);
  if (found === undefined) {
    found = {
      made: [],
      listed: [],
      identified: undefined,
      presented: false,
      tournament: undefined,
    };
    scenarios.set(world, found);
  }
  return found;
};

/** The key made last, which "that key" is. */
export const lastKeyMade = (world: SpecWorld): CreatedApiKey => {
  const last = apiKeysOf(world).made.at(-1);
  assert.ok(last !== undefined, "No key has been made.");
  return last.key;
};

/** The key made `place`th, counting from 1, as "the first key" says it. */
export const keyMadeAt = (world: SpecWorld, place: string): CreatedApiKey => {
  const found = apiKeysOf(world).made[ORDINALS.indexOf(place)];
  assert.ok(found !== undefined, `No key was made ${place}.`);
  return found.key;
};

export const ORDINALS = ["first", "second", "third"];

/** The key listed `place`th, counting from 1, as "the first key" says it. */
export const keyListedAt = (world: SpecWorld, place: string): ApiKeyShown => {
  const found = apiKeysOf(world).listed[ORDINALS.indexOf(place)];
  assert.ok(found !== undefined, `No key is listed ${place}.`);
  return found;
};

/**
 * Asks, keeping the answer in the world, or the failure and the rules it
 * broke, as the scenarios about refusals read them.
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
