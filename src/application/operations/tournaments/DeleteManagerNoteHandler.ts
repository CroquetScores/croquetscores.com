import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ManagerNote } from "../../../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { ManagerNoteId } from "../../../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { DeleteManagerNote } from "./DeleteManagerNote.js";
import { managerNoteOf } from "./managerNoteOperations.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

/**
 * Deleting one of a tournament's notes, for good, in its own stream. Who may is the tournament's to say, and
 * whether the note may be is the note's.
 */
export class DeleteManagerNoteHandler extends CommandHandler<
  DeleteManagerNote,
  void
> {
  readonly handles: RequestType<DeleteManagerNote> = DeleteManagerNote;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly notes: AggregateRepository<ManagerNote, ManagerNoteId>,
  ) {
    super();
  }

  async handle(command: DeleteManagerNote): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "DeleteManagerNote",
    );
    tournament.allowWritingManagerNotes(by);
    const note = await managerNoteOf(
      this.notes,
      tournament.id,
      command.note,
      "DeleteManagerNote",
    );
    note.delete(by, command.requestedAt);
    await this.notes.save(note);
  }
}
