import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type {
  TournamentOfWebsite,
  TournamentsByWebsite,
} from "./tournamentsOfWebsite.js";
import { TournamentsAtAddresses } from "./TournamentsAtAddresses.js";

/** The tournaments at some addresses, as the read model keeps them (TournamentsAtAddresses.feature). */
export class TournamentsAtAddressesHandler extends QueryHandler<
  TournamentsAtAddresses,
  readonly TournamentOfWebsite[]
> {
  readonly handles: RequestType<TournamentsAtAddresses> =
    TournamentsAtAddresses;

  constructor(
    private readonly tournaments: Pick<TournamentsByWebsite, "atAddresses">,
  ) {
    super();
  }

  handle(
    query: TournamentsAtAddresses,
  ): Promise<readonly TournamentOfWebsite[]> {
    return this.tournaments.atAddresses(
      Website.from(query.website),
      // Each once, in the order first given, so that an address asked about
      // twice does not put its tournament in the list twice.
      [...new Set(query.addresses)],
    );
  }
}
