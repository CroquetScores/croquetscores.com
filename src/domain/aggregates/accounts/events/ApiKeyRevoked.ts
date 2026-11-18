import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/** That the account revoked the key `keyId`, which never works again. */
export class ApiKeyRevoked extends DomainEvent {
  constructor(
    readonly keyId: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
