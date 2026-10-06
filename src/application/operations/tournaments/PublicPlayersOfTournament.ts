import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type {
  CompetitionOfTournament,
  ManagerNoteChanged,
  CommentaryChanged,
} from "./tournamentForReaders.js";

/** Every reason asking for a tournament's players can be refused where it is asked. */
export type PublicPlayersOfTournamentRefusedCode =
  "PublicPlayersOfTournament.NotText";

/** A player as a tournament's players' page shows them and leads to them. */
export interface PublicPlayer {
  /** What the tournament calls them now. */
  readonly name: string;
  /** What they represent, or nothing where they represent nothing. */
  readonly representing?: string | undefined;
  /** The name of the flag they fly, or nothing where they fly none. */
  readonly flag?: string | undefined;
  /** Where their page is found, as "2026/ac/spring-open/players/sam-someone". */
  readonly address: string;
}

/** A tournament as its players' page shows it: what it is, its sections, its players. */
export interface TournamentPlayersToRead {
  readonly name: string;
  /** Where it is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /** The tournament's notes, in Markdown, or nothing where it has none. */
  readonly notes: string | undefined;
  /**
   * Each of the tournament's notes with when it last changed, the most
   * recently written first, for its section bar to mark Notes by.
   */
  readonly managerNotes: readonly ManagerNoteChanged[];
  /**
   * Each of the tournament's commentaries with when it last changed, for its
   * section bar to mark Commentary by.
   */
  readonly commentariesChanged: readonly CommentaryChanged[];
  /** Its competitions in use, in the tournament's order. */
  readonly competitions: readonly CompetitionOfTournament[];
  /**
   * Whether it is played by teams, whose players are their teams' rather
   * than its own, and are answered in `teams`.
   */
  readonly playedByTeams: boolean;
  /**
   * Every player not archived, in alphabetical order of their names; none
   * for a tournament played by teams.
   */
  readonly players: readonly PublicPlayer[];
  /**
   * For a tournament played by teams, each team not archived, in the
   * tournament's order, with its players not archived, in alphabetical order
   * of their names; none for a Standard tournament.
   */
  readonly teams: readonly TeamOfPlayers[];
}

/** A team, by its name, and its players, as its players' page lists them. */
export interface TeamOfPlayers {
  readonly name: string;
  readonly players: readonly TeamPlayerOfPlayers[];
}

/** A player in a team, as the players' page lists them and leads to them. */
export interface TeamPlayerOfPlayers {
  /** What the tournament calls them now. */
  readonly name: string;
  /** Where their page is found, as "2026/ac/spring-tests/players/pat-player". */
  readonly address: string;
}

/**
 * The players of the tournament of the website being read found at `address`,
 * now or before, as its players' page shows them. For anybody, so it names
 * nobody.
 *
 * A tournament played by teams has no players of its own, and is answered
 * with its teams' instead, team by team. An address no tournament of the
 * website has been found at is refused as
 * `PublicPlayersOfTournament.NoSuchTournament`, and so is an archived
 * tournament's.
 */
export class PublicPlayersOfTournament extends Query<TournamentPlayersToRead> {
  constructor(
    readonly website: string,
    /** Where it is found, as "2026/ac/spring-open". */
    readonly address: string,
  ) {
    super();
    if (typeof website !== "string" || typeof address !== "string") {
      throw new ValidationError<PublicPlayersOfTournamentRefusedCode>(
        "PublicPlayersOfTournament.NotText",
      );
    }
  }
}
