import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../AccountId.js";

/**
 * That moving the account to `emailAddress` was asked for, and a link sent
 * there carrying `reference`. It moves nothing: the move is made once whoever
 * reads mail at the address follows the link. The address is as personal as
 * the one the account is at, and is kept as that one is.
 */
export class EmailAddressChangeAsked extends DomainEvent {
  constructor(
    readonly emailAddress: string,
    readonly reference: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
