import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { Commentary } from "../../../../../../src/domain/aggregates/tournaments/commentaries/Commentary.js";
import { CommentId } from "../../../../../../src/domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import { CommentaryId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import type { SpecWorld } from "../../../../../support/world.js";

// What the steps for each of a commentary's features share: the stream a
// scenario says the commentary already has, the comments it names, and the
// commentary rebuilt from the stream, which is what the scenario asks things
// of. A module rather than a steps file, so that a feature's steps can use it
// without defining a step twice. Who asks and when are the tournament's
// steps', as they are for a competition.

interface Scenario {
  // The id the scenario says, which a commentary started, by the tournament
  // or on its own, is started as. One is made where it says none.
  commentaryId: string | undefined;
  // The tournament it is started on, where the scenario says one.
  tournamentId: string | undefined;
  // What the tournament's other commentaries have taken, as the scenario says.
  readonly titles: string[];
  readonly slugs: string[];
  readonly stream: DomainEvent[];
  // The id the next comment is added as, where the scenario says one.
  commentId: string | undefined;
  // Each comment the scenario names, by what it says, edited or not, so that
  // a comment edited or deleted is still found by what it said.
  readonly comments: Map<string, CommentId>;
}

const scenarios = new WeakMap<SpecWorld, Scenario>();

export const commentaryScenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      commentaryId: undefined,
      tournamentId: undefined,
      titles: [],
      slugs: [],
      stream: [],
      commentId: undefined,
      comments: new Map(),
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

// The commentary's id, the one the scenario said when it said one, and the
// same one every time it is asked.
export const commentaryIdOf = (world: SpecWorld): CommentaryId => {
  const scenario = commentaryScenarioOf(world);
  scenario.commentaryId ??= CommentaryId.create().value;
  return CommentaryId.from(scenario.commentaryId);
};

// The id the next comment is added as: the one the scenario said, once, or a
// new one.
export const nextCommentIdOf = (world: SpecWorld): CommentId => {
  const scenario = commentaryScenarioOf(world);
  const said = scenario.commentId;
  scenario.commentId = undefined;
  return said === undefined ? CommentId.create() : CommentId.from(said);
};

/** The comment that said `text`, now or before it was edited. */
export const commentSaying = (world: SpecWorld, text: string): CommentId => {
  const found = commentaryScenarioOf(world).comments.get(text);
  assert.ok(found !== undefined, `No comment has said ${text}.`);
  return found;
};

const rebuilt = (world: SpecWorld): Commentary =>
  Commentary.rebuiltFrom(
    commentaryIdOf(world),
    commentaryScenarioOf(world).stream,
  );

/** The commentary rebuilt from the stream, which the scenario looks at next. */
export const rebuild = (world: SpecWorld): void => {
  world.aggregate = rebuilt(world);
};

/**
 * That `happening` happened to the commentary after everything the stream
 * holds already: done to the commentary the stream leaves, so that it records
 * what a commentary would have.
 */
export const happened = (
  world: SpecWorld,
  happening: (commentary: Commentary) => void,
): void => {
  const commentary = rebuilt(world);
  happening(commentary);
  commentaryScenarioOf(world).stream.push(...commentary.handOver());
};

export const commentaryOf = (world: SpecWorld): Commentary => {
  assert.ok(
    world.aggregate instanceof Commentary,
    `There is no commentary: ${inspect(world.failure)}`,
  );
  return world.aggregate;
};

// Asking a commentary something may be refused, and the scenario says whether
// it expects that, so a refusal is kept rather than thrown.
export const ask = (
  world: SpecWorld,
  asking: (commentary: Commentary) => void,
): void => {
  const commentary = commentaryOf(world);
  try {
    asking(commentary);
  } catch (failure) {
    world.failure = failure;
  }
};
