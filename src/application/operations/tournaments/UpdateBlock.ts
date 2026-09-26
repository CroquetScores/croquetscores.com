import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Correcting one of a tournament's blocks: its name, and what each of its
 * matches is the best of, said again.
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
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
