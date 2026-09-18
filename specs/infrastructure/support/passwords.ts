// What the password features share: what stands behind "a password hasher",
// the old site's hasher with the site-wide salt the scenarios use, and what
// was asked of each while a password was checked.
//
// Here rather than in specs/support/ because all of it reaches into
// src/infrastructure/, and specs/support/ is loaded by every spec in the
// repository and so may not.
import { Given } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { Argon2id } from "../../../src/infrastructure/identity/Argon2id.js";
import { ImportedPasswordHasher } from "../../../src/infrastructure/identity/ImportedPasswordHasher.js";
import { OldSitePasswordHasher } from "../../../src/infrastructure/identity/OldSitePasswordHasher.js";
import type { SpecWorld } from "../../support/world.js";

/**
 * The site-wide salt the scenarios' old hashes were made with: made up for
 * them, so that the real one stays out of the repository.
 */
export const scenariosSiteSalt = "{00000000-5CE4-4A10-8000-000000000001}";

/** Argon2id, counting every time it was asked to check something. */
export class CountedArgon2id extends Argon2id {
  asked = 0;

  override verify(hashed: string, input: string): Promise<boolean> {
    this.asked += 1;
    return super.verify(hashed, input);
  }

  override spend(input: string): Promise<false> {
    this.asked += 1;
    return super.spend(input);
  }
}

/** The old site's hasher, counting every password put through it. */
export class CountedOldSitePasswordHasher extends OldSitePasswordHasher {
  asked = 0;

  override hashOf(password: string, salt: string): string {
    this.asked += 1;
    return super.hashOf(password, salt);
  }
}

export interface Passwords {
  readonly argon2: CountedArgon2id;
  readonly oldSite: CountedOldSitePasswordHasher;
  readonly hasher: ImportedPasswordHasher;
  // The old site's hash a scenario starts from, as the old site kept it; what
  // importing it made; and a hash made again from its password.
  oldHash?: string;
  importedHash?: string;
  remade?: string;
}

const passwords = new WeakMap<SpecWorld, Passwords>();

export const passwordsOf = (world: SpecWorld): Passwords => {
  const found = passwords.get(world);
  assert.ok(found !== undefined, "There is no password hasher.");
  return found;
};

// The application's hasher, which is the one that takes imported hashes as
// well as today's: every hasher is held to the hasher's own feature, and this
// is the one the application uses.
Given("a password hasher", function (this: SpecWorld) {
  const argon2 = new CountedArgon2id();
  const oldSite = new CountedOldSitePasswordHasher(scenariosSiteSalt);
  const hasher = new ImportedPasswordHasher(argon2, oldSite);
  passwords.set(this, { argon2, oldSite, hasher });
  this.passwordHasher = hasher;
});
