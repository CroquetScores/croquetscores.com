import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That an account was made a manager of the tournament. A scorer made one is
 * no longer a scorer, since a manager can do everything a scorer can. The
 * account is named by its id, as text, as every event names what it is
 * about.
 */
export class ManagerAdded extends DomainEvent {
  constructor(
    readonly account: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
