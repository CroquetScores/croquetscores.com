import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Taking somebody off a tournament's scorers, named by their account's id,
 * since they are chosen from those the tournament has rather than typed.
 */
export class RemoveScorer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The scorer to be taken off, by their account's id. */
    readonly scorer: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
