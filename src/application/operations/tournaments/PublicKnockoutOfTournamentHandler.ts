import type { Side } from "../../../domain/aggregates/tournaments/competitions/KnockoutPlay.js";
import type { TournamentId } from "../../../domain/aggregates/tournaments/primitives/TournamentId.js";
import type { Tournament } from "../../../domain/aggregates/tournaments/Tournament.js";
import { Website } from "../../../domain/common/Website.js";
import type { AggregateRepository } from "../../common/AggregateRepository.js";
import type { RequestType } from "../../common/Mediator.js";
import { QueryHandler } from "../../common/QueryHandler.js";
import {
  type Competitions,
  competitionOf,
  toldOf,
} from "../competitions/competitionOperations.js";
import {
  type KnockoutToRead,
  type MatchOfKnockout,
  type PlayerOfKnockout,
  PublicKnockoutOfTournament,
  type RoundOfKnockout,
  type SideOfKnockout,
  type WhichSide,
} from "./PublicKnockoutOfTournament.js";
import {
  competitionsInUse,
  tournamentForReaders,
} from "./tournamentForReaders.js";
import {
  type TournamentAddresses,
  TournamentOperationRefused,
} from "./tournamentOperations.js";

export class PublicKnockoutOfTournamentHandler extends QueryHandler<
  PublicKnockoutOfTournament,
  KnockoutToRead
> {
  readonly handles: RequestType<PublicKnockoutOfTournament> =
    PublicKnockoutOfTournament;

  constructor(
    private readonly tournaments: AggregateRepository<Tournament, TournamentId>,
    private readonly competitions: Competitions,
    private readonly addresses: TournamentAddresses,
  ) {
    super();
  }

  async handle(query: PublicKnockoutOfTournament): Promise<KnockoutToRead> {
    const tournament = await tournamentForReaders(
      this.tournaments,
      this.addresses,
      Website.from(query.website),
      query.address,
      "PublicKnockoutOfTournament",
    );
    const found = tournament.competitions.find(
      ({ reference }) =>
        !reference.archived && reference.slug.toString() === query.slug,
    );
    if (found === undefined) {
      throw new TournamentOperationRefused(
        "PublicKnockoutOfTournament.NoSuchCompetition",
        "The tournament has no such competition.",
      );
    }
    const { reference, shape } = found;
    if (shape.kind !== "knockout") {
      throw new TournamentOperationRefused(
        "PublicKnockoutOfTournament.NotAKnockout",
        "The competition is not a knockout.",
      );
    }
    const competition = await competitionOf(this.competitions, reference.id);
    const address = tournament.address.toString();

    // Each player of the knockout as its pages show them, by the id its games
    // name them by. A bye is nobody to show.
    const shown = new Map<string, PlayerOfKnockout>();
    for (const entered of competition.players) {
      if (entered.isBye) continue;
      const player = tournament.players.find((each) =>
        each.id.equals(entered.tournamentPlayerId),
      );
      if (player === undefined) continue;
      shown.set(entered.id.value, {
        name: player.name.toString(),
        representing: player.representing,
        flag: player.flag === undefined ? undefined : String(player.flag),
        address: `${address}/players/${player.slug.toString()}`,
        withdrawn: entered.withdrawn,
      });
    }
    const nameless = { name: "" };

    const matches = competition.knockoutMatches(
      toldOf(tournament, reference.id),
    );
    const players = competition.players;
    // Worked out a round at a time, since where the draw's play has nobody in
    // a later round, the round before says why.
    const rounds: RoundOfKnockout[] = [];
    shape.draw.rounds.forEach((bestOf, round) => {
      const before = rounds[round - 1];
      rounds.push({
        bestOf: bestOf.games,
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
                const won = game.winnerScore.toString();
                const lost = game.loserScore.toString();
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
      name: tournament.name.toString(),
      address,
      competitions: competitionsInUse(tournament),
      knockout: { name: reference.name.toString() },
      rounds,
      games: competition.games
        .filter((game) => !game.archived)
        .map((game) => ({
          winner: shown.get(game.winner.value) ?? nameless,
          winnerScore: game.winnerScore.toString(),
          loser: shown.get(game.loser.value) ?? nameless,
          loserScore: game.loserScore.toString(),
          drawn: game.drawn,
          addedAt: game.addedAt,
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
