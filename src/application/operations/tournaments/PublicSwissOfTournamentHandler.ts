import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { CompetitionGames } from "./competitionGames.js";
import type { CompetitionStandings } from "./competitionStandings.js";
import { NOBODY_IN_GAME, type PlayerInGame } from "./GamesOfTournament.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type PlayerOfSwiss,
  PublicSwissOfTournament,
  type ResultOfSwiss,
  type SwissToRead,
} from "./PublicSwissOfTournament.js";
import { pointsOf } from "./standingsToKeep.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import type { TournamentAddresses } from "./tournamentOperations.js";
import {
  competitionOfPage,
  managerNotesChangedFor,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import type { TournamentPages } from "./tournamentPages.js";

// What follows the points of a score as the scorer wrote it, as "tp" in
// "26tp". Taken from the writing rather than asked of the score so that the
// rankings text file, which reads it the same way, and this agree.
const peelingOf = (written: string): string =>
  written.replace(/^\s*\d+/u, "").trim();

/**
 * A Swiss's page, read of the read models alone, as a block's is
 * (`PublicBlockOfTournamentHandler`): its ranking is kept when the Swiss
 * changes and not worked out here.
 */
export class PublicSwissOfTournamentHandler extends QueryHandler<
  PublicSwissOfTournament,
  SwissToRead
> {
  readonly handles: RequestType<PublicSwissOfTournament> =
    PublicSwissOfTournament;

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

  async handle(query: PublicSwissOfTournament): Promise<SwissToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicSwissOfTournament",
    );
    const swiss = await competitionOfPage(
      this.pages,
      tournament,
      query.slug,
      "swiss",
      {
        noSuchCompetition: "PublicSwissOfTournament.NoSuchCompetition",
        notOfKind: "PublicSwissOfTournament.NotASwiss",
        sentence: "The competition is not a Swiss.",
      },
    );
    const address = tournament.address;
    const kept = await this.standings.standingsKept(swiss.id);
    const standingOf = new Map(
      kept.standings.map((each) => [each.entryId, each]),
    );
    const gamesKept = await this.games.gamesKept(swiss.id);
    const inUse = gamesKept.games.filter((game) => !game.archived);
    const withdrawn = new Set(
      gamesKept.entries.filter((each) => each.withdrawn).map((each) => each.id),
    );
    const usual = Sport.from(tournament.sport).usualMaximumHoops;

    // Each player of the Swiss as its pages name them, by the id its games
    // name them by.
    const entered = await this.pages.playersOf(swiss.id);
    const named = new Map<string, PlayerInGame & { address: string }>(
      entered.map((player) => [
        player.entryId,
        {
          playerId: player.playerId,
          name: player.name,
          representing: player.representing,
          handicap: player.handicap,
          flag: player.flag,
          address: `${address}/players/${player.slug}`,
        },
      ]),
    );
    const nameless = { ...NOBODY_IN_GAME, address };
    // What counts for nothing is still among the results and the games, and
    // said to be withdrawn, so that the pages strike it through.
    const countsForNothing = (game: (typeof inUse)[number]): boolean =>
      game.withdrawn || withdrawn.has(game.winner) || withdrawn.has(game.loser);

    const players = entered.map((each): PlayerOfSwiss => {
      const standing = standingOf.get(each.entryId);
      if (standing === undefined) {
        throw new Error(
          `A player of the Swiss has no standing kept: ${each.entryId}`,
        );
      }
      const results = inUse.flatMap((game): ResultOfSwiss[] => {
        const won = game.winner === each.entryId;
        if (!won && game.loser !== each.entryId) return [];
        const theirs = pointsOf(won ? game.winnerScore : game.loserScore);
        const against = pointsOf(won ? game.loserScore : game.winnerScore);
        const opponent = named.get(won ? game.loser : game.winner) ?? nameless;
        return [
          {
            opponent: { name: opponent.name, address: opponent.address },
            result: game.drawn ? "drawn" : won ? "won" : "lost",
            margin: theirs - against,
            peeling: peelingOf(game.winnerScore) + peelingOf(game.loserScore),
            withdrawn: countsForNothing(game),
          },
        ];
      });
      return {
        ...named.get(each.entryId)!,
        id: each.entryId,
        withdrawn: each.withdrawn,
        // Kept when the competition changes, and not worked out again here,
        // so that the site and the API cannot say two different things.
        gamesPlayed: standing.played,
        gamesWon: standing.won,
        netHoops: standing.netHoops,
        results,
      };
    });

    return {
      name: tournament.name,
      subtitle: tournament.subtitle,
      commentariesChanged: await this.changes.of(
        TournamentId.from(tournament.id),
      ),
      managerNotes: await managerNotesChangedFor(this.notes, tournament),
      address,
      competitions: tournament.competitions,
      swiss: {
        name: swiss.name,
        maximumHoops:
          swiss.maximumHoops === undefined ? usual : swiss.maximumHoops,
        advantage: swiss.advantage,
      },
      usualMaximumHoops: usual,
      players,
      ranked: kept.standings
        .map((each) => each.entryId)
        .filter((id) => named.has(id)),
      games: inUse.map((game) => ({
        id: game.id,
        winner: named.get(game.winner) ?? nameless,
        winnerScore: game.winnerScore,
        loser: named.get(game.loser) ?? nameless,
        loserScore: game.loserScore,
        drawn: game.drawn,
        withdrawn: countsForNothing(game),
        // The read model keeps when a game last changed, which for one never
        // corrected is when it was added.
        addedAt: game.changedAt,
      })),
    };
  }
}
