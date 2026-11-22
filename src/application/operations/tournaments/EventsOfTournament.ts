import { Query } from "../../common/Query.js";
import type { KeptEvent } from "../../services/TournamentEvents.js";

/** The tournament, as the page that lists its events is headed, and its events. */
export interface EventsOfTournamentAnswered {
  /** What the tournament is called now. */
  readonly name: string;
  /** Its events, oldest first. */
  readonly events: readonly KeptEvent[];
}

/**
 * Every event kept of the tournament found at an address, oldest first, as an
 * administrator reads them (EventsOfTournament.feature).
 *
 * Only an administrator can ask: anybody else is refused with
 * `Account.NotAnAdministrator`, a tournament's manager among them, since what
 * an event carried is answered as it was kept.
 */
export class EventsOfTournament extends Query<EventsOfTournamentAnswered> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** Where the tournament is found, now or before: "2026/ac/spring-open". */
    readonly address: string,
  ) {
    super();
  }
}
