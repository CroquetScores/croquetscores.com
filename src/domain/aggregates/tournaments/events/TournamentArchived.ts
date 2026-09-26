import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That the tournament was archived: set aside, with nothing taken from it.
 */
export class TournamentArchived extends DomainEvent {
  constructor(createdBy: AccountId, occurredAt: ReadOnlyDate) {
    super(createdBy, occurredAt);
  }
}
