import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  PublicCommentariesOfTournament,
  type PublicCommentaryListed,
  type TournamentCommentariesToRead,
} from "../../../../../src/application/operations/tournaments/PublicCommentariesOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { positionOf } from "../../../../domain/aggregates/tournaments/ordinals.js";
import { inHandOf } from "../aRequest.js";

// What the tournament is answered as is said in the words a tournament's
// games share (GamesOfTournament.steps.ts). What is here is asking, and the
// commentaries answered.

// Asked with nobody signed in.
const ask = async (
  world: SpecWorld,
  website: string,
  address: string,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new PublicCommentariesOfTournament(website, address),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const answered = (world: SpecWorld): TournamentCommentariesToRead => {
  assert.equal(
    world.failure,
    undefined,
    `It was refused: ${inspect(world.failure)}`,
  );
  return world.answer as TournamentCommentariesToRead;
};

const commentaryAnswered = (
  world: SpecWorld,
  title: string,
): PublicCommentaryListed => {
  const { commentaries } = answered(world);
  const found = commentaries.find((commentary) => commentary.title === title);
  assert.ok(
    found !== undefined,
    `No commentary ${title} was answered: ${inspect(commentaries)}`,
  );
  return found;
};

When(
  "the public commentaries of the tournament at {string} are asked for",
  async function (this: SpecWorld, address: string) {
    await ask(this, "croquetscores.com", address);
  },
);

When(
  "the public commentaries of the tournament on {string} at {string} are asked for",
  async function (this: SpecWorld, website: string, address: string) {
    await ask(this, website, address);
  },
);

Then(
  "the {word} commentary answered is {string}",
  function (this: SpecWorld, ordinal: string, title: string) {
    assert.equal(
      answered(this).commentaries[positionOf(ordinal)]?.title,
      title,
    );
  },
);

Then(
  "{int} commentaries are answered",
  function (this: SpecWorld, count: number) {
    assert.equal(answered(this).commentaries.length, count);
  },
);

Then(
  "the commentary {string} is answered as written by {string}",
  function (this: SpecWorld, title: string, writer: string) {
    assert.equal(commentaryAnswered(this, title).writer, writer);
  },
);

Then(
  "the commentary {string} is answered as found at {string}",
  function (this: SpecWorld, title: string, address: string) {
    assert.equal(commentaryAnswered(this, title).address, address);
  },
);
