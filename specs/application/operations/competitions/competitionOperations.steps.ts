import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";
import { inspect } from "node:util";

import type { Command } from "../../../../src/application/common/Command.js";
import { AddGame } from "../../../../src/application/operations/competitions/AddGame.js";
import { ArchiveGame } from "../../../../src/application/operations/competitions/ArchiveGame.js";
import {
  CorrectGame,
  type CorrectedScores,
} from "../../../../src/application/operations/competitions/CorrectGame.js";
import {
  GamesOfCompetition,
  type ListedGame,
} from "../../../../src/application/operations/competitions/GamesOfCompetition.js";
import { RestoreGame } from "../../../../src/application/operations/competitions/RestoreGame.js";
import { EnterPlayer } from "../../../../src/application/operations/competitions/EnterPlayer.js";
import { MoveCompetitionPlayer } from "../../../../src/application/operations/competitions/MoveCompetitionPlayer.js";
import {
  type ListedCompetitionPlayer,
  PlayersOfCompetition,
} from "../../../../src/application/operations/competitions/PlayersOfCompetition.js";
import { RemovePlayer } from "../../../../src/application/operations/competitions/RemovePlayer.js";
import { ReverseWithdrawal } from "../../../../src/application/operations/competitions/ReverseWithdrawal.js";
import { WithdrawPlayer } from "../../../../src/application/operations/competitions/WithdrawPlayer.js";
import { MovePlayer } from "../../../../src/application/operations/tournaments/MovePlayer.js";
import type { Competition } from "../../../../src/domain/aggregates/tournaments/competitions/Competition.js";
import type { CompetitionPlayer } from "../../../../src/domain/aggregates/tournaments/competitions/CompetitionPlayer.js";
import type { Game } from "../../../../src/domain/aggregates/tournaments/competitions/Game.js";
import { GameId } from "../../../../src/domain/aggregates/tournaments/competitions/primitives/GameId.js";
import { CompetitionPlayerId } from "../../../../src/domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import type { CompetitionId } from "../../../../src/domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import { TournamentPlayerId } from "../../../../src/domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { SpecWorld } from "../../../support/world.js";
import { playerNamed } from "../../../domain/aggregates/tournaments/tournament/aTournament.js";
import {
  accountFor,
  ask,
  heldAccount,
  inHandOf,
  load,
  momentOf,
  noTournament,
  scenarioOf,
  send,
  tournamentNamed,
} from "../tournaments/aRequest.js";
import { competitionIn } from "../tournaments/requests.js";

// The steps of the operations on a competition's players, and of moving a
// tournament's player, which a competition's features say in the same breath.
// A competition is named by the tournament's name for it and the tournament's
// name, and a player in it by the tournament player they are.

// The account the reader is signed in to, as the session names it.
const asTheReader = async (
  world: SpecWorld,
  address: string,
): Promise<string> => (await accountFor(world, address)).value;

// A tournament player's id where the tournament has one called `name`, and
// one that names nobody where it has not, or where there is no tournament.
const tournamentPlayerIn = async (
  world: SpecWorld,
  tournament: TournamentId,
  name: string | undefined,
): Promise<TournamentPlayerId> => {
  if (name === undefined) return TournamentPlayerId.create();
  const found = await inHandOf(world).load(tournament);
  return found === undefined
    ? TournamentPlayerId.create()
    : playerNamed(found, name).id;
};

const competitionNow = async (
  world: SpecWorld,
  id: CompetitionId,
): Promise<Competition | undefined> => inHandOf(world).loadCompetition(id);

// The competition's player who is the tournament player called `name`, if it
// has them.
const competitionPlayerCalled = async (
  world: SpecWorld,
  tournament: TournamentId,
  competition: CompetitionId,
  name: string,
): Promise<CompetitionPlayer | undefined> => {
  const player = await tournamentPlayerIn(world, tournament, name);
  return (await competitionNow(world, competition))?.players.find((each) =>
    each.tournamentPlayerId.equals(player),
  );
};

// A competition's player's id where the competition has one called `name`,
// and one that names nobody where it has not.
const competitionPlayerIn = async (
  world: SpecWorld,
  tournament: TournamentId,
  competition: CompetitionId,
  name: string | undefined,
): Promise<CompetitionPlayerId> =>
  (name === undefined
    ? undefined
    : (await competitionPlayerCalled(world, tournament, competition, name))
        ?.id) ?? CompetitionPlayerId.create();

// What a request about a competition's player names: the tournament, the
// competition and the player, each as the scenario says it, or nothing that
// names anything where it says there is none.
interface Named {
  readonly tournament: TournamentId;
  readonly competition: CompetitionId;
  readonly player: CompetitionPlayerId;
}

const named = async (
  world: SpecWorld,
  tournament: TournamentId,
  competition: string | undefined,
  player: string | undefined,
): Promise<Named> => {
  const competitionId = await competitionIn(world, tournament, competition);
  return {
    tournament,
    competition: competitionId,
    player: await competitionPlayerIn(world, tournament, competitionId, player),
  };
};

type Making = (
  account: string,
  about: Named,
  at: ReadOnlyDate,
) => Command<unknown>;

const withdrawing: Making = (account, about, at) =>
  new WithdrawPlayer(
    account,
    about.tournament.value,
    about.competition.value,
    about.player.value,
    at,
  );

const sent = async (
  world: SpecWorld,
  account: string,
  about: Named,
  making: Making,
): Promise<void> => {
  await send(world, making(account, about, momentOf(world)), about.tournament);
};

const reversing: Making = (account, about, at) =>
  new ReverseWithdrawal(
    account,
    about.tournament.value,
    about.competition.value,
    about.player.value,
    at,
  );

const removing: Making = (account, about, at) =>
  new RemovePlayer(
    account,
    about.tournament.value,
    about.competition.value,
    about.player.value,
    at,
  );

const moving =
  (direction: string): Making =>
  (account, about, at) =>
    new MoveCompetitionPlayer(
      account,
      about.tournament.value,
      about.competition.value,
      about.player.value,
      direction,
      at,
    );

const entering = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  competition: string | undefined,
  player: string | undefined,
): Promise<void> => {
  const competitionId = await competitionIn(world, tournament, competition);
  const playerId = await tournamentPlayerIn(world, tournament, player);
  await send(
    world,
    new EnterPlayer(
      account,
      tournament.value,
      competitionId.value,
      playerId.value,
      momentOf(world),
    ),
    tournament,
  );
};

// What was done before ---------------------------------------------------------

// Not refused: a scenario that says something was done is not about whether
// it could be.
const doneAs = (world: SpecWorld): void => {
  assert.equal(
    world.failure,
    undefined,
    `It was refused: ${inspect(world.failure)}`,
  );
};

Given(
  "{string} has entered the player {string} in {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    competition: string,
    name: string,
  ) {
    await entering(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
      player,
    );
    doneAs(this);
  },
);

Given(
  /^"([^"]*)" has moved the player "([^"]*)" in "([^"]*)" of "([^"]*)" (up|down)$/,
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    competition: string,
    name: string,
    direction: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await sent(
      this,
      await asTheReader(this, address),
      await named(this, tournament, competition, player),
      moving(direction),
    );
    doneAs(this);
  },
);

Given(
  "{string} has withdrawn the player {string} from {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    competition: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await sent(
      this,
      await asTheReader(this, address),
      await named(this, tournament, competition, player),
      withdrawing,
    );
    doneAs(this);
  },
);

Given(
  "{string} has removed the player {string} from {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    competition: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await sent(
      this,
      await asTheReader(this, address),
      await named(this, tournament, competition, player),
      removing,
    );
    doneAs(this);
  },
);

// Moving a tournament's player -------------------------------------------------

const movingInTheTournament = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  player: string | undefined,
  direction: string,
): Promise<void> => {
  const playerId = await tournamentPlayerIn(world, tournament, player);
  await send(
    world,
    new MovePlayer(
      account,
      tournament.value,
      playerId.value,
      direction,
      momentOf(world),
    ),
    tournament,
  );
};

Given(
  /^"([^"]*)" has moved the player "([^"]*)" in "([^"]*)" (up|down)$/,
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
    direction: string,
  ) {
    await movingInTheTournament(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      player,
      direction,
    );
    doneAs(this);
  },
);

// Up, down, or a way that is neither, as a request could say one.
When(
  /^the reader signed in to the account for "([^"]*)" moves the player "([^"]*)" in "([^"]*)" (up|down|"[^"]*")$/,
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
    direction: string,
  ) {
    await movingInTheTournament(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      player,
      direction.replace(/^"|"$/g, ""),
    );
  },
);

When(
  "the reader signed in to that account moves the player {string} in {string} up",
  async function (this: SpecWorld, player: string, name: string) {
    await movingInTheTournament(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      player,
      "up",
    );
  },
);

When(
  "the reader signed in to the account for {string} moves a player {string} does not have up",
  async function (this: SpecWorld, address: string, name: string) {
    await movingInTheTournament(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      undefined,
      "up",
    );
  },
);

When(
  "the reader signed in to the account for {string} moves the player {string} in a tournament there is not up",
  async function (this: SpecWorld, address: string, player: string) {
    await movingInTheTournament(
      this,
      await asTheReader(this, address),
      noTournament(),
      player,
      "up",
    );
  },
);

// Entering a player ------------------------------------------------------------

When(
  "the reader signed in to the account for {string} enters the player {string} in {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    competition: string,
    name: string,
  ) {
    await entering(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
      player,
    );
  },
);

When(
  "the reader signed in to that account enters the player {string} in {string} of {string}",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    name: string,
  ) {
    await entering(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      competition,
      player,
    );
  },
);

When(
  "the reader signed in to the account for {string} enters a player {string} does not have in {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    _having: string,
    competition: string,
    name: string,
  ) {
    await entering(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
      undefined,
    );
  },
);

When(
  "the reader signed in to the account for {string} enters the player {string} in a competition {string} does not have",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    name: string,
  ) {
    await entering(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      undefined,
      player,
    );
  },
);

When(
  "the reader signed in to the account for {string} enters the player {string} in {string} of a tournament there is not",
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    competition: string,
  ) {
    await entering(
      this,
      await asTheReader(this, address),
      noTournament(),
      competition,
      player,
    );
  },
);

// Withdrawing, reversing, removing and moving a competition's player ----------

// Each of those said in every way the features say it: to a player there is,
// as the account for somebody or as the account held; to a player the
// competition does not have; in a competition the tournament does not have;
// and in a tournament there is not.
const sayings: readonly {
  readonly verb: string;
  readonly preposition: string;
  readonly making: Making;
  readonly after?: string;
}[] = [
  { verb: "withdraws", preposition: "in", making: withdrawing },
  {
    verb: "reverses the withdrawal of",
    preposition: "in",
    making: reversing,
  },
  { verb: "removes", preposition: "in", making: removing },
  { verb: "moves", preposition: "in", making: moving("up"), after: " up" },
  {
    verb: "moves",
    preposition: "in",
    making: moving("down"),
    after: " down",
  },
];

for (const { verb, preposition, making, after = "" } of sayings) {
  When(
    `the reader signed in to the account for {string} ${verb} the player {string} ${preposition} {string} of {string}${after}`,
    async function (
      this: SpecWorld,
      address: string,
      player: string,
      competition: string,
      name: string,
    ) {
      const tournament = tournamentNamed(this, name);
      await sent(
        this,
        await asTheReader(this, address),
        await named(this, tournament, competition, player),
        making,
      );
    },
  );

  if (verb !== "reverses the withdrawal of" && after !== " down") {
    When(
      `the reader signed in to that account ${verb} the player {string} ${preposition} {string} of {string}${after}`,
      async function (
        this: SpecWorld,
        player: string,
        competition: string,
        name: string,
      ) {
        const tournament = tournamentNamed(this, name);
        await sent(
          this,
          heldAccount(this),
          await named(this, tournament, competition, player),
          making,
        );
      },
    );
  }

  if (after === " down") continue;

  When(
    `the reader signed in to the account for {string} ${verb} a player {string} of {string} does not have${after}`,
    async function (
      this: SpecWorld,
      address: string,
      competition: string,
      name: string,
    ) {
      const tournament = tournamentNamed(this, name);
      await sent(
        this,
        await asTheReader(this, address),
        await named(this, tournament, competition, undefined),
        making,
      );
    },
  );

  if (verb === "reverses the withdrawal of") continue;

  When(
    `the reader signed in to the account for {string} ${verb} the player {string} ${preposition} a competition {string} does not have${after}`,
    async function (
      this: SpecWorld,
      address: string,
      player: string,
      name: string,
    ) {
      const tournament = tournamentNamed(this, name);
      await sent(
        this,
        await asTheReader(this, address),
        await named(this, tournament, undefined, player),
        making,
      );
    },
  );

  When(
    `the reader signed in to the account for {string} ${verb} the player {string} ${preposition} {string} of a tournament there is not${after}`,
    async function (
      this: SpecWorld,
      address: string,
      player: string,
      competition: string,
    ) {
      await sent(
        this,
        await asTheReader(this, address),
        await named(this, noTournament(), competition, player),
        making,
      );
    },
  );
}

// A way to move that is neither up nor down, as a request could say one.
When(
  /^the reader signed in to the account for "([^"]*)" moves the player "([^"]*)" in "([^"]*)" of "([^"]*)" "([^"]*)"$/,
  async function (
    this: SpecWorld,
    address: string,
    player: string,
    competition: string,
    name: string,
    direction: string,
  ) {
    const tournament = tournamentNamed(this, name);
    await sent(
      this,
      await asTheReader(this, address),
      await named(this, tournament, competition, player),
      moving(direction),
    );
  },
);

// Listing a competition's players ---------------------------------------------

const listing = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  competition: string | undefined,
): Promise<void> => {
  const id = await competitionIn(world, tournament, competition);
  await ask(
    world,
    new PlayersOfCompetition(account, tournament.value, id.value),
  );
};

When(
  "the reader signed in to the account for {string} lists the players of {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
  ) {
    await listing(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
    );
  },
);

When(
  "the reader signed in to that account lists the players of {string} of {string}",
  async function (this: SpecWorld, competition: string, name: string) {
    await listing(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      competition,
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the players of a competition {string} does not have",
  async function (this: SpecWorld, address: string, name: string) {
    await listing(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      undefined,
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the players of {string} of a tournament there is not",
  async function (this: SpecWorld, address: string, competition: string) {
    await listing(
      this,
      await asTheReader(this, address),
      noTournament(),
      competition,
    );
  },
);

// What the competition is afterwards ------------------------------------------

const theCompetition = async (
  world: SpecWorld,
  competition: string,
  name: string,
): Promise<{ tournament: TournamentId; competition: CompetitionId }> => {
  const tournament = tournamentNamed(world, name);
  return {
    tournament,
    competition: await competitionIn(world, tournament, competition),
  };
};

const playerOf = async (
  world: SpecWorld,
  player: string,
  competition: string,
  name: string,
): Promise<CompetitionPlayer> => {
  const about = await theCompetition(world, competition, name);
  const found = await competitionPlayerCalled(
    world,
    about.tournament,
    about.competition,
    player,
  );
  assert.ok(found !== undefined, `${competition} does not have ${player}.`);
  return found;
};

Then(
  "it is answered with the id of the player {string} in {string} of {string}",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    name: string,
  ) {
    assert.equal(
      this.answer,
      (await playerOf(this, player, competition, name)).id.value,
    );
  },
);

Then(
  "the competition {string} of {string} has the player {string}",
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    player: string,
  ) {
    await playerOf(this, player, competition, name);
  },
);

Then(
  "the competition {string} of {string} does not have the player {string}",
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    player: string,
  ) {
    const about = await theCompetition(this, competition, name);
    assert.equal(
      await competitionPlayerCalled(
        this,
        about.tournament,
        about.competition,
        player,
      ),
      undefined,
    );
  },
);

Then(
  "the player {string} in {string} of {string} has withdrawn",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    name: string,
  ) {
    assert.equal(
      (await playerOf(this, player, competition, name)).withdrawn,
      true,
    );
  },
);

Then(
  "the player {string} in {string} of {string} has not withdrawn",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    name: string,
  ) {
    assert.equal(
      (await playerOf(this, player, competition, name)).withdrawn,
      false,
    );
  },
);

// The competition's players in its order, by the tournament's names for them.
const namesInOrder = async (
  world: SpecWorld,
  competition: string,
  name: string,
): Promise<string[]> => {
  const about = await theCompetition(world, competition, name);
  const tournament = await load(world, about.tournament);
  const people = new Map(
    tournament.players.map((player) => [
      player.id.value,
      player.name.toString(),
    ]),
  );
  return ((await competitionNow(world, about.competition))?.players ?? []).map(
    (player) => people.get(player.tournamentPlayerId.value) ?? "nobody",
  );
};

const PLACES: Readonly<Record<string, number>> = {
  first: 0,
  second: 1,
  third: 2,
};

Then(
  /^the (first|second|third) player of "([^"]*)" of "([^"]*)" is "([^"]*)"$/,
  async function (
    this: SpecWorld,
    place: string,
    competition: string,
    name: string,
    player: string,
  ) {
    const names = await namesInOrder(this, competition, name);
    assert.equal(
      names[PLACES[place] ?? -1],
      player,
      `The players are ${JSON.stringify(names)}.`,
    );
  },
);

Then(
  "the last thing the competition {string} of {string} recorded was caused by the account for {string}",
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    address: string,
  ) {
    const about = await theCompetition(this, competition, name);
    const last = (await inHandOf(this).eventsOf(about.competition)).at(-1);
    assert.ok(last !== undefined, `${competition} recorded nothing.`);
    assert.ok(last.createdBy.equals(await accountFor(this, address)));
  },
);

Then(
  "nothing more is recorded of the competition {string} of {string}",
  async function (this: SpecWorld, competition: string, name: string) {
    const about = await theCompetition(this, competition, name);
    assert.equal(
      (await inHandOf(this).eventsOf(about.competition)).length,
      scenarioOf(this).competitionEventsBefore.get(about.competition.value) ??
        0,
    );
  },
);

// What a list of a competition's players answers -------------------------------

const listed = (world: SpecWorld): readonly ListedCompetitionPlayer[] => {
  assert.ok(
    Array.isArray(world.answer),
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as readonly ListedCompetitionPlayer[];
};

const listedCalled = (
  world: SpecWorld,
  name: string,
): ListedCompetitionPlayer => {
  const found = listed(world).find((player) => player.name === name);
  assert.ok(
    found !== undefined,
    `${name} was not answered: ${JSON.stringify(listed(world))}`,
  );
  return found;
};

Then("no players of the competition are answered", function (this: SpecWorld) {
  assert.deepEqual(listed(this), []);
});

Then(
  "the competition's player {string} is answered",
  function (this: SpecWorld, name: string) {
    listedCalled(this, name);
  },
);

Then(
  "the first player of the competition answered is {string}",
  function (this: SpecWorld, name: string) {
    assert.equal(listed(this)[0]?.name, name);
  },
);

Then(
  "the competition's player {string} is answered representing {string}",
  function (this: SpecWorld, name: string, representing: string) {
    assert.equal(listedCalled(this, name).representing, representing);
  },
);

Then(
  "the competition's player {string} is answered flying the flag {string}",
  function (this: SpecWorld, name: string, flag: string) {
    assert.equal(listedCalled(this, name).flag, flag);
  },
);

Then(
  "the competition's player {string} is answered as withdrawn",
  function (this: SpecWorld, name: string) {
    assert.equal(listedCalled(this, name).withdrawn, true);
  },
);

Then(
  "the competition's player {string} is answered as not withdrawn",
  function (this: SpecWorld, name: string) {
    assert.equal(listedCalled(this, name).withdrawn, false);
  },
);

Then(
  "the competition's player {string} is answered as drawn against {string}",
  function (this: SpecWorld, name: string, other: string) {
    assert.equal(
      listedCalled(this, name).drawnAgainst,
      listedCalled(this, other).id,
    );
  },
);

Then(
  "the competition's player {string} is answered as drawn against nobody",
  function (this: SpecWorld, name: string) {
    assert.equal(listedCalled(this, name).drawnAgainst, undefined);
  },
);

// Games ------------------------------------------------------------------------

// What a scenario names a game by: its players, by the tournament's names for
// them, and its scores as typed, where it says them.
const GAME = String.raw`"([^"]*)" beating "([^"]*)"`;
const SCORES = String.raw`(\S+) to (\S+)`;

const addingAs = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  competition: string | undefined,
  game: {
    readonly winner?: string | undefined;
    readonly winnerScore?: string | undefined;
    readonly loser?: string | undefined;
    readonly loserScore?: string | undefined;
  },
): Promise<void> => {
  const competitionId = await competitionIn(world, tournament, competition);
  const player = async (name: string | undefined) =>
    name === undefined
      ? undefined
      : (await competitionPlayerIn(world, tournament, competitionId, name))
          .value;
  await send(
    world,
    new AddGame(
      account,
      tournament.value,
      competitionId.value,
      {
        winner: await player(game.winner),
        winnerScore: game.winnerScore,
        loser: await player(game.loser),
        loserScore: game.loserScore,
      },
      momentOf(world),
    ),
    tournament,
  );
};

// A game played before the scenario's own request, entered as the
// tournament's first manager, who created it.
Given(
  new RegExp(
    `^"([^"]*)" has beaten "([^"]*)" ${SCORES} in "([^"]*)" of "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    const manager = (await load(this, tournament)).managers[0];
    assert.ok(manager !== undefined, `${name} has no manager.`);
    await addingAs(this, manager.value, tournament, competition, {
      winner,
      winnerScore,
      loser,
      loserScore,
    });
    doneAs(this);
  },
);

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" adds the game of ${GAME} ${SCORES} in "([^"]*)" of "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
    name: string,
  ) {
    await addingAs(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
      { winner, winnerScore, loser, loserScore },
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to that account adds the game of ${GAME} ${SCORES} in "([^"]*)" of "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
    name: string,
  ) {
    await addingAs(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      competition,
      { winner, winnerScore, loser, loserScore },
    );
  },
);

// Each part as the request would leave it out.
const PARTS: Readonly<Record<string, string>> = {
  winner: "winner",
  "winner's score": "winnerScore",
  loser: "loser",
  "loser's score": "loserScore",
};

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" adds the game of ${GAME} ${SCORES} in "([^"]*)" of "([^"]*)" without its (winner|winner's score|loser|loser's score)$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
    name: string,
    part: string,
  ) {
    await addingAs(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
      {
        winner,
        winnerScore,
        loser,
        loserScore,
        [PARTS[part] ?? part]: undefined,
      },
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" adds a game of "([^"]*)" beating a player "([^"]*)" of "([^"]*)" does not have$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    competition: string,
    name: string,
  ) {
    const tournament = tournamentNamed(this, name);
    const competitionId = await competitionIn(this, tournament, competition);
    await send(
      this,
      new AddGame(
        await asTheReader(this, address),
        tournament.value,
        competitionId.value,
        {
          winner: (
            await competitionPlayerIn(this, tournament, competitionId, winner)
          ).value,
          winnerScore: "26",
          loser: CompetitionPlayerId.create().value,
          loserScore: "17",
        },
        momentOf(this),
      ),
      tournament,
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" adds the game of ${GAME} ${SCORES} in a competition "([^"]*)" does not have$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    name: string,
  ) {
    await addingAs(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      undefined,
      { winner, winnerScore, loser, loserScore },
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" adds the game of ${GAME} ${SCORES} in "([^"]*)" of a tournament there is not$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    competition: string,
  ) {
    await addingAs(
      this,
      await asTheReader(this, address),
      noTournament(),
      competition,
      { winner, winnerScore, loser, loserScore },
    );
  },
);

// The game of `winner` beating `loser` in the competition, the first there is
// where they played more than once.
const gameCalled = async (
  world: SpecWorld,
  tournament: TournamentId,
  competition: CompetitionId,
  winner: string,
  loser: string,
): Promise<Game | undefined> => {
  const found = await competitionNow(world, competition);
  if (found === undefined) return undefined;
  const winnerId = await competitionPlayerCalled(
    world,
    tournament,
    competition,
    winner,
  );
  const loserId = await competitionPlayerCalled(
    world,
    tournament,
    competition,
    loser,
  );
  return found.games.find(
    (game) =>
      winnerId !== undefined &&
      loserId !== undefined &&
      game.winner.equals(winnerId.id) &&
      game.loser.equals(loserId.id),
  );
};

type GameMaking = (
  account: string,
  tournament: TournamentId,
  competition: CompetitionId,
  game: GameId,
  at: ReadOnlyDate,
) => Command<unknown>;

const archiving: GameMaking = (account, tournament, competition, game, at) =>
  new ArchiveGame(account, tournament.value, competition.value, game.value, at);

const restoring: GameMaking = (account, tournament, competition, game, at) =>
  new RestoreGame(account, tournament.value, competition.value, game.value, at);

const gameSent = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  competition: string | undefined,
  said: { readonly winner: string; readonly loser: string } | undefined,
  making: GameMaking,
): Promise<void> => {
  const competitionId = await competitionIn(world, tournament, competition);
  const game =
    said === undefined
      ? undefined
      : await gameCalled(
          world,
          tournament,
          competitionId,
          said.winner,
          said.loser,
        );
  await send(
    world,
    making(
      account,
      tournament,
      competitionId,
      game?.id ?? GameId.create(),
      momentOf(world),
    ),
    tournament,
  );
};

for (const [verb, making] of [
  ["archive", archiving],
  ["restore", restoring],
] as const) {
  Given(
    new RegExp(
      `^"([^"]*)" has ${verb}d the score of ${GAME} in "([^"]*)" of "([^"]*)"$`,
    ),
    async function (
      this: SpecWorld,
      address: string,
      winner: string,
      loser: string,
      competition: string,
      name: string,
    ) {
      await gameSent(
        this,
        await asTheReader(this, address),
        tournamentNamed(this, name),
        competition,
        { winner, loser },
        making,
      );
      doneAs(this);
    },
  );

  When(
    new RegExp(
      `^the reader signed in to the account for "([^"]*)" ${verb}s the score of ${GAME} in "([^"]*)" of "([^"]*)"$`,
    ),
    async function (
      this: SpecWorld,
      address: string,
      winner: string,
      loser: string,
      competition: string,
      name: string,
    ) {
      await gameSent(
        this,
        await asTheReader(this, address),
        tournamentNamed(this, name),
        competition,
        { winner, loser },
        making,
      );
    },
  );

  When(
    new RegExp(
      `^the reader signed in to that account ${verb}s the score of ${GAME} in "([^"]*)" of "([^"]*)"$`,
    ),
    async function (
      this: SpecWorld,
      winner: string,
      loser: string,
      competition: string,
      name: string,
    ) {
      await gameSent(
        this,
        heldAccount(this),
        tournamentNamed(this, name),
        competition,
        { winner, loser },
        making,
      );
    },
  );

  When(
    `the reader signed in to the account for {string} ${verb}s a score {string} of {string} does not have`,
    async function (
      this: SpecWorld,
      address: string,
      competition: string,
      name: string,
    ) {
      await gameSent(
        this,
        await asTheReader(this, address),
        tournamentNamed(this, name),
        competition,
        undefined,
        making,
      );
    },
  );

  When(
    new RegExp(
      `^the reader signed in to the account for "([^"]*)" ${verb}s the score of ${GAME} in a competition "([^"]*)" does not have$`,
    ),
    async function (
      this: SpecWorld,
      address: string,
      winner: string,
      loser: string,
      name: string,
    ) {
      await gameSent(
        this,
        await asTheReader(this, address),
        tournamentNamed(this, name),
        undefined,
        { winner, loser },
        making,
      );
    },
  );

  When(
    new RegExp(
      `^the reader signed in to the account for "([^"]*)" ${verb}s the score of ${GAME} in "([^"]*)" of a tournament there is not$`,
    ),
    async function (
      this: SpecWorld,
      address: string,
      winner: string,
      loser: string,
      competition: string,
    ) {
      await gameSent(
        this,
        await asTheReader(this, address),
        noTournament(),
        competition,
        { winner, loser },
        making,
      );
    },
  );
}

// Correcting a game's scores ------------------------------------------------------

// A game's scores corrected, found as archiving and restoring find it: by its
// winner and its loser, or a game that names nothing where the scenario says
// the competition does not have it.
const correctingTo =
  (scores: CorrectedScores): GameMaking =>
  (account, tournament, competition, game, at) =>
    new CorrectGame(
      account,
      tournament.value,
      competition.value,
      game.value,
      scores,
      at,
    );

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" corrects the score of ${GAME} in "([^"]*)" of "([^"]*)" to ${SCORES}$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    competition: string,
    name: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await gameSent(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
      { winner, loser },
      correctingTo({ winnerScore, loserScore }),
    );
  },
);

// To other players, each named by their id in the competition, as the
// request names them.
When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" corrects the score of ${GAME} in "([^"]*)" of "([^"]*)" to ${GAME} ${SCORES}$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    competition: string,
    name: string,
    correctedWinner: string,
    correctedLoser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    const tournament = tournamentNamed(this, name);
    const competitionId = await competitionIn(this, tournament, competition);
    const player = async (called: string) =>
      (await competitionPlayerIn(this, tournament, competitionId, called))
        .value;
    await gameSent(
      this,
      await asTheReader(this, address),
      tournament,
      competition,
      { winner, loser },
      correctingTo({
        winnerScore,
        loserScore,
        winner: await player(correctedWinner),
        loser: await player(correctedLoser),
      }),
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" corrects the score of ${GAME} in "([^"]*)" of "([^"]*)" to ${SCORES} without its (winner|loser) score$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    competition: string,
    name: string,
    winnerScore: string,
    loserScore: string,
    without: "winner" | "loser",
  ) {
    await gameSent(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
      { winner, loser },
      correctingTo(without === "winner" ? { loserScore } : { winnerScore }),
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to that account corrects the score of ${GAME} in "([^"]*)" of "([^"]*)" to ${SCORES}$`,
  ),
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    competition: string,
    name: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await gameSent(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      competition,
      { winner, loser },
      correctingTo({ winnerScore, loserScore }),
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" corrects a score "([^"]*)" of "([^"]*)" does not have to ${SCORES}$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await gameSent(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
      undefined,
      correctingTo({ winnerScore, loserScore }),
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" corrects the score of ${GAME} in a competition "([^"]*)" does not have to ${SCORES}$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    name: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await gameSent(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      undefined,
      { winner, loser },
      correctingTo({ winnerScore, loserScore }),
    );
  },
);

When(
  new RegExp(
    `^the reader signed in to the account for "([^"]*)" corrects the score of ${GAME} in "([^"]*)" of a tournament there is not to ${SCORES}$`,
  ),
  async function (
    this: SpecWorld,
    address: string,
    winner: string,
    loser: string,
    competition: string,
    winnerScore: string,
    loserScore: string,
  ) {
    await gameSent(
      this,
      await asTheReader(this, address),
      noTournament(),
      competition,
      { winner, loser },
      correctingTo({ winnerScore, loserScore }),
    );
  },
);

// What the competition's games are afterwards ----------------------------------

Then(
  new RegExp(`^"([^"]*)" of "([^"]*)" has the score of ${GAME} ${SCORES}$`),
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    const about = await theCompetition(this, competition, name);
    const games = (await competitionNow(this, about.competition))?.games ?? [];
    const winnerId = await competitionPlayerCalled(
      this,
      about.tournament,
      about.competition,
      winner,
    );
    const loserId = await competitionPlayerCalled(
      this,
      about.tournament,
      about.competition,
      loser,
    );
    assert.ok(
      games.some(
        (game) =>
          winnerId !== undefined &&
          loserId !== undefined &&
          game.winner.equals(winnerId.id) &&
          game.loser.equals(loserId.id) &&
          String(game.winnerScore) === winnerScore &&
          String(game.loserScore) === loserScore,
      ),
      `${competition} has ${JSON.stringify(games.map(String))}.`,
    );
  },
);

Then(
  new RegExp(
    `^"([^"]*)" of "([^"]*)" does not have the score of ${GAME} ${SCORES}$`,
  ),
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
  ) {
    const about = await theCompetition(this, competition, name);
    const game = await gameCalled(
      this,
      about.tournament,
      about.competition,
      winner,
      loser,
    );
    assert.ok(
      game === undefined ||
        String(game.winnerScore) !== winnerScore ||
        String(game.loserScore) !== loserScore,
      `${competition} has ${String(game)}.`,
    );
  },
);

Then(
  "{string} of {string} has no scores",
  async function (this: SpecWorld, competition: string, name: string) {
    const about = await theCompetition(this, competition, name);
    assert.deepEqual(
      (await competitionNow(this, about.competition))?.games ?? [],
      [],
    );
  },
);

Then(
  new RegExp(
    `^it is answered with the id of the score of ${GAME} in "([^"]*)" of "([^"]*)"$`,
  ),
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    competition: string,
    name: string,
  ) {
    const about = await theCompetition(this, competition, name);
    const game = await gameCalled(
      this,
      about.tournament,
      about.competition,
      winner,
      loser,
    );
    assert.ok(game !== undefined, "There is no such game.");
    assert.equal(this.answer, game.id.value);
  },
);

Then(
  new RegExp(
    `^the score of ${GAME} in "([^"]*)" of "([^"]*)" is (not )?archived$`,
  ),
  async function (
    this: SpecWorld,
    winner: string,
    loser: string,
    competition: string,
    name: string,
    not: string | null,
  ) {
    const about = await theCompetition(this, competition, name);
    const game = await gameCalled(
      this,
      about.tournament,
      about.competition,
      winner,
      loser,
    );
    assert.ok(game !== undefined, "There is no such game.");
    assert.equal(game.archived, not === null);
  },
);

// Listing a competition's games -------------------------------------------------

const listingGames = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  competition: string | undefined,
): Promise<void> => {
  const id = await competitionIn(world, tournament, competition);
  await ask(world, new GamesOfCompetition(account, tournament.value, id.value));
};

When(
  "the reader signed in to the account for {string} lists the scores of {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
  ) {
    await listingGames(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
    );
  },
);

When(
  "the reader signed in to that account lists the scores of {string} of {string}",
  async function (this: SpecWorld, competition: string, name: string) {
    await listingGames(
      this,
      heldAccount(this),
      tournamentNamed(this, name),
      competition,
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the scores of a competition {string} does not have",
  async function (this: SpecWorld, address: string, name: string) {
    await listingGames(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      undefined,
    );
  },
);

When(
  "the reader signed in to the account for {string} lists the scores of {string} of a tournament there is not",
  async function (this: SpecWorld, address: string, competition: string) {
    await listingGames(
      this,
      await asTheReader(this, address),
      noTournament(),
      competition,
    );
  },
);

const gamesListed = (world: SpecWorld): readonly ListedGame[] => {
  assert.ok(
    Array.isArray(world.answer),
    `Nothing was answered: ${inspect(world.failure)}`,
  );
  return world.answer as readonly ListedGame[];
};

const gameListed = (
  world: SpecWorld,
  winner: string,
  loser: string,
  winnerScore: string,
  loserScore: string,
): ListedGame => {
  const found = gamesListed(world).find(
    (game) =>
      game.winner === winner &&
      game.loser === loser &&
      game.winnerScore === winnerScore &&
      game.loserScore === loserScore,
  );
  assert.ok(
    found !== undefined,
    `It was not answered: ${JSON.stringify(gamesListed(world))}`,
  );
  return found;
};

Then("no scores are answered", function (this: SpecWorld) {
  assert.deepEqual(gamesListed(this), []);
});

Then(
  new RegExp(
    `^the score of ${GAME} ${SCORES} is answered( as archived| as not archived| as one that can be archived| as one that cannot be archived)?$`,
  ),
  function (
    this: SpecWorld,
    winner: string,
    loser: string,
    winnerScore: string,
    loserScore: string,
    as: string | null,
  ) {
    const game = gameListed(this, winner, loser, winnerScore, loserScore);
    if (as === " as archived") assert.equal(game.archived, true);
    if (as === " as not archived") assert.equal(game.archived, false);
    if (as === " as one that can be archived")
      assert.equal(game.archivable, true);
    if (as === " as one that cannot be archived")
      assert.equal(game.archivable, false);
  },
);

Then(
  new RegExp(`^the first score answered is of ${GAME}$`),
  function (this: SpecWorld, winner: string, loser: string) {
    const [first] = gamesListed(this);
    assert.equal(
      `${first?.winner} beating ${first?.loser}`,
      `${winner} beating ${loser}`,
    );
  },
);

Then(
  new RegExp(`^the first score answered is ${SCORES}$`),
  function (this: SpecWorld, winnerScore: string, loserScore: string) {
    const [first] = gamesListed(this);
    assert.equal(
      `${first?.winnerScore} to ${first?.loserScore}`,
      `${winnerScore} to ${loserScore}`,
    );
  },
);

Then(
  /^the competition's player "([^"]*)" is answered as (not )?having played$/,
  function (this: SpecWorld, name: string, not: string | null) {
    assert.equal(listedCalled(this, name).hasPlayed, not === null);
  },
);

// Byes -------------------------------------------------------------------------

// A bye is entered as the tournament player whose every digit is 0, and moved
// and removed by its order, since every bye has the same id.

const enteringABye = async (
  world: SpecWorld,
  account: string,
  tournament: TournamentId,
  competition: string,
): Promise<void> => {
  const competitionId = await competitionIn(world, tournament, competition);
  await send(
    world,
    new EnterPlayer(
      account,
      tournament.value,
      competitionId.value,
      TournamentPlayerId.bye().value,
      momentOf(world),
    ),
    tournament,
  );
};

Given(
  "{string} has entered a bye in {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
  ) {
    await enteringABye(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
    );
    doneAs(this);
  },
);

When(
  "the reader signed in to the account for {string} enters a bye in {string} of {string}",
  async function (
    this: SpecWorld,
    address: string,
    competition: string,
    name: string,
  ) {
    await enteringABye(
      this,
      await asTheReader(this, address),
      tournamentNamed(this, name),
      competition,
    );
  },
);

Then("it is answered with {string}", function (this: SpecWorld, id: string) {
  assert.equal(this.answer, id, `It was refused: ${inspect(this.failure)}`);
});

// Asked again for a moment where the scenario pressed something on a page
// that does not wait for its answer, as a tab's buttons do not: what is kept
// is what the scenario reads, once it has been kept.
const keptSoon = async (checking: () => Promise<void>): Promise<void> => {
  for (let tries = 1; ; tries += 1) {
    try {
      await checking();
      return;
    } catch (failure) {
      if (tries >= 30) throw failure;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

const playersNow = async (
  world: SpecWorld,
  competition: string,
  name: string,
): Promise<readonly CompetitionPlayer[]> =>
  (
    await competitionNow(
      world,
      (await theCompetition(world, competition, name)).competition,
    )
  )?.players ?? [];

Then(
  /^the competition "([^"]*)" of "([^"]*)" has (\d+) byes?$/,
  async function (
    this: SpecWorld,
    competition: string,
    name: string,
    count: string,
  ) {
    await keptSoon(async () => {
      const byes = (await playersNow(this, competition, name)).filter(
        (player) => player.isBye,
      );
      assert.equal(byes.length, Number(count));
    });
  },
);

Then(
  /^the (first|second|third) player of "([^"]*)" of "([^"]*)" is a bye$/,
  async function (
    this: SpecWorld,
    place: string,
    competition: string,
    name: string,
  ) {
    await keptSoon(async () => {
      const player = (await playersNow(this, competition, name))[
        PLACES[place] ?? -1
      ];
      assert.equal(player?.isBye, true, `The ${place} player is not a bye.`);
    });
  },
);

const byeMaking =
  (action: "up" | "down" | "remove", order: number): Making =>
  (account, about, at) =>
    action === "remove"
      ? new RemovePlayer(
          account,
          about.tournament.value,
          about.competition.value,
          CompetitionPlayerId.bye().value,
          at,
          order,
        )
      : new MoveCompetitionPlayer(
          account,
          about.tournament.value,
          about.competition.value,
          CompetitionPlayerId.bye().value,
          action,
          at,
          order,
        );

// The order of the bye at `place` in the competition, which names it.
const byeOrderAt = async (
  world: SpecWorld,
  place: string,
  competition: string,
  name: string,
): Promise<number> => {
  const player = (await playersNow(world, competition, name))[
    PLACES[place] ?? -1
  ];
  assert.ok(player?.isBye === true, `The ${place} player is not a bye.`);
  return player.order;
};

const sendingForABye = async (
  world: SpecWorld,
  address: string,
  competition: string,
  name: string,
  making: Making,
): Promise<void> => {
  const tournament = tournamentNamed(world, name);
  await sent(
    world,
    await asTheReader(world, address),
    await named(world, tournament, competition, undefined),
    making,
  );
};

When(
  /^the reader signed in to the account for "([^"]*)" moves the (first|second|third) player of "([^"]*)" of "([^"]*)" (up|down)$/,
  async function (
    this: SpecWorld,
    address: string,
    place: string,
    competition: string,
    name: string,
    direction: "up" | "down",
  ) {
    const order = await byeOrderAt(this, place, competition, name);
    await sendingForABye(
      this,
      address,
      competition,
      name,
      byeMaking(direction, order),
    );
  },
);

When(
  /^the reader signed in to the account for "([^"]*)" moves the bye with the order (\d+) in "([^"]*)" of "([^"]*)" (up|down)$/,
  async function (
    this: SpecWorld,
    address: string,
    order: string,
    competition: string,
    name: string,
    direction: "up" | "down",
  ) {
    await sendingForABye(
      this,
      address,
      competition,
      name,
      byeMaking(direction, Number(order)),
    );
  },
);

When(
  /^the reader signed in to the account for "([^"]*)" removes the (first|second|third) player of "([^"]*)" of "([^"]*)"$/,
  async function (
    this: SpecWorld,
    address: string,
    place: string,
    competition: string,
    name: string,
  ) {
    const order = await byeOrderAt(this, place, competition, name);
    await sendingForABye(
      this,
      address,
      competition,
      name,
      byeMaking("remove", order),
    );
  },
);

When(
  /^the reader signed in to the account for "([^"]*)" removes the bye with the order (\d+) in "([^"]*)" of "([^"]*)"$/,
  async function (
    this: SpecWorld,
    address: string,
    order: string,
    competition: string,
    name: string,
  ) {
    await sendingForABye(
      this,
      address,
      competition,
      name,
      byeMaking("remove", Number(order)),
    );
  },
);

Then(
  /^the (first|second|third) player of the competition answered is a bye$/,
  function (this: SpecWorld, place: string) {
    assert.equal(listed(this)[PLACES[place] ?? -1]?.bye, true);
  },
);

Then(
  /^the (first|second|third) player of the competition answered has the id "([^"]*)"$/,
  function (this: SpecWorld, place: string, id: string) {
    assert.equal(listed(this)[PLACES[place] ?? -1]?.id, id);
  },
);

Then(
  /^(\d+) byes? of the competition (?:is|are) answered$/,
  function (this: SpecWorld, count: string) {
    assert.equal(
      listed(this).filter((player) => player.bye).length,
      Number(count),
    );
  },
);

Then(
  "the competition's player {string} is answered as not a bye",
  function (this: SpecWorld, name: string) {
    assert.equal(listedCalled(this, name).bye, false);
  },
);
