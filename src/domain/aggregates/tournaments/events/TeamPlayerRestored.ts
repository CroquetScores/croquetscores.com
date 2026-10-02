import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/** That an archived player in one of the tournament's teams was restored. */
export class TeamPlayerRestored extends DomainEvent {
  constructor(
    readonly teamId: string,
    readonly playerId: string,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
