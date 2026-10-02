import { strict as assert } from "node:assert";

import type { SpecWorld } from "../../../../support/world.js";

// What a list of teams answers that the steps of more than one list read: the
// teams of a tournament (`TeamsOfTournament.feature`) and those of a test
// (`PlayersOfTest.feature`) are each answered with a name and a short name. A
// module rather than a steps file, so that each list's steps can use it
// without defining a step twice.

interface Answered {
  readonly name: string;
  readonly shortName: string;
}

/** The teams answered, once the list was not refused. */
export const teamsAnswered = (world: SpecWorld): readonly Answered[] => {
  assert.equal(
    world.failure,
    undefined,
    `The list was refused: ${String(world.failure)}`,
  );
  return world.answer as readonly Answered[];
};

/** The team answered called `name`. */
export const teamAnswered = (world: SpecWorld, name: string): Answered => {
  const found = teamsAnswered(world).find((team) => team.name === name);
  assert.ok(
    found !== undefined,
    `The teams answered are ${JSON.stringify(teamsAnswered(world).map((team) => team.name))}.`,
  );
  return found;
};
