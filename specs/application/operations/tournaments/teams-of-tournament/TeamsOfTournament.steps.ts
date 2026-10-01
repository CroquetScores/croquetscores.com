import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  type ListedTeam,
  TeamsOfTournament,
} from "../../../../../src/application/operations/tournaments/TeamsOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { ask, noTournament, tournamentNamed } from "../aRequest.js";
import { readerOf } from "../teamRequests.js";
import { teamAnswered } from "./teamsAnswered.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

When(
  new RegExp(`${READER} lists the teams of "([^"]*)"$`),
  async function (this: SpecWorld, address: string | undefined, name: string) {
    await ask(
      this,
      new TeamsOfTournament(
        await readerOf(this, address ?? undefined),
        tournamentNamed(this, name).value,
      ),
    );
  },
);

When(
  new RegExp(`${READER} lists the teams of a tournament there is not$`),
  async function (this: SpecWorld, address: string | undefined) {
    await ask(
      this,
      new TeamsOfTournament(
        await readerOf(this, address ?? undefined),
        noTournament().value,
      ),
    );
  },
);

const listedTeam = (world: SpecWorld, name: string): ListedTeam =>
  teamAnswered(world, name) as ListedTeam;

Then(
  "the team {string} is answered flying the flag {string}",
  function (this: SpecWorld, name: string, flag: string) {
    assert.equal(listedTeam(this, name).flag, flag);
  },
);

Then(
  "the team {string} is answered flying no flag",
  function (this: SpecWorld, name: string) {
    assert.equal(listedTeam(this, name).flag, undefined);
  },
);

Then(
  "the team {string} is answered with the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(listedTeam(this, name).slug, slug);
  },
);

Then(
  /^the team "([^"]*)" is answered as (not )?archived$/,
  function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(listedTeam(this, name).archived, not === null);
  },
);

Then(
  /^the team "([^"]*)" is answered as in (a|no) test$/,
  function (this: SpecWorld, name: string, which: string) {
    assert.equal(listedTeam(this, name).inATest, which === "a");
  },
);
