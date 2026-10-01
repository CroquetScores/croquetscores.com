import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a team was added to a tournament played by teams, with everything it
 * was added as, and the slug and the order the tournament gave it.
 */
export class TeamAdded extends DomainEvent {
  constructor(
    readonly teamId: string,
    readonly name: string,
    readonly shortName: string,
    // The name of the flag the team flies, or nothing when it flies none,
    // which JSON leaves out.
    readonly flag: string | undefined,
    readonly slug: string,
    // Where the team comes when the tournament lists its teams, lowest first.
    readonly order: number,
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
