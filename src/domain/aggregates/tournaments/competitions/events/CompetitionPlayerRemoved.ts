import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That one of the competition's players was removed, having been entered by
 * mistake. Nothing is kept of them.
 */
export class CompetitionPlayerRemoved extends DomainEvent {
  constructor(
    readonly playerId: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
