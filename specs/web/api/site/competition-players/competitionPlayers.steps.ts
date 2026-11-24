// Several players entered in a competition through the website's own interface
// (competitionPlayers.feature), asked as the Add Players dialog asks: a plain
// request with the session the manager holds.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../advantage/apiScene.js";
import { answered, told } from "../../v1/apiOfApps.js";
import { bare } from "../../v1/permissions/permissions.steps.js";

const partOf = (id: string): string => id.slice(id.indexOf("/") + 1);

// The players the scenario has chosen so far, kept beside the world rather
// than on it, which every scenario in specs/web shares.
const chosen = new WeakMap<WebWorld, string[]>();

Given(
  "the player {string} is chosen",
  function (this: WebWorld, player: string) {
    chosen.set(this, [...(chosen.get(this) ?? []), player]);
  },
);

When(
  "the chosen players are put into {string} of {string} from the website",
  async function (this: WebWorld, competition: string, tournament: string) {
    const competitionId = this.competitions.get(
      within(tournament, competition),
    );
    assert.ok(
      competitionId !== undefined,
      `No competition called ${competition}.`,
    );
    const players = (chosen.get(this) ?? []).map((name) => {
      const id = this.players.get(within(tournament, name));
      assert.ok(id !== undefined, `No player called ${name} in ${tournament}.`);
      return partOf(id);
    });
    await told(
      this,
      "POST",
      `/api/site/tournaments/${bare(this, tournament)}/competitions/${partOf(competitionId)}/players/many`,
      { players },
    );
  },
);

Then(
  "the API says the ids of two players in the competition",
  function (this: WebWorld) {
    const { ids } = answered(this).body;
    assert.ok(Array.isArray(ids) && ids.length === 2);
  },
);
