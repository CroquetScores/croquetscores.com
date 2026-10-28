// What the scenarios here, and the player dialog's (player.feature), say of
// what players represent (RepresentingMatching.feature). The players are
// added as the account that organises every tournament here, and are named
// for the order they were added in, since a scenario cares what they
// represent and not who they are.
import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AddPlayer } from "../../../../../src/application/operations/tournaments/AddPlayer.js";
import { ArchivePlayer } from "../../../../../src/application/operations/tournaments/ArchivePlayer.js";
import { CreateTournament } from "../../../../../src/application/operations/tournaments/CreateTournament.js";
import {
  type RepresentingFound,
  RepresentingMatching,
} from "../../../../../src/application/operations/tournaments/RepresentingMatching.js";
import { RestorePlayer } from "../../../../../src/application/operations/tournaments/RestorePlayer.js";
import { UpdatePlayer } from "../../../../../src/application/operations/tournaments/UpdatePlayer.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  created,
  inHandOf,
  lookAt,
  momentOf,
  scenarioOf,
} from "../aRequest.js";

const ORGANISER = "organiser@example.com";

interface Added {
  readonly tournament: string;
  readonly id: string;
}

// The player the scenario added last, which "that player" is, and how many it
// has added, which names the next.
const kept = new WeakMap<
  SpecWorld,
  { last: Added | undefined; added: number }
>();

const keptFor = (world: SpecWorld) => {
  let found = kept.get(world);
  if (found === undefined) {
    found = { last: undefined, added: 0 };
    kept.set(world, found);
  }
  return found;
};

// The organiser has an account wherever the scenario did not already say so:
// a browser scenario signs one in, and an application scenario has none.
const organiserIn = async (world: SpecWorld): Promise<string> => {
  if ((await inHandOf(world).accountFor(ORGANISER)) === undefined) {
    assert.ok(
      world.accountsInHand !== undefined,
      "This scenario has nothing to make an account with.",
    );
    await world.accountsInHand.give(ORGANISER, {
      confirmed: true,
      name: "Ollie Organiser",
    });
  }
  return (await accountFor(world, ORGANISER)).value;
};

// The tournament the scenario calls `name`, made if the scenario has not, so
// that a scenario can say a player of one without first saying there is one.
const tournamentCalled = async (
  world: SpecWorld,
  name: string,
): Promise<string> => {
  const known = scenarioOf(world).byName.get(name);
  if (known !== undefined) return known.value;
  const account = await organiserIn(world);
  const answer = await inHandOf(world).send(
    new CreateTournament(
      account,
      "croquetscores.com",
      {
        name,
        starts: "2026-10-03T00:00:00Z",
        finishes: "2026-10-05T00:00:00Z",
        format: "Standard",
        sport: "ac",
        country: "au",
        region: "vic",
      },
      momentOf(world),
    ),
  );
  created(world, answer.id, name);
  await lookAt(world, answer.id);
  return answer.id.value;
};

const added = async (
  world: SpecWorld,
  tournamentName: string,
  representing: string | undefined,
): Promise<void> => {
  const tournament = await tournamentCalled(world, tournamentName);
  const account = await organiserIn(world);
  const own = keptFor(world);
  own.added += 1;
  const id = await inHandOf(world).send(
    new AddPlayer(
      account,
      tournament,
      {
        name: `Player ${String(own.added)}`,
        ...(representing === undefined ? {} : { representing }),
      },
      momentOf(world),
    ),
  );
  own.last = { tournament, id: id.value };
};

const lastAdded = (world: SpecWorld): Added => {
  const { last } = keptFor(world);
  assert.ok(last !== undefined, "The scenario has added no player.");
  return last;
};

Given("a tournament {string}", async function (this: SpecWorld, name: string) {
  await tournamentCalled(this, name);
});

Given(
  "a player of {string} represents {string}",
  async function (this: SpecWorld, tournament: string, representing: string) {
    await added(this, tournament, representing);
  },
);

Given(
  "a player of {string} represents nothing",
  async function (this: SpecWorld, tournament: string) {
    await added(this, tournament, undefined);
  },
);

Given(
  "{int} players of {string} each represent a club beginning {string}",
  async function (
    this: SpecWorld,
    count: number,
    tournament: string,
    beginning: string,
  ) {
    for (let each = 1; each <= count; each += 1) {
      await added(this, tournament, `${beginning} ${String(each)}`);
    }
  },
);

Given("that player is archived", async function (this: SpecWorld) {
  const { tournament, id } = lastAdded(this);
  await inHandOf(this).send(
    new ArchivePlayer(await organiserIn(this), tournament, id, momentOf(this)),
  );
});

Given("that player is restored", async function (this: SpecWorld) {
  const { tournament, id } = lastAdded(this);
  await inHandOf(this).send(
    new RestorePlayer(await organiserIn(this), tournament, id, momentOf(this)),
  );
});

// Changed to represent something else and nothing else: the name stays.
Given(
  "that player is changed to represent {string}",
  async function (this: SpecWorld, representing: string) {
    const { tournament, id } = lastAdded(this);
    await inHandOf(this).send(
      new UpdatePlayer(
        await organiserIn(this),
        tournament,
        id,
        {
          name: `Player ${String(keptFor(this).added)}`,
          representing,
          flag: undefined,
        },
        momentOf(this),
      ),
    );
  },
);

When(
  "what players represent matching {string} is found",
  async function (this: SpecWorld, typed: string) {
    try {
      this.answer = await inHandOf(this).ask(new RepresentingMatching(typed));
    } catch (failure) {
      this.failure = failure;
    }
  },
);

const foundBy = (world: SpecWorld): readonly string[] => {
  assert.equal(world.failure, undefined, "Finding them was refused.");
  return (world.answer as RepresentingFound).representing;
};

Then(
  "{string} is among those found",
  function (this: SpecWorld, representing: string) {
    const found = foundBy(this);
    assert.ok(found.includes(representing), `Found ${inspect(found)}.`);
  },
);

Then("none is found", function (this: SpecWorld) {
  assert.deepEqual(foundBy(this), []);
});

// "{int} are found" is said of the world ranking players as well, and
// `WorldRankingPlayersMatching.steps.ts` has it; this is the singular.
Then("{int} is found", function (this: SpecWorld, count: number) {
  assert.equal(foundBy(this).length, count);
});
