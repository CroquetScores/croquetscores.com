import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";
import type { WrittenTournament } from "./TournamentCreated.js";

/**
 * That the tournament is now as this says, all of it said again, as updating
 * says it, and found at the address it gives, which may be the one it was
 * found at before.
 */
export class TournamentUpdated
  extends DomainEvent
  implements WrittenTournament
{
  readonly name: string;
  readonly starts: string;
  readonly finishes: string;
  readonly format: string;
  readonly sport: string;
  readonly country: string;
  readonly region: string;
  readonly notes: string | undefined;
  readonly handicap: boolean;
  readonly worldRankings: boolean;
  readonly national: boolean;
  readonly international: boolean;
  readonly address: string;

  constructor(
    written: WrittenTournament,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
    this.name = written.name;
    this.starts = written.starts;
    this.finishes = written.finishes;
    this.format = written.format;
    this.sport = written.sport;
    this.country = written.country;
    this.region = written.region;
    this.notes = written.notes;
    this.handicap = written.handicap;
    this.worldRankings = written.worldRankings;
    this.national = written.national;
    this.international = written.international;
    this.address = written.address;
  }
}
