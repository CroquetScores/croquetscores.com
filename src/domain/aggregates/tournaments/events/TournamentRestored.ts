import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That the tournament was restored, and is as it was before it was archived.
 */
export class TournamentRestored extends DomainEvent {
  constructor(createdBy: AccountId, occurredAt: ReadOnlyDate) {
    super(createdBy, occurredAt);
  }
}
