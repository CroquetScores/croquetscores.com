import type { Slug } from "../../common/Slug.js";
import { Validator } from "../../common/validation/Validator.js";
import { ValidationError } from "../../common/validation/ValidationError.js";
import { PersonName } from "../accounts/value-objects/PersonName.js";
import type { TeamPlayerId } from "./primitives/TeamPlayerId.js";
import { WorldRankingName } from "./value-objects/WorldRankingName.js";

/** Every rule a player in a team can break, besides those of a person's name. */
export type TeamPlayerErrorCode =
  | "TeamPlayer.OrderNotWhole"
  | "TeamPlayer.OrderTooSmall"
  | "TeamPlayer.HasGames"
  | "TeamPlayer.Archived"
  | "TeamPlayer.NamedBye";

// A whole number the platform holds exactly, as a tournament player's order is.
const orders = new Validator<number, TeamPlayerErrorCode>({
  fields: [
    {
      field: "order",
      code: "TeamPlayer.OrderNotWhole",
      isBrokenBy: (order) => !Number.isSafeInteger(order),
    },
    {
      field: "order",
      code: "TeamPlayer.OrderTooSmall",
      isBrokenBy: (order) => order < 1,
    },
  ],
});

// What a player is called, in the tournament and in the world rankings.
interface Named {
  readonly name: PersonName;
  readonly worldRankingName: WorldRankingName | undefined;
}

/** What a player in a team is, as it is given, before anything is asked of it. */
export interface TeamPlayerDetails {
  readonly name: string;
  /**
   * The name the world rankings know them by, if any: nothing, or blank, for
   * none (WorldRankingName.feature).
   */
  readonly worldRankingName?: string | undefined;
}

/**
 * A player in one team of a tournament played by teams, and in that team
 * alone. They have a name, and may have a name the world rankings know them
 * by, and nothing else of their own: the team they play
 * for is what they represent, and the team flies the flag.
 *
 * A player has an order, which is where they come when the team lists its
 * players, lowest first, and a slug, which finds them within the tournament;
 * both are the tournament's to give, since it is the one that knows every
 * team's players. A player keeps their slug whatever else changes, so that a
 * link to them still finds them. A player is never
 * altered: updating, giving a new order, archiving and restoring each give the
 * player as they are afterwards, and asking for what they already are gives
 * them back as they are.
 *
 * Two players are the same player when their ids are, whatever they are
 * called.
 */
export class TeamPlayer {
  readonly #id: TeamPlayerId;
  readonly #name: PersonName;
  readonly #worldRankingName: WorldRankingName | undefined;
  readonly #slug: Slug;
  readonly #order: number;
  readonly #archived: boolean;

  private constructor(
    id: TeamPlayerId,
    { name, worldRankingName }: Named,
    slug: Slug,
    order: number,
    archived: boolean,
  ) {
    this.#id = id;
    this.#name = name;
    this.#worldRankingName = worldRankingName;
    this.#slug = slug;
    this.#order = order;
    this.#archived = archived;
  }

  /**
   * The new player known by `id` that `details` describe, found at `slug` and
   * in `order`, not archived. Throws {@link ValidationError} naming the first
   * rule broken: the name first, then the world ranking name, then the order.
   */
  static from(
    id: TeamPlayerId,
    details: TeamPlayerDetails,
    { slug, order }: { readonly slug: Slug; readonly order: number },
  ): TeamPlayer {
    const named = TeamPlayer.#namedOf(details);
    orders.ensureValid(order);
    return new TeamPlayer(id, named, slug, order, false);
  }

  /**
   * Throws {@link ValidationError} naming the first rule `details` break, as
   * making a player of them would, for whatever asks before the tournament
   * has said where the player comes.
   */
  static ensureValid(details: TeamPlayerDetails): void {
    TeamPlayer.#namedOf(details);
  }

  // A test has no byes, but a score against "Bye" reads as a match nobody
  // played, and a player is never a bye in one kind of tournament and a name
  // in another. The word ends where anything but a letter comes, as it does
  // for a tournament's player, so "Bye 2" is a bye and "Byers" is a name.
  static #namedOf(details: TeamPlayerDetails): Named {
    const name = PersonName.from(details.name);
    if (/^bye(?!\p{L})/iu.test(details.name.trim())) {
      throw new ValidationError<TeamPlayerErrorCode>("TeamPlayer.NamedBye");
    }
    return {
      name,
      worldRankingName: WorldRankingName.from(details.worldRankingName ?? ""),
    };
  }

  get id(): TeamPlayerId {
    return this.#id;
  }

  get name(): PersonName {
    return this.#name;
  }

  /** The name the world rankings know them by, or nothing where none was given. */
  get worldRankingName(): WorldRankingName | undefined {
    return this.#worldRankingName;
  }

  /** What finds the player within the tournament. */
  get slug(): Slug {
    return this.#slug;
  }

  /** Where the player comes when the team lists its players, lowest first. */
  get order(): number {
    return this.#order;
  }

  get archived(): boolean {
    return this.#archived;
  }

  /**
   * The same player, as `details` describe them, asked what a new player is
   * asked. Throws {@link ValidationError} as `TeamPlayer.Archived` for an
   * archived player, and otherwise naming the first rule the details break.
   */
  update(details: TeamPlayerDetails): TeamPlayer {
    if (this.#archived) {
      throw new ValidationError<TeamPlayerErrorCode>("TeamPlayer.Archived");
    }
    return new TeamPlayer(
      this.#id,
      TeamPlayer.#namedOf(details),
      this.#slug,
      this.#order,
      false,
    );
  }

  /**
   * The player, given `order`, which is the tournament's to work out. Throws
   * {@link ValidationError} naming the first rule the order breaks.
   */
  withOrder(order: number): TeamPlayer {
    orders.ensureValid(order);
    return new TeamPlayer(
      this.#id,
      this.#named,
      this.#slug,
      order,
      this.#archived,
    );
  }

  /**
   * Throws {@link ValidationError} as `TeamPlayer.Archived` where the player
   * is archived, and can only be restored: for whatever would play them or
   * move them.
   */
  ensureInUse(): void {
    if (this.#archived) {
      throw new ValidationError<TeamPlayerErrorCode>("TeamPlayer.Archived");
    }
  }

  /**
   * The player, archived. Whether they have games is not theirs to know, so
   * whatever asks says. Throws {@link ValidationError} as
   * `TeamPlayer.HasGames` for one with games, since the games would then be
   * against somebody who is no longer there.
   */
  archive({ hasGames }: { readonly hasGames: boolean }): TeamPlayer {
    if (this.#archived) return this;
    if (hasGames) {
      throw new ValidationError<TeamPlayerErrorCode>("TeamPlayer.HasGames");
    }
    return new TeamPlayer(this.#id, this.#named, this.#slug, this.#order, true);
  }

  /** The player, no longer archived. */
  restore(): TeamPlayer {
    if (!this.#archived) return this;
    return new TeamPlayer(
      this.#id,
      this.#named,
      this.#slug,
      this.#order,
      false,
    );
  }

  get #named(): Named {
    return { name: this.#name, worldRankingName: this.#worldRankingName };
  }

  equals(other: TeamPlayer | undefined): boolean {
    return other instanceof TeamPlayer && this.#id.equals(other.#id);
  }

  toString(): string {
    return String(this.#name);
  }
}
