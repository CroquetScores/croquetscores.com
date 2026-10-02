import { Query } from "../../common/Query.js";

/** One of a test's two teams, with its players in use. */
export interface TeamInTest {
  readonly id: string;
  readonly name: string;
  readonly shortName: string;
  /** Its players in use, in the team's order, each by id and name. */
  readonly players: readonly { readonly id: string; readonly name: string }[];
}

/**
 * The players of the test `test`, as the account the reader is signed in to
 * lists them to choose who won a game and who lost: its two teams, the first
 * first, each with its players in use. It names that account and never one
 * the reader chose.
 *
 * Only the tournament's managers and scorers can ask: anybody else is refused
 * with `Tournament.NotAManagerOrScorer`. A competition the tournament does not
 * have is refused with `Tournament.NoSuchCompetition`, one that is not a test
 * with `Tournament.NotATest`, a tournament there is not as
 * `PlayersOfTest.NoSuchTournament`, and a forgotten account asking with
 * `Account.Forgotten`.
 */
export class PlayersOfTest extends Query<readonly TeamInTest[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The test, by its id, which is a competition's. */
    readonly test: string,
  ) {
    super();
  }
}
