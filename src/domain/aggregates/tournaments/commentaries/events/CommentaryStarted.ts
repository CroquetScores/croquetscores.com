import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That a commentary's own record was started, naming its writer, the only
 * account that may write in it. The writer is said in a field of its own
 * rather than left to who caused the event, since who may write in it is
 * what the commentary is, and what caused an event is only a record of who
 * asked.
 */
export class CommentaryStarted extends DomainEvent {
  constructor(
    readonly writer: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
