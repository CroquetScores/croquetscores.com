import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicPlayersOfTournament,
  type TournamentPlayersToRead,
} from "./PublicPlayersOfTournament.js";
import {
  competitionsInUse,
  tournamentForReaders,
  managerNotesChangedOf,
  type TournamentCommentaries,
} from "./tournamentForReaders.js";
import type { TournamentAddresses } from "./tournamentOperations.js";

// In the order a reader looks for a name in a list, capitals or none.
const byName = new Intl.Collator("en");

export class PublicPlayersOfTournamentHandler extends QueryHandler<
  PublicPlayersOfTournament,
  TournamentPlayersToRead
> {
  readonly handles: RequestType<PublicPlayersOfTournament> =
    PublicPlayersOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicPlayersOfTournament,
  ): Promise<TournamentPlayersToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicPlayersOfTournament",
    );
    const address = tournament.address.toString();
    return {
      name: tournament.name.toString(),
      notes: tournament.notes?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address,
      competitions: competitionsInUse(tournament),
      playedByTeams: tournament.format.isTeamFormat,
      // A tournament played by teams has no players of its own, only its
      // teams', who are answered team by team.
      teams: tournament.teams
        .filter((team) => !team.archived)
        .map((team) => ({
          name: team.name.toString(),
          players: team.players
            .filter((player) => !player.archived)
            .map((player) => ({
              name: player.name.toString(),
              address: `${address}/players/${player.slug.toString()}`,
            }))
            .sort((one, other) => byName.compare(one.name, other.name)),
        })),
      players: tournament.players
        .filter((player) => !player.archived)
        .map((player) => ({
          name: player.name.toString(),
          representing: player.representing,
          flag: player.flag === undefined ? undefined : String(player.flag),
          address: `${address}/players/${player.slug.toString()}`,
        }))
        .sort((one, other) => byName.compare(one.name, other.name)),
    };
  }
}
