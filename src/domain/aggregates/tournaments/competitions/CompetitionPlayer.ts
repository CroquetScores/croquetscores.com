import { Validator } from "../../../common/validation/Validator.js";
import { ValidationError } from "../../../common/validation/ValidationError.js";
import type { TournamentPlayerId } from "../primitives/TournamentPlayerId.js";
import type { CompetitionPlayerId } from "./primitives/CompetitionPlayerId.js";

/** Every rule a player in a competition can break. */
export type CompetitionPlayerErrorCode =
  | "CompetitionPlayer.OrderNotWhole"
  | "CompetitionPlayer.OrderTooSmall"
  | "CompetitionPlayer.HasGames"
  | "CompetitionPlayer.Withdrawn";

// The gap left between one player's order and the next, so that a player can
// later be put between two others without either of them moving.
const ORDER_STEP = 10_000;

// A whole number the platform holds exactly. One beyond that is not reliably
// the number it was given, so two orders could be told apart by nothing.
const orders = new Validator<number, CompetitionPlayerErrorCode>({
  fields: [
    {
      field: "order",
      code: "CompetitionPlayer.OrderNotWhole",
      isBrokenBy: (order) => !Number.isSafeInteger(order),
    },
    {
      field: "order",
      code: "CompetitionPlayer.OrderTooSmall",
      isBrokenBy: (order) => order < 1,
    },
  ],
});

/** What a new player in a competition is, before anything is asked of it. */
export interface CompetitionPlayerDetails {
  /** The tournament's player this is, in the competition. */
  readonly tournamentPlayerId: TournamentPlayerId;
  /** Where the player comes when the competition lists them, lowest first. */
  readonly order: number;
}

/**
 * One of a tournament's players, given a place in one of its competitions.
 * Everything about the person is the tournament player's, so it is said once
 * rather than again in every competition they play in.
 *
 * A player is never altered: withdrawing and reversing it give the player as
 * they are afterwards, and leave the one asked unchanged. Asking for what a
 * player already is gives them back as they are, since two people doing the
 * same thing at once, or a form sent twice, is not a mistake worth refusing.
 *
 * A player entered by mistake is removed rather than set aside, since with no
 * games they have nothing in the competition but their place. Taking them out
 * is the competition's to do; the player says only whether they can be.
 *
 * Two players are the same player when their ids are, whatever else differs.
 */
export class CompetitionPlayer {
  readonly #id: CompetitionPlayerId;
  readonly #tournamentPlayerId: TournamentPlayerId;
  readonly #order: number;
  readonly #withdrawn: boolean;

  private constructor(
    id: CompetitionPlayerId,
    tournamentPlayerId: TournamentPlayerId,
    order: number,
    withdrawn: boolean,
  ) {
    this.#id = id;
    this.#tournamentPlayerId = tournamentPlayerId;
    this.#order = order;
    this.#withdrawn = withdrawn;
  }

  /**
   * The new player known by `id` that `details` describe, not withdrawn.
   * Throws {@link ValidationError} naming the first rule the order breaks.
   */
  static from(
    id: CompetitionPlayerId,
    details: CompetitionPlayerDetails,
  ): CompetitionPlayer {
    orders.ensureValid(details.order);
    return new CompetitionPlayer(
      id,
      details.tournamentPlayerId,
      details.order,
      false,
    );
  }

  /**
   * The order after every player there, when `players` are all a competition
   * has: where a player who withdraws is put. Withdrawn players are among them
   * and count, so that no order is ever given to two players in the one
   * competition. A player removed is not among them, and their order went
   * with them.
   */
  static orderAfter(players: readonly CompetitionPlayer[]): number {
    return (
      players.reduce((highest, player) => Math.max(highest, player.#order), 0) +
      ORDER_STEP
    );
  }

  get id(): CompetitionPlayerId {
    return this.#id;
  }

  get tournamentPlayerId(): TournamentPlayerId {
    return this.#tournamentPlayerId;
  }

  /** Where the player comes when the competition lists them, lowest first. */
  get order(): number {
    return this.#order;
  }

  get withdrawn(): boolean {
    return this.#withdrawn;
  }

  /**
   * The player, withdrawn. A player with games can withdraw, since that is
   * what withdrawing part of the way through is.
   */
  withdraw(): CompetitionPlayer {
    if (this.#withdrawn) return this;
    return this.#with({ withdrawn: true });
  }

  /**
   * The player, given `order`, which is the competition's to work out: where
   * a player withdrawn or moved now comes. Throws {@link ValidationError}
   * naming the first rule the order breaks.
   */
  withOrder(order: number): CompetitionPlayer {
    orders.ensureValid(order);
    return this.#with({ order });
  }

  /**
   * Throws {@link ValidationError} where the player cannot be moved: as
   * `CompetitionPlayer.Withdrawn` for a withdrawn player, who can only have
   * their withdrawal reversed.
   */
  ensureMovable(): void {
    if (this.#withdrawn)
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.Withdrawn",
      );
  }

  /** The player, playing again. */
  reverseWithdrawal(): CompetitionPlayer {
    if (!this.#withdrawn) return this;
    return this.#with({ withdrawn: false });
  }

  /**
   * Throws {@link ValidationError} where the player cannot be removed from the
   * competition: as `CompetitionPlayer.Withdrawn` for a withdrawn player, whose
   * withdrawal is reversed first, and as `CompetitionPlayer.HasGames` for one
   * with games, since the games would then be against somebody who is no
   * longer there. Whether they have games is the competition's to know, so it
   * says, and an archived game is one of them, since it can be restored.
   */
  ensureRemovable({ hasGames }: { readonly hasGames: boolean }): void {
    if (this.#withdrawn)
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.Withdrawn",
      );
    if (hasGames)
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.HasGames",
      );
  }

  /**
   * Throws {@link ValidationError} where the player cannot be removed because
   * their tournament player is archived: as `CompetitionPlayer.HasGames` for
   * one with games. A withdrawn player is removed too, since an archived
   * tournament player is in no competition, and there is nobody to reverse
   * the withdrawal first.
   */
  ensureRemovableAsArchived({
    hasGames,
  }: {
    readonly hasGames: boolean;
  }): void {
    if (hasGames)
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.HasGames",
      );
  }

  equals(other: CompetitionPlayer | undefined): boolean {
    return other instanceof CompetitionPlayer && this.#id.equals(other.#id);
  }

  toString(): string {
    return String(this.#id);
  }

  #with(changed: {
    readonly withdrawn?: boolean;
    readonly order?: number;
  }): CompetitionPlayer {
    return new CompetitionPlayer(
      this.#id,
      this.#tournamentPlayerId,
      changed.order ?? this.#order,
      changed.withdrawn ?? this.#withdrawn,
    );
  }
}
