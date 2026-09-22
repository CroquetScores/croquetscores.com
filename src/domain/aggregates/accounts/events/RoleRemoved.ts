import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../value-objects/AccountId.js";
import type { Role } from "../value-objects/Role.js";

/**
 * That `role` was taken away from the account, caused by whoever took it, as
 * adding one is.
 */
export class RoleRemoved extends DomainEvent {
  constructor(
    readonly role: Role,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
