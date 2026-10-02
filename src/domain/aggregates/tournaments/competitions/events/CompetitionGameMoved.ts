import { DomainEvent } from "../../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../../common/ReadOnlyDate.js";
import type { AccountId } from "../../../accounts/AccountId.js";

/**
 * That one of a test's games, named by its id, swapped places with the game
 * in use next to it, above it or below it.
 */
export class CompetitionGameMoved extends DomainEvent {
  constructor(
    readonly gameId: string,
    readonly direction: "up" | "down",
    createdBy: AccountId,
    occurredAt: ReadOnlyDate,
  ) {
    super(createdBy, occurredAt);
  }
}
