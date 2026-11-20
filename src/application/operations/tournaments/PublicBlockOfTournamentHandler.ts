import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { TieBreak } from "../../../domain/aggregates/tournaments/value-objects/TieBreak.js";
import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { CompetitionGames } from "./competitionGames.js";
import type { CompetitionStandings } from "./competitionStandings.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import { tellsApartByOf } from "./placingsOfBlock.js";
import {
  type BlockToRead,
  type PlayerOfBlock,
  PublicBlockOfTournament,
} from "./PublicBlockOfTournament.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import type { TournamentAddresses } from "./tournamentOperations.js";
import {
  competitionOfPage,
  managerNotesChangedFor,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import type { TournamentPages } from "./tournamentPages.js";

/**
 * A block's page, read of the read models alone: the tournament and the
 * block's rules (`TournamentPages`), its games and players (`CompetitionGames`)
 * and its standings (`CompetitionStandings`), which are kept when the block
 * changes and not worked out here, so that the site and the API cannot say two
 * different things.
 */
export class PublicBlockOfTournamentHandler extends QueryHandler<
  PublicBlockOfTournament,
  BlockToRead
> {
  readonly handles: RequestType<PublicBlockOfTournament> =
    PublicBlockOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly games: CompetitionGames,
    private readonly standings: CompetitionStandings,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicBlockOfTournament): Promise<BlockToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicBlockOfTournament",
    );
    const block = await competitionOfPage(
      this.pages,
      tournament,
      query.slug,
      "block",
      {
        noSuchCompetition: "PublicBlockOfTournament.NoSuchCompetition",
        notOfKind: "PublicBlockOfTournament.NotABlock",
        sentence: "The competition is not a block.",
      },
    );
    const kept = await this.standings.standingsKept(block.id);
    const standingOf = new Map(
      kept.standings.map((each) => [each.entryId, each]),
    );
    const gamesKept = await this.games.gamesKept(block.id);
    const withdrawn = new Set(
      gamesKept.entries.filter((each) => each.withdrawn).map((each) => each.id),
    );
    const usual = Sport.from(tournament.sport).usualMaximumHoops;
    const bestOf = block.bestOf ?? 1;
    // A block whose rules are not kept yet is played as an ordinary one.
    const tieBreak =
      block.tieBreak === undefined
        ? TieBreak.unlessTold
        : TieBreak.from(block.tieBreak);

    const players = (await this.pages.playersOf(block.id)).map(
      (player): PlayerOfBlock => {
        // A player with no standing kept is one the standings have not been
        // worked out for yet, which is as having played nothing.
        const standing = standingOf.get(player.entryId);
        return {
          id: player.entryId,
          playerId: player.playerId,
          name: player.name,
          representing: player.representing,
          handicap: player.handicap,
          flag: player.flag,
          address: `${tournament.address}/players/${player.slug}`,
          withdrawn: player.withdrawn,
          matchesWon: standing?.won ?? 0,
          matchesLost: standing?.lost ?? 0,
          gamesWon: standing?.gamesWon ?? 0,
          netGames: standing?.netGames ?? 0,
          netHoops: standing?.netHoops ?? 0,
          placing:
            standing?.place === undefined
              ? undefined
              : { place: standing.place, shared: standing.shared },
        };
      },
    );
    const shown = new Set(players.map((each) => each.id));
    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      commentariesChanged: await this.changes.of(
        TournamentId.from(tournament.id),
      ),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address: tournament.address,
      competitions: tournament.competitions,
      block: {
        name: block.name,
        bestOf,
        rounds: block.rounds ?? 1,
        maximumHoops:
          block.maximumHoops === undefined ? usual : block.maximumHoops,
        advantage: block.advantage,
        tieBreak: tieBreak.code,
        levelOnMatchesWon: kept.levelOnMatchesWon,
        tellsApartBy: tellsApartByOf(tieBreak, bestOf),
      },
      usualMaximumHoops: usual,
      players,
      // What counts for nothing is still shown, and answered as withdrawn, so
      // that the pages strike it through. Archived games are not shown.
      games: gamesKept.games
        .filter((game) => !game.archived)
        .map((game) => ({
          id: game.id,
          winner: game.winner,
          winnerScore: game.winnerScore,
          loser: game.loser,
          loserScore: game.loserScore,
          drawn: game.drawn,
          withdrawn:
            game.withdrawn ||
            withdrawn.has(game.winner) ||
            withdrawn.has(game.loser),
          // The read model keeps when a game last changed, which for one never
          // corrected is when it was added.
          addedAt: game.changedAt,
        })),
      ranked: kept.standings
        .map((each) => each.entryId)
        .filter((id) => shown.has(id)),
    };
  }
}
