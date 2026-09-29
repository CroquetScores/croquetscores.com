import { Validator } from "../../common/validation/Validator.js";
import { ValidationError } from "../../common/validation/ValidationError.js";
import { PersonName } from "../accounts/value-objects/PersonName.js";
import type { TournamentPlayerId } from "./primitives/TournamentPlayerId.js";
import type { Flag } from "./value-objects/Flag.js";
import { Flags } from "./value-objects/Flags.js";

/** Every rule a player can break, besides those of a person's name. */
export type TournamentPlayerErrorCode =
  | "TournamentPlayer.NoSuchFlag"
  | "TournamentPlayer.OrderNotWhole"
  | "TournamentPlayer.OrderTooSmall"
  | "TournamentPlayer.HasGames"
  | "TournamentPlayer.Archived";

// A whole number the platform holds exactly. One beyond that is not reliably
// the number it was given, so two orders could be told apart by nothing.
const orders = new Validator<number, TournamentPlayerErrorCode>({
  fields: [
    {
      field: "order",
      code: "TournamentPlayer.OrderNotWhole",
      isBrokenBy: (order) => !Number.isSafeInteger(order),
    },
    {
      field: "order",
      code: "TournamentPlayer.OrderTooSmall",
      isBrokenBy: (order) => order < 1,
    },
  ],
});

/** What a player is, as it is given, before anything is asked of it. */
export interface TournamentPlayerDetails {
  readonly name: string;
  /** The club, region or country they play for, if any. */
  readonly representing?: string | undefined;
  /** The name of the flag they fly, if any. */
  readonly flag?: string | undefined;
}

/**
 * A player in a tournament, and in that tournament alone: the same person in
 * another tournament is another player, since what they are called, what they
 * play for and which flag they fly can differ between the two.
 *
 * A player has an order, which is where they come when the tournament lists
 * its players, lowest first. How the orders are given is the tournament's to
 * say, since it is the one that knows every player's.
 *
 * A player is never altered: updating, giving a new order, archiving and
 * restoring each give the player as they are afterwards, and leave the one asked unchanged. Asking for
 * what a player already is gives them back as they are, since a form sent
 * twice is not a mistake worth refusing.
 *
 * Two players are the same player when their ids are, whatever else differs,
 * since a player whose name is corrected is still the player who played.
 */
export class TournamentPlayer {
  readonly #id: TournamentPlayerId;
  readonly #name: PersonName;
  readonly #representing: string | undefined;
  readonly #flag: Flag | undefined;
  readonly #order: number;
  readonly #archived: boolean;

  private constructor(
    id: TournamentPlayerId,
    name: PersonName,
    representing: string | undefined,
    flag: Flag | undefined,
    order: number,
    archived: boolean,
  ) {
    this.#id = id;
    this.#name = name;
    this.#representing = representing;
    this.#flag = flag;
    this.#order = order;
    this.#archived = archived;
  }

  /**
   * The new player known by `id` that `details` describe, in `order`, not
   * archived. Throws {@link ValidationError} naming the first rule broken: the
   * name first, then the flag, then the order.
   */
  static from(
    id: TournamentPlayerId,
    details: TournamentPlayerDetails,
    order: number,
  ): TournamentPlayer {
    return TournamentPlayer.#made(id, details, order, false);
  }

  /**
   * Throws {@link ValidationError} naming the first rule `details` break, as
   * making a player of them would, for whatever asks before the tournament
   * has said where the player comes.
   */
  static ensureValid(details: TournamentPlayerDetails): void {
    TournamentPlayer.#detailsOf(details);
  }

  static #made(
    id: TournamentPlayerId,
    details: TournamentPlayerDetails,
    order: number,
    archived: boolean,
  ): TournamentPlayer {
    const { name, representing, flag } = TournamentPlayer.#detailsOf(details);
    orders.ensureValid(order);
    return new TournamentPlayer(id, name, representing, flag, order, archived);
  }

  static #detailsOf(details: TournamentPlayerDetails): {
    readonly name: PersonName;
    readonly representing: string | undefined;
    readonly flag: Flag | undefined;
  } {
    return {
      name: PersonName.from(details.name),
      // What is nothing but whitespace was left blank by whoever typed it, so
      // it is nothing represented rather than something called nothing.
      representing: details.representing?.trim() || undefined,
      flag: TournamentPlayer.#flagNamed(details.flag),
    };
  }

  // Refused rather than kept as a name: a flag that is none of the flags there
  // are has no image, and would be a flag nobody could see.
  static #flagNamed(name: string | undefined): Flag | undefined {
    if (name === undefined) return undefined;
    const flag = Flags.thereAre.find(name);
    if (flag === undefined)
      throw new ValidationError<TournamentPlayerErrorCode>(
        "TournamentPlayer.NoSuchFlag",
      );
    return flag;
  }

  get id(): TournamentPlayerId {
    return this.#id;
  }

  get name(): PersonName {
    return this.#name;
  }

  /** The club, region or country they play for, or nothing. */
  get representing(): string | undefined {
    return this.#representing;
  }

  /** The flag shown beside their name, or nothing. */
  get flag(): Flag | undefined {
    return this.#flag;
  }

  /** Where the player comes when the tournament lists them, lowest first. */
  get order(): number {
    return this.#order;
  }

  get archived(): boolean {
    return this.#archived;
  }

  /**
   * The same player, as `details` describe them: everything said again, and
   * each asked what it is asked of a new player. Throws
   * {@link ValidationError} as `TournamentPlayer.Archived` for an archived
   * player, and otherwise naming the first rule the details break.
   */
  update(details: TournamentPlayerDetails): TournamentPlayer {
    if (this.#archived)
      throw new ValidationError<TournamentPlayerErrorCode>(
        "TournamentPlayer.Archived",
      );
    return TournamentPlayer.#made(this.#id, details, this.#order, false);
  }

  /**
   * The player, given `order`, which is the tournament's to work out: where a
   * player moved or archived now comes. Throws {@link ValidationError} naming
   * the first rule the order breaks.
   */
  withOrder(order: number): TournamentPlayer {
    orders.ensureValid(order);
    return this.#with({ order });
  }

  /**
   * Throws {@link ValidationError} where the player cannot be moved: as
   * `TournamentPlayer.Archived` for an archived player, who can only be
   * restored.
   */
  ensureMovable(): void {
    if (this.#archived)
      throw new ValidationError<TournamentPlayerErrorCode>(
        "TournamentPlayer.Archived",
      );
  }

  /**
   * The player, archived. Whether they have games is the tournament's to
   * know, so it says. Throws {@link ValidationError} as
   * `TournamentPlayer.HasGames` for one with games, since the games would then
   * be against somebody who is no longer there.
   */
  archive({ hasGames }: { readonly hasGames: boolean }): TournamentPlayer {
    if (this.#archived) return this;
    if (hasGames)
      throw new ValidationError<TournamentPlayerErrorCode>(
        "TournamentPlayer.HasGames",
      );
    return this.#with({ archived: true });
  }

  /** The player, no longer archived. */
  restore(): TournamentPlayer {
    if (!this.#archived) return this;
    return this.#with({ archived: false });
  }

  equals(other: TournamentPlayer | undefined): boolean {
    return other instanceof TournamentPlayer && this.#id.equals(other.#id);
  }

  toString(): string {
    return String(this.#name);
  }

  #with(changed: {
    readonly archived?: boolean;
    readonly order?: number;
  }): TournamentPlayer {
    return new TournamentPlayer(
      this.#id,
      this.#name,
      this.#representing,
      this.#flag,
      changed.order ?? this.#order,
      changed.archived ?? this.#archived,
    );
  }
}
