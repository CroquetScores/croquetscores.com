import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ManagerNote } from "../../../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { ManagerNoteId } from "../../../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { ManagerNoteDescription } from "../../../domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../../../domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { EditManagerNote } from "./EditManagerNote.js";
import { managerNoteOf } from "./managerNoteOperations.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

/**
 * Editing one of a tournament's notes, in its own stream. Who may is the tournament's to say, and
 * whether the note may be is the note's.
 */
export class EditManagerNoteHandler extends CommandHandler<
  EditManagerNote,
  void
> {
  readonly handles: RequestType<EditManagerNote> = EditManagerNote;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly notes: AggregateRepository<ManagerNote, ManagerNoteId>,
  ) {
    super();
  }

  async handle(command: EditManagerNote): Promise<void> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "EditManagerNote",
    );
    tournament.allowWritingManagerNotes(by);
    const note = await managerNoteOf(
      this.notes,
      tournament.id,
      command.note,
      "EditManagerNote",
    );
    note.edit(
      ManagerNoteTitle.from(command.title),
      ManagerNoteDescription.from(command.description),
      by,
      command.requestedAt,
    );
    await this.notes.save(note);
  }
}
