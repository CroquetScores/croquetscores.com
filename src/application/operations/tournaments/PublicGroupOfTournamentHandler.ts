import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type GroupToRead,
  PublicGroupOfTournament,
} from "./PublicGroupOfTournament.js";
import { standingsOf } from "./teamStandings.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  formatOfPage,
  managerNotesChangedFor,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import type { TournamentPages } from "./tournamentPages.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

/** A group's page, read of the read models alone, as the team summary is. */
export class PublicGroupOfTournamentHandler extends QueryHandler<
  PublicGroupOfTournament,
  GroupToRead
> {
  readonly handles: RequestType<PublicGroupOfTournament> =
    PublicGroupOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicGroupOfTournament): Promise<GroupToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicGroupOfTournament",
    );
    if (!formatOfPage(tournament).isTeamFormat) {
      throw new TournamentOperationRefused(
        "PublicGroupOfTournament.NotPlayedByTeams",
        "The tournament is not played by teams.",
      );
    }

    // Tests whose groups make the same slug are one group, since they would
    // be found at the same address, named as the first of them says it.
    const competitions = tournament.competitions;
    const tests = competitions.filter(
      (competition) => competition.group?.slug === query.group,
    );
    const group = tests[0]?.group;
    if (group === undefined) {
      throw new TournamentOperationRefused(
        "PublicGroupOfTournament.NoSuchGroup",
        "The tournament has no such group.",
      );
    }

    const kept = await this.pages.teamsToStand(tournament.id);
    const inGroup = (slug: string | undefined): boolean => slug === query.group;
    // The teams that play in one of the group's tests in use, and no others.
    const teamsInGroup = new Set(
      kept.tests.flatMap((test) =>
        inGroup(test.group) ? [test.firstTeam, test.secondTeam] : [],
      ),
    );
    const standings = standingsOf(tournament, kept, (test) =>
      inGroup(test.group),
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
      competitions,
      teams: standings.teams.filter(({ id }) => teamsInGroup.has(id)),
      bestOfMoreThanOne: standings.bestOfMoreThanOne,
      ranked: standings.ranked.filter((id) => teamsInGroup.has(id)),
      // As the group's teams were ranked, so that the order is never one no
      // column explains.
      showsNets: standings.showsNets,
      group: { name: group.name, slug: group.slug },
      tests,
    };
  }
}
