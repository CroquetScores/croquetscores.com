import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/** That a commentary is now called `title`, by its writer, keeping its slug. */
export class CommentaryTitleChanged extends DomainEvent {
  constructor(
    readonly title: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
