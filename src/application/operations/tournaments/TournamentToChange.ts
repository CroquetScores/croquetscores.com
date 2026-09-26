import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for a tournament to change can be refused where it is asked. */
export type TournamentToChangeRefusedCode = "TournamentToChange.NotText";

/**
 * A tournament as a form to change it begins: everything it is, written as a
 * form writes it, and where it is found now.
 */
export interface ChangingTournament {
  readonly id: string;
  /** Where it is found now, as "2026/ac/spring-open". */
  readonly address: string;
  readonly name: string;
  /** Each a day, written as the year, the month and the day. */
  readonly starts: string;
  readonly finishes: string;
  /** The format by its name, the sport, the country and the region by their codes. */
  readonly format: string;
  readonly sport: string;
  readonly country: string;
  readonly region: string;
  readonly notes: string | undefined;
  readonly handicap: boolean;
  readonly worldRankings: boolean;
  readonly national: boolean;
  readonly international: boolean;
}

/**
 * The tournament found at `address`, now or before, as the account the reader
 * is signed in to would change it. It names that account and never one the
 * reader chose.
 *
 * Only a tournament's managers can change it, so anybody else is refused with
 * `Tournament.NotAManager` rather than shown what they cannot use; an archived
 * tournament can only be restored, and is refused with `Tournament.Archived`;
 * and an address no tournament has been found at is refused as updating one
 * that is not there is, with `UpdateTournament.NoSuchTournament`. Whether the
 * reader manages it is asked first, so that somebody with no part in a
 * tournament is not told whether it is archived.
 */
export class TournamentToChange extends Query<ChangingTournament> {
  constructor(
    readonly account: string,
    readonly address: string,
  ) {
    super();
    if (typeof account !== "string" || typeof address !== "string") {
      throw new ValidationError<TournamentToChangeRefusedCode>(
        "TournamentToChange.NotText",
      );
    }
  }
}
