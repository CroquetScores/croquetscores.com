import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That an account was brought over from the old site: everything it had
 * there, its password only as the hash the old site made of it. It is an
 * account's first event, as registering is for one made here, and leaves it
 * confirmed: its owner gets in with the password they already have, and a
 * link to confirm would ask them to choose a name and a password they chose
 * long ago.
 *
 * The name and the email address are held as text, as they are in every
 * account event, since an event is written down as JSON.
 */
export class AccountBroughtOver extends DomainEvent {
  constructor(
    readonly name: string,
    readonly emailAddress: string,
    // A keyed hash of the address, as registering carries, and for the same
    // reason: so that accounts can be found by address from the events alone.
    readonly emailAddressHash: string,
    readonly passwordHash: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
