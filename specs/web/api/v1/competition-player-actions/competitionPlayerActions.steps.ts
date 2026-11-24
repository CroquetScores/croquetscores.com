// What is done to a competition's player by asking
// (competitionPlayerActions.feature), asked as the website's page or an app
// asks: a plain request with no body, signed in by a session, a key or
// neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../../site/advantage/apiScene.js";
import { answered, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

const actions: Record<string, string> = {
  "moved up": "up",
  "moved down": "down",
  withdrawn: "withdraw",
  "taken back into the competition": "unwithdraw",
  removed: "remove",
};

const partOf = (id: string): string => id.slice(id.indexOf("/") + 1);

// The tournament, the competition and the player, each by the part of its id
// after its kind.
const addressOf = (
  world: WebWorld,
  player: string,
  competition: string,
  tournament: string,
  action: string,
  api: string,
): string => {
  const competitionId = world.competitions.get(within(tournament, competition));
  assert.ok(competitionId !== undefined, `No competition ${competition}.`);
  const playerId = world.entered.get(
    within(within(tournament, competition), player),
  );
  assert.ok(playerId !== undefined, `${player} was not entered.`);
  return `${api}/tournaments/${bare(world, tournament)}/competitions/${partOf(competitionId)}/players/${partOf(playerId)}/${action}`;
};

const done =
  "moved up|moved down|withdrawn|taken back into the competition|removed";

When(
  new RegExp(`^the player "([^"]*)" in "([^"]*)" of "([^"]*)" is (${done})$`),
  async function (
    this: WebWorld,
    player: string,
    competition: string,
    tournament: string,
    what: string,
  ) {
    await told(
      this,
      "POST",
      addressOf(
        this,
        player,
        competition,
        tournament,
        actions[what]!,
        "/api/v1",
      ),
    );
  },
);

When(
  new RegExp(
    `^the player "([^"]*)" in "([^"]*)" of "([^"]*)" is (${done}) at the address it was at$`,
  ),
  async function (
    this: WebWorld,
    player: string,
    competition: string,
    tournament: string,
    what: string,
  ) {
    await told(
      this,
      "POST",
      addressOf(
        this,
        player,
        competition,
        tournament,
        actions[what]!,
        "/api/site",
      ),
    );
  },
);

// The same, with the order of a bye said in the address as it was typed, which
// is how a caller sends one that is not a number.
When(
  new RegExp(
    `^the player "([^"]*)" in "([^"]*)" of "([^"]*)" is (${done}) with the order "([^"]*)"$`,
  ),
  async function (
    this: WebWorld,
    player: string,
    competition: string,
    tournament: string,
    what: string,
    order: string,
  ) {
    await told(
      this,
      "POST",
      `${addressOf(this, player, competition, tournament, actions[what]!, "/api/v1")}?order=${encodeURIComponent(order)}`,
    );
  },
);

// What the website's own page lists of a competition's players, which is how a
// manager sees them.
const listedPlayers = (
  world: WebWorld,
): { name: string; withdrawn: boolean }[] =>
  answered(world).body["players"] as { name: string; withdrawn: boolean }[];

Then(
  /^the site lists "([^"]*)" as (withdrawn|not withdrawn)$/,
  function (this: WebWorld, name: string, state: string) {
    const found = listedPlayers(this).find((each) => each.name === name);
    assert.ok(found !== undefined, `${name} is not listed.`);
    assert.equal(found.withdrawn, state === "withdrawn");
  },
);

Then("the site lists one player", function (this: WebWorld) {
  assert.equal(listedPlayers(this).length, 1);
});

Then("the site lists {int} players", function (this: WebWorld, count: number) {
  assert.equal(listedPlayers(this).length, count);
});
