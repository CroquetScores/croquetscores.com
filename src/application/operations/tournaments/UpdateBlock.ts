import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { CompetitionRulesSaid } from "../../../domain/aggregates/tournaments/value-objects/CompetitionRules.js";

/**
 * Correcting one of a tournament's blocks: its name, and what each of its
 * matches is the best of, and the rounds it is played in, said again.
 */
export class UpdateBlock extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    readonly name: string,
    readonly bestOf: number,
    readonly rounds: number,
    requestedAt: ReadOnlyDate,
    /**
     * How it is played and counted, as the dialog sent it, or nothing to leave
     * that to the tournament: what it was when it is updated.
     */
    readonly rules?: CompetitionRulesSaid | undefined,
    /**
     * The code of how its players level on matches won are told apart, as the
     * dialog sent it, or nothing to leave the block going by what it went by.
     */
    readonly tieBreak?: string | undefined,
  ) {
    super(requestedAt);
  }
}
