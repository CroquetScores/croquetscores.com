import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's competitions was archived, and the order it was
 * given, which puts it after every competition still in use. It says nothing
 * of the competition's kind, since archiving is the same whatever the kind.
 */
export class CompetitionArchived extends DomainEvent {
  constructor(
    readonly competitionId: string,
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
