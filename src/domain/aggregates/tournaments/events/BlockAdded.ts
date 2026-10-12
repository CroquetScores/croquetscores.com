import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a block was added to the tournament: its id, its name, the slug and
 * the order the tournament gave it, what each of its matches is the best of,
 * and how many rounds it is played in.
 */
export class BlockAdded extends DomainEvent {
  constructor(
    readonly competitionId: string,
    readonly name: string,
    readonly slug: string,
    readonly order: number,
    readonly bestOf: number,
    readonly rounds: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
