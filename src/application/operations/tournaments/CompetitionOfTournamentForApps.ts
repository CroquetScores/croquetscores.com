import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type { CompetitionHead } from "./competitionForApps.js";

/** Every reason asking for a competition for an app can be refused where it is asked. */
export type CompetitionOfTournamentForAppsRefusedCode =
  "CompetitionOfTournamentForApps.NotText";

/** A competition as an app is told of it. */
export interface CompetitionToTell {
  readonly competition: CompetitionHead;
  /** Where its page is on the public site, as "2026/ac/spring-open/competitions/block-a". */
  readonly address: string;
}

/**
 * The competition `competition` of the tournament `tournament`, both by id, of
 * the website being read. For anybody, so it names nobody. Refused as
 * `NoSuchTournament` or `NoSuchCompetition` as the standings and games are.
 */
export class CompetitionOfTournamentForApps extends Query<CompetitionToTell> {
  constructor(
    readonly website: string,
    readonly tournament: string,
    readonly competition: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof tournament !== "string" ||
      typeof competition !== "string"
    ) {
      throw new ValidationError<CompetitionOfTournamentForAppsRefusedCode>(
        "CompetitionOfTournamentForApps.NotText",
      );
    }
  }
}
