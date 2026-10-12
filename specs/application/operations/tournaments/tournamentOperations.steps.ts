import { Given, Then } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import { AddBlock } from "../../../../src/application/operations/tournaments/AddBlock.js";
import { AddKnockout } from "../../../../src/application/operations/tournaments/AddKnockout.js";
import { AddManager } from "../../../../src/application/operations/tournaments/AddManager.js";
import { AddPlayer } from "../../../../src/application/operations/tournaments/AddPlayer.js";
import { AddScorer } from "../../../../src/application/operations/tournaments/AddScorer.js";
import { AddSwiss } from "../../../../src/application/operations/tournaments/AddSwiss.js";
import { ArchiveCompetition } from "../../../../src/application/operations/tournaments/ArchiveCompetition.js";
import { ArchivePlayer } from "../../../../src/application/operations/tournaments/ArchivePlayer.js";
import { RestorePlayer } from "../../../../src/application/operations/tournaments/RestorePlayer.js";
import { MoveCompetition } from "../../../../src/application/operations/tournaments/MoveCompetition.js";
import { UpdatePlayer } from "../../../../src/application/operations/tournaments/UpdatePlayer.js";
import { ArchiveTournament } from "../../../../src/application/operations/tournaments/ArchiveTournament.js";
import { RestoreTournament } from "../../../../src/application/operations/tournaments/RestoreTournament.js";
import {
  type CreatedTournament,
  CreateTournament,
} from "../../../../src/application/operations/tournaments/CreateTournament.js";
import { RemoveManager } from "../../../../src/application/operations/tournaments/RemoveManager.js";
import { RemoveScorer } from "../../../../src/application/operations/tournaments/RemoveScorer.js";
import type { TournamentRequest } from "../../../../src/application/operations/tournaments/tournamentOperations.js";
import { UpdateTournament } from "../../../../src/application/operations/tournaments/UpdateTournament.js";
import type { Command } from "../../../../src/application/common/Command.js";
import type { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../../src/domain/aggregates/tournaments/Tournament.js";
import { Sport } from "../../../../src/domain/aggregates/tournaments/value-objects/Sport.js";
import type { SpecWorld } from "../../../support/world.js";
import { scenarioOf as domainScenarioOf } from "../../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  competitionNamed,
  playerNamed,
  tournamentOf,
} from "../../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  accountFor,
  created,
  inHandOf,
  load,
  lookAt,
  momentOf,
  scenarioOf,
  tournamentNamed,
} from "./aRequest.js";
import { competitionIn } from "./requests.js";

// The steps more than one of a tournament's operations uses: what was done
// before the request the scenario is about, what the request says, and what
// the tournament is afterwards. Each operation's own steps are beside its
// feature, in the folder named for it.

// What was done before -------------------------------------------------------

// Done as the account for `address`, and not refused: a scenario that says it
// was done is not about whether it could be.
const done = async <TResult>(
  world: SpecWorld,
  command: Command<TResult>,
): Promise<TResult> => inHandOf(world).send(command);

// A tournament made before the scenario's own request, as well made as the
// scenario leaves it: the Spring Open, from 3 to 5 October 2026, in Victoria.
const aTournament = (
  name: string,
  changed: Partial<TournamentRequest> = {},
): TournamentRequest => ({
  name,
  starts: "2026-10-03T00:00:00Z",
  finishes: "2026-10-05T00:00:00Z",
  format: "Standard",
  sport: "ac",
  country: "au",
  region: "vic",
  ...changed,
});

const createdBefore = async (
  world: SpecWorld,
  address: string,
  request: TournamentRequest,
  website = "croquetscores.com",
): Promise<void> => {
  const account = await accountFor(world, address);
  const answer: CreatedTournament = await done(
    world,
    new CreateTournament(account.value, website, request, momentOf(world)),
  );
  created(world, answer.id, request.name);
  await lookAt(world, answer.id);
};

// What the scenario said the next tournament it creates is to be, where it
// said: its days, its sport, and where it is played. A start said with no
// finish is a tournament of one day, and a country said with no region is a
// tournament in none of its regions, so that saying one never makes the other
// wrong.
const saidOfNext = (world: SpecWorld): Partial<TournamentRequest> => {
  const said = domainScenarioOf(world).creating;
  return {
    ...(said.starts === undefined
      ? {}
      : { starts: said.starts, finishes: said.finishes ?? said.starts }),
    ...(said.finishes === undefined ? {} : { finishes: said.finishes }),
    ...(world.sport === undefined ? {} : { sport: world.sport.code }),
    ...(said.country === undefined
      ? {}
      : { country: said.country, region: said.region ?? undefined }),
  };
};

// In the format the scenario said the next tournament is to be played in,
// where it said one, and as it said otherwise.
Given(
  "{string} has created the tournament {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await createdBefore(
      this,
      address,
      aTournament(name, {
        format: this.tournamentFormat?.name ?? "Standard",
        ...saidOfNext(this),
      }),
    );
  },
);

// Each said of the next tournament the scenario creates, in the words the
// tournament's own features say it in.
Given(
  "the tournament is to be for the sport {string}",
  function (this: SpecWorld, code: string) {
    this.sportSaid = code;
    this.sport = Sport.from(code);
  },
);

Given(
  "the tournament is to be played in the country {string}",
  function (this: SpecWorld, code: string) {
    domainScenarioOf(this).creating.country = code;
  },
);

Given(
  "the tournament is to be played in the region {string}",
  function (this: SpecWorld, code: string) {
    domainScenarioOf(this).creating.region = code;
  },
);

// On the website `website`, in the first sport its site offers.
Given(
  "{string} has created the tournament {string} on {string}",
  async function (
    this: SpecWorld,
    address: string,
    name: string,
    website: string,
  ) {
    await createdBefore(
      this,
      address,
      aTournament(name, {
        sport: website.includes("gateball") ? "gb" : "ac",
      }),
      website,
    );
  },
);

Given(
  "{string} has created the tournament {string} starting at {string} in the sport {string}",
  async function (
    this: SpecWorld,
    address: string,
    name: string,
    starts: string,
    sport: string,
  ) {
    await createdBefore(
      this,
      address,
      aTournament(name, { starts, finishes: starts, sport }),
    );
  },
);

// Left to the tournament to decide it does not count towards the world
// rankings, as one allowing drawn games cannot (create.feature).
Given(
  "{string} has created the tournament {string} allowing drawn games",
  async function (this: SpecWorld, address: string, name: string) {
    await createdBefore(
      this,
      address,
      aTournament(name, { drawsAllowed: true }),
    );
  },
);

// What `as` is, said again with `changed`, since an update says everything the
// tournament is, and one without its subtitle would take it away.
const requestFor = (
  as: Tournament,
  changed: Partial<TournamentRequest>,
): TournamentRequest => ({
  name: as.name.toString(),
  starts: as.starts.toISOString(),
  finishes: as.finishes.toISOString(),
  format: as.format.name,
  sport: as.sport.code,
  country: as.country.code,
  region: as.region?.code,
  ...(as.subtitle === undefined ? {} : { subtitle: as.subtitle.markdown }),
  handicap: as.handicap,
  drawsAllowed: as.drawsAllowed,
  levelTestsDrawn: as.levelTestsDrawn,
  worldRankings: as.worldRankings,
  national: as.national,
  international: as.international,
  ...changed,
});

// The request to update `tournament` to what it is, with `changed`.
const updated = async (
  world: SpecWorld,
  address: string,
  tournament: TournamentId,
  changed: Partial<TournamentRequest>,
): Promise<void> => {
  const account = await accountFor(world, address);
  await done(
    world,
    new UpdateTournament(
      account.value,
      tournament.value,
      requestFor(await load(world, tournament), changed),
      momentOf(world),
    ),
  );
  await lookAt(world, tournament);
};

Given(
  "{string} has moved the tournament {string} to the sport {string}",
  async function (
    this: SpecWorld,
    address: string,
    name: string,
    sport: string,
  ) {
    await updated(this, address, tournamentNamed(this, name), { sport });
  },
);

// Something done to the tournament `name` as the account for `address`.
const doneTo = async (
  world: SpecWorld,
  address: string,
  name: string,
  making: (
    account: string,
    tournament: TournamentId,
  ) => Promise<Command<unknown>>,
): Promise<void> => {
  const account = await accountFor(world, address);
  const tournament = tournamentNamed(world, name);
  await done(world, await making(account.value, tournament));
  await lookAt(world, tournament);
};

Given(
  "{string} has archived the tournament {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new ArchiveTournament(account, tournament.value, momentOf(this)),
      ),
    );
  },
);

Given(
  "{string} has restored the tournament {string}",
  async function (this: SpecWorld, address: string, name: string) {
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new RestoreTournament(account, tournament.value, momentOf(this)),
      ),
    );
  },
);

// Representing what the scenario said the player is to represent, and flying
// the flag it said they are to fly, as adding one in the scenario's own
// request does, so that a scenario can say what a player already added is.
Given(
  "{string} has added the player {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
  ) {
    const { representing, flag, worldRankingName } =
      domainScenarioOf(this).player;
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new AddPlayer(
          account,
          tournament.value,
          {
            name: player,
            ...(representing === undefined ? {} : { representing }),
            ...(flag === undefined ? {} : { flag }),
            ...(worldRankingName === undefined ? {} : { worldRankingName }),
          },
          momentOf(this),
        ),
      ),
    );
  },
);

Given(
  "{string} has archived the player {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
  ) {
    await doneTo(this, address, name, async (account, tournament) => {
      const found = playerNamed(await load(this, tournament), player);
      return new ArchivePlayer(
        account,
        tournament.value,
        found.id.value,
        momentOf(this),
      );
    });
  },
);

Given(
  "{string} has restored the player {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
  ) {
    await doneTo(this, address, name, async (account, tournament) => {
      const found = playerNamed(await load(this, tournament), player);
      return new RestorePlayer(
        account,
        tournament.value,
        found.id.value,
        momentOf(this),
      );
    });
  },
);

// Renamed and nothing else: what the player represents and the flag they fly
// are said again as they are, since an update says everything again.
Given(
  /^"([^"]*)" has renamed the player "([^"]*)" (?:of|in) "([^"]*)" to "([^"]*)"$/,
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
    renamed: string,
  ) {
    await doneTo(this, address, name, async (account, tournament) => {
      const found = playerNamed(await load(this, tournament), player);
      return new UpdatePlayer(
        account,
        tournament.value,
        found.id.value,
        {
          name: renamed,
          representing: found.representing,
          flag: found.flag === undefined ? undefined : String(found.flag),
        },
        momentOf(this),
      );
    });
  },
);

// A competition added before the scenario's own request is the best of 1, or
// a draw of four places each round the best of 1.
Given(
  "{string} has added the block {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    block: string,
    name: string,
  ) {
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new AddBlock(
          account,
          tournament.value,
          block,
          // The best of 1, where the scenario says nothing else.
          domainScenarioOf(this).competition.bestOf ?? 1,
          domainScenarioOf(this).competition.rounds ?? 1,
          momentOf(this),
        ),
      ),
    );
  },
);

Given(
  "{string} has added the Swiss {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    swiss: string,
    name: string,
  ) {
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new AddSwiss(account, tournament.value, swiss, 1, momentOf(this)),
      ),
    );
  },
);

Given(
  "{string} has added the knockout {string} to {string}",
  async function (
    this: SpecWorld,
    address: string,
    knockout: string,
    name: string,
  ) {
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new AddKnockout(
          account,
          tournament.value,
          knockout,
          // Four places, and each round the best of 1, where the scenario
          // says nothing else.
          domainScenarioOf(this).drawPlaces ?? 4,
          Array.from(
            { length: Math.log2(domainScenarioOf(this).drawPlaces ?? 4) },
            (_, round) => domainScenarioOf(this).drawRounds[round] ?? 1,
          ),
          momentOf(this),
        ),
      ),
    );
  },
);

Given(
  "{string} has archived the competition {string} in {string}",
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
  ) {
    await doneTo(this, address, name, async (account, tournament) => {
      const id = await competitionIn(this, tournament, competition);
      return new ArchiveCompetition(
        account,
        tournament.value,
        id.value,
        momentOf(this),
      );
    });
  },
);

Given(
  "{string} has moved the competition {string} in {string} up",
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
  ) {
    await doneTo(this, address, name, async (account, tournament) => {
      const id = await competitionIn(this, tournament, competition);
      return new MoveCompetition(
        account,
        tournament.value,
        id.value,
        "up",
        momentOf(this),
      );
    });
  },
);

Given(
  "{string} has made {string} a manager of {string}",
  async function (
    this: SpecWorld,
    address: string,
    made: string,
    name: string,
  ) {
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new AddManager(account, tournament.value, made, momentOf(this)),
      ),
    );
  },
);

Given(
  "{string} has made {string} a scorer of {string}",
  async function (
    this: SpecWorld,
    address: string,
    made: string,
    name: string,
  ) {
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new AddScorer(account, tournament.value, made, momentOf(this)),
      ),
    );
  },
);

Given(
  "{string} has taken {string} off the managers of {string}",
  async function (this: SpecWorld, address: string, off: string, name: string) {
    const manager = await accountFor(this, off);
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new RemoveManager(
          account,
          tournament.value,
          manager.value,
          momentOf(this),
        ),
      ),
    );
  },
);

Given(
  "{string} has taken {string} off the scorers of {string}",
  async function (this: SpecWorld, address: string, off: string, name: string) {
    const scorer = await accountFor(this, off);
    await doneTo(this, address, name, (account, tournament) =>
      Promise.resolve(
        new RemoveScorer(
          account,
          tournament.value,
          scorer.value,
          momentOf(this),
        ),
      ),
    );
  },
);

// What the request says ----------------------------------------------------

// A value as typed, where the scenario says something none of the
// tournament's own steps could make.
Given(
  "the request says the {word} is {string}",
  function (this: SpecWorld, field: string, value: string) {
    scenarioOf(this).says[field] = value;
  },
);

Given(
  "the request says the subtitle is {int} characters long",
  function (this: SpecWorld, length: number) {
    scenarioOf(this).says.subtitle = "n".repeat(length);
  },
);

// What came of it ----------------------------------------------------------------

Then(
  "nothing more is recorded of the tournament",
  async function (this: SpecWorld) {
    const { looking, eventsBefore } = scenarioOf(this);
    assert.ok(looking !== undefined, "The scenario looks at no tournament.");
    assert.equal((await inHandOf(this).eventsOf(looking)).length, eventsBefore);
  },
);

Then(
  "the last thing the tournament recorded was caused by the account for {string}",
  async function (this: SpecWorld, address: string) {
    const { looking } = scenarioOf(this);
    assert.ok(looking !== undefined, "The scenario looks at no tournament.");
    const events = await inHandOf(this).eventsOf(looking);
    const last = events.at(-1);
    assert.ok(last !== undefined, "The tournament recorded nothing.");
    assert.ok(last.createdBy.equals(await accountFor(this, address)));
  },
);

Then(
  "the account for {string} manages the tournament",
  async function (this: SpecWorld, address: string) {
    assert.equal(
      tournamentOf(this).manages(await accountFor(this, address)),
      true,
    );
  },
);

Then(
  "the account for {string} does not manage the tournament",
  async function (this: SpecWorld, address: string) {
    assert.equal(
      tournamentOf(this).manages(await accountFor(this, address)),
      false,
    );
  },
);

Then(
  "the account for {string} scores the tournament",
  async function (this: SpecWorld, address: string) {
    assert.equal(
      tournamentOf(this).scores(await accountFor(this, address)),
      true,
    );
  },
);

Then(
  "the account for {string} does not score the tournament",
  async function (this: SpecWorld, address: string) {
    assert.equal(
      tournamentOf(this).scores(await accountFor(this, address)),
      false,
    );
  },
);

Then(
  "it is answered with the id of the tournament's player {string}",
  function (this: SpecWorld, name: string) {
    const id = playerNamed(tournamentOf(this), name).id;
    assert.ok(
      id.equals(this.answer as TournamentId),
      `It was answered with ${String(this.answer)}.`,
    );
  },
);

Then(
  "it is answered with the id of the tournament's competition {string}",
  function (this: SpecWorld, name: string) {
    const id = competitionNamed(tournamentOf(this), name).reference.id;
    assert.ok(
      id.equals(this.answer as TournamentId),
      `It was answered with ${String(this.answer)}.`,
    );
  },
);
