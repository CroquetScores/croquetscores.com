import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Restoring one of a tournament's archived teams. */
export class RestoreTeam extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The team, by its id. */
    readonly team: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
