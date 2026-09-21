import { Query } from "../../common/Query.js";
import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import type { SetNewPasswordLinkWorth } from "./setNewPasswordLinks.js";

/** Every reason asking can be refused where it is made. */
export type WhatASetNewPasswordLinkIsWorthRefusedCode =
  "WhatASetNewPasswordLinkIsWorth.NotText";

/**
 * Asking what a link to set a new password is worth, without using it.
 *
 * Asked by the page the link opens, so that a reader whose link has expired or
 * been used is told so on arrival rather than after choosing a password that
 * was never going to be kept. It carries the moment it was followed, as the
 * confirming one does, since whether a link has expired is a comparison
 * against the moment somebody is asking about.
 */
export class WhatASetNewPasswordLinkIsWorth extends Query<SetNewPasswordLinkWorth> {
  constructor(
    readonly link: string,
    readonly followedAt: ReadOnlyDate,
  ) {
    super();
    if (typeof link !== "string") {
      throw new ValidationError<WhatASetNewPasswordLinkIsWorthRefusedCode>(
        "WhatASetNewPasswordLinkIsWorth.NotText",
      );
    }
  }
}
