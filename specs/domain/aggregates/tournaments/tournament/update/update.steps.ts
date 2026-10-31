import { Given, Then } from "@cucumber/cucumber";

import { TournamentUpdated } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentUpdated.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  assertFirstRecorded,
  byOf,
  createdAs,
  happened,
  now,
  scenarioOf,
  takenOf,
  updateOf,
} from "../aTournament.js";

// The stream -----------------------------------------------------------------

Given(
  "a stream where a tournament was created starting at {string}",
  function (this: SpecWorld, moment: string) {
    createdAs(this, { starts: moment });
  },
);

Given(
  "a stream where a tournament was created finishing at {string}",
  function (this: SpecWorld, moment: string) {
    createdAs(this, { finishes: moment });
  },
);

Given(
  "a stream where a tournament was created in the format {string}",
  function (this: SpecWorld, format: string) {
    createdAs(this, { format });
  },
);

Given(
  "a stream where a tournament was created in the sport {string}",
  function (this: SpecWorld, sport: string) {
    createdAs(this, { sport });
  },
);

Given(
  "a stream where a tournament was created in the region {string} of {string}",
  function (this: SpecWorld, region: string, country: string) {
    createdAs(this, { country, region });
  },
);

Given(
  "a stream where a tournament was created in no region of {string}",
  function (this: SpecWorld, country: string) {
    createdAs(this, { country, region: null });
  },
);

Given(
  "a stream where a tournament was created in the format {string} drawing a level test",
  function (this: SpecWorld, format: string) {
    createdAs(this, { format, levelTestsDrawn: true });
  },
);

Given("the update puts it in no region", function (this: SpecWorld) {
  scenarioOf(this).updating.region = null;
});

Given("the update draws a level test", function (this: SpecWorld) {
  scenarioOf(this).updating.levelTestsDrawn = true;
});

Given(
  "a stream where a tournament was created with no subtitle",
  function (this: SpecWorld) {
    createdAs(this, { subtitle: null });
  },
);

Given(
  "a stream where a tournament was created as a national event",
  function (this: SpecWorld) {
    createdAs(this, { national: true });
  },
);

// An update done to the tournament after it was created, saying one thing
// changed and the rest again as it was.
const updatedWith = (
  world: SpecWorld,
  changed: Parameters<typeof updateOf>[2],
): void => {
  happened(world, (tournament) =>
    tournament.update(
      updateOf(world, tournament, changed),
      takenOf(world),
      byOf(world),
      now(world),
    ),
  );
};

Given(
  "it was updated with the name {string}",
  function (this: SpecWorld, name: string) {
    updatedWith(this, { name });
  },
);

Given(
  "it was updated with the sport {string}",
  function (this: SpecWorld, sport: string) {
    updatedWith(this, { sport });
  },
);

Given(
  "it was updated with the format {string}",
  function (this: SpecWorld, format: string) {
    updatedWith(this, { format });
  },
);

Given(
  "it was updated with the days {string} to {string}",
  function (this: SpecWorld, starts: string, finishes: string) {
    updatedWith(this, { starts, finishes });
  },
);

// What the update says -------------------------------------------------------

Given(
  "the update starts it at {string}",
  function (this: SpecWorld, moment: string) {
    scenarioOf(this).updating.starts = moment;
  },
);

Given(
  "the update finishes it at {string}",
  function (this: SpecWorld, moment: string) {
    scenarioOf(this).updating.finishes = moment;
  },
);

Given(
  "the update plays it in the format {string}",
  function (this: SpecWorld, format: string) {
    scenarioOf(this).updating.format = format;
  },
);

Given(
  "the update plays it in the sport {string}",
  function (this: SpecWorld, sport: string) {
    scenarioOf(this).updating.sport = sport;
  },
);

Given(
  "the update puts it in the region {string}",
  function (this: SpecWorld, region: string) {
    scenarioOf(this).updating.region = region;
  },
);

Given(
  "the update gives it the subtitle {string}",
  function (this: SpecWorld, subtitle: string) {
    scenarioOf(this).updating.subtitle = subtitle;
  },
);

Given("the update makes it an international event", function (this: SpecWorld) {
  scenarioOf(this).updating.international = true;
});

// What came of it ------------------------------------------------------------

Then("the first thing it recorded is its update", function (this: SpecWorld) {
  assertFirstRecorded(this, TournamentUpdated);
});
