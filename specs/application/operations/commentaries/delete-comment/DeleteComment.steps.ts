import { When } from "@cucumber/cucumber";

import { DeleteComment } from "../../../../../src/application/operations/commentaries/DeleteComment.js";
import type { CommentId } from "../../../../../src/domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
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
  commentSaying,
  noComment,
} from "../commentaryRequests.js";

// The account for an address, or the one the scenario took hold of where it
// names none, as "the reader signed in to that account" does.
const READER = String.raw`^the reader signed in to (?:the account for "([^"]*)"|that account)`;

const remove = async (
  world: SpecWorld,
  address: string | undefined,
  tournament: TournamentId,
  commentary: CommentaryId,
  comment: CommentId,
): Promise<void> => {
  const account = await readerOf(world, address ?? undefined);
  await send(
    world,
    new DeleteComment(
      account,
      tournament.value,
      commentary.value,
      comment.value,
      momentOf(world),
    ),
    tournament,
  );
};

When(
  new RegExp(
    `${READER} deletes the comment "([^"]*)" in "([^"]*)" of "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    text: string,
    title: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await remove(
      this,
      address,
      tournament,
      await commentaryIn(this, tournament, title),
      commentSaying(this, text),
    );
  },
);

When(
  new RegExp(
    `${READER} deletes a comment in "([^"]*)" of "([^"]*)" there is not$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    title: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await remove(
      this,
      address,
      tournament,
      await commentaryIn(this, tournament, title),
      noComment(),
    );
  },
);

When(
  new RegExp(
    `${READER} deletes a comment in a commentary of "([^"]*)" there is not$`,
  ),
  async function (this: SpecWorld, address: string | undefined, name: string) {
    await remove(
      this,
      address,
      tournamentNamed(this, name),
      CommentaryId.create(),
      noComment(),
    );
  },
);

When(
  new RegExp(
    `${READER} deletes a comment in a commentary of a tournament there is not$`,
  ),
  async function (this: SpecWorld, address: string | undefined) {
    await remove(
      this,
      address,
      noTournament(),
      CommentaryId.create(),
      noComment(),
    );
  },
);
