import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for a competition's page can be refused where it is asked. */
export type CompetitionPageRefusedCode = "CompetitionPage.NotText";

/** A competition as its page shows it to the reader, and the reader's part in it. */
export interface CompetitionAsPaged {
  readonly id: string;
  /** Its tournament's id, which the rest of the API names it by. */
  readonly tournament: string;
  readonly name: string;
  /**
   * What kind of competition it is, since a knockout's players are fixed once
   * it has a game.
   */
  readonly kind: "block" | "knockout" | "swiss" | "test";
  /** Where its tournament is found now, as "2026/ac/spring-open". */
  readonly tournamentAddress: string;
  /** Where it is found beneath its tournament. */
  readonly slug: string;
  /**
   * The reader's part in its tournament, which is what the page offers them:
   * both its tabs to a manager, and its scores alone to a scorer.
   */
  readonly part: "manager" | "scorer";
}

/**
 * The competition found at `slug` in the tournament found at `address`, now or
 * before, as its page in the admin shows it to the account the reader is
 * signed in to. It names that account and never one the reader chose.
 *
 * Only the tournament's managers and scorers see it: anybody else is refused
 * with `Tournament.NotAManagerOrScorer`, and asked that first, so that
 * somebody with no part in it is told nothing else about it. An archived
 * tournament is refused with `Tournament.Archived`, an archived competition
 * with `Tournament.CompetitionArchived`, since it can only be restored, and a
 * slug the tournament has no competition at with
 * `Tournament.NoSuchCompetition`. An address no tournament has been found at
 * is refused as changing one that is not there is, with
 * `UpdateTournament.NoSuchTournament`.
 */
export class CompetitionPage extends Query<CompetitionAsPaged> {
  constructor(
    readonly account: string,
    /** Where its tournament was asked for, as "2026/ac/spring-open". */
    readonly address: string,
    readonly slug: string,
  ) {
    super();
    if (
      typeof account !== "string" ||
      typeof address !== "string" ||
      typeof slug !== "string"
    ) {
      throw new ValidationError<CompetitionPageRefusedCode>(
        "CompetitionPage.NotText",
      );
    }
  }
}
