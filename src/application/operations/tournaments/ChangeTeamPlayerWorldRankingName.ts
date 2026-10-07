import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Changing a player in one of a tournament's teams' world ranking name, and
 * nothing else about them, as a tournament player's is changed
 * (ChangePlayerWorldRankingName.ts).
 */
export class ChangeTeamPlayerWorldRankingName extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The team, by its id. */
    readonly team: string,
    /** The player, by their id. */
    readonly playerId: string,
    /** The name the world rankings know them by; blank for none. */
    readonly worldRankingName: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
