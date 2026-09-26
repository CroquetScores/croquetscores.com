// The tournaments a browser scenario says are already there, made through the
// application it is talking to: sent as commands to its mediator, kept by its
// store, and projected by its read models, so that what the admin lists is
// what the site would list. The steps are the ones the application's
// tournament features say them in, since what is being said is the same.
import { strict as assert } from "node:assert";

import type { TournamentRequest } from "../../../src/application/operations/tournaments/tournamentOperations.js";
import { UpdateTournament } from "../../../src/application/operations/tournaments/UpdateTournament.js";
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import { TournamentId } from "../../../src/domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../src/domain/aggregates/tournaments/Tournament.js";
import type { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import type { Application } from "../../../src/web/server.js";
import type { TournamentsInHand } from "../../support/tournaments.js";
import type { SpecWorld } from "../../support/world.js";
import {
  inHandOf,
  load,
  momentOf,
  tournamentNamed,
} from "../../application/operations/tournaments/aRequest.js";

export const tournamentsThrough = (
  application: Application,
  now: () => ReadOnlyDate,
): TournamentsInHand => {
  const asARequest = <T>(work: () => Promise<T>): Promise<T> =>
    application.unitOfWork.inTransaction(work);
  return {
    send: (command) => application.mediator.send(command),
    load: (id) => asARequest(() => application.tournaments.load(id)),
    eventsOf: (id) => asARequest(() => application.eventStore.getEvents(id)),
    kept: async () => {
      const { rows } = await asARequest(() =>
        application.unitOfWork.connection().query<{ kept: string }>(
          `select count(distinct stream_id) as kept from events
              where stream_id like 'tournament/%'`,
        ),
      );
      return Number(rows[0]?.kept ?? 0);
    },
    // The site's own games, which say nothing has been played: nothing a
    // browser scenario does records a game.
    games: {
      playersWhoHavePlayed: new Set(),
      competitionsWithGames: new Set(),
      knockoutsWhoseChangeMovesAPlayer: new Set(),
    },
    accountFor: (address) =>
      asARequest(() =>
        application.accountsByEmailAddress.find(EmailAddress.from(address)),
      ),
    now,
  };
};

// What the tournament is now, said again with `changed`, as updating one says
// everything it is. Done as its first manager, who is whoever created it.
export const changeTournament = async (
  world: SpecWorld,
  name: string,
  changed: Partial<TournamentRequest>,
): Promise<void> => {
  const id = tournamentNamed(world, name);
  const as = await load(world, id);
  const manager = as.managers[0];
  assert.ok(manager !== undefined, `${name} has no manager.`);
  await inHandOf(world).send(
    new UpdateTournament(
      manager.value,
      id.value,
      {
        name: as.name.toString(),
        starts: as.starts.toISOString(),
        finishes: as.finishes.toISOString(),
        format: as.format.name,
        sport: as.sport.code,
        country: as.country.code,
        region: as.region.code,
        ...(as.notes === undefined ? {} : { notes: as.notes.markdown }),
        handicap: as.handicap,
        worldRankings: as.worldRankings,
        national: as.national,
        international: as.international,
        ...changed,
      },
      momentOf(world),
    ),
  );
};

// Found by its name among those kept, since the scenario created it through
// the form and so never knew its id.
export const keptCalled = async (
  world: SpecWorld,
  name: string,
): Promise<Tournament> => {
  const { rows } = await world.database.query<{ tournament_id: string }>(
    `select tournament_id from tournaments_by_account_details where name = $1`,
    [name],
  );
  assert.equal(rows.length, 1, `${String(rows.length)} are called ${name}.`);
  return load(world, TournamentId.from(rows[0]!.tournament_id));
};
