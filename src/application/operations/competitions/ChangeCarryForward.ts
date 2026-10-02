import type { CarryForwardCounts } from "../../../domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Changing what a competition's player carries forward into it. */
export class ChangeCarryForward extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    /** The player, by their id in the competition. */
    readonly playerId: string,
    /** Every count, nothing where nothing is carried forward. */
    readonly counts: CarryForwardCounts,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
