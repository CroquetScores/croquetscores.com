import type { CompetitionId } from "../../../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";
import type { TestRequest } from "./testOperations.js";

/**
 * Adding a test to a tournament played by teams. It is answered with the new
 * test's id, which is a competition's.
 */
export class AddTest extends Command<CompetitionId> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** What the test is, as it was chosen and typed. */
    readonly test: TestRequest,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
