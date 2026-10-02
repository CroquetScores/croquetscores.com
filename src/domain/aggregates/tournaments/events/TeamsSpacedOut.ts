import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That the tournament's teams were spaced out again, because there was no
 * room left between two of them to move another into. Every team is said,
 * archived ones among them, in the order they are in: the first is given
 * 10,000 and each after it 10,000 more.
 */
export class TeamsSpacedOut extends DomainEvent {
  constructor(
    readonly teamIds: readonly string[],
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
