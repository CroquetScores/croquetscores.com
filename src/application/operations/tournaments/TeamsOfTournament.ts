import { Query } from "../../common/Query.js";

/** One of a tournament's teams, as a manager lists them. */
export interface ListedTeam {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  /** The name of the flag it flies, if any. */
  readonly flag: string | undefined;
  /** Where its page is found under the tournament. */
  readonly slug: string;
  readonly archived: boolean;
  /**
   * Whether it plays in a test in use, since a team that does cannot be
   * archived.
   */
  readonly inATest: boolean;
}

/**
 * The teams of the tournament `tournament`, archived ones among them, in the
 * tournament's order, as the account the reader is signed in to lists them.
 * It names that account and never one the reader chose.
 *
 * Only the tournament's managers can ask, since the teams are theirs to
 * manage: anybody else, a scorer among them, is refused with
 * `Tournament.NotAManager`. A tournament there is not is refused as
 * `TeamsOfTournament.NoSuchTournament`, and a forgotten account asking is
 * refused with `Account.Forgotten`. A Standard tournament is answered with no
 * teams.
 */
export class TeamsOfTournament extends Query<readonly ListedTeam[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
  ) {
    super();
  }
}
