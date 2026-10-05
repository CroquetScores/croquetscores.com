import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's commentaries was given another title. It
 * keeps its slug, so the slug is not said.
 */
export class TournamentCommentaryTitleChanged extends DomainEvent {
  constructor(
    readonly commentaryId: string,
    readonly title: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
