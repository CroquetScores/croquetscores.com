import { Query } from "../../common/Query.js";

/** A player in one of a tournament's teams, as a manager lists them. */
export interface ListedTeamPlayer {
  readonly id: string;
  readonly name: string;
  /** The name the world rankings know them by, if any. */
  readonly worldRankingName: string | undefined;
  readonly archived: boolean;
  /**
   * Whether they have played any games in use in the tournament's tests, as
   * the application's games say, since a player who has cannot be archived.
   */
  readonly hasPlayed: boolean;
}

/**
 * The players of the team `team` of the tournament `tournament`, archived
 * ones among them, in the team's order, as the account the reader is signed
 * in to lists them. It names that account and never one the reader chose.
 *
 * Only the tournament's managers can ask: anybody else, a scorer among them,
 * is refused with `Tournament.NotAManager`. A team the tournament does not
 * have is refused with `Tournament.NoSuchTeam`, a tournament there is not as
 * `PlayersOfTeam.NoSuchTournament`, and a forgotten account asking with
 * `Account.Forgotten`.
 */
export class PlayersOfTeam extends Query<readonly ListedTeamPlayer[]> {
  constructor(
    /** The account the reader is signed in to, from the session. */
    readonly account: string,
    /** The tournament, by its id. */
    readonly tournament: string,
    /** The team, by its id. */
    readonly team: string,
  ) {
    super();
  }
}
