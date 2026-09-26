// The tournaments a browser scenario says are already there, made through the
// application it is talking to: sent as commands to its mediator, kept by its
// store, and projected by its read models, so that what the admin lists is
// what the site would list. The steps are the ones the application's
// tournament features say them in, since what is being said is the same.
import { EmailAddress } from "../../../src/domain/aggregates/accounts/value-objects/EmailAddress.js";
import type { ReadOnlyDate } from "../../../src/domain/common/ReadOnlyDate.js";
import type { Application } from "../../../src/web/server.js";
import type { TournamentsInHand } from "../../support/tournaments.js";

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
