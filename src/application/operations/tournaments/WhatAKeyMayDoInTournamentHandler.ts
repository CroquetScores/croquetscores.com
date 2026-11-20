import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { IdentifyApiKey } from "../accounts/IdentifyApiKey.js";
import type { IdentifyApiKeyHandler } from "../accounts/IdentifyApiKeyHandler.js";
import { TournamentOperationRefused } from "./tournamentOperations.js";
import type { TournamentsByAccount } from "./TournamentsOfAccount.js";
import {
  type WhatAKeyMayDo,
  WhatAKeyMayDoInTournament,
} from "./WhatAKeyMayDoInTournament.js";

/**
 * What a key may do in a tournament. Who the key acts as is found as any key
 * is, by the handler that identifies one, so that a key revoked or an account
 * forgotten is let in by nothing here either. The tournament is asked after
 * that, so that nobody learns which tournaments there are by presenting a key
 * that does not work.
 *
 * The part the account has, and whether the tournament is archived, are asked
 * of the read model that keeps who manages or scores each tournament, and not
 * of the tournament's events (#699).
 */
export class WhatAKeyMayDoInTournamentHandler extends QueryHandler<
  WhatAKeyMayDoInTournament,
  WhatAKeyMayDo | undefined
> {
  readonly handles: RequestType<WhatAKeyMayDoInTournament> =
    WhatAKeyMayDoInTournament;

  constructor(
    private readonly parts: Pick<TournamentsByAccount, "partIn">,
    private readonly identifying: IdentifyApiKeyHandler,
  ) {
    super();
  }

  async handle(
    query: WhatAKeyMayDoInTournament,
  ): Promise<WhatAKeyMayDo | undefined> {
    const identified = await this.identifying.handle(
      new IdentifyApiKey(query.key),
    );
    if (identified === undefined) return undefined;
    const found = await this.parts.partIn(
      query.tournament,
      AccountId.from(identified.account),
    );
    // What is not an id at all names no tournament, and is refused as one that
    // is not there, since an app that mistyped an address has no use for a
    // finer answer.
    if (found === undefined) {
      throw new TournamentOperationRefused(
        "WhatAKeyMayDoInTournament.NoSuchTournament",
        "There is no such tournament.",
      );
    }
    const { part, archived } = found;
    const inItsTournament =
      identified.tournament === undefined ||
      identified.tournament === query.tournament;
    return {
      part,
      mayRead: identified.mayRead && inItsTournament,
      mayWrite:
        identified.mayWrite &&
        inItsTournament &&
        part !== "neither" &&
        !archived,
    };
  }
}
