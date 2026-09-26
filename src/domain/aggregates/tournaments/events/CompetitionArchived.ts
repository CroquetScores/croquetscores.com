import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's competitions was archived. It says nothing of
 * the competition's kind, since archiving is the same whatever the kind.
 */
export class CompetitionArchived extends DomainEvent {
  constructor(
    readonly competitionId: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
