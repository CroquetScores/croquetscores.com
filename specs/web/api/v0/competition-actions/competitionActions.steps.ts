// What is done to a competition by asking (competitionActions.feature), asked
// as the website's page or an app asks: a plain request with no body, signed
// in by a session, a key or neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { within } from "../../site/advantage/apiScene.js";
import { answered, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";

const actions: Record<string, string> = {
  "moved up": "up",
  "moved down": "down",
  archived: "archive",
  restored: "restore",
};

// The tournament and the competition, each by the part of its id after its
// kind.
const addressOf = (
  world: WebWorld,
  competition: string,
  tournament: string,
  action: string,
  api: string,
): string => {
  const id = world.competitions.get(within(tournament, competition));
  assert.ok(id !== undefined, `No competition called ${competition}.`);
  return `${api}/tournaments/${bare(world, tournament)}/competitions/${id.slice(id.indexOf("/") + 1)}/${action}`;
};

When(
  /^the competition "([^"]*)" of "([^"]*)" is (moved up|moved down|archived|restored)$/,
  async function (
    this: WebWorld,
    competition: string,
    tournament: string,
    done: string,
  ) {
    await told(
      this,
      "POST",
      addressOf(this, competition, tournament, actions[done]!, "/api/v0"),
    );
  },
);

When(
  /^the competition "([^"]*)" of "([^"]*)" is (moved up|moved down|archived|restored) at the address it was at$/,
  async function (
    this: WebWorld,
    competition: string,
    tournament: string,
    done: string,
  ) {
    await told(
      this,
      "POST",
      addressOf(this, competition, tournament, actions[done]!, "/api/site"),
    );
  },
);

const competitionsRead = (world: WebWorld): { name: string }[] => {
  const found = answered(world).body["competitions"];
  assert.ok(Array.isArray(found), "The tournament read lists no competitions.");
  return found as { name: string }[];
};

Then(
  /^the (first|second) competition read is "([^"]*)"$/,
  function (this: WebWorld, place: string, name: string) {
    assert.equal(competitionsRead(this)[place === "first" ? 0 : 1]?.name, name);
  },
);
