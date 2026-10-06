import { strict as assert } from "node:assert";

import { CommentId } from "../../../../src/domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import type { Commentary } from "../../../../src/domain/aggregates/tournaments/commentaries/Commentary.js";
import { CommentaryId } from "../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { SpecWorld } from "../../../support/world.js";
import { inHandOf } from "../tournaments/aRequest.js";

// What the steps for each of a commentary's operations share: finding a
// commentary by its title and a comment by what it says, as a scenario names
// them. A module rather than a steps file, so that a feature's steps can use
// it without defining a step twice.

/** A comment, and the tournament and the commentary it was written in. */
export interface CommentWritten {
  readonly id: CommentId;
  readonly tournament: TournamentId;
  readonly commentary: CommentaryId;
}

// Each comment the scenario has had added, by what it said and says now, so
// that one edited or deleted is still found by what it said.
const comments = new WeakMap<SpecWorld, Map<string, CommentWritten>>();

const commentsOf = (world: SpecWorld): Map<string, CommentWritten> => {
  let found = comments.get(world);
  if (found === undefined) {
    found = new Map();
    comments.set(world, found);
  }
  return found;
};

/** That the comment `written` says, or said, `text`. */
export const rememberComment = (
  world: SpecWorld,
  text: string,
  written: CommentWritten,
): void => {
  commentsOf(world).set(text, written);
};

/**
 * The commentary on the tournament `tournament` called `title`, as the read
 * model of its commentaries finds it, and one that names nothing where it has
 * none, or where there is no tournament.
 */
export const commentaryIn = async (
  world: SpecWorld,
  tournament: TournamentId,
  title: string,
): Promise<CommentaryId> => {
  const found = (await inHandOf(world).commentariesOf(tournament)).find(
    (commentary) => commentary.title === title,
  );
  return found === undefined
    ? CommentaryId.create()
    : CommentaryId.from(found.id);
};

/** The commentary `id` as its stream reads now. */
export const loadCommentary = async (
  world: SpecWorld,
  id: CommentaryId,
): Promise<Commentary> => {
  const commentary = await inHandOf(world).loadCommentary(id);
  assert.ok(commentary !== undefined, `${id.value} has no events.`);
  return commentary;
};

/** The comment that says, or said, `text`, and where it was written. */
export const commentWritten = (
  world: SpecWorld,
  text: string,
): CommentWritten => {
  const found = commentsOf(world).get(text);
  assert.ok(found !== undefined, `No comment has said ${text}.`);
  return found;
};

/** The comment that says, or said, `text`. */
export const commentSaying = (world: SpecWorld, text: string): CommentId =>
  commentWritten(world, text).id;

/** A comment id that names nothing. */
export const noComment = (): CommentId => CommentId.create();
