import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";

/**
 * Adding a knockout to a tournament that takes the losers of a round of
 * another of its knockouts: its name, the knockout, and the round, the first
 * being 0. It is answered with the new competition's id.
 */
export class AddLosersKnockout extends Command<CompetitionId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    readonly name: string,
    /** The knockout whose losers it takes, by its id. */
    readonly from: string,
    /** The round of that knockout it takes losers from, the first being 0. */
    readonly round: number,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
