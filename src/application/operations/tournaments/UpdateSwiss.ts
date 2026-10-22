import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { CompetitionRulesSaid } from "../../../domain/aggregates/tournaments/value-objects/CompetitionRules.js";

/**
 * Correcting one of a tournament's Swisses: its name, and what each of its
 * matches is the best of, said again.
 */
export class UpdateSwiss extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    readonly name: string,
    readonly bestOf: number,
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
