import { Query } from "../../common/Query.js";

/** One of a tournament's competitions, as a manager lists them. */
export interface ListedCompetition {
  readonly id: string;
  readonly name: string;
  readonly kind: "block" | "knockout" | "swiss";
  /** Where it is found under the tournament. */
  readonly slug: string;
  readonly archived: boolean;
}

/**
 * The competitions of the tournament `tournament`, archived ones among them,
 * in the tournament's order, lowest first, as the account the reader is signed
 * in to lists them. It names that account and never one the reader chose.
 *
 * Only the tournament's managers can ask, since the list is for managing its
 * competitions: anybody else, a scorer among them, is refused with
 * `Tournament.NotAManager`. A tournament there is not is refused as
 * `CompetitionsOfTournament.NoSuchTournament`, and a forgotten account asking
 * is refused with `Account.Forgotten`.
 */
export class CompetitionsOfTournament extends Query<
  readonly ListedCompetition[]
> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
  ) {
    super();
  }
}
