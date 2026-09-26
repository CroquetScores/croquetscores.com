import { Validator } from "../../../common/validation/Validator.js";
import { BestOf } from "./BestOf.js";

/** Every rule the shape of a knockout's draw can break. */
export type KnockoutDrawErrorCode =
  | "KnockoutDraw.TooFewPlaces"
  | "KnockoutDraw.PlacesDoNotHalve"
  | "KnockoutDraw.WrongNumberOfRounds"
  | "KnockoutDraw.EvenBestOf";

interface Candidate {
  readonly places: number;
  readonly rounds: readonly BestOf[];
}

const FEWEST_PLACES = 2;

// A number halves exactly down to one when it is a power of two, which is
// when it has a single bit set.
const halvesDownToOne = (places: number): boolean =>
  Number.isSafeInteger(places) && places > 0 && (places & (places - 1)) === 0;

const roundsFor = (places: number): number => Math.log2(places);

const draws = new Validator<Candidate, KnockoutDrawErrorCode>({
  fields: [
    {
      field: "places",
      code: "KnockoutDraw.TooFewPlaces",
      isBrokenBy: ({ places }) => places < FEWEST_PLACES,
    },
    {
      field: "places",
      code: "KnockoutDraw.PlacesDoNotHalve",
      isBrokenBy: ({ places }) =>
        places >= FEWEST_PLACES && !halvesDownToOne(places),
    },
    {
      field: "rounds",
      code: "KnockoutDraw.EvenBestOf",
      isBrokenBy: ({ rounds }) => rounds.some((round) => !round.isOdd),
    },
  ],
  spanning: [
    {
      reads: ["places", "rounds"],
      code: "KnockoutDraw.WrongNumberOfRounds",
      isBrokenBy: ({ places, rounds }) => rounds.length !== roundsFor(places),
    },
  ],
});

/**
 * The shape of a knockout's draw: how many places it has, and what each of
 * its rounds is the best of, the first round first. Which player is in which
 * place, and where the byes go, are the draw's own and not its shape's.
 */
export class KnockoutDraw {
  readonly #places: number;
  readonly #rounds: readonly BestOf[];

  private constructor(places: number, rounds: readonly BestOf[]) {
    this.#places = places;
    this.#rounds = rounds;
  }

  /**
   * A draw of `places` places whose rounds are the best of `rounds`, the first
   * round first. Throws {@link ValidationError} naming the first rule it
   * breaks, or the first a round's best-of breaks.
   */
  static from(places: number, rounds: readonly number[]): KnockoutDraw {
    // Each best-of is made first, so that one that could not be a best-of is
    // refused as a best-of is, whatever else is wrong with the draw.
    const candidate = {
      places,
      rounds: Object.freeze(rounds.map((games) => BestOf.from(games))),
    };
    draws.ensureValid(candidate);
    return new KnockoutDraw(candidate.places, candidate.rounds);
  }

  get places(): number {
    return this.#places;
  }

  /** What each round is the best of, the first round first. */
  get rounds(): readonly BestOf[] {
    return this.#rounds;
  }

  equals(other: KnockoutDraw | undefined): boolean {
    return (
      other instanceof KnockoutDraw &&
      this.#places === other.#places &&
      this.#rounds.length === other.#rounds.length &&
      this.#rounds.every((round, at) => round.equals(other.#rounds[at]))
    );
  }

  toString(): string {
    return `${this.#places} places`;
  }
}
