import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import { ManagerNote } from "../../../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteId } from "../../../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { ManagerNoteDescription } from "../../../domain/aggregates/tournaments/value-objects/ManagerNoteDescription.js";
import { ManagerNoteTitle } from "../../../domain/aggregates/tournaments/value-objects/ManagerNoteTitle.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import { CommandHandler } from "../../common/CommandHandler.js";
import type { RequestType } from "../../common/Mediator.js";
import { AddManagerNote } from "./AddManagerNote.js";
import { askedBy, tournamentFor } from "./tournamentOperations.js";

/**
 * Adding a note to a tournament, in a stream of its own. It is answered with
 * the new note's id. Who may is the tournament's to say, since it knows its
 * managers, and it records nothing of its own.
 */
export class AddManagerNoteHandler extends CommandHandler<
  AddManagerNote,
  ManagerNoteId
> {
  readonly handles: RequestType<AddManagerNote> = AddManagerNote;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly notes: AggregateRepository<ManagerNote, ManagerNoteId>,
  ) {
    super();
  }

  async handle(command: AddManagerNote): Promise<ManagerNoteId> {
    const by = await askedBy(this.accounts, command.account);
    const tournament = await tournamentFor(
      this.tournaments,
      command.tournament,
      "AddManagerNote",
    );
    tournament.allowWritingManagerNotes(by);
    const id = ManagerNoteId.create();
    await this.notes.save(
      ManagerNote.add(
        id,
        tournament.id,
        ManagerNoteTitle.from(command.title),
        ManagerNoteDescription.from(command.description),
        by,
        command.requestedAt,
      ),
    );
    return id;
  }
}
