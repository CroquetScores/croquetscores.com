import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { TournamentRequest } from "./tournamentOperations.js";

/**
 * Changing what a tournament is: the account the reader is signed in to, the
 * tournament, and everything it is to be, said again.
 */
export class UpdateTournament extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    readonly details: TournamentRequest,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
