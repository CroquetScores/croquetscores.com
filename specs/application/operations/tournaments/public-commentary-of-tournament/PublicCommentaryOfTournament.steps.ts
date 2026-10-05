import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import {
  type PublicComment,
  PublicCommentaryOfTournament,
  type TournamentCommentaryToRead,
} from "../../../../../src/application/operations/tournaments/PublicCommentaryOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import { positionOf } from "../../../../domain/aggregates/tournaments/ordinals.js";
import { accountFor, inHandOf } from "../aRequest.js";

// What the tournament is answered as is said in the words a tournament's
// games share (GamesOfTournament.steps.ts). What is here is asking, and the
// commentary answered.

const ask = async (
  world: SpecWorld,
  website: string,
  address: string,
  slug: string,
  account?: string,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new PublicCommentaryOfTournament(website, address, slug, account),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const answered = (
  world: SpecWorld,
): TournamentCommentaryToRead["commentary"] => {
  assert.equal(
    world.failure,
    undefined,
    `It was refused: ${inspect(world.failure)}`,
  );
  return (world.answer as TournamentCommentaryToRead).commentary;
};

const commentAnswered = (world: SpecWorld, text: string): PublicComment => {
  const { comments } = answered(world);
  const found = comments.find((comment) => comment.text === text);
  assert.ok(
    found !== undefined,
    `No comment ${text} was answered: ${inspect(comments)}`,
  );
  return found;
};

When(
  "the public commentary {string} of the tournament at {string} is asked for",
  async function (this: SpecWorld, slug: string, address: string) {
    await ask(this, "croquetscores.com", address, slug);
  },
);

When(
  "the public commentary {string} of the tournament on {string} at {string} is asked for",
  async function (
    this: SpecWorld,
    slug: string,
    website: string,
    address: string,
  ) {
    await ask(this, website, address, slug);
  },
);

When(
  "the reader signed in to the account for {string} asks for the public commentary {string} of the tournament at {string}",
  async function (
    this: SpecWorld,
    reader: string,
    slug: string,
    address: string,
  ) {
    const account = (await accountFor(this, reader)).value;
    await ask(this, "croquetscores.com", address, slug, account);
  },
);

Then(
  "the commentary answered is titled {string}",
  function (this: SpecWorld, title: string) {
    assert.equal(answered(this).title, title);
  },
);

Then(
  "the commentary answered is written by {string}",
  function (this: SpecWorld, writer: string) {
    assert.equal(answered(this).writer, writer);
  },
);

Then(
  "the commentary answered is found at {string}",
  function (this: SpecWorld, address: string) {
    assert.equal(answered(this).address, address);
  },
);

Then(
  "the commentary answered is written by the reader asking",
  function (this: SpecWorld) {
    assert.equal(answered(this).writtenByReader, true);
  },
);

Then(
  "the commentary answered is not written by the reader asking",
  function (this: SpecWorld) {
    assert.equal(answered(this).writtenByReader, false);
  },
);

Then("{int} comments are answered", function (this: SpecWorld, count: number) {
  assert.equal(answered(this).comments.length, count);
});

Then(
  "the {word} comment answered is {string}",
  function (this: SpecWorld, ordinal: string, text: string) {
    assert.equal(answered(this).comments[positionOf(ordinal)]?.text, text);
  },
);

Then(
  "the comment {string} is answered as written at {string}",
  function (this: SpecWorld, text: string, moment: string) {
    assert.equal(
      commentAnswered(this, text).writtenAt,
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "the comment {string} is answered as not edited",
  function (this: SpecWorld, text: string) {
    assert.equal(commentAnswered(this, text).lastEditedAt, undefined);
  },
);

Then(
  "the comment {string} is answered as last edited at {string}",
  function (this: SpecWorld, text: string, moment: string) {
    assert.equal(
      commentAnswered(this, text).lastEditedAt,
      new Date(moment).toISOString(),
    );
  },
);
