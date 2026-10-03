import type { Website } from "../../../common/Website.js";
import { ValidationError } from "../../../common/validation/ValidationError.js";
import type { Country } from "./Country.js";
import type { Region } from "./Region.js";
import { Sport } from "./Sport.js";
import { sportsOffered } from "./sports.js";

/** Every rule a filter can break, besides those of its sport. */
export type TournamentFilterErrorCode =
  | "TournamentFilter.RegionWithoutCountry"
  | "TournamentFilter.RegionNotInCountry"
  | "TournamentFilter.SportNotOffered";

/** What a reader chose: each of the three, or nothing where they chose none. */
export interface Chosen {
  readonly country?: Country | undefined;
  /** The region's code, taken as a region's code is. */
  readonly region?: string | undefined;
  /** The sport's code, exactly as it is written. */
  readonly sport?: string | undefined;
}

const refuse = (code: TournamentFilterErrorCode): never => {
  throw new ValidationError<TournamentFilterErrorCode>(code);
};

/**
 * Which of a website's tournaments a reader asks to see: those in a country,
 * in a region of it, and for a sport, each of the three narrowing only where it
 * was chosen.
 *
 * Held to what a tournament is held to when it is created, since a filter no
 * tournament could match is a mistake in whatever asked for it rather than a
 * question whose answer is nothing.
 */
export class TournamentFilter {
  readonly #country: Country | undefined;
  readonly #region: Region | undefined;
  readonly #sport: Sport | undefined;

  private constructor(
    country: Country | undefined,
    region: Region | undefined,
    sport: Sport | undefined,
  ) {
    this.#country = country;
    this.#region = region;
    this.#sport = sport;
  }

  /**
   * The filter of what was `chosen` on `website`. Throws
   * {@link ValidationError} naming the first rule it breaks.
   */
  static from(website: Website, chosen: Chosen = {}): TournamentFilter {
    const { country } = chosen;
    let region: Region | undefined;
    if (chosen.region !== undefined) {
      // A region is only a region of some country, and two countries can each
      // have one with the same code, so a code alone says nothing.
      if (country === undefined)
        refuse("TournamentFilter.RegionWithoutCountry");
      region =
        country?.findRegion(chosen.region) ??
        refuse("TournamentFilter.RegionNotInCountry");
    }
    let sport: Sport | undefined;
    if (chosen.sport !== undefined) {
      const named = Sport.from(chosen.sport);
      if (!sportsOffered[website.site].some((offered) => offered.equals(named)))
        refuse("TournamentFilter.SportNotOffered");
      sport = named;
    }
    return new TournamentFilter(country, region, sport);
  }

  /** The country filtered by, or nothing where none was chosen. */
  get country(): Country | undefined {
    return this.#country;
  }

  /** The region of that country filtered by, or nothing where none was. */
  get region(): Region | undefined {
    return this.#region;
  }

  /** The sport filtered by, or nothing where none was chosen. */
  get sport(): Sport | undefined {
    return this.#sport;
  }
}
