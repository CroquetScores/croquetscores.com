import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That one of the competition's players was moved, by being given the order
 * they now have. Only the one moved is said: the others keep theirs.
 */
export class CompetitionPlayerMoved extends DomainEvent {
  constructor(
    readonly playerId: string,
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
