import type { Slug } from "../../common/Slug.js";
import { Validator } from "../../common/validation/Validator.js";
import { ValidationError } from "../../common/validation/ValidationError.js";
import type { TeamId } from "./primitives/TeamId.js";
import type { TeamPlayer } from "./TeamPlayer.js";
import type { Flag } from "./value-objects/Flag.js";
import { Flags } from "./value-objects/Flags.js";
import { TeamName } from "./value-objects/TeamName.js";
import { TeamShortName } from "./value-objects/TeamShortName.js";

/** Every rule a team can break, besides those of its name and short name. */
export type TeamErrorCode =
  | "Team.NoSuchFlag"
  | "Team.ShortNameLongerThanName"
  | "Team.OrderNotWhole"
  | "Team.OrderTooSmall"
  | "Team.Archived"
  | "Team.InATest";

// A whole number the platform holds exactly, as a player's order is.
const orders = new Validator<number, TeamErrorCode>({
  fields: [
    {
      field: "order",
      code: "Team.OrderNotWhole",
      isBrokenBy: (order) => !Number.isSafeInteger(order),
    },
    {
      field: "order",
      code: "Team.OrderTooSmall",
      isBrokenBy: (order) => order < 1,
    },
  ],
});

/** What a team is, as it is given, before anything is asked of it. */
export interface TeamDetails {
  readonly name: string;
  readonly shortName: string;
  /** The name of the flag it flies, if any. */
  readonly flag?: string | undefined;
}

const refuse = (code: TeamErrorCode): never => {
  throw new ValidationError<TeamErrorCode>(code);
};

/**
 * A team in a tournament played by teams, and in that tournament alone. It
 * has a name, a short name that its tests are called by, and may fly a flag,
 * and it keeps its own players.
 *
 * A team has an order, which is where it comes when the tournament lists its
 * teams, and a slug, which finds it within the tournament; both are the
 * tournament's to give, since it is the one that knows every team's.
 *
 * An archived team keeps everything it is, its players among them, and can
 * only be restored: it is not changed, nothing is done to its players, and it
 * is not moved. A team is never altered: each change gives the team as it is
 * afterwards, and asking for what it already is gives it back as it is. Two
 * teams are the same team when their ids are.
 */
export class Team {
  readonly #id: TeamId;
  readonly #name: TeamName;
  readonly #shortName: TeamShortName;
  readonly #flag: Flag | undefined;
  readonly #slug: Slug;
  readonly #order: number;
  readonly #archived: boolean;
  // By the written id. How they are listed is `players`.
  readonly #players: ReadonlyMap<string, TeamPlayer>;

  private constructor(
    id: TeamId,
    named: {
      readonly name: TeamName;
      readonly shortName: TeamShortName;
      readonly flag: Flag | undefined;
    },
    slug: Slug,
    order: number,
    archived: boolean,
    players: ReadonlyMap<string, TeamPlayer>,
  ) {
    this.#id = id;
    this.#name = named.name;
    this.#shortName = named.shortName;
    this.#flag = named.flag;
    this.#slug = slug;
    this.#order = order;
    this.#archived = archived;
    this.#players = players;
  }

  /**
   * The new team known by `id` that `details` describe, found at `slug` and
   * in `order`, not archived and with no players. Throws
   * {@link ValidationError} naming the first rule broken: the name, the short
   * name, the two together, the flag, then the order.
   */
  static from(
    id: TeamId,
    details: TeamDetails,
    { slug, order }: { readonly slug: Slug; readonly order: number },
  ): Team {
    const named = Team.#namedFrom(details);
    orders.ensureValid(order);
    return new Team(id, named, slug, order, false, new Map());
  }

  /**
   * Throws {@link ValidationError} naming the first rule `details` break, as
   * making a team of them would, for whatever asks before the tournament has
   * said where the team comes.
   */
  static ensureValid(details: TeamDetails): void {
    Team.#namedFrom(details);
  }

  static #namedFrom(details: TeamDetails): {
    readonly name: TeamName;
    readonly shortName: TeamShortName;
    readonly flag: Flag | undefined;
  } {
    const name = TeamName.from(details.name);
    const shortName = TeamShortName.from(details.shortName);
    // A short name longer than the name it shortens is the two typed the
    // wrong way round. One as long is a name that is short already.
    if (shortName.length > name.length) refuse("Team.ShortNameLongerThanName");
    return { name, shortName, flag: Team.#flagNamed(details.flag) };
  }

  // Refused rather than kept as a name, as a player's is: a flag that is none
  // of the flags there are would be a flag nobody could see.
  static #flagNamed(name: string | undefined): Flag | undefined {
    if (name === undefined) return undefined;
    return Flags.thereAre.find(name) ?? refuse("Team.NoSuchFlag");
  }

  get id(): TeamId {
    return this.#id;
  }

  get name(): TeamName {
    return this.#name;
  }

  get shortName(): TeamShortName {
    return this.#shortName;
  }

  /** The flag shown beside its name, or nothing. */
  get flag(): Flag | undefined {
    return this.#flag;
  }

  /** The part of the tournament's address that finds the team. */
  get slug(): Slug {
    return this.#slug;
  }

  /** Where the team comes when the tournament lists its teams, lowest first. */
  get order(): number {
    return this.#order;
  }

  get archived(): boolean {
    return this.#archived;
  }

  /**
   * Its players, lowest order first, the archived after all the others
   * whatever their order, as a tournament lists its own.
   */
  get players(): readonly TeamPlayer[] {
    const byOrder = this.playersByOrder;
    return [
      ...byOrder.filter(({ archived }) => !archived),
      ...byOrder.filter(({ archived }) => archived),
    ];
  }

  /**
   * Every player lowest order first, archived or not: the order that room to
   * move into and spacing out are reckoned in, since an archived player's
   * order still counts.
   */
  get playersByOrder(): TeamPlayer[] {
    return [...this.#players.values()].sort(
      (one, other) => one.order - other.order,
    );
  }

  /** The player `written`, or nothing where the team has no such player. */
  playerWritten(written: string): TeamPlayer | undefined {
    return this.#players.get(written);
  }

  /**
   * The same team, as `details` describe it, keeping its id, its slug, its
   * order and its players. Throws {@link ValidationError} as `Team.Archived`
   * for an archived team, and otherwise naming the first rule the details
   * break.
   */
  update(details: TeamDetails): Team {
    this.ensureInUse();
    return new Team(
      this.#id,
      Team.#namedFrom(details),
      this.#slug,
      this.#order,
      false,
      this.#players,
    );
  }

  /**
   * The team, given `order`, which is the tournament's to work out. Throws
   * {@link ValidationError} naming the first rule the order breaks.
   */
  withOrder(order: number): Team {
    orders.ensureValid(order);
    return this.#with({ order });
  }

  /** The team with `player` among its players, in the place of the one they were. */
  withPlayer(player: TeamPlayer): Team {
    const players = new Map(this.#players);
    players.set(player.id.value, player);
    return this.#with({ players });
  }

  /**
   * Throws {@link ValidationError} as `Team.Archived` where the team cannot be
   * moved: an archived team can only be restored.
   */
  ensureMovable(): void {
    if (this.#archived) refuse("Team.Archived");
  }

  /**
   * Throws {@link ValidationError} as `Team.Archived` where the team is
   * archived and so can only be restored: its players are not added, changed,
   * put in order, archived or restored, and no test is played with it.
   */
  ensureInUse(): void {
    if (this.#archived) refuse("Team.Archived");
  }

  /**
   * The team, archived. Whether it plays in a test is the tournament's to
   * know, so it says. Throws {@link ValidationError} as `Team.InATest` for one
   * that does, since the test would then be against a team no longer there.
   */
  archive({ inATest }: { readonly inATest: boolean }): Team {
    if (this.#archived) return this;
    if (inATest) refuse("Team.InATest");
    return this.#with({ archived: true });
  }

  /** The team, no longer archived. */
  restore(): Team {
    if (!this.#archived) return this;
    return this.#with({ archived: false });
  }

  equals(other: Team | undefined): boolean {
    return other instanceof Team && this.#id.equals(other.#id);
  }

  toString(): string {
    return String(this.#name);
  }

  #with(changed: {
    readonly order?: number;
    readonly archived?: boolean;
    readonly players?: ReadonlyMap<string, TeamPlayer>;
  }): Team {
    return new Team(
      this.#id,
      { name: this.#name, shortName: this.#shortName, flag: this.#flag },
      this.#slug,
      changed.order ?? this.#order,
      changed.archived ?? this.#archived,
      changed.players ?? this.#players,
    );
  }
}
