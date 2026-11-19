import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking what a key may do can be refused where it is asked. */
export type WhatAKeyMayDoInTournamentRefusedCode =
  "WhatAKeyMayDoInTournament.NotText";

/** The part the account a key acts as has in a tournament. */
export type PartInTournament = "manager" | "scorer" | "neither";

/** What a key may do in one tournament. */
export interface WhatAKeyMayDo {
  /**
   * The part its account has in the tournament, whatever the key may do with
   * it: an app can then tell the reader why a write would be refused.
   */
  readonly part: PartInTournament;
  /** Whether the key may read the tournament. */
  readonly mayRead: boolean;
  /** Whether the key may write to the tournament. */
  readonly mayWrite: boolean;
}

/**
 * What the key an app sent may do in the tournament `tournament`: the part its
 * account has there, as a manager, a scorer or neither, so that an app can say
 * so before it sends results and not after a write is refused.
 *
 * A key may write only where it was made to be able to write, its account is a
 * manager or a scorer of the tournament, the tournament is not archived, and
 * the key is not limited to another tournament. A key limited to another
 * tournament may do nothing here, not even read. An administrator who is
 * neither a manager nor a scorer is neither: the key is for the part the
 * account plays in the tournament, and not for what an administrator may do
 * at the site.
 *
 * Answers nothing where the key is not one that works, and says no more of
 * which of the reasons it was, as `IdentifyApiKey` does. A tournament there is
 * not is refused as `WhatAKeyMayDoInTournament.NoSuchTournament`.
 */
export class WhatAKeyMayDoInTournament extends Query<
  WhatAKeyMayDo | undefined
> {
  constructor(
    /** The key, as the app sent it. */
    readonly key: string,
    /** The tournament, by its id. */
    readonly tournament: string,
  ) {
    super();
    if (typeof key !== "string" || typeof tournament !== "string") {
      throw new ValidationError<WhatAKeyMayDoInTournamentRefusedCode>(
        "WhatAKeyMayDoInTournament.NotText",
      );
    }
  }
}
