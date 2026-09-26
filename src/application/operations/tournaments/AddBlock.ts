import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";

/**
 * Adding a block to a tournament: its name, and what each of its matches is the
 * best of. It is answered with the new competition's id.
 */
export class AddBlock extends Command<CompetitionId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    readonly name: string,
    readonly bestOf: number,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
