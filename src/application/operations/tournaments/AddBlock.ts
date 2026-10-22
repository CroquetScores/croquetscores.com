import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { CompetitionRulesSaid } from "../../../domain/aggregates/tournaments/value-objects/CompetitionRules.js";

/**
 * Adding a block to a tournament: its name, what each of its matches is the
 * best of, and how many rounds it is played in. It is answered with the new competition's id.
 */
export class AddBlock extends Command<CompetitionId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    readonly name: string,
    readonly bestOf: number,
    readonly rounds: number,
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
