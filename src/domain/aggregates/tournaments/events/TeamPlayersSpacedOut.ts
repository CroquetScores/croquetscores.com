import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one team's players were spaced out again, because there was no room
 * left between two of them to move another into. Every player of the team is
 * said, archived ones among them, in the order they are in: the first is
 * given 10,000 and each after them 10,000 more. Another team's players are no
 * part of it.
 */
export class TeamPlayersSpacedOut extends DomainEvent {
  constructor(
    readonly teamId: string,
    readonly playerIds: readonly string[],
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
