import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Making somebody a scorer of a tournament, named by their email address,
 * since that is what the manager asking knows of them.
 */
export class AddScorer extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The email address of whoever is to be made one, as it was typed. */
    readonly emailAddress: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
