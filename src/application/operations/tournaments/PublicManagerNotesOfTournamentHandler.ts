import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  PublicManagerNotesOfTournament,
  type TournamentManagerNotesToRead,
} from "./PublicManagerNotesOfTournament.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  competitionsInUse,
  noteAddressIn,
  tournamentForReaders,
} from "./tournamentForReaders.js";
import type { TournamentAddresses } from "./tournamentOperations.js";

export class PublicManagerNotesOfTournamentHandler extends QueryHandler<
  PublicManagerNotesOfTournament,
  TournamentManagerNotesToRead
> {
  readonly handles: RequestType<PublicManagerNotesOfTournament> =
    PublicManagerNotesOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
  ) {
    super();
  }

  async handle(
    query: PublicManagerNotesOfTournament,
  ): Promise<TournamentManagerNotesToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicManagerNotesOfTournament",
    );
    return {
      name: tournament.name.toString(),
      notes: tournament.notes?.markdown,
      address: tournament.address.toString(),
      playedByTeams: tournament.format.isTeamFormat,
      competitions: competitionsInUse(tournament),
      // From the read model of its notes, which holds none of what they say,
      // since a list is not where a note is read.
      managerNotes: (await this.notes.of(tournament.id)).map((note) => ({
        ...note,
        address: noteAddressIn(tournament, note.id),
      })),
    };
  }
}
