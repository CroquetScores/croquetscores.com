import { When } from "@cucumber/cucumber";

import type { SpecWorld } from "../../../../support/world.js";
import { noTournament, tournamentNamed } from "../aRequest.js";
import { updateTest, readerOf } from "../teamRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

When(
  new RegExp(`${READER} updates the test "([^"]*)" in "([^"]*)"$`),
  async function (
    this: SpecWorld,
    address: string | undefined,
    test: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await updateTest(this, account, tournamentNamed(this, name), test);
  },
);

When(
  new RegExp(
    `${READER} updates the test "([^"]*)" in "([^"]*)" to have no second team$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    test: string,
    name: string,
  ) {
    const account = await readerOf(this, address ?? undefined);
    await updateTest(this, account, tournamentNamed(this, name), test, {
      withoutSecondTeam: true,
    });
  },
);

When(
  new RegExp(`${READER} updates a test "([^"]*)" does not have$`),
  async function (this: SpecWorld, address: string | undefined, name: string) {
    const account = await readerOf(this, address ?? undefined);
    await updateTest(this, account, tournamentNamed(this, name), undefined);
  },
);

When(
  new RegExp(
    `${READER} updates the test "([^"]*)" in a tournament there is not$`,
  ),
  async function (this: SpecWorld, address: string | undefined, test: string) {
    const account = await readerOf(this, address ?? undefined);
    await updateTest(this, account, noTournament(), test);
  },
);
