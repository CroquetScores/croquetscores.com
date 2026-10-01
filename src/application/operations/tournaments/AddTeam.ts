import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";
import type { TeamId } from "../../../domain/aggregates/tournaments/primitives/TeamId.js";
import type { TeamDetails } from "../../../domain/aggregates/tournaments/Team.js";

/**
 * Adding a team to a tournament played by teams. It is answered with the new
 * team's id.
 */
export class AddTeam extends Command<TeamId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** What the team is: its name, its short name, and the flag it flies, if any. */
    readonly team: TeamDetails,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
