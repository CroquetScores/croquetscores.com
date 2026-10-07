import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Changing one of a tournament's players' world ranking name, and nothing
 * else about them: what a world ranking officer may do to any player, and a
 * manager to their tournament's.
 */
export class ChangePlayerWorldRankingName extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The player, by their id. */
    readonly playerId: string,
    /** The name the world rankings know them by; blank for none. */
    readonly worldRankingName: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
