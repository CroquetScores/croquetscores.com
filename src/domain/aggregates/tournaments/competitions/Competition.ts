import type { AccountId } from "../../accounts/AccountId.js";
import { AggregateRoot } from "../../../common/AggregateRoot.js";
import type { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import { Refused } from "../../../common/Refused.js";
import { ValidationError } from "../../../common/validation/ValidationError.js";
import type { CompetitionId } from "../primitives/CompetitionId.js";
import type { TeamId } from "../primitives/TeamId.js";
import type { TeamPlayerId } from "../primitives/TeamPlayerId.js";
import { TournamentPlayerId } from "../primitives/TournamentPlayerId.js";
import type { TeamPlayerErrorCode } from "../TeamPlayer.js";
import type { CompetitionShape } from "../Tournament.js";
import {
  CompetitionPlayer,
  type CompetitionPlayerErrorCode,
} from "./CompetitionPlayer.js";
import { CompetitionByeMoved } from "./events/CompetitionByeMoved.js";
import { CompetitionByeRemoved } from "./events/CompetitionByeRemoved.js";
import { CompetitionGameAdded } from "./events/CompetitionGameAdded.js";
import { CompetitionGameArchived } from "./events/CompetitionGameArchived.js";
import { CompetitionGameCorrected } from "./events/CompetitionGameCorrected.js";
import { CompetitionGameMoved } from "./events/CompetitionGameMoved.js";
import { CompetitionGameRestored } from "./events/CompetitionGameRestored.js";
import {
  Game,
  type GameDetails,
  type GameErrorCode,
  type GamePlayerId,
  gamePlayerIdFrom,
} from "./Game.js";
import {
  drawnAgainst,
  isPlayer,
  knockoutPlay,
  type Match,
} from "./KnockoutPlay.js";
import { GameId } from "./primitives/GameId.js";
import {
  CarryForward,
  type CarryForwardCounts,
} from "./value-objects/CarryForward.js";
import { Score } from "./value-objects/Score.js";
import { CompetitionPlayerCarryForwardChanged } from "./events/CompetitionPlayerCarryForwardChanged.js";
import { CompetitionPlayerEntered } from "./events/CompetitionPlayerEntered.js";
import { CompetitionPlayerMoved } from "./events/CompetitionPlayerMoved.js";
import { CompetitionPlayerRemoved } from "./events/CompetitionPlayerRemoved.js";
import { CompetitionPlayersSpacedOut } from "./events/CompetitionPlayersSpacedOut.js";
import { CompetitionPlayerWithdrawalReversed } from "./events/CompetitionPlayerWithdrawalReversed.js";
import { CompetitionPlayerWithdrawn } from "./events/CompetitionPlayerWithdrawn.js";
import { CompetitionPlayerId } from "./primitives/CompetitionPlayerId.js";

/** Every reason a competition refuses what it is asked. */
export type CompetitionErrorCode =
  | "Competition.PlayerAlreadyEntered"
  | "Competition.NoSuchPlayer"
  | "Competition.NoSuchGame"
  | "Competition.GameAlreadyAdded"
  | "Competition.MatchDecided"
  | "Competition.NotDrawnToMeet"
  | "Competition.WinnerHasPlayedOn"
  | "Competition.DrawFixed"
  | "Competition.DrawFull"
  | "Competition.DrawNotFilled"
  | "Competition.ByeOutsideKnockout"
  | "Competition.SameTeam"
  | "Competition.NotATest"
  | "Competition.ExpectedMatchesReached"
  | "Competition.NoStandings";

/** A player of one of a test's teams, as the tournament says they are. */
export interface TeamPlayerInTest {
  readonly id: TeamPlayerId;
  readonly team: TeamId;
  readonly archived: boolean;
}

/**
 * What a competition is told of itself by whatever asks, since the tournament
 * keeps it: what kind of competition it is, with a knockout's draw, and
 * whether the tournament allows drawn games. A test has no players entered in
 * it, so it is told who plays for its teams, which is the tournament's too.
 */
export interface Told {
  readonly shape: CompetitionShape;
  readonly drawsAllowed: boolean;
  readonly teamPlayers?: readonly TeamPlayerInTest[] | undefined;
}

// Whether the player `id` won or lost `game`.
const isIn = (game: Game, id: GamePlayerId): boolean =>
  game.winner.equals(id) || game.loser.equals(id);

/** A competition's refusal, named by its code. */
export class CompetitionRefused extends Refused<CompetitionErrorCode> {}

const refuse = (code: CompetitionErrorCode, message: string): never => {
  throw new CompetitionRefused(code, message);
};

// How far apart players are put when the players are spaced out, as the
// tournament's are.
const ORDER_STEP = 10_000;

/**
 * One of a tournament's competitions — a block, a knockout or a Swiss — and
 * the players entered in it. It is kept under the id the tournament gave it,
 * as an aggregate of its own rather than a part of the tournament, since its
 * games will be many and entered by several scorers at once. One that nothing
 * has been done to has no players.
 *
 * What it cannot know it is told: whoever asks has been asked of the
 * tournament whether they may, a tournament player named is one the
 * tournament has and has not archived, and their order is the tournament's,
 * as are what kind of competition it is and whether drawn games are allowed.
 * What it knows is who is in it, and the games they have played.
 *
 * A knockout is drawn in the competition's order, so once it has a game in
 * use, its draw is fixed: nobody is entered, moved or removed.
 * Its places left over are filled with byes, which are nobody, and it is
 * played only once players and byes fill every place.
 *
 * A test, in a tournament played by teams, has no players entered in it: its
 * games are between the players of its two teams, one of each, whom it is
 * told of, and two who meet play a match of its best-of, as in a block.
 */
export class Competition extends AggregateRoot {
  // By the written id.
  readonly #players = new Map<string, CompetitionPlayer>();
  // By the written id, in the order they are listed: the order they were
  // added, but for a test's moved since.
  readonly #games = new Map<string, Game>();
  // Those withdrawn, in the order they withdrew, since a knockout's match
  // between two of them went to whoever withdrew later.
  #withdrawals: CompetitionPlayerId[] = [];
  // A knockout's byes, by their orders. Every bye has the same id, so its
  // order, which no other player or bye in the competition has, is what tells
  // one from another.
  #byes: number[] = [];

  private constructor(id: CompetitionId) {
    super(id);
  }

  /** The competition `events` leave, which is one with no players where there are none. */
  static rebuiltFrom(
    id: CompetitionId,
    events: readonly DomainEvent[],
  ): Competition {
    const competition = new Competition(id);
    competition.replay(events);
    return competition;
  }

  /** Its players, the withdrawn and a knockout's byes among them, lowest order first. */
  get players(): readonly CompetitionPlayer[] {
    return [
      ...this.#players.values(),
      ...this.#byes.map((order) =>
        CompetitionPlayer.from(CompetitionPlayerId.bye(), {
          tournamentPlayerId: TournamentPlayerId.bye(),
          order,
        }),
      ),
    ].sort((one, other) => one.order - other.order);
  }

  /**
   * Its games, archived ones among them, in the order they were added, but
   * for a test's, which can be moved.
   */
  get games(): readonly Game[] {
    return [...this.#games.values()];
  }

  /**
   * Whether the player `id` won or lost any game in use. Only those count: an
   * archived game counts for nothing, so it keeps nobody in the competition
   * or the tournament.
   */
  hasGamesInUse(id: CompetitionPlayerId): boolean {
    return this.#counting().some((game) => isIn(game, id));
  }

  /**
   * Who the player `id` is drawn to play now, in a knockout: the other player
   * of their match not yet decided. Nobody in a block or a Swiss, which have
   * no draw, nor where they are waiting on a bye or a match, or are out.
   */
  drawnAgainst(
    id: CompetitionPlayerId,
    told: Told,
  ): CompetitionPlayerId | undefined {
    const { shape } = told;
    if (shape.kind !== "knockout") return undefined;
    return drawnAgainst(this.#knockoutPlay(shape.draw), id)?.id;
  }

  /**
   * A knockout's every match, first round first and each round in the order
   * of the draw, as the games that count have played it out (KnockoutPlay.ts).
   * None in a block, a Swiss or a test, which have no draw.
   */
  knockoutMatches(told: Told): readonly Match[] {
    const { shape } = told;
    if (shape.kind !== "knockout") return [];
    return this.#knockoutPlay(shape.draw);
  }

  /**
   * That the tournament player `tournamentPlayer` is entered, and answered
   * with the id they are given. They are given `tournamentOrder`, their order
   * in the tournament, so that the players start in the tournament's order.
   * Where a player in the competition already has it, they are put just after
   * that player, as a player moved down past them would be: halfway to the
   * next, withdrawn or not, or last where there is none, with the players
   * spaced out first where there is no room. One already in it, withdrawn or
   * not, is refused, and in a knockout, one for whom the draw has no place
   * left.
   */
  enterPlayer(
    tournamentPlayer: TournamentPlayerId,
    tournamentOrder: number,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): CompetitionPlayerId {
    this.#refuseOnceTheDrawIsFixed(told);
    if (
      this.players.some((player) =>
        player.tournamentPlayerId.equals(tournamentPlayer),
      )
    ) {
      refuse(
        "Competition.PlayerAlreadyEntered",
        "The tournament player is already in the competition.",
      );
    }
    this.#refuseOnceTheDrawIsFull(told);
    const id = CompetitionPlayerId.create();
    const holder = this.players.findIndex(
      (player) => player.order === tournamentOrder,
    );
    let order: number | undefined = tournamentOrder;
    if (holder >= 0) {
      order = this.#orderPast(holder, "down");
      if (order === undefined) {
        this.#spaceOut(by, at);
        order = this.#orderPast(holder, "down");
      }
      if (order === undefined) {
        throw new Error("Spaced out, there was still no room to enter into.");
      }
    }
    this.record(
      new CompetitionPlayerEntered(
        id.value,
        tournamentPlayer.value,
        order,
        by,
        at,
      ),
    );
    return id;
  }

  /**
   * That a bye is entered in a knockout, and answered with the id every bye
   * has. It is put last, since it has no order in the tournament, and fills a
   * place as a player does, so it is refused where a player would be: once
   * the draw is fixed, or full. A block or a Swiss has no draw to put it in.
   */
  enterBye(told: Told, by: AccountId, at: ReadOnlyDate): CompetitionPlayerId {
    if (told.shape.kind !== "knockout") {
      return refuse(
        "Competition.ByeOutsideKnockout",
        "Only a knockout has a draw to put a bye in.",
      );
    }
    this.#refuseOnceTheDrawIsFixed(told);
    this.#refuseOnceTheDrawIsFull(told);
    const id = CompetitionPlayerId.bye();
    this.record(
      new CompetitionPlayerEntered(
        id.value,
        TournamentPlayerId.bye().value,
        CompetitionPlayer.orderAfter(this.players),
        by,
        at,
      ),
    );
    return id;
  }

  /**
   * That the player `id` is moved a place among those who have not withdrawn:
   * up to just before the player above, or down to just after the player
   * below. They are given the order halfway between the two they now come
   * between, rounded down, and nobody else moves, as a tournament's
   * competition is moved. Put first, they are given half the order of the one
   * they come before, and put last, 10,000 more than the highest order there
   * is.
   *
   * A withdrawn player keeps their order and still counts, so the room
   * between two players ends at one lying between them. Where there is no
   * whole number left in the room, every player is spaced out again first,
   * 10,000 apart in the order they are in. Moving the first up or the last
   * down records nothing, since there is nowhere for them to go. A withdrawn
   * player can only have their withdrawal reversed, so moving one is refused,
   * as the player says.
   */
  movePlayer(
    id: CompetitionPlayerId,
    direction: "up" | "down",
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    const player = this.#playerFound(id);
    player.ensureMovable();
    this.#refuseOnceTheDrawIsFixed(told);
    const moved = this.#moved(player.order, direction, by, at);
    if (moved === undefined) return;
    this.record(new CompetitionPlayerMoved(id.value, moved.to, by, at));
  }

  /**
   * That the bye with the order `order` is moved a place, as a player is.
   * Every bye has the same id, so it is named by its order, which is refused
   * where no bye has it.
   */
  moveBye(
    order: number,
    direction: "up" | "down",
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#byeFound(order);
    this.#refuseOnceTheDrawIsFixed(told);
    const moved = this.#moved(order, direction, by, at);
    if (moved === undefined) return;
    this.record(new CompetitionByeMoved(moved.from, moved.to, by, at));
  }

  /**
   * That the player `id` withdraws, and is put last, after every player still
   * playing. In a knockout they keep their order, and with it their place in
   * the draw, and lose every match of theirs not already decided. One who has
   * withdrawn is left as they are.
   */
  withdrawPlayer(
    id: CompetitionPlayerId,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    const player = this.#playerFound(id);
    if (player.withdrawn) return;
    this.record(
      new CompetitionPlayerWithdrawn(
        id.value,
        told.shape.kind === "knockout"
          ? player.order
          : CompetitionPlayer.orderAfter(this.players),
        by,
        at,
      ),
    );
  }

  /**
   * That the withdrawal of the player `id` is reversed. They keep the order
   * they were given when they withdrew. One who has not withdrawn is left as
   * they are.
   */
  reverseWithdrawal(
    id: CompetitionPlayerId,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    if (!this.#playerFound(id).withdrawn) return;
    // In a knockout, whoever went through in their place, or past a match
    // the withdrawal left to nobody, may have played on since, and reversing
    // it would leave that game played by somebody who had not got there.
    if (told.shape.kind === "knockout") {
      const reversed = this.players.map((player) =>
        player.id.equals(id) ? player.reverseWithdrawal() : player,
      );
      if (
        this.#leavesGamesBehind(
          told.shape.draw,
          reversed,
          this.#withdrawals.filter((withdrawn) => !withdrawn.equals(id)),
          this.#counting(),
        )
      ) {
        refuse(
          "Competition.WinnerHasPlayedOn",
          "The opponent who went through has played on.",
        );
      }
    }
    this.record(new CompetitionPlayerWithdrawalReversed(id.value, by, at));
  }

  /**
   * That the player `id` carries `counts` forward, in place of whatever they
   * did, so a count left out is taken away. A knockout has no standings for a
   * carry forward to count in, since it is decided by its draw, so it is
   * refused there rather than kept where nothing would ever count it. A
   * withdrawn player is refused, as the player says, and a carry forward that
   * breaks a rule as the carry forward says. One the player already has is
   * left as it is.
   */
  changeCarryForward(
    id: CompetitionPlayerId,
    counts: CarryForwardCounts,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    if (told.shape.kind === "knockout") {
      refuse(
        "Competition.NoStandings",
        "A knockout has no standings to carry anything forward into.",
      );
    }
    const player = this.#playerFound(id);
    const carryForward = CarryForward.from(counts);
    if (player.withCarryForward(carryForward) === player) return;
    this.record(
      new CompetitionPlayerCarryForwardChanged(
        id.value,
        carryForward.counts,
        by,
        at,
      ),
    );
  }

  /**
   * That the player `id`, entered by mistake, is taken out, with their
   * archived games, which would be against somebody no longer there and
   * could never be restored. A withdrawn player and one with games in use are
   * refused, as the player says, and anybody in a knockout whose draw is
   * fixed.
   */
  removePlayer(
    id: CompetitionPlayerId,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#playerFound(id).ensureRemovable({
      hasGames: this.hasGamesInUse(id),
    });
    this.#refuseOnceTheDrawIsFixed(told);
    this.record(new CompetitionPlayerRemoved(id.value, by, at));
  }

  /**
   * That the bye with the order `order`, entered by mistake, is taken out.
   * Every bye has the same id, so it is named by its order, which is refused
   * where no bye has it, and in a knockout whose draw is fixed.
   */
  removeBye(order: number, told: Told, by: AccountId, at: ReadOnlyDate): void {
    this.#byeFound(order);
    this.#refuseOnceTheDrawIsFixed(told);
    this.record(new CompetitionByeRemoved(order, by, at));
  }

  /**
   * That the tournament player `tournamentPlayer`, archived, is taken out of
   * the competition, withdrawn or not, since an archived tournament player is
   * in no competition, with their archived games, as a player removed by
   * mistake is. One with games in use is refused, as the player says, and
   * anybody in a knockout whose draw is fixed. A tournament player not in it
   * records nothing.
   */
  removeArchivedPlayer(
    tournamentPlayer: TournamentPlayerId,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    const found = this.players.find((player) =>
      player.tournamentPlayerId.equals(tournamentPlayer),
    );
    if (found === undefined) return;
    found.ensureRemovableAsArchived({
      hasGames: this.hasGamesInUse(found.id),
    });
    this.#refuseOnceTheDrawIsFixed(told);
    this.record(new CompetitionPlayerRemoved(found.id.value, by, at));
  }

  /**
   * That the game `id` was played, as `details` say. Both players are the
   * competition's and playing, and the game is refused as a game refuses it,
   * drawn games never being allowed in a knockout, which has to send somebody
   * through. In a block, the two play a match of the block's best-of, and a
   * game in one already decided is refused; in a knockout, the two are the
   * ones drawn to meet in a match not yet decided.
   */
  addGame(
    id: GameId,
    details: GameDetails,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    if (this.#games.has(id.value)) {
      refuse("Competition.GameAlreadyAdded", "The game is already added.");
    }
    this.#ensureBothPlaying(details.winner, details.loser, told);
    const game = Game.from(id, details, {
      drawsAllowed: told.drawsAllowed && told.shape.kind !== "knockout",
    });
    this.#ensureItCounts(game, told);
    this.record(
      new CompetitionGameAdded(
        id.value,
        game.winner.value,
        String(game.winnerScore),
        game.winnerScore.marked,
        game.loser.value,
        String(game.loserScore),
        by,
        at,
      ),
    );
  }

  /**
   * That the game `id` is set aside, and no longer counts. In a knockout, a
   * game of a match whose winner has since played in a later round is
   * refused, as is one whose match sent somebody else on to play. Archiving one that is archived records nothing.
   */
  archiveGame(id: GameId, told: Told, by: AccountId, at: ReadOnlyDate): void {
    const game = this.#gameFound(id);
    if (game.archived) return;
    if (this.#heldByPlayingOn(game, told)) {
      refuse(
        "Competition.WinnerHasPlayedOn",
        "The winner of the game's match has played on.",
      );
    }
    this.record(new CompetitionGameArchived(id.value, by, at));
  }

  /**
   * Whether the game `id` could be archived now, as archiving it would say:
   * for a list offering to archive a game only where it would be done.
   */
  canBeArchived(id: GameId, told: Told): boolean {
    const game = this.#gameFound(id);
    return !game.archived && !this.#heldByPlayingOn(game, told);
  }

  /**
   * That the test's game `id` swaps places with the game in use next to it,
   * up or down, archived games being passed over, since the order of a test's
   * games is only how they are listed. Any other competition's games keep the
   * order they were added in, which can decide a knockout, and are refused.
   * An archived game is out of the way, and is refused as the game refuses
   * it. Moving the first up or the last down records nothing.
   */
  moveGame(
    id: GameId,
    direction: "up" | "down",
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    if (told.shape.kind !== "test") {
      refuse("Competition.NotATest", "Only a test's games are moved.");
    }
    const game = this.#gameFound(id);
    if (game.archived) {
      throw new ValidationError<GameErrorCode>("Game.Archived");
    }
    if (this.#swappedWith(id.value, direction) === undefined) return;
    this.record(new CompetitionGameMoved(id.value, direction, by, at));
  }

  /**
   * That the archived game `id` counts again, where it could be added now:
   * refused as adding it would be. Restoring one not archived records nothing.
   */
  restoreGame(id: GameId, told: Told, by: AccountId, at: ReadOnlyDate): void {
    const game = this.#gameFound(id);
    if (!game.archived) return;
    this.#ensureBothPlaying(game.winner, game.loser, told);
    this.#ensureItCounts(game, told);
    this.record(new CompetitionGameRestored(id.value, by, at));
  }

  /**
   * That the game `id` was played to `winnerScore` and `loserScore` rather
   * than the scores it was entered with, its result kept: refused as the game
   * refuses it, drawn games never being allowed in a knockout, as when adding
   * one. Kept to its players, no match is decided otherwise, so a game is
   * corrected whatever has been played since.
   *
   * Where `players` are given and are not its own, it is corrected to them,
   * as though it were archived and added again with them, which is allowed
   * only where it could be archived: refused as archiving it would be, and
   * then as adding it would be with the game itself not counting. Correcting
   * one not archived to the scores and the players it has records nothing.
   */
  correctGame(
    id: GameId,
    winnerScore: Score,
    loserScore: Score,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
    players?: {
      readonly winner?: GamePlayerId | undefined;
      readonly loser?: GamePlayerId | undefined;
    },
  ): void {
    const game = this.#gameFound(id);
    const winner = players?.winner ?? game.winner;
    const loser = players?.loser ?? game.loser;
    const changed = !winner.equals(game.winner) || !loser.equals(game.loser);
    // Asked of the game first, so that what is wrong with the game itself is
    // said before anything about where it would go.
    const corrected = game.correct(
      winnerScore,
      loserScore,
      { drawsAllowed: told.drawsAllowed && told.shape.kind !== "knockout" },
      { winner, loser },
    );
    if (changed) {
      if (this.#heldByPlayingOn(game, told)) {
        refuse(
          "Competition.WinnerHasPlayedOn",
          "The winner of the game's match has played on.",
        );
      }
      this.#ensureBothPlaying(winner, loser, told);
      this.#ensureItCounts(corrected, told, game);
    }
    const same = (one: Score, other: Score): boolean =>
      String(one) === String(other) && one.marked === other.marked;
    if (
      !changed &&
      same(corrected.winnerScore, game.winnerScore) &&
      same(corrected.loserScore, game.loserScore)
    ) {
      return;
    }
    this.record(
      new CompetitionGameCorrected(
        id.value,
        String(corrected.winnerScore),
        corrected.winnerScore.marked,
        String(corrected.loserScore),
        changed ? winner.value : undefined,
        changed ? loser.value : undefined,
        by,
        at,
      ),
    );
  }

  protected apply(event: DomainEvent): void {
    if (
      event instanceof CompetitionPlayerEntered &&
      CompetitionPlayerId.from(event.playerId).equals(CompetitionPlayerId.bye())
    ) {
      this.#byes.push(event.order);
    } else if (event instanceof CompetitionPlayerEntered) {
      const id = CompetitionPlayerId.from(event.playerId);
      this.#players.set(
        id.value,
        CompetitionPlayer.from(id, {
          tournamentPlayerId: TournamentPlayerId.from(event.tournamentPlayerId),
          order: event.order,
        }),
      );
    } else if (event instanceof CompetitionPlayerMoved) {
      this.#change(event.playerId, (player) => player.withOrder(event.order));
    } else if (event instanceof CompetitionByeMoved) {
      this.#byes = this.#byes.map((order) =>
        order === event.fromOrder ? event.order : order,
      );
    } else if (event instanceof CompetitionByeRemoved) {
      this.#byes = this.#byes.filter((order) => order !== event.order);
    } else if (event instanceof CompetitionPlayersSpacedOut) {
      // By place rather than by id, since every bye has the same id: the
      // players were said in the order they were in, which is the order they
      // are in now.
      const byes: number[] = [];
      this.players.forEach((player, index) => {
        const order = (index + 1) * ORDER_STEP;
        if (player.isBye) byes.push(order);
        else this.#change(player.id.value, (kept) => kept.withOrder(order));
      });
      this.#byes = byes;
    } else if (event instanceof CompetitionPlayerWithdrawn) {
      this.#change(event.playerId, (player) =>
        player.withdraw().withOrder(event.order),
      );
      this.#withdrawals.push(CompetitionPlayerId.from(event.playerId));
    } else if (event instanceof CompetitionPlayerWithdrawalReversed) {
      this.#change(event.playerId, (player) => player.reverseWithdrawal());
      this.#forgetWithdrawal(event.playerId);
    } else if (event instanceof CompetitionPlayerCarryForwardChanged) {
      this.#change(event.playerId, (player) =>
        player.withCarryForward(CarryForward.from(event.counts)),
      );
    } else if (event instanceof CompetitionPlayerRemoved) {
      this.#players.delete(event.playerId);
      this.#forgetWithdrawal(event.playerId);
      // Only archived ones are left, since a player with a game in use is not
      // removed, and they go with the player.
      const removed = CompetitionPlayerId.from(event.playerId);
      for (const game of this.games) {
        if (isIn(game, removed)) this.#games.delete(game.id.value);
      }
    } else if (event instanceof CompetitionGameAdded) {
      const id = GameId.from(event.gameId);
      // Asked of the game when it was recorded, so drawn games are let through
      // here, where whether they were allowed then is not known.
      this.#games.set(
        id.value,
        Game.from(
          id,
          {
            winner: gamePlayerIdFrom(event.winnerId),
            winnerScore: Score.kept(event.winnerScore, event.winnerMarked),
            loser: gamePlayerIdFrom(event.loserId),
            loserScore: Score.kept(event.loserScore, false),
          },
          // When it was added is when the event adding it happened.
          { drawsAllowed: true, addedAt: event.occurredAt },
        ),
      );
    } else if (event instanceof CompetitionGameArchived) {
      this.#changeGame(event.gameId, (game) => game.archive());
    } else if (event instanceof CompetitionGameMoved) {
      const other = this.#swappedWith(event.gameId, event.direction);
      if (other !== undefined) this.#swap(event.gameId, other);
    } else if (event instanceof CompetitionGameRestored) {
      this.#changeGame(event.gameId, (game) => game.restore());
    } else if (event instanceof CompetitionGameCorrected) {
      // Asked of the game when it was recorded, as a game added is. One
      // that says no players kept its own.
      this.#changeGame(event.gameId, (game) =>
        game.correct(
          Score.kept(event.winnerScore, event.winnerMarked),
          Score.kept(event.loserScore, false),
          { drawsAllowed: true },
          {
            winner:
              event.winnerId === undefined
                ? game.winner
                : gamePlayerIdFrom(event.winnerId),
            loser:
              event.loserId === undefined
                ? game.loser
                : gamePlayerIdFrom(event.loserId),
          },
        ),
      );
    }
  }

  // A knockout's draw is its players in the competition's order, so once it
  // has a game in use, nobody is entered, moved or removed. An archived game
  // fixes nothing: it counts for nothing, and restoring it is refused where
  // its players are no longer drawn to meet.
  #refuseOnceTheDrawIsFixed(told: Told): void {
    if (told.shape.kind === "knockout" && this.#counting().length > 0) {
      refuse("Competition.DrawFixed", "The knockout's draw is fixed.");
    }
  }

  // A withdrawn player keeps their place in the draw, and a bye fills one, so
  // both count.
  #refuseOnceTheDrawIsFull(told: Told): void {
    if (
      told.shape.kind === "knockout" &&
      this.players.length >= told.shape.draw.places
    ) {
      refuse("Competition.DrawFull", "Every place in the draw is filled.");
    }
  }

  #byeFound(order: number): void {
    if (!this.#byes.includes(order)) {
      refuse("Competition.NoSuchPlayer", "The competition has no such bye.");
    }
  }

  // Two players the competition has, and who are playing: in a test, players
  // in use of each of its two teams; anywhere else, players entered in it who
  // have not withdrawn.
  #ensureBothPlaying(
    winner: GamePlayerId,
    loser: GamePlayerId,
    told: Told,
  ): void {
    const { shape } = told;
    if (shape.kind !== "test") {
      this.#ensurePlaying(winner);
      this.#ensurePlaying(loser);
      return;
    }
    const sides = [shape.firstTeam, shape.secondTeam];
    const teamOf = (id: GamePlayerId): TeamId => {
      const found = (told.teamPlayers ?? []).find((player) =>
        player.id.equals(id),
      );
      if (
        found === undefined ||
        !sides.some((side) => side.equals(found.team))
      ) {
        return refuse(
          "Competition.NoSuchPlayer",
          "The player plays for neither of the test's teams.",
        );
      }
      if (found.archived) {
        throw new ValidationError<TeamPlayerErrorCode>("TeamPlayer.Archived");
      }
      return found.team;
    };
    if (teamOf(winner).equals(teamOf(loser))) {
      refuse(
        "Competition.SameTeam",
        "A game in a test is between a player of each of its teams.",
      );
    }
  }

  // A player the competition has, and who has not withdrawn.
  #ensurePlaying(id: GamePlayerId): void {
    if (this.#playerFound(id).withdrawn) {
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.Withdrawn",
      );
    }
  }

  // That `game` can count alongside the games that already do, `without` one
  // of them, which is a game being corrected to other players and would no
  // longer count as it was: in a block, in a match not yet decided; in a
  // knockout, between the two drawn to meet in one not yet decided. A Swiss
  // asks nothing more of it. In a test, a game that would start a match
  // beyond those it is expected to have is refused too.
  #ensureItCounts(game: Game, told: Told, without?: Game): void {
    const { shape } = told;
    const counting = this.#counting().filter((each) => !each.equals(without));
    // A test's two players meet in a match of its best-of, as a block's do.
    if (shape.kind === "block" || shape.kind === "test") {
      const played = counting.filter(
        (each) =>
          (each.winner.equals(game.winner) && each.loser.equals(game.loser)) ||
          (each.winner.equals(game.loser) && each.loser.equals(game.winner)),
      );
      // A drawn game is played, but won by neither.
      const won = (id: GamePlayerId): number =>
        played.filter((each) => !each.drawn && each.winner.equals(id)).length;
      const left = shape.bestOf.games - played.length;
      const beyondReach = (one: GamePlayerId, other: GamePlayerId) =>
        won(one) > won(other) + left;
      if (
        left <= 0 ||
        beyondReach(game.winner, game.loser) ||
        beyondReach(game.loser, game.winner)
      ) {
        refuse("Competition.MatchDecided", "Their match is decided.");
      }
      // A match is started once its two players have a game that counts.
      const started = new Set(
        counting.map((each) =>
          [each.winner.value, each.loser.value].sort().join(" "),
        ),
      );
      if (
        shape.kind === "test" &&
        played.length === 0 &&
        started.size >= shape.expectedMatches.count
      ) {
        refuse(
          "Competition.ExpectedMatchesReached",
          "The test has started as many matches as it is expected to have.",
        );
      }
    } else if (shape.kind === "knockout") {
      // Who meets whom is not settled while a place is left empty, or while
      // there are more players than places, as a draw made smaller can leave.
      if (this.players.length !== shape.draw.places) {
        refuse(
          "Competition.DrawNotFilled",
          "The knockout's draw is not filled.",
        );
      }
      const theirs = knockoutPlay(
        shape.draw,
        this.players,
        this.#withdrawals,
        counting,
      ).find(
        (match) =>
          match.sides.some((side) => isPlayer(side, game.winner)) &&
          match.sides.some((side) => isPlayer(side, game.loser)),
      );
      if (theirs === undefined) {
        refuse(
          "Competition.NotDrawnToMeet",
          "These players are not currently drawn to play each other in the knockout.",
        );
      } else if (theirs.winner.is !== "not yet known") {
        refuse("Competition.MatchDecided", "Their match is decided.");
      }
    }
  }

  // The games that count: those not archived, in the order they were added.
  #counting(): Game[] {
    return this.games.filter((game) => !game.archived);
  }

  #knockoutPlay(draw: Parameters<typeof knockoutPlay>[0]): readonly Match[] {
    return knockoutPlay(
      draw,
      this.players,
      this.#withdrawals,
      this.#counting(),
    );
  }

  #forgetWithdrawal(written: string): void {
    this.#withdrawals = this.#withdrawals.filter(
      (withdrawn) => withdrawn.value !== written,
    );
  }

  // Whether `game` is of a knockout's match whose winner has played on.
  #heldByPlayingOn(game: Game, told: Told): boolean {
    if (told.shape.kind !== "knockout") return false;
    const play = this.#knockoutPlay(told.shape.draw);
    const match = play.find((each) =>
      each.games.some((played) => played.equals(game)),
    );
    if (match !== undefined && this.#hasPlayedOn(play, match)) return true;
    // A winner who withdrew sent their next opponent through without
    // playing, and that opponent may have played on.
    return this.#leavesGamesBehind(
      told.shape.draw,
      this.players,
      this.#withdrawals,
      this.#counting().filter((counting) => !counting.equals(game)),
    );
  }

  // Whether the winner of `match` has a game that counts in a later round.
  // Any later round, since they can go through one without playing.
  #hasPlayedOn(play: readonly Match[], match: Match): boolean {
    const { winner } = match;
    if (winner.is !== "player") return false;
    return play.some(
      (later) =>
        later.round > match.round &&
        later.games.some(
          (game) =>
            game.winner.equals(winner.player.id) ||
            game.loser.equals(winner.player.id),
        ),
    );
  }

  // Whether the knockout played out afresh with `players`, `withdrawals` and
  // `games` would leave one of those games, counting now, in none of its
  // matches: played by somebody who had not got there.
  #leavesGamesBehind(
    draw: Parameters<typeof knockoutPlay>[0],
    players: readonly CompetitionPlayer[],
    withdrawals: readonly CompetitionPlayerId[],
    games: readonly Game[],
  ): boolean {
    const countedAfter = knockoutPlay(
      draw,
      players,
      withdrawals,
      games,
    ).flatMap((match) => match.games);
    return this.#knockoutPlay(draw)
      .flatMap((match) => match.games)
      .some(
        (game) =>
          games.some((kept) => kept.equals(game)) &&
          !countedAfter.some((counted) => counted.equals(game)),
      );
  }

  #gameFound(id: GameId): Game {
    return (
      this.#games.get(id.value) ??
      refuse("Competition.NoSuchGame", "The competition has no such game.")
    );
  }

  // The game in use next to the game `written`, above it or below it, which a
  // move swaps it with: archived games are passed over. Nothing, where there
  // is none.
  #swappedWith(written: string, direction: "up" | "down"): string | undefined {
    const inUse = this.#counting().map((game) => game.id.value);
    const at = inUse.indexOf(written);
    return at === -1 ? undefined : inUse[direction === "up" ? at - 1 : at + 1];
  }

  // The games `one` and `other` in each other's places, the rest where they
  // were, since the games are kept in the order they are listed.
  #swap(one: string, other: string): void {
    const listed = [...this.#games.entries()];
    const first = listed.findIndex(([written]) => written === one);
    const second = listed.findIndex(([written]) => written === other);
    const kept = listed[first];
    const moved = listed[second];
    if (kept === undefined || moved === undefined) return;
    listed[first] = moved;
    listed[second] = kept;
    this.#games.clear();
    for (const [written, game] of listed) this.#games.set(written, game);
  }

  #changeGame(written: string, changing: (game: Game) => Game): void {
    const found = this.#games.get(written);
    if (found !== undefined) this.#games.set(written, changing(found));
  }

  // Where the player or bye with `order` goes, moved a place among those who
  // have not withdrawn: the order they have once any spacing out is done, and
  // the order they are to be given. Nothing, where there is nowhere to go.
  #moved(
    order: number,
    direction: "up" | "down",
    by: AccountId,
    at: ReadOnlyDate,
  ): { readonly from: number; readonly to: number } | undefined {
    const playing = this.players.filter((player) => !player.withdrawn);
    const place = playing.findIndex((player) => player.order === order);
    const passed = playing[direction === "up" ? place - 1 : place + 1];
    if (passed === undefined) return undefined;
    // By place rather than by order, since spacing out changes the orders but
    // not the places.
    const mover = this.players.findIndex((player) => player.order === order);
    const past = this.players.findIndex(
      (player) => player.order === passed.order,
    );
    let to = this.#orderPast(past, direction);
    if (to === undefined) {
      this.#spaceOut(by, at);
      to = this.#orderPast(past, direction);
    }
    // Spaced 10,000 apart, there is always room, so none here is a mistake in
    // the spacing rather than something to refuse.
    const from = this.players[mover]?.order;
    if (to === undefined || from === undefined) {
      throw new Error("Spaced out, there was still no room to move into.");
    }
    return { from, to };
  }

  // Every player and bye given an order 10,000 apart, in the order they are in.
  #spaceOut(by: AccountId, at: ReadOnlyDate): void {
    this.record(
      new CompetitionPlayersSpacedOut(
        this.players.map((player) => player.id.value),
        by,
        at,
      ),
    );
  }

  // The order a player moved past the one at `at` in the competition's order
  // is given: just before them when moving up, just after them when moving
  // down, halfway into the room between them and whoever lies next to them,
  // withdrawn or not. Nothing, where there is no whole number left in the room.
  #orderPast(at: number, direction: "up" | "down"): number | undefined {
    const all = this.players;
    const orderAt = (index: number): number | undefined => all[index]?.order;
    const [lower, upper] =
      direction === "up"
        ? [orderAt(at - 1) ?? 0, orderAt(at)]
        : [orderAt(at), orderAt(at + 1)];
    if (lower === undefined) return undefined;
    if (upper === undefined) return lower + ORDER_STEP;
    const halfway = Math.floor((lower + upper) / 2);
    return halfway > lower && halfway < upper ? halfway : undefined;
  }

  #playerFound(id: GamePlayerId): CompetitionPlayer {
    return (
      this.#players.get(id.value) ??
      refuse("Competition.NoSuchPlayer", "The competition has no such player.")
    );
  }

  // A player is never altered, so a changed one is made again and put in the
  // place of the one it was.
  #change(
    written: string,
    changing: (player: CompetitionPlayer) => CompetitionPlayer,
  ): void {
    const found = this.#players.get(written);
    if (found !== undefined) this.#players.set(written, changing(found));
  }
}
