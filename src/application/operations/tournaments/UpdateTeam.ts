import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";
import type { TeamDetails } from "../../../domain/aggregates/tournaments/Team.js";

/**
 * Correcting one of a tournament's teams: its name, its short name and its
 * flag, said again together.
 */
export class UpdateTeam extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The team, by its id. */
    readonly team: string,
    /** What the team is now. */
    readonly details: TeamDetails,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
