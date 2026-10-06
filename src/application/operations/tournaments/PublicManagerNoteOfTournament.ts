import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type {
  CompetitionOfTournament,
  ManagerNoteChanged,
  CommentaryChanged,
} from "./tournamentForReaders.js";

/** Every reason asking for one of a tournament's notes can be refused where it is asked. */
export type PublicManagerNoteOfTournamentRefusedCode =
  "PublicManagerNoteOfTournament.NotText";

/** A note as its own page shows it, and the tournament it is a section of. */
export interface TournamentManagerNoteToRead {
  readonly name: string;
  /** Where the tournament is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /** The tournament's notes, in Markdown, or nothing where it has none. */
  readonly notes: string | undefined;
  /** Whether it is played by teams, which its sections say. */
  readonly playedByTeams: boolean;
  /** Its competitions in use, in the tournament's order. */
  readonly competitions: readonly CompetitionOfTournament[];
  /** Every one of its notes, for its section bar, the most recently written first. */
  readonly managerNotes: readonly ManagerNoteChanged[];
  /**
   * Each of the tournament's commentaries with when it last changed, for its
   * section bar to mark Commentary by.
   */
  readonly commentariesChanged: readonly CommentaryChanged[];
  readonly managerNote: ManagerNoteChanged & {
    readonly title: string;
    /** What it says beneath its title, in Markdown, or nothing. */
    readonly description: string | undefined;
    /** Where its page is found, as "2026/ac/spring-open/notes/lunch-is-at-noon". */
    readonly address: string;
    readonly writtenAt: ReadOnlyDate;
    /** When it was last edited, or nothing when it never has been. */
    readonly lastEditedAt: ReadOnlyDate | undefined;
  };
}

/**
 * The note `note` of the tournament of the website being read found at
 * `address`, now or before, as its page shows it, by its slug. For anybody, so
 * it names nobody.
 *
 * A slug no note of the tournament is found at, a deleted note's among them,
 * is refused as
 * `PublicManagerNoteOfTournament.NoSuchManagerNote`. An address no tournament
 * of the website has been found at is refused as
 * `PublicManagerNoteOfTournament.NoSuchTournament`, and so is an archived
 * tournament's.
 */
export class PublicManagerNoteOfTournament extends Query<TournamentManagerNoteToRead> {
  constructor(
    readonly website: string,
    /** Where the tournament is found, as "2026/ac/spring-open". */
    readonly address: string,
    /** The note's slug, as "lunch-is-at-noon". */
    readonly note: string,
  ) {
    super();
    if (
      typeof website !== "string" ||
      typeof address !== "string" ||
      typeof note !== "string"
    ) {
      throw new ValidationError<PublicManagerNoteOfTournamentRefusedCode>(
        "PublicManagerNoteOfTournament.NotText",
      );
    }
  }
}
