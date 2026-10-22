import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { CompetitionRulesSaid } from "../../../domain/aggregates/tournaments/value-objects/CompetitionRules.js";

/**
 * Correcting one of a tournament's knockouts: its name, and the shape of its
 * draw, said again. Whether the change moves a player who has played is asked
 * of the application's games.
 */
export class UpdateKnockout extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    readonly name: string,
    /** How many places the draw has. */
    readonly places: number,
    /** What each round is the best of, the first round first. */
    readonly rounds: readonly number[],
    requestedAt: ReadOnlyDate,
    /**
     * How it is played and counted, as the dialog sent it, or nothing to leave
     * that to the tournament: what it was when it is updated.
     */
    readonly rules?: CompetitionRulesSaid | undefined,
  ) {
    super(requestedAt);
  }
}
