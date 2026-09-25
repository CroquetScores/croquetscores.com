import { Query } from "../../common/Query.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";

export type WhatAMovingLinkIsWorthRefusedCode =
  "WhatAMovingLinkIsWorth.NotText";

/** What a link to confirm moving is worth, and where it moves the account. */
export type MovingLinkWorth =
  | { readonly worth: "Link.Works"; readonly emailAddress: string }
  | { readonly worth: "Link.NoLongerWorks" };

/**
 * What a link to confirm moving is worth to the reader signed in to `reader`,
 * without moving anything: so that the page the link opens can say where the
 * account will move to before anybody presses anything.
 */
export class WhatAMovingLinkIsWorth extends Query<MovingLinkWorth> {
  constructor(
    readonly link: string,
    readonly reader: string,
    readonly followedAt: ReadOnlyDate,
  ) {
    super();
    for (const given of [link, reader]) {
      if (typeof given !== "string") {
        throw new ValidationError<WhatAMovingLinkIsWorthRefusedCode>(
          "WhatAMovingLinkIsWorth.NotText",
        );
      }
    }
  }
}
