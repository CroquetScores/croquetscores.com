import { Query } from "../../common/Query.js";

/** One of a tournament's players, as a manager lists them. */
export interface ListedPlayer {
  readonly id: string;
  readonly name: string;
  /** The club, region or country they play for, if any. */
  readonly representing: string | undefined;
  /** The name of the flag they fly, if any. */
  readonly flag: string | undefined;
  readonly archived: boolean;
  /**
   * Whether they have played any games, as the application's games say,
   * since a player who has cannot be archived.
   */
  readonly hasPlayed: boolean;
}

/**
 * The players of the tournament `tournament`, archived ones among them, in
 * order of their names as a reader looks for a name in a list, as the account
 * the reader is signed in to lists them. It names that account and never one
 * the reader chose.
 *
 * Only the tournament's managers can ask, since the list is for managing its
 * players: anybody else, a scorer among them, is refused with
 * `Tournament.NotAManager`. A tournament there is not is refused as
 * `PlayersOfTournament.NoSuchTournament`, and a forgotten account asking is
 * refused with `Account.Forgotten`.
 */
export class PlayersOfTournament extends Query<readonly ListedPlayer[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
  ) {
    super();
  }
}
