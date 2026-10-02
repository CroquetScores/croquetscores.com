import { Given, When } from "@cucumber/cucumber";

import { Tournament } from "../../../../../../src/domain/aggregates/tournaments/Tournament.js";
import { Slug } from "../../../../../../src/domain/common/Slug.js";
import type { SpecWorld } from "../../../../../support/world.js";
import {
  type Said,
  byOf,
  createdAs,
  detailsOf,
  now,
  scenarioOf,
  websiteOf,
} from "../aTournament.js";

// What the scenario says the tournament is, by the steps creating one is
// said with, so that one brought over is said as one created is. One whose
// start is unsaid starts at the scenario's moment: a tournament is brought over
// as created when it started, years ago, and one starting in the year the
// steps otherwise give would be refused as starting after next year.
const saidOf = (world: SpecWorld): Said => ({
  ...(world.moment === undefined ? {} : { starts: world.moment.toISOString() }),
  ...scenarioOf(world).creating,
  ...(world.website === undefined ? {} : { website: world.website.host }),
  ...(world.sport === undefined ? {} : { sport: world.sport.code }),
  ...(world.tournamentFormat === undefined
    ? {}
    : { format: world.tournamentFormat.name }),
});

Given(
  "a stream where a tournament was brought over at the slug {string}",
  function (this: SpecWorld, slug: string) {
    scenarioOf(this).broughtOverAt = slug;
    createdAs(this, saidOf(this));
  },
);

// The slug is made inside, so that one that is not a slug is refused as the
// tournament would refuse anything else it is given.
When(
  "a tournament is brought over at the slug {string}",
  function (this: SpecWorld, slug: string) {
    const said = saidOf(this);
    try {
      this.aggregate = Tournament.bringOver(
        scenarioOf(this).id,
        websiteOf(said),
        detailsOf(said),
        Slug.from(slug),
        byOf(this),
        now(this),
      );
    } catch (failure) {
      this.failure = failure;
    }
  },
);
