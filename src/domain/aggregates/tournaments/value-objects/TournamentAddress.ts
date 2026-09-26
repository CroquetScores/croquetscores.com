import type { ReadOnlyDate } from "../../../common/ReadOnlyDate.js";
import { Slug } from "../../../common/Slug.js";
import { Validator } from "../../../common/validation/Validator.js";
import { Sport } from "./Sport.js";

/** Every rule a tournament address can break. */
export type TournamentAddressErrorCode =
  | "TournamentAddress.Missing"
  | "TournamentAddress.Malformed"
  | "TournamentAddress.YearOutOfRange";

const EARLIEST_YEAR = 1000;
const LATEST_YEAR = 9999;

// Four digits, the first of them not a nought, since only a year written that
// way is one making an address would have given.
const FOUR_DIGITS = /^[1-9]\d{3}$/;

const years = new Validator<number, TournamentAddressErrorCode>({
  fields: [
    {
      field: "year",
      code: "TournamentAddress.YearOutOfRange",
      isBrokenBy: (year) =>
        !Number.isSafeInteger(year) ||
        year < EARLIEST_YEAR ||
        year > LATEST_YEAR,
    },
  ],
});

// Only the shape of the writing is asked here. Whether its sport and its slug
// are one is the sport's and the slug's to say, so that each is refused as it
// would be on its own.
const writings = new Validator<string, TournamentAddressErrorCode>({
  fields: [
    {
      field: "written",
      code: "TournamentAddress.Missing",
      isBrokenBy: (written) => written === "",
    },
    {
      field: "written",
      code: "TournamentAddress.Malformed",
      isBrokenBy: (written) => {
        if (written === "") return false;
        const parts = written.split("/");
        return parts.length !== 3 || !FOUR_DIGITS.test(parts[0] ?? "");
      },
    },
  ],
});

/**
 * Where a tournament is found: the year it starts, the code of its sport and a
 * slug of its name, as "2026/ac/spring-open".
 *
 * Whether an address is taken is not the address's to know, since it does not
 * know what else there is. The tournament asks.
 */
export class TournamentAddress {
  readonly #year: number;
  readonly #sport: Sport;
  readonly #slug: Slug;

  private constructor(year: number, sport: Sport, slug: Slug) {
    this.#year = year;
    this.#sport = sport;
    this.#slug = slug;
  }

  /**
   * The address of a tournament starting in `year`, played in `sport` and
   * named by `slug`. Throws {@link ValidationError} when the year is not
   * written in four digits.
   */
  static from(year: number, sport: Sport, slug: Slug): TournamentAddress {
    years.ensureValid(year);
    return new TournamentAddress(year, sport, slug);
  }

  /**
   * The year in the address of a tournament that starts at `starts`: the year
   * it starts as it is written in UTC, so that the same tournament is found at
   * the same address wherever it was created from. Said here, once, since
   * whatever finds which addresses are taken asks it too.
   */
  static yearOf(starts: ReadOnlyDate): number {
    return starts.toDate().getUTCFullYear();
  }

  /**
   * The address written as `written`, as it was kept. Throws
   * {@link ValidationError} naming the first rule it breaks, or the first its
   * sport or its slug breaks.
   */
  static read(written: string): TournamentAddress {
    writings.ensureValid(written);
    const [year = "", sport = "", slug = ""] = written.split("/");
    return TournamentAddress.from(
      Number(year),
      Sport.from(sport),
      Slug.from(slug),
    );
  }

  get year(): number {
    return this.#year;
  }

  get sport(): Sport {
    return this.#sport;
  }

  get slug(): Slug {
    return this.#slug;
  }

  equals(other: TournamentAddress | undefined): boolean {
    return (
      other instanceof TournamentAddress && this.toString() === other.toString()
    );
  }

  toString(): string {
    return `${this.#year}/${this.#sport.code}/${this.#slug.toString()}`;
  }
}
