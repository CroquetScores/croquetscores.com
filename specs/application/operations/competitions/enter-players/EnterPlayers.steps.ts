import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";

import { EnterPlayers } from "../../../../../src/application/operations/competitions/EnterPlayers.js";
import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { BrokenRule } from "../../../../../src/domain/common/validation/Validator.js";
import { playerNamed } from "../../../../domain/aggregates/tournaments/tournament/aTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  inHandOf,
  momentOf,
  send,
  tournamentNamed,
} from "../../tournaments/aRequest.js";
import { competitionIn } from "../../tournaments/requests.js";

// What a scenario has listed so far, as it was said. A name is looked up in
// the tournament when the list is sent, since the tournament is named there
// and not where the players are listed.
type Listed =
  | { readonly kind: "named"; readonly name: string }
  | { readonly kind: "unknown" }
  | { readonly kind: "made up" };

const listed = new WeakMap<SpecWorld, Listed[]>();

const listOf = (world: SpecWorld): Listed[] => {
  const found = listed.get(world) ?? [];
  listed.set(world, found);
  return found;
};

Given(
  "the player {string} is to be entered",
  function (this: SpecWorld, name: string) {
    listOf(this).push({ kind: "named", name });
  },
);

Given(
  "a player the tournament does not have is to be entered",
  function (this: SpecWorld) {
    listOf(this).push({ kind: "unknown" });
  },
);

Given(
  "{int} players are to be entered",
  function (this: SpecWorld, count: number) {
    for (let each = 0; each < count; each += 1) {
      listOf(this).push({ kind: "made up" });
    }
  },
);

const idOf = async (
  world: SpecWorld,
  tournament: TournamentId,
  player: Listed,
): Promise<string> => {
  if (player.kind !== "named") {
    return `tournament-player/${randomUUID()}`;
  }
  const found = await inHandOf(world).load(tournament);
  assert.ok(found !== undefined, "The tournament is not there.");
  return playerNamed(found, player.name).id.value;
};

const entering = async (
  world: SpecWorld,
  address: string,
  name: string,
  competition: string,
  enterWhatCan: boolean,
): Promise<void> => {
  const tournament = tournamentNamed(world, name);
  const account = (await accountFor(world, address)).value;
  const competitionId = await competitionIn(world, tournament, competition);
  const players = await Promise.all(
    listOf(world).map((each) => idOf(world, tournament, each)),
  );
  await send(
    world,
    new EnterPlayers(
      account,
      tournament.value,
      competitionId.value,
      players,
      enterWhatCan,
      momentOf(world),
    ),
    tournament,
  );
};

When(
  "the reader signed in to the account for {string} enters the players to be entered in {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
  ) {
    await entering(this, address, name, competition, false);
  },
);

When(
  "the reader signed in to the account for {string} enters what can be entered of the players to be entered in {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
  ) {
    await entering(this, address, name, competition, true);
  },
);

// The paths are the command's own and stay here, out of the feature, which
// says which player was listed, counting from 1.
Then(
  "that rule is about the player to be entered {int}",
  function (this: SpecWorld, place: number) {
    const rule: BrokenRule | undefined =
      this.brokenRules?.[this.brokenRulesChecked - 1];
    assert.ok(rule !== undefined, "No rule broken has been named yet.");
    assert.deepEqual(rule.fields, [`players.${String(place - 1)}`]);
  },
);
