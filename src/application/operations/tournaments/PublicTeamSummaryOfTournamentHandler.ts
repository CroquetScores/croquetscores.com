import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicTeamSummaryOfTournament,
  type TeamSummaryToRead,
} from "./PublicTeamSummaryOfTournament.js";
import { standingsOf } from "./teamStandings.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";
import {
  formatOfPage,
  managerNotesChangedFor,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import type { TournamentPages } from "./tournamentPages.js";

/**
 * A tournament's team summary, read of the read models alone: the tournament
 * and its tests (`TournamentPages`), counted when it is asked for from the
 * games they keep, since a summary is counted from every test in use at once.
 */
export class PublicTeamSummaryOfTournamentHandler extends QueryHandler<
  PublicTeamSummaryOfTournament,
  TeamSummaryToRead
> {
  readonly handles: RequestType<PublicTeamSummaryOfTournament> =
    PublicTeamSummaryOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicTeamSummaryOfTournament,
  ): Promise<TeamSummaryToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicTeamSummaryOfTournament",
    );
    if (!formatOfPage(tournament).isTeamFormat) {
      throw new TournamentOperationRefused(
        "PublicTeamSummaryOfTournament.NotPlayedByTeams",
        "The tournament is not played by teams.",
      );
    }

    const { teams, bestOfMoreThanOne, ranked, showsNets } = standingsOf(
      tournament,
      await this.pages.teamsToStand(tournament.id),
      () => true,
    );
    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      commentariesChanged: await this.changes.of(
        TournamentId.from(tournament.id),
      ),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address: tournament.address,
      playedByTeams: true,
      competitions: tournament.competitions,
      teams,
      bestOfMoreThanOne,
      ranked,
      showsNets,
    };
  }
}
