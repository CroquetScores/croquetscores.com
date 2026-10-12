import { Query } from "../../common/Query.js";

/** One of a competition's games, as its tournament's managers and scorers list them. */
export interface ListedGame {
  readonly id: string;
  /** What the tournament calls the winner now. */
  readonly winner: string;
  /** The winner by their id in the competition, for choosing them again. */
  readonly winnerId: string;
  /** The winner's score as it was typed, as "26tp". */
  readonly winnerScore: string;
  readonly loser: string;
  readonly loserId: string;
  readonly loserScore: string;
  readonly archived: boolean;
  /** Whether it could be archived now, as the competition would say. */
  readonly archivable: boolean;
  /**
   * Whether it was withdrawn (`withdrawGame.feature`), which a manager
   * reverses here. A withdrawn player's games count for nothing too, but
   * that is the player's state, said on the players' tab, and not this.
   */
  readonly withdrawn: boolean;
  /** Whether it could be withdrawn now, as the competition would say. */
  readonly withdrawable: boolean;
  /**
   * In a test, the id of the team each player plays for, so that a list can
   * set each team's players on its side whoever won; nothing elsewhere.
   */
  readonly winnerTeam?: string | undefined;
  readonly loserTeam?: string | undefined;
}

/**
 * The games of the competition `competition` of the tournament `tournament`,
 * archived ones among them, in the order they were added, as the account the
 * reader is signed in to lists them. It names that account and never one the
 * reader chose.
 *
 * Only the tournament's managers and scorers can ask: anybody else is refused
 * with `Tournament.NotAManagerOrScorer`. A competition the tournament does not
 * have is refused with `Tournament.NoSuchCompetition`, a tournament there is
 * not as `GamesOfCompetition.NoSuchTournament`, and a forgotten account with
 * `Account.Forgotten`.
 */
export class GamesOfCompetition extends Query<readonly ListedGame[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The competition, by its id. */
    readonly competition: string,
  ) {
    super();
  }
}
