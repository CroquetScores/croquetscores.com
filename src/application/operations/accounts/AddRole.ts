import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * Giving somebody a role, named by their email address, since that is what the
 * administrator asking knows of them.
 */
export class AddRole extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The role, as one is kept: "administrator", "ac-world-ranking-officer" or "gc-world-ranking-officer". */
    readonly role: string,
    /** The email address of whoever is to be given it, as it was typed. */
    readonly emailAddress: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
