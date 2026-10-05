import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { CompetitionOfTournament } from "./tournamentForReaders.js";

/** Every reason asking for a tournament's commentaries can be refused where it is asked. */
export type PublicCommentariesOfTournamentRefusedCode =
  "PublicCommentariesOfTournament.NotText";

/** A commentary as a tournament's commentaries page lists it and leads to it. */
export interface PublicCommentaryListed {
  /** Its id, which the page that starts one finds it by once started. */
  readonly id: string;
  readonly title: string;
  /** What its writer's account is called now. */
  readonly writer: string;
  /** Where its page is found, as "2026/ac/spring-open/commentaries/day-one". */
  readonly address: string;
}

/** A tournament as its commentaries page shows it: what it is, its sections, its commentaries. */
export interface TournamentCommentariesToRead {
  /** Its id, which a commentary started on it names. */
  readonly id: string;
  readonly name: string;
  /** Where it is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /** Whether it is played by teams, which its sections say. */
  readonly playedByTeams: boolean;
  /** Its competitions in use, in the tournament's order. */
  readonly competitions: readonly CompetitionOfTournament[];
  /** Every commentary whose writer is not forgotten, the most recently started first. */
  readonly commentaries: readonly PublicCommentaryListed[];
}

/**
 * The commentaries on the tournament of the website being read found at
 * `address`, now or before, as its commentaries page shows them. For anybody,
 * so it names nobody.
 *
 * A commentary whose writer's account has been forgotten is left out. An
 * address no tournament of the website has been found at is refused as
 * `PublicCommentariesOfTournament.NoSuchTournament`, and so is an archived
 * tournament's.
 */
export class PublicCommentariesOfTournament extends Query<TournamentCommentariesToRead> {
  constructor(
    readonly website: string,
    /** Where it is found, as "2026/ac/spring-open". */
    readonly address: string,
  ) {
    super();
    if (typeof website !== "string" || typeof address !== "string") {
      throw new ValidationError<PublicCommentariesOfTournamentRefusedCode>(
        "PublicCommentariesOfTournament.NotText",
      );
    }
  }
}
