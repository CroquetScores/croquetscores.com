import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";

/** Every reason asking for a tournament's page can be refused where it is asked. */
export type TournamentPageRefusedCode = "TournamentPage.NotText";

/** A tournament as its page shows it to the reader, and the reader's part in it. */
export interface TournamentAsPaged {
  readonly id: string;
  /** Where it is found now, as "2026/ac/spring-open". */
  readonly address: string;
  readonly name: string;
  /**
   * The reader's part in it, which is what the page offers them: all its tabs
   * to a manager, and its competitions alone to a scorer.
   */
  readonly part: "manager" | "scorer";
  /**
   * Whether it is played by teams, which have tests where a Standard
   * tournament's players have competitions, and so other tabs.
   */
  readonly playedByTeams: boolean;
}

/**
 * The tournament found at `address`, now or before, as its page in the admin
 * shows it to the account the reader is signed in to. It names that account
 * and never one the reader chose.
 *
 * Only its managers and scorers have anything to do there, so anybody else is
 * refused with `Tournament.NotAManager`; an archived tournament can only be
 * restored, and is refused with `Tournament.Archived`, to a scorer as to a
 * manager; and an address no tournament has been found at is refused as
 * changing one that is not there is, with `UpdateTournament.NoSuchTournament`.
 * Whether the reader has a part in it is asked first, so that somebody with
 * none is not told whether it is archived.
 */
export class TournamentPage extends Query<TournamentAsPaged> {
  constructor(
    readonly account: string,
    readonly address: string,
  ) {
    super();
    if (typeof account !== "string" || typeof address !== "string") {
      throw new ValidationError<TournamentPageRefusedCode>(
        "TournamentPage.NotText",
      );
    }
  }
}
