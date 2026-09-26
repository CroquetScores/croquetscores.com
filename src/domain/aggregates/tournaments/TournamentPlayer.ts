import { ValidationError } from "../../common/validation/ValidationError.js";
import { PersonName } from "../accounts/value-objects/PersonName.js";
import type { TournamentPlayerId } from "./primitives/TournamentPlayerId.js";
import type { Flag } from "./value-objects/Flag.js";
import { Flags } from "./value-objects/Flags.js";

/** Every rule a player can break, besides those of a person's name. */
export type TournamentPlayerErrorCode =
  | "TournamentPlayer.NoSuchFlag"
  | "TournamentPlayer.HasGames"
  | "TournamentPlayer.Archived";

/** What a player is, as it is given, before anything is asked of it. */
export interface TournamentPlayerDetails {
  readonly name: string;
  /** The club, region or country they play for, if any. */
  readonly represents?: string | undefined;
  /** The name of the flag they fly, if any. */
  readonly flag?: string | undefined;
}

/**
 * A player in a tournament, and in that tournament alone: the same person in
 * another tournament is another player, since what they are called, what they
 * play for and which flag they fly can differ between the two.
 *
 * A player is never altered: updating, archiving and restoring each give the
 * player as they are afterwards, and leave the one asked unchanged. Asking for
 * what a player already is gives them back as they are, since a form sent
 * twice is not a mistake worth refusing.
 *
 * Two players are the same player when their ids are, whatever else differs,
 * since a player whose name is corrected is still the player who played.
 */
export class TournamentPlayer {
  readonly #id: TournamentPlayerId;
  readonly #name: PersonName;
  readonly #represents: string | undefined;
  readonly #flag: Flag | undefined;
  readonly #archived: boolean;

  private constructor(
    id: TournamentPlayerId,
    name: PersonName,
    represents: string | undefined,
    flag: Flag | undefined,
    archived: boolean,
  ) {
    this.#id = id;
    this.#name = name;
    this.#represents = represents;
    this.#flag = flag;
    this.#archived = archived;
  }

  /**
   * The new player known by `id` that `details` describe, not archived. Throws
   * {@link ValidationError} naming the first rule the details break: the name
   * first, then the flag.
   */
  static from(
    id: TournamentPlayerId,
    details: TournamentPlayerDetails,
  ): TournamentPlayer {
    return TournamentPlayer.#made(id, details, false);
  }

  static #made(
    id: TournamentPlayerId,
    details: TournamentPlayerDetails,
    archived: boolean,
  ): TournamentPlayer {
    const name = PersonName.from(details.name);
    // What is nothing but whitespace was left blank by whoever typed it, so it
    // is nothing represented rather than something called nothing.
    const represents = details.represents?.trim() || undefined;
    return new TournamentPlayer(
      id,
      name,
      represents,
      TournamentPlayer.#flagNamed(details.flag),
      archived,
    );
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
  get represents(): string | undefined {
    return this.#represents;
  }

  /** The flag shown beside their name, or nothing. */
  get flag(): Flag | undefined {
    return this.#flag;
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
    return TournamentPlayer.#made(this.#id, details, false);
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
    return this.#withArchived(true);
  }

  /** The player, no longer archived. */
  restore(): TournamentPlayer {
    if (!this.#archived) return this;
    return this.#withArchived(false);
  }

  equals(other: TournamentPlayer | undefined): boolean {
    return other instanceof TournamentPlayer && this.#id.equals(other.#id);
  }

  toString(): string {
    return String(this.#name);
  }

  #withArchived(archived: boolean): TournamentPlayer {
    return new TournamentPlayer(
      this.#id,
      this.#name,
      this.#represents,
      this.#flag,
      archived,
    );
  }
}
