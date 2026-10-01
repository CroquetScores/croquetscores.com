import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import { noTournament, tournamentNamed } from "../aRequest.js";
import { addTest, readerOf } from "../teamRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

When(
  new RegExp(
    `${READER} adds the test between "([^"]*)" and "([^"]*)" to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    first: string,
    second: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await addTest(this, account, tournamentNamed(this, name), first, second);
  },
);

When(
  new RegExp(
    `${READER} adds a test with no first team against "([^"]*)" to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    second: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await addTest(
      this,
      account,
      tournamentNamed(this, name),
      undefined,
      second,
    );
  },
);

When(
  new RegExp(
    `${READER} adds a test between "([^"]*)" and no second team to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    first: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await addTest(this, account, tournamentNamed(this, name), first, undefined);
  },
);

When(
  new RegExp(
    `${READER} adds the test between "([^"]*)" and "([^"]*)" to a tournament there is not$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    first: string,
    second: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await addTest(this, account, noTournament(), first, second);
  },
);
