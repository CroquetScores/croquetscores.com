import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import { AddBlock } from "../../../../../src/application/operations/tournaments/AddBlock.js";
import { AddPlayer } from "../../../../../src/application/operations/tournaments/AddPlayer.js";
import {
  type CreatedTournament,
  CreateTournament,
} from "../../../../../src/application/operations/tournaments/CreateTournament.js";
import { Search } from "../../../../../src/application/operations/tournaments/Search.js";
import type { SearchFound } from "../../../../../src/application/operations/tournaments/searching.js";
import { ChangePlayerWorldRankingName } from "../../../../../src/application/operations/tournaments/ChangePlayerWorldRankingName.js";
import { playerNamed } from "../../../../domain/aggregates/tournaments/tournament/aTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  created,
  inHandOf,
  load,
  momentOf,
  tournamentNamed,
} from "../aRequest.js";

// What the scenarios here do and say of a search of a website for the words
// typed (`Search.feature`). Asked with nobody signed in, as a reader of the
// public site is.

// The account the scenarios here have everything done as, where a step does
// not name one: the organiser every scenario's background gives.
const ORGANISER = "organiser@example.com";

const searched = async (
  world: SpecWorld,
  website: string,
  text: unknown,
): Promise<void> => {
  try {
    world.answer = await inHandOf(world).ask(
      new Search(website, text as string),
    );
  } catch (failure) {
    world.failure = failure;
  }
};

const found = (world: SpecWorld): SearchFound => {
  assert.ok(
    world.answer !== undefined,
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as SearchFound;
};

// Each said of the next tournament the scenario creates, which is how a
// tournament made here is as well made as the rest.
const tournamentCalled = (world: SpecWorld, name: string) => ({
  name,
  starts: "2026-10-03T00:00:00Z",
  finishes: "2026-10-05T00:00:00Z",
  format: "Standard",
  sport: world.sport?.code ?? "ac",
  country: "au",
  region: "vic" as string | undefined,
});

// Before the scenario's own search ------------------------------------------

Given(
  "{string} has changed the world ranking name of the player {string} in {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
    worldRankingName: string,
  ) {
    const account = await accountFor(this, address);
    const tournament = tournamentNamed(this, name);
    const known = playerNamed(await load(this, tournament), player);
    await inHandOf(this).send(
      new ChangePlayerWorldRankingName(
        account.value,
        tournament.value,
        known.id.value,
        worldRankingName,
        momentOf(this),
      ),
    );
  },
);

Given(
  /^(\d+) tournaments are called "([^"]*)" followed by a number$/,
  async function (this: SpecWorld, count: string, name: string) {
    const account = await accountFor(this, ORGANISER);
    for (let number = 1; number <= Number(count); number += 1) {
      const request = tournamentCalled(this, `${name} ${String(number)}`);
      const answer: CreatedTournament = await inHandOf(this).send(
        new CreateTournament(
          account.value,
          "croquetscores.com",
          request,
          momentOf(this),
        ),
      );
      created(this, answer.id, request.name);
    }
  },
);

Given(
  /^(\d+) players are called "([^"]*)" followed by a number in "([^"]*)"$/,
  async function (this: SpecWorld, count: string, name: string, of: string) {
    const account = await accountFor(this, ORGANISER);
    const tournament = tournamentNamed(this, of);
    for (let number = 1; number <= Number(count); number += 1) {
      await inHandOf(this).send(
        new AddPlayer(
          account.value,
          tournament.value,
          { name: `${name} ${String(number)}` },
          momentOf(this),
        ),
      );
    }
  },
);

Given(
  /^(\d+) blocks are called "([^"]*)" followed by a number in "([^"]*)"$/,
  async function (this: SpecWorld, count: string, name: string, of: string) {
    const account = await accountFor(this, ORGANISER);
    const tournament = tournamentNamed(this, of);
    for (let number = 1; number <= Number(count); number += 1) {
      await inHandOf(this).send(
        new AddBlock(
          account.value,
          tournament.value,
          `${name} ${String(number)}`,
          1,
          1,
          momentOf(this),
        ),
      );
    }
  },
);

// The search itself --------------------------------------------------------

When(
  "the website is searched for {string}",
  async function (this: SpecWorld, text: string) {
    await searched(this, "croquetscores.com", text);
  },
);

When(
  "the website {string} is searched for {string}",
  async function (this: SpecWorld, website: string, text: string) {
    await searched(this, website, text);
  },
);

When(
  "the website is searched for something that is not text",
  async function (this: SpecWorld) {
    await searched(this, "croquetscores.com", 42);
  },
);

// What was found -------------------------------------------------------------

Then(
  "the tournament {string} is found",
  function (this: SpecWorld, name: string) {
    assert.ok(
      found(this).tournaments.some((each) => each.name === name),
      `${name} is not found.`,
    );
  },
);

Then(
  "the tournament {string} is not found",
  function (this: SpecWorld, name: string) {
    assert.ok(
      !found(this).tournaments.some((each) => each.name === name),
      `${name} is found.`,
    );
  },
);

Then("the player {string} is found", function (this: SpecWorld, name: string) {
  assert.ok(
    found(this).players.some((each) => each.name === name),
    `${name} is not found.`,
  );
});

Then(
  "the player {string} is not found",
  function (this: SpecWorld, name: string) {
    assert.ok(
      !found(this).players.some((each) => each.name === name),
      `${name} is found.`,
    );
  },
);

Then(
  "the player {string} is found at the address {string}",
  function (this: SpecWorld, name: string, address: string) {
    const player = found(this).players.find((each) => each.name === name);
    assert.ok(player !== undefined, `${name} is not found.`);
    assert.equal(player.address, address);
  },
);

Then(
  "the competition {string} is found",
  function (this: SpecWorld, name: string) {
    assert.ok(
      found(this).competitions.some((each) => each.name === name),
      `${name} is not found.`,
    );
  },
);

Then(
  "the competition {string} is not found",
  function (this: SpecWorld, name: string) {
    assert.ok(
      !found(this).competitions.some((each) => each.name === name),
      `${name} is found.`,
    );
  },
);

Then(
  "the competition {string} is found in the tournament {string}",
  function (this: SpecWorld, name: string, tournament: string) {
    const competition = found(this).competitions.find(
      (each) => each.name === name,
    );
    assert.ok(competition !== undefined, `${name} is not found.`);
    assert.equal(competition.tournament.name, tournament);
  },
);

Then(
  "the competition {string} is found at the address {string}",
  function (this: SpecWorld, name: string, address: string) {
    const competition = found(this).competitions.find(
      (each) => each.name === name,
    );
    assert.ok(competition !== undefined, `${name} is not found.`);
    assert.equal(competition.address, address);
  },
);

Then(
  /^the search found (\d+) (tournaments?|players?|competitions?)$/,
  function (this: SpecWorld, count: string, kind: string) {
    const lists = found(this);
    const list = kind.startsWith("tournament")
      ? lists.tournaments
      : kind.startsWith("player")
        ? lists.players
        : lists.competitions;
    assert.equal(list.length, Number(count));
  },
);

Then(
  /^the (first|second|third|fourth) (tournament|player|competition) the search found is "(.*)"$/,
  function (this: SpecWorld, which: string, kind: string, name: string) {
    const lists = found(this);
    const list =
      kind === "tournament"
        ? lists.tournaments
        : kind === "player"
          ? lists.players
          : lists.competitions;
    assert.equal(
      list[["first", "second", "third", "fourth"].indexOf(which)]?.name,
      name,
    );
  },
);

const tournamentFound = (world: SpecWorld, name: string) => {
  const tournament = found(world).tournaments.find(
    (each) => each.name === name,
  );
  assert.ok(tournament !== undefined, `${name} is not found.`);
  return tournament;
};

const competitionsTournament = (world: SpecWorld, name: string) => {
  const competition = found(world).competitions.find(
    (each) => each.name === name,
  );
  assert.ok(competition !== undefined, `${name} is not found.`);
  return competition.tournament;
};

Then(
  /^the tournament "(.*)" is found (starting|finishing) on "(.*)"$/,
  function (this: SpecWorld, name: string, which: string, day: string) {
    const tournament = tournamentFound(this, name);
    assert.equal(
      which === "starting" ? tournament.starts : tournament.finishes,
      day,
    );
  },
);

Then(
  "the tournament {string} is found in the country {string}",
  function (this: SpecWorld, name: string, country: string) {
    assert.equal(tournamentFound(this, name).country, country);
  },
);

Then(
  /^the competition "(.*)" is found in a tournament (starting|finishing) on "(.*)"$/,
  function (this: SpecWorld, name: string, which: string, day: string) {
    const tournament = competitionsTournament(this, name);
    assert.equal(
      which === "starting" ? tournament.starts : tournament.finishes,
      day,
    );
  },
);

Then(
  "the competition {string} is found in a tournament in the country {string}",
  function (this: SpecWorld, name: string, country: string) {
    assert.equal(competitionsTournament(this, name).country, country);
  },
);

Then(
  "the search is refused as {string}",
  function (this: SpecWorld, code: string) {
    assert.ok(this.failure !== undefined, "The search was not refused.");
    assert.equal((this.failure as { code?: string }).code, code);
  },
);

// Whether there were more of a kind than were answered, which is said of each
// kind apart.
Then(
  /^the search (said|did not say) there are more (tournaments|players|competitions)$/,
  function (this: SpecWorld, which: string, kind: string) {
    const more = found(this).more;
    assert.equal(
      more[kind as keyof typeof more],
      which === "said",
      `The search ${which === "said" ? "did not say" : "said"} there are more ${kind}.`,
    );
  },
);
