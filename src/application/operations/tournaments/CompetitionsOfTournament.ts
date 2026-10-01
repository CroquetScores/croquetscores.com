import { Query } from "../../common/Query.js";

/**
 * One of a tournament's competitions, as a manager lists them, with its shape,
 * so that a change to it can start from what it is.
 */
export type ListedCompetition = {
  readonly id: string;
  readonly name: string;
  /** Where it is found under the tournament. */
  readonly slug: string;
  readonly archived: boolean;
} & (
  | {
      // A test is answered as far as it is a competition: what each of its
      // matches is the best of. Its teams and its days are not answered yet.
      readonly kind: "block" | "swiss" | "test";
      /** What each match is the best of. */
      readonly bestOf: number;
    }
  | {
      readonly kind: "knockout";
      /** How many places the draw has. */
      readonly places: number;
      /** What each round is the best of, the first round first. */
      readonly rounds: readonly number[];
    }
);

/**
 * The competitions of the tournament `tournament`, in the tournament's order,
 * lowest first, as the account the reader is signed in to lists them: every
 * one, archived ones among them, to a manager, and those in use alone to a
 * scorer, since an archived one has no scores to enter. It names that account
 * and never one the reader chose.
 *
 * Only the tournament's managers and scorers can ask: anybody else is refused
 * with `Tournament.NotAManager`. A tournament there is not is refused as
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
