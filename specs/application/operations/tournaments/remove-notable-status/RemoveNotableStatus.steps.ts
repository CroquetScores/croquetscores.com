// Removing a tournament's national or international status
// (RemoveNotableStatus.feature, notableTournament.feature), through the
// mediator "the application's tournaments" stands up. What the managers were
// emailed is read as the email is written, since what it says is the writer's.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { RemoveNotableStatus } from "../../../../../src/application/operations/tournaments/RemoveNotableStatus.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  load,
  momentOf,
  noTournament,
  send,
  tournamentNamed,
} from "../aRequest.js";

When(
  "the reader signed in to the account for {string} removes the notable status of the tournament {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const id = tournamentNamed(this, name);
    await send(
      this,
      new RemoveNotableStatus(
        (await accountFor(this, address)).value,
        id.value,
        momentOf(this),
      ),
      id,
    );
  },
);

When(
  "the reader signed in to the account for {string} removes the notable status of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const id = noTournament();
    await send(
      this,
      new RemoveNotableStatus(
        (await accountFor(this, address)).value,
        id.value,
        momentOf(this),
      ),
      undefined,
    );
  },
);

Then(
  /^the kept tournament "(.*)" is (not )?(national|international)$/,
  async function (
    this: SpecWorld,
    name: string,
    not: string | null,
    level: string,
  ) {
    const kept = await load(this, tournamentNamed(this, name));
    const is = level === "national" ? kept.national : kept.international;
    assert.equal(is, not === null);
  },
);

const writtenTo = (world: SpecWorld, address: string): Promise<string> => {
  assert.ok(world.registering !== undefined, "Registering is not stood up.");
  return world.registering.writtenFor(address);
};

// The level as the email says it, with the article the words before it use.
Then(
  /^the email queued for "(.*)" says it was classified as (a national|an international)-level event$/,
  async function (this: SpecWorld, address: string, level: string) {
    const written = await writtenTo(this, address);
    assert.ok(
      written.includes(`classified it as ${level}-level event`),
      `The email does not say it was classified as ${level}-level.`,
    );
  },
);

Then(
  /^the email queued for "(.*)" explains what (national|international)-level events are for$/,
  async function (this: SpecWorld, address: string, level: string) {
    const written = await writtenTo(this, address);
    const said = `${level === "national" ? "National" : "International"}-level events are intended for`;
    assert.ok(written.includes(said), `The email does not say "${said}".`);
  },
);
