import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { Comment } from "../../../../../../src/domain/aggregates/tournaments/commentaries/Commentary.js";
import { Commentary } from "../../../../../../src/domain/aggregates/tournaments/commentaries/Commentary.js";
import { CommentaryCommentAdded } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentAdded.js";
import { CommentaryCommentDeleted } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentDeleted.js";
import { CommentaryCommentEdited } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryCommentEdited.js";
import { CommentaryStarted } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryStarted.js";
import { CommentId } from "../../../../../../src/domain/aggregates/tournaments/commentaries/primitives/CommentId.js";
import { CommentText } from "../../../../../../src/domain/aggregates/tournaments/commentaries/value-objects/CommentText.js";
import { TournamentCommentaryStarted } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentCommentaryStarted.js";
import { Tournament } from "../../../../../../src/domain/aggregates/tournaments/Tournament.js";
import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { positionOf } from "../../ordinals.js";
import { byOf, now } from "../../tournament/aTournament.js";
import {
  ask,
  commentaryIdOf,
  commentaryOf,
  commentaryScenarioOf,
  commentSaying,
  happened,
  nextCommentIdOf,
  rebuild,
} from "./aCommentary.js";

// What a commentary's features all say: what its stream already holds, what
// each is asked, and what the commentary has afterwards.

// The stream --------------------------------------------------------------

Given("the commentary id {string}", function (this: SpecWorld, id: string) {
  commentaryScenarioOf(this).commentaryId = id;
});

Given("the comment id {string}", function (this: SpecWorld, id: string) {
  commentaryScenarioOf(this).commentId = id;
});

Given(
  "a stream where a commentary was started by {string}",
  function (this: SpecWorld, writer: string) {
    const commentary = Commentary.start(
      commentaryIdOf(this),
      AccountId.from(writer),
      now(this),
    );
    commentaryScenarioOf(this).stream.push(...commentary.handOver());
  },
);

// Added by its writer, whoever the scenario later says asks.
const added = (world: SpecWorld, text: string, id: CommentId): void => {
  happened(world, (commentary) =>
    commentary.addComment(
      id,
      CommentText.from(text),
      commentary.writer,
      now(world),
    ),
  );
  commentaryScenarioOf(world).comments.set(text, id);
};

Given(
  "the comment {string} was added to it",
  function (this: SpecWorld, text: string) {
    added(this, text, CommentId.create());
  },
);

Given(
  "the comment {string} was added to it as {string}",
  function (this: SpecWorld, text: string, id: string) {
    added(this, text, CommentId.from(id));
  },
);

Given(
  "the comment {string} was edited to {string}",
  function (this: SpecWorld, text: string, edited: string) {
    const id = commentSaying(this, text);
    happened(this, (commentary) =>
      commentary.editComment(
        id,
        CommentText.from(edited),
        commentary.writer,
        now(this),
      ),
    );
    commentaryScenarioOf(this).comments.set(edited, id);
  },
);

Given(
  "the comment {string} was deleted",
  function (this: SpecWorld, text: string) {
    happened(this, (commentary) =>
      commentary.deleteComment(
        commentSaying(this, text),
        commentary.writer,
        now(this),
      ),
    );
  },
);

Given("the commentary is rebuilt from its stream", function (this: SpecWorld) {
  rebuild(this);
});

// What it is asked -----------------------------------------------------------

When("a commentary is started", function (this: SpecWorld) {
  try {
    this.aggregate = Commentary.start(
      commentaryIdOf(this),
      byOf(this),
      now(this),
    );
  } catch (failure) {
    this.failure = failure;
  }
});

// Making what the comment says may be refused as well as adding it, and both
// are the scenario's to expect.
When("the comment {string} is added", function (this: SpecWorld, text: string) {
  const id = nextCommentIdOf(this);
  commentaryScenarioOf(this).comments.set(text, id);
  ask(this, (commentary) =>
    commentary.addComment(id, CommentText.from(text), byOf(this), now(this)),
  );
});

const edit = (world: SpecWorld, id: CommentId, text: string): void => {
  ask(world, (commentary) =>
    commentary.editComment(id, CommentText.from(text), byOf(world), now(world)),
  );
};

When(
  "the comment {string} is edited to {string}",
  function (this: SpecWorld, text: string, edited: string) {
    edit(this, commentSaying(this, text), edited);
  },
);

When(
  "the comment known by {string} is edited to {string}",
  function (this: SpecWorld, id: string, edited: string) {
    edit(this, CommentId.from(id), edited);
  },
);

const remove = (world: SpecWorld, id: CommentId): void => {
  ask(world, (commentary) =>
    commentary.deleteComment(id, byOf(world), now(world)),
  );
};

When(
  "the comment {string} is deleted",
  function (this: SpecWorld, text: string) {
    remove(this, commentSaying(this, text));
  },
);

When(
  "the comment known by {string} is deleted",
  function (this: SpecWorld, id: string) {
    remove(this, CommentId.from(id));
  },
);

// What it recorded -------------------------------------------------------------

const assertFirstRecorded = (
  world: SpecWorld,
  kind: abstract new (...args: never[]) => DomainEvent,
): void => {
  const event = commentaryOf(world).recorded[0];
  assert.ok(event instanceof kind, `It recorded ${inspect(event)}.`);
};

// Said of the tournament starting one and of the commentary's own record
// alike, in the same words, so asked of whichever the scenario looks at.
Then(
  "the first thing it recorded is a commentary being started",
  function (this: SpecWorld) {
    if (this.aggregate instanceof Tournament) {
      const event = this.aggregate.recorded[0];
      assert.ok(
        event instanceof TournamentCommentaryStarted,
        `It recorded ${inspect(event)}.`,
      );
      return;
    }
    assertFirstRecorded(this, CommentaryStarted);
  },
);

Then(
  "the first thing it recorded is a comment being added",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CommentaryCommentAdded);
  },
);

Then(
  "the first thing it recorded is a comment being edited",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CommentaryCommentEdited);
  },
);

Then(
  "the first thing it recorded is a comment being deleted",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CommentaryCommentDeleted);
  },
);

// What it has ------------------------------------------------------------------

const textsOf = (world: SpecWorld): string[] =>
  commentaryOf(world).comments.map(({ text }) => String(text));

const commentNamed = (world: SpecWorld, text: string): Comment => {
  const found = commentaryOf(world).comments.find(
    (comment) => String(comment.text) === text,
  );
  assert.ok(
    found !== undefined,
    `It has no comment ${text}, only ${inspect(textsOf(world))}.`,
  );
  return found;
};

Then(
  "the commentary is known by {string}",
  function (this: SpecWorld, id: string) {
    assert.equal(commentaryOf(this).id.value, id);
  },
);

Then(
  "the commentary's writer is {string}",
  function (this: SpecWorld, writer: string) {
    assert.equal(commentaryOf(this).writer.value, writer);
  },
);

Then("the commentary has no comments", function (this: SpecWorld) {
  assert.deepEqual(textsOf(this), []);
});

Then(
  "the commentary has the comment {string}",
  function (this: SpecWorld, text: string) {
    commentNamed(this, text);
  },
);

Then(
  "the commentary does not have the comment {string}",
  function (this: SpecWorld, text: string) {
    assert.ok(!textsOf(this).includes(text), `It has ${text}.`);
  },
);

Then(
  "the commentary's {word} comment is {string}",
  function (this: SpecWorld, ordinal: string, text: string) {
    assert.equal(textsOf(this)[positionOf(ordinal)], text);
  },
);

Then(
  "the commentary's comment {string} is known by {string}",
  function (this: SpecWorld, text: string, id: string) {
    assert.equal(commentNamed(this, text).id.value, id);
  },
);

Then(
  "the commentary's comment {string} was written at {string}",
  function (this: SpecWorld, text: string, moment: string) {
    assert.equal(
      commentNamed(this, text).writtenAt.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);

Then(
  "the commentary's comment {string} has not been edited",
  function (this: SpecWorld, text: string) {
    assert.equal(commentNamed(this, text).lastEditedAt, undefined);
  },
);

Then(
  "the commentary's comment {string} has been edited",
  function (this: SpecWorld, text: string) {
    assert.notEqual(commentNamed(this, text).lastEditedAt, undefined);
  },
);

Then(
  "the commentary's comment {string} was last edited at {string}",
  function (this: SpecWorld, text: string, moment: string) {
    assert.equal(
      commentNamed(this, text).lastEditedAt?.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);
