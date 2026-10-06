import type { ReadOnlyDate } from "../../../domain/common/ReadOnlyDate.js";
import { ValidationError } from "../../../domain/common/validation/ValidationError.js";
import { Query } from "../../common/Query.js";
import type {
  CompetitionOfTournament,
  ManagerNoteChanged,
} from "./tournamentForReaders.js";

/** Every reason asking for a tournament's notes can be refused where it is asked. */
export type PublicManagerNotesOfTournamentRefusedCode =
  "PublicManagerNotesOfTournament.NotText";

/** A note as a tournament's Notes page lists it and leads to it. */
export interface PublicManagerNoteListed extends ManagerNoteChanged {
  readonly title: string;
  /** Where its page is found, as "2026/ac/spring-open/notes/0d1e2f3a-…". */
  readonly address: string;
  readonly writtenAt: ReadOnlyDate;
}

/** A tournament as its Notes page shows it: what it is, its sections, its notes. */
export interface TournamentManagerNotesToRead {
  readonly name: string;
  /** Where it is found now, as "2026/ac/spring-open". */
  readonly address: string;
  /** The tournament's notes, in Markdown, or nothing where it has none. */
  readonly notes: string | undefined;
  /** Whether it is played by teams, which its sections say. */
  readonly playedByTeams: boolean;
  /** Its competitions in use, in the tournament's order. */
  readonly competitions: readonly CompetitionOfTournament[];
  /** Every note its managers wrote, the most recently written first. */
  readonly managerNotes: readonly PublicManagerNoteListed[];
}

/**
 * The notes the managers of the tournament of the website being read found at
 * `address`, now or before, wrote, as its Notes page lists them. For anybody,
 * so it names nobody.
 *
 * An address no tournament of the website has been found at is refused as
 * `PublicManagerNotesOfTournament.NoSuchTournament`, and so is an archived
 * tournament's.
 */
export class PublicManagerNotesOfTournament extends Query<TournamentManagerNotesToRead> {
  constructor(
    readonly website: string,
    /** Where it is found, as "2026/ac/spring-open". */
    readonly address: string,
  ) {
    super();
    if (typeof website !== "string" || typeof address !== "string") {
      throw new ValidationError<PublicManagerNotesOfTournamentRefusedCode>(
        "PublicManagerNotesOfTournament.NotText",
      );
    }
  }
}
