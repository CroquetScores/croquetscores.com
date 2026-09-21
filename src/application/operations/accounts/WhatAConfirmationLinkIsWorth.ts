import { Query } from "../../common/Query.js";
import type { ConfirmationLinkWorth } from "./confirmationLinks.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

/** Every reason asking can be refused where it is made. */
export type WhatAConfirmationLinkIsWorthRefusedCode =
  "WhatAConfirmationLinkIsWorth.NotText";

/**
 * Asking what a link to confirm an email address is worth, without following
 * it: whether it would confirm, whether it has expired, whether it no longer
 * works, or whether its account is confirmed already.
 *
 * Asked by the page the link opens, so that it knows whether to show the form
 * or to say why there is nothing to fill in. Nothing is recorded, and nothing
 * about the account is answered but what a reader holding the link is about to
 * be told anyway.
 *
 * It carries the moment it was followed, which a query does not usually: a
 * query carries no time because nothing it does is recorded, and this one needs
 * one all the same, since whether a link has expired is a comparison against
 * the moment somebody is asking about. It is the moment the request arrived,
 * like a command's, so that a page which asks and then confirms judges both
 * against the one moment.
 *
 * The link is required to be text where the query is made, as a command's
 * fields are: a link the edge was to read and did not find arrives as nothing
 * whatever the types say, and left for the handler that nothing would be asked
 * to match itself against a pattern, and the site would answer with its own
 * code breaking rather than with the page that says the link no longer works.
 */
export class WhatAConfirmationLinkIsWorth extends Query<ConfirmationLinkWorth> {
  constructor(
    readonly link: string,
    readonly followedAt: ReadOnlyDate,
  ) {
    super();
    if (typeof link !== "string") {
      throw new ValidationError<WhatAConfirmationLinkIsWorthRefusedCode>(
        "WhatAConfirmationLinkIsWorth.NotText",
      );
    }
  }
}
