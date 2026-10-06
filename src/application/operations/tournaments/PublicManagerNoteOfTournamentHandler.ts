import type { ManagerNote } from "../../../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import type { ManagerNoteId } from "../../../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  managerNoteOf,
  type TournamentManagerNotes,
} from "./managerNoteOperations.js";
import {
  PublicManagerNoteOfTournament,
  type TournamentManagerNoteToRead,
} from "./PublicManagerNoteOfTournament.js";
import {
  competitionsInUse,
  managerNotesChangedOf,
  noteAddressIn,
  tournamentForReaders,
} from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class PublicManagerNoteOfTournamentHandler extends QueryHandler<
  PublicManagerNoteOfTournament,
  TournamentManagerNoteToRead
> {
  readonly handles: RequestType<PublicManagerNoteOfTournament> =
    PublicManagerNoteOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
    private readonly notes: AggregateRepository<ManagerNote, ManagerNoteId>,
    private readonly headings: TournamentManagerNotes,
  ) {
    super();
  }

  async handle(
    query: PublicManagerNoteOfTournament,
  ): Promise<TournamentManagerNoteToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicManagerNoteOfTournament",
    );
    // Read from its own stream, which holds what it says: this is where a
    // note is read. An address can name anything, and one naming nothing that
    // could be a note's id is a note not there.
    const note = await managerNoteOf(
      this.notes,
      tournament.id,
      `manager-note/${query.note}`,
      "PublicManagerNoteOfTournament",
    );
    if (note.deleted) {
      throw new TournamentOperationRefused(
        "PublicManagerNoteOfTournament.NoSuchManagerNote",
        "The tournament has no such note.",
      );
    }
    return {
      name: tournament.name.toString(),
      notes: tournament.notes?.markdown,
      address: tournament.address.toString(),
      playedByTeams: tournament.format.isTeamFormat,
      competitions: competitionsInUse(tournament),
      managerNotes: await managerNotesChangedOf(this.headings, tournament),
      managerNote: {
        id: note.id.value,
        title: note.title.toString(),
        description: note.description?.toString(),
        address: noteAddressIn(tournament, note.id.value),
        writtenAt: note.writtenAt,
        lastEditedAt: note.lastEditedAt,
        changedAt: note.lastEditedAt ?? note.writtenAt,
      },
    };
  }
}
