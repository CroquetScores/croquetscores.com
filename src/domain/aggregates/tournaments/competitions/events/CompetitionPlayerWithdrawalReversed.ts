import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That the withdrawal of one of the competition's players was reversed. They
 * keep the order they were given when they withdrew.
 */
export class CompetitionPlayerWithdrawalReversed extends DomainEvent {
  constructor(
    readonly playerId: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
