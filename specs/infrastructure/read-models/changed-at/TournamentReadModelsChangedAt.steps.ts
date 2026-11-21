import { Given, Then, When } from "@cucumber/cucumber";
import { strict as assert } from "node:assert";

import type { DomainEvent } from "../../../../src/domain/common/DomainEvent.js";
import type { Id } from "../../../../src/domain/common/Id.js";
import { ReadOnlyDate } from "../../../../src/domain/common/ReadOnlyDate.js";
import type { StoredEvent } from "../../../../src/infrastructure/event-store/PostgresEventStore.js";
import { CompetitionGames } from "../../../../src/infrastructure/read-models/CompetitionGames.js";
import { SearchByWebsite } from "../../../../src/infrastructure/read-models/SearchByWebsite.js";
import { TournamentContents } from "../../../../src/infrastructure/read-models/TournamentContents.js";
import { TournamentsByAccount } from "../../../../src/infrastructure/read-models/TournamentsByAccount.js";
import { TournamentsByAddress } from "../../../../src/infrastructure/read-models/TournamentsByAddress.js";
import type { SpecWorld } from "../../../support/world.js";
import {
  doneTo,
  standUp,
  tournamentNamed,
  type TournamentReadModel,
} from "../../support/tournamentReadModels.js";
import { unitOfWorkOf } from "../../support/transactions.js";
import {
  doneToCompetition,
  found,
  ownScenarioOf,
} from "../competition-games/CompetitionGames.steps.js";

// What a tournament, its competitions and their players are, and what is done
// to them, is said in the words the games' read model shares
// (CompetitionGames.steps.ts). What is here is every read model stood up
// together, what is done at a moment of its own, and what is read of their
// tables, since nothing in the application asks when a row changed yet.

/** Every read model of tournaments but the one they are all written against. */
class EveryTournamentReadModel implements TournamentReadModel {
  readonly #models: readonly TournamentReadModel[];

  constructor(world: SpecWorld) {
    const unitOfWork = unitOfWorkOf(world);
    this.#models = [
      new TournamentContents(unitOfWork),
      new CompetitionGames(unitOfWork),
      new TournamentsByAddress(unitOfWork),
      new TournamentsByAccount(unitOfWork),
      new SearchByWebsite(unitOfWork),
    ];
  }

  async project(
    stream: Id,
    firstEvent: number,
    events: readonly DomainEvent[],
  ): Promise<void> {
    for (const each of this.#models) {
      await each.project(stream, firstEvent, events);
    }
  }

  async clear(): Promise<void> {
    for (const each of this.#models) await each.clear();
  }

  async rebuildFromStream(
    stream: string,
    events: readonly StoredEvent[],
  ): Promise<void> {
    for (const each of this.#models)
      await each.rebuildFromStream(stream, events);
  }

  async finishRebuild(): Promise<void> {
    for (const each of this.#models) await each.finishRebuild?.();
  }
}

Given("every read model of tournaments", function (this: SpecWorld) {
  standUp(this, new EveryTournamentReadModel(this), {
    country: "au",
    region: "vic",
  });
});

const at = (moment: string): ReadOnlyDate =>
  ReadOnlyDate.from(new Date(moment));

// Done at a moment of its own -------------------------------------------------

When(
  "the player {string} of {string} is archived at {string}",
  async function (
    this: SpecWorld,
    player: string,
    tournament: string,
    moment: string,
  ) {
    const id = found(ownScenarioOf(this).players, `${player} of ${tournament}`);
    await doneTo(this, tournament, (each, by) => {
      each.archivePlayer(id, false, by, at(moment));
    });
  },
);

When(
  "the player {string} in {string} of {string} is withdrawn at {string}",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    tournament: string,
    moment: string,
  ) {
    const id = found(
      ownScenarioOf(this).entries,
      `${player} in ${competition} of ${tournament}`,
    );
    await doneToCompetition(this, competition, tournament, (each, told, by) => {
      // Entries are kept by the id the competition gave them.
      each.withdrawPlayer(id, told(), by, at(moment));
    });
  },
);

When(
  "the player {string} is entered in {string} of {string} at {string}",
  async function (
    this: SpecWorld,
    player: string,
    competition: string,
    tournament: string,
    moment: string,
  ) {
    const own = ownScenarioOf(this);
    const id = found(own.players, `${player} of ${tournament}`);
    await doneToCompetition(
      this,
      competition,
      tournament,
      (each, told, by, tournamentOf) => {
        const order = tournamentOf.players.find((one) => one.id.equals(id));
        assert.ok(order !== undefined, `${player} is not in ${tournament}.`);
        own.entries.set(
          `${player} in ${competition} of ${tournament}`,
          each.enterPlayer(id, order.order, told(), by, at(moment)),
        );
      },
    );
  },
);

// What a row's moment is ----------------------------------------------------------

// Each kind of row, by the table it is in and what finds it by who it is of.
const rows = {
  address: {
    sql: `select changed_at from tournaments_by_address where tournament_id = $1`,
    of: "tournament",
  },
  part: {
    sql: `select changed_at from tournaments_by_account where tournament_id = $1`,
    of: "tournament",
  },
  "search name": {
    sql: `select changed_at from search_by_website_tournament_names where tournament_id = $1`,
    of: "tournament",
  },
  "search competition": {
    // The name is the competition's, which the search no longer keeps.
    sql: `select s.changed_at from search_by_website_competitions s
             join competitions c on c.competition_id = s.competition_id
            where c.name = $1`,
    of: "name",
  },
  "search player": {
    // The name is the tournament's player's, which the search no longer keeps.
    sql: `select s.changed_at from search_by_website_players s
             join tournament_players p on p.player_id = s.player_id
            where p.name = $1`,
    of: "name",
  },
  "tournament player": {
    sql: `select changed_at from tournament_players where name = $1`,
    of: "name",
  },
  entry: {
    sql: `select e.changed_at from competition_entries e
             join tournament_players p on p.player_id = e.tournament_player_id
            where p.name = $1`,
    of: "name",
  },
  standing: {
    sql: `select s.changed_at from competition_standings s
             join competition_entries e on e.entry_id = s.entry_id
             join tournament_players p on p.player_id = e.tournament_player_id
            where p.name = $1`,
    of: "name",
  },
} as const;

Then(
  /^the (address|part|search name|search competition|search player|tournament player|entry|standing) row of "([^"]*)" was last changed at "([^"]*)"$/,
  async function (
    this: SpecWorld,
    which: keyof typeof rows,
    name: string,
    moment: string,
  ) {
    const row = rows[which];
    const key =
      row.of === "tournament" ? tournamentNamed(this, name).value : name;
    const { rows: found } = await this.asARequest(() =>
      unitOfWorkOf(this)
        .connection()
        .query<{ changed_at: Date | null }>(row.sql, [key]),
    );
    const [first] = found;
    assert.ok(
      first !== undefined,
      `The ${which} table has no row for ${name}.`,
    );
    assert.equal(
      first.changed_at?.toISOString(),
      new Date(moment).toISOString(),
    );
  },
);
