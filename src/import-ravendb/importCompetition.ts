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
import {
  type AcceptedImportErrors,
  DocumentErrors,
} from "./AcceptedImportErrors.js";
import type { ImportDatabase } from "./ImportDatabase.js";
import {
  addOldPlayer,
  isOldBye,
  tournamentBecome,
} from "./ImportTournamentPlayers.js";
import { ImportRefused } from "./ImportRefused.js";
import { numberedApart } from "./names.js";
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
 * does: how it is added to its tournament, the places it is entered in, in
 * order, and where its games are not added in the order the old sites
 * numbered them, the order they are. Nothing where it is left behind without
 * an error.
 */
export type Shaped =
  | {
      readonly entries: readonly Listed[];
      readonly gamesInOrder?: (games: readonly OldGame[]) => readonly OldGame[];
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
  shape(
    document: TDocument,
    listed: readonly Listed[],
    tournament: Tournament,
  ): Shaped;
}

/** What importing a competition reads from and writes to. */
export interface ImportingCompetitions {
  readonly unitOfWork: UnitOfWork;
  readonly tournaments: AggregateRepository<Tournament, TournamentId>;
  readonly competitions: AggregateRepository<Competition, CompetitionId>;
  readonly database: ImportDatabase;
  readonly accepting: AcceptedImportErrors;
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

/** What is said of a game against a bye, left out as accepted. */
export const AGAINST_A_BYE = {
  code: "ImportCompetition.AgainstABye",
  why: "A game against the old site's bye, which was no game played, left out.",
} as const;

/**
 * What the player numbered `number` of `document` was called, or their number
 * where it lists nobody numbered so.
 */
export const nameOfIn =
  (document: OldCompetition) =>
  (number: number): string =>
    document.Players._Players.find((player) => player._Id === number)?.Name ??
    `player ${String(number)}`;

/** The old games of a competition, in the order the old sites numbered them. */
export const gamesInOrder = (games: readonly OldGame[]): OldGame[] =>
  [...games].sort((one, other) => one.Id - other.Id);

/**
 * Adds each of `games` to `competition`, in the order `ordered` puts them, or
 * the old sites numbered them where nothing says otherwise, each at the moment
 * the old sites kept it at. A game whose player is
 * not in the competition, or that the site refuses, is kept as an error
 * against the document naming it, unless it is accepted, and the rest are
 * added all the same.
 */
export const addGames = async (
  errors: DocumentErrors,
  competition: Competition,
  games: readonly OldGame[],
  playerOf: (number: number) => GamePlayerId | undefined,
  nameOf: (number: number) => string,
  told: Told,
  website: Website,
  by: AccountId,
  ordered: (games: readonly OldGame[]) => readonly OldGame[] = gamesInOrder,
): Promise<void> => {
  for (const game of ordered(games)) {
    try {
      const winner = playerOf(game.Winner.PlayerId);
      const loser = playerOf(game.Loser.PlayerId);
      if (winner === undefined || loser === undefined) {
        throw new ImportRefused(
          "ImportCompetition.PlayerNotInCompetition",
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
      await errors.gameRefused(game, nameOf, failure);
    }
  }
};

/**
 * Brings one of the old sites' blocks, knockouts or Swisses over as `kind`
 * says (importCompetition.feature): added to the tournament it became, its
 * players entered in the order the old sites listed them, what each carried
 * forward kept where the kind keeps it, its games added, and those who
 * withdrew withdrawn once their games are. A player the tournament's players
 * no longer listed is brought over from the competition's list, and a game
 * against a bye is left out, each said as accepted. A player or a game the
 * site refuses is kept as an error naming it, and the rest are brought over.
 *
 * An archived competition is left behind. The tournament, the competition
 * and the record of it are kept in one transaction.
 */
export const importCompetition = async <TDocument extends OldCompetition>(
  importing: ImportingCompetitions,
  { website, id, document }: ReadDocument<TDocument>,
  kind: CompetitionKind<TDocument>,
): Promise<void> => {
  const { unitOfWork, tournaments, competitions, database, accepting } =
    importing;
  const documentId = `${website}/${id}`;
  if (document.IsArchived) return;

  await unitOfWork.inTransaction(async () => {
    const tournamentDocument = document.Tournament.Id;
    const tournament = await tournamentBecome(
      database,
      tournaments,
      website,
      tournamentDocument,
    );
    // The site tells a tournament's competitions apart by their names, in any
    // case, and the old sites did not, so a name another of them has is
    // numbered apart from theirs, archived ones among them, as the tournament
    // compares it.
    const name = CompetitionName.from(
      numberedApart(
        CompetitionName.from(document.Name).toString(),
        tournament.competitions.map(({ reference }) =>
          reference.name.toString(),
        ),
      ),
    );
    const errors = new DocumentErrors(
      database,
      accepting,
      documentId,
      website,
      tournament,
      { name: name.toString(), oldSlug: document.Slug },
    );

    // Done as the tournament's first manager, who created it, when it was
    // created.
    const [by] = tournament.managers;
    if (by === undefined) throw new Error("The tournament has no manager.");
    const at = tournament.starts;

    const bye = TournamentPlayerId.bye().value;
    const listed: Listed[] = [];
    const byes = new Set<number>();
    // Each player the tournament's players no longer listed, brought over from
    // the competition's own list, and kept by their number once the
    // tournament is, so that every competition listing them finds the one
    // player. One the site refuses is kept as an error once, here.
    const broughtOver = new Map<number, string>();
    const refused = new Set<number>();
    for (const player of document.Players._Players) {
      let became =
        broughtOver.get(player._Id) ??
        (await database.findPlayerOf(website, tournamentDocument, player._Id));
      if (
        became === undefined &&
        !refused.has(player._Id) &&
        !tournament.format.isTeamFormat
      ) {
        try {
          became = isOldBye(player.Name)
            ? bye
            : addOldPlayer(tournament, player, by, at).value;
          broughtOver.set(player._Id, became);
        } catch (failure) {
          refused.add(player._Id);
          await errors.playerRefused(player._Id, player.Name, failure);
        }
      }
      if (became === bye) byes.add(player._Id);
      listed.push(became === bye ? { bye: true } : { bye: false, player });
    }
    // A game against a bye is no game that was played, and is left out before
    // anything is worked out from the games.
    const againstABye = (game: OldGame): boolean =>
      byes.has(game.Winner.PlayerId) || byes.has(game.Loser.PlayerId);
    const played = {
      ...document,
      Games: {
        ...document.Games,
        _Games: document.Games._Games.filter((game) => !againstABye(game)),
      },
    };
    const shaped = kind.shape(played, listed, tournament);
    if (shaped === undefined) return;

    const competitionId = CompetitionId.create();
    shaped.add(tournament, competitionId, name, by, at);
    errors.added(competitionId);
    await tournaments.save(tournament);
    await database.recordImportedCompetition(
      website,
      id,
      tournament.id.value,
      competitionId.value,
    );
    for (const [number, playerId] of broughtOver) {
      await database.recordImportedPlayer(
        website,
        tournamentDocument,
        number,
        playerId,
      );
      await errors.accepted(
        `player ${String(number)}`,
        "ImportCompetition.PlayerNotInTournament",
        "A player the tournament's players no longer listed, brought over from the competition's own list.",
      );
    }

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
      if (refused.has(player._Id)) continue;
      try {
        const became = await database.findPlayerOf(
          website,
          tournamentDocument,
          player._Id,
        );
        if (became === undefined) {
          throw new ImportRefused(
            "ImportCompetition.PlayerNotBroughtOver",
            "The player was not brought over to the tournament.",
          );
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
        await errors.playerRefused(player._Id, player.Name, failure);
      }
    }

    for (const game of gamesInOrder(document.Games._Games)) {
      if (!againstABye(game)) continue;
      await errors.accepted(
        `game ${String(game.Id)}`,
        AGAINST_A_BYE.code,
        AGAINST_A_BYE.why,
      );
    }
    await addGames(
      errors,
      competition,
      played.Games._Games,
      (number) => entered.get(number),
      nameOfIn(document),
      told,
      Website.from(website),
      by,
      shaped.gamesInOrder,
    );

    for (const playerId of withdrew) {
      try {
        competition.withdrawPlayer(playerId, told, by, at);
      } catch (failure) {
        await errors.refused(`withdrawing ${playerId.value}`, failure);
      }
    }

    await competitions.save(competition);
  });
};
