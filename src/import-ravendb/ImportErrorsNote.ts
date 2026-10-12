import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import type { TournamentManagerNotes } from "../application/operations/tournaments/managerNoteOperations.js";
import type { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { ManagerNote } from "../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteId } from "../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { ManagerNoteDescription } from "../domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import { tournamentBecome } from "./ImportTournamentPlayers.js";
import type { SeeNotes } from "./SeeNotes.js";
import { plainPlayerReasonOf, plainReasonOf } from "./errorSummaries.js";
import type { Game as OldGame } from "./ravendb-models/Competition.js";

/** What the tournament's note of what could not be brought over is titled. */
export const IMPORT_ERRORS_TITLE = "Import Errors";

const INTRO =
  "The following games could not be added to the new version of Croquet Scores. The reason is given with each game.";

// A player of a game as the note says them: their name, and the team or club
// they represented where they had one, as "Ann Able (New Zealand)".
interface PlayerOfGame {
  readonly _Id: number;
  readonly Representing: string | null;
}

/**
 * A player who could not be entered as a line of the note: who, with their
 * team or club where they had one, and why, said for a reader.
 */
export const playerNoteLineOf = (
  name: string,
  representing: string | null,
  failure: unknown,
): string => {
  const team = (representing ?? "").trim();
  return `${name}${team === "" ? "" : ` (${team})`} was not entered because ${plainPlayerReasonOf(failure)}.`;
};

/**
 * A game that could not be added as a line of the note: who beat whom, with
 * each one's team or club and score, and why it could not be added, said for a
 * reader of the tournament.
 */
export const noteLineOf = (
  game: OldGame,
  failure: unknown,
  players: readonly PlayerOfGame[],
  nameOf: (number: number) => string,
): string => {
  const said = (number: number, score: string): string => {
    const team = (
      players.find((player) => player._Id === number)?.Representing ?? ""
    ).trim();
    return `${nameOf(number)}${team === "" ? "" : ` (${team})`} ${score.trim()}`;
  };
  return `${said(game.Winner.PlayerId, game.Winner.Score._Score)} beat ${said(game.Loser.PlayerId, game.Loser.Score._Score)}. Not added because ${plainReasonOf(failure)}.`;
};

/**
 * Says, in a note of the tournament's, the games of its team matches that
 * could not be brought over, a section for each team match and a line for
 * each game (ImportTeamMatches.feature): one note for the tournament, which
 * each team match adds its section to. croquetscores@gmail.com, who writes
 * it, is made a manager of the tournament.
 */
export class ImportErrorsNote {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly notes: AggregateRepository<ManagerNote, ManagerNoteId>,
    private readonly noteHeadings: TournamentManagerNotes,
    private readonly database: ImportDatabase,
    private readonly seeNotes: SeeNotes,
  ) {}

  /** Who writes the note, or nothing where no user was brought over as them. */
  writer(): Promise<AccountId | undefined> {
    return this.seeNotes.writer();
  }

  /**
   * Adds the section of the team match called `competition`, with a line for
   * each of `games`, to the note of the tournament the document
   * `tournamentDocumentId` on `website` became, making the note where it has
   * none. Kept in one transaction with the writer being made a manager.
   */
  async add(
    website: string,
    tournamentDocumentId: string,
    competition: string,
    games: readonly string[],
    writer: AccountId,
  ): Promise<void> {
    await this.unitOfWork.inTransaction(async () => {
      const tournament = await tournamentBecome(
        this.database,
        this.tournaments,
        website,
        tournamentDocumentId,
      );
      // Done as the tournament's first manager, who created it, when it was
      // created.
      const [by] = tournament.managers;
      if (by === undefined) throw new Error("The tournament has no manager.");
      const at = tournament.starts;
      tournament.addManager(writer, by, at);
      await this.tournaments.save(tournament);

      const section = `### ${competition}\n\n${games.join("\n\n")}`;
      const title = ManagerNoteTitle.from(IMPORT_ERRORS_TITLE);
      const found = (await this.noteHeadings.of(tournament.id)).find(
        (heading) => heading.title === IMPORT_ERRORS_TITLE,
      );
      const note =
        found === undefined
          ? undefined
          : await this.notes.load(ManagerNoteId.from(found.id));
      if (note === undefined) {
        await this.notes.save(
          ManagerNote.add(
            ManagerNoteId.create(),
            tournament.id,
            title,
            ManagerNoteDescription.from(`${INTRO}\n\n${section}`),
            await this.noteHeadings.slugsTakenIn(tournament.id),
            writer,
            at,
          ),
        );
        return;
      }
      note.edit(
        title,
        ManagerNoteDescription.from(
          `${note.description?.toString() ?? INTRO}\n\n${section}`,
        ),
        writer,
        at,
      );
      await this.notes.save(note);
    });
  }
}
