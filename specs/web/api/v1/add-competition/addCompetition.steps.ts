// A competition added through the API (addCompetition.feature), asked as the
// website's dialog or an app asks: a plain request, signed in by a session, a
// key or neither, as the scenario chose.
import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WebWorld } from "../../../support/world.js";
import { answered, told } from "../apiOfApps.js";
import { bare } from "../permissions/permissions.steps.js";
import { within } from "../../site/advantage/apiScene.js";

type Kind = "block" | "Swiss" | "knockout";

// What each kind is when the scenario says nothing else of its shape, which
// is what the competition dialog sends for the smallest of each.
const shapeOf = (kind: Kind): Record<string, unknown> =>
  kind === "knockout"
    ? { kind: "knockout", places: 4, rounds: [1, 1] }
    : kind === "Swiss"
      ? { kind: "swiss", bestOf: 1 }
      : { kind: "block", bestOf: 1, rounds: 1 };

const competitionsOf = (world: WebWorld, tournament: string): string =>
  `/api/v1/tournaments/${bare(world, tournament)}/competitions`;

When(
  /^the (block|Swiss|knockout) "([^"]*)" is added to "([^"]*)"$/,
  async function (
    this: WebWorld,
    kind: Kind,
    name: string,
    tournament: string,
  ) {
    const answer = await told(this, "POST", competitionsOf(this, tournament), {
      name,
      ...shapeOf(kind),
    });
    // Known by its name within its tournament, as the competitions a scenario
    // says are already there are, so that what asks about it can name it.
    if (answer.status === 201) {
      this.competitions.set(
        within(tournament, name),
        String(answer.body["id"]),
      );
      this.lastTournament = tournament;
    }
  },
);

When(
  /^the (block|Swiss|knockout) "([^"]*)" is added to "([^"]*)" at the address it was at$/,
  async function (
    this: WebWorld,
    kind: Kind,
    name: string,
    tournament: string,
  ) {
    await told(
      this,
      "POST",
      `/api/site/tournaments/${bare(this, tournament)}/competitions`,
      { name, ...shapeOf(kind) },
    );
  },
);

Then("the API says the id of the competition", function (this: WebWorld) {
  assert.match(String(answered(this).body["id"]), /^competition\//);
});
