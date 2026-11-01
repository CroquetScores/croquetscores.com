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
} from "../competitions/competitionOperations.js";
import {
  type BlockToRead,
  PublicBlockOfTournament,
} from "./PublicBlockOfTournament.js";
import {
  competitionOfKindForReaders,
  competitionsInUse,
  tournamentForReaders,
  managerNotesChangedOf,
  type TournamentCommentaries,
} from "./tournamentForReaders.js";
import { standingsOfBlock } from "./standingsOfBlock.js";
import { type TournamentAddresses } from "./tournamentOperations.js";

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
    const { reference, shape, rules } = competitionOfKindForReaders(
      tournament,
      query.slug,
      "block",
      {
        noSuchCompetition: "PublicBlockOfTournament.NoSuchCompetition",
        notOfKind: "PublicBlockOfTournament.NotABlock",
        sentence: "The competition is not a block.",
      },
    );
    const competition = await competitionOf(this.competitions, reference.id);
    const {
      games,
      countsForNothing,
      players: unplaced,
      placed,
    } = standingsOfBlock(tournament, competition, reference.id, shape);
    const address = tournament.address.toString();
    const players = unplaced.map((player) => ({
      ...player,
      placing: placed.placings.get(player.id),
    }));
    return {
      name: tournament.name.toString(),
      subtitle: tournament.subtitle?.markdown,
      commentariesChanged: await this.changes.of(tournament.id),
      managerNotes: await managerNotesChangedOf(this.notes, tournament),
      address,
      competitions: competitionsInUse(tournament),
      block: {
        name: reference.name.toString(),
        bestOf: shape.bestOf.games,
        rounds: shape.rounds.count,
        maximumHoops: rules.maximumHoops,
        tieBreak: shape.tieBreak.code,
        levelOnMatchesWon: placed.levelOnMatchesWon,
        tellsApartBy: placed.tellsApartBy,
      },
      usualMaximumHoops: tournament.sport.usualMaximumHoops,
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
      ranked: placed.ranked,
    };
  }
}
