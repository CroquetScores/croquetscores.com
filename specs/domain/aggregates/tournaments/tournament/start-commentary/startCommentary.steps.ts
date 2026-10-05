import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { TournamentCommentaryStarted } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentCommentaryStarted.js";
import { CommentaryId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import { CommentaryTitle } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { SpecWorld } from "../../../../../support/world.js";
import { commentaryIdOf } from "../../commentaries/commentary/aCommentary.js";
import {
  ask,
  byOf,
  commentaryTitled,
  happened,
  now,
  scenarioOf,
  tournamentOf,
} from "../aTournament.js";

const started = (world: SpecWorld, title: string, id: CommentaryId): void => {
  happened(world, (tournament) =>
    tournament.startCommentary(
      id,
      CommentaryTitle.from(title),
      byOf(world),
      now(world),
    ),
  );
};

Given(
  "the commentary {string} was started on it",
  function (this: SpecWorld, title: string) {
    started(this, title, CommentaryId.create());
  },
);

Given(
  "the commentary {string} was started on it as {string}",
  function (this: SpecWorld, title: string, id: string) {
    started(this, title, CommentaryId.from(id));
  },
);

// Commentaries with every slug from `from` to `to`, each with a title of its
// own that makes none of them, recorded as they would have been had the
// tournament given them those slugs, as the competitions of addBlock.feature
// are.
Given(
  "a commentary was started on it with every slug from {string} to {string}",
  function (this: SpecWorld, from: string, to: string) {
    const last = /^(.*)-(\d{2})$/.exec(to);
    assert.ok(
      last !== null && last[1] === from,
      `${to} is not ${from} numbered.`,
    );
    const slugs = [
      from,
      ...Array.from(
        { length: Number(last[2]) },
        (_, at) => `${from}-${String(at + 1).padStart(2, "0")}`,
      ),
    ];
    const scenario = scenarioOf(this);
    slugs.forEach((slug, at) => {
      scenario.later.push(
        new TournamentCommentaryStarted(
          CommentaryId.create().value,
          `Taken ${at + 1}`,
          slug,
          byOf(this),
          now(this),
        ),
      );
    });
  },
);

// Making the title may be refused as well as starting the commentary, and
// both are the scenario's to expect.
When(
  "the commentary {string} is started",
  function (this: SpecWorld, title: string) {
    ask(this, (tournament) =>
      tournament.startCommentary(
        commentaryIdOf(this),
        CommentaryTitle.from(title),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the tournament has the commentary {string}",
  function (this: SpecWorld, title: string) {
    commentaryTitled(tournamentOf(this), title);
  },
);

Then("the tournament has no commentaries", function (this: SpecWorld) {
  assert.deepEqual(
    tournamentOf(this).commentaries.map(({ title }) => String(title)),
    [],
  );
});

Then(
  "the tournament's commentary {string} is known by {string}",
  function (this: SpecWorld, title: string, id: string) {
    assert.equal(commentaryTitled(tournamentOf(this), title).id.value, id);
  },
);

Then(
  "the tournament's commentary {string} was started by {string}",
  function (this: SpecWorld, title: string, account: string) {
    assert.equal(
      commentaryTitled(tournamentOf(this), title).writer.value,
      account,
    );
  },
);

Then(
  "the tournament's commentary {string} has the slug {string}",
  function (this: SpecWorld, title: string, slug: string) {
    assert.equal(
      String(commentaryTitled(tournamentOf(this), title).slug),
      slug,
    );
  },
);
