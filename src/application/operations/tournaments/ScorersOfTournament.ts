import { Query } from "../../common/Query.js";

/** One of a tournament's scorers, as a manager lists them. */
export interface ListedScorer {
  /** The account's id, which is what taking the scorer off names them by. */
  readonly id: string;
  /** The account's name, which is what a reader knows somebody by. */
  readonly name: string;
}

/**
 * The scorers of the tournament `tournament`, in the order they were made, as
 * the account the reader is signed in to lists them. It names that account and
 * never one the reader chose.
 *
 * Only the tournament's managers can ask, since the list is for managing its
 * scorers: anybody else, a scorer among them, is refused with
 * `Tournament.NotAManager`. A tournament there is not is refused as
 * `ScorersOfTournament.NoSuchTournament`, and a forgotten account asking is
 * refused with `Account.Forgotten`. A forgotten account that still scores the
 * tournament is not answered, since no query answers one unless it is
 * expressly asked to.
 */
export class ScorersOfTournament extends Query<readonly ListedScorer[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
  ) {
    super();
  }
}
