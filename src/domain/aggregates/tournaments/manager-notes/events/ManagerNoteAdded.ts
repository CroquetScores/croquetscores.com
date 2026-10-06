import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That a note was added to a tournament by one of its managers, with its
 * title and its description. A note with no description has the empty one,
 * which is kept rather than left out so that what was kept says all there is.
 */
export class ManagerNoteAdded extends DomainEvent {
  constructor(
    readonly tournamentId: string,
    readonly title: string,
    readonly description: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
