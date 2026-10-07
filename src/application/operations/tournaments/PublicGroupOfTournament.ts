import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { TeamSummaryToRead } from "./PublicTeamSummaryOfTournament.js";
import type { CompetitionOfTournament } from "./tournamentForReaders.js";

/** Every reason asking for a group of a tournament's tests can be refused where it is asked. */
export type PublicGroupOfTournamentRefusedCode =
  "PublicGroupOfTournament.NotText";

/**
 * How the teams of a group of a tournament's tests stand, answered as the
 * tournament's summary is, of the group's teams and tests alone, with the
 * group and its tests.
 */
export interface GroupToRead extends TeamSummaryToRead {
  /** The group, by its name as the first of its tests says it, and its slug. */
  readonly group: { readonly name: string; readonly slug: string };
  /** The group's tests in use, in the tournament's order, for its page to offer. */
  readonly tests: readonly CompetitionOfTournament[];
}

/**
 * How the teams of the group found by `group`, its slug, of the tournament of
 * the website being read found at `address`, now or before, stand. For
 * anybody, so it names nobody.
 *
 * A slug no group of the tournament's tests in use makes is refused as
 * `PublicGroupOfTournament.NoSuchGroup`; a Standard tournament as
 * `PublicGroupOfTournament.NotPlayedByTeams`; and an address no tournament of
 * the website has been found at, or an archived tournament's, as
 * `PublicGroupOfTournament.NoSuchTournament`.
 */
export class PublicGroupOfTournament extends Query<GroupToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-tests". */
    readonly address: string,
    /** The group's slug, as "block-a". */
    readonly group: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof address !== "string" ||
      typeof group !== "string"
    ) {
      throw new ValidationError<PublicGroupOfTournamentRefusedCode>(
        "PublicGroupOfTournament.NotText",
      );
    }
  }
}
