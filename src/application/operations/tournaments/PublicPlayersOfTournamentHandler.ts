import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  PublicPlayersOfTournament,
  type TournamentPlayersToRead,
} from "./PublicPlayersOfTournament.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import type { TournamentAddresses } from "./tournamentOperations.js";
import {
  formatOfPage,
  managerNotesChangedFor,
  playerPageOf,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import type { TournamentPages } from "./tournamentPages.js";

// In the order a reader looks for a name in a list, capitals or none.
const byName = new Intl.Collator("en");

/**
 * A tournament's players' page, read of the read models alone
 * (`TournamentPages`), so that it asks the events nothing.
 */
export class PublicPlayersOfTournamentHandler extends QueryHandler<
  PublicPlayersOfTournament,
  TournamentPlayersToRead
> {
  readonly handles: RequestType<PublicPlayersOfTournament> =
    PublicPlayersOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(
    query: PublicPlayersOfTournament,
  ): Promise<TournamentPlayersToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicPlayersOfTournament",
    );
    const { address } = tournament;
    const people = await this.pages.peopleOf(tournament.id);
    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      commentariesChanged: await this.changes.of(
        TournamentId.from(tournament.id),
      ),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address,
      competitions: tournament.competitions,
      playedByTeams: formatOfPage(tournament).isTeamFormat,
      // A tournament played by teams has no players of its own, only its
      // teams', who are answered team by team.
      teams: people.teams
        .filter((team) => !team.archived)
        .map((team) => ({
          name: team.name,
          players: team.players
            .filter((player) => !player.archived)
            .map((player) => ({
              playerId: player.playerId,
              name: player.name,
              worldRankingName: player.worldRankingName,
              address: playerPageOf(address, player.slug),
            }))
            .sort((one, other) => byName.compare(one.name, other.name)),
        })),
      players: people.players
        .filter((player) => !player.archived)
        .map((player) => ({
          playerId: player.playerId,
          name: player.name,
          worldRankingName: player.worldRankingName,
          representing: player.representing,
          handicap: player.handicap,
          flag: player.flag,
          address: playerPageOf(address, player.slug),
        }))
        .sort((one, other) => byName.compare(one.name, other.name)),
    };
  }
}
