import type { AccountId } from "../../accounts/AccountId.js";
import { AggregateRoot } from "../../../common/AggregateRoot.js";
import type { DomainEvent } from "../../../common/DomainEvent.js";
import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import { Refused } from "../../../common/Refused.js";
import { ValidationError } from "../../../common/validation/ValidationError.js";
import type { CompetitionId } from "../primitives/CompetitionId.js";
import { TournamentPlayerId } from "../primitives/TournamentPlayerId.js";
import type { CompetitionShape } from "../Tournament.js";
import {
  CompetitionPlayer,
  type CompetitionPlayerErrorCode,
} from "./CompetitionPlayer.js";
import { CompetitionGameAdded } from "./events/CompetitionGameAdded.js";
import { CompetitionGameArchived } from "./events/CompetitionGameArchived.js";
import { CompetitionGameRestored } from "./events/CompetitionGameRestored.js";
import { Game, type GameDetails } from "./Game.js";
import { isPlayer, knockoutPlay, type Match } from "./KnockoutPlay.js";
import { GameId } from "./primitives/GameId.js";
import { Score } from "./value-objects/Score.js";
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
  | "Competition.DrawFixed";

/**
 * What a competition is told of itself by whatever asks, since the tournament
 * keeps it: what kind of competition it is, with a knockout's draw, and
 * whether the tournament allows drawn games.
 */
export interface Told {
  readonly shape: CompetitionShape;
  readonly drawsAllowed: boolean;
}

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
 * A knockout is drawn in the competition's order, so once it has a game,
 * archived or not, its draw is fixed: nobody is entered, moved or removed.
 */
export class Competition extends AggregateRoot {
  // By the written id.
  readonly #players = new Map<string, CompetitionPlayer>();
  // By the written id, in the order they were added.
  readonly #games = new Map<string, Game>();

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

  /** Its players, the withdrawn among them, lowest order first. */
  get players(): readonly CompetitionPlayer[] {
    return [...this.#players.values()].sort(
      (one, other) => one.order - other.order,
    );
  }

  /** Its games, archived ones among them, in the order they were added. */
  get games(): readonly Game[] {
    return [...this.#games.values()];
  }

  /** Whether the player `id` won or lost any game, an archived one among them. */
  hasPlayed(id: CompetitionPlayerId): boolean {
    return this.games.some(
      (game) => game.winner.equals(id) || game.loser.equals(id),
    );
  }

  /**
   * That the tournament player `tournamentPlayer` is entered, and answered
   * with the id they are given. They are given `tournamentOrder`, their order
   * in the tournament, so that the players start in the tournament's order.
   * Where a player in the competition already has it, they are put just after
   * that player, as a player moved down past them would be: halfway to the
   * next, withdrawn or not, or last where there is none, with the players
   * spaced out first where there is no room. One already in it, withdrawn or
   * not, is refused.
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
    const id = CompetitionPlayerId.create();
    const holder = this.players.find(
      (player) => player.order === tournamentOrder,
    );
    let order: number | undefined = tournamentOrder;
    if (holder !== undefined) {
      order = this.#orderPast(holder.id, "down");
      if (order === undefined) {
        this.record(
          new CompetitionPlayersSpacedOut(
            this.players.map((player) => player.id.value),
            by,
            at,
          ),
        );
        order = this.#orderPast(holder.id, "down");
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
    this.#playerFound(id).ensureMovable();
    this.#refuseOnceTheDrawIsFixed(told);
    const playing = this.players.filter((player) => !player.withdrawn);
    const place = playing.findIndex((player) => player.id.equals(id));
    const passed = playing[direction === "up" ? place - 1 : place + 1];
    if (passed === undefined) return;

    let order = this.#orderPast(passed.id, direction);
    if (order === undefined) {
      this.record(
        new CompetitionPlayersSpacedOut(
          this.players.map((player) => player.id.value),
          by,
          at,
        ),
      );
      order = this.#orderPast(passed.id, direction);
    }
    // Spaced 10,000 apart, there is always room, so none here is a mistake in
    // the spacing rather than something to refuse.
    if (order === undefined) {
      throw new Error("Spaced out, there was still no room to move into.");
    }
    this.record(new CompetitionPlayerMoved(id.value, order, by, at));
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
        this.#leavesGamesBehind(told.shape.draw, reversed, this.#counting())
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
   * That the player `id`, entered by mistake, is taken out. A withdrawn player
   * and one with games, an archived one among them, are refused, as the player
   * says, and anybody in a knockout whose draw is fixed.
   */
  removePlayer(
    id: CompetitionPlayerId,
    told: Told,
    by: AccountId,
    at: ReadOnlyDate,
  ): void {
    this.#playerFound(id).ensureRemovable({ hasGames: this.hasPlayed(id) });
    this.#refuseOnceTheDrawIsFixed(told);
    this.record(new CompetitionPlayerRemoved(id.value, by, at));
  }

  /**
   * That the tournament player `tournamentPlayer`, archived, is taken out of
   * the competition, withdrawn or not, since an archived tournament player is
   * in no competition. One with games, an archived one among them, is
   * refused, as the player says, and anybody in a knockout whose draw is
   * fixed. A tournament player not in it records nothing.
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
    found.ensureRemovableAsArchived({ hasGames: this.hasPlayed(found.id) });
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
    this.#ensurePlaying(details.winner);
    this.#ensurePlaying(details.loser);
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
   * That the archived game `id` counts again, where it could be added now:
   * refused as adding it would be. Restoring one not archived records nothing.
   */
  restoreGame(id: GameId, told: Told, by: AccountId, at: ReadOnlyDate): void {
    const game = this.#gameFound(id);
    if (!game.archived) return;
    this.#ensurePlaying(game.winner);
    this.#ensurePlaying(game.loser);
    this.#ensureItCounts(game, told);
    this.record(new CompetitionGameRestored(id.value, by, at));
  }

  protected apply(event: DomainEvent): void {
    if (event instanceof CompetitionPlayerEntered) {
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
    } else if (event instanceof CompetitionPlayersSpacedOut) {
      event.playerIds.forEach((written, index) => {
        this.#change(written, (player) =>
          player.withOrder((index + 1) * ORDER_STEP),
        );
      });
    } else if (event instanceof CompetitionPlayerWithdrawn) {
      this.#change(event.playerId, (player) =>
        player.withdraw().withOrder(event.order),
      );
    } else if (event instanceof CompetitionPlayerWithdrawalReversed) {
      this.#change(event.playerId, (player) => player.reverseWithdrawal());
    } else if (event instanceof CompetitionPlayerRemoved) {
      this.#players.delete(event.playerId);
    } else if (event instanceof CompetitionGameAdded) {
      const id = GameId.from(event.gameId);
      // Asked of the game when it was recorded, so drawn games are let through
      // here, where whether they were allowed then is not known.
      this.#games.set(
        id.value,
        Game.from(
          id,
          {
            winner: CompetitionPlayerId.from(event.winnerId),
            winnerScore: Score.kept(event.winnerScore, event.winnerMarked),
            loser: CompetitionPlayerId.from(event.loserId),
            loserScore: Score.kept(event.loserScore, false),
          },
          { drawsAllowed: true },
        ),
      );
    } else if (event instanceof CompetitionGameArchived) {
      this.#changeGame(event.gameId, (game) => game.archive());
    } else if (event instanceof CompetitionGameRestored) {
      this.#changeGame(event.gameId, (game) => game.restore());
    }
  }

  // A knockout's draw is its players in the competition's order, so once it
  // has a game, archived or not, nobody is entered, moved or removed.
  #refuseOnceTheDrawIsFixed(told: Told): void {
    if (told.shape.kind === "knockout" && this.#games.size > 0) {
      refuse("Competition.DrawFixed", "The knockout's draw is fixed.");
    }
  }

  // A player the competition has, and who has not withdrawn.
  #ensurePlaying(id: CompetitionPlayerId): void {
    if (this.#playerFound(id).withdrawn) {
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.Withdrawn",
      );
    }
  }

  // That `game` can count alongside the games that already do: in a block, in
  // a match not yet decided; in a knockout, between the two drawn to meet in
  // one not yet decided. A Swiss asks nothing more of it.
  #ensureItCounts(game: Game, told: Told): void {
    const { shape } = told;
    if (shape.kind === "block") {
      const played = this.#counting().filter(
        (each) =>
          (each.winner.equals(game.winner) && each.loser.equals(game.loser)) ||
          (each.winner.equals(game.loser) && each.loser.equals(game.winner)),
      );
      // A drawn game is played, but won by neither.
      const won = (id: CompetitionPlayerId): number =>
        played.filter((each) => !each.drawn && each.winner.equals(id)).length;
      const left = shape.bestOf.games - played.length;
      const beyondReach = (
        one: CompetitionPlayerId,
        other: CompetitionPlayerId,
      ) => won(one) > won(other) + left;
      if (
        left <= 0 ||
        beyondReach(game.winner, game.loser) ||
        beyondReach(game.loser, game.winner)
      ) {
        refuse("Competition.MatchDecided", "Their match is decided.");
      }
    } else if (shape.kind === "knockout") {
      const theirs = this.#knockoutPlay(shape.draw).find(
        (match) =>
          match.sides.some((side) => isPlayer(side, game.winner)) &&
          match.sides.some((side) => isPlayer(side, game.loser)),
      );
      if (theirs === undefined) {
        refuse("Competition.NotDrawnToMeet", "They are not drawn to meet.");
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
    return knockoutPlay(draw, this.players, this.#counting());
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

  // Whether the knockout played out afresh with `players` and `games` would
  // leave one of those games, counting now, in none of its matches: played by
  // somebody who had not got there.
  #leavesGamesBehind(
    draw: Parameters<typeof knockoutPlay>[0],
    players: readonly CompetitionPlayer[],
    games: readonly Game[],
  ): boolean {
    const countedAfter = knockoutPlay(draw, players, games).flatMap(
      (match) => match.games,
    );
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

  #changeGame(written: string, changing: (game: Game) => Game): void {
    const found = this.#games.get(written);
    if (found !== undefined) this.#games.set(written, changing(found));
  }

  // The order a player moved past `passed` is given: just before them when
  // moving up, just after them when moving down, halfway into the room between
  // them and whoever lies next to them, withdrawn or not. Nothing, where there
  // is no whole number left in the room.
  #orderPast(
    passed: CompetitionPlayerId,
    direction: "up" | "down",
  ): number | undefined {
    const all = this.players;
    const at = all.findIndex((player) => player.id.equals(passed));
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

  #playerFound(id: CompetitionPlayerId): CompetitionPlayer {
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
