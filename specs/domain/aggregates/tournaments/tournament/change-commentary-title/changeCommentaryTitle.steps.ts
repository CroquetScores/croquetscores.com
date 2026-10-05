import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TournamentCommentaryTitleChanged } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentCommentaryTitleChanged.js";
import { CommentaryId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CommentaryId.js";
import { CommentaryTitle } from "../../../../../../src/domain/aggregates/tournaments/value-objects/CommentaryTitle.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  byOf,
  commentaryTitled,
  happened,
  now,
  tournamentOf,
} from "../aTournament.js";

Given(
  "the title of the commentary {string} was changed to {string}",
  function (this: SpecWorld, title: string, changed: string) {
    happened(this, (tournament) =>
      tournament.changeCommentaryTitle(
        commentaryTitled(tournament, title).id,
        CommentaryTitle.from(changed),
        byOf(this),
        now(this),
      ),
    );
  },
);

// Making the title may be refused as well as changing it, and both are the
// scenario's to expect.
When(
  "the title of the commentary {string} is changed to {string}",
  function (this: SpecWorld, title: string, changed: string) {
    ask(this, (tournament) =>
      tournament.changeCommentaryTitle(
        commentaryTitled(tournament, title).id,
        CommentaryTitle.from(changed),
        byOf(this),
        now(this),
      ),
    );
  },
);

When(
  "the title of the commentary known by {string} is changed to {string}",
  function (this: SpecWorld, id: string, changed: string) {
    ask(this, (tournament) =>
      tournament.changeCommentaryTitle(
        CommentaryId.from(id),
        CommentaryTitle.from(changed),
        byOf(this),
        now(this),
      ),
    );
  },
);

Then(
  "the first thing it recorded is a commentary's title being changed",
  function (this: SpecWorld) {
    assertFirstRecorded(this, TournamentCommentaryTitleChanged);
  },
);

Then(
  "the tournament has no commentary {string}",
  function (this: SpecWorld, title: string) {
    const titles = tournamentOf(this).commentaries.map((commentary) =>
      String(commentary.title),
    );
    assert.ok(!titles.includes(title), `It has ${inspect(titles)}.`);
  },
);
