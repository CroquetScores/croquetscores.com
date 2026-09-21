import { Command } from "../../common/Command.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason a report can be refused where it is made. */
export type ReportUnreachableServiceRefusedCode =
  "ReportUnreachableService.NotText";

/**
 * Telling the administrator that `service` could not be reached.
 *
 * Sent by whatever found it down, in a transaction of its own: the work that
 * found it was refused and recorded nothing, and the telling is to be kept
 * although the rest was not.
 */
export class ReportUnreachableService extends Command<void> {
  constructor(
    readonly service: string,
    requestedAt: ReadOnlyDate,
  ) {
    super(requestedAt);
    if (typeof service !== "string") {
      throw new ValidationError<ReportUnreachableServiceRefusedCode>(
        "ReportUnreachableService.NotText",
      );
    }
  }
}
