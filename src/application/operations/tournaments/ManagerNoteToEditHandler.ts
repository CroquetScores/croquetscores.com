import type { Account } from "../../../domain/aggregates/accounts/Account.js";
import type { AccountId } from "../../../domain/aggregates/accounts/AccountId.js";
import type { ManagerNote } from "../../../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { ManagerNoteId } from "../../../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import { managerNoteOf } from "./managerNoteOperations.js";
import {
  type ManagerNoteAsItIs,
  ManagerNoteToEdit,
} from "./ManagerNoteToEdit.js";
import {
  managedBy,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class ManagerNoteToEditHandler extends QueryHandler<
  ManagerNoteToEdit,
  ManagerNoteAsItIs
> {
  readonly handles: RequestType<ManagerNoteToEdit> = ManagerNoteToEdit;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly accounts: AggregateRepository<Account, AccountId>,
    private readonly notes: AggregateRepository<ManagerNote, ManagerNoteId>,
  ) {
    super();
  }

  async handle(query: ManagerNoteToEdit): Promise<ManagerNoteAsItIs> {
    const { tournament } = await managedBy(
      this.tournaments,
      this.accounts,
      query.account,
      query.tournament,
      "ManagerNoteToEdit",
    );
    const note = await managerNoteOf(
      this.notes,
      tournament.id,
      query.note,
      "ManagerNoteToEdit",
    );
    // A note deleted is not one there is to edit.
    if (note.deleted) {
      throw new TournamentOperationRefused(
        "ManagerNoteToEdit.NoSuchManagerNote",
        "The tournament has no such note.",
      );
    }
    return {
      title: note.title.toString(),
      description: note.description?.toString(),
    };
  }
}
