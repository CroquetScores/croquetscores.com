import { Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import {
  CompetitionsOfTournament,
  type ListedCompetition,
} from "../../../../../src/application/operations/tournaments/CompetitionsOfTournament.js";
import type { SpecWorld } from "../../../../support/world.js";
import {
  accountFor,
  ask,
  heldAccount,
  noTournament,
  tournamentNamed,
} from "../aRequest.js";

// The competitions answered, once the list was not refused: a step reading
// them from a refused list would say there are none when the truth is that
// nobody was told.
const answered = (world: SpecWorld): readonly ListedCompetition[] => {
  assert.equal(
    world.failure,
    undefined,
    `The list was refused: ${String(world.failure)}`,
  );
  return world.answer as readonly ListedCompetition[];
};

const names = (world: SpecWorld): string[] =>
  answered(world).map(({ name }) => name);

const competitionCalled = (
  world: SpecWorld,
  name: string,
): ListedCompetition => {
  const found = answered(world).find(
    (competition) => competition.name === name,
  );
  assert.ok(
    found !== undefined,
    `The competitions answered are ${JSON.stringify(names(world))}.`,
  );
  return found;
};

When(
  "the reader signed in to the account for {string} lists the competitions of {string}",
  async function (this: SpecWorld, address: string, name: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new CompetitionsOfTournament(account, tournamentNamed(this, name).value),
    );
  },
);

When(
  "the reader signed in to that account lists the competitions of {string}",
  async function (this: SpecWorld, name: string) {
    await ask(
      this,
      new CompetitionsOfTournament(
        heldAccount(this),
        tournamentNamed(this, name).value,
      ),
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the competitions of a tournament there is not",
  async function (this: SpecWorld, address: string) {
    const account = (await accountFor(this, address)).value;
    await ask(
      this,
      new CompetitionsOfTournament(account, noTournament().value),
    );
  },
);

Then("no competitions are answered", function (this: SpecWorld) {
  assert.deepEqual(names(this), []);
});

Then(
  "the first competition answered is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(
      names(this)[0],
      name,
      `The competitions answered are ${JSON.stringify(names(this))}.`,
    );
  },
);

Then(
  "the competition {string} is answered as archived",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionCalled(this, name).archived, true);
  },
);

Then(
  "the competition {string} is answered as not archived",
  function (this: SpecWorld, name: string) {
    assert.equal(competitionCalled(this, name).archived, false);
  },
);

Then(
  "the competition {string} is answered with the slug {string}",
  function (this: SpecWorld, name: string, slug: string) {
    assert.equal(competitionCalled(this, name).slug, slug);
  },
);

// Said as the features say a kind, "a Swiss" among them, and answered as the
// application writes one.
Then(
  /^the competition "([^"]*)" is answered as a (block|knockout|Swiss)$/,
  function (this: SpecWorld, name: string, kind: string) {
    assert.equal(competitionCalled(this, name).kind, kind.toLowerCase());
  },
);

// Its shape --------------------------------------------------------------------

Then(
  "the competition {string} is answered as the best of {int}",
  function (this: SpecWorld, name: string, games: number) {
    const competition = competitionCalled(this, name);
    assert.ok(
      competition.kind !== "knockout",
      `${name} is answered as a knockout.`,
    );
    assert.equal(competition.bestOf, games);
  },
);

const knockoutCalled = (
  world: SpecWorld,
  name: string,
): Extract<ListedCompetition, { kind: "knockout" }> => {
  const competition = competitionCalled(world, name);
  assert.ok(
    competition.kind === "knockout",
    `${name} is answered as a ${competition.kind}.`,
  );
  return competition;
};

Then(
  "the knockout {string} is answered with {int} places",
  function (this: SpecWorld, name: string, places: number) {
    assert.equal(knockoutCalled(this, name).places, places);
  },
);

Then(
  /^the (first|second) round of the knockout "([^"]*)" is answered as the best of (\d+)$/,
  function (this: SpecWorld, round: string, name: string, games: string) {
    assert.equal(
      knockoutCalled(this, name).rounds[round === "first" ? 0 : 1],
      Number(games),
    );
  },
);
