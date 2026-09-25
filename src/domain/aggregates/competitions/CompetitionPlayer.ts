import { Validator } from "../../common/validation/Validator.js";
import { ValidationError } from "../../common/validation/ValidationError.js";
import type { TournamentPlayerId } from "../tournaments/primitives/TournamentPlayerId.js";
import type { CompetitionPlayerId } from "./primitives/CompetitionPlayerId.js";

/** Every rule a player in a competition can break. */
export type CompetitionPlayerErrorCode =
  | "CompetitionPlayer.OrderNotWhole"
  | "CompetitionPlayer.OrderTooSmall"
  | "CompetitionPlayer.HasGames"
  | "CompetitionPlayer.Withdrawn"
  | "CompetitionPlayer.Archived";

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
 * A player is never altered: withdrawing, archiving and undoing either give
 * the player as they are afterwards, and leave the one asked unchanged. Asking
 * for what a player already is gives them back as they are, since two people
 * doing the same thing at once, or a form sent twice, is not a mistake worth
 * refusing.
 *
 * Two players are the same player when their ids are, whatever else differs.
 */
export class CompetitionPlayer {
  readonly #id: CompetitionPlayerId;
  readonly #tournamentPlayerId: TournamentPlayerId;
  readonly #order: number;
  readonly #withdrawn: boolean;
  readonly #archived: boolean;

  private constructor(
    id: CompetitionPlayerId,
    tournamentPlayerId: TournamentPlayerId,
    order: number,
    withdrawn: boolean,
    archived: boolean,
  ) {
    this.#id = id;
    this.#tournamentPlayerId = tournamentPlayerId;
    this.#order = order;
    this.#withdrawn = withdrawn;
    this.#archived = archived;
  }

  /**
   * The new player known by `id` that `details` describe, neither withdrawn
   * nor archived. Throws {@link ValidationError} naming the first rule the
   * order breaks.
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
      false,
    );
  }

  /**
   * The order the next player added to a competition is given, when `players`
   * are all it has. Archived and withdrawn players are among them and count,
   * so that no order is ever given twice in the one competition.
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

  get archived(): boolean {
    return this.#archived;
  }

  /**
   * The player, withdrawn. A player with games can withdraw, since that is
   * what withdrawing part of the way through is. Throws
   * {@link ValidationError} as `CompetitionPlayer.Archived` for an archived
   * player.
   */
  withdraw(): CompetitionPlayer {
    this.#refuseIfArchived();
    if (this.#withdrawn) return this;
    return this.#with({ withdrawn: true });
  }

  /**
   * The player, playing again. Throws {@link ValidationError} as
   * `CompetitionPlayer.Archived` for an archived player.
   */
  reverseWithdrawal(): CompetitionPlayer {
    this.#refuseIfArchived();
    if (!this.#withdrawn) return this;
    return this.#with({ withdrawn: false });
  }

  /**
   * The player, archived. Whether they have games is the competition's to
   * know, so it says. Throws {@link ValidationError} as
   * `CompetitionPlayer.Withdrawn` for a withdrawn player, and as
   * `CompetitionPlayer.HasGames` for one with games, since the games would
   * then be against somebody who is no longer there.
   */
  archive({ hasGames }: { readonly hasGames: boolean }): CompetitionPlayer {
    if (this.#archived) return this;
    if (this.#withdrawn)
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.Withdrawn",
      );
    if (hasGames)
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.HasGames",
      );
    return this.#with({ archived: true });
  }

  /** The player, no longer archived. */
  restore(): CompetitionPlayer {
    if (!this.#archived) return this;
    return this.#with({ archived: false });
  }

  equals(other: CompetitionPlayer | undefined): boolean {
    return other instanceof CompetitionPlayer && this.#id.equals(other.#id);
  }

  toString(): string {
    return String(this.#id);
  }

  #refuseIfArchived(): void {
    if (this.#archived)
      throw new ValidationError<CompetitionPlayerErrorCode>(
        "CompetitionPlayer.Archived",
      );
  }

  #with(changed: {
    readonly withdrawn?: boolean;
    readonly archived?: boolean;
  }): CompetitionPlayer {
    return new CompetitionPlayer(
      this.#id,
      this.#tournamentPlayerId,
      this.#order,
      changed.withdrawn ?? this.#withdrawn,
      changed.archived ?? this.#archived,
    );
  }
}
