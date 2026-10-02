import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for a team's page can be refused where it is asked. */
export type TeamPageRefusedCode = "TeamPage.NotText";

/** A team as its page in the admin shows it. */
export interface TeamAsPaged {
  readonly id: string;
  /** The id of the tournament it is in. */
  readonly tournament: string;
  readonly name: string;
  readonly shortName: string;
  /** The code of the flag it flies, if any. */
  readonly flag: string | undefined;
  /** Where its tournament is found now, as "2026/ac/spring-tests". */
  readonly tournamentAddress: string;
  readonly slug: string;
}

/**
 * The team found at `slug` in the tournament found at `address`, now or
 * before, as its page in the admin shows it to the account the reader is
 * signed in to. It names that account and never one the reader chose.
 *
 * A team's players are its managers' to say, so only they see it: anybody
 * else, a scorer among them, is refused with `Tournament.NotAManager`, and
 * asked that first, so that somebody with no part in it is told nothing else
 * about it. An archived tournament is refused with `Tournament.Archived`, an
 * archived team with `Tournament.TeamArchived`, since either can only be
 * restored, and a slug the tournament has no team at with
 * `Tournament.NoSuchTeam`. An address no tournament has been found at is
 * refused as changing one that is not there is, with
 * `UpdateTournament.NoSuchTournament`.
 */
export class TeamPage extends Query<TeamAsPaged> {
  constructor(
    readonly account: string,
    readonly address: string,
    readonly slug: string,
  ) {
    super();
    if (
      typeof account !== "string" ||
      typeof address !== "string" ||
      typeof slug !== "string"
    ) {
      throw new ValidationError<TeamPageRefusedCode>("TeamPage.NotText");
    }
  }
}
