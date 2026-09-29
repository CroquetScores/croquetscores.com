import { Query } from "../../common/Query.js";

/** One of a competition's players, as its tournament's managers and scorers list them. */
export interface ListedCompetitionPlayer {
  /** Their id in the competition. */
  readonly id: string;
  /** The tournament player they are, by their id. */
  readonly tournamentPlayer: string;
  /** What the tournament says of the person they are. */
  readonly name: string;
  readonly representing: string | undefined;
  readonly flag: string | undefined;
  readonly withdrawn: boolean;
  /**
   * Whether they have won or lost a game, an archived one among them, since a
   * player who has cannot be removed.
   */
  readonly hasPlayed: boolean;
  /**
   * In a knockout, the player they are drawn to play now, by their id in the
   * competition, so that a scorer who chooses the winner need not choose the
   * loser. Nobody where the competition has no draw, or they play nobody yet.
   */
  readonly drawnAgainst: string | undefined;
}

/**
 * The players of the competition `competition` of the tournament
 * `tournament`, the withdrawn among them, in the competition's order, as the
 * account the reader is signed in to lists them. It names that account and
 * never one the reader chose.
 *
 * Only the tournament's managers and scorers can ask: anybody else is refused
 * with `Tournament.NotAManagerOrScorer`. A competition the tournament does not
 * have is refused with `Tournament.NoSuchCompetition`, a tournament there is
 * not as `PlayersOfCompetition.NoSuchTournament`, and a forgotten account with
 * `Account.Forgotten`.
 */
export class PlayersOfCompetition extends Query<
  readonly ListedCompetitionPlayer[]
> {
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
