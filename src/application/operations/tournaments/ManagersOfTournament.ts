import { Query } from "../../common/Query.js";

/** One of a tournament's managers, as a manager lists them. */
export interface ListedManager {
  /** The account's id, which is what taking the manager off names them by. */
  readonly id: string;
  /** The account's name, which is what a reader knows somebody by. */
  readonly name: string;
  /**
   * Whether it is the account asking, since taking oneself off is taking away
   * one's own way back to the tournament.
   */
  readonly isReader: boolean;
}

/**
 * The managers of the tournament `tournament`, in the order they were made,
 * whoever created it first, as the account the reader is signed in to lists
 * them. It names that account and never one the reader chose.
 *
 * Only the tournament's managers can ask, since the list is for managing them:
 * anybody else, a scorer among them, is refused with `Tournament.NotAManager`.
 * A tournament there is not is refused as
 * `ManagersOfTournament.NoSuchTournament`, and a forgotten account asking is
 * refused with `Account.Forgotten`. A forgotten account that still manages the
 * tournament is not answered, since no query answers one unless it is
 * expressly asked to.
 */
export class ManagersOfTournament extends Query<readonly ListedManager[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
  ) {
    super();
  }
}
