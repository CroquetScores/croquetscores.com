import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That the account is now called something else. It holds the new name as
 * text, as confirming does, and it is as personal as that name: whatever keeps
 * the account's events keeps it as it keeps the name confirming gave.
 */
export class NameChanged extends DomainEvent {
  constructor(
    readonly name: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
