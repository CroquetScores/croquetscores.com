import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That an account began: an email address, and nothing else. No name and no
 * password, because whoever registered had not yet shown the address was
 * theirs, and whatever they typed would have been kept for whoever does own
 * it. Both arrive with confirming.
 *
 * The email address is held as text rather than as the value it came from. An
 * event is written down as JSON, and a value holding what it says where
 * nothing outside can reach it would be written down as nothing at all.
 */
export class AccountRegistered extends DomainEvent {
  constructor(
    readonly emailAddress: string,
    // A keyed hash of the address, made by whatever registered the account,
    // since the key is the site's. Carried here so that anything finding
    // accounts by address can be made from the events alone, even once the
    // address itself can no longer be read.
    readonly emailAddressHash: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
