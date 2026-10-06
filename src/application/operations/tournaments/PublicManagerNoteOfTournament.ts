import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type {
  CompetitionOfTournament,
  ManagerNoteChanged,
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
  readonly managerNote: ManagerNoteChanged & {
    readonly title: string;
    /** What it says beneath its title, in Markdown, or nothing. */
    readonly description: string | undefined;
    /** Where its page is found, as "2026/ac/spring-open/notes/0d1e2f3a-…". */
    readonly address: string;
    readonly writtenAt: ReadOnlyDate;
    /** When it was last edited, or nothing when it never has been. */
    readonly lastEditedAt: ReadOnlyDate | undefined;
  };
}

/**
 * The note `note` of the tournament of the website being read found at
 * `address`, now or before, as its page shows it, by the part of its id after
 * "manager-note/". For anybody, so it names nobody.
 *
 * A note the tournament does not have, or has deleted, or anything that is no
 * note's id at all, is refused as
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
    /** The part of the note's id after "manager-note/". */
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
