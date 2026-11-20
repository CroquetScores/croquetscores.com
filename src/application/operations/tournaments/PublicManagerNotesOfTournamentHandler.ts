import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  PublicManagerNotesOfTournament,
  type TournamentManagerNotesToRead,
} from "./PublicManagerNotesOfTournament.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import type { TournamentAddresses } from "./tournamentOperations.js";
import { tournamentOfPage, formatOfPage } from "./tournamentOfPage.js";
import type { TournamentPages } from "./tournamentPages.js";

/**
 * A tournament's Notes page, read of the read models alone: the header from
 * the page read model, as the block and Swiss pages read theirs, and the notes
 * from the read model of them, which holds their titles and not what they say,
 * since a list is not where a note is read.
 */
export class PublicManagerNotesOfTournamentHandler extends QueryHandler<
  PublicManagerNotesOfTournament,
  TournamentManagerNotesToRead
> {
  readonly handles: RequestType<PublicManagerNotesOfTournament> =
    PublicManagerNotesOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicManagerNotesOfTournament,
  ): Promise<TournamentManagerNotesToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicManagerNotesOfTournament",
    );
    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      address: tournament.address,
      playedByTeams: formatOfPage(tournament).isTeamFormat,
      competitions: tournament.competitions,
      commentariesChanged: await this.changes.of(
        TournamentId.from(tournament.id),
      ),
      managerNotes: (await this.notes.of(TournamentId.from(tournament.id))).map(
        (note) => ({
          ...note,
          address: `${tournament.address}/notes/${note.slug}`,
        }),
      ),
    };
  }
}
