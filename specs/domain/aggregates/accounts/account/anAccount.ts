import { strict as assert } from "node:assert";
import { createHash } from "node:crypto";
import { inspect } from "node:util";

import { Account } from "../../../../../src/domain/aggregates/accounts/Account.js";
import { AccountId } from "../../../../../src/domain/aggregates/accounts/AccountId.js";
import type { Role } from "../../../../../src/domain/aggregates/accounts/value-objects/Role.js";
import type { DomainEvent } from "../../../../../src/domain/common/DomainEvent.js";
import { ReadOnlyDate } from "../../../../../src/domain/common/ReadOnlyDate.js";
import type { SpecWorld } from "../../../../support/world.js";

// What the steps for each of an account's methods share. A module rather than
// a steps file, so that a feature's steps can use it without defining a step
// twice, and kept here rather than in specs/support, since nothing but an
// account's features has any use for it.

// The stream an account is rebuilt from. Kept here rather than on the world,
// which has no business knowing what an account's events are.
const streams = new WeakMap<SpecWorld, DomainEvent[]>();

export const streamOf = (world: SpecWorld): DomainEvent[] => {
  let stream = streams.get(world);
  if (stream === undefined) {
    stream = [];
    streams.set(world, stream);
  }
  return stream;
};

// The account the Background names is the one every event is about, and, as
// for every account event, the one that caused it.
export const idOf = (world: SpecWorld): AccountId => {
  assert.ok(world.account !== undefined, "No account has been named.");
  return world.account;
};

// Who asks for what is done to the account, where that is somebody other than
// the account: giving it a role, or taking one away.
const askers = new WeakMap<SpecWorld, AccountId>();

export const askedBy = (world: SpecWorld, account: string): void => {
  askers.set(world, AccountId.from(account));
};

// Somebody other than the account, for a scenario that does not say who asked
// because who did is not what it is about.
const SOMEBODY_ELSE = AccountId.from(
  "account/9b2f6a4e-1d3c-4e5f-8a7b-6c5d4e3f2a1b",
);

export const askerOf = (world: SpecWorld): AccountId =>
  askers.get(world) ?? SOMEBODY_ELSE;

// A role as a feature names it, and as the account knows it.
const named: Readonly<Record<string, Role>> = {
  Administrator: "administrator",
  "World Ranking Officer": "world-ranking-officer",
};

export const roleNamed = (name: string): Role => {
  const role = named[name];
  assert.ok(role !== undefined, `There is no role called ${name}.`);
  return role;
};

export const now = (world: SpecWorld): ReadOnlyDate => {
  assert.ok(world.moment !== undefined, "No moment has been named.");
  return ReadOnlyDate.from(world.moment);
};

export const at = (moment: string): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(moment));

export const accountOf = (world: SpecWorld): Account => {
  assert.ok(
    world.aggregate instanceof Account,
    `There is no account: ${inspect(world.failure)}`,
  );
  return world.aggregate;
};

// An account is only ever given a hash, so what matters of this one is that
// it is not the password; how it was made does not.
export const hashOf = (password: string): string =>
  `stand-in$${createHash("sha256").update(password).digest("hex")}`;

// The scenario's own hash of an email address when it keeps accounts, so that
// they can be found by it; a stand-in otherwise, since the account only
// carries it.
export const addressHashOf = (world: SpecWorld, address: string): string =>
  world.hashEmailAddress?.(address) ?? `stand-in$${address.toLowerCase()}`;

// A new account is looked at from then on, and kept when the scenario keeps
// accounts.
export const begin = async (
  world: SpecWorld,
  account: Account,
): Promise<void> => {
  world.aggregate = account;
  await world.keepAccount?.(account);
};

// Asking an account something may be refused, and the scenario says whether
// it expects that, so a refusal is kept rather than thrown. What it recorded
// is kept when the scenario keeps accounts.
export const ask = async (
  world: SpecWorld,
  asking: (account: Account) => void,
): Promise<void> => {
  const account = accountOf(world);
  try {
    asking(account);
  } catch (failure) {
    world.failure = failure;
    return;
  }
  await world.keepAccount?.(account);
};

// The first thing the account recorded, which has to be of the kind `kind`.
export const assertFirstRecorded = <T extends DomainEvent>(
  world: SpecWorld,
  kind: abstract new (...args: never[]) => T,
): T => {
  const event = accountOf(world).recorded[0];
  assert.ok(event !== undefined, "It recorded nothing.");
  assert.ok(event instanceof kind, `It recorded ${inspect(event)}.`);
  return event;
};

// What a scenario that does not say is confirmed as, confirmed with and brought
// over with: what was typed is not what that scenario is about.
export const A_NAME = "Sam Someone";
export const A_PASSWORD_HASH = hashOf("correct horse battery staple");
export const AN_OLD_SITE_HASH = "$old-site$stand-in";

// The hash a password is hashed again with, and the one a new password is set
// with, when a scenario does not say.
export const A_BETTER_HASH = hashOf("the same password, hashed better");
export const A_NEW_PASSWORD_HASH = hashOf("a password chosen later");
