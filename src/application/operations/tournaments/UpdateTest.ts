import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { Command } from "../../common/Command.js";
import type { TestRequest } from "./testOperations.js";

/**
 * Correcting one of a tournament's tests: everything it is, said again
 * together. Once it has games in use, what they were played as is fixed.
 */
export class UpdateTest extends Command<void> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The test, by its id, which is a competition's. */
    readonly testId: string,
    /** What the test is now, as it was chosen and typed. */
    readonly test: TestRequest,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
  }
}
