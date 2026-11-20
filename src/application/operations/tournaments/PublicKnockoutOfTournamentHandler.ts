import type { Side } from "../../../domain/aggregates/tournaments/competitions/KnockoutPlay.js";
import { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import { Sport } from "../../../domain/aggregates/tournaments/value-objects/Sport.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import type { CompetitionGames } from "./competitionGames.js";
import { NOBODY_IN_GAME } from "./GamesOfTournament.js";
import { matchesOfKept, playersOfKept } from "./knockoutPlayOfKept.js";
import type { TournamentManagerNotes } from "./managerNoteOperations.js";
import {
  type KnockoutToRead,
  type MatchOfKnockout,
  type PlayerOfKnockout,
  PublicKnockoutOfTournament,
  type RoundOfKnockout,
  type SideOfKnockout,
  type WhichSide,
} from "./PublicKnockoutOfTournament.js";
import type { TournamentCommentaries } from "./tournamentForReaders.js";
import {
  competitionOfPage,
  managerNotesChangedFor,
  tournamentOfPage,
} from "./tournamentOfPage.js";
import type { TournamentPages } from "./tournamentPages.js";
import type { TournamentAddresses } from "./tournamentOperations.js";

/**
 * A knockout's page, read of the read models alone, as a block's and a Swiss's
 * are: its draw, its players and byes and the games that count are kept, and
 * its matches are played out of them by the same working out the competition
 * itself uses (`knockoutPlayOfKept.ts`).
 */
export class PublicKnockoutOfTournamentHandler extends QueryHandler<
  PublicKnockoutOfTournament,
  KnockoutToRead
> {
  readonly handles: RequestType<PublicKnockoutOfTournament> =
    PublicKnockoutOfTournament;

  constructor(
    private readonly addresses: TournamentAddresses,
    private readonly pages: TournamentPages,
    private readonly games: CompetitionGames,
    private readonly notes: TournamentManagerNotes,
    private readonly changes: TournamentCommentaries,
  ) {
    super();
  }

  async handle(query: PublicKnockoutOfTournament): Promise<KnockoutToRead> {
    const tournament = await tournamentOfPage(
      this.addresses,
      this.pages,
      query.website,
      query.address,
      "PublicKnockoutOfTournament",
    );
    const knockout = await competitionOfPage(
      this.pages,
      tournament,
      query.slug,
      "knockout",
      {
        noSuchCompetition: "PublicKnockoutOfTournament.NoSuchCompetition",
        notOfKind: "PublicKnockoutOfTournament.NotAKnockout",
        sentence: "The competition is not a knockout.",
      },
    );
    const address = tournament.address;
    const kept = await this.games.gamesKept(knockout.id);
    const usual = Sport.from(tournament.sport).usualMaximumHoops;

    // Each player of the knockout as its pages show them, by the id its games
    // name them by. A bye is nobody to show, and is not among the entries.
    const shown = new Map<string, PlayerOfKnockout>();
    for (const entered of await this.pages.playersOf(knockout.id)) {
      shown.set(entered.entryId, {
        playerId: entered.playerId,
        name: entered.name,
        representing: entered.representing,
        handicap: entered.handicap,
        flag: entered.flag,
        address: `${address}/players/${entered.slug}`,
        withdrawn: entered.withdrawn,
      });
    }
    const nameless = NOBODY_IN_GAME;

    const matches = matchesOfKept(kept);
    const keptById = new Map(kept.games.map((game) => [game.id, game]));
    // The round each game was played in, by the match of the draw it is in.
    const roundOf = new Map<string, number>();
    for (const match of matches) {
      for (const game of match.games)
        roundOf.set(game.id.value, match.round + 1);
    }
    const players = playersOfKept(kept);
    // Worked out a round at a time, since where the draw's play has nobody in
    // a later round, the round before says why.
    const rounds: RoundOfKnockout[] = [];
    (kept.draw?.rounds ?? []).forEach((bestOf, round) => {
      const before = rounds[round - 1];
      rounds.push({
        bestOf,
        matches: matches
          .filter((match) => match.round === round)
          .map((match, at): MatchOfKnockout => {
            // Where the draw's play has nobody, a place of the first round is
            // a bye where a bye was entered in it and empty where nothing was.
            // A later place is empty where the match that fed it had an empty
            // place, since the draw is not yet full; otherwise it is a bye, fed
            // by two byes or by a bye and a player who withdrew before taking
            // it, neither of which sends anybody through.
            const nobodyAt = (place: number): SideOfKnockout => {
              if (before === undefined) {
                return players[place]?.isBye === true
                  ? { is: "bye" }
                  : { is: "empty" };
              }
              const fed = before.matches[place];
              return fed?.sides.some((side) => side.is === "empty") === true
                ? { is: "empty" }
                : { is: "bye" };
            };
            const sideOf = (side: Side, place: number): SideOfKnockout =>
              side.is === "nobody" ? nobodyAt(place) : sideShown(side, shown);
            const sides = [
              sideOf(match.sides[0], at * 2),
              sideOf(match.sides[1], at * 2 + 1),
            ] as const;
            // Which side `side` is, where it is a player of this match.
            const whichIs = (side: Side): WhichSide | undefined => {
              if (side.is !== "player") return undefined;
              const [first] = match.sides;
              return first.is === "player" &&
                first.player.id.equals(side.player.id)
                ? 0
                : 1;
            };
            return {
              sides,
              games: match.games.map((game) => {
                const winner: WhichSide =
                  match.sides[0].is === "player" &&
                  game.winner.equals(match.sides[0].player.id)
                    ? 0
                    : 1;
                // The scores as typed come from what is kept: the play is
                // worked out with placeholders, as only who won matters to it.
                const typed = keptById.get(game.id.value);
                const won = typed?.winnerScore ?? "";
                const lost = typed?.loserScore ?? "";
                return {
                  winner,
                  scores: winner === 0 ? [won, lost] : [lost, won],
                };
              }),
              winner: whichIs(match.winner),
            };
          }),
      });
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
      knockout: {
        name: knockout.name,
        maximumHoops:
          knockout.maximumHoops === undefined ? usual : knockout.maximumHoops,
        advantage: knockout.advantage,
      },
      usualMaximumHoops: usual,
      rounds,
      // None is answered as withdrawn: a knockout's game cannot be, and a
      // withdrawn player's games there count, since each decided a match
      // that stands. The time is when the game last changed, which for one
      // never corrected is when it was added.
      games: kept.games
        .filter((game) => !game.archived)
        .map((game) => ({
          id: game.id,
          winner: shown.get(game.winner) ?? nameless,
          winnerScore: game.winnerScore,
          loser: shown.get(game.loser) ?? nameless,
          loserScore: game.loserScore,
          drawn: game.drawn,
          addedAt: game.changedAt,
          round: roundOf.get(game.id),
        })),
    };
  }
}

// A side the draw's play has somebody or not yet anybody for, as the
// knockout's pages show it.
const sideShown = (
  side: Exclude<Side, { is: "nobody" }>,
  shown: ReadonlyMap<string, PlayerOfKnockout>,
): SideOfKnockout => {
  if (side.is === "not yet known") return { is: "not yet known" };
  const player = shown.get(side.player.id.value);
  return player === undefined ? { is: "empty" } : { is: "player", player };
};
