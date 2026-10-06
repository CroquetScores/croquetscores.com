import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AddComment } from "../../../../../src/application/operations/commentaries/AddComment.js";
import { CommentId } from "../../../../../src/domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import { CommentaryId } from "../../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  momentOf,
  noTournament,
  send,
  tournamentNamed,
} from "../../tournaments/aRequest.js";
import { readerOf } from "../../tournaments/teamRequests.js";
import {
  commentaryIn,
  loadCommentary,
  rememberComment,
} from "../commentaryRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

const add = async (
  world: SpecWorld,
  address: string | undefined,
  tournament: TournamentId,
  commentary: CommentaryId,
  text: string,
): Promise<void> => {
  const account = await readerOf(world, address ?? undefined);
  await send(
    world,
    new AddComment(
      account,
      tournament.value,
      commentary.value,
      text,
      momentOf(world),
    ),
    tournament,
  );
  if (world.answer instanceof CommentId) {
    rememberComment(world, text, { id: world.answer, tournament, commentary });
  }
};

When(
  new RegExp(`${READER} adds the comment "([^"]*)" to "([^"]*)" of "([^"]*)"$`),
  async function (
    this: SpecWorld,
    address: string | undefined,
    text: string,
    title: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await add(
      this,
      address,
      tournament,
      await commentaryIn(this, tournament, title),
      text,
    );
  },
);

When(
  new RegExp(
    `${READER} adds a comment of (\\d+) characters to "([^"]*)" of "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    length: string,
    title: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await add(
      this,
      address,
      tournament,
      await commentaryIn(this, tournament, title),
      "a".repeat(Number(length)),
    );
  },
);

// Another tournament's commentary, by its id, asked to be written in as one of
// the tournament named.
When(
  new RegExp(
    `${READER} adds the comment "([^"]*)" to "([^"]*)" of "([^"]*)" as a commentary of "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    text: string,
    title: string,
    of: string,
    as: string,
  ) {
    await add(
      this,
      address,
      tournamentNamed(this, as),
      await commentaryIn(this, tournamentNamed(this, of), title),
      text,
    );
  },
);

When(
  new RegExp(
    `${READER} adds the comment "([^"]*)" to a commentary of "([^"]*)" there is not$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    text: string,
    name: string,
  ) {
    await add(
      this,
      address,
      tournamentNamed(this, name),
      CommentaryId.create(),
      text,
    );
  },
);

When(
  new RegExp(
    `${READER} adds the comment "([^"]*)" to a commentary of a tournament there is not$`,
  ),
  async function (this: SpecWorld, address: string | undefined, text: string) {
    await add(this, address, noTournament(), CommentaryId.create(), text);
  },
);

Then(
  "it is answered with the id of the comment {string} in {string} of {string}",
  async function (this: SpecWorld, text: string, title: string, name: string) {
    assert.ok(
      this.answer instanceof CommentId,
      `It was answered with ${inspect(this.answer)}: ${inspect(this.failure)}`,
    );
    const commentary = await loadCommentary(
      this,
      await commentaryIn(this, tournamentNamed(this, name), title),
    );
    const found = commentary.comments.find(
      (comment) => comment.text.toString() === text,
    );
    assert.ok(found !== undefined, `It has no comment ${text}.`);
    assert.ok(this.answer.equals(found.id));
  },
);
