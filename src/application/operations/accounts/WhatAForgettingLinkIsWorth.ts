import { Query } from "../../common/Query.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { ForgettingLinkWorth } from "./forgettingLinks.js";

/** Every reason asking can be refused where it is made. */
export type WhatAForgettingLinkIsWorthRefusedCode =
  "WhatAForgettingLinkIsWorth.NotText";

/**
 * Asking what a link to confirm forgetting is worth to the reader following
 * it, without forgetting anything: whether the page shows the button, or says
 * the link no longer works.
 */
export class WhatAForgettingLinkIsWorth extends Query<ForgettingLinkWorth> {
  constructor(
    readonly link: string,
    readonly reader: string,
    readonly followedAt: ReadOnlyDate,
  ) {
    super();
    for (const given of [link, reader]) {
      if (typeof given !== "string") {
        throw new ValidationError<WhatAForgettingLinkIsWorthRefusedCode>(
          "WhatAForgettingLinkIsWorth.NotText",
        );
      }
    }
  }
}
