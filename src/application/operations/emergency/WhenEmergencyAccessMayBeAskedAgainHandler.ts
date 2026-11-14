import type { RequestType } from "../../common/Mediator.js";
import { AN_HOUR, shiftedBy } from "../../common/moments.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import type { EmailsWritten } from "../../services/EmailsWritten.js";
import { HOURS_BETWEEN_ASKINGS } from "./AskForEmergencyAccessHandler.js";
import { WhenEmergencyAccessMayBeAskedAgain } from "./WhenEmergencyAccessMayBeAskedAgain.js";

/**
 * The moment an account's last asking is 48 hours behind it, where that is
 * still to come (WhenEmergencyAccessMayBeAskedAgain.feature). Counted the way
 * the asking is limited, from what the site wrote, so that the page and the
 * refusal cannot disagree about when.
 */
export class WhenEmergencyAccessMayBeAskedAgainHandler extends QueryHandler<
  WhenEmergencyAccessMayBeAskedAgain,
  ReadOnlyDate | undefined
> {
  readonly handles: RequestType<WhenEmergencyAccessMayBeAskedAgain> =
    WhenEmergencyAccessMayBeAskedAgain;

  constructor(private readonly written: EmailsWritten) {
    super();
  }

  async handle(
    query: WhenEmergencyAccessMayBeAskedAgain,
  ): Promise<ReadOnlyDate | undefined> {
    const last = await this.written.latestAt({
      emergencyAccessBy: query.account,
    });
    if (last === undefined) return undefined;
    const until = shiftedBy(last, HOURS_BETWEEN_ASKINGS * AN_HOUR);
    return until.toDate().getTime() > query.at.toDate().getTime()
      ? until
      : undefined;
  }
}
