// What stands behind "a fake of the world rankings": the reading of the
// players' lists, asking a fake of the rankings' site on a port of its own;
// the steps that say what the fake's lists hold and how it answers; and the
// steps that read back the players kept, which three features share.
//
// Here rather than in specs/support/ because it names infrastructure, and
// specs/support/ is loaded by every spec in the repository and so may not.
import { After, Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { WorldRankingSport } from "../../../src/application/services/WorldRankingLists.js";
import { WorldRankingWebsite } from "../../../src/infrastructure/services/WorldRankingWebsite.js";
import { FakeWorldRankings } from "../services/world-ranking-website/FakeWorldRankings.js";
import type { SpecWorld } from "../../support/world.js";
import { fromOutside } from "./transactions.js";

/**
 * How long the scenarios' reading waits for the fake. Long enough that a fake
 * answering at once on the same machine is never too late, and short enough
 * that a scenario about lateness is over quickly.
 */
export const scenariosWaitMilliseconds = 1000;

/** A sport as the features name it, as the reading names it. */
export const sportCalled = (name: string): WorldRankingSport => {
  if (name === "association croquet") return "ac";
  if (name === "golf croquet") return "gc";
  throw new Error(`There is no world ranking list for ${name}.`);
};

/** The two sports, as a step's pattern matches them. */
export const SPORT = "(association croquet|golf croquet)";

const fakes = new WeakMap<SpecWorld, FakeWorldRankings>();

export const fakeRankingsOf = (world: SpecWorld): FakeWorldRankings => {
  const fake = fakes.get(world);
  assert.ok(fake !== undefined, "There is no fake of the world rankings.");
  return fake;
};

Given("a fake of the world rankings", async function (this: SpecWorld) {
  const fake = await FakeWorldRankings.start();
  fakes.set(this, fake);
  this.worldRankingLists = new WorldRankingWebsite(
    fake.addresses,
    scenariosWaitMilliseconds,
  );
  // Stopped before anything else the scenario opened on its database is
  // closed, where it has one: an application still waiting on a list the
  // fake is holding back would otherwise wait out the reading's time before
  // it closed. Stopped by the After hook below where there is no database.
  if (this.pool !== undefined) {
    this.closeBeforeDropping.unshift(() => fake.stop());
  }
});

After(async function (this: SpecWorld) {
  await fakes.get(this)?.stop();
});

Given(
  new RegExp(`^the ${SPORT} list names "([^"]*)"$`),
  function (this: SpecWorld, sport: string, fullName: string) {
    fakeRankingsOf(this).names(sportCalled(sport), fullName);
  },
);

Given(
  new RegExp(`^the ${SPORT} list no longer names "([^"]*)"$`),
  function (this: SpecWorld, sport: string, fullName: string) {
    fakeRankingsOf(this).noLongerNames(sportCalled(sport), fullName);
  },
);

Given(
  new RegExp(`^the ${SPORT} list has the line "([^"]*)"$`),
  function (this: SpecWorld, sport: string, line: string) {
    fakeRankingsOf(this).has(sportCalled(sport), line);
  },
);

Given(
  new RegExp(`^the ${SPORT} list has an empty line$`),
  function (this: SpecWorld, sport: string) {
    fakeRankingsOf(this).has(sportCalled(sport), "");
  },
);

// Nothing like either sport's lines, so that it is refused whichever list it
// is on.
Given(
  new RegExp(`^the ${SPORT} list has a line that cannot be read$`),
  function (this: SpecWorld, sport: string) {
    fakeRankingsOf(this).has(sportCalled(sport), "not a line of the list");
  },
);

// A whole golf croquet line, with its surname spelled in Latin-1, as a list
// saved in the wrong encoding would spell it: "Méndez", whose é is one byte
// that UTF-8 never begins a character with.
Given(
  new RegExp(`^the ${SPORT} list has a line that is not UTF-8$`),
  function (this: SpecWorld, sport: string) {
    fakeRankingsOf(this).has(
      sportCalled(sport),
      Buffer.from("1,Méndez,Ana,Ana,f,ESP,ESP,,1300,1300,,,,,0,0,0", "latin1"),
    );
  },
);

Given(
  new RegExp(`^the ${SPORT} list is empty$`),
  function (this: SpecWorld, sport: string) {
    fakeRankingsOf(this).empties(sportCalled(sport));
  },
);

Given(
  new RegExp(`^the world rankings answer the ${SPORT} list with a failure$`),
  function (this: SpecWorld, sport: string) {
    fakeRankingsOf(this).answer(sportCalled(sport), "failure");
  },
);

Given(
  new RegExp(
    `^the world rankings answer the ${SPORT} list only after the reading has stopped waiting$`,
  ),
  function (this: SpecWorld, sport: string) {
    fakeRankingsOf(this).answer(
      sportCalled(sport),
      "late",
      scenariosWaitMilliseconds * 2,
    );
  },
);

// Held back for as long as the scenario lasts, with the reading told to wait
// longer than that, so that what is under way stays under way while the
// scenario looks at it. Stopping the fake lets go of it.
Given(
  new RegExp(`^the world rankings hold back the ${SPORT} list$`),
  function (this: SpecWorld, sport: string) {
    const fake = fakeRankingsOf(this);
    fake.answer(sportCalled(sport), "held");
    this.worldRankingLists = new WorldRankingWebsite(fake.addresses, 60_000);
  },
);

// Nothing listening is as unreachable as a site gets.
Given("the world rankings cannot be reached", async function (this: SpecWorld) {
  await fakeRankingsOf(this).stop();
});

// Read from the fake rather than from the reading in front of it, because what
// is asked is whether the site was asked anything at all.
Then("nothing was asked of the world rankings", function (this: SpecWorld) {
  assert.deepEqual(fakeRankingsOf(this).asked, []);
});

// The players kept ----------------------------------------------------------

// Written out rather than made from the sport, as the store writes them.
const TABLES: Readonly<Record<WorldRankingSport, string>> = {
  ac: "ac_world_ranking_players",
  gc: "gc_world_ranking_players",
};

/**
 * Every name kept for `sport`, as anybody would read them: from a connection
 * of its own, so that only what was committed is read.
 */
export const namesKept = (
  world: SpecWorld,
  sport: WorldRankingSport,
): Promise<string[]> =>
  fromOutside(world, async (outside) => {
    const { rows } = await outside.query<{ name: string }>(
      `select name from ${TABLES[sport]} order by name`,
    );
    return rows.map((row) => row.name);
  });

Then(
  new RegExp(`^"([^"]*)" is kept among the ${SPORT} players$`),
  async function (this: SpecWorld, fullName: string, sport: string) {
    const kept = await namesKept(this, sportCalled(sport));
    assert.ok(kept.includes(fullName), `Kept ${JSON.stringify(kept)}.`);
  },
);

Then(
  new RegExp(`^"([^"]*)" is not kept among the ${SPORT} players$`),
  async function (this: SpecWorld, fullName: string, sport: string) {
    const kept = await namesKept(this, sportCalled(sport));
    assert.ok(!kept.includes(fullName), `Kept ${JSON.stringify(kept)}.`);
  },
);

Then(
  new RegExp(`^(\\d+) ${SPORT} players? (?:is|are) kept$`),
  async function (this: SpecWorld, count: string, sport: string) {
    const kept = await namesKept(this, sportCalled(sport));
    assert.equal(kept.length, Number(count), `Kept ${JSON.stringify(kept)}.`);
  },
);
