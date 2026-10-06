import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That a note was edited by one of its tournament's managers, to have the
 * title and the description it has now; the empty one where it has none.
 */
export class ManagerNoteEdited extends DomainEvent {
  constructor(
    readonly title: string,
    readonly description: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
