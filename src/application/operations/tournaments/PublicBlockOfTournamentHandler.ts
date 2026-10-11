import type { CarryForwardCount } from "../../../domain/aggregates/tournaments/competitions/value-objects/CarryForward.js";
import type { Game } from "../../../domain/aggregates/tournaments/competitions/Game.js";
import { matchesBetween } from "../../../domain/aggregates/tournaments/competitions/matchesBetween.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type Competitions,
  competitionOf,
  countsForNothingIn,
} from "../competitions/competitionOperations.js";
import {
  type BlockToRead,
  type PlayerOfBlock,
  PublicBlockOfTournament,
} from "./PublicBlockOfTournament.js";
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

export class PublicBlockOfTournamentHandler extends QueryHandler<
  PublicBlockOfTournament,
  BlockToRead
> {
  readonly handles: RequestType<PublicBlockOfTournament> =
    PublicBlockOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicBlockOfTournament): Promise<BlockToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicBlockOfTournament",
    );
    const found = tournament.competitions.find(
      ({ reference }) =>
        !reference.archived && reference.slug.toString() === query.slug,
    );
    if (found === undefined) {
      throw new TournamentOperationRefused(
        "PublicBlockOfTournament.NoSuchCompetition",
        "The tournament has no such competition.",
      );
    }
    const { reference, shape } = found;
    if (shape.kind !== "block") {
      throw new TournamentOperationRefused(
        "PublicBlockOfTournament.NotABlock",
        "The competition is not a block.",
      );
    }
    const competition = await competitionOf(this.competitions, reference.id);
    const games = competition.games.filter((game) => !game.archived);
    // What counts for nothing is still shown, and answered as withdrawn, so
    // that the pages strike it through.
    const countsForNothing = countsForNothingIn(
      competition,
      tournament,
      reference.id,
    );
    const counting = games.filter((game) => !countsForNothing(game));
    const bestOf = shape.bestOf.games;
    const matches = decidedMatchesOf(counting, bestOf);
    const address = tournament.address.toString();
    const players = competition.players.flatMap((entered): PlayerOfBlock[] => {
      const player = tournament.players.find((each) =>
        each.id.equals(entered.tournamentPlayerId),
      );
      if (player === undefined) return [];
      const theirs = counting.filter(
        (game) =>
          game.winner.equals(entered.id) || game.loser.equals(entered.id),
      );
      const won = theirs.filter(
        (game) => !game.drawn && game.winner.equals(entered.id),
      );
      const lost = theirs.filter(
        (game) => !game.drawn && game.loser.equals(entered.id),
      );
      // What is not carried forward counts as nothing carried, and so does
      // all of it where the player has withdrawn, as their games do.
      const carried = (count: CarryForwardCount): number =>
        entered.withdrawn ? 0 : (entered.carryForward.of(count) ?? 0);
      const hoops = theirs.reduce((net, game) => {
        const margin = game.winnerScore.points - game.loserScore.points;
        return net + (game.winner.equals(entered.id) ? margin : -margin);
      }, 0);
      return [
        {
          id: entered.id.value,
          name: player.name.toString(),
          representing: player.representing,
          flag: player.flag === undefined ? undefined : String(player.flag),
          address: `${address}/players/${player.slug.toString()}`,
          withdrawn: entered.withdrawn,
          matchesWon:
            matches.filter((match) => match.winner === entered.id.value)
              .length + carried("matchWins"),
          matchesLost:
            matches.filter((match) => match.loser === entered.id.value).length +
            carried("matchLosses"),
          gamesWon: won.length + carried("gameWins"),
          netGames:
            won.length -
            lost.length +
            carried("gameWins") -
            carried("gameLosses"),
          netHoops: hoops + carried("hoopsFor") - carried("hoopsAgainst"),
        },
      ];
    });
    return {
      name: tournament.name.toString(),
      subtitle: tournament.subtitle?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address,
      competitions: competitionsInUse(tournament),
      block: {
        name: reference.name.toString(),
        bestOf,
        rounds: shape.rounds.count,
      },
      players,
      games: games.map((game) => ({
        winner: game.winner.value,
        winnerScore: game.winnerScore.toString(),
        loser: game.loser.value,
        loserScore: game.loserScore.toString(),
        drawn: game.drawn,
        withdrawn: countsForNothing(game),
        addedAt: game.addedAt,
      })),
      ranked: rankingOf(players).map(({ id }) => id),
    };
  }
}

// The matches among `games` that somebody won, each with its winner and its
// loser. Each pair's games, in the order they were added, are cut into
// matches (matchesBetween.ts), as the competition cuts them, so that two
// players of a block played in rounds, or the best of 1, play a match in each.
// A match is won by whoever wins more than half the games it is the best of:
// so a match not yet decided, or shared in a best of an even number, is won by
// neither.
const decidedMatchesOf = (
  games: readonly Game[],
  bestOf: number,
): { readonly winner: string; readonly loser: string }[] => {
  const byPair = new Map<string, Game[]>();
  for (const game of games) {
    const pair = [game.winner.value, game.loser.value].sort().join(" ");
    byPair.set(pair, [...(byPair.get(pair) ?? []), game]);
  }
  return [...byPair.values()].flatMap((theirs) =>
    matchesBetween(theirs, bestOf).flatMap((match) => {
      const [first] = match.games;
      if (first === undefined) return [];
      const wins = (id: string): number =>
        match.games.filter((each) => !each.drawn && each.winner.value === id)
          .length;
      const [one, other] = [first.winner.value, first.loser.value];
      if (wins(one) * 2 > bestOf) return [{ winner: one, loser: other }];
      if (wins(other) * 2 > bestOf) return [{ winner: other, loser: one }];
      return [];
    }),
  );
};

// The share of the matches a player has decided that they have won, and
// nothing where they have decided none.
const shareOf = ({ matchesWon, matchesLost }: PlayerOfBlock): number =>
  matchesWon + matchesLost === 0 ? 0 : matchesWon / (matchesWon + matchesLost);

// `players` ranked as the old site's summary ranked them: the greater share of
// matches won first, then the more net hoops, and otherwise as they were,
// since a sort that keeps the order of equals leaves them in the block's. A
// withdrawn player comes after everybody who has not withdrawn, since their
// games count for nothing, which would otherwise rank them, with no share
// and no hoops, above a player still in the block who has played and lost.
const rankingOf = (players: readonly PlayerOfBlock[]): PlayerOfBlock[] =>
  [...players].sort(
    (one, other) =>
      Number(one.withdrawn) - Number(other.withdrawn) ||
      shareOf(other) - shareOf(one) ||
      other.netHoops - one.netHoops,
  );
