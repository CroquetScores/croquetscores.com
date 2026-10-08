import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/** That one of the competition's games was withdrawn, named by its id: played, but no longer to count. */
export class CompetitionGameWithdrawn extends DomainEvent {
  constructor(
    readonly gameId: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
