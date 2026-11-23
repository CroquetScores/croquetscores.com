// What is done to a competition's game by asking
// (competitionGameActions.feature), asked as the website's page or an app asks:
// a plain request with no body, signed in by a session, a key or neither, as
// the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import {
  gameAt,
  gamesListed,
} from "../competition-games/competitionGames.steps.js";
import { told } from "../apiOfApps.js";

const actions: Record<string, string> = {
  "moved up": "up",
  "moved down": "down",
  archived: "archive",
  restored: "restore",
  withdrawn: "withdraw",
  "taken back into the competition": "unwithdraw",
};

const done =
  "moved up|moved down|archived|restored|withdrawn|taken back into the competition";

When(
  new RegExp(
    `^the game of "([^"]*)" beating "([^"]*)" in "([^"]*)" of "([^"]*)" is (${done})$`,
  ),
  async function (
    this: WebWorld,
    winner: string,
    loser: string,
    competition: string,
    tournament: string,
    what: string,
  ) {
    await told(
      this,
      "POST",
      `${gameAt(this, winner, loser, competition, tournament, "/api/v0")}/${actions[what]!}`,
    );
  },
);

When(
  new RegExp(
    `^the game of "([^"]*)" beating "([^"]*)" in "([^"]*)" of "([^"]*)" is (${done}) at the address it was at$`,
  ),
  async function (
    this: WebWorld,
    winner: string,
    loser: string,
    competition: string,
    tournament: string,
    what: string,
  ) {
    await told(
      this,
      "POST",
      `${gameAt(this, winner, loser, competition, tournament, "/api/site")}/${actions[what]!}`,
    );
  },
);

Then(
  /^the site lists the game as (archived|not archived|withdrawn|not withdrawn)$/,
  function (this: WebWorld, state: string) {
    const [game] = gamesListed(this);
    const field = state.endsWith("archived") ? "archived" : "withdrawn";
    assert.equal(game?.[field], !state.startsWith("not "));
  },
);
