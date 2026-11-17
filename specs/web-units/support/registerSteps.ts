// A reader at the register page, in a real browser.
//
// The page is guarded by reCAPTCHA, so these scenarios run with scripting on
// and with a check of their own standing in for Google: the token the real
// script would fill in is typed into the form instead, and what the scenario's
// check makes of a reader is what the scenario said.
import { Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { SpecWorld } from "../../support/world.js";
import { applicationFor } from "./browser.js";

// What the reader is told -----------------------------------------------------------------

// What was kept ------------------------------------------------------------------------------

const accountsFor = async (
  world: SpecWorld,
  address: string,
): Promise<number> => {
  const application = applicationFor(world);
  const found = await application.unitOfWork.inTransaction(() =>
    application.accountsByEmailAddress.find(EmailAddress.from(address)),
  );
  return found === undefined ? 0 : 1;
};

Then(
  "{string} has no account",
  async function (this: SpecWorld, address: string) {
    // An address that breaks its own rules never had an account and cannot be
    // looked for at all: what this asks is that nothing was recorded for what
    // was typed, and an address nothing could have recorded answers it.
    let counted: number;
    try {
      counted = await accountsFor(this, address);
    } catch {
      counted = 0;
    }
    assert.equal(counted, 0);
  },
);
