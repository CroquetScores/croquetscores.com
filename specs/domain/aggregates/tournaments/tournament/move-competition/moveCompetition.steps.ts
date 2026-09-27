import { Given, Then, When } from "@cucumber/cucumber";

import { CompetitionMoved } from "../../../../../../src/domain/aggregates/tournaments/events/CompetitionMoved.js";
import { CompetitionsSpacedOut } from "../../../../../../src/domain/aggregates/tournaments/events/CompetitionsSpacedOut.js";
import { CompetitionId } from "../../../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  ask,
  assertFirstRecorded,
  assertRecordedAt,
  byOf,
  competitionNamed,
  creatorOf,
  happenedAs,
  now,
} from "../aTournament.js";

const moved = (
  world: SpecWorld,
  name: string,
  direction: "up" | "down",
): void => {
  ask(world, (tournament) =>
    tournament.moveCompetition(
      competitionNamed(tournament, name).reference.id,
      direction,
      byOf(world),
      now(world),
    ),
  );
};

When(
  "the competition {string} is moved up",
  function (this: SpecWorld, name: string) {
    moved(this, name, "up");
  },
);

When(
  "the competition {string} is moved down",
  function (this: SpecWorld, name: string) {
    moved(this, name, "down");
  },
);

When(
  "the competition {string} is moved up by its id",
  function (this: SpecWorld, id: string) {
    ask(this, (tournament) =>
      tournament.moveCompetition(
        CompetitionId.from(id),
        "up",
        byOf(this),
        now(this),
      ),
    );
  },
);

// An order no move would give just so, which is how a scenario brings two
// orders next to each other without moving a competition thirteen times.
Given(
  "the competition {string} was moved to the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    happenedAs(
      this,
      (tournament) =>
        new CompetitionMoved(
          competitionNamed(tournament, name).reference.id.value,
          order,
          creatorOf(this),
          now(this),
        ),
    );
  },
);

// Every competition, in the order the stream leaves them, as the tournament
// says them when it spaces them out.
Given("the competitions were spaced out", function (this: SpecWorld) {
  happenedAs(
    this,
    (tournament) =>
      new CompetitionsSpacedOut(
        tournament.competitions.map(({ reference }) => reference.id.value),
        creatorOf(this),
        now(this),
      ),
  );
});

Then(
  "the first thing it recorded is a competition being moved",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CompetitionMoved);
  },
);

Then(
  "the second thing it recorded is a competition being moved",
  function (this: SpecWorld) {
    assertRecordedAt(this, 1, CompetitionMoved);
  },
);

Then(
  "the first thing it recorded is the competitions being spaced out",
  function (this: SpecWorld) {
    assertFirstRecorded(this, CompetitionsSpacedOut);
  },
);
