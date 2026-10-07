import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { Competitions } from "../competitions/competitionOperations.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type GroupToRead,
  PublicGroupOfTournament,
} from "./PublicGroupOfTournament.js";
import { standingsOf } from "./teamStandings.js";
import {
  competitionsInUse,
  managerNotesChangedOf,
  type TournamentCommentaries,
  tournamentForReaders,
} from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class PublicGroupOfTournamentHandler extends QueryHandler<
  PublicGroupOfTournament,
  GroupToRead
> {
  readonly handles: RequestType<PublicGroupOfTournament> =
    PublicGroupOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicGroupOfTournament): Promise<GroupToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicGroupOfTournament",
    );
    if (!tournament.format.isTeamFormat) {
      throw new TournamentOperationRefused(
        "PublicGroupOfTournament.NotPlayedByTeams",
        "The tournament is not played by teams.",
      );
    }

    // Tests whose groups make the same slug are one group, since they would
    // be found at the same address, named as the first of them says it.
    const competitions = competitionsInUse(tournament);
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

    const inGroup = (slug: string | undefined): boolean => slug === query.group;
    // The teams that play in one of the group's tests in use, and no others.
    const teamsInGroup = new Set(
      tournament.competitions.flatMap(({ reference, shape }) =>
        !reference.archived &&
        shape.kind === "test" &&
        inGroup(shape.group?.slug?.toString())
          ? [shape.firstTeam.value, shape.secondTeam.value]
          : [],
      ),
    );
    const standings = await standingsOf(tournament, this.competitions, (test) =>
      inGroup(test.group?.slug?.toString()),
    );
    return {
      name: tournament.name.toString(),
      subtitle: tournament.subtitle?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address: tournament.address.toString(),
      playedByTeams: true,
      competitions,
      teams: standings.teams.filter(({ id }) => teamsInGroup.has(id)),
      bestOfMoreThanOne: standings.bestOfMoreThanOne,
      ranked: standings.ranked.filter((id) => teamsInGroup.has(id)),
      group: { name: group.name, slug: group.slug },
      tests,
    };
  }
}
