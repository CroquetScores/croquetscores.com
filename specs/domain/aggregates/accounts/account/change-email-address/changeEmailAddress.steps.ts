import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { EmailAddressChangeAsked } from "../../../../../../src/domain/aggregates/accounts/events/EmailAddressChangeAsked.js";
import { EmailAddressChanged } from "../../../../../../src/domain/aggregates/accounts/events/EmailAddressChanged.js";
import { EmailAddress } from "../../../../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  accountOf,
  addressHashOf,
  ask,
  assertFirstRecorded,
  idOf,
  now,
  streamOf,
} from "../anAccount.js";

Given(
  "moving it to {string} was asked for, as {string}",
  function (this: SpecWorld, address: string, reference: string) {
    streamOf(this).push(
      new EmailAddressChangeAsked(address, reference, idOf(this), now(this)),
    );
  },
);

Given("it was moved to {string}", function (this: SpecWorld, address: string) {
  streamOf(this).push(
    new EmailAddressChanged(
      address,
      addressHashOf(this, address),
      idOf(this),
      now(this),
    ),
  );
});

When(
  "moving the account to {string} is asked for, as {string}",
  async function (this: SpecWorld, address: string, reference: string) {
    await ask(this, (account) =>
      account.askToChangeEmailAddress(
        EmailAddress.from(address),
        reference,
        now(this),
      ),
    );
  },
);

When(
  "the account is moved to {string} with the email address hash {string}",
  async function (this: SpecWorld, address: string, hash: string) {
    await ask(this, (account) =>
      account.changeEmailAddress(EmailAddress.from(address), hash, now(this)),
    );
  },
);

Then(
  "the first thing it recorded is a move being asked for",
  function (this: SpecWorld) {
    assertFirstRecorded(this, EmailAddressChangeAsked);
  },
);

Then(
  "the first thing it recorded is its email address being changed",
  function (this: SpecWorld) {
    assertFirstRecorded(this, EmailAddressChanged);
  },
);

Then(
  "its email address being changed says the email address hash {string}",
  function (this: SpecWorld, hash: string) {
    assert.equal(
      assertFirstRecorded(this, EmailAddressChanged).emailAddressHash,
      hash,
    );
  },
);

Then(
  "the move asked for as {string} is to {string}",
  function (this: SpecWorld, reference: string, address: string) {
    assert.equal(accountOf(this).moveAskedFor(reference)?.toString(), address);
  },
);

Then(
  "no move is asked for as {string}",
  function (this: SpecWorld, reference: string) {
    assert.equal(accountOf(this).moveAskedFor(reference), undefined);
  },
);
