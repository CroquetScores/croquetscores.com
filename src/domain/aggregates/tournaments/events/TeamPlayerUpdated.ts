import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/** That a player in one of the tournament's teams now has the name it says. */
export class TeamPlayerUpdated extends DomainEvent {
  constructor(
    readonly teamId: string,
    readonly playerId: string,
    readonly name: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
