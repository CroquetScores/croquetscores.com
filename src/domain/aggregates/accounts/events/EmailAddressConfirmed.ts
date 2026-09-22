import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That whoever followed the link showed they can read mail at the address,
 * and said who they are: the name the account is called, and the hash of the
 * password it is signed in to with. They are given here, by the one person
 * who can have the link, rather than with registering, which anybody can ask
 * for with anybody's address.
 *
 * The name is held as text rather than as the value it came from, as the
 * address is where the account was registered, and the password only as its
 * hash, which is all the domain ever holds of it.
 */
export class EmailAddressConfirmed extends DomainEvent {
  constructor(
    readonly name: string,
    readonly passwordHash: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
