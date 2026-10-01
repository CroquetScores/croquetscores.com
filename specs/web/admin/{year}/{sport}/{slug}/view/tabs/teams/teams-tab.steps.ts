import { Given, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { UpdateTeam } from "../../../../../../../../../src/application/operations/tournaments/UpdateTeam.js";
import {
  accountFor,
  inHandOf,
  load,
  momentOf,
  tournamentNamed,
} from "../../../../../../../../application/operations/tournaments/aRequest.js";
import type { SpecWorld } from "../../../../../../../../support/world.js";
import { openTab } from "../../../../../../../support/tournamentPage.js";

// A tournament's Teams tab (teams-tab.feature). Its rows are drawn as the
// Players tab's are, so the steps that read them are that tab's
// (players-tab.steps.ts); these are what it adds.

When(
  /^the teams of "([^"]*)" are open(?:ed)?$/,
  async function (this: SpecWorld, name: string) {
    await openTab(this, name, "teams");
  },
);

// What the team is now, said again with the short name changed, as updating
// one says everything it is.
Given(
  "{string} has given the team {string} of {string} the short name {string}",
  async function (
    this: SpecWorld,
    address: string,
    team: string,
    name: string,
    shortName: string,
  ) {
    const tournament = await load(this, tournamentNamed(this, name));
    const found = tournament.teams.find(
      (each) => each.name.toString() === team,
    );
    assert.ok(found !== undefined, `${name} has no team ${team}.`);
    await inHandOf(this).send(
      new UpdateTeam(
        (await accountFor(this, address)).value,
        tournament.id.value,
        found.id.value,
        {
          name: found.name.toString(),
          shortName,
          ...(found.flag === undefined ? {} : { flag: String(found.flag) }),
        },
        momentOf(this),
      ),
    );
  },
);
