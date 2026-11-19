import { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { IdentifyApiKey } from "../accounts/IdentifyApiKey.js";
import type { IdentifyApiKeyHandler } from "../accounts/IdentifyApiKeyHandler.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import {
  TournamentOperationRefused,
  tournamentFor,
} from "./tournamentOperations.js";
import {
  type PartInTournament,
  type WhatAKeyMayDo,
  WhatAKeyMayDoInTournament,
} from "./WhatAKeyMayDoInTournament.js";

/**
 * What a key may do in a tournament. Who the key acts as is found as any key
 * is, by the handler that identifies one, so that a key revoked or an account
 * forgotten is let in by nothing here either. The tournament is asked after
 * that, so that nobody learns which tournaments there are by presenting a key
 * that does not work.
 */
export class WhatAKeyMayDoInTournamentHandler extends QueryHandler<
  WhatAKeyMayDoInTournament,
  WhatAKeyMayDo | undefined
> {
  readonly handles: RequestType<WhatAKeyMayDoInTournament> =
    WhatAKeyMayDoInTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
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
    // What is not an id at all names no tournament, and is refused as one
    // that is not there, since an app that mistyped an address has no use for
    // a finer answer.
    const tournament = await tournamentFor(
      this.tournaments,
      query.tournament,
      "WhatAKeyMayDoInTournament",
    ).catch((failure: unknown) => {
      if (!(failure instanceof ValidationError)) throw failure;
      throw new TournamentOperationRefused(
        "WhatAKeyMayDoInTournament.NoSuchTournament",
        "There is no such tournament.",
      );
    });
    const account = AccountId.from(identified.account);
    const part: PartInTournament = tournament.manages(account)
      ? "manager"
      : tournament.scores(account)
        ? "scorer"
        : "neither";
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
        !tournament.archived,
    };
  }
}
