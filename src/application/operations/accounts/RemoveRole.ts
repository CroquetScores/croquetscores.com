import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Taking a role from somebody, named by their account's id, since they are
 * chosen from those holding it rather than typed.
 */
export class RemoveRole extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The role, as one is kept: "administrator" or "world-ranking-officer". */
    readonly role: string,
    /** Whoever is to lose it, by their account's id. */
    readonly holder: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
