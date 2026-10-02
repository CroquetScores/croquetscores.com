import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That one of the tournament's tests is now as it says, everything said again
 * together, as when it was added. Its slug and its order are kept.
 */
export class TestUpdated extends DomainEvent {
  constructor(
    readonly competitionId: string,
    readonly firstTeamId: string,
    readonly secondTeamId: string,
    readonly starts: string,
    readonly finishes: string,
    readonly expectedMatches: number,
    readonly bestOf: number,
    // Nothing when the test is in no group, which JSON leaves out.
    readonly group: string | undefined,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
