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
  | "TournamentFilter.SportNotOffered"
  | "TournamentFilter.FirstDayWithoutLastDay"
  | "TournamentFilter.LastDayWithoutFirstDay"
  | "TournamentFilter.FirstDayAfterLastDay"
  | "TournamentFilter.DayNotADay";

/** What a reader chose: each of the three, or nothing where they chose none. */
export interface Chosen {
  readonly country?: Country | undefined;
  /** The region's code, taken as a region's code is. */
  readonly region?: string | undefined;
  /** The sport's code, exactly as it is written. */
  readonly sport?: string | undefined;
  /** The first day, written `2026-03-01`. Chosen only with the last. */
  readonly firstDay?: string | undefined;
  /** The last day, written `2026-03-31`. Chosen only with the first. */
  readonly lastDay?: string | undefined;
}

const refuse = (code: TournamentFilterErrorCode): never => {
  throw new ValidationError<TournamentFilterErrorCode>(code);
};

// Read back from the date it makes, so that a day the calendar has not got,
// such as the thirtieth of February, is refused rather than carried over into
// March as `Date` would.
const dayOf = (written: string): string => {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(written)
    ? new Date(`${written}T00:00:00Z`)
    : undefined;
  if (parsed === undefined || Number.isNaN(parsed.getTime()))
    return refuse("TournamentFilter.DayNotADay");
  return parsed.toISOString().slice(0, 10) === written
    ? written
    : refuse("TournamentFilter.DayNotADay");
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
  readonly #firstDay: string | undefined;
  readonly #lastDay: string | undefined;

  private constructor(
    country: Country | undefined,
    region: Region | undefined,
    sport: Sport | undefined,
    firstDay: string | undefined,
    lastDay: string | undefined,
  ) {
    this.#country = country;
    this.#region = region;
    this.#sport = sport;
    this.#firstDay = firstDay;
    this.#lastDay = lastDay;
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
    // Together or not at all: a half-filled pair is more likely a slip than a
    // range with one end open, which the pages' fields do not offer.
    if (chosen.firstDay !== undefined && chosen.lastDay === undefined)
      refuse("TournamentFilter.FirstDayWithoutLastDay");
    if (chosen.lastDay !== undefined && chosen.firstDay === undefined)
      refuse("TournamentFilter.LastDayWithoutFirstDay");
    const firstDay =
      chosen.firstDay === undefined ? undefined : dayOf(chosen.firstDay);
    const lastDay =
      chosen.lastDay === undefined ? undefined : dayOf(chosen.lastDay);
    // Written year first, so that comparing the words compares the days.
    if (firstDay !== undefined && lastDay !== undefined && firstDay > lastDay)
      refuse("TournamentFilter.FirstDayAfterLastDay");
    return new TournamentFilter(country, region, sport, firstDay, lastDay);
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

  /** The first day filtered by, or nothing where no days were chosen. */
  get firstDay(): string | undefined {
    return this.#firstDay;
  }

  /** The last day filtered by, or nothing where no days were chosen. */
  get lastDay(): string | undefined {
    return this.#lastDay;
  }
}
