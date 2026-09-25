import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That the account is now at `emailAddress`. It carries the address's keyed
 * hash, as registering does, made by whatever moved the account since the key
 * is the site's, so that anything finding accounts by address can follow the
 * move from the events alone, even once the address can no longer be read.
 */
export class EmailAddressChanged extends DomainEvent {
  constructor(
    readonly emailAddress: string,
    readonly emailAddressHash: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
