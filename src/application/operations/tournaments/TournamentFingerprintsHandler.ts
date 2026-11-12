import { Website } from "../../../domain/common/Website.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { TournamentFingerprints } from "./TournamentFingerprints.js";
import type {
  TournamentFingerprint,
  TournamentsByWebsite,
} from "./tournamentsOfWebsite.js";

export class TournamentFingerprintsHandler extends QueryHandler<
  TournamentFingerprints,
  readonly TournamentFingerprint[]
> {
  readonly handles: RequestType<TournamentFingerprints> =
    TournamentFingerprints;

  constructor(
    private readonly tournaments: Pick<TournamentsByWebsite, "fingerprintsOf">,
  ) {
    super();
  }

  handle(
    query: TournamentFingerprints,
  ): Promise<readonly TournamentFingerprint[]> {
    return this.tournaments.fingerprintsOf(Website.from(query.website));
  }
}
