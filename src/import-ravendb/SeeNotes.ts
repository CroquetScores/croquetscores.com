import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import type { TournamentManagerNotes } from "../application/operations/tournaments/managerNoteOperations.js";
import { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import { EmailAddress } from "../domain/aggregates/accounts/value-objects/EmailAddress.js";
import { ManagerNote } from "../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import { ManagerNoteId } from "../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { ManagerNoteDescription } from "../domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import { newSitePathOf } from "./AcceptedImportErrors.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import {
  tournamentBecome,
  writerMadeManager,
} from "./ImportTournamentPlayers.js";

/** Who the notes are written by, and who is asked about them. */
export const NOTES_ADDRESS = "croquetscores@gmail.com";

// A note's title fits a line of a list on a phone (ManagerNoteTitle.ts).
const MOST_TITLE_CHARACTERS = 100;

/**
 * What the import says, in a note of the tournament's, of a competition it
 * could not bring over as it was (ImportWholeTournaments.feature): that it
 * was a block, knockout or Swiss, that its games are all in a Swiss of the
 * tournament's, in the order they were entered, and where that is, for
 * whoever has a query.
 */
export class SeeNotes {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly notes: AggregateRepository<ManagerNote, ManagerNoteId>,
    private readonly noteSlugs: TournamentManagerNotes,
    private readonly database: ImportDatabase,
  ) {}

  /**
   * The account notes are written by, or nothing where no user at
   * croquetscores@gmail.com was brought over, in which case no note is
   * written and no Swiss is made.
   */
  async writer(): Promise<AccountId | undefined> {
    const found = await this.database.findImportedAccount(
      EmailAddress.from(NOTES_ADDRESS),
    );
    return found === undefined ? undefined : AccountId.from(found);
  }

  /**
   * Makes the writer a manager of the tournament the tournament document
   * `tournamentDocumentId` on `website` became, where they are not, and
   * writes the note of the competition `name`, which was a `kind`, whose
   * games are the Swiss `swiss` of it, titled as it was called. Kept in one
   * transaction, so that the note is never written for a manager that is
   * not.
   */
  async write(
    website: string,
    tournamentDocumentId: string,
    name: string,
    kind: string,
    swiss: CompetitionId,
    writer: AccountId,
  ): Promise<string> {
    return this.unitOfWork.inTransaction(async () => {
      const tournament = await tournamentBecome(
        this.database,
        this.tournaments,
        website,
        tournamentDocumentId,
      );
      const at = await writerMadeManager(this.tournaments, tournament, writer);

      const path = newSitePathOf(tournament, swiss);
      // At the website the tournament was on, croquetscores.com or
      // gateballscores.com, whichever the import is bringing it over from.
      const where = path ?? tournament.address.toString();
      const address = `https://${website}/${where}`;
      await this.notes.save(
        ManagerNote.add(
          ManagerNoteId.create(),
          tournament.id,
          ManagerNoteTitle.from(
            [...name].slice(0, MOST_TITLE_CHARACTERS).join("").trim(),
          ),
          ManagerNoteDescription.from(
            `In the old croquetscores.com system \`${name}\` was a \`${kind}\`. ` +
              "However for various reasons the games could not be imported in the format. " +
              "All games are recorded in the same order as a swiss competition.\n\n" +
              `If you have any queries please email ${NOTES_ADDRESS}. ` +
              `Please include the tournament address \`${address}\`.`,
          ),
          await this.noteSlugs.slugsTakenIn(tournament.id),
          writer,
          at,
        ),
      );
      return where;
    });
  }
}
