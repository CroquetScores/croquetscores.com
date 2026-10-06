import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * Everything a tournament is that creating it says and updating it says
 * again, as text, numbers and yes-or-no, so that an event is written down as
 * what it says. The website is not among it: a tournament is created on one
 * and keeps it.
 */
export interface WrittenTournament {
  readonly name: string;
  // Each as a read-only date writes itself, in UTC to the millisecond.
  readonly starts: string;
  readonly finishes: string;
  // The format by its name, the sport, the country and the region by their
  // codes, the region nothing when the tournament is in none, which JSON
  // leaves out.
  readonly format: string;
  readonly sport: string;
  readonly country: string;
  readonly region: string | undefined;
  // Nothing when there is no subtitle, which JSON leaves out.
  readonly subtitle: string | undefined;
  readonly handicap: boolean;
  readonly drawsAllowed: boolean;
  // Whether a test level on matches is drawn rather than decided by net games
  // and hoops, which only a tournament played by teams can say.
  readonly levelTestsDrawn: boolean;
  readonly worldRankings: boolean;
  readonly national: boolean;
  readonly international: boolean;
  // Where the tournament is found from then on, which the tournament decided
  // when the event was recorded and which is kept as it was decided, since
  // deciding it again later could give another answer.
  readonly address: string;
}

/**
 * That a tournament began, on `website`, with everything it began with.
 * Every field is copied onto the event itself, so that it is written down as
 * the fields and not as an object inside it.
 */
export class TournamentCreated
  extends DomainEvent
  implements WrittenTournament
{
  readonly website: string;
  readonly name: string;
  readonly starts: string;
  readonly finishes: string;
  readonly format: string;
  readonly sport: string;
  readonly country: string;
  readonly region: string | undefined;
  readonly subtitle: string | undefined;
  readonly handicap: boolean;
  readonly drawsAllowed: boolean;
  readonly levelTestsDrawn: boolean;
  readonly worldRankings: boolean;
  readonly national: boolean;
  readonly international: boolean;
  readonly address: string;

  constructor(
    website: string,
    written: WrittenTournament,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
    this.website = website;
    this.name = written.name;
    this.starts = written.starts;
    this.finishes = written.finishes;
    this.format = written.format;
    this.sport = written.sport;
    this.country = written.country;
    this.region = written.region;
    this.subtitle = written.subtitle;
    this.handicap = written.handicap;
    this.drawsAllowed = written.drawsAllowed;
    this.levelTestsDrawn = written.levelTestsDrawn;
    this.worldRankings = written.worldRankings;
    this.national = written.national;
    this.international = written.international;
    this.address = written.address;
  }
}
