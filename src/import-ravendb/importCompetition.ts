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
import { competitionNameToImport, numberedApart } from "./names.js";
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
      /**
       * What of the competition was corrected in shaping it, said once it is
       * added: a code, and what happened to it, which begins with what it
       * was.
       */
      readonly corrected?: readonly {
        code: string;
        says: string;
        /** What of the document, as "games 14 and 15", or "" for all of it. */
        what?: string;
      }[];
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
  /** Where what the import corrected is said, the same way. */
  readonly correcting: AcceptedImportErrors;
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

/** What is said of a game against a bye, left out as corrected. */
export const AGAINST_A_BYE = {
  code: "ImportCompetition.AgainstABye",
  because: "it was against the old site's bye, and was no game that was played",
} as const;

/**
 * `document` with each game won by whoever scored more, whoever the old site
 * said won it (importCompetition.feature): the winner and the loser put the
 * other way round, with the scores each scored, where the loser scored more,
 * or where they scored as many and only the loser's score is marked as a
 * winner's. A game on equal points with neither marked, or both, is as it
 * was, and so is one whose scores cannot be read. The games put right are
 * answered too, as they are now, to be said as corrected.
 */
export const withWinnersFromScores = <TDocument extends OldCompetition>(
  document: TDocument,
  website: Website,
): {
  readonly document: TDocument;
  readonly swapped: readonly OldGame[];
  readonly marked: readonly OldGame[];
  readonly unmarked: readonly OldGame[];
  readonly rounded: readonly OldGame[];
} => {
  const swapped: OldGame[] = [];
  const marked: OldGame[] = [];
  const unmarked: OldGame[] = [];
  const rounded: OldGame[] = [];
  const games = document.Games._Games.map((kept) => {
    // A half point rounded up first, so that what follows is worked out from
    // the scores the site will have.
    const game = withHalfPointsRounded(kept);
    if (game !== kept) rounded.push(kept);
    try {
      const winner = Score.read(game.Winner.Score._Score, website);
      const loser = Score.read(game.Loser.Score._Score, website);
      const equal = !loser.isMoreThan(winner) && !winner.isMoreThan(loser);
      if (
        loser.isMoreThan(winner) ||
        (equal && loser.marked && !winner.marked)
      ) {
        const put: OldGame = {
          ...game,
          Winner: game.Loser,
          Loser: game.Winner,
        };
        swapped.push(put);
        return put;
      }
      // Equal points and both marked: the old site's winner won it, and the
      // loser's mark, which the site refuses, is taken off.
      if (equal && winner.marked && loser.marked) {
        const put: OldGame = {
          ...game,
          Loser: {
            ...game.Loser,
            Score: { ...game.Loser.Score, _Score: String(loser.points) },
          },
        };
        unmarked.push(put);
        return put;
      }
      // Equal points and neither marked: the old site's winner won it, as
      // the site says a game on equal points was, with a "w" on their score.
      // Only where the score is no more than its digits, which a mark follows.
      const typed = game.Winner.Score._Score.trim();
      if (equal && !winner.marked && !loser.marked && /^\d+$/.test(typed)) {
        const put: OldGame = {
          ...game,
          Winner: {
            ...game.Winner,
            Score: { ...game.Winner.Score, _Score: `${typed}w` },
          },
        };
        marked.push(put);
        return put;
      }
    } catch {
      // A score that cannot be read is left as it was.
    }
    return game;
  });
  return {
    document: { ...document, Games: { ...document.Games, _Games: games } },
    swapped,
    marked,
    unmarked,
    rounded,
  };
};

// `typed` with a fraction that is more than nothing rounded up to the next
// whole number, and what follows kept, as "3.5w" to "4w"; nothing where it
// has none.
const roundedUp = (typed: string): string | undefined => {
  const [, whole, fraction, rest] =
    /^(\d+)\.(\d+)(.*)$/s.exec(typed.trim()) ?? [];
  if (whole === undefined || fraction === undefined || rest === undefined) {
    return undefined;
  }
  return /[1-9]/.test(fraction)
    ? `${String(Number(whole) + 1)}${rest}`
    : undefined;
};

// `game` with either score's half point rounded up, or `game` itself where
// neither has one.
const withHalfPointsRounded = (game: OldGame): OldGame => {
  const winner = roundedUp(game.Winner.Score._Score);
  const loser = roundedUp(game.Loser.Score._Score);
  if (winner === undefined && loser === undefined) return game;
  return {
    ...game,
    Winner: {
      ...game.Winner,
      Score: {
        ...game.Winner.Score,
        _Score: winner ?? game.Winner.Score._Score,
      },
    },
    Loser: {
      ...game.Loser,
      Score: {
        ...game.Loser.Score,
        _Score: loser ?? game.Loser.Score._Score,
      },
    },
  };
};

/**
 * Says what was corrected of a document's scores: each rounded, taken the
 * right way round, or marked (importCompetition.feature).
 */
export const saidOfScoresCorrected = async (
  errors: DocumentErrors,
  nameOf: (number: number) => string,
  corrected: ReturnType<typeof withWinnersFromScores>,
): Promise<void> => {
  for (const game of corrected.rounded) {
    await errors.gameCorrected(
      game,
      nameOf,
      "ImportCompetition.HalfPointRoundedUp",
      "was kept with a score written with a half point, which the site has no place for, and is brought over with it rounded up to the next whole number.",
    );
  }
  for (const game of corrected.swapped) {
    await errors.gameCorrected(
      game,
      nameOf,
      "ImportCompetition.WinnerFromScore",
      "was kept the other way round, and is brought over as won by the player who scored more.",
    );
  }
  for (const game of corrected.marked) {
    await errors.gameCorrected(
      game,
      nameOf,
      "ImportCompetition.EqualScoreMarked",
      "was kept on equal points with neither score marked, and its winner's score is marked, so that the player the old site said won it did.",
    );
  }
  for (const game of corrected.unmarked) {
    await errors.gameCorrected(
      game,
      nameOf,
      "ImportCompetition.LoserMarkRemoved",
      "was kept on equal points with both scores marked, and is brought over with the loser's mark taken off, so that the player the old site said won it did.",
    );
  }
};

/**
 * `document` with the list of players and the list of games the old site
 * left out kept as lists of none: it kept some, as TeamMatches/28862, with
 * neither list there at all (ImportTeamMatches.feature). Read once, where a
 * competition is read, so that nothing past it meets a list that is not
 * there.
 */
export const withItsLists = <TDocument extends OldCompetition>(
  document: TDocument,
): TDocument => {
  const kept = document as {
    readonly Players?: { readonly _Players?: unknown };
    readonly Games?: { readonly _Games?: unknown };
  };
  return {
    ...document,
    Players: { ...kept.Players, _Players: kept.Players?._Players ?? [] },
    Games: { ...kept.Games, _Games: kept.Games?._Games ?? [] },
  };
};

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
  // Asked again for each game, where what the competition is told can change
  // as its games are added, as a test's teams do when a player is made.
  told: Told | (() => Told),
  website: Website,
  by: AccountId,
  ordered: (games: readonly OldGame[]) => readonly OldGame[] = gamesInOrder,
  afterGame: (game: OldGame) => Promise<void> = () => Promise.resolve(),
  putRight: PutRight = () => Promise.resolve(false),
): Promise<void> => {
  const inOrder = ordered(games);
  // The games added so far, as they were added.
  const added: OldGame[] = [];
  for (const [index, game] of inOrder.entries()) {
    const add = (adding: OldGame): void => {
      const winner = playerOf(adding.Winner.PlayerId);
      const loser = playerOf(adding.Loser.PlayerId);
      if (winner === undefined || loser === undefined) {
        throw new ImportRefused(
          "ImportCompetition.PlayerNotInCompetition",
          `A player of the game is not in the competition: ${String(adding.Winner.PlayerId)} or ${String(adding.Loser.PlayerId)}.`,
        );
      }
      const winnerScore = Score.read(adding.Winner.Score._Score, website);
      competition.addGame(
        GameId.create(),
        {
          winner,
          winnerScore,
          loser,
          loserScore: Score.read(
            walkoverWritten(adding.Loser.Score._Score, winnerScore),
            website,
          ),
        },
        typeof told === "function" ? told() : told,
        by,
        momentOf(adding.CreatedAt),
      );
    };
    try {
      // Added again for as long as what refused it is put right, which a
      // walkover the old site kept no game for is, or added as the game it
      // was put right as, once, which is said as corrected only once it is
      // added. Where that is refused too, the game is refused as it was.
      let refused: unknown;
      let instead: Instead | undefined;
      let duplicate = false;
      for (;;) {
        try {
          add(instead?.game ?? game);
          break;
        } catch (failure) {
          refused ??= failure;
          if (instead !== undefined) throw refused;
          // A game entered twice, which would come after its match was
          // decided, is left out the second time.
          if (
            (failure as { code?: unknown }).code ===
              "Competition.MatchDecided" &&
            added.some((each) => sameGame(each, game))
          ) {
            duplicate = true;
            break;
          }
          const put = await putRight(game, failure, inOrder.slice(index));
          if (put === false) throw refused;
          if (put !== true) instead = put;
        }
      }
      if (duplicate) {
        await errors.gameCorrected(
          game,
          nameOf,
          "ImportCompetition.DuplicateGame",
          "was entered twice, with the same players and the very same scores, and is left out the second time, since its match was already decided.",
        );
      } else {
        added.push(instead?.game ?? game);
        await instead?.corrected();
        const loserScore = game.Loser.Score._Score;
        const written = walkoverWritten(
          loserScore,
          Score.read(game.Winner.Score._Score, website),
        );
        if (written !== loserScore) {
          await errors.gameCorrected(
            game,
            nameOf,
            "ImportCompetition.WalkoverWritten",
            `had the walkover written as the loser's "${loserScore}", which marks a winner's score, and it is written "${written}".`,
          );
        }
      }
    } catch (failure) {
      await errors.gameRefused(game, nameOf, failure);
    }
    await afterGame(game);
  }
};

// Whether two games are the same game entered twice: the same two players,
// the same winner, and the very same scores as they were typed.
const sameGame = (one: OldGame, other: OldGame): boolean =>
  one.Winner.PlayerId === other.Winner.PlayerId &&
  one.Loser.PlayerId === other.Loser.PlayerId &&
  one.Winner.Score._Score.trim() === other.Winner.Score._Score.trim() &&
  one.Loser.Score._Score.trim() === other.Loser.Score._Score.trim();

/**
 * Whether what refused `game` has been put right, so that it can be added
 * again, or the game it was put right as, to be added in its place: given
 * what refused it, and the games still to be added from it on, itself first.
 */
export type PutRight = (
  game: OldGame,
  failure: unknown,
  toCome: readonly OldGame[],
) => Promise<boolean | Instead>;

/** A game added in place of one refused, and how it is said as corrected. */
export interface Instead {
  readonly game: OldGame;
  corrected(): Promise<void>;
}

/**
 * The loser's score `typed`, but where it is 0 marked as a winner's, as "0W",
 * against a `winnerScore` not marked, a walkover written so, with its "W"
 * written "w/o", which is no mark (importCompetition.feature).
 */
const walkoverWritten = (typed: string, winnerScore: Score): string =>
  !winnerScore.marked && /^0\s*w$/i.test(typed.trim())
    ? `${typed.trim().slice(0, -1)}w/o`
    : typed;

/**
 * Brings one of the old sites' blocks, knockouts or Swisses over as `kind` says
 * (importCompetition.feature): added to the tournament it became, its players
 * entered in the order the old sites listed them, what each carried forward
 * kept where the kind keeps it, its games added, and those who withdrew
 * withdrawn once their last game is, or before any where they played none. A
 * player the tournament's players no longer listed is brought over from the
 * competition's list, and a game against a bye is left out, each said as
 * accepted. A player or a game the site refuses is kept as an error naming it,
 * and the rest are brought over.
 *
 * An archived competition is left behind. The tournament, the competition
 * and the record of it are kept in one transaction.
 */
export const importCompetition = async <TDocument extends OldCompetition>(
  importing: ImportingCompetitions,
  { website, id, document: read }: ReadDocument<TDocument>,
  kind: CompetitionKind<TDocument>,
): Promise<void> => {
  const scored = withWinnersFromScores(
    withItsLists(read),
    Website.from(website),
  );
  const { document } = scored;
  const {
    unitOfWork,
    tournaments,
    competitions,
    database,
    accepting,
    correcting,
  } = importing;
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
        CompetitionName.from(competitionNameToImport(document.Name)).toString(),
        tournament.competitions.map(({ reference }) =>
          reference.name.toString(),
        ),
      ),
    );
    const errors = new DocumentErrors(
      database,
      accepting,
      correcting,
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
    await saidOfScoresCorrected(errors, nameOfIn(document), scored);
    for (const { code, says, what } of shaped.corrected ?? []) {
      await errors.corrected(what ?? "", code, `${errors.place} ${says}`);
    }
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
      await errors.corrected(
        `player ${String(number)}`,
        "ImportCompetition.PlayerNotInTournament",
        `Player ${nameOfIn(document)(number)} in ${errors.place} was brought over from the competition's own list, because the tournament's players no longer listed them.`,
      );
    }

    const competition = Competition.rebuiltFrom(competitionId, []);
    const told = toldOf(tournament, competitionId);
    const entered = new Map<number, CompetitionPlayerId>();
    // Each player who withdrew, by the number the old sites gave them.
    const withdrew = new Map<number, CompetitionPlayerId>();

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
        if (player.IsWithdrawn) withdrew.set(player._Id, playerId);
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
      await errors.gameLeftOut(
        game,
        nameOfIn(document),
        AGAINST_A_BYE.code,
        AGAINST_A_BYE.because,
      );
    }
    // A withdrawn player can have no game added (CompetitionPlayer.Withdrawn),
    // so a player who withdrew is withdrawn straight after their last game is
    // added, and before any is where they played none, so that whoever was to
    // play them next goes on before the games they went on to play are
    // added. What their games then count for is the site's rule
    // (Competition.countsForNothing), not the import's. Whoever has a game
    // still to come once every game is, as a play-off the kind leaves out, is
    // withdrawn last.
    const withdraw = async (number: number): Promise<void> => {
      const playerId = withdrew.get(number);
      if (playerId === undefined) return;
      withdrew.delete(number);
      try {
        competition.withdrawPlayer(playerId, told, by, at);
      } catch (failure) {
        await errors.refused(`withdrawing ${playerId.value}`, failure);
      }
    };
    const gamesLeft = new Map<number, number>();
    for (const number of withdrew.keys()) {
      gamesLeft.set(
        number,
        played.Games._Games.filter(
          (game) =>
            game.Winner.PlayerId === number || game.Loser.PlayerId === number,
        ).length,
      );
    }
    for (const [number, left] of gamesLeft) {
      if (left === 0) await withdraw(number);
    }
    // A game refused because a player's match before it is not decided, where
    // whoever they were drawn against played them no game and plays none from
    // then on: that player gave a walkover, which the old site kept no game
    // for, and is withdrawn, which gives the match to their opponent
    // (ImportKnockouts.feature).
    const numberOf = (id: CompetitionPlayerId): number | undefined =>
      [...entered].find(([, entrant]) => entrant.equals(id))?.[0];
    const plays = (game: OldGame, number: number): boolean =>
      game.Winner.PlayerId === number || game.Loser.PlayerId === number;
    const walkover: PutRight = async (game, failure, toCome) => {
      if (
        (failure as { code?: unknown }).code !== "Competition.NotDrawnToMeet"
      ) {
        return false;
      }
      let given = false;
      for (const number of [game.Winner.PlayerId, game.Loser.PlayerId]) {
        const id = entered.get(number);
        if (id === undefined) continue;
        const against = competition.drawnAgainst(id, told);
        const theirs = against === undefined ? undefined : numberOf(against);
        if (against === undefined || theirs === undefined) continue;
        const between = competition.games.some(
          (each) =>
            (each.winner.equals(id) && each.loser.equals(against)) ||
            (each.winner.equals(against) && each.loser.equals(id)),
        );
        if (between || toCome.some((each) => plays(each, theirs))) continue;
        try {
          competition.withdrawPlayer(against, told, by, at);
        } catch {
          continue;
        }
        withdrew.delete(theirs);
        given = true;
        await errors.gameCorrected(
          game,
          nameOfIn(document),
          "ImportKnockouts.Walkover",
          `came after a walkover the old site kept no game for: ${nameOfIn(document)(theirs)} played ${nameOfIn(document)(number)} no game, and is withdrawn, so that ${nameOfIn(document)(number)} goes on.`,
        );
      }
      return given;
    };
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
      async (game) => {
        for (const number of [game.Winner.PlayerId, game.Loser.PlayerId]) {
          const left = gamesLeft.get(number);
          if (left === undefined) continue;
          gamesLeft.set(number, left - 1);
          if (left - 1 === 0) await withdraw(number);
        }
      },
      walkover,
    );
    for (const number of [...withdrew.keys()]) await withdraw(number);

    await competitions.save(competition);
  });
};
