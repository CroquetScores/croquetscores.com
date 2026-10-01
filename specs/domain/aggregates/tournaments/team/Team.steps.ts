import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { TeamId } from "../../../../../src/domain/aggregates/tournaments/primitives/TeamId.js";
import { TeamPlayerId } from "../../../../../src/domain/aggregates/tournaments/primitives/TeamPlayerId.js";
import {
  Team,
  type TeamDetails,
} from "../../../../../src/domain/aggregates/tournaments/Team.js";
import { TeamPlayer } from "../../../../../src/domain/aggregates/tournaments/TeamPlayer.js";
import { Slug } from "../../../../../src/domain/common/Slug.js";
import type { SpecWorld } from "../../../../support/world.js";
import { shortNameFor } from "../tournament/aTeamTournament.js";

// What a scenario leaves unsaid of a team. A scenario about one part of a
// team gives every other part as a team that is well made, so that what is
// refused is only ever what the scenario named.
const A_NAME = "Australia";
const AN_ORDER = 10_000;

interface Scenario {
  team: Team | undefined;
  before: Team | undefined;
  other: Team | undefined;
  same: boolean | undefined;
  // Whether the tournament says the team plays in a test.
  inATest: boolean;
}

// Kept here rather than on the world, which has no business knowing what a
// team is.
const scenarios = new WeakMap<SpecWorld, Scenario>();

const scenarioOf = (world: SpecWorld): Scenario => {
  let scenario = scenarios.get(world);
  if (scenario === undefined) {
    scenario = {
      team: undefined,
      before: undefined,
      other: undefined,
      same: undefined,
      inATest: false,
    };
    scenarios.set(world, scenario);
  }
  return scenario;
};

// A team as `details` say, its short name the first three letters of its
// name in capitals where they do not say it.
const teamOf = (
  details: Partial<TeamDetails>,
  order = AN_ORDER,
  id = TeamId.create(),
): Team => {
  const name = details.name ?? A_NAME;
  return Team.from(
    id,
    { name, shortName: details.shortName ?? shortNameFor(name), ...details },
    { slug: Slug.from("a-team"), order },
  );
};

// Making a team may be refused, and the scenario says which it expects.
const tryToMake = (
  world: SpecWorld,
  details: Partial<TeamDetails>,
  order = AN_ORDER,
): void => {
  try {
    scenarioOf(world).team = teamOf(details, order);
  } catch (failure) {
    world.failure = failure;
  }
};

const teamOfWorld = (world: SpecWorld): Team => {
  const { team } = scenarioOf(world);
  assert.ok(
    team !== undefined,
    `No team has been made: ${inspect(world.failure)}`,
  );
  return team;
};

// Changing a team may be refused too. The team as it was is kept, so that
// what it became can be compared with it.
const tryToChange = (
  world: SpecWorld,
  changing: (team: Team) => Team,
): void => {
  const scenario = scenarioOf(world);
  const team = teamOfWorld(world);
  scenario.before = team;
  try {
    scenario.team = changing(team);
  } catch (failure) {
    world.failure = failure;
  }
};

// What `team` is, said again with `changed`.
const detailsOf = (team: Team, changed: Partial<TeamDetails>): TeamDetails => {
  const flag = team.flag === undefined ? undefined : String(team.flag);
  return {
    name: team.name.toString(),
    shortName: team.shortName.toString(),
    ...(flag === undefined ? {} : { flag }),
    ...changed,
  };
};

Given("a team named {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).team = teamOf({ name });
});

Given(
  "a team named {string} known for short as {string}",
  function (this: SpecWorld, name: string, shortName: string) {
    scenarioOf(this).team = teamOf({ name, shortName });
  },
);

Given(
  "a team named {string} in the order {int}",
  function (this: SpecWorld, name: string, order: number) {
    scenarioOf(this).team = teamOf({ name }, order);
  },
);

Given(
  "a team named {string} that is archived",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).team = teamOf({ name }).archive({ inATest: false });
  },
);

Given(
  "the player {string} is one of the team's",
  function (this: SpecWorld, name: string) {
    const scenario = scenarioOf(this);
    scenario.team = teamOfWorld(this).withPlayer(
      TeamPlayer.from(TeamPlayerId.create(), { name }, AN_ORDER),
    );
  },
);

Given(
  "another team with the same id named {string}",
  function (this: SpecWorld, name: string) {
    scenarioOf(this).other = teamOf({ name }, AN_ORDER, teamOfWorld(this).id);
  },
);

Given("another team named {string}", function (this: SpecWorld, name: string) {
  scenarioOf(this).other = teamOf({ name });
});

Given("the tournament says the team is in a test", function (this: SpecWorld) {
  scenarioOf(this).inATest = true;
});

Given("the tournament says the team is in no test", function (this: SpecWorld) {
  scenarioOf(this).inATest = false;
});

When("a team named {string} is made", function (this: SpecWorld, name: string) {
  tryToMake(this, { name });
});

When(
  "a team known for short as {string} is made",
  function (this: SpecWorld, shortName: string) {
    tryToMake(this, { shortName });
  },
);

When(
  "a team named {string} known for short as {string} is made",
  function (this: SpecWorld, name: string, shortName: string) {
    tryToMake(this, { name, shortName });
  },
);

// Each accent as a code point of its own after its letter, which a reader
// still counts as one character with it.
When(
  "a team named {string} known for short as {string} is made with each accent typed after its letter",
  function (this: SpecWorld, name: string, shortName: string) {
    tryToMake(this, {
      name: name.normalize("NFD"),
      shortName: shortName.normalize("NFD"),
    });
  },
);

When(
  "a team flying the flag {string} is made",
  function (this: SpecWorld, flag: string) {
    tryToMake(this, { flag });
  },
);

When("a team flying no flag is made", function (this: SpecWorld) {
  tryToMake(this, {});
});

When(
  "a team in the order {float} is made",
  function (this: SpecWorld, order: number) {
    tryToMake(this, {}, order);
  },
);

When(
  "the team is given the order {int}",
  function (this: SpecWorld, order: number) {
    tryToChange(this, (team) => team.withOrder(order));
  },
);

When(
  "the team is updated to be called {string}",
  function (this: SpecWorld, name: string) {
    tryToChange(this, (team) => team.update(detailsOf(team, { name })));
  },
);

When(
  "the team is updated to be known for short as {string}",
  function (this: SpecWorld, shortName: string) {
    tryToChange(this, (team) => team.update(detailsOf(team, { shortName })));
  },
);

When(
  "the team is updated to fly the flag {string}",
  function (this: SpecWorld, flag: string) {
    tryToChange(this, (team) => team.update(detailsOf(team, { flag })));
  },
);

When("the tournament archives the team", function (this: SpecWorld) {
  const { inATest } = scenarioOf(this);
  tryToChange(this, (team) => team.archive({ inATest }));
});

When("the tournament restores the team", function (this: SpecWorld) {
  tryToChange(this, (team) => team.restore());
});

When(
  "the tournament asks whether the team can be moved",
  function (this: SpecWorld) {
    tryToChange(this, (team) => {
      team.ensureMovable();
      return team;
    });
  },
);

When(
  "the tournament asks whether the team's players can be changed",
  function (this: SpecWorld) {
    tryToChange(this, (team) => {
      team.ensureInUse();
      return team;
    });
  },
);

When("the teams are compared", function (this: SpecWorld) {
  const scenario = scenarioOf(this);
  assert.ok(scenario.other !== undefined, "No other team has been made.");
  scenario.same = teamOfWorld(this).equals(scenario.other);
});

Then("the team's name is {string}", function (this: SpecWorld, name: string) {
  assert.equal(String(teamOfWorld(this).name), name);
});

Then(
  "the team's short name is {string}",
  function (this: SpecWorld, shortName: string) {
    assert.equal(String(teamOfWorld(this).shortName), shortName);
  },
);

Then(
  "the team flies the flag {string}",
  function (this: SpecWorld, flag: string) {
    assert.equal(String(teamOfWorld(this).flag), flag);
  },
);

Then("the team flies no flag", function (this: SpecWorld) {
  assert.equal(teamOfWorld(this).flag, undefined);
});

Then("the team has no players", function (this: SpecWorld) {
  assert.deepEqual(teamOfWorld(this).players.map(String), []);
});

Then(
  "the team has the player {string}",
  function (this: SpecWorld, name: string) {
    const names = teamOfWorld(this).players.map(String);
    assert.ok(names.includes(name), `It has ${inspect(names)}.`);
  },
);

Then("the team is archived", function (this: SpecWorld) {
  assert.equal(teamOfWorld(this).archived, true);
});

Then("the team is not archived", function (this: SpecWorld) {
  assert.equal(teamOfWorld(this).archived, false);
});

Then("the team's order is {int}", function (this: SpecWorld, order: number) {
  assert.equal(teamOfWorld(this).order, order);
});

Then("the team is the same team it was", function (this: SpecWorld) {
  const { before } = scenarioOf(this);
  assert.ok(before !== undefined, "The team was not changed.");
  assert.ok(teamOfWorld(this).equals(before));
});

Then("they are the same team", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).same, true);
});

Then("they are different teams", function (this: SpecWorld) {
  assert.equal(scenarioOf(this).same, false);
});
