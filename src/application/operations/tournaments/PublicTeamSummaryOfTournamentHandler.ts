import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import type { Competitions } from "../competitions/competitionOperations.js";
import {
  PublicTeamSummaryOfTournament,
  type TeamSummaryToRead,
} from "./PublicTeamSummaryOfTournament.js";
import { standingsOf } from "./teamStandings.js";
import {
  competitionsInUse,
  tournamentForReaders,
  managerNotesChangedOf,
  type TournamentCommentaries,
} from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class PublicTeamSummaryOfTournamentHandler extends QueryHandler<
  PublicTeamSummaryOfTournament,
  TeamSummaryToRead
> {
  readonly handles: RequestType<PublicTeamSummaryOfTournament> =
    PublicTeamSummaryOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicTeamSummaryOfTournament,
  ): Promise<TeamSummaryToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicTeamSummaryOfTournament",
    );
    if (!tournament.format.isTeamFormat) {
      throw new TournamentOperationRefused(
        "PublicTeamSummaryOfTournament.NotPlayedByTeams",
        "The tournament is not played by teams.",
      );
    }

    const { teams, bestOfMoreThanOne, ranked, showsNets } = await standingsOf(
      tournament,
      this.competitions,
      () => true,
    );
    return {
      name: tournament.name.toString(),
      subtitle: tournament.subtitle?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address: tournament.address.toString(),
      playedByTeams: true,
      competitions: competitionsInUse(tournament),
      teams,
      bestOfMoreThanOne,
      ranked,
      showsNets,
    };
  }
}
