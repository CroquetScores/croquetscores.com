import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";

/** Removing a competition's player, entered by mistake. */
export class RemovePlayer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
    /** The player, by their id in the competition. */
    readonly playerId: string,
    requestedAt: ReadOnlyDate,
    /**
     * Where the player is a bye, its order in the competition, since every
     * bye has the same id.
     */
    readonly byeOrder?: number,
  ) {
    super(requestedAt);
  }
}
