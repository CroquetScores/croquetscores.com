import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/** That a note was deleted by one of its tournament's managers, for good. */
export class ManagerNoteDeleted extends DomainEvent {
  constructor(createdBy: AccountId, occurredAt: ReadOnlyDate) {
    super(createdBy, occurredAt);
  }
}
