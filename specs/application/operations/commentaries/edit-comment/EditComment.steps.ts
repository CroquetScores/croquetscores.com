import { When } from "@cucumber/cucumber";

import { EditComment } from "../../../../../src/application/operations/commentaries/EditComment.js";
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

const edit = async (
  world: SpecWorld,
  address: string | undefined,
  tournament: TournamentId,
  commentary: CommentaryId,
  comment: CommentId,
  text: string,
): Promise<void> => {
  const account = await readerOf(world, address ?? undefined);
  await send(
    world,
    new EditComment(
      account,
      tournament.value,
      commentary.value,
      comment.value,
      text,
      momentOf(world),
    ),
    tournament,
  );
};

When(
  new RegExp(
    `${READER} edits the comment "([^"]*)" in "([^"]*)" of "([^"]*)" to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    text: string,
    title: string,
    name: string,
    edited: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await edit(
      this,
      address,
      tournament,
      await commentaryIn(this, tournament, title),
      commentSaying(this, text),
      edited,
    );
  },
);

When(
  new RegExp(
    `${READER} edits a comment in "([^"]*)" of "([^"]*)" there is not to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    title: string,
    name: string,
    edited: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await edit(
      this,
      address,
      tournament,
      await commentaryIn(this, tournament, title),
      noComment(),
      edited,
    );
  },
);

When(
  new RegExp(
    `${READER} edits a comment in a commentary of "([^"]*)" there is not to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    name: string,
    edited: string,
  ) {
    await edit(
      this,
      address,
      tournamentNamed(this, name),
      CommentaryId.create(),
      noComment(),
      edited,
    );
  },
);

When(
  new RegExp(
    `${READER} edits a comment in a commentary of a tournament there is not to "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string | undefined,
    edited: string,
  ) {
    await edit(
      this,
      address,
      noTournament(),
      CommentaryId.create(),
      noComment(),
      edited,
    );
  },
);
