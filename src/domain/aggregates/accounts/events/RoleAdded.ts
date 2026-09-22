import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../value-objects/AccountId.js";
import type { Role } from "../value-objects/Role.js";

/**
 * That the account was given `role`. Unlike the account's other events it is
 * caused by whoever gave it, not by the account: a role is given, not taken.
 */
export class RoleAdded extends DomainEvent {
  constructor(
    readonly role: Role,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
