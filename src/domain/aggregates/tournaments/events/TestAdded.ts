import { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../accounts/AccountId.js";

/**
 * That a test was added to a tournament played by teams: the two teams it is
 * between, the first first, the days it starts and finishes, written as
 * "2026-10-03", how many matches it is expected to have, what each match is
 * the best of, its group, and the slug and the order the tournament gave it.
 * It names no name of its own: it is called by its teams' short names, which
 * can change after it is added.
 */
export class TestAdded extends DomainEvent {
  constructor(
    readonly competitionId: string,
    readonly firstTeamId: string,
    readonly secondTeamId: string,
    readonly slug: string,
    readonly order: number,
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
