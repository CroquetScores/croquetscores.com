import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's teams is now as it says: its name, its short
 * name and its flag, said again together. Its slug and its order are kept.
 */
export class TeamUpdated extends DomainEvent {
  constructor(
    readonly teamId: string,
    readonly name: string,
    readonly shortName: string,
    // Nothing when the team flies no flag, which JSON leaves out.
    readonly flag: string | undefined,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
