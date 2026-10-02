import type { AggregateRepository } from "../application/common/AggregateRepository.js";
import { toldOf } from "../application/operations/competitions/competitionOperations.js";
import type { AccountId } from "../domain/aggregates/accounts/AccountId.js";
import {
  Competition,
  type Told,
} from "../domain/aggregates/tournaments/competitions/Competition.js";
import { CompetitionPlayer } from "../domain/aggregates/tournaments/competitions/CompetitionPlayer.js";
import type { GamePlayerId } from "../domain/aggregates/tournaments/competitions/Game.js";
import { GameId } from "../domain/aggregates/tournaments/competitions/primitives/GameId.js";
import type { CompetitionPlayerId } from "../domain/aggregates/tournaments/competitions/primitives/CompetitionPlayerId.js";
import { Score } from "../domain/aggregates/tournaments/competitions/value-objects/Score.js";
import { CompetitionId } from "../domain/aggregates/tournaments/primitives/CompetitionId.js";
import type { TournamentId } from "../domain/aggregates/tournaments/primitives/TournamentId.js";
import { TournamentPlayerId } from "../domain/aggregates/tournaments/primitives/TournamentPlayerId.js";
import type { Tournament } from "../domain/aggregates/tournaments/Tournament.js";
import { CompetitionName } from "../domain/aggregates/tournaments/value-objects/CompetitionName.js";
import type { ReadOnlyDate } from "../domain/common/ReadOnlyDate.js";
import { Website } from "../domain/common/Website.js";
import type { UnitOfWork } from "../infrastructure/database/UnitOfWork.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import { describedFailure } from "./ImportRefused.js";
import { tournamentBecome } from "./ImportTournamentPlayers.js";
import { momentOf } from "./newtonsoft.js";
import type {
  Competition as OldCompetition,
  CompetitionPlayer as OldCompetitionPlayer,
  Game as OldGame,
} from "./ravendb-models/Competition.js";
import type { ReadDocument } from "./runImporter.js";

/** A place in a competition, as the old sites listed it: a player, or a bye. */
export type Listed =
  | { readonly bye: false; readonly player: OldCompetitionPlayer }
  | { readonly bye: true };

/**
 * What a kind of competition brings over besides what every competition
 * does: how it is added to its tournament, and the places it is entered in,
 * in order. Nothing where it is left behind without an error.
 */
export type Shaped =
  | {
      readonly entries: readonly Listed[];
      readonly add: (
        tournament: Tournament,
        id: CompetitionId,
        name: CompetitionName,
        by: AccountId,
        at: ReadOnlyDate,
      ) => void;
    }
  | undefined;

/** Whether a kind of competition keeps what its players carried forward. */
export interface CompetitionKind<TDocument extends OldCompetition> {
  readonly carriesForward: boolean;
  shape(document: TDocument, listed: readonly Listed[]): Shaped;
}

/** What importing a competition reads from and writes to. */
export interface ImportingCompetitions {
  readonly unitOfWork: UnitOfWork;
  readonly tournaments: AggregateRepository<Tournament, TournamentId>;
  readonly competitions: AggregateRepository<Competition, CompetitionId>;
  readonly database: ImportDatabase;
}

// Each count a player carried, as the site names it.
const carriedOf = (player: OldCompetitionPlayer) => ({
  matchWins: player.CarryForward.MatchWins,
  matchLosses: player.CarryForward.MatchLosses,
  gameWins: player.CarryForward.GameWins,
  gameLosses: player.CarryForward.GameLosses,
  hoopsFor: player.CarryForward.ForHoops,
  hoopsAgainst: player.CarryForward.AgainstHoops,
});

/** The old games of a competition, in the order the old sites numbered them. */
export const gamesInOrder = (games: readonly OldGame[]): OldGame[] =>
  [...games].sort((one, other) => one.Id - other.Id);

/**
 * Adds each of `games` to `competition`, in the order the old sites numbered
 * them, each at the moment the old sites kept it at. A game whose player is
 * not in the competition, or that the site refuses, is kept as an error
 * against `documentId` naming it, and the rest are added all the same.
 */
export const addGames = async (
  database: ImportDatabase,
  documentId: string,
  competition: Competition,
  games: readonly OldGame[],
  playerOf: (number: number) => GamePlayerId | undefined,
  told: Told,
  website: Website,
  by: AccountId,
): Promise<void> => {
  for (const game of gamesInOrder(games)) {
    try {
      const winner = playerOf(game.Winner.PlayerId);
      const loser = playerOf(game.Loser.PlayerId);
      if (winner === undefined || loser === undefined) {
        throw new Error(
          `A player of the game is not in the competition: ${String(game.Winner.PlayerId)} or ${String(game.Loser.PlayerId)}.`,
        );
      }
      competition.addGame(
        GameId.create(),
        {
          winner,
          winnerScore: Score.read(game.Winner.Score._Score, website),
          loser,
          loserScore: Score.read(game.Loser.Score._Score, website),
        },
        told,
        by,
        momentOf(game.CreatedAt),
      );
    } catch (failure) {
      await database.recordError(
        documentId,
        `game ${String(game.Id)}: ${describedFailure(failure)}`,
      );
    }
  }
};

/**
 * Brings one of the old sites' blocks, knockouts or Swisses over as `kind`
 * says (importCompetition.feature): added to the tournament it became, its
 * players entered in the order the old sites listed them, what each carried
 * forward kept where the kind keeps it, its games added, and those who
 * withdrew withdrawn once their games are. A player or a game the site
 * refuses is kept as an error naming it, and the rest are brought over.
 *
 * An archived competition is left behind, as is one of a tournament left
 * behind. The tournament, the competition and the record of it are kept in
 * one transaction.
 */
export const importCompetition = async <TDocument extends OldCompetition>(
  importing: ImportingCompetitions,
  { website, id, document }: ReadDocument<TDocument>,
  kind: CompetitionKind<TDocument>,
): Promise<void> => {
  const { unitOfWork, tournaments, competitions, database } = importing;
  const documentId = `${website}/${id}`;
  if (document.IsArchived) return;

  await unitOfWork.inTransaction(async () => {
    const tournamentDocument = document.Tournament.Id;
    const tournament = await tournamentBecome(
      database,
      tournaments,
      website,
      tournamentDocument,
      "importCompetition.NoTournament",
    );
    if (tournament === undefined) return;
    const name = CompetitionName.from(document.Name);

    const bye = TournamentPlayerId.bye().value;
    const listed: Listed[] = [];
    for (const player of document.Players._Players) {
      const became = await database.findPlayerOf(
        website,
        tournamentDocument,
        player._Id,
      );
      listed.push(became === bye ? { bye: true } : { bye: false, player });
    }
    const shaped = kind.shape(document, listed);
    if (shaped === undefined) return;

    // Done as the tournament's first manager, who created it, when it was
    // created.
    const [by] = tournament.managers;
    if (by === undefined) throw new Error("The tournament has no manager.");
    const at = tournament.starts;
    const competitionId = CompetitionId.create();
    shaped.add(tournament, competitionId, name, by, at);
    await tournaments.save(tournament);
    await database.recordImportedCompetition(
      website,
      id,
      tournament.id.value,
      competitionId.value,
    );

    const competition = Competition.rebuiltFrom(competitionId, []);
    const told = toldOf(tournament, competitionId);
    const entered = new Map<number, CompetitionPlayerId>();
    const withdrew: CompetitionPlayerId[] = [];

    // Each entered last, so that the competition's order is the order the old
    // sites listed them in, which a knockout is drawn in.
    for (const entry of shaped.entries) {
      if (entry.bye) {
        competition.enterBye(told, by, at);
        continue;
      }
      const { player } = entry;
      try {
        const became = await database.findPlayerOf(
          website,
          tournamentDocument,
          player._Id,
        );
        if (became === undefined) {
          throw new Error("The player was not brought over to the tournament.");
        }
        const playerId = competition.enterPlayer(
          TournamentPlayerId.from(became),
          CompetitionPlayer.orderAfter(competition.players),
          told,
          by,
          at,
        );
        entered.set(player._Id, playerId);
        if (player.IsWithdrawn) withdrew.push(playerId);
        // A player whose counts were all 0 carried nothing: the old sites
        // kept 0 where nobody typed anything.
        const carried = carriedOf(player);
        if (
          kind.carriesForward &&
          Object.values(carried).some((count) => count !== 0)
        ) {
          competition.changeCarryForward(playerId, carried, told, by, at);
        }
      } catch (failure) {
        await database.recordError(
          documentId,
          `player ${String(player._Id)}: ${describedFailure(failure)}`,
        );
      }
    }

    await addGames(
      database,
      documentId,
      competition,
      document.Games._Games,
      (number) => entered.get(number),
      told,
      Website.from(website),
      by,
    );

    for (const playerId of withdrew) {
      try {
        competition.withdrawPlayer(playerId, told, by, at);
      } catch (failure) {
        await database.recordError(
          documentId,
          `withdrawing ${playerId.value}: ${describedFailure(failure)}`,
        );
      }
    }

    await competitions.save(competition);
  });
};
