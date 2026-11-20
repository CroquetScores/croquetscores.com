import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicManagerNoteOfTournament,
  type TournamentManagerNoteToRead,
} from "./PublicManagerNoteOfTournament.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  managerNotesChangedFor,
  tournamentOfPage,
  formatOfPage,
} from "./tournamentOfPage.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";
import type { TournamentPages } from "./tournamentPages.js";

/**
 * A single note's page, read of the read models alone: the note is found at
 * its slug and read with what it says from the read model of the tournament's
 * notes, which keeps it as its events say.
 */
export class PublicManagerNoteOfTournamentHandler extends QueryHandler<
  PublicManagerNoteOfTournament,
  TournamentManagerNoteToRead
> {
  readonly handles: RequestType<PublicManagerNoteOfTournament> =
    PublicManagerNoteOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicManagerNoteOfTournament,
  ): Promise<TournamentManagerNoteToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicManagerNoteOfTournament",
    );
    const id = TournamentId.from(tournament.id);
    const note = await this.notes.read(id, query.note);
    if (note === undefined) {
      throw new TournamentOperationRefused(
        "PublicManagerNoteOfTournament.NoSuchManagerNote",
        "The tournament has no such note.",
      );
    }
    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      address: tournament.address,
      playedByTeams: formatOfPage(tournament).isTeamFormat,
      competitions: tournament.competitions,
      commentariesChanged: await this.changes.of(id),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      managerNote: {
        id: note.id,
        title: note.title,
        // Nothing where it says nothing, as the note's own stream would give.
        description: note.description === "" ? undefined : note.description,
        address: `${tournament.address}/notes/${note.slug}`,
        writtenAt: note.writtenAt,
        lastEditedAt: note.lastEditedAt,
        changedAt: note.changedAt,
      },
    };
  }
}
