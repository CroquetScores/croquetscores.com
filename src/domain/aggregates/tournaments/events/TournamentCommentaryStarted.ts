import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a commentary was started on the tournament, with its title and the
 * slug the tournament gave it. Whoever caused it is its writer.
 */
export class TournamentCommentaryStarted extends DomainEvent {
  constructor(
    readonly commentaryId: string,
    readonly title: string,
    readonly slug: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
