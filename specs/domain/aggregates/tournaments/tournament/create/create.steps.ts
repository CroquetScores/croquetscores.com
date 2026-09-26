import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { TournamentCreated } from "../../../../../../src/domain/aggregates/tournaments/events/TournamentCreated.js";
import { TournamentId } from "../../../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import { Tournament } from "../../../../../../src/domain/aggregates/tournaments/Tournament.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  assertFirstRecorded,
  byOf,
  createdAs,
  detailsOf,
  now,
  scenarioOf,
  takenOf,
  tournamentOf,
  websiteOf,
} from "../aTournament.js";

// What the tournament is to be created as ------------------------------------

Given("the tournament id {string}", function (this: SpecWorld, id: string) {
  scenarioOf(this).id = TournamentId.from(id);
});

Given("the tournament name {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).creating.name = name;
});

Given(
  "the tournament is to start at {string}",
  function (this: SpecWorld, moment: string) {
    scenarioOf(this).creating.starts = moment;
  },
);

Given(
  "the tournament is to finish at {string}",
  function (this: SpecWorld, moment: string) {
    scenarioOf(this).creating.finishes = moment;
  },
);

Given("the country {string}", function (this: SpecWorld, code: string) {
  scenarioOf(this).creating.country = code;
});

Given("the region {string}", function (this: SpecWorld, code: string) {
  scenarioOf(this).creating.region = code;
});

Given("the notes {string}", function (this: SpecWorld, notes: string) {
  scenarioOf(this).creating.notes = notes;
});

Given("no notes", function (this: SpecWorld) {
  scenarioOf(this).creating.notes = null;
});

// The address the numbered addresses from `from` to `to` are followed by, and
// the last number, so that a scenario can name them all at once.
Given(
  "every address from {string} to {string} is taken",
  function (this: SpecWorld, from: string, to: string) {
    const numbered = /^(.*)-(\d{2})$/;
    const first = numbered.exec(from);
    const last = numbered.exec(to);
    assert.ok(first !== null && last !== null, "Both must be numbered.");
    assert.equal(first[1], last[1], "Both must be of the one address.");
    for (
      let number = Number(first[2]);
      number <= Number(last[2]);
      number += 1
    ) {
      scenarioOf(this).taken.add(
        `${first[1]}-${String(number).padStart(2, "0")}`,
      );
    }
  },
);

// Each is said once and left unsaid otherwise, and unsaid is what these say.
Given("nothing is said of handicap", function (this: SpecWorld) {
  delete scenarioOf(this).creating.handicap;
});

Given(
  "the tournament is said to be played under handicap",
  function (this: SpecWorld) {
    scenarioOf(this).creating.handicap = true;
  },
);

Given("nothing is said of the world rankings", function (this: SpecWorld) {
  delete scenarioOf(this).creating.worldRankings;
});

Given(
  "the tournament is said to count towards the world rankings",
  function (this: SpecWorld) {
    scenarioOf(this).creating.worldRankings = true;
  },
);

Given(
  "the tournament is said not to count towards the world rankings",
  function (this: SpecWorld) {
    scenarioOf(this).creating.worldRankings = false;
  },
);

Given(
  "nothing is said of whether the tournament is national",
  function (this: SpecWorld) {
    delete scenarioOf(this).creating.national;
  },
);

Given(
  "nothing is said of whether the tournament is international",
  function (this: SpecWorld) {
    delete scenarioOf(this).creating.international;
  },
);

Given("the tournament is said to be national", function (this: SpecWorld) {
  scenarioOf(this).creating.national = true;
});

Given("the tournament is said to be international", function (this: SpecWorld) {
  scenarioOf(this).creating.international = true;
});

Given(
  "a stream where a tournament was created not counting towards the world rankings",
  function (this: SpecWorld) {
    createdAs(this, { worldRankings: false });
  },
);

// Creating it ----------------------------------------------------------------

// The website, the sport and the format are named by the steps each of those
// has of its own, and everything else by the steps above.
When("a tournament is created", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  const said = {
    ...scenario.creating,
    ...(this.website === undefined ? {} : { website: this.website.host }),
    ...(this.sport === undefined ? {} : { sport: this.sport.code }),
    ...(this.tournamentFormat === undefined
      ? {}
      : { format: this.tournamentFormat.name }),
  };
  try {
    this.aggregate = Tournament.create(
      scenario.id,
      websiteOf(said),
      detailsOf(said),
      takenOf(this),
      byOf(this),
      now(this),
    );
  } catch (failure) {
    this.failure = failure;
  }
});

// What came of it ------------------------------------------------------------

Then("the first thing it recorded is its creation", function (this: SpecWorld) {
  assertFirstRecorded(this, TournamentCreated);
});

Then(
  "the tournament starts at {string}",
  function (this: SpecWorld, moment: string) {
    assert.equal(tournamentOf(this).starts.toISOString(), moment);
  },
);

Then(
  "the tournament is played in the sport {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(tournamentOf(this).sport.code, code);
  },
);

Then(
  "the tournament is played in the country {string}",
  function (this: SpecWorld, code: string) {
    assert.equal(tournamentOf(this).country.code, code);
  },
);

Then("the tournament has no notes", function (this: SpecWorld) {
  assert.equal(tournamentOf(this).notes, undefined);
});

Then("the tournament has no players", function (this: SpecWorld) {
  assert.deepEqual(tournamentOf(this).players, []);
});

Then("the tournament has no competitions", function (this: SpecWorld) {
  assert.deepEqual(tournamentOf(this).competitions, []);
});

Then("the tournament is not played under handicap", function (this: SpecWorld) {
  assert.equal(tournamentOf(this).handicap, false);
});

Then(
  "the tournament counts towards the world rankings",
  function (this: SpecWorld) {
    assert.equal(tournamentOf(this).worldRankings, true);
  },
);

Then(
  "the tournament does not count towards the world rankings",
  function (this: SpecWorld) {
    assert.equal(tournamentOf(this).worldRankings, false);
  },
);

Then("the tournament is a national event", function (this: SpecWorld) {
  assert.equal(tournamentOf(this).national, true);
});

Then("the tournament is not a national event", function (this: SpecWorld) {
  assert.equal(tournamentOf(this).national, false);
});

Then("the tournament is an international event", function (this: SpecWorld) {
  assert.equal(tournamentOf(this).international, true);
});

Then(
  "the tournament is not an international event",
  function (this: SpecWorld) {
    assert.equal(tournamentOf(this).international, false);
  },
);
