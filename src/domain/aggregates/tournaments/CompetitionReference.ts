import { Slug } from "../../common/Slug.js";
import { orderRules } from "../../common/orders.js";
import type { CompetitionId } from "./primitives/CompetitionId.js";
import { CompetitionName } from "./value-objects/CompetitionName.js";

/** Every rule a reference can break, besides those of its name and slug. */
export type CompetitionReferenceErrorCode =
  "CompetitionReference.OrderNotWhole" | "CompetitionReference.OrderTooSmall";

const orders = orderRules<CompetitionReferenceErrorCode>(
  "CompetitionReference.OrderNotWhole",
  "CompetitionReference.OrderTooSmall",
);

/** What a reference is, as it is given, before anything is asked of it. */
export interface CompetitionReferenceDetails {
  readonly name: string;
  readonly slug: string;
  /** Where the competition comes when the tournament lists them, lowest first. */
  readonly order: number;
  /** Whether the competition is archived. Not saying is saying it is not. */
  readonly archived?: boolean | undefined;
}

/**
 * What a tournament knows of one of its competitions: enough to list them in
 * order and to link to each, without reading any of them.
 *
 * The slug is given rather than made from the name, because it is kept when
 * the name is corrected, and because making it unlike every other
 * competition's slug is the tournament's to do. How orders are spaced, and
 * what may be done to an archived competition, are the tournament's too.
 *
 * Two references are to the same competition when their ids are, whatever
 * else differs, since a competition whose name is corrected is still the one
 * whose games were played.
 */
export class CompetitionReference {
  readonly #id: CompetitionId;
  readonly #name: CompetitionName;
  readonly #slug: Slug;
  readonly #order: number;
  readonly #archived: boolean;

  private constructor(
    id: CompetitionId,
    name: CompetitionName,
    slug: Slug,
    order: number,
    archived: boolean,
  ) {
    this.#id = id;
    this.#name = name;
    this.#slug = slug;
    this.#order = order;
    this.#archived = archived;
  }

  /**
   * The reference to the competition known by `id` that `details` describe.
   * Throws {@link ValidationError} naming the first rule the details break:
   * the name first, then the slug, then the order.
   */
  static from(
    id: CompetitionId,
    details: CompetitionReferenceDetails,
  ): CompetitionReference {
    const name = CompetitionName.from(details.name);
    const slug = Slug.from(details.slug);
    orders.ensureValid(details.order);
    return new CompetitionReference(
      id,
      name,
      slug,
      details.order,
      details.archived ?? false,
    );
  }

  get id(): CompetitionId {
    return this.#id;
  }

  get name(): CompetitionName {
    return this.#name;
  }

  /** The part of the tournament's address that finds the competition. */
  get slug(): Slug {
    return this.#slug;
  }

  /** Where the competition comes when the tournament lists them, lowest first. */
  get order(): number {
    return this.#order;
  }

  get archived(): boolean {
    return this.#archived;
  }

  equals(other: CompetitionReference | undefined): boolean {
    return other instanceof CompetitionReference && this.#id.equals(other.#id);
  }

  toString(): string {
    return String(this.#name);
  }
}
