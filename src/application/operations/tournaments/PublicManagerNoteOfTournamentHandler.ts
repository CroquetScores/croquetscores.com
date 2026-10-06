import type { ManagerNote } from "../../../domain/aggregates/tournaments/manager-notes/ManagerNote.js";
import { ManagerNoteId } from "../../../domain/aggregates/tournaments/primitives/ManagerNoteId.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicManagerNoteOfTournament,
  type TournamentManagerNoteToRead,
} from "./PublicManagerNoteOfTournament.js";
import {
  competitionsInUse,
  managerNotesChangedOf,
  noteAddressIn,
  tournamentForReaders,
  type TournamentCommentaries,
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
    private readonly changes: TournamentCommentaries,
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
    // Found at its slug by the read model of the tournament's notes, and read
    // from its own stream, which holds what it says: this is where a note is
    // read.
    const id = await this.headings.noteAt(tournament.id, query.note);
    const note =
      id === undefined
        ? undefined
        : await this.notes.load(ManagerNoteId.from(id));
    if (note === undefined || note.deleted) {
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
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.headings, tournament),
      managerNote: {
        id: note.id.value,
        title: note.title.toString(),
        description: note.description?.toString(),
        address: noteAddressIn(tournament, note.slug.toString()),
        writtenAt: note.writtenAt,
        lastEditedAt: note.lastEditedAt,
        changedAt: note.lastEditedAt ?? note.writtenAt,
      },
    };
  }
}
