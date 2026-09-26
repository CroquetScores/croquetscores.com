import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";

/**
 * Adding a knockout to a tournament: its name, and the shape of its draw. It is
 * answered with the new competition's id.
 */
export class AddKnockout extends Command<CompetitionId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    readonly name: string,
    /** How many places the draw has. */
    readonly places: number,
    /** What each round is the best of, the first round first. */
    readonly rounds: readonly number[],
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
