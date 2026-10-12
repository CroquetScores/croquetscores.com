import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's blocks is now called this, is the best of this
 * and is played in this many rounds. Its slug and its order are not said,
 * because updating keeps them.
 */
export class BlockUpdated extends DomainEvent {
  constructor(
    readonly competitionId: string,
    readonly name: string,
    readonly bestOf: number,
    readonly rounds: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
