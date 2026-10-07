// The accounts a scenario says are already there, and the steps that say so.
//
// Two machineries make them. An application scenario makes them through the
// operation's own stand-up; a browser scenario makes them through the
// application it is talking to. The words are the same either way, because
// what the scenario is saying is the same either way, so the steps ask the
// world for whatever it has and the world is given one by whichever support
// stood the scenario up.
//
// Here rather than beside one feature's steps because five features say it.
// Application and domain types only, for the reason at the top of world.ts.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  isRole,
  type Role,
} from "../../src/domain/aggregates/accounts/value-objects/Role.js";
import type { SpecWorld } from "./world.js";

/** How an account a scenario says exists was come by. */
export interface AccountAsGiven {
  readonly confirmed: boolean;
  /** What it was confirmed as called, where the scenario says. */
  readonly name?: string;
  /** The password it was confirmed with, where the scenario says one. */
  readonly password?: string;
  /** Whether it was confirmed with no password, as signing in with Google confirms one. */
  readonly noPassword?: boolean;
  /** Whether it came over from the old site, with the hash the old site made. */
  readonly fromTheOldSite?: boolean;
}

/** What makes the accounts a scenario says are already there. */
export interface AccountsInHand {
  give(address: string, as: AccountAsGiven): Promise<void>;

  /** Forgets the account for `address`, as forgetting one will. */
  forget(address: string): Promise<void>;

  /** Links the account for `address` to the Google account `subject`. */
  linkToGoogle(address: string, subject: string): Promise<void>;

  /** Gives the account for `address` the role `role`. */
  giveRole(address: string, role: Role): Promise<void>;

  /** Takes the role `role` from the account for `address`. */
  takeRole(address: string, role: Role): Promise<void>;
}

const inHand = (world: SpecWorld): AccountsInHand => {
  assert.ok(
    world.accountsInHand !== undefined,
    "This scenario has nothing to make an account with.",
  );
  return world.accountsInHand;
};

Given(
  /^"([^"]*)" has an account, (confirmed|not confirmed)$/,
  async function (this: SpecWorld, address: string, confirmed: string) {
    await inHand(this).give(address, {
      confirmed: confirmed === "confirmed",
    });
  },
);

Given(
  "{string} has an account, confirmed, called {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await inHand(this).give(address, { confirmed: true, name });
  },
);

Given(
  "{string} has an account, confirmed, called {string}, with the password {string}",
  async function (
    this: SpecWorld,
    address: string,
    name: string,
    password: string,
  ) {
    await inHand(this).give(address, { confirmed: true, name, password });
  },
);

Given(
  "{string} has an account, confirmed, with the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    await inHand(this).give(address, { confirmed: true, password });
  },
);

Given(
  "{string} has an account, confirmed, with no password",
  async function (this: SpecWorld, address: string) {
    await inHand(this).give(address, { confirmed: true, noPassword: true });
  },
);

// Brought over with the hash the old site made of its password, which is
// checked the old site's way until the first time it signs in. Confirmed,
// because its owner showed the address was theirs on the old site.
Given(
  "{string} has an account brought over from the old site, with the password {string}",
  async function (this: SpecWorld, address: string, password: string) {
    await inHand(this).give(address, {
      confirmed: true,
      password,
      fromTheOldSite: true,
    });
  },
);

Given(
  "the account for {string} has been forgotten",
  async function (this: SpecWorld, address: string) {
    await inHand(this).forget(address);
  },
);

// A role as a feature names it, "Administrator" or "World Ranking Officer",
// and as the account keeps it.
const roleCalled = (name: string): Role => {
  const role = name.toLowerCase().replaceAll(" ", "-");
  assert.ok(isRole(role), `There is no role called ${name}.`);
  return role;
};

// Given and taken away by somebody the scenario does not name, since who may
// give one is for AddRole.feature and RemoveRole.feature to say, and a
// scenario elsewhere only needs the role held.
Given(
  "{string} has been given the role {string}",
  async function (this: SpecWorld, address: string, role: string) {
    await inHand(this).giveRole(address, roleCalled(role));
  },
);

Given(
  "{string} has had the role {string} taken away",
  async function (this: SpecWorld, address: string, role: string) {
    await inHand(this).takeRole(address, roleCalled(role));
  },
);

Given(
  "the account for {string} was linked to the Google account {string}",
  async function (this: SpecWorld, address: string, subject: string) {
    await inHand(this).linkToGoogle(address, subject);
  },
);
