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
import { TournamentId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { CommentaryTitle } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import { CommentaryTitleChanged } from "../../../../../../src/domain/aggregates/tournaments/commentaries/events/CommentaryTitleChanged.js";
import { AccountId } from "../../../../../../src/domain/aggregates/accounts/AccountId.js";
import type { DomainEvent } from "../../../../../../src/domain/common/DomainEvent.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { positionOf } from "../../ordinals.js";
import { A_TOURNAMENT_ID, byOf, now } from "../../tournament/aTournament.js";
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
  "the commentary is to be started on the tournament {string}",
  function (this: SpecWorld, id: string) {
    commentaryScenarioOf(this).tournamentId = id;
  },
);

Given(
  "the tournament's other commentaries are called {string}",
  function (this: SpecWorld, title: string) {
    commentaryScenarioOf(this).titles.push(title);
  },
);

Given(
  "the tournament's other commentaries are found at {string}",
  function (this: SpecWorld, slug: string) {
    commentaryScenarioOf(this).slugs.push(slug);
  },
);

Given(
  "the tournament's other commentaries are found at {string} and {string}",
  function (this: SpecWorld, one: string, other: string) {
    commentaryScenarioOf(this).slugs.push(one, other);
  },
);

// Every slug from `from` to `to`, numbered as they would be, so that the next
// commentary has none of them to be found at.
Given(
  "the tournament's other commentaries are found at every slug from {string} to {string}",
  function (this: SpecWorld, from: string, to: string) {
    const last = /^(.*)-(\d{2})$/.exec(to);
    assert.ok(
      last !== null && last[1] === from,
      `${to} is not ${from} numbered.`,
    );
    commentaryScenarioOf(this).slugs.push(
      from,
      ...Array.from(
        { length: Number(last[2]) },
        (_, at) => `${from}-${String(at + 1).padStart(2, "0")}`,
      ),
    );
  },
);

// Made as starting it makes it, so that a title that could not be a
// commentary's is refused as starting it would be.
const started = (world: SpecWorld, title: string, by: AccountId) => {
  const scenario = commentaryScenarioOf(world);
  return Commentary.start(
    commentaryIdOf(world),
    TournamentId.from(scenario.tournamentId ?? A_TOURNAMENT_ID),
    CommentaryTitle.from(title),
    { titles: scenario.titles, slugs: scenario.slugs },
    by,
    now(world),
  );
};

Given(
  "a stream where a commentary was started by {string}",
  function (this: SpecWorld, writer: string) {
    commentaryScenarioOf(this).stream.push(
      ...started(this, "Day one", AccountId.from(writer)).handOver(),
    );
  },
);

Given(
  "a stream where the commentary {string} was started",
  function (this: SpecWorld, title: string) {
    commentaryScenarioOf(this).stream.push(
      ...started(this, title, byOf(this)).handOver(),
    );
  },
);

Given(
  "the commentary's title was changed to {string}",
  function (this: SpecWorld, title: string) {
    happened(this, (commentary) => {
      commentary.changeTitle(
        CommentaryTitle.from(title),
        commentaryScenarioOf(this).titles,
        commentary.writer,
        now(this),
      );
    });
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

When(
  "the commentary {string} is started",
  function (this: SpecWorld, title: string) {
    try {
      this.aggregate = started(this, title, byOf(this));
    } catch (failure) {
      this.failure = failure;
    }
  },
);

// Asked by whoever the scenario says asks, the writer where it says nobody.
When(
  "the commentary's title is changed to {string}",
  function (this: SpecWorld, title: string) {
    ask(this, (commentary) => {
      commentary.changeTitle(
        CommentaryTitle.from(title),
        commentaryScenarioOf(this).titles,
        byOf(this),
        now(this),
      );
    });
  },
);

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

Then(
  "the first thing it recorded is a commentary being started",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CommentaryStarted);
  },
);

Then(
  "the first thing it recorded is a commentary's title being changed",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CommentaryTitleChanged);
  },
);

Then(
  "the commentary is on the tournament {string}",
  function (this: SpecWorld, id: string) {
    assert.equal(commentaryOf(this).tournament.value, id);
  },
);

Then(
  "the commentary is called {string}",
  function (this: SpecWorld, title: string) {
    assert.equal(commentaryOf(this).title.toString(), title);
  },
);

Then(
  "the commentary is found at {string}",
  function (this: SpecWorld, slug: string) {
    assert.equal(commentaryOf(this).slug.toString(), slug);
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
