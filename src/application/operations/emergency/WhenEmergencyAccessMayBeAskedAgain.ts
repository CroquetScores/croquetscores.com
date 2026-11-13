import { Query } from "../../common/Query.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";

/**
 * When an account may next ask for emergency access, or nothing where it may
 * ask now: so that whoever opens the page is told to wait before they have
 * written a message the site would only refuse.
 *
 * It is given the moment it is asked at, since a query carries none and
 * nothing below the web layer reads a clock.
 */
export class WhenEmergencyAccessMayBeAskedAgain extends Query<
  ReadOnlyDate | undefined
> {
  constructor(
    readonly account: AccountId,
    readonly at: ReadOnlyDate,
  ) {
    super();
  }
}
