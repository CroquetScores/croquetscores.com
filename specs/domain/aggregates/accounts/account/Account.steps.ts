import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Account } from "../../../../../src/domain/aggregates/accounts/Account.js";
import { AccountBroughtOver } from "../../../../../src/domain/aggregates/accounts/events/AccountBroughtOver.js";
import { AccountForgotten } from "../../../../../src/domain/aggregates/accounts/events/AccountForgotten.js";
import { AccountRegistered } from "../../../../../src/domain/aggregates/accounts/events/AccountRegistered.js";
import { EmailAddressConfirmed } from "../../../../../src/domain/aggregates/accounts/events/EmailAddressConfirmed.js";
import { PasswordHashedAgain } from "../../../../../src/domain/aggregates/accounts/events/PasswordHashedAgain.js";
import { PasswordSet } from "../../../../../src/domain/aggregates/accounts/events/PasswordSet.js";
import { GoogleAccountLinked } from "../../../../../src/domain/aggregates/accounts/events/GoogleAccountLinked.js";
import { RoleAdded } from "../../../../../src/domain/aggregates/accounts/events/RoleAdded.js";
import { RoleRemoved } from "../../../../../src/domain/aggregates/accounts/events/RoleRemoved.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  A_BETTER_HASH,
  A_NAME,
  A_NEW_PASSWORD_HASH,
  A_PASSWORD_HASH,
  AN_OLD_SITE_HASH,
  accountOf,
  addressHashOf,
  askedBy,
  askedByAnAdministrator,
  askedByAWorldRankingOfficer,
  askerOf,
  at,
  idOf,
  now,
  roleNamed,
  streamOf,
} from "./anAccount.js";

// The steps more than one of an account's features uses: who asks, the stream
// it is rebuilt from, rebuilding it, and what it is. Each method's own steps
// are beside its feature, in the folder named for it.

// Who asks -----------------------------------------------------------------

Given(
  "it is asked for by {string}",
  function (this: SpecWorld, account: string) {
    askedBy(this, account);
  },
);

// As the account would ask while holding the World Ranking Officer role for
// the sport.
Given(
  "it is asked for by {string}, who is a world ranking officer for {string}",
  function (this: SpecWorld, account: string, sport: string) {
    askedByAWorldRankingOfficer(this, account, sport);
  },
);

// As the account would ask while holding the Administrator role, which the
// account says of itself (asker.feature): what is asked of is not told how.
Given(
  "it is asked for by {string}, who administers the site",
  function (this: SpecWorld, account: string) {
    askedByAnAdministrator(this, account);
  },
);

// The stream --------------------------------------------------------------

Given(
  "a stream where an account was registered at {string}",
  function (this: SpecWorld, address: string) {
    streamOf(this).push(
      new AccountRegistered(
        address,
        addressHashOf(this, address),
        idOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "a stream where an account was brought over as {string} at {string}",
  function (this: SpecWorld, name: string, address: string) {
    streamOf(this).push(
      new AccountBroughtOver(
        name,
        address,
        addressHashOf(this, address),
        AN_OLD_SITE_HASH,
        idOf(this),
        now(this),
      ),
    );
  },
);

Given(
  "its email address was confirmed as {string}",
  function (this: SpecWorld, name: string) {
    streamOf(this).push(
      new EmailAddressConfirmed(name, A_PASSWORD_HASH, idOf(this), now(this)),
    );
  },
);

Given(
  "its email address was confirmed as {string} at {string}",
  function (this: SpecWorld, name: string, moment: string) {
    streamOf(this).push(
      new EmailAddressConfirmed(name, A_PASSWORD_HASH, idOf(this), at(moment)),
    );
  },
);

Given(
  "its email address was confirmed with the password hash {string}",
  function (this: SpecWorld, passwordHash: string) {
    streamOf(this).push(
      new EmailAddressConfirmed(A_NAME, passwordHash, idOf(this), now(this)),
    );
  },
);

Given(
  "its email address was confirmed with no password",
  function (this: SpecWorld) {
    streamOf(this).push(
      new EmailAddressConfirmed(A_NAME, undefined, idOf(this), now(this)),
    );
  },
);

Given("its password was hashed again", function (this: SpecWorld) {
  streamOf(this).push(
    new PasswordHashedAgain(A_BETTER_HASH, idOf(this), now(this)),
  );
});

Given("a new password was set on the account", function (this: SpecWorld) {
  streamOf(this).push(
    new PasswordSet(A_NEW_PASSWORD_HASH, idOf(this), now(this)),
  );
});

Given(
  "a new password was set on the account at {string}",
  function (this: SpecWorld, moment: string) {
    streamOf(this).push(
      new PasswordSet(A_NEW_PASSWORD_HASH, idOf(this), at(moment)),
    );
  },
);

Given(
  "the role {string} was added to it",
  function (this: SpecWorld, role: string) {
    streamOf(this).push(
      new RoleAdded(roleNamed(role), askerOf(this), now(this)),
    );
  },
);

Given(
  "the role {string} was removed from it",
  function (this: SpecWorld, role: string) {
    streamOf(this).push(
      new RoleRemoved(roleNamed(role), askerOf(this), now(this)),
    );
  },
);

Given(
  "the Google account {string} was linked to it",
  function (this: SpecWorld, subject: string) {
    streamOf(this).push(
      new GoogleAccountLinked(subject, idOf(this), now(this)),
    );
  },
);

Given("it was forgotten", function (this: SpecWorld) {
  streamOf(this).push(new AccountForgotten(idOf(this), now(this)));
});

// Rebuilding ----------------------------------------------------------------

When("the account is rebuilt from the stream", function (this: SpecWorld) {
  this.aggregate = Account.rebuiltFrom(idOf(this), streamOf(this));
});

// What it recorded -----------------------------------------------------------

// Both ways what it recorded is written down: as JSON, which is how an event
// is kept, and as console.log shows it.
Then(
  "what it recorded does not contain {string}",
  function (this: SpecWorld, words: string) {
    const recorded = accountOf(this).recorded;
    assert.ok(recorded.length > 0, "It recorded nothing.");
    for (const written of [JSON.stringify(recorded), inspect(recorded)]) {
      assert.ok(!written.includes(words), `It recorded ${written}.`);
    }
  },
);

// What it is -----------------------------------------------------------------

Then(
  "the account is reached at {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(accountOf(this).emailAddress.toString(), address);
  },
);

Then(
  "the account is called {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(accountOf(this).name?.toString(), name);
  },
);

Then("the account has no name", function (this: SpecWorld) {
  assert.equal(accountOf(this).name, undefined);
});

Then("the account is confirmed", function (this: SpecWorld) {
  assert.equal(accountOf(this).confirmed, true);
});

Then("the account is not confirmed", function (this: SpecWorld) {
  assert.equal(accountOf(this).confirmed, false);
});

Then("the account has no password", function (this: SpecWorld) {
  assert.equal(accountOf(this).passwordHash, undefined);
});

Then(
  "the account's password hash is {string}",
  function (this: SpecWorld, passwordHash: string) {
    assert.equal(accountOf(this).passwordHash, passwordHash);
  },
);

// Whether an account is linked is asked as anything else would ask it: by
// linking. The Google account it is linked to already records nothing, and so
// changes nothing a later step looks at; any other is refused, and one linked
// to none records it, and either way the scenario has already failed. When it
// is asked is of no matter, since nothing is recorded that is kept.
const ASKED_AT = at("2026-01-01T00:00:00Z");

Then(
  "the account is linked to the Google account {string}",
  function (this: SpecWorld, subject: string) {
    const account = accountOf(this);
    const before = account.recorded.length;
    account.linkGoogleAccount(subject, ASKED_AT);
    assert.equal(account.recorded.length, before, "It was linked to none.");
  },
);

// Linking one records it only where none is linked. Asked of a copy, rebuilt
// from everything it has, since this time the answer that passes is the one
// that records something.
Then("the account is linked to no Google account", function (this: SpecWorld) {
  const account = accountOf(this);
  const copy = Account.rebuiltFrom(account.id, [
    ...streamOf(this),
    ...account.recorded,
  ]);
  copy.linkGoogleAccount("a-google-account-never-seen", ASKED_AT);
  assert.equal(copy.recorded.length, 1);
});

// Asked through the account's own answer for each role, so that each is
// covered by name.
const holds = (world: SpecWorld, role: string): boolean => {
  const account = accountOf(world);
  switch (roleNamed(role)) {
    case "administrator":
      return account.isAdministrator;
    case "ac-world-ranking-officer":
      return account.worldRankingSports.includes("ac");
    case "gc-world-ranking-officer":
      return account.worldRankingSports.includes("gc");
  }
};

Then(
  "the account holds the role {string}",
  function (this: SpecWorld, role: string) {
    assert.equal(holds(this, role), true);
  },
);

Then(
  "the account does not hold the role {string}",
  function (this: SpecWorld, role: string) {
    assert.equal(holds(this, role), false);
  },
);
